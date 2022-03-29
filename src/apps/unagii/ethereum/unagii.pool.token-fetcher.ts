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
const network = Network.ETHEREUM_MAINNET;

const vaultAddresses = [
  '0x9ce3018375d305ce3c3303a26ef62d3d2eb8561a',
  '0x7f75d72886d6a8677321e5602d18948abcb4281a',
  '0x1eb06eae3263a35619dc87812a8e7ec811b59e63',
  '0xb088d7c71ea9ebaed981c103fc3019b59950d2c9',
  '0x8ef11c51a666c53aeeec504f120cd1435e451342',
];

@Register.TokenPositionFetcher({
  appId: UNAGII_DEFINITION.id,
  groupId: UNAGII_DEFINITION.groups.vault.id,
  network,
})
export class EthereumUnagiiPoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(UnagiiContractFactory)
    private readonly unagiiContractFactory: UnagiiContractFactory,
  ) {}

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);

    const vaultTokens = await Promise.all(
      vaultAddresses.map(async vault => {
        const vaultContract = this.unagiiContractFactory.unagiiV2Vault({ address: vault, network });
        const [totalAssetsRaw, underlyingTokenAddressRaw, tokenAddressRaw] = await Promise.all([
          multicall.wrap(vaultContract).totalAssets(),
          multicall.wrap(vaultContract).token(),
          multicall.wrap(vaultContract).uToken(),
        ]);
        //tokenAddressRaw
        const uTokenContract = this.unagiiContractFactory.erc20({ address: tokenAddressRaw, network });
        const [totalSupplyRaw, decimalsRaw, symbol] = await Promise.all([
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
        const totalSupply = Number(totalSupplyRaw) / 10 ** Number(decimalsRaw);
        const underlyingAssets = Number(totalAssetsRaw) / 10 ** underlyingToken.decimals;

        // Determine the price per share
        const pricePerShare = underlyingAssets / totalSupply;
        const price = pricePerShare * underlyingToken.price;

        const reserve = totalSupply * pricePerShare;
        const liquidity = reserve * underlyingPrice;

        const tokens = [{ ...underlyingToken, reserve }];
        const reservePercentages = tokens.map(t => reserve * (t.price / liquidity));
        const secondaryLabel = reservePercentages.map(p => `${Math.round(p * 100)}%`).join(' / ');

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
              value: buildNumberDisplayItem(totalSupply),
            },
          ],
        };

        const dataProps = {
          liquidity,
        };

        const token: AppTokenPosition = {
          address: tokenAddressRaw.toLowerCase(),
          type: ContractType.APP_TOKEN,
          network: Network.ETHEREUM_MAINNET,
          appId: UNAGII_DEFINITION.id,
          groupId: UNAGII_DEFINITION.groups.vault.id,
          symbol,
          decimals: Number(decimalsRaw),
          supply: totalSupply,
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
