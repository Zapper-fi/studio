import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

import { AmpStakingResolver } from '../common/amp.staking-resolver';
import { AmpViemContractFactory } from '../contracts';
import { AmpStaking } from '../contracts/viem';

@PositionTemplate()
export class EthereumAmpFarmContractPositionFetcher extends ContractPositionTemplatePositionFetcher<AmpStaking> {
  groupLabel = 'Flexa Capacity';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AmpStakingResolver) protected readonly ampStakingResolver: AmpStakingResolver,
    @Inject(AmpViemContractFactory) protected readonly contractFactory: AmpViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.ampStaking({ address, network: this.network });
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    return [{ address: '0x706d7f8b3445d8dfc790c524e3990ef014e7c578' }];
  }

  async getTokenDefinitions() {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: '0xff20817765cb7f73d4bde2e66e067e58d11095c2',
        network: this.network,
      },
      //add second position to represent earned rewards that are not claimable and auto compounded
      //we do not want claimable label on front end, using LOCKED for now
      {
        metaType: MetaType.LOCKED,
        address: '0xff20817765cb7f73d4bde2e66e067e58d11095c2',
        network: this.network,
      },
    ];
  }

  async getTokenBalancesPerPosition({ address }: GetTokenBalancesParams<AmpStaking>): Promise<BigNumberish[]> {
    const { supplyTotal, rewardTotal } = await this.ampStakingResolver.getBalance(address);
    return rewardTotal > supplyTotal ? [0, 0] : [supplyTotal, rewardTotal];
  }

  async getLabel() {
    return this.ampStakingResolver.getStakingLabel();
  }
}
