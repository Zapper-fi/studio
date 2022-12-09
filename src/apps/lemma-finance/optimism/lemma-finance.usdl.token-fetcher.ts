import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getAppAssetImage } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { LemmaFinanceContractFactory } from '../contracts';
import LEMMA_FINANCE_DEFINITION from '../lemma-finance.definition';

const appId = LEMMA_FINANCE_DEFINITION.id;
const groupId = LEMMA_FINANCE_DEFINITION.groups.usdl.id;
const network = Network.OPTIMISM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class OptimismLemmaFinanceUsdlTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(LemmaFinanceContractFactory) private readonly contractFactory: LemmaFinanceContractFactory,
  ) {}

  async getPositions() {
    const BaseTokens = [
      '0x4200000000000000000000000000000000000006', // WETH
      '0x68f180fcce6836688e9084f035309e29bf0a2095', // Wbtc
      '0x350a791bfc2c21f9ed5d10980dad2e2638ffa7f6', // Link
      '0x0994206dfe8de6ec6920ff4d779b0d950605fb53', // CRV
      '0x9e1028f5f1d5ede59748ffcee5532509976840e0', // Perp
      '0x76fb31fb4af56892a25e32cfc43de717950c9278', // AAVE
    ];

    const usdlAddresses = ['0x96f2539d3684dbde8b3242a51a73b66360a5b541'];
    const imageURL = getAppAssetImage(appId, 'USDL');

    const multicall = this.appToolkit.getMulticall(network);
    const tokens = await Promise.all(
      usdlAddresses.map(async usdlAddress => {
        // Instantiate a smart contract instance pointing to the jar token address
        const contract = this.contractFactory.usdl({
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

        const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
        let tokens: any[] = [];
        BaseTokens.map(async address => {
          const collateralToken = baseTokens.find(x => x.address.toLowerCase() === address.toLowerCase());
          tokens = [collateralToken, ...tokens];
        });
        tokens = tokens.reverse();
        // Denormalize the supply
        const supply = Number(supplyRaw) / 10 ** decimals;
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
          dataProps: {
            liquidity: supply * price,
          },
          displayProps: {
            label,
            images,
            secondaryLabel,
          },
        };
        return token;
      }),
    );
    return tokens;
  }
}
