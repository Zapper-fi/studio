import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { MuxViemContractFactory } from '../contracts';
import { MuxRewardRouter } from '../contracts/viem';

@PositionTemplate()
export class ArbitrumMuxMuxLpStakingContractPositionFetcher extends ContractPositionTemplatePositionFetcher<MuxRewardRouter> {
  groupLabel = 'MUXLP Staked';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MuxViemContractFactory) protected readonly contractFactory: MuxViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.muxRewardRouter({ address, network: this.network });
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    return [{ address: '0xaf9c4f6a0ceb02d4217ff73f3c95bbc8c7320cee' }];
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<MuxRewardRouter>) {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: await contract.read.mlp(),
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: await contract.read.weth(),
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: await contract.read.mux(),
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<MuxRewardRouter>) {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
    multicall,
  }: GetTokenBalancesParams<MuxRewardRouter>): Promise<BigNumberish[]> {
    const mlpRewardTracker = this.contractFactory.muxRewardTracker({
      address: '0x290450cdea757c68e4fe6032ff3886d204292914',
      network: this.network,
    });

    const muxRewardTracker = this.contractFactory.muxRewardTracker({
      address: '0x0a9bbf8299fed2441009a7bb44874ee453de8e5d',
      network: this.network,
    });

    const [staked, mlpRewards, muxRewards] = await Promise.all([
      contract.read.stakedMlpAmount([address]),
      multicall
        .wrap(mlpRewardTracker)
        .simulate.claimable([address])
        .then(v => v.result),
      multicall
        .wrap(muxRewardTracker)
        .simulate.claimable([address])
        .then(v => v.result),
    ]);

    return [staked, mlpRewards, muxRewards];
  }
}
