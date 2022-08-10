import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { PolynomialContractFactory, PolynomialVaultToken } from '../contracts';
import { getVault } from '../helpers/formatters';
import { PolynomialApiHelper } from '../helpers/polynomial.api';
import { POLYNOMIAL_DEFINITION } from '../polynomial.definition';

const appId = POLYNOMIAL_DEFINITION.id;
const groupId = POLYNOMIAL_DEFINITION.groups.vaults.id;
const network = Network.OPTIMISM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class OptimismPolynomialVaultsTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PolynomialContractFactory) private readonly contractFactory: PolynomialContractFactory,
    @Inject(PolynomialApiHelper) private readonly apiHelper: PolynomialApiHelper,
  ) {}

  async getPositions() {
    const vaults = await this.apiHelper.getVaults();
    const tokens = await this.appToolkit.helpers.vaultTokenHelper.getTokens<PolynomialVaultToken>({
      appId,
      groupId,
      network,
      resolveVaultAddresses: () => vaults.map(x => x.tokenAddress.toLowerCase()),
      resolveContract: ({ address, network }) => this.contractFactory.polynomialVaultToken({ address, network }),
      resolveUnderlyingTokenAddress: async ({ multicall, contract }) => {
        const vaultAddress = await multicall.wrap(contract).vault();
        const vault = getVault(vaults, vaultAddress.toLowerCase());
        if (vault.vaultId.includes('CALL')) {
          const vaultContract = this.contractFactory.polynomialCoveredCall({ address: vaultAddress, network });
          return multicall.wrap(vaultContract).UNDERLYING();
        }
        const vaultContract = this.contractFactory.polynomialPutSelling({ address: vaultAddress, network });
        return multicall.wrap(vaultContract).SUSD();
      },
      resolveReserve: async ({ contract, multicall }) => {
        const vaultAddress = await multicall.wrap(contract).vault();
        const vaultContract = this.contractFactory.polynomialCoveredCall({ address: vaultAddress, network });
        return Number(await multicall.wrap(vaultContract).totalFunds());
      },
      resolvePricePerShare: async ({ multicall, contract, underlyingToken }) => {
        const vaultAddress = await multicall.wrap(contract).vault();
        const vaultContract = this.contractFactory.polynomialCoveredCall({ address: vaultAddress, network });
        const price = Number(await multicall.wrap(vaultContract).getTokenPrice());
        return price / 10 ** underlyingToken.decimals / underlyingToken.price;
      },
    });

    return tokens;
  }
}
