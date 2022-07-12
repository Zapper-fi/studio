import { Inject } from '@nestjs/common';
import { compact } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ETH_ADDR_ALIAS, ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem, buildNumberDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { UnagiiContractFactory } from '../contracts';
import { UNAGII_DEFINITION } from '../unagii.definition';

const vaultAddresses = [
  { address: '0x7f75d72886d6a8677321e5602d18948abcb4281a', isActive: true }, // USDC V2
  { address: '0x9ce3018375d305ce3c3303a26ef62d3d2eb8561a', isActive: false }, // DAI V2 (deprecated)
  { address: '0x1eb06eae3263a35619dc87812a8e7ec811b59e63', isActive: false }, // USDT  (deprecated)
  { address: '0xb088d7c71ea9ebaed981c103fc3019b59950d2c9', isActive: true }, // WBTC V2
  { address: '0x8ef11c51a666c53aeeec504f120cd1435e451342', isActive: true }, // ETH V2
];

const appId = UNAGII_DEFINITION.id;
const groupId = UNAGII_DEFINITION.groups.vault.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumUnagiiVaultTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(UnagiiContractFactory)
    private readonly unagiiContractFactory: UnagiiContractFactory,
  ) {}

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);

    const vaultTokens = await Promise.all(
      vaultAddresses.map(async vault => {
        const vaultContract = this.unagiiContractFactory.unagiiV2Vault({ address: vault.address, network });
        const [totalAssetsRaw, underlyingTokenAddressRaw, tokenAddressRaw] = await Promise.all([
          multicall.wrap(vaultContract).totalAssets(),
          multicall.wrap(vaultContract).token(),
          multicall.wrap(vaultContract).uToken(),
        ]);
        const tokenAddress = tokenAddressRaw.toLowerCase();
        const uTokenContract = this.unagiiContractFactory.erc20({ address: tokenAddress, network });
        const [totalSupplyRaw, decimals, symbol] = await Promise.all([
          multicall.wrap(uTokenContract).totalSupply(),
          multicall.wrap(uTokenContract).decimals(),
          multicall.wrap(uTokenContract).symbol(),
        ]);
        const underlyingTokenAddress =
          underlyingTokenAddressRaw.toLowerCase() === ETH_ADDR_ALIAS
            ? ZERO_ADDRESS
            : underlyingTokenAddressRaw.toLowerCase();
        const underlyingToken = await this.appToolkit.getBaseTokenPrice({ network, address: underlyingTokenAddress });
        if (!underlyingToken) return null;

        // Determine total supply
        const underlyingPrice = underlyingToken.price || 0;
        const supply = Number(totalSupplyRaw) / 10 ** decimals;
        const underlyingAssets = Number(totalAssetsRaw) / 10 ** underlyingToken.decimals;

        // Determine the price per share
        const pricePerShare = underlyingAssets / supply;
        const price = pricePerShare * underlyingToken.price;

        const reserve = supply * pricePerShare;
        const liquidity = reserve * underlyingPrice;

        const tokens = [{ ...underlyingToken, reserve }];
        const reservePercentages = tokens.map(t => reserve * (t.price / liquidity));
        const ratio = reservePercentages.map(p => `${Math.round(p * 100)}%`).join(' / ');
        const secondaryLabel = ratio;

        const displayProps = {
          label: symbol,
          secondaryLabel,
          images: [getTokenImg(underlyingToken.address)],
          statsItems: [
            {
              label: 'Liquidity',
              value: buildDollarDisplayItem(liquidity),
            },
            {
              label: 'Supply',
              value: buildNumberDisplayItem(supply),
            },
            {
              label: 'Ratio',
              value: ratio,
            },
          ],
        };

        const dataProps = {
          liquidity,
          isActive: vault.isActive,
        };

        const token: AppTokenPosition = {
          address: tokenAddress,
          type: ContractType.APP_TOKEN,
          network,
          appId,
          groupId,
          symbol,
          decimals,
          supply,
          price,
          pricePerShare,
          tokens,
          dataProps,
          displayProps,
        };

        return token;
      }),
    );

    return compact(vaultTokens);
  }
}
