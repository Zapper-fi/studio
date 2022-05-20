import { Inject } from '@nestjs/common';
import Axios from 'axios';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { PolynomialContractFactory, PolynomialCoveredCall, PolynomialPutSelling } from '../contracts';
import { POLYNOMIAL_DEFINITION } from '../polynomial.definition';

const appId = POLYNOMIAL_DEFINITION.id;
const groupId = POLYNOMIAL_DEFINITION.groups.vaults.id;
const network = Network.OPTIMISM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class OptimismPolynomialVaultsContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(PolynomialContractFactory) private readonly contractFactory: PolynomialContractFactory,
  ) {}

  async getPositions() {
    const endpoint = 'https://prodapi.polynomial.fi/vaults';
    const vaults = await Axios.get(endpoint).then(v => v.data);

    const callPositions =
      await this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<PolynomialCoveredCall>(
        {
          appId,
          groupId,
          network,
          resolveFarmAddresses: () =>
            vaults.filter(vault => vault.type.includes('CALL')).map(vault => vault.contractAddress.toLowerCase()),
          resolveStakedTokenAddress: async ({ multicall, contract }) => multicall.wrap(contract).UNDERLYING(),
          resolveFarmContract: ({ address }) => this.contractFactory.polynomialCoveredCall({ address, network }),
          resolveTotalValueLocked: ({ multicall, contract }) => multicall.wrap(contract).totalFunds(),
          resolveRois: () => ({
            dailyROI: 0,
            weeklyROI: 0,
            yearlyROI: 0,
          }),
        },
      );

    const putPositions =
      await this.appToolkit.helpers.singleStakingFarmContractPositionHelper.getContractPositions<PolynomialPutSelling>({
        appId,
        groupId,
        network,
        resolveFarmAddresses: () =>
          vaults.filter(vault => vault.type.includes('PUT')).map(vault => vault.contractAddress.toLowerCase()),
        resolveStakedTokenAddress: async ({ multicall, contract }) => multicall.wrap(contract).COLLATERAL(),
        resolveFarmContract: ({ address }) => this.contractFactory.polynomialPutSelling({ address, network }),
        resolveTotalValueLocked: ({ multicall, contract }) => multicall.wrap(contract).totalFunds(),
        resolveRois: () => ({
          dailyROI: 0,
          weeklyROI: 0,
          yearlyROI: 0,
        }),
      });

    return [...putPositions, ...callPositions];
  }
}
