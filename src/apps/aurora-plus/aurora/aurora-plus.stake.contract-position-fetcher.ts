import { Inject } from '@nestjs/common';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { GetTokenBalancesParams, GetTokenDefinitionsParams } from '~position/template/contract-position.template.types';

import { AuroraPlusContractFactory, Staking } from '../contracts';

const rewardTokenToIgnore = ['0x6ede987a51d7b4d3945e7a76af59ff2b968910a8'];

@PositionTemplate()
export class AuroraAuroraPlusStakeContractPositionFetcher extends ContractPositionTemplatePositionFetcher<Staking> {
  groupLabel = 'Staked Aurora';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AuroraPlusContractFactory) protected readonly contractFactory: AuroraPlusContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): Staking {
    return this.contractFactory.staking({ address, network: this.network });
  }

  async getDefinitions() {
    return [{ address: '0xccc2b1ad21666a5847a804a73a41f904c4a4a0ec' }];
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<Staking>) {
    const streamCount = await contract.getStreamsCount();
    const streamIDs = range(0, streamCount.toNumber());
    const rewardTokenAddressesRaw = await Promise.all(
      streamIDs.map((streamID: number) => contract.getStream(streamID).then(r => r.rewardToken.toLowerCase())),
    );

    const rewardTokenAddresses = rewardTokenAddressesRaw.filter(token => !rewardTokenToIgnore.includes(token));

    return [
      {
        metaType: MetaType.SUPPLIED,
        address: '0x8bec47865ade3b172a928df8f990bc7f2a3b9f79',
        network: this.network,
      },
      ...rewardTokenAddresses.map(address => ({
        metaType: MetaType.CLAIMABLE,
        address,
        network: this.network,
      })),
    ];
  }

  async getLabel() {
    return `Staked AURORA`;
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<Staking>) {
    const streamCount = await contract.getStreamsCount();
    const streamIDs = range(0, streamCount.toNumber());
    const rewardTokenValuesRaw = await Promise.all(streamIDs.map(streamID => contract.getPending(streamID, address)));
    const depositAmount = await contract.getUserTotalDeposit(address);

    return [depositAmount, ...rewardTokenValuesRaw];
  }
}
