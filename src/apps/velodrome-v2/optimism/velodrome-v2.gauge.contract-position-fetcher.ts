import { Inject } from '@nestjs/common';

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

import { VelodromeV2AddressesResolver } from '../common/velodrome-v2.addresses-resolver';
import { VelodromeV2ViemContractFactory } from '../contracts';
import { VelodromeV2Gauge } from '../contracts/viem/VelodromeV2Gauge';

@PositionTemplate()
export class OptimismVelodromeV2GaugeContractPositionFetcher extends ContractPositionTemplatePositionFetcher<VelodromeV2Gauge> {
  groupLabel = 'Gauges';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(VelodromeV2ViemContractFactory) protected readonly contractFactory: VelodromeV2ViemContractFactory,
    @Inject(VelodromeV2AddressesResolver) protected readonly addressesResolver: VelodromeV2AddressesResolver,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.velodromeV2Gauge({ address, network: this.network });
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    const gaugeAddresses = await this.addressesResolver.getGaugeAddresses(this.network);

    return gaugeAddresses.map(gaugeAddress => {
      return { address: gaugeAddress };
    });
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<VelodromeV2Gauge>) {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: await contract.read.stakingToken(),
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: await contract.read.rewardToken(),
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<VelodromeV2Gauge>) {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<VelodromeV2Gauge>) {
    const [supplied, claimable] = await Promise.all([
      contract.read.balanceOf([address]),
      contract.read.earned([address]),
    ]);

    return [supplied, claimable];
  }
}
