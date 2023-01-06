import { Inject } from '@nestjs/common';
import { BigNumber, BigNumberish } from 'ethers';
import { min, range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetTokenDefinitionsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

import { PolynomialContractFactory, PolynomialCoveredCall } from '../contracts';
import { isUnderlyingDenominated } from '../helpers/formatters';
import { PolynomialApiHelper } from '../helpers/polynomial.api';

type PolynomialPutSellingVaultDefinition = {
  address: string;
  label: string;
};

export class OptimismPolynomialPutSellingVaultContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  PolynomialCoveredCall,
  DefaultDataProps,
  PolynomialPutSellingVaultDefinition
> {
  groupLabel = 'Put Selling Vaults';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PolynomialContractFactory) protected readonly contractFactory: PolynomialContractFactory,
    @Inject(PolynomialApiHelper) protected readonly apiHelper: PolynomialApiHelper,
  ) {
    super(appToolkit);
  }

  getContract(address: string): PolynomialCoveredCall {
    return this.contractFactory.polynomialCoveredCall({ address, network: this.network });
  }

  async getDefinitions() {
    const vaults = await this.apiHelper.getVaults();
    const putSellingVaults = vaults.filter(vault => !isUnderlyingDenominated(vault.vaultId));
    return putSellingVaults.map(vault => ({ address: vault.vaultAddress, label: vault.vaultId }));
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<PolynomialCoveredCall>) {
    return [
      { metaType: MetaType.SUPPLIED, address: await contract.UNDERLYING(), network: this.network },
      { metaType: MetaType.CLAIMABLE, address: await contract.VAULT_TOKEN(), network: this.network },
    ];
  }

  async getLabel({
    definition,
  }: GetDisplayPropsParams<PolynomialCoveredCall, DefaultDataProps, PolynomialPutSellingVaultDefinition>) {
    return definition.label;
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
  }: GetTokenBalancesParams<PolynomialCoveredCall, DefaultDataProps>): Promise<BigNumberish[]> {
    const [depositHead, depositTail, withdrawalHead, withdrawalTail] = await Promise.all([
      contract.queuedDepositHead(),
      contract.nextQueuedDepositId(),
      contract.queuedWithdrawalHead(),
      contract.nextQueuedWithdrawalId(),
    ]);

    // Note: ignores pending withdrawals/deposits when queue is large (>250)
    const depositRange = range(Number(depositHead), min([Number(depositHead) + 250, Number(depositTail)]));
    const withdrawalRange = range(Number(withdrawalHead), min([Number(withdrawalHead) + 250, Number(withdrawalTail)]));
    const pendingDeposits = await Promise.all(depositRange.map(async i => contract.depositQueue(i)));
    const pendingWithdrawals = await Promise.all(withdrawalRange.map(async i => contract.withdrawalQueue(i)));

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
