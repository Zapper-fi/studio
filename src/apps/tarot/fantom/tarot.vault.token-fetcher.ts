import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { TarotContractFactory } from '../contracts';
import { TAROT_DEFINITION } from '../tarot.definition';

const SUPPLY_VAULT_TOKENS = [
  '0x74d1d2a851e339b8cb953716445be7e8abdf92f4', // xTAROT
  '0x0defef0c977809db8c1a3f13fd8dacbd565d968e', // tFTM
  '0x68d211bc1e66814575d89bbe4f352b4cdbdacdfb', // tUSDC
  '0x87d05774362ff39af4944f949a34399baeb64a35', // tUSDC (Paused)
];

const appId = TAROT_DEFINITION.id;
const groupId = TAROT_DEFINITION.groups.vault.id;
const network = Network.FANTOM_OPERA_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class FantomTarotVaultTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(TarotContractFactory) private readonly contractFactory: TarotContractFactory,
  ) {}

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);
    const prices = await this.appToolkit.getBaseTokenPrices(network);

    const supplyVaultTokens = await Promise.all(
      SUPPLY_VAULT_TOKENS.map(async tokenAddress => {
        const tokenContract = multicall.wrap(this.contractFactory.tarotSupplyVault({ network, address: tokenAddress }));

        const [symbol, underlyingAddressRaw, supplyRaw, decimals, reserveRaw] = await Promise.all([
          tokenContract.symbol(),
          tokenContract.underlying(),
          tokenContract.totalSupply(),
          tokenContract.decimals(),
          tokenContract.getTotalUnderlying(),
        ]);

        const underlyingAddress = underlyingAddressRaw.toLowerCase();
        const underlyingToken = prices.find(price => price.address === underlyingAddress);
        if (!underlyingToken) return null;

        const supply = Number(supplyRaw) / 10 ** decimals;
        const reserve = Number(reserveRaw) / 10 ** underlyingToken.decimals;
        const pricePerShare = supply > 0 ? reserve / supply : 0;
        const price = pricePerShare * underlyingToken.price;
        const liquidity = underlyingToken.price * reserve;

        const supplyVaultToken: AppTokenPosition = {
          type: ContractType.APP_TOKEN,
          appId,
          network,
          groupId,
          address: tokenAddress,
          symbol,
          decimals,
          price,
          pricePerShare,
          supply,
          tokens: [underlyingToken],

          dataProps: {
            liquidity,
          },

          displayProps: {
            label: symbol,
            images: [getTokenImg(underlyingAddress, network)],
            statsItems: [{ label: 'Liquidity', value: buildDollarDisplayItem(liquidity) }],
          },
        };

        return supplyVaultToken;
      }),
    );

    return _.compact(supplyVaultTokens);
  }
}
