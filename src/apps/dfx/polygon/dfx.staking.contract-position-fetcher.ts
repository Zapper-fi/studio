import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { DfxStakingContractPositionFetcher } from '../common/dfx.staking.contract-position-fetcher';

@PositionTemplate()
export class PolygonDfxStakingContractPositionFetcher extends DfxStakingContractPositionFetcher {
  groupLabel = 'DFX Staking';
  stakingDefinitions = [
    {
      address: '0xa523959588e51b5bea8d39fd861ab34101181a19',
      stakedTokenAddress: '0x288ab1b113c666abb097bb2ba51b8f3759d7729e',
      rewardTokenAddress: '0xe7804d91dfcde7f776c90043e03eaa6df87e6395',
    },
    {
      address: '0x419062c0dbec658a943333bc783617c58d25f316',
      stakedTokenAddress: '0xb72d390e07f40d37d42dfcc43e954ae7c738ad44',
      rewardTokenAddress: '0xe7804d91dfcde7f776c90043e03eaa6df87e6395',
    },
    {
      address: '0x600e825f058a93146acd5877084e7d4525c5d846',
      stakedTokenAddress: '0x8e3e9cb46e593ec0caf4a1dcd6df3a79a87b1fd7',
      rewardTokenAddress: '0xe7804d91dfcde7f776c90043e03eaa6df87e6395',
    },
    {
      address: '0x308ce99a085a25a9c3d0f2b96bb511017e955711',
      stakedTokenAddress: '0x931d6a6cc3f992beee80a1a14a6530d34104b000',
      rewardTokenAddress: '0xe7804d91dfcde7f776c90043e03eaa6df87e6395',
    },
    {
      address: '0x19914181a811ab9eb25c81d6df1972bf02c45cbe',
      stakedTokenAddress: '0xea75cd0b12a8b48f5bddad37ceb15f8cb3d2cc75',
      rewardTokenAddress: '0xe7804d91dfcde7f776c90043e03eaa6df87e6395',
    },
  ];
}
