import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { LemmafinanceContractFactory } from '../contracts';
import { LEMMAFINANCE_DEFINITION } from '../lemmafinance.definition';

const appId = LEMMAFINANCE_DEFINITION.id;
const groupId = LEMMAFINANCE_DEFINITION.groups.xusdl.id;
const network = Network.OPTIMISM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class OptimismLemmafinanceXusdlTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(LemmafinanceContractFactory) private readonly lemmafinanceContractFactory: LemmafinanceContractFactory,
  ) {}

  async getPositions() {
    const xusdlAddresses = ["0x252Ea7E68a27390Ce0D53851192839A39Ab8B38C"];

    const multicall = this.appToolkit.getMulticall(network);
    const tokens = await Promise.all(
      xusdlAddresses.map(async (xusdlAddress) => {
        // Instantiate a smart contract instance pointing to the jar token address
        const contract = this.lemmafinanceContractFactory.xusdl({
          address: xusdlAddress,
          network,
        });

        // Request the symbol, decimals, ands supply for the jar token
        const [symbol, decimals, supplyRaw, assetsPerShare] = await Promise.all([
          multicall.wrap(contract).symbol(),
          multicall.wrap(contract).decimals(),
          multicall.wrap(contract).totalSupply(),
          multicall.wrap(contract).assetsPerShare()
        ]);

        // Denormalize the supply
        const supply = Number(supplyRaw) / 10 ** decimals;
        const tokens: any = [xusdlAddress];
        const price = Number(assetsPerShare);
        const pricePerShare = Number(assetsPerShare);

        // // As a label, we'll use the underlying label (i.e.: 'LOOKS' or 'UNI-V2 LOOKS / ETH'), and suffix it with 'Jar'
        // const label = `USDLL`;
        // // For images, we'll use the underlying token images as well
        // const images = getImagesFromToken(usdlAddress);
        // // For the secondary label, we'll use the price of the jar token
        // const secondaryLabel = buildDollarDisplayItem(price);
        // // And for a tertiary label, we'll use the APY
        // const tertiaryLabel = `${(apy * 100).toFixed(3)}% APY`;

        // Create the token object
        const token: AppTokenPosition = {
          type: ContractType.APP_TOKEN,
          appId,
          groupId,
          address: xusdlAddress,
          network,
          symbol,
          decimals,
          supply,
          tokens,
          price,
          pricePerShare,
          dataProps: {},
          displayProps: {
            label: '',
            images: [''],
            secondaryLabel: '',
            tertiaryLabel: '',
          },
        };
        return token;
      })
    );

      return tokens;  
  }
}
