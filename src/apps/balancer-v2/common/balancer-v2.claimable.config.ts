import { Network } from '~types/network.interface';

export type ClaimableTokenConfig = {
  label: string;
  network: Network;
  legacyMerkleRedeemAddress?: string;
  distributorAddress?: string;
  merkleOrchardAddress?: string;
  rewardTokenAddress: string;
  manifestUrl: string;
  weekStart?: number;
};

export const BALANCER_V2_CLAIMABLE_CONFIG: ClaimableTokenConfig[] = [
  // Ethereum
  {
    label: 'BAL',
    network: Network.ETHEREUM_MAINNET,
    distributorAddress: '0xd2eb7bd802a7ca68d9acd209bec4e664a9abdd7b',
    legacyMerkleRedeemAddress: '0x6d19b2bf3a36a61530909ae65445a906d98a2fa8',
    merkleOrchardAddress: '0xdae7e32adc5d490a43ccba1f0c736033f2b4efca',
    rewardTokenAddress: '0xba100000625a3754423978a60c9317c58a424e3d',
    manifestUrl: 'https://raw.githubusercontent.com/balancer-labs/bal-mining-scripts/master/reports/_current.json',
    weekStart: 52,
  },
  {
    label: 'UNN',
    network: Network.ETHEREUM_MAINNET,
    distributorAddress: '0xbfbd6e720ffdf0497f69c95e5c03a4861c65a6e7',
    merkleOrchardAddress: '0xdae7e32adc5d490a43ccba1f0c736033f2b4efca',
    rewardTokenAddress: '0x226f7b842e0f0120b7e194d05432b3fd14773a9d',
    manifestUrl:
      'https://raw.githubusercontent.com/balancer-labs/bal-mining-scripts/master/reports/_current-union.json',
    weekStart: 1,
  },
  {
    label: 'BANK',
    network: Network.ETHEREUM_MAINNET,
    distributorAddress: '0x9d20fe66ec5dd15a3d3213556534c77ca20318be',
    merkleOrchardAddress: '0xdae7e32adc5d490a43ccba1f0c736033f2b4efca',
    rewardTokenAddress: '0x2d94aa3e47d9d5024503ca8491fce9a2fb4da198',
    manifestUrl:
      'https://raw.githubusercontent.com/balancer-labs/bal-mining-scripts/master/reports/_current-bankless.json',
    weekStart: 1,
  },
  {
    label: 'LIDO',
    network: Network.ETHEREUM_MAINNET,
    legacyMerkleRedeemAddress: '0x884226c9f7b7205f607922e0431419276a64cf8f',
    rewardTokenAddress: '0x5a98fcbea516cf06857215779fd812ca3bef1b32',
    manifestUrl: 'https://raw.githubusercontent.com/balancer-labs/bal-mining-scripts/master/reports/_current-lido.json',
  },
  {
    label: 'VITA',
    network: Network.ETHEREUM_MAINNET,
    legacyMerkleRedeemAddress: '0x575bff0aca7638c573bc57bb7c91b5bdfe2462c8',
    rewardTokenAddress: '0x81f8f0bb1cb2a06649e51913a151f0e7ef6fa321',
    manifestUrl: 'https://raw.githubusercontent.com/balancer-labs/bal-mining-scripts/master/reports/_current-vita.json',
  },
  // Polygon
  {
    label: 'BAL',
    network: Network.POLYGON_MAINNET,
    distributorAddress: '0xd2eb7bd802a7ca68d9acd209bec4e664a9abdd7b',
    merkleOrchardAddress: '0x0f3e0c4218b7b0108a3643cfe9d3ec0d4f57c54e',
    rewardTokenAddress: '0x9a71012b13ca4d3d0cdc72a177df3ef03b0e76a3',
    manifestUrl:
      'https://raw.githubusercontent.com/balancer-labs/bal-mining-scripts/master/reports/_current-polygon.json',
    weekStart: 1,
  },
  // Arbitrum
  {
    label: 'BAL',
    network: Network.ARBITRUM_MAINNET,
    legacyMerkleRedeemAddress: '0x6bd0b17713aaa29a2d7c9a39ddc120114f9fd809',
    distributorAddress: '0xd2eb7bd802a7ca68d9acd209bec4e664a9abdd7b',
    merkleOrchardAddress: '0x751a0bc0e3f75b38e01cf25bfce7ff36de1c87de',
    rewardTokenAddress: '0x040d1edc9569d4bab2d15287dc5a4f10f56a56b8',
    manifestUrl:
      'https://raw.githubusercontent.com/balancer-labs/bal-mining-scripts/master/reports/_current-arbitrum.json',
    weekStart: 6,
  },
  {
    label: 'MCB',
    network: Network.ARBITRUM_MAINNET,
    legacyMerkleRedeemAddress: '0xc6bd2497332d24094ec16a7261eec5c412b5a2c1',
    distributorAddress: '0x25c646adf184051b35a405b9aaeba321e8d5342a',
    merkleOrchardAddress: '0x751a0bc0e3f75b38e01cf25bfce7ff36de1c87de',
    rewardTokenAddress: '0x4e352cf164e64adcbad318c3a1e222e9eba4ce42',
    manifestUrl:
      'https://raw.githubusercontent.com/balancer-labs/bal-mining-scripts/master/reports/_current-mcdex-arbitrum.json',
    weekStart: 4,
  },
  {
    label: 'PICKLE',
    network: Network.ARBITRUM_MAINNET,
    legacyMerkleRedeemAddress: '0xe3fb4f33fdb4ecc874a842c5ca2ee6a2e547328c',
    distributorAddress: '0xf02ceb58d549e4b403e8f85fbbaee4c5dfa47c01',
    merkleOrchardAddress: '0x751a0bc0e3f75b38e01cf25bfce7ff36de1c87de',
    rewardTokenAddress: '0x965772e0e9c84b6f359c8597c891108dcf1c5b1a',
    manifestUrl:
      'https://raw.githubusercontent.com/balancer-labs/bal-mining-scripts/master/reports/_current-pickle-arbitrum.json',
    weekStart: 4,
  },
];
