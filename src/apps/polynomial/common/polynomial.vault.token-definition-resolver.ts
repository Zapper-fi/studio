import { Inject, Injectable } from '@nestjs/common';
import Axios from 'axios';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Network } from '~types';

import { PolynomialContractFactory } from '../contracts';

export type PolynomialVaultTokenDefinition = {
  address: string;
  vaultId: string;
  underlyingTokenAddress: string;
  underlyingDominated: boolean;
  tokenAddress: string;
};

export type PolynomialApiTokensResponse = {
  tokenAddress: string;
  vaultAddress: string;
  vaultId: string;
  vaultType: string;
  apy: string;
  maxCapacity: string;
  minDepositLimit: string;
  depositTokenAddress: string;
  depositToken: string;
};

@Injectable()
export class PolynomialVaultTokenDefinitionsResolver {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PolynomialContractFactory) protected readonly contractFactory: PolynomialContractFactory,
  ) {}

  /* @Cache({
    key: _network => `studio:${POLYNOMIAL_DEFINITION.id}:${_network}:vault-data`,
    ttl: 5 * 60, // 60 minutes
  })*/
  private async getVaultDefinitionsData(_network: Network) {
    const { data } = await Axios.get<PolynomialApiTokensResponse[]>(`https://earn-api.polynomial.fi/vaults`);
    return data;
  }

  async getVaultDefinitions(network: Network): Promise<PolynomialVaultTokenDefinition[]> {
    const multicall = this.appToolkit.getMulticall(network);
    const definitionsData = await this.getVaultDefinitionsData(network);

    return await Promise.all(
      definitionsData.map(async vault => {
        const vaultId = vault.vaultId.toLowerCase();
        const address = vault.vaultAddress.toLowerCase();
        const vaultContract = this.contractFactory.polynomialPutSelling({ address, network });
        const underlyingDominated = vaultId.includes('call') && !vaultId.includes('quote');
        const underlyingTokenAddressRaw = underlyingDominated
          ? vault.depositTokenAddress
          : await multicall.wrap(vaultContract).SUSD();

        return {
          address,
          vaultId: vault.vaultId,
          underlyingTokenAddress: underlyingTokenAddressRaw.toLowerCase(),
          underlyingDominated,
          tokenAddress: vault.tokenAddress.toLowerCase(),
        };
      }),
    );
  }
}
