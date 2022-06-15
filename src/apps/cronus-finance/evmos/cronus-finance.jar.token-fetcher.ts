import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { CronusFinanceContractFactory } from '../contracts';
import { CRONUS_FINANCE_DEFINITION } from '../cronus-finance.definition';

const appId = CRONUS_FINANCE_DEFINITION.id;
const groupId = CRONUS_FINANCE_DEFINITION.groups.jar.id;
const network = Network.EVMOS_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EvmosCronusFinanceJarTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(CronusFinanceContractFactory) private readonly cronusFinanceContractFactory: CronusFinanceContractFactory,
  ) {}

  async getPositions() {
    const jarAddresses = [
      '0x1488346419FFc85C6D54E71be80a222971fb2240', // crn
      '0x28c98da13f22fe98a93d79442b3f81c7e9c5c3c0', // wevmos-crn
      '0xc3edBd08EBE51cB5e824ecd1Df6AaFaead3bee47', // wevmos-usdc
      '0x80ee8297c9fcf6bbe2f4d4c9b50831cb65d61bf0', // crn-usdc
    ].map(e => e.toLowerCase());
    const baseAddresses = [
      '0x51e44ffad5c2b122c8b635671fcc8139dc636e82', // usdc
      '0xd4949664cd82660aae99bedc034a0dea8a0bd517', // wevmos
    ].map(e => e.toLowerCase());

    // Create a multicall wrapper instance to batch chain RPC calls together
    const multicall = this.appToolkit.getMulticall(network);

    // We will build a token object for each jar address, using data retrieved on-chain with Ethers
    const tokens = await Promise.all(
      [...jarAddresses, ...baseAddresses].map(async jarAddress => {
        // Instantiate a smart contract instance pointing to the jar token address
        const contract = this.cronusFinanceContractFactory.erc20({
          address: jarAddress,
          network,
        });

        // Request the symbol, decimals, ands supply for the jar token
        const [symbol, decimals, supplyRaw] = await Promise.all([
          multicall.wrap(contract).symbol(),
          multicall.wrap(contract).decimals(),
          multicall.wrap(contract).totalSupply(),
        ]);

        // Denormalize the supply
        const supply = Number(supplyRaw) / 10 ** decimals;

        // Create the token object
        const token: AppTokenPosition = {
          type: ContractType.APP_TOKEN,
          appId,
          groupId,
          address: jarAddress,
          network,
          symbol,
          decimals,
          supply,
        };

        return token;
      }),
    );

    // calculate crn price
    const usdc = this.cronusFinanceContractFactory.erc20({
      address: baseAddresses[0],
      network,
    });
    const crn = this.cronusFinanceContractFactory.erc20({
      address: jarAddresses[0],
      network,
    });
    const wevmos = this.cronusFinanceContractFactory.erc20({
      address: baseAddresses[1],
      network,
    });

    const { crnPrice, crnUsdcPrice } = await (async () => {
      const usdcBalance = await usdc.balanceOf(jarAddresses[3]);
      const crnBalance = await crn.balanceOf(jarAddresses[3]);
      const lpTotalSupply = tokens[3].supply;
      const crnPrice = Number(usdcBalance) / 10 ** tokens[4].decimals / (Number(crnBalance) / 10 ** tokens[0].decimals);
      const lpPrice = (Number(usdcBalance) * 2) / 10 ** tokens[4].decimals / Number(lpTotalSupply);
      return { crnPrice, crnUsdcPrice: lpPrice };
    })();

    tokens[0].price = crnPrice;
    tokens[3].price = crnUsdcPrice;

    // calculate wevmos price
    const { wevmosPrice, wevmosUsdcPrice } = await (async () => {
      const usdcBalance = await usdc.balanceOf(jarAddresses[2]);
      const wevmosBalance = await wevmos.balanceOf(jarAddresses[2]);
      const lpTotalSupply = tokens[2].supply;
      const wevmosPrice =
        Number(usdcBalance) / 10 ** tokens[4].decimals / (Number(wevmosBalance) / 10 ** tokens[5].decimals);
      const lpPrice = (Number(usdcBalance) * 2) / 10 ** tokens[4].decimals / Number(lpTotalSupply);
      return { wevmosPrice, wevmosUsdcPrice: lpPrice };
    })();

    tokens[5].price = wevmosPrice;
    tokens[2].price = wevmosUsdcPrice;

    // calculate wevmos-crn
    const { wevmosCrnPrice } = await (async () => {
      const crnBalance = await crn.balanceOf(jarAddresses[1]);
      const lpTotalSupply = tokens[1].supply;

      const lpPrice = (Number(crnBalance) * 2 * crnPrice) / 10 ** tokens[1].decimals / Number(lpTotalSupply);
      return { wevmosCrnPrice: lpPrice };
    })();

    tokens[1].price = wevmosCrnPrice;

    tokens[3].tokens = [tokens[0], tokens[4]];
    tokens[1].tokens = [tokens[5], tokens[0]];
    tokens[2].tokens = [tokens[5], tokens[4]];

    tokens[0].displayProps = {
      label: 'CRN',
      secondaryLabel: 'CRN',
      images: ['https://assets.coingecko.com/coins/images/24022/thumb/h8GHzr2W_400x400.jpg?1646096205'],
    };
    tokens[0].dataProps = {
      liquidity: tokens[1].price * tokens[1].supply + tokens[3].price * tokens[3].supply,
    };

    tokens[4].displayProps = {
      label: 'USDC',
      secondaryLabel: 'USDC',
      images: ['https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png?1547042389'],
    };
    tokens[5].displayProps = {
      label: 'EVMOS',
      secondaryLabel: 'EVMOS',
      images: ['https://assets.coingecko.com/coins/images/24023/thumb/evmos.png?1653958927'],
    };

    tokens[1].displayProps = {
      label: 'WEVMOS-CRN',
      secondaryLabel: 'CRN-LP',
      images: [
        'https://assets.coingecko.com/coins/images/24023/thumb/evmos.png?1653958927',
        'https://assets.coingecko.com/coins/images/24022/thumb/h8GHzr2W_400x400.jpg?1646096205',
      ],
    };
    tokens[1].dataProps = {
      liquidity: tokens[1].price * tokens[1].supply,
    };

    tokens[2].displayProps = {
      label: 'WEVMOS-USDC',
      secondaryLabel: 'CRN-LP',
      images: [
        'https://assets.coingecko.com/coins/images/24023/thumb/evmos.png?1653958927',
        'https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png?1547042389',
      ],
    };
    tokens[2].dataProps = {
      liquidity: tokens[2].price * tokens[2].supply,
    };

    tokens[3].displayProps = {
      label: 'CRN-USDC',
      secondaryLabel: 'CRN-LP',
      images: [
        'https://assets.coingecko.com/coins/images/24022/thumb/h8GHzr2W_400x400.jpg?1646096205',
        'https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png?1547042389',
      ],
    };
    tokens[3].dataProps = {
      liquidity: tokens[3].price * tokens[3].supply,
    };
    return tokens.slice(0, 4);
  }
}
