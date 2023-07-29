import { UmamiFinanceGlpVaultAddress, UmamiFinanceTimelockedGlpVaultAddress } from './umami-finance.constants';

export const getUmamiApiIdFromVaultAddress = (vaultAddress: string): string | null => {
  switch (vaultAddress) {
    case UmamiFinanceGlpVaultAddress.GLP_USDC:
    case UmamiFinanceTimelockedGlpVaultAddress.TL_GLP_USDC:
      return 'glpusdc';
    case UmamiFinanceGlpVaultAddress.GLP_WETH:
    case UmamiFinanceTimelockedGlpVaultAddress.TL_GLP_WETH:
      return 'glpweth';
    case UmamiFinanceGlpVaultAddress.GLP_WBTC:
    case UmamiFinanceTimelockedGlpVaultAddress.TL_GLP_WBTC:
      return 'glpwbtc';
    case UmamiFinanceGlpVaultAddress.GLP_LINK:
    case UmamiFinanceTimelockedGlpVaultAddress.TL_GLP_LINK:
      return 'glplink';
    case UmamiFinanceGlpVaultAddress.GLP_UNI:
    case UmamiFinanceTimelockedGlpVaultAddress.TL_GLP_UNI:
      return 'glpuni';
    default:
      return null;
  }
};
