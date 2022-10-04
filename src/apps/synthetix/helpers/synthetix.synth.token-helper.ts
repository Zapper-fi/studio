import { Inject, Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import { parseBytes32String } from 'ethers/lib/utils';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getAppAssetImage } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { SynthetixContractFactory } from '../contracts';
import { SYNTHETIX_DEFINITION } from '../synthetix.definition';

export type SynthetixSynthTokenHelperParams = {
  network: Network;
  resolverAddress: string;
  exchangeable?: boolean;
};

export type SynthetixAppTokenDataProps = {
  exchangeable: boolean;
  liquidity: number;
};

const appId = SYNTHETIX_DEFINITION.id;

@Injectable()
export class SynthetixSynthTokenHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SynthetixContractFactory) private readonly contractFactory: SynthetixContractFactory,
  ) {}

  async getTokens({ network, resolverAddress, exchangeable = false }: SynthetixSynthTokenHelperParams) {
    const multicall = this.appToolkit.getMulticall(network);

    const addressResolverContract = this.contractFactory.synthetixAddressResolver({
      address: resolverAddress,
      network,
    });

    const synthUtilName = ethers.utils.formatBytes32String('SynthUtil');
    const synthUtilAddress = await addressResolverContract.getAddress(synthUtilName);
    const snxUtilsContract = this.contractFactory.synthetixSummaryUtil({ address: synthUtilAddress, network });
    const synthRates = await snxUtilsContract.synthsRates();
    const synthSymbolBytes = synthRates[0];
    const synthPrices = synthRates[1];
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const susdToken = baseTokens.find(p => p.symbol === 'sUSD')!;
    const susdMarketPice = susdToken.price;

    const tokens = await Promise.all(
      synthSymbolBytes.map(async (byte, i) => {
        const symbol = parseBytes32String(byte);
        const decimals = 18;
        const implAddressRaw = await multicall.wrap(addressResolverContract).getSynth(byte);
        const implAddress = implAddressRaw.toLowerCase();
        const synthContract = this.contractFactory.synthetixNetworkToken({ address: implAddress, network });
        const addressRaw = await multicall.wrap(synthContract).proxy();
        const supplyRaw = await multicall.wrap(synthContract).totalSupply();
        const address = addressRaw.toLowerCase();
        const supply = Number(supplyRaw) / 10 ** decimals;
        const price = (Number(synthPrices[i]) * susdMarketPice) / 10 ** decimals;
        const pricePerShare = 1;
        const tokens = [];
        const liquidity = supply * price;

        // Display Props
        const label = symbol;
        const secondaryLabel = buildDollarDisplayItem(price);
        const images = [getAppAssetImage(appId, symbol)];
        const statsItems = [{ label: 'Liquidity', value: buildDollarDisplayItem(liquidity) }];

        const token: AppTokenPosition<SynthetixAppTokenDataProps> = {
          type: ContractType.APP_TOKEN,
          appId: SYNTHETIX_DEFINITION.id,
          groupId: SYNTHETIX_DEFINITION.groups.synth.id,
          network,
          address,
          symbol,
          decimals,
          supply,
          price,
          pricePerShare,
          tokens,

          dataProps: {
            exchangeable,
            liquidity,
          },

          displayProps: {
            label,
            secondaryLabel,
            images,
            statsItems,
          },
        };

        return token;
      }),
    );

    return tokens;
  }
}
