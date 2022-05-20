import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { CURVE_DEFINITION } from '~apps/curve';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { TarotContractFactory } from '../contracts';
import { TAROT_DEFINITION } from '../tarot.definition';

const appId = TAROT_DEFINITION.id;
const groupId = TAROT_DEFINITION.groups.collateral.id;
const network = Network.FANTOM_OPERA_MAINNET;

@Register.TokenPositionFetcher({
  appId,
  groupId,
  network,
})
export class FantomTarotCollateralTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(TarotContractFactory) private readonly contractFactory: TarotContractFactory,
  ) {}

  async getPositions(): Promise<AppTokenPosition[]> {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const appTokens = await this.appToolkit.getAppTokenPositions(
      { appId: CURVE_DEFINITION.id, groupIds: [CURVE_DEFINITION.groups.pool.id], network },
      { appId: TAROT_DEFINITION.id, groupIds: [TAROT_DEFINITION.groups.supplyVault.id], network },
      { appId: 'spiritswap', groupIds: ['pool'], network },
      { appId: 'spookyswap', groupIds: ['pool'], network },
      { appId: 'tomb', groupIds: ['pool'], network },
    );

    const allTokens = [...appTokens, ...baseTokens];
    const tarotFactoryAddresses = [
      '0x35c052bbf8338b06351782a565aa9aad173432ea', // Tarot Classic
      '0xf6d943c8904195d0f69ba03d97c0baf5bbdcd01b', // Tarot Requiem
      '0xbf76f858b42bb9b196a87e43235c2f0058cf7322', // Tarot Carcosa
    ];

    const allCollateralTokens = await Promise.all(
      tarotFactoryAddresses.map(async tarotFactoryAddress => {
        const tarotFactory = this.contractFactory.tarotFactory({ address: tarotFactoryAddress, network });
        const numPoolsRaw = await multicall.wrap(tarotFactory).allLendingPoolsLength();
        const collateralTokens = await Promise.all(
          _.range(0, Number(numPoolsRaw)).map(async index => {
            const tarotVaultAddressRaw = await multicall.wrap(tarotFactory).allLendingPools(index);
            const tarotVaultAddress = tarotVaultAddressRaw.toLowerCase();

            const tarotVault = this.contractFactory.tarotVault({ network, address: tarotVaultAddress });
            const isVault = await multicall
              .wrap(tarotVault)
              .isVaultToken()
              .catch(() => false);
            if (!isVault) return null;

            const vaultData = await multicall.wrap(tarotFactory).getLendingPool(tarotVaultAddress);
            const collateralTokenAddress = vaultData.collateral.toLowerCase();
            const collateralTokenContract = this.contractFactory.tarotVault({
              network,
              address: collateralTokenAddress,
            });
            const vaultUnderlyingTokenAddressRaw = await multicall.wrap(collateralTokenContract).underlying();
            const vaultUnderlyingTokenContract = this.contractFactory.tarotVault({
              network,
              address: vaultUnderlyingTokenAddressRaw,
            });

            const underlyingTokenAddressRaw = await multicall.wrap(vaultUnderlyingTokenContract).underlying();
            const underlyingTokenAddress = underlyingTokenAddressRaw.toLowerCase();
            const underlyingToken = allTokens.find(v => v.address === underlyingTokenAddress);
            if (!underlyingToken) return null;

            const [exchangeRateRaw, supplyRaw] = await Promise.all([
              multicall.wrap(tarotVault).exchangeRate(),
              multicall.wrap(tarotVault).totalSupply(),
            ]);

            const supply = Number(supplyRaw) / 10 ** 18;
            const pricePerShare = Number(exchangeRateRaw) / 10 ** 18;
            const price = pricePerShare * underlyingToken.price;

            const collateralToken: AppTokenPosition = {
              type: ContractType.APP_TOKEN,
              appId,
              network: Network.FANTOM_OPERA_MAINNET,
              groupId: TAROT_DEFINITION.groups.collateral.id,
              address: collateralTokenAddress,
              symbol: `cTAROT-${underlyingToken.symbol}`,
              decimals: 18,
              supply,
              pricePerShare,
              price,
              tokens: [underlyingToken],
              dataProps: {},
              displayProps: {
                label: `Deposited ${getLabelFromToken(underlyingToken)} in Tarot`,
                images: getImagesFromToken(underlyingToken),
              },
            };

            return collateralToken;
          }),
        );

        return _.compact(collateralTokens);
      }),
    );

    return _.compact(allCollateralTokens.flat());
  }
}
