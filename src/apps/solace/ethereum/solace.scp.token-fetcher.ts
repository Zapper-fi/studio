import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { SolaceContractFactory } from '../contracts';
import { SOLACE_DEFINITION } from '../solace.definition';

const appId = SOLACE_DEFINITION.id;
const groupId = SOLACE_DEFINITION.groups.scp.id;
const network = Network.ETHEREUM_MAINNET;

const SCP_ADDRESS = '0x501acee83a6f269b77c167c6701843d454e2efa0';
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const SOLACE_ADDRESS = '0x501ace9c35e60f03a2af4d484f49f9b1efde9f40';

@Register.TokenPositionFetcher({ appId, groupId, network, options: { includeInTvl: true } })
export class EthereumSolaceScpTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SolaceContractFactory) private readonly solaceContractFactory: SolaceContractFactory,
  ) {}

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);

    const eth = baseTokens.find(t => t.address === ZERO_ADDRESS)!;
    const scpTokenContract = this.solaceContractFactory.scp({ address: SCP_ADDRESS, network });
    const [symbol, decimals, supplyRaw, pricePerShareRaw] = await Promise.all([
      multicall.wrap(scpTokenContract).symbol(),
      multicall.wrap(scpTokenContract).decimals(),
      multicall.wrap(scpTokenContract).totalSupply(),
      multicall.wrap(scpTokenContract).pricePerShare(),
    ]);

    const supply = Number(supplyRaw) / 10 ** decimals;
    const pricePerShare = Number(pricePerShareRaw) / 10 ** decimals;
    const price = eth.price * pricePerShare;
    const liquidity = supply * price;
    const tokens = [eth];

    const token: AppTokenPosition = {
      type: ContractType.APP_TOKEN,
      appId,
      groupId,
      address: SCP_ADDRESS,
      network,
      symbol,
      decimals,
      supply,
      price,
      pricePerShare,
      tokens,
      dataProps: {
        liquidity,
      },
      displayProps: {
        label: symbol,
        secondaryLabel: buildDollarDisplayItem(price),
        images: [getTokenImg(SOLACE_ADDRESS, network)],
        statsItems: [{ label: 'Liquidity', value: buildDollarDisplayItem(liquidity) }],
      },
    };

    return [token];
  }
}
