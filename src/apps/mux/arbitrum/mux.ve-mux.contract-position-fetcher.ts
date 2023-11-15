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
import { MuxVeMux } from '../contracts/viem/MuxVeMux';

@PositionTemplate()
export class ArbitrumMuxVeMuxContractPositionFetcher extends ContractPositionTemplatePositionFetcher<MuxVeMux> {
  groupLabel = 'veMUX';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(MuxViemContractFactory) protected readonly contractFactory: MuxViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.muxVeMux({ address, network: this.network });
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    return [{ address: '0xa65ba125a25b51539a3d10910557b28215097810' }];
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<MuxVeMux>) {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: await contract.read.mcbToken(),
        network: this.network,
      },
      {
        metaType: MetaType.SUPPLIED,
        address: await contract.read.muxToken(),
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: await contract.read.muxToken(),
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<MuxVeMux>) {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
    multicall,
  }: GetTokenBalancesParams<MuxVeMux>): Promise<BigNumberish[]> {
    const veFeeRewardTracker = this.contractFactory.muxRewardTracker({
      address: '0x9357e3b52fd40ca943264d7c85550d97530ae94e',
      network: this.network,
    });

    const veMuxRewardTracker = this.contractFactory.muxRewardTracker({
      address: '0x9357e3b52fd40ca943264d7c85550d97530ae94e',
      network: this.network,
    });

    const [staked, feeRewards, muxRewards] = await Promise.all([
      contract.read.depositedBalances([address]),
      multicall
        .wrap(veFeeRewardTracker)
        .simulate.claimable([address])
        .then(v => v.result),
      multicall
        .wrap(veMuxRewardTracker)
        .simulate.claimable([address])
        .then(v => v.result),
    ]);

    return [staked[0], staked[1], muxRewards, feeRewards];
  }
}
