import { Inject, NotImplementedException } from '@nestjs/common';
import _, { compact, range } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DefaultDataProps } from '~position/display.interface';
import { ContractPositionBalance, RawContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import { GetDisplayPropsParams } from '~position/template/contract-position.template.types';
import { CustomContractPositionTemplatePositionFetcher } from '~position/template/custom-contract-position.template.position-fetcher';

import { RocketPoolViemContractFactory } from '../contracts';
import { RocketNodeDeposit } from '../contracts/viem';

@PositionTemplate()
export class EthereumRocketPoolMinipoolContractPositionFetcher extends CustomContractPositionTemplatePositionFetcher<RocketNodeDeposit> {
  groupLabel = 'Minipools';

  minipoolManagerAddress = '0x6293b8abc1f36afb22406be5f96d893072a8cf3a';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(RocketPoolViemContractFactory) protected readonly contractFactory: RocketPoolViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.rocketNodeDeposit({ address, network: this.network });
  }

  async getDefinitions() {
    return [{ address: '0x1cc9cf5586522c6f483e84a19c3c2b0b6d027bf0' }];
  }

  async getTokenDefinitions() {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: ZERO_ADDRESS,
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<RocketNodeDeposit>) {
    return `Staked ${getLabelFromToken(contractPosition.tokens[0])}`;
  }

  getTokenBalancesPerPosition(): never {
    throw new NotImplementedException();
  }

  async getBalances(address: string): Promise<ContractPositionBalance<DefaultDataProps>[]> {
    const multicall = this.appToolkit.getViemMulticall(this.network);
    const miniPoolManager = this.contractFactory.rocketMinipoolManager({
      address: this.minipoolManagerAddress,
      network: this.network,
    });

    const contractPositions = await this.appToolkit.getAppContractPositions({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    const numPositionsRaw = await multicall.wrap(miniPoolManager).read.getNodeMinipoolCount([address]);

    const balances = await Promise.all(
      range(0, Number(numPositionsRaw)).map(async index => {
        const miniPoolAddress = await multicall.wrap(miniPoolManager).read.getNodeMinipoolAt([address, BigInt(index)]);

        const miniPoolContract = this.contractFactory.rocketMinipool({
          address: miniPoolAddress,
          network: this.network,
        });

        const isFinalized = await multicall.wrap(miniPoolContract).read.getFinalised();
        if (isFinalized) return null;

        const depositAmountRaw = await multicall.wrap(miniPoolContract).read.getNodeDepositBalance();
        const depositAmount = drillBalance(contractPositions[0].tokens[0], depositAmountRaw.toString());

        return {
          ...contractPositions[0],
          tokens: [depositAmount],
          balanceUSD: depositAmount.balanceUSD,
        };
      }),
    );

    return _.compact(balances);
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

    const minipoolManagerContract = this.contractFactory.rocketMinipoolManager({
      address: this.minipoolManagerAddress,
      network: this.network,
    });
    const minipoolCount = await multicall.wrap(minipoolManagerContract).read.getNodeMinipoolCount([address]);

    const minipoolAddresses = await Promise.all(
      range(0, Number(minipoolCount)).map(async i =>
        multicall.wrap(minipoolManagerContract).read.getNodeMinipoolAt([address, BigInt(i)]),
      ),
    );
    if (minipoolAddresses.length === 0) return [];

    return compact(
      await Promise.all(
        minipoolAddresses
          .map(async address => {
            const minipoolContract = this.contractFactory.rocketMinipool({ address, network: this.network });

            const isFinalized = await multicall.wrap(minipoolContract).read.getFinalised();
            if (isFinalized) return null;

            const nodeDepositBalance = await multicall.wrap(minipoolContract).read.getNodeDepositBalance();

            return [
              {
                key: this.appToolkit.getPositionKey(contractPosition),
                tokens: [
                  {
                    key: this.appToolkit.getPositionKey(contractPosition.tokens[0]),
                    balance: nodeDepositBalance.toString(),
                  },
                ],
              },
            ];
          })
          .flat(),
      ),
    ).flat();
  }
}
