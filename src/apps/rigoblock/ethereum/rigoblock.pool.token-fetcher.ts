import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Erc20 } from '~contract/contracts';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetAddressesParams,
  DefaultAppTokenDefinition,
  GetUnderlyingTokensParams,
  UnderlyingTokenDefinition,
  GetPricePerShareParams,
  DefaultAppTokenDataProps,
} from '~position/template/app-token.template.types';

import { RigoblockContractFactory, SmartPool } from '../contracts';

@PositionTemplate()
export class EthereumRigoblockPoolTokenFetcher extends AppTokenTemplatePositionFetcher<SmartPool> {
  groupLabel: string = 'SmartPool';

  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(RigoblockContractFactory) private readonly contractFactory: RigoblockContractFactory,
  ) {
    super(appToolkit);
  }

  async getAddresses() {
    return ['0x1aa46c48894028819f3f7636fadfd71f3a8f106c'];
  }

  getContract(address: string): SmartPool {
    return this.contractFactory.smartPool({ address, network: this.network });
  }

  async getUnderlyingTokenDefinitions(): Promise<string> {
    return [{ address: '0x4fbb350052bca5417566f188eb2ebce5b19bc964', network: this.network }];
  }

  async getPricePerShare() {
    return [1];
  }

  async getLabel(): Promise<string> {
    return `Smart`;
  }
}
