import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import _ from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDefinitionsParams,
  DefaultContractPositionDefinition,
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';
import { Network } from '~types/network.interface';

import { CreditManagerV2, GearboxContractFactory } from '../contracts';

const network = Network.ETHEREUM_MAINNET;

// @Register.ContractPositionFetcher({ appId, groupId, network })
@PositionTemplate()
export class EthereumGearboxCreditAccountsContractPositionFetcher extends ContractPositionTemplatePositionFetcher<CreditManagerV2> {
  constructor(
    @Inject(APP_TOOLKIT) readonly appToolkit: IAppToolkit,
    @Inject(GearboxContractFactory) private readonly gearboxContractFactory: GearboxContractFactory,
  ) {
    super(appToolkit);
  }

  groupLabel = 'Credit Account';

  getContract(address: string): CreditManagerV2 {
    return this.gearboxContractFactory.creditManagerV2({ address, network: this.network });
  }

  async getTokenDefinitions(
    params: GetTokenDefinitionsParams<CreditManagerV2, DefaultContractPositionDefinition>,
  ): Promise<UnderlyingTokenDefinition[] | null> {
    const contract = params.contract;
    const multicall = params.multicall;

    const underlying = await contract.underlying();
    const collateralTokensCount = await contract.collateralTokensCount();
    const collateralTokens = await Promise.all(
      _.range(collateralTokensCount.toNumber()).map(idx =>
        multicall
          .wrap(contract)
          .collateralTokens(idx)
          .then(([token, _]) => token),
      ),
    );

    return [
      {
        address: underlying,
        metaType: MetaType.BORROWED,
        network: this.network,
      },
      ...collateralTokens.map(token => ({
        address: token,
        metaType: MetaType.SUPPLIED,
        network: this.network,
      })),
    ];
  }

  async getLabel(
    params: GetDisplayPropsParams<CreditManagerV2, DefaultDataProps, DefaultContractPositionDefinition>,
  ): Promise<string> {
    return '';
  }

  async getDefinitions(params: GetDefinitionsParams): Promise<DefaultContractPositionDefinition[]> {
    const contractsRegister = this.gearboxContractFactory.contractsRegister({
      address: '0xa50d4e7d8946a7c90652339cdbd262c375d54d99',
      network: this.network,
    });

    const creditManagers = await contractsRegister.getCreditManagers();
    const creditManagerContracts = creditManagers.map(addr =>
      this.gearboxContractFactory.creditManagerV2({ address: addr, network }),
    );

    const multicall = params.multicall;
    const creditManagerVersions = await Promise.all(
      creditManagerContracts.map(contract => multicall.wrap(contract).version()),
    );

    // only v2 credit managers
    return creditManagers
      .filter((_, idx) => creditManagerVersions[idx].toNumber() === 2)
      .map((address, idx) => ({ address, contract: creditManagerContracts[idx] }));
  }

  async getTokenBalancesPerPosition({
    address,
    contractPosition,
    contract,
    multicall,
  }: GetTokenBalancesParams<CreditManagerV2, DefaultDataProps>): Promise<BigNumberish[]> {
    let creditAccountAddress = '';

    try {
      creditAccountAddress = await contract.getCreditAccountOrRevert(address);
    } catch (err) {
      return [];
    }

    const balances = await Promise.all(
      contractPosition.tokens.map(async token => {
        if (token.metaType === MetaType.BORROWED) {
          const debt = await contract.calcCreditAccountAccruedInterest(creditAccountAddress);
          return debt.borrowedAmountWithInterestAndFees;
        }

        const tokenContract = this.gearboxContractFactory.erc20({ address: token.address, network: this.network });
        return multicall.wrap(tokenContract).balanceOf(creditAccountAddress);
      }),
    );

    return balances;
  }
}
