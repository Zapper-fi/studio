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

import { ConvexViemContractFactory } from '../contracts';
import { ConvexDepositToken } from '../contracts/viem';

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
    @Inject(ConvexViemContractFactory) protected readonly contractFactory: ConvexViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.convexDepositToken({ address, network: this.network });
  }

  async getDefinitions({ multicall }: GetDefinitionsParams): Promise<ConvexDepositTokenDefinition[]> {
    const depositContract = this.contractFactory.convexBoosterSidechain({
      address: this.boosterAddress,
      network: this.network,
    });

    const poolsCount = await multicall.wrap(depositContract).read.poolLength();
    const poolsRange = range(0, Number(poolsCount));

    return Promise.all(
      poolsRange.flatMap(async poolIndex => {
        const poolInfo = await depositContract.read.poolInfo([BigInt(poolIndex)]);
        return { address: poolInfo[2].toLowerCase(), poolIndex };
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

    const poolInfo = await depositContract.read.poolInfo([BigInt(definition.poolIndex)]);
    return [{ address: poolInfo[0], network: this.network }];
  }

  async getPricePerShare() {
    return [1];
  }

  async getLabel({ appToken }: GetDisplayPropsParams<ConvexDepositToken, DefaultAppTokenDataProps>) {
    return getLabelFromToken(appToken.tokens[0]!);
  }
}
