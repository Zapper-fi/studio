import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { CURVE_DEFINITION } from '~apps/curve';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { TarotContractFactory } from '../contracts';
import { TAROT_DEFINITION } from '../tarot.definition';

const tarotFactoryAddresses = [
  '0x35c052bbf8338b06351782a565aa9aad173432ea', // Tarot Classic
  '0xf6d943c8904195d0f69ba03d97c0baf5bbdcd01b', // Tarot Requiem
  '0xbf76f858b42bb9b196a87e43235c2f0058cf7322', // Tarot Carcosa
];

const appId = TAROT_DEFINITION.id;
const groupId = TAROT_DEFINITION.groups.supply.id;
const network = Network.FANTOM_OPERA_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class FantomTarotSupplyTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(TarotContractFactory) private readonly contractFactory: TarotContractFactory,
  ) {}

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);

    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const appTokens = await this.appToolkit.getAppTokenPositions(
      { appId: CURVE_DEFINITION.id, groupIds: [CURVE_DEFINITION.groups.pool.id], network },
      { appId: TAROT_DEFINITION.id, groupIds: [TAROT_DEFINITION.groups.vault.id], network },
      { appId: 'spiritswap', groupIds: ['pool'], network },
      { appId: 'spookyswap', groupIds: ['pool'], network },
      { appId: 'tomb', groupIds: ['pool'], network },
    );
    const allTokens = [...appTokens, ...baseTokens];

    const allTarotTokens = await Promise.all(
      tarotFactoryAddresses.map(async tarotFactoryAddress => {
        const tarotFactory = this.contractFactory.tarotFactory({ address: tarotFactoryAddress, network });
        const numPoolsRaw = await multicall.wrap(tarotFactory).allLendingPoolsLength();
        const tarotTokens = await Promise.all(
          _.range(0, Number(numPoolsRaw)).map(async index => {
            const tarotVaultAddressRaw = await multicall.wrap(tarotFactory).allLendingPools(index);
            const tarotVaultAddress = tarotVaultAddressRaw.toLowerCase();

            const tarotVault = this.contractFactory.tarotVault({ network, address: tarotVaultAddress });
            const isVault = await multicall
              .wrap(tarotVault)
              .isVaultToken()
              .catch(() => false);
            if (!isVault) return [];

            const vaultData = await multicall.wrap(tarotFactory).getLendingPool(tarotVaultAddress);

            const collateralAddress = vaultData.collateral.toLowerCase();
            const collateralTokenContract = this.contractFactory.tarotBorrowable({
              network,
              address: collateralAddress,
            });
            const vaultTokenAddress = await multicall.wrap(collateralTokenContract).underlying();
            const vaultTokenContract = this.contractFactory.tarotBorrowable({ network, address: vaultTokenAddress });
            const poolTokenAddressRaw = await multicall.wrap(vaultTokenContract).underlying();
            const poolTokenAddress = poolTokenAddressRaw.toLowerCase();
            const poolToken = allTokens.find(v => v.address === poolTokenAddress);
            if (!poolToken) return null;

            const borrowable0TokenAddress = vaultData.borrowable0.toLowerCase();
            const borrowable1TokenAddress = vaultData.borrowable1.toLowerCase();

            const tokens = await Promise.all(
              [borrowable0TokenAddress, borrowable1TokenAddress].map(async bTokenAddress => {
                const borrowTokenContract = this.contractFactory.tarotBorrowable({ network, address: bTokenAddress });

                const underlyingTokenAddressRaw = await multicall.wrap(borrowTokenContract).underlying();
                const underlyingTokenAddress = underlyingTokenAddressRaw.toLowerCase();
                const underlyingToken = allTokens.find(v => v.address === underlyingTokenAddress);
                if (!underlyingToken) return null;

                const [exchangeRateRaw, supplyRaw, decimals] = await Promise.all([
                  multicall.wrap(borrowTokenContract).callStatic.exchangeRate(),
                  multicall.wrap(borrowTokenContract).totalSupply(),
                  multicall.wrap(borrowTokenContract).decimals(),
                ]);

                const supply = Number(supplyRaw) / 10 ** decimals;
                const pricePerShare = Number(exchangeRateRaw) / 10 ** decimals;
                const price = pricePerShare * underlyingToken.price;
                const liquidity = price * supply;

                const token: AppTokenPosition = {
                  type: ContractType.APP_TOKEN,
                  appId,
                  network,
                  groupId,
                  address: bTokenAddress,
                  symbol: underlyingToken.symbol,
                  decimals,
                  supply,
                  pricePerShare,
                  price,
                  tokens: [underlyingToken],
                  dataProps: {
                    liquidity,
                  },
                  displayProps: {
                    label: `${getLabelFromToken(underlyingToken)} in ${getLabelFromToken(poolToken)} Lending Pool`,
                    images: getImagesFromToken(underlyingToken),
                    statsItems: [
                      {
                        label: 'Liquidity',
                        value: buildDollarDisplayItem(liquidity),
                      },
                    ],
                  },
                };

                return token;
              }),
            );

            return _.compact(tokens);
          }),
        );

        return _.compact(tarotTokens.flat());
      }),
    );

    return allTarotTokens.flat();
  }
}
