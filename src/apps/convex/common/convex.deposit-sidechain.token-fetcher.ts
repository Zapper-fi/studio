import { Inject } from '@nestjs/common';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  GetAddressesParams,
  GetDefinitionsParams,
  GetDisplayPropsParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { ConvexContractFactory, ConvexDepositToken } from '../contracts';

type ConvexDepositTokenDefinition = {
  address: string;
  poolIndex: number;
};

export abstract class ConvexDepositSidechainTokenFetcher extends AppTokenTemplatePositionFetcher<
  ConvexDepositToken,
  DefaultAppTokenDataProps,
  ConvexDepositTokenDefinition
> {
  abstract boosterAddress: string;

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
    const depositContract = this.contractFactory.convexBoosterSidechain({
      address: this.boosterAddress,
      network: this.network,
    });

    const poolsCount = await multicall.wrap(depositContract).poolLength();
    const poolsRange = range(0, Number(poolsCount));

    return Promise.all(
      poolsRange.flatMap(async poolIndex => {
        const poolInfo = await depositContract.poolInfo(poolIndex);
        return { address: poolInfo.rewards.toLowerCase(), poolIndex };
      }),
    );
  }

  async getAddresses({ definitions }: GetAddressesParams) {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenDefinitions({
    definition,
  }: GetUnderlyingTokensParams<ConvexDepositToken, ConvexDepositTokenDefinition>) {
    const depositContract = this.contractFactory.convexBoosterSidechain({
      address: this.boosterAddress,
      network: this.network,
    });

    const poolInfo = await depositContract.poolInfo(definition.poolIndex);
    return [{ address: poolInfo.lptoken, network: this.network }];
  }

  async getLabel({ appToken }: GetDisplayPropsParams<ConvexDepositToken, DefaultAppTokenDataProps>) {
    return getLabelFromToken(appToken.tokens[0]!);
  }
}
