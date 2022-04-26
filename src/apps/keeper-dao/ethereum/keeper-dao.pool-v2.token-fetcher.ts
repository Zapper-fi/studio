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
    address: '0xdcaf89b0937c15eab969ea01f57aaacc92a21995',
    underlyingAddress: '0xeb4c2781e4eba804ce9a9803c67d0893436bb27d',
  },
  {
    address: '0x0314b6cc36ea9b48f34a350828ce98f17b76bc44',
    underlyingAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
  },
  {
    address: '0xc4c43c78fb32f2c7f8417af5af3b85f090f1d327',
    underlyingAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  },
  {
    address: '0xac826952bc30504359a099c3a486d44e97415c77',
    underlyingAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  },
  {
    address: '0xac19815455c2c438af8a8b4623f65f091364be10',
    underlyingAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  },
];

const appId = KEEPER_DAO_DEFINITION.id;
const groupId = KEEPER_DAO_DEFINITION.groups.v2Pool.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumKeeperDaoV2PoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
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
            label: `Legacy ${symbol}`,
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
