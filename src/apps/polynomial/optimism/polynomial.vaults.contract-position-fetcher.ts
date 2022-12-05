import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { PolynomialContractFactory, PolynomialCoveredCall, PolynomialPutSelling } from '../contracts';
import { resolveTitle, getVault, isUnderlyingDenominated } from '../helpers/formatters';
import { PolynomialApiHelper } from '../helpers/polynomial.api';
import { POLYNOMIAL_DEFINITION } from '../polynomial.definition';

const appId = POLYNOMIAL_DEFINITION.id;
const groupId = POLYNOMIAL_DEFINITION.groups.vaults.id;
const network = Network.OPTIMISM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class OptimismPolynomialVaultsContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PolynomialContractFactory) private readonly contractFactory: PolynomialContractFactory,
    @Inject(PolynomialApiHelper) private readonly apiHelper: PolynomialApiHelper,
  ) {}

  async getPositions() {
    const vaults = await this.apiHelper.getVaults();

    const callPositions =
      await this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<PolynomialCoveredCall>(
        {
          appId,
          groupId,
          network,
          dependencies: [
            { appId: POLYNOMIAL_DEFINITION.id, groupIds: [POLYNOMIAL_DEFINITION.groups.vaults.id], network },
          ],
          resolveFarmAddresses: () =>
            vaults
              .filter(vault => isUnderlyingDenominated(vault.vaultId))
              .map(vault => vault.vaultAddress.toLowerCase()),
          resolveStakedTokenAddress: async ({ multicall, contract }) => multicall.wrap(contract).UNDERLYING(),
          resolveRewardTokenAddresses: ({ multicall, contract }) => multicall.wrap(contract).VAULT_TOKEN(),
          resolveFarmContract: ({ address }) => this.contractFactory.polynomialCoveredCall({ address, network }),
          resolveLiquidity: ({ multicall, contract }) => multicall.wrap(contract).totalFunds(),
          resolveLabel: (address: string) => resolveTitle(getVault(vaults, address).vaultId),
          resolveRois: ({ address }) => {
            const apy = Number(getVault(vaults, address).apy);
            if (!apy) {
              return {
                dailyROI: 0,
                weeklyROI: 0,
                yearlyROI: 0,
              };
            }
            return {
              dailyROI: apy / 365,
              weeklyROI: apy / 52,
              yearlyROI: apy,
            };
          },
        },
      );

    const putPositions =
      await this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<PolynomialPutSelling>({
        appId,
        groupId,
        network,
        dependencies: [
          { appId: POLYNOMIAL_DEFINITION.id, groupIds: [POLYNOMIAL_DEFINITION.groups.vaults.id], network },
        ],
        resolveFarmAddresses: () =>
          vaults
            .filter(vault => !isUnderlyingDenominated(vault.vaultId))
            .map(vault => vault.vaultAddress.toLowerCase()), // Put and Gamma positions
        resolveStakedTokenAddress: async ({ multicall, contract }) => multicall.wrap(contract).SUSD(),
        resolveRewardTokenAddresses: ({ multicall, contract }) => multicall.wrap(contract).VAULT_TOKEN(),
        resolveFarmContract: ({ address }) => this.contractFactory.polynomialPutSelling({ address, network }),
        resolveLiquidity: ({ multicall, contract }) => multicall.wrap(contract).totalFunds(),
        resolveLabel: (address: string) => resolveTitle(getVault(vaults, address).vaultId),
        resolveRois: ({ address }) => {
          const apy = Number(getVault(vaults, address).apy);
          if (!apy) {
            return {
              dailyROI: 0,
              weeklyROI: 0,
              yearlyROI: 0,
            };
          }
          return {
            dailyROI: apy / 365,
            weeklyROI: apy / 52,
            yearlyROI: apy,
          };
        },
      });

    return [...putPositions, ...callPositions];
  }
}
