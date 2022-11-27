import { Inject } from '@nestjs/common';
import Axios, { AxiosInstance } from 'axios';
import BigNumber from 'bignumber.js';

import { SingleStakingFarmContractPositionHelper, SingleStakingFarmRois } from '~app-toolkit';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MuxContractFactory } from '../contracts';
import { MUX_DEFINITION } from '../mux.definition';

type LiquidityAsset = {
  muxLPPrice: number;
  muxLPTotalBalance: number;
};

const veMuxTokenAddress = '0xa65ba125a25b51539a3d10910557b28215097810';
const muxTokenAddress = '0x8bb2ac0dcf1e86550534cee5e9c8ded4269b679b';
const mcbTokenAddress = '0x4e352cf164e64adcbad318c3a1e222e9eba4ce42';
const muxRewardRouterAddress = '0xaf9c4f6a0ceb02d4217ff73f3c95bbc8c7320cee';
const mcbTimelockContractAddress = '0xc2d28778447b1b0b2ae3ad17dc6616b546fbbebb';
const muxVesterAddress = '0xd7e864658dde98b1a1d70ce6d84d78e0a8e8ad18';
const mlpVesterAddress = '0xbcf8c124975de6277d8397a3cad26e2333620226';
const DECIMALS = 18;
const _1: BigNumber = new BigNumber('1');

export const MLP_FARM = {
  address: '0x290450cdea757c68e4fe6032ff3886d204292914',
  stakedTokenAddress: '0x7cbaf5a14d953ff896e5b3312031515c858737c8',
  rewardTokenAddresses: ['0x82af49447d8a07e3bd95bd0d56f35241523fbab1', '0x8bb2ac0dcf1e86550534cee5e9c8ded4269b679b'],
};

export const MCB_FARM = {
  address: '0xa65ba125a25b51539a3d10910557b28215097810',
  stakedTokenAddress: '0x4e352cf164e64adcbad318c3a1e222e9eba4ce42',
  rewardTokenAddresses: ['0x82af49447d8a07e3bd95bd0d56f35241523fbab1', '0x8bb2ac0dcf1e86550534cee5e9c8ded4269b679b'],
};

export const MUX_FARM = {
  address: '0xa65ba125a25b51539a3d10910557b28215097810',
  stakedTokenAddress: '0x8bb2ac0dcf1e86550534cee5e9c8ded4269b679b',
  rewardTokenAddresses: ['0x82af49447d8a07e3bd95bd0d56f35241523fbab1', '0x8bb2ac0dcf1e86550534cee5e9c8ded4269b679b'],
};

export const FARMS = [MLP_FARM, MCB_FARM, MUX_FARM];

