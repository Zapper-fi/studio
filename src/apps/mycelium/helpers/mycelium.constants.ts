import { PerpPoolFarm } from './mycelium.interface';

export const MYCELIUM_API_URL = 'https://api.tracer.finance/poolsv2';

export const ES_MYC_TOKEN_ADDRESS = '0x7cec785fba5ee648b48fbffc378d74c8671bb3cb';
export const MYC_TOKEN_ADDRESS = '0xc74fe4c715510ec2f8c61d70d397b32043f55abe';
export const WETH_TOKEN_ADDRESS = '0x82af49447d8a07e3bd95bd0d56f35241523fbab1';

export const LEV_TRADES_VAULT_ADDRESS = '0x77ae0f7128c6ac9f0efdb8a6f0aabd5b979ea80e';
export const MLP_VAULT_ADDRESS = '0xdfba8ad57d2c62f61f0a60b2c508bcdeb182f855';
export const MLP_TOKEN_ADDRESS = '0xf7bd2ed13bef9c27a2188f541dc5ed85c5325306';
export const MLP_MANAGER_ADDRESS = '0x2de28ab4827112cd3f89e5353ca5a8d80db7018f';
export const MYC_LENDING_ADDRESS = '0x9b225ff56c48671d4d04786de068ed8b88b672d6';

export const MYCELIUM_FARMS: Array<PerpPoolFarm> = [
  // active
  {
    address: '0x93116d661dacaa8ff65cb5420ef61425322aea7f', // 3-BTC/USD+USDC Balancer LP
    pool: '0x3aca4f1b1791d00ebbae01d65e9739c9c886f33c',
    isBPTFarm: true,
    balancerPoolId: '0x045c5480131eef51aa1a74f34e62e7de23136f2400010000000000000000009a',
    link: 'https://arbitrum.balancer.fi/#/pool/0x045c5480131eef51aa1a74f34e62e7de23136f2400010000000000000000009a',
  },
  {
    address: '0x04ff29f8f379b2aa7d79ba66ce76649334d83e48', // 3L-BTC/USD+USDC
    pool: '0x3aca4f1b1791d00ebbae01d65e9739c9c886f33c',
    type: 'long',
  },
  {
    address: '0x16c457fc0f5d5981574ed2baed81c625bd91b633', // 3S-BTC/USD+USDC
    pool: '0x3aca4f1b1791d00ebbae01d65e9739c9c886f33c',
    type: 'short',
  },
  {
    address: '0x906c81a761d60acacae85165d67031e9f7e3cea9', // 3-ETH/USD+USDC Balancer LP
    pool: '0x8f4af5a3b58ea60e66690f30335ed8586e46aceb',
    isBPTFarm: true,
    balancerPoolId: '0x59b7867f6b127070378feeb328e2ffe6aab6752500010000000000000000009b',
    link: 'https://arbitrum.balancer.fi/#/pool/0x59b7867f6b127070378feeb328e2ffe6aab6752500010000000000000000009b',
  },
  {
    address: '0x111278bf2cc2fd862183cf34896c60dbbea0706f', // 3L-ETH/USD+USDC
    pool: '0x8f4af5a3b58ea60e66690f30335ed8586e46aceb',
    type: 'long',
  },
  {
    address: '0x489da242a948d1978673fef8836740c11732ec0b', // 3S-ETH/USD+USDC
    pool: '0x8f4af5a3b58ea60e66690f30335ed8586e46aceb',
    type: 'short',
  },
  {
    address: '0x6d52d4c087dd8a167eca0008fb4c69d99169dce8', // 3-BTC/USD+USDC-12h Balancer LP
    pool: '0x2bfb8aee6eb2dccd694f8ecb4c31fdebfc22b55a',
    isBPTFarm: true,
    balancerPoolId: '0xc999678122cbf8a30cb72c53d4bdd72abd96af880001000000000000000000b4',
    link: 'https://arbitrum.balancer.fi/#/pool/0xc999678122cbf8a30cb72c53d4bdd72abd96af880001000000000000000000b4',
    name: '3-BTC/USD+USDC-12h',
  },
  {
    address: '0x3004cc46432522b0aea30d16af769b1727aa0c26', // 3L-BTC/USD+USDC-12h
    pool: '0x2bfb8aee6eb2dccd694f8ecb4c31fdebfc22b55a',
    type: 'long',
  },
  {
    address: '0x0896fd59b574f536751c82b8dd9fd9466af009ac', // 3S-BTC/USD+USDC-12h
    pool: '0x2bfb8aee6eb2dccd694f8ecb4c31fdebfc22b55a',
    type: 'short',
  },
];
