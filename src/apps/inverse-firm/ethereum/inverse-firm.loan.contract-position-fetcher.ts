import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { uniq } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { isClaimable } from '~position/position.utils';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { InverseFirmViemContractFactory } from '../contracts';
import { SimpleMarket } from '../contracts/viem';

const DBR = '0xad038eb671c44b853887a7e32528fab35dc5d710';
const CVX = '0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b';
const FXS = '0x3432b6a60d23ca0dfca7761b7ab56459d9c964d0';
const CRV = '0xd533a949740bb3306d119cc777fa900ba034cd52';
const THREE_CRV = '0x6c3f90f043a72fa612cbac8115ee7e52bde6e490';

const CVX_FXS_MARKET = '0x93685185666c8d34ad4c574b3dbf41231bbfb31b';
const CVX_CRV_MARKET = '0x3474ad0e3a9775c9f68b415a7a9880b0cab9397a';

const REWARD_TOKENS = {
  '0xb516247596ca36bf32876199fbdcad6b3322330b': [DBR],
  [CVX_FXS_MARKET]: [CVX, FXS],
  [CVX_CRV_MARKET]: [CVX, CRV, THREE_CRV],
};

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
  dbrDistributor = '0xdcd2d918511ba39f2872eb731bb88681ae184244';
  invAddress = '0x41d5d79431a913c4ae7d69a668ecdfe5ff9dfb68';
  xinvAddress = '0x1637e4e9941d55703a7a5e7807d6ada3f7dcd61b';
  dolaAddress = '0x865377367054516e17014ccded1e7d814edc9ce4';
  stCvxFxsAddress = '0x49b4d1df40442f0c31b1bbaea3ede7c38e37e31a';
  stCvxCrvAddress = '0xaa0c3f5f7dfd688c6e646f66cd2a6b66acdbe434';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(InverseFirmViemContractFactory) private readonly contractFactory: InverseFirmViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.simpleMarket({ network: this.network, address });
  }

  async getDefinitions(): Promise<InverseFirmLoanContractPositionDefinition[]> {
    const multicall = this.appToolkit.getViemMulticall(this.network);

    const dolaBorrowRightContract = this.contractFactory.dbr({
      address: this.dbrAddress,
      network: this.network,
    });

    const logs = await dolaBorrowRightContract.getEvents.AddMarket(
      {},
      { fromBlock: BigInt(16155757), toBlock: 'latest' },
    );

    const markets = uniq(logs.map(l => l.args.market!.toLowerCase()));

    const definitions = await Promise.all(
      markets.map(async address => {
        const simpleMarketContract = this.contractFactory.simpleMarket({ address, network: this.network });
        const collateralTokenAddressRaw = await multicall.wrap(simpleMarketContract).read.collateral();

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
        };
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
    const personalEscrow = await contract.read.escrows([address]);
    if (personalEscrow === ZERO_ADDRESS) return contractPosition.tokens.map(() => 0);

    const escrowContract = this.contractFactory.rewardableEscrow({
      address: personalEscrow.toLowerCase(),
      network: this.network,
    });

    const [supplied, borrowed] = await Promise.all([
      multicall.wrap(escrowContract).read.balance(),
      multicall.wrap(contract).read.debts([address]),
    ]);

    const rewardTokens = contractPosition.tokens.filter(isClaimable);

    const isCvxFxsMarket = contract.address.toLowerCase() === CVX_FXS_MARKET.toLowerCase();
    const isCvxCrvMarket = contract.address.toLowerCase() === CVX_CRV_MARKET.toLowerCase();

    let claimablesAsTuple: {
      token: string;
      amount: bigint;
    }[] = [];

    if (isCvxFxsMarket || isCvxCrvMarket) {
      if (isCvxFxsMarket) {
        const stakeContract = this.contractFactory.stCvxFxs({ address: this.stCvxFxsAddress, network: this.network });
        const result = await multicall.wrap(stakeContract).read.claimableRewards([personalEscrow]);
        claimablesAsTuple = result.map(v => ({ token: v.token, amount: v.amount }));
      } else {
        const stakeContract = this.contractFactory.stCvxCrv({ address: this.stCvxCrvAddress, network: this.network });
        const result = await multicall
          .wrap(stakeContract)
          .simulate.earned([personalEscrow])
          .then(v => v.result);
        claimablesAsTuple = result.map(v => ({ token: v.token, amount: v.amount }));
      }
    }

    const rewardBalances = await Promise.all(
      rewardTokens.map(token => {
        if (DBR === token.address.toLowerCase()) {
          return multicall.wrap(escrowContract).read.claimable();
        } else if (claimablesAsTuple.length > 0) {
          const rewardData = claimablesAsTuple.find(
            claimableData => claimableData[0].toLowerCase() === token.address.toLowerCase(),
          );
          return Promise.resolve(rewardData ? rewardData.amount : 0);
        }
        return Promise.resolve(0);
      }),
    );

    return [supplied, borrowed, ...rewardBalances];
  }

  async getDataProps(params: GetDataPropsParams<SimpleMarket>): Promise<DefaultDataProps> {
    const { contractPosition } = params;
    const rewardToken = contractPosition.tokens.find(isClaimable)!;
    if (!rewardToken) return {};

    if (DBR === rewardToken.address.toLowerCase()) {
      return {
        supplyApy: await this.getDBRApr(params),
      };
    }

    return {};
  }

  async getDBRApr({ multicall }) {
    const dbrDistributorContract = this.contractFactory.dbrDistributor({
      address: this.dbrDistributor,
      network: this.network,
    });
    const xinvContract = this.contractFactory.xinv({
      address: this.xinvAddress,
      network: this.network,
    });

    const [rewardRate, dbrDistributorSupply, xinvExRate] = await Promise.all([
      multicall.wrap(dbrDistributorContract).read.rewardRate(),
      multicall.wrap(dbrDistributorContract).read.totalSupply(),
      multicall.wrap(xinvContract).read.exchangeRateStored(),
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
    const dbrApr =
      ((Number(dbrYearlyRewardRate) * Number(dbrInvExRate)) / Number(invStakedViaDistributor) / 1e18) * 100;

    return dbrApr;
  }
}
