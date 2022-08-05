import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { borrowed, supplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { ANGLE_DEFINITION } from '../angle.definition';
import { AngleApiHelper } from '../helpers/angle.api';

const appId = ANGLE_DEFINITION.id;
const groupId = ANGLE_DEFINITION.groups.vaults.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumAngleVaultsContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AngleApiHelper) private readonly angleApiHelper: AngleApiHelper,
  ) {}

  async getPositions() {
    const baseTokenDependencies = await this.appToolkit.getBaseTokenPrices(network);

    const vaultManagers = Object.values(await this.angleApiHelper.getVaultManagers(network));

    const positions = vaultManagers.map(vaultManager => {
      const collateralToken = baseTokenDependencies.find(
        v => v.address.toLowerCase() === vaultManager.collateral.toLowerCase(),
      );
      const stableToken = baseTokenDependencies.find(
        v => v.address.toLowerCase() === vaultManager.stablecoin.toLowerCase(),
      );
      if (!collateralToken || !stableToken) return null;

      const position: ContractPosition = {
        type: ContractType.POSITION,
        appId,
        groupId,
        address: vaultManager.address,
        network,
        tokens: [supplied(collateralToken), borrowed(stableToken)],
        dataProps: {
          totalDebt: vaultManager.totalDebt,
          totalCollateral: vaultManager.totalCollateral,
          maxLTV: vaultManager.maxLTV,
        },
        displayProps: {
          label: `${getLabelFromToken(collateralToken)} - ${getLabelFromToken(stableToken)}`,
          images: [...getImagesFromToken(collateralToken), ...getImagesFromToken(stableToken)],
        },
      };

      return position;
    });

    return _.compact(positions);
  }
}
