import { Token } from '@kyberswap/ks-sdk-core';
import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { LemmafinanceContractFactory, Xusdl } from '../contracts';
import { LEMMAFINANCE_DEFINITION } from '../lemmafinance.definition';

const appId = LEMMAFINANCE_DEFINITION.id;
const groupId = LEMMAFINANCE_DEFINITION.groups.usdl.id;
const network = Network.OPTIMISM_MAINNET;

export type USDLTokenDataProps = {};

@Register.TokenPositionFetcher({ appId, groupId, network })
export class OptimismLemmafinanceUsdlTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(LemmafinanceContractFactory) private readonly lemmafinanceContractFactory: LemmafinanceContractFactory,
  ) {}

  async getPositions() {
    const usdlAddresses = ['0x96F2539d3684dbde8B3242A51A73B66360a5B541'];
    const imageURL = 'src/apps/lemmafinance/assets/USDL.png';
    const multicall = this.appToolkit.getMulticall(network);
    const tokens = await Promise.all(
      usdlAddresses.map(async usdlAddress => {
        // Instantiate a smart contract instance pointing to the jar token address
        const contract = this.lemmafinanceContractFactory.usdl({
          address: usdlAddress,
          network,
        });

        // Request the symbol, decimals, ands supply for the jar token
        const [name, symbol, decimals, supplyRaw] = await Promise.all([
          multicall.wrap(contract).name(),
          multicall.wrap(contract).symbol(),
          multicall.wrap(contract).decimals(),
          multicall.wrap(contract).totalSupply(),
        ]);

        // Denormalize the supply
        const supply = Number(supplyRaw) / 10 ** decimals;
        const tokens: any = [usdlAddress];
        const price = Number(1);
        const pricePerShare = Number(1);

        // // As a label, we'll use the underlying label (i.e.: 'LOOKS' or 'UNI-V2 LOOKS / ETH'), and suffix it with 'Jar'
        const label = `${name} (${symbol})`;
        // // For images, we'll use the underlying token images as well
        const images = [imageURL];
        // // For the secondary label, we'll use the price of the jar token
        const secondaryLabel = buildDollarDisplayItem(price);
        // // And for a tertiary label, we'll use the APY
        // const tertiaryLabel = `${(apy * 100).toFixed(3)}% APY`;

        // Create the token object
        const token: AppTokenPosition = {
          type: ContractType.APP_TOKEN,
          appId,
          groupId,
          address: usdlAddress,
          network,
          symbol,
          decimals,
          supply,
          tokens,
          price,
          pricePerShare,
          dataProps: {},
          displayProps: {
            label,
            images,
            secondaryLabel,
            tertiaryLabel: '',
          },
        };
        return token;
      }),
    );
    return tokens;
  }
}
