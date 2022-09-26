import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { PodsYieldContractFactory, PodsYieldVault } from '../contracts';

import { strategyAddresses, strategyDetails } from './config';

export type PodsYieldQueueDataProps = {
  totalValueQueued: number;
};

@PositionTemplate()
export class EthereumPodsYieldQueueContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  PodsYieldVault,
  PodsYieldQueueDataProps
> {
  groupLabel = 'Queues';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PodsYieldContractFactory) protected readonly contractFactory: PodsYieldContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): PodsYieldVault {
    return this.contractFactory.podsYieldVault({ address, network: this.network });
  }

  async getDefinitions() {
    return strategyAddresses.map(address => ({ address }));
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<PodsYieldVault>) {
    return [{ metaType: MetaType.SUPPLIED, address: await contract.asset() }];
  }

  async getDataProps({ contract }: GetDataPropsParams<PodsYieldVault>): Promise<PodsYieldQueueDataProps> {
    const [queuedAssets] = await Promise.all([contract.totalIdleAssets()]);
    const totalValueQueued = Number(queuedAssets) / 10 ** 18;
    return { totalValueQueued };
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<PodsYieldVault>) {
    const details = strategyDetails[contractPosition.address] || strategyDetails.standard;
    return `Queued ${getLabelFromToken(contractPosition.tokens[0])} in ${details.title}`;
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<PodsYieldVault>) {
    return Promise.all([contract.idleAssetsOf(address)]);
  }
}
