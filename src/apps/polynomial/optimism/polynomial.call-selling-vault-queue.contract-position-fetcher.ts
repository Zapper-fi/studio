import { Inject } from '@nestjs/common';
import { BigNumber, BigNumberish, ethers } from 'ethers';
import { min, range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetTokenDefinitionsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

import { isUnderlyingDenominated } from '../common/formatters';
import { PolynomialApiHelper } from '../common/polynomial.api';
import { PolynomialViemContractFactory } from '../contracts';
import { PolynomialCoveredCall } from '../contracts/viem';

@PositionTemplate()
export class OptimismPolynomialCallSellingVaultQueueContractPositionFetcher extends ContractPositionTemplatePositionFetcher<PolynomialCoveredCall> {
  groupLabel = 'Call Selling Vault Queue';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PolynomialViemContractFactory) protected readonly contractFactory: PolynomialViemContractFactory,
    @Inject(PolynomialApiHelper) protected readonly apiHelper: PolynomialApiHelper,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.polynomialCoveredCall({ address, network: this.network });
  }

  async getDefinitions() {
    const vaults = await this.apiHelper.getVaults();
    const coveredCallVaults = vaults.filter(vault => isUnderlyingDenominated(vault.vaultId));
    return coveredCallVaults.map(vault => ({ address: vault.vaultAddress, label: vault.vaultId }));
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<PolynomialCoveredCall>) {
    return [
      { metaType: MetaType.SUPPLIED, address: await contract.read.UNDERLYING(), network: this.network },
      { metaType: MetaType.CLAIMABLE, address: await contract.read.VAULT_TOKEN(), network: this.network },
    ];
  }

  async getLabel({ contract }: GetDisplayPropsParams<PolynomialCoveredCall, DefaultDataProps>) {
    return ethers.utils.parseBytes32String(await contract.read.name());
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
  }: GetTokenBalancesParams<PolynomialCoveredCall, DefaultDataProps>): Promise<BigNumberish[]> {
    const [depositHead, depositTail, withdrawalHead, withdrawalTail] = await Promise.all([
      contract.read.queuedDepositHead(),
      contract.read.nextQueuedDepositId(),
      contract.read.queuedWithdrawalHead(),
      contract.read.nextQueuedWithdrawalId(),
    ]);

    // Note: ignores pending withdrawals/deposits when queue is large (>250)
    const depositRange = range(Number(depositHead), min([Number(depositHead) + 250, Number(depositTail)]));
    const withdrawalRange = range(Number(withdrawalHead), min([Number(withdrawalHead) + 250, Number(withdrawalTail)]));
    const pendingDeposits = await Promise.all(depositRange.map(async i => contract.read.depositQueue([i])));
    const pendingWithdrawals = await Promise.all(withdrawalRange.map(async i => contract.read.withdrawalQueue([i])));

    const userPendingDeposits = pendingDeposits
      .filter(deposit => deposit.user.toLowerCase() === address.toLowerCase())
      .filter(deposit => !Number(deposit.mintedTokens));

    const userPendingWithdrawals = pendingWithdrawals
      .filter(withdrawal => withdrawal.user.toLowerCase() === address.toLowerCase())
      .filter(withdrawal => !Number(withdrawal.returnedAmount));

    const depositBalance = userPendingDeposits.reduce((acc, v) => acc.add(v.depositedAmount), BigNumber.from(0));
    const withdrawalBalance = userPendingWithdrawals.reduce((acc, v) => acc.add(v.withdrawnTokens), BigNumber.from(0));

    return [depositBalance, withdrawalBalance];
  }
}