const appId = MUX_DEFINITION.id;
const groupId = MUX_DEFINITION.groups.farm.id;
const network = Network.ARBITRUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class ArbitrumMuxFarmContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MuxContractFactory) private readonly muxContractFactory: MuxContractFactory,
    @Inject(SingleStakingFarmContractPositionHelper)
    private readonly singleStakingFarmContractPositionHelper: SingleStakingFarmContractPositionHelper,
  ) {}

  private axios: AxiosInstance = Axios.create({
    baseURL: 'https://app.mux.network',
  });

  async getPositions() {
    return this.singleStakingFarmContractPositionHelper.getContractPositions({
      appId,
      groupId,
      network,
      dependencies: [
        { appId: MUX_DEFINITION.id, groupIds: [MUX_DEFINITION.groups.mlp.id, MUX_DEFINITION.groups.mux.id], network },
      ],
      resolveFarmDefinitions: async () => FARMS,
      resolveFarmContract: ({ network, address }) => this.muxContractFactory.muxRewardTracker({ network, address }),
      resolveIsActive: () => true,
      resolveRois: opts => this.getRois(opts.address),
    });
  }

  async getRois(address: string): Promise<SingleStakingFarmRois> {
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const { data: liquidityAsset } = await this.axios.get<LiquidityAsset>('/api/liquidityAsset');
    const mlpPrice = liquidityAsset.muxLPPrice;
    const ethPrice = baseTokens.find(p => p.symbol === 'ETH')?.price || 0;
    const mcbPrice = baseTokens.find(p => p.symbol === 'MCB')?.price || 0;

    const multicall = this.appToolkit.getMulticall(network);
    const muxRewardRouterContract = this.muxContractFactory.muxRewardRouter({
      address: muxRewardRouterAddress,
      network,
    });
    const veMuxTokenContract = this.muxContractFactory.erc20({ address: veMuxTokenAddress, network });
    const muxTokenContract = this.muxContractFactory.erc20({ address: muxTokenAddress, network });
    const mcbTokenContract = this.muxContractFactory.erc20({ address: mcbTokenAddress, network });
    const [
      muxRewardRateRaw,
      feeRewardRateRaw,
      poolOwnedRateRaw,
      veMuxDecimals,
      veMuxSupplyRaw,
      muxDecimals,
      muxSupplyRaw,
      timeLockBalance,
      muxVestingBalance,
      muxlpVestingBalance,
    ] = await Promise.all([
      multicall.wrap(muxRewardRouterContract).muxRewardRate(),
      multicall.wrap(muxRewardRouterContract).feeRewardRate(),
      multicall.wrap(muxRewardRouterContract).poolOwnedRate(),
      multicall.wrap(veMuxTokenContract).decimals(),
      multicall.wrap(veMuxTokenContract).totalSupply(),
      multicall.wrap(muxTokenContract).decimals(),
      multicall.wrap(muxTokenContract).totalSupply(),
      multicall.wrap(mcbTokenContract).balanceOf(mcbTimelockContractAddress),
      multicall.wrap(mcbTokenContract).balanceOf(muxVesterAddress),
      multicall.wrap(mcbTokenContract).balanceOf(mlpVesterAddress),
    ]);

    const feeRewardRate = new BigNumber(feeRewardRateRaw.toString()).shiftedBy(-DECIMALS);
    const muxRewardRate = new BigNumber(muxRewardRateRaw.toString()).shiftedBy(-DECIMALS);
    const poolOwnedRate = new BigNumber(poolOwnedRateRaw.toString()).shiftedBy(-DECIMALS);
    const mlpSupply = new BigNumber(liquidityAsset.muxLPTotalBalance);
    const veMuxSupply = new BigNumber(veMuxSupplyRaw.toString()).shiftedBy(-veMuxDecimals);
    const muxSupply = new BigNumber(muxSupplyRaw.toString()).shiftedBy(-muxDecimals);

    const mcbCirculatingSupply = muxSupply
      .minus(timeLockBalance.toString())
      .minus(muxVestingBalance.toString())
      .minus(muxlpVestingBalance.toString());
    const veRate = veMuxSupply.div(mcbCirculatingSupply.plus(muxSupply));

    if (address === MCB_FARM.address || address === MUX_FARM.address) {
      const lastCycleFeeApr = feeRewardRate
        .times(ethPrice)
        .times(86400)
        .times(365)
        .times(0.7)
        .times(poolOwnedRate)
        .div(veMuxSupply.times(mcbPrice));

      const v1 = muxRewardRate.times(86400).times(365);
      const v2 = _1.minus(_1.minus(poolOwnedRate).times(_1.minus(veRate)));
      const v3 = veMuxSupply;
      const currentCycleRewardApr = v1.times(v2).div(v3);

      return { dailyROI: 0, weeklyROI: 0, yearlyROI: lastCycleFeeApr.plus(currentCycleRewardApr).toNumber() };
    } else if (address === MLP_FARM.address) {
      const lastCycleFeeApr = feeRewardRate
        .times(ethPrice)
        .times(86400)
        .times(365)
        .times(0.7)
        .div(mlpSupply.times(mlpPrice));

      const v1 = muxRewardRate.times(mcbPrice).times(86400).times(365);
      const v2 = _1.minus(veRate);
      const v3 = mlpSupply.times(mlpPrice);
      const currentCycleRewardApr = v1.times(v2).div(v3);

      return { dailyROI: 0, weeklyROI: 0, yearlyROI: lastCycleFeeApr.plus(currentCycleRewardApr).toNumber() };
    }
    return { dailyROI: 0, weeklyROI: 0, yearlyROI: 0 };
  }
}
