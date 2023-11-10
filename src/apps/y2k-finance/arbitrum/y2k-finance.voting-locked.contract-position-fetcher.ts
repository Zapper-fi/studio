import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDefinitionsParams,
  DefaultContractPositionDefinition,
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

import { Y2KFinanceViemContractFactory } from '../contracts';
import { Y2KFinanceVotingLocked } from '../contracts/viem';

const VLY2K = [
  {
    address: '0xbdaa858fd7b0dc05f8256330facb35de86283ca0',
  },
  {
    address: '0xaefd22d0153e69f3316dca9095e7279b3a2f8af2',
  },
];

@PositionTemplate()
export class ArbitrumY2KFinanceVotingLockedContractPositionFetcher extends ContractPositionTemplatePositionFetcher<Y2KFinanceVotingLocked> {
  groupLabel = 'Vote Locked Y2K';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(Y2KFinanceViemContractFactory) protected readonly contractFactory: Y2KFinanceViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.y2KFinanceVotingLocked({ address, network: this.network });
  }

  async getDefinitions(_params: GetDefinitionsParams): Promise<DefaultContractPositionDefinition[]> {
    return VLY2K;
  }

  async getTokenDefinitions(
    params: GetTokenDefinitionsParams<Y2KFinanceVotingLocked, DefaultContractPositionDefinition>,
  ): Promise<UnderlyingTokenDefinition[] | null> {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: await params.contract.read.lockToken(),
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: (await params.contract.read.rewardToken([BigInt(0)]))[0],
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: (await params.contract.read.rewardToken([BigInt(1)]))[0],
        network: this.network,
      },
    ];
  }

  async getLabel(
    params: GetDisplayPropsParams<Y2KFinanceVotingLocked, DefaultDataProps, DefaultContractPositionDefinition>,
  ): Promise<string> {
    const epochs = await params.contract.read.minEpochs();
    return `Lock${epochs.toString()}Rewards`;
  }

  async getTokenBalancesPerPosition(
    params: GetTokenBalancesParams<Y2KFinanceVotingLocked, DefaultDataProps>,
  ): Promise<BigNumberish[]> {
    const info = await params.contract.read.getAccount([params.address]);
    return [info[0], info[3], info[4]];
  }
}
