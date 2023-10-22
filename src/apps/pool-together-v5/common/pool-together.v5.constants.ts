import { Network } from "~types"

export const PRIZE_VAULT_ADDRESSES: Partial<Record<Network, `0x${string}`[]>> = {
  [Network.OPTIMISM_MAINNET]: [
    '0xE3B3a464ee575E8E25D2508918383b89c832f275', // Prize USDC.e - Aave
    '0x29Cb69D4780B53c1e5CD4D2B817142D2e9890715', // Prize WETH - Aave
    '0xCe8293f586091d48A0cE761bBf85D5bCAa1B8d2b'  // Prize DAI - Aave
  ]
}