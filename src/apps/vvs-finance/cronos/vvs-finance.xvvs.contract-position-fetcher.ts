import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { VvsFinanceContractFactory, VvsBoost } from '../contracts';
import type { XvvsVaultContractPositionDataProps } from '../types';
import { VVS_FINANCE_DEFINITION } from '../vvs-finance.definition';

const ONE_DAY = 60 * 60 * 24;

const appId = VVS_FINANCE_DEFINITION.id;
const groupId = VVS_FINANCE_DEFINITION.groups.xvvsVault.id;
const network = Network.CRONOS_MAINNET;
const dependencies = [{ appId, groupIds: [VVS_FINANCE_DEFINITION.groups.xvvs.id], network }];

const vvsBoostAddress = '0x990e9683e6ba5079cdb235838856029a50dad84c';

@Register.ContractPositionFetcher({ appId, groupId, network })
export class CronosVvsFinanceXvvsVaultContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(VvsFinanceContractFactory) private readonly contractFactory: VvsFinanceContractFactory,
  ) {}

  async getPositions(): Promise<ContractPosition<XvvsVaultContractPositionDataProps>[]> {
    const multicall = this.appToolkit.getMulticall(network);
    const vvsBoostContract = this.contractFactory.vvsBoost({ network, address: vvsBoostAddress });
    const depositTokenAddress = await multicall.wrap(vvsBoostContract).xvvs();
    const appTokens = await this.appToolkit.getAppTokenPositions(...dependencies);
    const depositToken = appTokens.find(t => t.address === depositTokenAddress.toLowerCase());
    if (!depositToken) return [];

    const poolLength = Number(await multicall.wrap(vvsBoostContract).poolLength());
    const claimablePoolIndex = poolLength; // additional position as pending claimable

    return this.appToolkit.helpers.masterChefContractPositionHelper
      .getContractPositions<VvsBoost>({
        network,
        groupId,
        appId,
        address: vvsBoostAddress,
        dependencies,
        resolveContract: () => vvsBoostContract,
        resolvePoolLength: () => poolLength + 1,
        resolveDepositTokenAddress: async () => depositTokenAddress,
        resolveRewardTokenAddresses: ({ multicall, contract }) => multicall.wrap(contract).vvs(),
      })
      .then(positions =>
        Promise.all(
          positions.map(async position => {
            if (position.dataProps.poolIndex !== claimablePoolIndex) {
              const { multiplier, lockPeriod, totalStaked } = await multicall
                .wrap(vvsBoostContract)
                .poolInfo(position.dataProps.poolIndex);

              return {
                ...position,
                dataProps: {
                  ...position.dataProps,
                  isActive: true,
                  isClaimable: false,
                  poolInfo: {
                    multiplier: multiplier.toNumber(),
                    lockPeriod: lockPeriod.toNumber(),
                    totalStaked: Number(totalStaked) / Math.pow(10, depositToken.decimals),
                  },
                },
                displayProps: {
                  ...position.displayProps,
                  label: this.getLabel(lockPeriod),
                },
              };
            } else {
              return {
                ...position,
                dataProps: {
                  ...position.dataProps,
                  isActive: true,
                  isClaimable: true,
                },
                displayProps: {
                  ...position.displayProps,
                  label: 'Pending Vault Reward',
                },
              };
            }
          }),
        ),
      );
  }

  private getLabel(lockPeriod: BigNumber): string {
    const lockPeriodDays = lockPeriod.toNumber() / ONE_DAY;

    if (lockPeriodDays >= 365) {
      return `${Math.floor(lockPeriodDays / 365)} Years Vault`;
    } else if (lockPeriodDays >= 30) {
      return `${Math.floor(lockPeriodDays / 30)} Months Vault`;
    } else {
      return `${Math.floor(lockPeriodDays)} Days Vault`;
    }
  }
}
