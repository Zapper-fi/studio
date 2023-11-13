import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import _ from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
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

import { GearboxViemContractFactory } from '../contracts';
import { CreditManagerV2 } from '../contracts/viem';

export type GearboxCreditAccountsDefinition = {
  address: string;
  underlyingTokenAddress: string;
  collateralTokenAddresses: string[];
};

const ACCOUNT_FACTORY_ADDRESS = '0x444cd42baeddeb707eed823f7177b9abcc779c04';

@PositionTemplate()
export class EthereumGearboxCreditAccountsContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  CreditManagerV2,
  DefaultDataProps,
  GearboxCreditAccountsDefinition
> {
  groupLabel = 'Credit Account';

  constructor(
    @Inject(APP_TOOLKIT) readonly appToolkit: IAppToolkit,
    @Inject(GearboxViemContractFactory) private readonly contractFactory: GearboxViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.creditManagerV2({ address, network: this.network });
  }

  async getDefinitions({ multicall }: GetDefinitionsParams): Promise<GearboxCreditAccountsDefinition[]> {
    const contractsRegister = this.contractFactory.contractsRegister({
      address: '0xa50d4e7d8946a7c90652339cdbd262c375d54d99',
      network: this.network,
    });

    const creditManagerAddresses = await multicall.wrap(contractsRegister).read.getCreditManagers();

    const CreditManagerV2AddressesRaw = await Promise.all(
      creditManagerAddresses.map(async address => {
        const creditManagerV2Contract = this.contractFactory.creditManagerV2({ address, network: this.network });
        const version = await multicall.wrap(creditManagerV2Contract).read.version();
        if (Number(version) !== 2) return null;

        const [underlyingTokenAddressRaw, collateralTokensCount] = await Promise.all([
          multicall.wrap(creditManagerV2Contract).read.underlying(),
          multicall.wrap(creditManagerV2Contract).read.collateralTokensCount(),
        ]);

        const collateralTokenAddresses = await Promise.all(
          _.range(Number(collateralTokensCount)).map(async id => {
            const collateralToken = await multicall.wrap(creditManagerV2Contract).read.collateralTokens([BigInt(id)]);
            return collateralToken[0];
          }),
        );

        return { address, underlyingTokenAddress: underlyingTokenAddressRaw, collateralTokenAddresses };
      }),
    );

    return _.compact(CreditManagerV2AddressesRaw);
  }

  async getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<CreditManagerV2, GearboxCreditAccountsDefinition>): Promise<
    UnderlyingTokenDefinition[]
  > {
    return [
      {
        address: definition.underlyingTokenAddress,
        metaType: MetaType.BORROWED,
        network: this.network,
      },
      ...definition.collateralTokenAddresses.map(token => ({
        address: token,
        metaType: MetaType.SUPPLIED,
        network: this.network,
      })),
    ];
  }

  async getLabel(
    params: GetDisplayPropsParams<CreditManagerV2, DefaultDataProps, DefaultContractPositionDefinition>,
  ): Promise<string> {
    return getLabelFromToken(params.contractPosition.tokens[0]);
  }

  async getTokenBalancesPerPosition({
    address,
    contractPosition,
    contract,
    multicall,
  }: GetTokenBalancesParams<CreditManagerV2, DefaultDataProps>): Promise<BigNumberish[]> {
    let creditAccountAddress = '';
    const emptyBalances = Array(contractPosition.tokens.length).fill(0);

    const accountFactoryContract = this.contractFactory.accountFactory({
      address: ACCOUNT_FACTORY_ADDRESS,
      network: this.network,
    });
    const isCreditAccount = await multicall.wrap(accountFactoryContract).read.isCreditAccount([address]);
    // credit acccounts themselves cannot have other credit accounts
    // also this helps prevent double counting of convex positions via
    // phantom tokens and convex position fetcher
    if (isCreditAccount) {
      return emptyBalances;
    }

    try {
      creditAccountAddress = await contract.read.getCreditAccountOrRevert([address]);
    } catch (err) {
      return emptyBalances;
    }

    const balances = await Promise.all(
      contractPosition.tokens.map(async token => {
        if (token.metaType === MetaType.BORROWED) {
          const debt = await contract.read.calcCreditAccountAccruedInterest([creditAccountAddress]);
          return debt[2];
        }

        const tokenContract = this.appToolkit.globalViemContracts.erc20({
          address: token.address,
          network: this.network,
        });
        return multicall.wrap(tokenContract).read.balanceOf([creditAccountAddress]);
      }),
    );

    return balances;
  }
}
