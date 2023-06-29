import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { DefaultAppTokenDataProps } from '~position/template/app-token.template.types';
import { AppTokenPositionBalance } from '~position/position-balance.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import { BigNumberish } from 'ethers';
import { DhedgeV2PoolTokenFetcher } from '~apps/dhedge-v2/common/dhedge-v2.pool.token-fetcher';

@PositionTemplate()
export class OptimismDhedgeV2StakingV2TokenFetcher extends DhedgeV2PoolTokenFetcher {
  groupLabel = 'Staking V2';

  factoryAddress = '0x5e61a079a178f0e5784107a4963baae0c5a680c6';
  underlyingTokenAddress = '0x8c6f28f2f1a3c87f0f938b96d27520d9751ec8d9';
  stakingV2ContractAddress: "0xf165ca3d75120d817b7428eef8c39ea5cb33b612";

  getStakingV2Contract() {
    return this.contractFactory.dhedgeV2StakingV2({ address: this.stakingV2ContractAddress, network: this.network });
  }

  async getStakes(address: string) {
    const stakingV2Contract = this.getStakingV2Contract();
    const stakes = new Map<string, BigNumberish>();

    const balance = await stakingV2Contract.balanceOf(address);

    for (const index of Array.from(Array(balance.toNumber()).keys())) {
      const stakeId = await stakingV2Contract.tokenOfOwnerByIndex(address, index);
      const stake = await stakingV2Contract.getStake(stakeId._hex);
      const tokenAddress = stake.dhedgePoolAddress.toLowerCase();
      const tokenAmount = stake.dhedgePoolAmount;
      stakes.set(tokenAddress, tokenAmount);
    }
    return stakes;
  }

  async getBalances(_address: string): Promise<AppTokenPositionBalance<DefaultAppTokenDataProps>[]> {
    const address = await this.getAccountAddress(_address);
    const appTokens = await this.getPositionsForBalances();
    if (address === ZERO_ADDRESS) return [];

    const stakes = await this.getStakes(address);

    const balances = appTokens.map(appToken => {
      const balanceStaked = stakes.get(appToken.address);
      let formattedBalanceStaked;

      if (typeof balanceStaked === undefined || balanceStaked === null) {
        formattedBalanceStaked = '0';
      } else {
        formattedBalanceStaked = balanceStaked;
      }
      return drillBalance(appToken, formattedBalanceStaked.toString(), { isDebt: this.isDebt });
    })
    return balances as AppTokenPositionBalance<DefaultAppTokenDataProps>[];
  }
}
