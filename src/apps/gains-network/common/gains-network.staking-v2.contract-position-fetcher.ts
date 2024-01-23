import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { GainsNetworkViemContractFactory } from '../contracts';
import { GainsNetworkStakingV2 } from '../contracts/viem';

export abstract class GainsNetworkStakingV2ContractPositionFetcher extends ContractPositionTemplatePositionFetcher<GainsNetworkStakingV2> {
  abstract stakingContractAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(GainsNetworkViemContractFactory) protected readonly contractFactory: GainsNetworkViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.gainsNetworkStakingV2({ address, network: this.network });
  }

  async getDefinitions() {
    return [{ address: this.stakingContractAddress }];
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<GainsNetworkStakingV2>) {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: await contract.read.gns(),
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: await contract.read.dai(),
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<GainsNetworkStakingV2>) {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<GainsNetworkStakingV2>) {
    const [suppliedBalance, claimable] = await Promise.all([
      contract.read.stakers([address]),
      contract.read.pendingRewardDai([address]),
    ]);

    return [suppliedBalance[0], claimable];
  }
}
