import { Inject } from '@nestjs/common';
import _ from 'lodash';

import { Register } from '~app-toolkit/decorators';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { APP_TOOLKIT, IAppToolkit } from '~lib';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { KeeperDaoContractFactory } from '../contracts';
import { KEEPER_DAO_DEFINITION } from '../keeper-dao.definition';

const tokens = [
  {
    address: '0x77565202d78a6eda565c7dc737ff1d8e64fd672a', // kBTC
    underlyingAddress: '0xeb4c2781e4eba804ce9a9803c67d0893436bb27d',
  },
  {
    address: '0x8ee17fa30d63ebd66e02205b1df2f30d60a5ca30', // kDAI
    underlyingAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
  },
  {
    address: '0x179212cb86d0ee6a4dfb2abb1cf6a09fee0a9525', // kETH
    underlyingAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  },
  {
    address: '0x3045312fb54f00f43d6607999e387db58ffb4cf4', // kUSDC
    underlyingAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  },
  {
    address: '0x834cacd6425fa6c7126b028b3d1e4cda53eb7257', // kWETH
    underlyingAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  },
  {
    address: '0x8ac32f0a635a0896a8428a9c31fbf1ab06ecf489', // xROOK
    underlyingAddress: '0xfa5047c9c78b8877af97bdcb85db743fd7313d4a',
  },
];
const appId = KEEPER_DAO_DEFINITION.id;
const groupId = KEEPER_DAO_DEFINITION.groups.v3Pool.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumKeeperDaoV3PoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(KeeperDaoContractFactory) private readonly contractFactory: KeeperDaoContractFactory,
  ) {}

  async getPositions(): Promise<AppTokenPosition[]> {
    const multicall = this.appToolkit.getMulticall(network);
    const prices = await this.appToolkit.getBaseTokenPrices(network);

    const appTokens = await Promise.all(
      tokens.map(async t => {
        const underlyingToken = prices.find(p => p.address === t.underlyingAddress);
        if (!underlyingToken) return null;

        const contract = this.contractFactory.erc20({ address: t.address, network });
        const [symbol, decimals, supplyRaw] = await Promise.all([
          multicall.wrap(contract).symbol(),
          multicall.wrap(contract).decimals(),
          multicall.wrap(contract).totalSupply(),
        ]);

        const token: AppTokenPosition = {
          address: t.address,
          symbol,
          decimals,
          appId,
          type: ContractType.APP_TOKEN,
          network,
          groupId,
          displayProps: {
            label: symbol,
            images: [getTokenImg(underlyingToken.address, network)],
          },
          dataProps: {},
          price: underlyingToken.price,
          pricePerShare: 1,
          supply: Number(supplyRaw) / 10 ** decimals,
          tokens: [underlyingToken],
        };
        return token;
      }),
    );

    return _.compact(appTokens);
  }
}
