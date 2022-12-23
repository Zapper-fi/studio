import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { map, min, range, sumBy } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

export type PolynomialOptionContractPositionDefinition = {
  address: string;
  suppliedTokenAddress: string;
  rewardTokenAddress: string;
  isCall: boolean;
  name: string;
};

import { PolynomialVaultTokenDefinitionsResolver } from '../common/polynomial.vault.token-definition-resolver';
import { PolynomialContractFactory, PolynomialCoveredCall } from '../contracts';

@PositionTemplate()
export class OptimismPolynomialVaultsContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  PolynomialCoveredCall,
  DefaultDataProps,
  PolynomialOptionContractPositionDefinition
> {
  groupLabel = 'Covered Calls';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PolynomialContractFactory) private readonly contractFactory: PolynomialContractFactory,
    @Inject(PolynomialVaultTokenDefinitionsResolver)
    private readonly vaultDefinitionResolver: PolynomialVaultTokenDefinitionsResolver,
  ) {
    super(appToolkit);
  }

  async getDefinitions(): Promise<PolynomialOptionContractPositionDefinition[]> {
    const vaultDefinitonsRaw = await this.vaultDefinitionResolver.getVaultDefinitions(this.network);

    const definitions = vaultDefinitonsRaw.map(vault => {
      return {
        address: vault.address,
        suppliedTokenAddress: vault.underlyingTokenAddress,
        rewardTokenAddress: vault.tokenAddress,
        isCall: vault.underlyingDominated,
        name: vault.vaultId,
      };
    });

    return definitions;
  }

  async getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<PolynomialCoveredCall, PolynomialOptionContractPositionDefinition>) {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: definition.suppliedTokenAddress,
        network: this.network,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: definition.rewardTokenAddress,
        network: this.network,
      },
    ];
  }

  getContract(address: string): PolynomialCoveredCall {
    return this.contractFactory.polynomialCoveredCall({ network: this.network, address });
  }

  async getLabel({
    definition,
  }: GetDisplayPropsParams<
    PolynomialCoveredCall,
    DefaultDataProps,
    PolynomialOptionContractPositionDefinition
  >): Promise<string> {
    return definition.name;
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
    multicall,
  }: GetTokenBalancesParams<PolynomialCoveredCall>): Promise<BigNumberish[]> {
    // supplied
    const [depositHead, depositTail] = (
      await Promise.all([multicall.wrap(contract).queuedDepositHead(), multicall.wrap(contract).nextQueuedDepositId()])
    ).map(Number);

    const pendingDeposits = await Promise.all(
      map(range(depositHead, min([depositHead + 250, depositTail])), async i =>
        multicall.wrap(contract).depositQueue(i),
      ),
    );
    const pendingDepositBalance = sumBy(pendingDeposits, deposit => {
      // Note: ignores partial deposits
      if (deposit.user.toLowerCase() === address.toLowerCase() && !Number(deposit.mintedTokens)) {
        return Number(deposit.depositedAmount);
      }
      return 0;
    });

    // rewards
    const [withdrawalHead, withdrawalTail] = (
      await Promise.all([
        multicall.wrap(contract).queuedWithdrawalHead(),
        multicall.wrap(contract).nextQueuedWithdrawalId(),
      ])
    ).map(Number);
    const pendingWithdrawals = await Promise.all(
      map(range(withdrawalHead, min([withdrawalHead + 250, withdrawalTail])), async i =>
        multicall.wrap(contract).withdrawalQueue(i),
      ),
    );
    const pendingWithdrawalBalance = sumBy(pendingWithdrawals, withdrawal => {
      // Note: ignores partial withdrawals
      if (withdrawal.user.toLowerCase() === address.toLowerCase() && !Number(withdrawal.returnedAmount)) {
        return Number(withdrawal.withdrawnTokens);
      }
      return 0;
    });

    return [pendingDepositBalance, pendingWithdrawalBalance];
  }
}
