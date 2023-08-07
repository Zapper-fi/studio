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
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { InverseFirmContractFactory, SimpleMarket } from '../contracts';
import { isClaimable } from '~position/position.utils';
import { CvxFxsStaking } from '../contracts/ethers/StCvxFxs';
import { CvxCrvStakingWrapper } from '../contracts/ethers/StCvxCrv';

const DBR = '0xad038eb671c44b853887a7e32528fab35dc5d710';
const CVX = '0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b';
const FXS = '0x3432b6a60d23ca0dfca7761b7ab56459d9c964d0';
const CRV = '0xD533a949740bb3306d119CC777fa900bA034cd52';
const THREE_CRV = '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490';

const CVX_FXS_MARKET = '0x93685185666c8d34ad4c574b3dbf41231bbfb31b';
const CVX_CRV_MARKET = '0x3474ad0e3a9775c9f68b415a7a9880b0cab9397a';

const REWARD_TOKENS = {
  '0xb516247596ca36bf32876199fbdcad6b3322330b': [DBR],
  [CVX_FXS_MARKET]: [CVX, FXS],
  [CVX_CRV_MARKET]: [CVX, CRV, THREE_CRV],
}

export type InverseFirmLoanContractPositionDefinition = {
  address: string;
  suppliedTokenAddress: string;
  borrowedTokenAddress: string;
  rewardTokenAddresses: string[];
};

@PositionTemplate()
export class EthereumInverseFirmLoanContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  SimpleMarket,
  DefaultDataProps,
  InverseFirmLoanContractPositionDefinition
> {
  groupLabel = 'Lending';
  dbrAddress = DBR;
  dbrDistributor = '0xdcd2D918511Ba39F2872EB731BB88681AE184244'
  invAddress = '0x41D5D79431A913C4aE7d69a668ecdfE5fF9DFB68'
  xinvAddress = '0x1637e4e9941D55703a7A5E7807d6aDA3f7DCD61B'
  dolaAddress = '0x865377367054516e17014ccded1e7d814edc9ce4'
  stCvxFxsAddress = '0x49b4d1dF40442f0C31b1BbAEA3EDE7c38e37E31a'
  stCvxCrvAddress = '0xaa0C3f5F7DFD688C6E646F66CD2a6B66ACdbE434'

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
          rewardTokenAddresses: REWARD_TOKENS[address.toLowerCase()] || [],
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
      ...definition.rewardTokenAddresses.map(rewardTokenAddress => {
        return {
          metaType: MetaType.CLAIMABLE,
          address: rewardTokenAddress,
          network: this.network,
        }
      }),
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<SimpleMarket>): Promise<string> {
    return `${getLabelFromToken(contractPosition.tokens[0])} Market`;
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
    contractPosition,
    multicall,
  }: GetTokenBalancesParams<SimpleMarket>): Promise<BigNumberish[]> {
    const personalEscrow = await contract.escrows(address);
    if (personalEscrow === ZERO_ADDRESS) return contractPosition.tokens.map(() => 0);

    const escrowContract = this.contractFactory.rewardableEscrow({
      address: personalEscrow.toLowerCase(),
      network: this.network,
    });

    const [supplied, borrowed] = await Promise.all([
      multicall.wrap(escrowContract).balance(),
      multicall.wrap(contract).debts(address),
    ]);

    const rewardTokens = contractPosition.tokens.filter(isClaimable);

    const isCvxFxsMarket = contract.address.toLowerCase() === CVX_FXS_MARKET.toLowerCase();
    const isCvxCrvMarket = contract.address.toLowerCase() === CVX_CRV_MARKET.toLowerCase();

    let claimablesAsTuple: CvxFxsStaking.EarnedDataStructOutput[] | CvxCrvStakingWrapper.EarnedDataStructOutput[] = [];
    if (isCvxFxsMarket || isCvxCrvMarket) {
      if (isCvxFxsMarket) {
        const stakeContract = this.contractFactory.stCvxFxs({ address: this.stCvxFxsAddress, network: this.network });
        claimablesAsTuple = await multicall.wrap(stakeContract).claimableRewards(personalEscrow);
      } else {
        const stakeContract = this.contractFactory.stCvxCrv({ address: this.stCvxCrvAddress, network: this.network });
        claimablesAsTuple = await multicall.wrap(stakeContract).callStatic.earned(personalEscrow);
      }
    }

    const rewardBalances = await Promise.all(
      rewardTokens.map(token => {
        if (DBR === token.address.toLowerCase()) {
          return multicall.wrap(escrowContract).claimable()
        } else if (claimablesAsTuple.length > 0) {
          const rewardData = claimablesAsTuple.find(claimableData => claimableData[0].toLowerCase() === token.address.toLowerCase());
          return Promise.resolve(rewardData ? rewardData.amount : 0);
        }
        return Promise.resolve(0);
      })
    );

    return [supplied, borrowed, ...rewardBalances];
  }

  async getDataProps(
    params: GetDataPropsParams<SimpleMarket>,
  ): Promise<DefaultDataProps> {
    const { contractPosition } = params;
    const rewardToken = contractPosition.tokens.find(isClaimable)!;
    if (!rewardToken) return {};

    if (DBR === rewardToken.address.toLowerCase()) {
      return {
        supplyApy: await this.getDBRApr(params),
      }
    }

    return {};
  }

  async getDBRApr({
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

    return dbrApr;
  }
}
