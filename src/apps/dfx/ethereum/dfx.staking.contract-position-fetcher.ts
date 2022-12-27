import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { DfxStakingContractPositionFetcher } from '../common/dfx.staking.contract-position-fetcher';

@PositionTemplate()
export class EthereumDfxStakingContractPositionFetcher extends DfxStakingContractPositionFetcher {
  groupLabel = 'DFX Staking';
  stakingDefinitions = [
    {
      address: '0x84bf8151394dcf32146965753b28760550f3d7a8',
      stakedTokenAddress: '0xa6c0cbcaebd93ad3c6c94412ec06aaa37870216d', // cadc-Usdc
      rewardTokenAddress: '0x888888435fde8e7d4c54cab67f206e4199454c60',
    },
    {
      address: '0x5eaaeff69f2ab64d1cc0244fb31b236ca989544f',
      stakedTokenAddress: '0x1a4ffe0dcbdb4d551cfca61a5626afd190731347', // eurs-Usdc
      rewardTokenAddress: '0x888888435fde8e7d4c54cab67f206e4199454c60',
    },
    {
      address: '0xd52d48db08e8224ef6e2be8f54f3c84e790b1c32',
      stakedTokenAddress: '0x2bab29a12a9527a179da88f422cdaaa223a90bd5', // xsgd-Usdc
      rewardTokenAddress: '0x888888435fde8e7d4c54cab67f206e4199454c60',
    },
    {
      address: '0xe06fa52e0d2d58fe192285bfa0507f09cdd9824a',
      stakedTokenAddress: '0xe9669516e09f5710023566458f329cce6437aaac', // nzds-Usdc
      rewardTokenAddress: '0x888888435fde8e7d4c54cab67f206e4199454c60',
    },
    {
      address: '0xddb720069fdfe7be2e2883a1c06be0f353f7c4c8',
      stakedTokenAddress: '0xc574a613a3900e4314da13eb2287f13689a5b64d', // tryb-Usdc
      rewardTokenAddress: '0x888888435fde8e7d4c54cab67f206e4199454c60',
    },
    {
      address: '0xe29b7285c1169a9765e2a9bfe74209077bee55d6',
      stakedTokenAddress: '0xdd39379ab7c93b9baae29e6ec03795d0bc99a889', // xidr-Usdc
      rewardTokenAddress: '0x888888435fde8e7d4c54cab67f206e4199454c60',
    },
  ];
}
