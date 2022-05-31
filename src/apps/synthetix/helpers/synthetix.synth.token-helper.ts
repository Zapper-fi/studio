import { Inject, Injectable } from '@nestjs/common';
import { parseBytes32String } from 'ethers/lib/utils';
import { padEnd } from 'lodash';
import Web3 from 'web3';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { SynthetixContractFactory } from '../contracts';
import { SYNTHETIX_DEFINITION } from '../synthetix.definition';

export type SynthetixSynthTokenHelperParams = {
  network: Network;
  resolverAddress: string;
};

@Injectable()
export class SynthetixSynthTokenHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SynthetixContractFactory) private readonly contractFactory: SynthetixContractFactory,
  ) {}

  async getTokens({ network, resolverAddress }: SynthetixSynthTokenHelperParams) {
    const multicall = this.appToolkit.getMulticall(network);

    const addressResolverContract = this.contractFactory.synthetixAddressResolver({
      address: resolverAddress,
      network,
    });

    const synthUtilName = padEnd(Web3.utils.asciiToHex('SynthUtil'), 66, '0');
    const synthUtilAddress = await addressResolverContract.getAddress(synthUtilName);
    const snxUtilsContract = this.contractFactory.synthetixSummaryUtil({ address: synthUtilAddress, network });
    const synthRates = await snxUtilsContract.synthsRates();
    const synthSymbolBytes = synthRates[0];
    const synthPrices = synthRates[1];

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
        const price = Number(synthPrices[i]) / 10 ** 18;
        const pricePerShare = 1;
        const tokens = [];

        // Display Props
        const label = symbol;
        const secondaryLabel = buildDollarDisplayItem(price);
        const images = [getTokenImg(address, network)];

        const token: AppTokenPosition = {
          type: ContractType.APP_TOKEN,
          appId: SYNTHETIX_DEFINITION.id,
          groupId: SYNTHETIX_DEFINITION.groups.synth.id,
          network: network,
          address,
          symbol,
          decimals,
          supply,
          price,
          pricePerShare,
          tokens,

          dataProps: {},

          displayProps: {
            label,
            secondaryLabel,
            images,
          },
        };

        return token;
      }),
    );

    return tokens;
  }
}
