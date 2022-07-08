import { DefaultDataProps } from '~position/display.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';

interface ITenderTokenFetcher extends PositionFetcher<AppTokenPosition> {
  getPosition(address: string, steak: string, symbol: string, virtualPrice: string): Promise<AppTokenPosition>;
}

export abstract class TenderTokenFetcher implements ITenderTokenFetcher {
  getPositions(): Promise<AppTokenPosition<DefaultDataProps>[]>;

  getPosition(
    address: string,
    steak: string,
    symbol: string,
    virtualPrice: string,
  ): Promise<AppTokenPosition<DefaultDataProps>> {
    const multicall = this.appToolkit.getMulticall(network);
    const contract = this.tenderizeContractFactory.erc20({ address, network });
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const underlyingToken = baseTokens.find(v => v.address === steak)!;

    const [decimals, totalSupply] = await Promise.all([
      multicall.wrap(contract).decimals(),
      multicall.wrap(contract).totalSupply(),
    ]);
    const supply = Number(totalSupply) / 10 ** decimals;
    const price = underlyingToken.price * (Number(virtualPrice) / 10 ** decimals);
    const token: AppTokenPosition = {
      address,
      network,
      appId,
      groupId,
      symbol,
      decimals,
      supply,
      tokens: [],
      dataProps: {},
      pricePerShare: 1,
      price,
      type: ContractType.APP_TOKEN,
      displayProps: {
        label: symbol,
        secondaryLabel: buildDollarDisplayItem(price),
        tertiaryLabel: `19.34% APY`,
        images: [`https://app.tenderize.me/tender${symbol.substring(1)}.svg`],
        statsItems: [],
      },
    };

    return token;
  }
}
