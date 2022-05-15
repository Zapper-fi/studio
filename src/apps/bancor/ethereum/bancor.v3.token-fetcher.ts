import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ETH_ADDR_ALIAS } from '~app-toolkit/constants/address';
import { Register } from '~app-toolkit/decorators';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { BANCOR_DEFINITION } from '../bancor.definition';
import { BancorContractFactory } from '../contracts';

const WETH_ADDRESS = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';

const appId = BANCOR_DEFINITION.id;
const groupId = BANCOR_DEFINITION.groups.v3.id;
const network = Network.ETHEREUM_MAINNET;
const address = '0xec9596e0eb67228d61a12cfdb4b3608281f261b3'.toLowerCase();

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumBancorV3TokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(BancorContractFactory) private readonly bancorContractFactory: BancorContractFactory,
  ) {}

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);
    const contract = this.bancorContractFactory.poolCollection({ address, network });
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const pools = (await multicall.wrap(contract).pools()).map(p => p.toLowerCase());

    const tokens = await Promise.all(
      pools.map(async pool => {
        const poolToken = (await multicall.wrap(contract).poolToken(pool)).toLowerCase();

        // Currently bugged (always returns 1): see https://discord.com/channels/476133894043729930/764907781462425680/975085730500059216
        const pricePerShare = Number(await multicall.wrap(contract).underlyingToPoolToken(pool, 1));

        const tokenContract = this.appToolkit.globalContracts.erc20({ address: poolToken, network });
        const [symbol, decimals, supplyRaw, label] = await Promise.all([
          multicall.wrap(tokenContract).symbol(),
          multicall.wrap(tokenContract).decimals(),
          multicall.wrap(tokenContract).totalSupply(),
          multicall.wrap(tokenContract).name(),
        ]);

        const supply = Number(supplyRaw) / 10 ** decimals;
        const underlyingAddress = pool === ETH_ADDR_ALIAS ? WETH_ADDRESS : pool;
        const underlyingToken = baseTokens.find(token => token.address === underlyingAddress)!;
        const price = underlyingToken.price * pricePerShare;

        const token: AppTokenPosition = {
          type: ContractType.APP_TOKEN,
          appId,
          groupId,
          address: poolToken,
          network,
          symbol,
          decimals,
          supply,
          tokens: [underlyingToken],
          price,
          pricePerShare,
          dataProps: {},
          displayProps: {
            label,
            images: [],
          },
        };
        return token;
      }),
    );

    return tokens;
  }
}
