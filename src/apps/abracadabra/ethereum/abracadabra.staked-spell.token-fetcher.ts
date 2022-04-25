import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { APP_TOOLKIT, IAppToolkit } from '~lib';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { ABRACADABRA_DEFINITION } from '../abracadabra.definition';
import { AbracadabraContractFactory } from '../contracts';

const appId = ABRACADABRA_DEFINITION.id;
const groupId = ABRACADABRA_DEFINITION.groups.stakedSpell.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumAbracadabraStakedSpellTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AbracadabraContractFactory) private readonly contractFactory: AbracadabraContractFactory,
  ) {}

  async getPositions() {
    const prices = await this.appToolkit.getBaseTokenPrices(network);
    const contractFactory = this.contractFactory;
    const multicall = this.appToolkit.getMulticall(network);

    const spellAddress = '0x090185f2135308bad17527004364ebcc2d37e5f6';
    const sSpellAddress = '0x26fa3fffb6efe8c1e69103acb4044c26b9a106a9';
    const tokenContract = contractFactory.erc20({ network, address: sSpellAddress });
    const underlyingToken = prices.find(p => p.address === spellAddress);
    const underlyingTokenContract = contractFactory.erc20({ network, address: spellAddress });

    if (!underlyingToken) return [];

    const [symbol, decimals, supplyRaw, reserveRaw] = await Promise.all([
      multicall.wrap(tokenContract).symbol(),
      multicall.wrap(tokenContract).decimals(),
      multicall.wrap(tokenContract).totalSupply(),
      multicall.wrap(underlyingTokenContract).balanceOf(sSpellAddress),
    ]);

    const supply = Number(supplyRaw) / 10 ** decimals;
    const reserve = Number(reserveRaw) / 10 ** underlyingToken.decimals;
    const pricePerShare = reserve / supply;
    const price = pricePerShare * underlyingToken.price;
    const liquidity = supply * price;
    const tokens = [underlyingToken];

    const token: AppTokenPosition = {
      type: ContractType.APP_TOKEN,
      address: sSpellAddress,
      network,
      symbol,
      decimals,
      supply,
      appId,
      groupId,
      price,
      pricePerShare,
      tokens,
      dataProps: {
        liquidity,
      },
      displayProps: {
        label: symbol,
        secondaryLabel: buildDollarDisplayItem(price),
        images: [getTokenImg(spellAddress, network)],
        statsItems: [{ label: 'Liquidity', value: buildDollarDisplayItem(liquidity) }],
      },
    };

    return [token];
  }
}
