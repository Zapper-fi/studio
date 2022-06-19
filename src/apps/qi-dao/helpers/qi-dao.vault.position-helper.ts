import { Inject, Injectable } from '@nestjs/common';
import { compact } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken, getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { ContractPosition, Standard } from '~position/position.interface';
import { AppGroupsDefinition } from '~position/position.service';
import { borrowed, supplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { QiDaoContractFactory } from '../contracts';
import { QI_DAO_DEFINITION } from '../qi-dao.definition';

export type QiDaoVaultPositionDataProps = {
  assetStandard: Standard;
  liquidity: number;
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
  ) { }

  async getPositions({ network, vaults, debtTokenAddress, dependencies = [] }: QiDaoVaultPositionHelperParams) {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const appTokens = await this.appToolkit.getAppTokenPositions(...dependencies);
    const allTokens = [...appTokens, ...baseTokens];

    const positions = await Promise.all(
      vaults.map(async ({ vaultInfoAddress, nftAddress }) => {
        const vaultContract = this.contractFactory.qiDaoVaultInfo({ address: vaultInfoAddress, network });

        const underlyingTokenAddressRaw = await multicall
          .wrap(vaultContract)
          .collateral()
          .catch(() => ZERO_ADDRESS);

        // Resolve collateral token
        const underlyingTokenAddress = underlyingTokenAddressRaw.toLowerCase();
        const collateralToken = allTokens.find(p => p.address === underlyingTokenAddress);
        const borrowedToken = baseTokens.find(p => p.address === debtTokenAddress);
        if (!collateralToken || !borrowedToken) return null;

        // Resolve collateral token amount in vault
        const collateralTokenContract = this.contractFactory.erc20({ address: collateralToken.address, network });
        const reserveRaw = await (underlyingTokenAddress === ZERO_ADDRESS
          ? multicall.wrap(multicall.contract).getEthBalance(nftAddress)
          : multicall.wrap(collateralTokenContract).balanceOf(nftAddress));
        const reserve = Number(reserveRaw) / 10 ** collateralToken.decimals;
        const liquidity = reserve * collateralToken.price;
        const tokens = [supplied(collateralToken), borrowed(borrowedToken)];

        // Display Props
        const label = `${collateralToken.symbol} Vault`;
        const secondaryLabel = '';
        const images = [...getImagesFromToken(collateralToken), getTokenImg(borrowedToken.address, network)];
        const statsItems = [{ label: 'Liquidity', value: buildDollarDisplayItem(liquidity) }];

        const position: ContractPosition<QiDaoVaultPositionDataProps> = {
          type: ContractType.POSITION,
          address: nftAddress,
          appId: QI_DAO_DEFINITION.id,
          groupId: QI_DAO_DEFINITION.groups.vault.id,
          network,
          tokens,

          dataProps: {
            assetStandard: Standard.ERC_721,
            liquidity,
            vaultInfoAddress,
          },

          displayProps: {
            label,
            secondaryLabel,
            images,
            statsItems,
          },
        };

        return position;
      }),
    );

    return compact(positions);
  }
}
