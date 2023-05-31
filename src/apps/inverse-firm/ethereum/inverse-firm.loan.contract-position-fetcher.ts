import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { uniq } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { InverseFirmContractFactory, SimpleMarket } from '../contracts';

export type InverseFirmLoanContractPositionDefinition = {
  address: string;
  suppliedTokenAddress: string;
  borrowedTokenAddress: string;
};

@PositionTemplate()
export class EthereumInverseFirmLoanContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  SimpleMarket,
  DefaultDataProps,
  InverseFirmLoanContractPositionDefinition
> {
  groupLabel = 'Lending';
  dbrAddress = '0xad038eb671c44b853887a7e32528fab35dc5d710'
  dbrDistributor = '0xdcd2D918511Ba39F2872EB731BB88681AE184244'
  invAddress = '0x41D5D79431A913C4aE7d69a668ecdfE5fF9DFB68'
  xinvAddress = '0x1637e4e9941D55703a7A5E7807d6aDA3f7DCD61B'
  dolaAddress = '0x865377367054516e17014ccded1e7d814edc9ce4'

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(InverseFirmContractFactory) private readonly contractFactory: InverseFirmContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): SimpleMarket {
    return this.contractFactory.simpleMarket({ network: this.network, address });
  }

  async getDefinitions(): Promise<InverseFirmLoanContractPositionDefinition[]> {
    const multicall = this.appToolkit.getMulticall(this.network);

    const dolaBorrowRightContract = this.contractFactory.dbr({
      address: this.dbrAddress,
      network: this.network,
    });

    const logs = await dolaBorrowRightContract.queryFilter(dolaBorrowRightContract.filters.AddMarket(), 16155757);
    const markets = uniq(logs.map(l => l.args.market.toLowerCase()));

    const definitions = await Promise.all(
      markets.map(async address => {
        const simpleMarketContract = this.contractFactory.simpleMarket({ address, network: this.network });
        const collateralTokenAddressRaw = await multicall.wrap(simpleMarketContract).collateral();

        return {
          address,
          suppliedTokenAddress: collateralTokenAddressRaw.toLowerCase(),
          borrowedTokenAddress: this.dolaAddress, // dola
        };
      }),
    );

    return definitions;
  }

  async getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<SimpleMarket, InverseFirmLoanContractPositionDefinition>) {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: definition.suppliedTokenAddress,
        network: this.network,
      },
      {
        metaType: MetaType.BORROWED,
        address: definition.borrowedTokenAddress,
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<SimpleMarket>): Promise<string> {
    return `${getLabelFromToken(contractPosition.tokens[0])} Market`;
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
    multicall,
  }: GetTokenBalancesParams<SimpleMarket>): Promise<BigNumberish[]> {
    const personalEscrow = await contract.escrows(address);
    if (personalEscrow === ZERO_ADDRESS) return [0, 0];

    const simpleEscrowContract = this.contractFactory.simpleEscrow({
      address: personalEscrow.toLowerCase(),
      network: this.network,
    });
    const supplied = await multicall.wrap(simpleEscrowContract).balance();

    const borrowed = await contract.debts(address);

    return [supplied, borrowed];
  }

  async getRewardTokenBalances({
    address,
    multicall,
    contract,
  }: GetTokenDefinitionsParams<SimpleMarket>): Promise<BigNumberish[]> {
    const personalEscrow = await contract.escrows(address);
    if (personalEscrow === ZERO_ADDRESS) return [];

    const escrowContract = this.contractFactory.rewardableEscrow({
      address: personalEscrow.toLowerCase(),
      network: this.network,
    });

    let dbrClaimable: BigNumberish = 0;

    try {
      // escrow may or not be with the rewards feature
      dbrClaimable = await multicall.wrap(escrowContract).claimable();
    } catch (e) {
      // no claimable rewards feature for this market
    }

    return [
      dbrClaimable,
    ];
  }

  async getRewardTokenAddresses() {
    return [
      this.dbrAddress,
    ];
  }

  async getRewardRates({
    multicall
  }) {
    const dbrDistributorContract = this.contractFactory.dbrDistributor({
      address: this.dbrDistributor,
      network: this.network,
    });
    const xinvContract = this.contractFactory.xinv({
      address: this.xinvAddress,
      network: this.network,
    });

    const [
      rewardRate,
      dbrDistributorSupply,
      xinvExRate,
    ] = await Promise.all([
      multicall.wrap(dbrDistributorContract).rewardRate(),
      multicall.wrap(dbrDistributorContract).totalSupply(),
      multicall.wrap(xinvContract).exchangeRateStored(),
    ]);

    const [dbrtoken, invToken] = await Promise.all([
      this.appToolkit.getBaseTokenPrice({
        network: this.network,
        address: this.dbrAddress,
      }),
      this.appToolkit.getBaseTokenPrice({
        network: this.network,
        address: this.invAddress,
      }),
    ]);

    if (!dbrtoken || !invToken) return [0];

    const invStakedViaDistributor = xinvExRate.mul(dbrDistributorSupply);
    const dbrYearlyRewardRate = rewardRate.mul(31536000);
    const dbrInvExRate = dbrtoken.price / invToken.price;
    const dbrApr = Number(dbrYearlyRewardRate) * Number(dbrInvExRate) / Number(invStakedViaDistributor) / 1e18 * 100;

    return [dbrApr];
  }
}
