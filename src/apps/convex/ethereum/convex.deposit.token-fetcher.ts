import { Inject } from '@nestjs/common';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { IMulticallWrapper } from '~multicall';
import {
  AppTokenTemplatePositionFetcher,
  DataPropsStageParams,
  DisplayPropsStageParams,
  UnderlyingTokensStageParams,
} from '~position/template/app-token.template.position-fetcher';
import { Network } from '~types/network.interface';

import { ConvexContractFactory, ConvexDepositToken } from '../contracts';
import { CONVEX_DEFINITION } from '../convex.definition';

type ConvexDepositTokenDataProps = {
  liquidity: number;
};

const appId = CONVEX_DEFINITION.id;
const groupId = CONVEX_DEFINITION.groups.deposit.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network, options: { excludeFromTvl: true } })
export class EthereumConvexDepositTokenFetcher extends AppTokenTemplatePositionFetcher<
  ConvexDepositToken,
  ConvexDepositTokenDataProps
> {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Liqudity Pool Staking';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ConvexContractFactory) protected readonly contractFactory: ConvexContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): ConvexDepositToken {
    return this.contractFactory.convexDepositToken({ address, network: this.network });
  }

  async getAddresses({ multicall }: { multicall: IMulticallWrapper }) {
    const boosterContractAddress = '0xf403c135812408bfbe8713b5a23a04b3d48aae31';
    const depositContract = this.contractFactory.convexBooster({ address: boosterContractAddress, network });
    const numOfPools = await multicall.wrap(depositContract).poolLength();

    const depositTokenAddresses = await Promise.all(
      range(0, Number(numOfPools)).flatMap(async poolIndex => {
        const poolInfo = await depositContract.poolInfo(poolIndex);
        return poolInfo.token.toLowerCase();
      }),
    );

    return depositTokenAddresses;
  }

  async getUnderlyingTokenAddresses({ index }: UnderlyingTokensStageParams<ConvexDepositToken>) {
    const boosterContractAddress = '0xf403c135812408bfbe8713b5a23a04b3d48aae31';
    const depositContract = this.contractFactory.convexBooster({ address: boosterContractAddress, network });
    const poolInfo = await depositContract.poolInfo(index);
    return poolInfo.lptoken;
  }

  async getDataProps({ appToken }: DataPropsStageParams<ConvexDepositToken, ConvexDepositTokenDataProps>) {
    const liquidity = appToken.price * appToken.supply;
    return { liquidity };
  }

  async getLabel({ appToken }: DisplayPropsStageParams<ConvexDepositToken, ConvexDepositTokenDataProps>) {
    return getLabelFromToken(appToken.tokens[0]!);
  }
}
