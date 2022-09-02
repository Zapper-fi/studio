import { Inject } from '@nestjs/common';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetAddressesParams,
  GetDataPropsParams,
  GetDefinitionsParams,
  GetDisplayPropsParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';
import { Network } from '~types/network.interface';

import { ConvexContractFactory, ConvexDepositToken } from '../contracts';
import { CONVEX_DEFINITION } from '../convex.definition';

type ConvexDepositTokenDataProps = {
  liquidity: number;
};

type ConvexDepositTokenDefinition = {
  address: string;
  poolIndex: number;
};

const appId = CONVEX_DEFINITION.id;
const groupId = CONVEX_DEFINITION.groups.deposit.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumConvexDepositTokenFetcher extends AppTokenTemplatePositionFetcher<
  ConvexDepositToken,
  ConvexDepositTokenDataProps,
  ConvexDepositTokenDefinition
> {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Liqudity Pool Staking';

  isExcludedFromExplore = true;
  isExcludedFromTvl = true;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ConvexContractFactory) protected readonly contractFactory: ConvexContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): ConvexDepositToken {
    return this.contractFactory.convexDepositToken({ address, network: this.network });
  }

  async getDefinitions({ multicall }: GetDefinitionsParams): Promise<ConvexDepositTokenDefinition[]> {
    const boosterContractAddress = '0xf403c135812408bfbe8713b5a23a04b3d48aae31';
    const depositContract = this.contractFactory.convexBooster({ address: boosterContractAddress, network });
    const numOfPools = await multicall.wrap(depositContract).poolLength();

    const definitions = await Promise.all(
      range(0, Number(numOfPools)).flatMap(async poolIndex => {
        const poolInfo = await depositContract.poolInfo(poolIndex);
        return { address: poolInfo.token.toLowerCase(), poolIndex };
      }),
    );

    return definitions;
  }

  async getAddresses({ definitions }: GetAddressesParams) {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenAddresses({
    definition,
  }: GetUnderlyingTokensParams<ConvexDepositToken, ConvexDepositTokenDefinition>) {
    const boosterContractAddress = '0xf403c135812408bfbe8713b5a23a04b3d48aae31';
    const depositContract = this.contractFactory.convexBooster({ address: boosterContractAddress, network });
    const poolInfo = await depositContract.poolInfo(definition.poolIndex);
    return poolInfo.lptoken;
  }

  async getDataProps({ appToken }: GetDataPropsParams<ConvexDepositToken, ConvexDepositTokenDataProps>) {
    const liquidity = appToken.price * appToken.supply;
    return { liquidity };
  }

  async getLabel({ appToken }: GetDisplayPropsParams<ConvexDepositToken, ConvexDepositTokenDataProps>) {
    return getLabelFromToken(appToken.tokens[0]!);
  }
}
