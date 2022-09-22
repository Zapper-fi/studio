import { Inject } from '@nestjs/common';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  GetAddressesParams,
  GetDataPropsParams,
  GetDefinitionsParams,
  GetDisplayPropsParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { ConvexContractFactory, ConvexDepositToken } from '../contracts';

type ConvexDepositTokenDefinition = {
  address: string;
  poolIndex: number;
};

@PositionTemplate()
export class EthereumConvexDepositTokenFetcher extends AppTokenTemplatePositionFetcher<
  ConvexDepositToken,
  DefaultAppTokenDataProps,
  ConvexDepositTokenDefinition
> {
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
    const depositContract = this.contractFactory.convexBooster({
      address: boosterContractAddress,
      network: this.network,
    });
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
    const depositContract = this.contractFactory.convexBooster({
      address: boosterContractAddress,
      network: this.network,
    });

    const poolInfo = await depositContract.poolInfo(definition.poolIndex);
    return poolInfo.lptoken;
  }

  async getLiquidity({ appToken }: GetDataPropsParams<ConvexDepositToken>) {
    return appToken.supply * appToken.price;
  }

  async getReserves({ appToken }: GetDataPropsParams<ConvexDepositToken>) {
    return [appToken.pricePerShare[0] * appToken.supply];
  }

  async getApy(_params: GetDataPropsParams<ConvexDepositToken>) {
    return 0;
  }

  async getLabel({ appToken }: GetDisplayPropsParams<ConvexDepositToken, DefaultAppTokenDataProps>) {
    return getLabelFromToken(appToken.tokens[0]!);
  }
}
