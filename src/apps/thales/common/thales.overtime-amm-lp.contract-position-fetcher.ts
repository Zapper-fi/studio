import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { GetTokenBalancesParams, GetTokenDefinitionsParams } from '~position/template/contract-position.template.types';

import { OvertimeAmmLp, ThalesContractFactory } from '../contracts';

export abstract class ThalesOvertimeAmmLpContractPositionFetcher extends ContractPositionTemplatePositionFetcher<OvertimeAmmLp> {
  groupLabel = 'Overtime AMM LP';
  abstract contractAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ThalesContractFactory) private readonly contractFactory: ThalesContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): OvertimeAmmLp {
    return this.contractFactory.overtimeAmmLp({ network: this.network, address });
  }

  async getDefinitions() {
    return [{ address: this.contractAddress }];
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<OvertimeAmmLp>) {
    return [
      {
        address: await contract.sUSD(),
        metaType: MetaType.SUPPLIED,
        network: this.network,
      },
    ];
  }

  async getLabel() {
    return 'Overtime AMM LP';
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
  }: GetTokenBalancesParams<OvertimeAmmLp>): Promise<BigNumberish[]> {
    const currentRound = await contract.round();
    const currentBalance = await contract.balancesPerRound(Number(currentRound), address);
    const pendingDeposit = await contract.balancesPerRound(Number(currentRound) + 1, address);

    return [currentBalance.add(pendingDeposit)];
  }
}
