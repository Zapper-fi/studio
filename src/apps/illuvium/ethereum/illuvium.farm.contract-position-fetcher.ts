import { Inject } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { isSupplied } from '~position/position.utils';
import { GetTokenBalancesParams, GetTokenDefinitionsParams } from '~position/template/contract-position.template.types';
import { SingleStakingFarmDynamicTemplateContractPositionFetcher } from '~position/template/single-staking.dynamic.template.contract-position-fetcher';

import { IlluviumContractFactory, IlluviumCorePool } from '../contracts';

@PositionTemplate()
export class EthereumIlluviumFarmContractPositionFetcher extends SingleStakingFarmDynamicTemplateContractPositionFetcher<IlluviumCorePool> {
  groupLabel = 'Staking';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(IlluviumContractFactory) protected readonly contractFactory: IlluviumContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): IlluviumCorePool {
    return this.contractFactory.illuviumCorePool({ address, network: this.network });
  }

  getFarmAddresses() {
    return ['0x25121eddf746c884dde4619b573a7b10714e2a36', '0x8b4d8443a0229349a9892d4f7cbe89ef5f843f72'];
  }

  getStakedTokenAddress({ contract }: GetTokenDefinitionsParams<IlluviumCorePool>) {
    return contract.poolToken();
  }

  getRewardTokenAddresses({ contract }: GetTokenDefinitionsParams<IlluviumCorePool>) {
    return contract.ilv();
  }

  async getRewardRates() {
    return 0;
  }

  async getStakedTokenBalance({ address, contract, contractPosition }: GetTokenBalancesParams<IlluviumCorePool>) {
    const stakedToken = contractPosition.tokens.find(isSupplied)!;

    const v2StakingAddress = '0x7f5f854ffb6b7701540a00c69c4ab2de2b34291d';
    const v2StakingContract = this.contractFactory.illuviumIlvPoolV2({
      address: v2StakingAddress,
      network: this.network,
    });

    // For the V1 ILV farm, deduct deposits made after the last V1 yield
    let voidAmountBN = new BigNumber(0);
    if (stakedToken.symbol === 'ILV') {
      const LAST_V1_YIELD_CREATED = 1642660625;
      const depositsLength = Number(await contract.getDepositsLength(address));
      const depositIndexes = range(0, depositsLength);
      const deposits = await Promise.all(depositIndexes.map(v => contract.getDeposit(address, v)));
      const v1YieldMinted = await Promise.all(depositIndexes.map(v => v2StakingContract.v1YieldMinted(address, v)));

      const voidDeposits = deposits.filter((v, i) => {
        const isAfterLastV1Yield = Number(v.lockedFrom) > LAST_V1_YIELD_CREATED;
        const isV1YieldMinted = v1YieldMinted[i];
        return v.isYield && (isAfterLastV1Yield || isV1YieldMinted);
      });

      voidAmountBN = voidDeposits.reduce((acc, v) => acc.plus(v.tokenAmount.toString()), new BigNumber(0));
    }

    const stakedBalance = await contract.balanceOf(address);
    return new BigNumber(stakedBalance.toString()).minus(voidAmountBN).toString();
  }

  async getRewardTokenBalances() {
    return 0;
  }
}
