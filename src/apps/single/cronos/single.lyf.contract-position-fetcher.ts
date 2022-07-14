import { Inject } from '@nestjs/common';
import axios from 'axios';
import { compact } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { VVS_FINANCE_DEFINITION } from '~apps/vvs-finance';
import { VvsCraftsmanV2 } from '~apps/vvs-finance/contracts';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { claimable, supplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { SingleContractFactory, VvsPair, VvsCraftsman, VvsRewarder } from '../contracts';
import { SINGLE_DEFINITION } from '../single.definition';
import {
  DexCode,
  SingleFarmApi,
  SingleLYFContractPositionDataProps,
  SingleProtocol,
  WMasterChefsEntity,
} from '../types';

import { BASE_API_URL } from './common';

const appId = SINGLE_DEFINITION.id;
const groupId = SINGLE_DEFINITION.groups.lyf.id;
const network = Network.CRONOS_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class CronosSingleLyfContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SingleContractFactory) private readonly singleContractFactory: SingleContractFactory,
  ) {}

  async getPositions() {
    const { wmasterchefs } = await axios.get<SingleProtocol>(`${BASE_API_URL}/protocol/contracts`).then(v => v.data);
    const singleLyfFarmList = await axios
      .get<{ data: SingleFarmApi[] }>(`${BASE_API_URL}/farms?chainid=25`)
      .then(v => v.data.data)
      .then(vs => vs.filter(v => v.dex === DexCode.VVS));

    const { masterChef, wMasterChef } = wmasterchefs.find(v => v.name === 'vvs') as WMasterChefsEntity;
    const { masterChef: masterChefV2, wMasterChef: wMasterChefV2 } = wmasterchefs.find(
      v => v.name === 'vvsMultiYield',
    ) as WMasterChefsEntity;

    const multicall = this.appToolkit.getMulticall(network);

    const masterChefContract = this.singleContractFactory.vvsCraftsman({
      address: masterChef,
      network,
    }) as VvsCraftsman;

    const masterChefV2Contract = this.singleContractFactory.vvsCraftsmanV2({
      address: masterChefV2,
      network,
    }) as VvsCraftsmanV2;

    const allTokens = await this.getAllTokens();

    const [poolLength, vvsAddress] = await Promise.all([
      multicall.wrap(masterChefContract).poolLength(),
      multicall.wrap(masterChefContract).vvs(),
    ]);

    const vvsToken = allTokens.find(v => v.address === vvsAddress.toLowerCase())!;

    const lpTokens: string[] = await Promise.all(
      Array.from(Array(Number(poolLength)).keys()).map(v => {
        return multicall.wrap(masterChefContract).poolInfo(v);
      }),
    ).then(vs => vs.map(v => (v[0] as string).toLowerCase()));

    const positions = await Promise.all(
      lpTokens.map(async (lpTokenAddr, index) => {
        // filter pool(s) not supported by Single finance
        if (!singleLyfFarmList.find(v => v.masterchefPoolId === index)) {
          return null;
        }

        const stakedTokenContract = this.singleContractFactory.vvsPair({ address: lpTokenAddr, network }) as VvsPair;

        const stakedToken = allTokens.find(v => v.address === lpTokenAddr);
        if (!stakedToken) return null;

        const [[mcTotalValueLockedRaw], [mcV2totalValueLockedRaw], rewarders, decimals] = await Promise.all([
          multicall.wrap(masterChefContract).userInfo(index, wMasterChef),
          multicall.wrap(masterChefV2Contract).userInfo(index, wMasterChefV2),
          multicall.wrap(masterChefV2Contract).poolRewarders(index),
          multicall.wrap(stakedTokenContract).decimals(),
        ]);

        const multiYieldClaimables = await Promise.all(
          rewarders.map(async rewarder => {
            const rewarderContract = this.singleContractFactory.vvsRewarder({
              address: rewarder,
              network,
            }) as VvsRewarder;
            return multicall.wrap(rewarderContract).rewardToken();
          }),
        )
          .then(vs => vs.map(v => (v as string).toLowerCase()))
          .then(vs => vs.map(v => allTokens.find(tokenAddr => tokenAddr.address === v)))
          .then(vs => vs.map(v => v && claimable(v)));

        const totalValueLocked =
          Number(mcTotalValueLockedRaw) / 10 ** decimals + Number(mcV2totalValueLockedRaw) / 10 ** decimals;

        const position: ContractPosition<SingleLYFContractPositionDataProps> = {
          type: ContractType.POSITION,
          appId,
          groupId,
          address: '0x70f699f902628af04dc5323c37cfa69e22140741', // SingleBank contract on CRONOS,
          network,
          tokens: [supplied(stakedToken), claimable(vvsToken), ...compact(multiYieldClaimables)],
          dataProps: {
            totalValueLocked,
          },
          displayProps: {
            label: getLabelFromToken(stakedToken),
            images: getImagesFromToken(stakedToken),
          },
        };

        return position;
      }),
    );

    return compact(positions);
  }

  private async getAllTokens() {
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const appTokens = await this.appToolkit.getAppTokenPositions({
      appId: VVS_FINANCE_DEFINITION.id,
      groupIds: [VVS_FINANCE_DEFINITION.groups.pool.id],
      network,
    });
    const allTokens = [...appTokens, ...baseTokens];
    return allTokens;
  }
}
