import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { borrowed, supplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { ANGLE_DEFINITION } from '../angle.definition';
import { AngleContractFactory } from '../contracts';
import { callAngleApi } from '../helpers/angle.api';

const appId = ANGLE_DEFINITION.id;
const groupId = ANGLE_DEFINITION.groups.vaults.id;
const network = Network.ETHEREUM_MAINNET;

type TVaultManager = {
  address: string;
  borrowFee: number;
  collateral: string;
  collateralHasPermit: boolean;
  collateralPermitVersion: string;
  decimals: number;
  dust: number;
  liquidationPenalty: number;
  maxLTV: number;
  minCollateralRatio: number;
  rate: number;
  stabilityFee: number;
  stablecoin: string;
  swapper: string;
  symbol: string;
  totalCollateral: number;
  totalDebt: number;
  treasury: string;
};

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumAngleVaultsContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AngleContractFactory) private readonly angleContractFactory: AngleContractFactory,
  ) {}

  async getPositions() {
    const baseTokenDependencies = await this.appToolkit.getBaseTokenPrices(network);

    const vaultManagers = Object.values(
      await callAngleApi<Record<string, TVaultManager>>('vaultManagers', { chainId: 1 }),
    );

    const positions = vaultManagers.map(vaultManager => {
      const collateralToken = baseTokenDependencies.find(
        v => v.address.toLowerCase() === vaultManager.collateral.toLowerCase(),
      );
      const stableToken = baseTokenDependencies.find(
        v => v.address.toLowerCase() === vaultManager.stablecoin.toLowerCase(),
      );
      if (!collateralToken || !stableToken) return null;

      return {
        type: ContractType.POSITION,
        appId,
        groupId,
        address: vaultManager.address,
        network,
        symbol: vaultManager.symbol,
        tokens: [supplied(collateralToken), borrowed(stableToken)],
        dataProps: {
          totalDebt: vaultManager.totalDebt,
          totalCollateral: vaultManager.totalCollateral,
          maxLTV: vaultManager.maxLTV,
        },
        displayProps: {
          label: `Angle Vault ${vaultManager.symbol}`,
          images: [''],
          appName: 'Angle',
        },
      } as ContractPosition;
    });

    return positions;
  }
}
