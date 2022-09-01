import _ from 'lodash';

import { VaultObject } from '../helpers/polynomial.api';

export const resolveTitle = (title: string) => _.startCase(_.toLower(title));
export const getVault = (vaults: VaultObject[], address: string) =>
  vaults.find(vault => vault.vaultAddress.toLowerCase() === address || vault.tokenAddress.toLowerCase() === address)!;
export const isUnderlyingDenominated = (vault: string) => vault.includes('CALL') && !vault.includes('QUOTE');
