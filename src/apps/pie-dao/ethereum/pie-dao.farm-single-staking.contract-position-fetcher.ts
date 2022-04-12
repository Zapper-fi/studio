import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { SynthetixSingleStakingFarmContractPositionHelper } from '~apps/synthetix';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { PIE_DAO_DEFINITION } from '../pie-dao.definition';

const FARMS = [
  // BPT WETH / DOUGH
  {
    address: '0xb9a4bca06f14a982fcd14907d31dfacadc8ff88e',
    stakedTokenAddress: '0xfae2809935233d4bfe8a56c2355c4a2e7d1fff1a',
    rewardTokenAddresses: ['0xad32a8e6220741182940c5abf610bde99e737b2d'],
  },
  // BPT DEFI+S / WETH
  {
    address: '0xfcbb61bcd4909bf4af708f15aaaa905e0978cafc',
    stakedTokenAddress: '0x35333cf3db8e334384ec6d2ea446da6e445701df',
    rewardTokenAddresses: ['0xad32a8e6220741182940c5abf610bde99e737b2d'],
  },
  // BPT DEFI+L / WETH
  {
    address: '0xb8e59ce1359d80e4834228edd6a3f560e7534438',
    stakedTokenAddress: '0xa795600590a7da0057469049ab8f1284baed977e',
    rewardTokenAddresses: ['0xad32a8e6220741182940c5abf610bde99e737b2d'],
  },
  // BCP
  {
    address: '0x9efd60f40e35b3ca7294cc268a35d3e35101be42',
    stakedTokenAddress: '0xe4f726adc8e89c6a6017f01eada77865db22da14',
    rewardTokenAddresses: ['0xad32a8e6220741182940c5abf610bde99e737b2d'],
  },
  // UNI-V2 YPIE / WETH
  {
    address: '0x3a05d2394f7241e00f4ae90a1f14d9c9c48a1e9b',
    stakedTokenAddress: '0xdf5096804705d135656b50b62f9ee13041253d97',
    rewardTokenAddresses: ['0xad32a8e6220741182940c5abf610bde99e737b2d'],
  },
];

const appId = PIE_DAO_DEFINITION.id;
const groupId = PIE_DAO_DEFINITION.groups.farmSingleStaking.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumPieDaoFarmSingleStakingContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(SynthetixSingleStakingFarmContractPositionHelper)
    private readonly synthetixSingleStakingFarmContractPositionHelper: SynthetixSingleStakingFarmContractPositionHelper,
  ) {}

  async getPositions() {
    return this.synthetixSingleStakingFarmContractPositionHelper.getContractPositions({
      network,
      appId,
      groupId,
      farmDefinitions: FARMS,
      dependencies: [
        { appId: 'uniswap-v2', groupIds: ['pool'], network },
        { appId: 'balancer-v1', groupIds: ['pool'], network },
      ],
    });
  }
}
