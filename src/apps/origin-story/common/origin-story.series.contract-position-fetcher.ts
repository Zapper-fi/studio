import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  UnderlyingTokenDefinition,
} from '~position/template/contract-position.template.types';

import { OriginStoryViemContractFactory } from '../contracts';
import { Series } from '../contracts/viem';

export abstract class OriginStorySeriesContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  Series,
  DefaultDataProps
> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(OriginStoryViemContractFactory) protected readonly contractFactory: OriginStoryViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.series({ network: this.network, address });
  }

  async getDefinitions() {
    return [{ address: '0xcce8e784c777fb9435f89f4e45f8b7fc49f7669f' }];
  }

  async getTokenDefinitions(): Promise<UnderlyingTokenDefinition[]> {
    return [
      {
        address: '0x8207c1ffc5b6804f6024322ccf34f29c3541ae26',
        metaType: MetaType.SUPPLIED,
        network: this.network,
      },
    ];
  }

  async getLabel(params: GetDisplayPropsParams<Series>): Promise<string> {
    const suppliedToken = params.contractPosition.tokens[0];
    return `Staked ${getLabelFromToken(suppliedToken)}`;
  }

  async getDataProps({ contract }: GetDataPropsParams<Series>) {
    const liquidityRaw = await contract.read.totalSupply();
    const liquidity = Number(liquidityRaw) / 10 ** 18;

    return { liquidity };
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
  }: GetTokenBalancesParams<Series, DefaultDataProps>): Promise<BigNumberish[]> {
    const balances = await contract.read.balanceOf([address]);
    return [balances];
  }
}
