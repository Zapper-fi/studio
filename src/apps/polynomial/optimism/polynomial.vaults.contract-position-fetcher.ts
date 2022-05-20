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

const calculateROI = async ({ multicall, contract }) => {
  const currentYield = Number(await multicall.wrap(contract).premiumCollected());
  const usedFunds = Number(await multicall.wrap(contract).usedFunds());
  const totalFunds = Number(await multicall.wrap(contract).totalFunds());
  const managementFee = Number(await multicall.wrap(contract).managementFee()) / 10 ** 9;
  const performanceFee = Number(await multicall.wrap(contract).performanceFee()) / 10 ** 9;
  const totalFees = (currentYield * performanceFee + usedFunds * managementFee) / 52;
  const totalShares = Number(await multicall.wrap(contract).totalShares());
  const index = (totalFunds + currentYield - totalFees) / totalShares;
  return index;
};

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
          resolveRois: async ({ multicall, contract }) => ({
            dailyROI: 0,
            weeklyROI: await calculateROI({ multicall, contract }),
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
        resolveRois: async ({ multicall, contract }) => ({
          dailyROI: 0,
          weeklyROI: await calculateROI({ multicall, contract }),
          yearlyROI: 0,
        }),
      });

    return [...putPositions, ...callPositions];
  }
}
