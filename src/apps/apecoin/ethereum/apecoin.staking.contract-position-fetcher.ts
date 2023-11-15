import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { merge, sumBy } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import { DefaultDataProps } from '~position/display.interface';
import { ContractPositionBalance, RawContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import { DefaultContractPositionDefinition } from '~position/template/contract-position.template.types';
import { CustomContractPositionTemplatePositionFetcher } from '~position/template/custom-contract-position.template.position-fetcher';

import { ApecoinViemContractFactory } from '../contracts';
import { ApecoinStaking } from '../contracts/viem';

enum PoolTypes {
  APECOIN = 0,
  BAYC = 1,
  MAYC = 2,
  BAKC = 3,
}

const POOL_LABEL_PREFIXES = {
  [PoolTypes.APECOIN]: 'Apecoin (APE) Pool',
  [PoolTypes.BAYC]: 'Bored Ape (BAYC) Pool',
  [PoolTypes.MAYC]: 'Mutant (MAYC) Pool',
  [PoolTypes.BAKC]: 'Paired (BAKC) Pool',
};

@PositionTemplate()
export class EthereumApecoinStakingContractPositionFetcher extends CustomContractPositionTemplatePositionFetcher<ApecoinStaking> {
  groupLabel = 'Staking';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ApecoinViemContractFactory) private readonly contractFactory: ApecoinViemContractFactory,
  ) {
    super(appToolkit);
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    return [{ address: '0x5954ab967bc958940b7eb73ee84797dc8a2afbb9' }];
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

  getContract(address: string) {
    return this.contractFactory.apecoinStaking({ network: this.network, address });
  }

  async getLabel(): Promise<string> {
    return `Staked Apecoin`;
  }

  async getTokenBalancesPerPosition(): Promise<BigNumberish[]> {
    throw new Error('Method not implemented.');
  }

  async getBalances(address: string): Promise<ContractPositionBalance<DefaultDataProps>[]> {
    const multicall = this.appToolkit.getViemMulticall(this.network);

    const contractPositions = await this.appToolkit.getAppContractPositions({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    const contractPosition = contractPositions[0];
    if (!contractPosition) return [];

    const stakingContract = this.contractFactory.apecoinStaking(contractPosition);
    const positions = await multicall.wrap(stakingContract).read.getAllStakes([address]);
    if (positions.length === 0) return [];

    const allPositions = await Promise.all(
      positions.map(async position => {
        const depositAmountRaw = position.deposited;
        const claimableAmountRaw = position.unclaimed;
        const [depositToken, claimableToken] = contractPosition.tokens;

        const tokens = [
          drillBalance(depositToken, depositAmountRaw.toString()),
          drillBalance(claimableToken, claimableAmountRaw.toString()),
        ];
        const balanceUSD = sumBy(tokens, v => v.balanceUSD);
        const positionKey = `${position.poolId}:${position.tokenId}`;

        let labelSuffix = `${POOL_LABEL_PREFIXES[Number(position.poolId)]}`;
        if (Number(position.tokenId) > 0) labelSuffix += `, Token ID #${position.tokenId}`;
        const label = `Staked APE in ${labelSuffix}`;

        const contractPositionBalance = merge({}, contractPosition, {
          tokens,
          balanceUSD,
          dataProps: { positionKey },
          displayProps: { label },
        });

        return contractPositionBalance;
      }),
    );

    return allPositions.flat();
  }

  async getRawBalances(address: string): Promise<RawContractPositionBalance[]> {
    const multicall = this.appToolkit.getViemMulticall(this.network);

    const contractPositions = await this.appToolkit.getAppContractPositions({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    const contractPosition = contractPositions[0];
    if (!contractPosition) return [];

    const stakingContract = this.contractFactory.apecoinStaking(contractPosition);
    const positions = await multicall.wrap(stakingContract).read.getAllStakes([address]);
    if (positions.length === 0) return [];

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
