import { Inject, Injectable } from '@nestjs/common';
import { compact } from 'lodash';

import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { getImagesFromToken, getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { APP_TOOLKIT, IAppToolkit } from '~lib';
import { ContractType } from '~position/contract.interface';
import { ContractPosition } from '~position/position.interface';
import { AppGroupsDefinition } from '~position/position.service';
import { borrowed, supplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { QiDaoContractFactory } from '../contracts';
import { QI_DAO_DEFINITION } from '../qi-dao.definition';

export type QiDaoVaultPositionDataProps = {
  vaultInfoAddress: string;
};

type QiDaoVaultDefinition = {
  nftAddress: string;
  vaultInfoAddress: string;
};

export type QiDaoVaultPositionHelperParams = {
  network: Network;
  vaults: QiDaoVaultDefinition[];
  debtTokenAddress: string;
  dependencies?: AppGroupsDefinition[];
};

@Injectable()
export class QiDaoVaultPositionHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(QiDaoContractFactory) protected readonly contractFactory: QiDaoContractFactory,
  ) {}

  async getPositions({ network, vaults, debtTokenAddress, dependencies = [] }: QiDaoVaultPositionHelperParams) {
    const multicall = this.appToolkit.getMulticall(network);
    const prices = await this.appToolkit.getBaseTokenPrices(network);
    const tokens = await this.appToolkit.getAppTokenPositions(...dependencies);

    const positions = await Promise.all(
      vaults.map(async vaultAddress => {
        const vaultContract = this.contractFactory.qiDaoVaultInfo({
          address: vaultAddress.vaultInfoAddress,
          network,
        });

        const underlyingTokenAddress = await multicall
          .wrap(vaultContract)
          .collateral()
          .catch(() => ZERO_ADDRESS)
          .then(a => a.toLowerCase());

        const appTokenMatch = tokens.find(p => p.address === underlyingTokenAddress);
        const tokenMatch = prices.find(p => p.address === underlyingTokenAddress);
        const collateralToken = appTokenMatch ?? tokenMatch;
        const borrowedToken = prices.find(p => p.address === debtTokenAddress);

        if (!collateralToken || !borrowedToken) {
          return null;
        }

        // Display Props
        const label = `${collateralToken.symbol} Vault`;
        const secondaryLabel = '';
        const images = [...getImagesFromToken(collateralToken), getTokenImg(borrowedToken.address, network)];

        const position: ContractPosition<QiDaoVaultPositionDataProps> = {
          type: ContractType.POSITION,
          address: vaultAddress.nftAddress,
          appId: QI_DAO_DEFINITION.id,
          groupId: QI_DAO_DEFINITION.groups.vault.id,
          network,
          tokens: [supplied(collateralToken), borrowed(borrowedToken)],
          dataProps: { vaultInfoAddress: vaultAddress.vaultInfoAddress },
          displayProps: {
            label,
            secondaryLabel,
            images,
          },
        };

        return position;
      }),
    );

    return compact(positions);
  }
}
