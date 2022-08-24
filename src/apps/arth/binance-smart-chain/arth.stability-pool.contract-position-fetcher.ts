import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Register } from '~app-toolkit/decorators';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import {
  ContractPositionTemplatePositionFetcher,
  DefaultContractPositionDescriptor,
  DisplayPropsStageParams,
  GetTokenBalancesPerPositionParams,
} from '~position/template/contract-position.template.position-fetcher';
import { Network } from '~types';

import ARTH_DEFINITION from '../arth.definition';
import { ArthContractFactory, StabilityPool } from '../contracts';

const appId = ARTH_DEFINITION.id;
const groupId = ARTH_DEFINITION.groups.stabilityPool.id;
const network = Network.BINANCE_SMART_CHAIN_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class BinanceSmartChainArthStabilityPoolContractPositionFetcher extends ContractPositionTemplatePositionFetcher<StabilityPool> {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Stability Pool';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ArthContractFactory) protected readonly contractFactory: ArthContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): StabilityPool {
    return this.contractFactory.stabilityPool({ address, network: this.network });
  }

  async getDescriptors(): Promise<DefaultContractPositionDescriptor[]> {
    return [{ address: '0x61a787b3e2ee1e410310fc7c4a9f6c77430e1b57' }];
  }

  async getTokenDescriptors() {
    return [
      { metaType: MetaType.SUPPLIED, address: '0x85dab10c3ba20148ca60c2eb955e1f8ffe9eaa79' }, // ARTH
      { metaType: MetaType.CLAIMABLE, address: ZERO_ADDRESS }, // BNB
      { metaType: MetaType.CLAIMABLE, address: '0xce86f7fcd3b40791f63b86c3ea3b8b355ce2685b' }, // MAHA
    ];
  }

  async getLabel({ contractPosition }: DisplayPropsStageParams<StabilityPool>): Promise<string> {
    return `${getLabelFromToken(contractPosition.tokens[0])} Stability Pool`;
  }

  getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesPerPositionParams<StabilityPool>) {
    return Promise.all([
      contract.getCompoundedARTHDeposit(address),
      contract.getDepositorETHGain(address),
      contract.getDepositorMAHAGain(address),
    ]);
  }
}
