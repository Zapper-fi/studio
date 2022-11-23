import { Inject, NotImplementedException } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { RawContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { DefaultContractPositionDefinition } from '~position/template/contract-position.template.types';

import { ApecoinContractFactory, ApecoinStaking } from '../contracts';

@PositionTemplate()
export class EthereumApecoinStakingContractPositionFetcher extends ContractPositionTemplatePositionFetcher<ApecoinStaking> {
  groupLabel = 'Staking';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ApecoinContractFactory) private readonly contractFactory: ApecoinContractFactory,
  ) {
    super(appToolkit);
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    return [{ address: '0x831e0c7a89dbc52a1911b78ebf4ab905354c96ce' }]; // to be replaced with the address of the contract on ethereum
  }

  async getTokenDefinitions() {
    const apecoinAddress = '0x4d224452801aced8b2f0aebe155379bb5d594381';
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: apecoinAddress,
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: apecoinAddress,
        network: this.network,
      },
    ];
  }

  getContract(address: string): ApecoinStaking {
    return this.contractFactory.apecoinStaking({ network: this.network, address });
  }

  async getLabel(): Promise<string> {
    return `Staked Apecoin`;
  }

  getTokenBalancesPerPosition(): never {
    throw new NotImplementedException();
  }

  async getRawBalances(address: string): Promise<RawContractPositionBalance[]> {
    const multicall = this.appToolkit.getMulticall(this.network);
    const stakingContract = this.contractFactory.apecoinStaking({ address, network: this.network });
    const positions = await multicall.wrap(stakingContract).getAllStakes(address);

    const contractPositions = await this.appToolkit.getAppContractPositions({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    return (
      await Promise.all(
        positions
          .map(async position => {
            const depositAmountRaw = position.deposited;
            const claimableAmountRaw = position.unclaimed;

            return [
              {
                key: this.appToolkit.getPositionKey(contractPositions[0]),
                tokens: [
                  {
                    key: this.appToolkit.getPositionKey(contractPositions[0].tokens[0]),
                    balance: depositAmountRaw.toString(),
                  },
                  {
                    key: `${this.appToolkit.getPositionKey(contractPositions[0].tokens[1])}-claimable`,
                    balance: claimableAmountRaw.toString(),
                  },
                ],
              },
            ];
          })
          .flat(),
      )
    ).flat();
  }
}
