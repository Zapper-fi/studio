import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { YieldProtocolContractFactory } from '../contracts';
import { YIELD_PROTOCOL_DEFINITION } from '../yield-protocol.definition';

const appId = YIELD_PROTOCOL_DEFINITION.id;
const groupId = YIELD_PROTOCOL_DEFINITION.groups.pool.id;
const network = Network.ETHEREUM_MAINNET;

const YIELD_STRATEGIES = [
  '0x7ACFe277dEd15CabA6a8Da2972b1eb93fe1e2cCD',
  '0x1144e14E9B0AA9e181342c7e6E0a9BaDB4ceD295',
  '0xFBc322415CBC532b54749E31979a803009516b5D',
  '0x8e8D6aB093905C400D583EfD37fbeEB1ee1c0c39',
  '0xcf30A5A994f9aCe5832e30C138C9697cda5E1247',
  '0x831dF23f7278575BA0b136296a285600cD75d076',
  '0x47cc34188a2869daa1ce821c8758aa8442715831',
  '0x1565f539e96c4d440c38979dbc86fd711c995dd6',
];

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumYieldProtocolPoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(YieldProtocolContractFactory) private readonly yieldProtocolContractFactory: YieldProtocolContractFactory,
  ) {}

  async getStrategies() {
    const multicall = this.appToolkit.getMulticall(network);
  }

  async getPositions() {
    const tokens = await Promise.all(
      YIELD_STRATEGIES.map(async address => {
        // const contract =

        // get the corresponding base of the strategy
        const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
        const underlyingToken = baseTokens.find(v => v.address === baseAddress);

        if (!underlyingToken) return null;

        let pricePerShare = 0;
        let price = underlyingToken.price;

        // if there is an associated pool, we estimate the value of a unit of fyToken to base
        if (pool?.id) {
          const estimate = await this.sellFYTokenPreview(matured, pool?.id, decimals);
          pricePerShare = estimate;
          price = pricePerShare * underlyingToken?.price;
        }

        const dataProps: FyTokenDataProps = {
          matured,
        };

        const displayName = moment(moment.unix(maturity)).format('MMMM D, yyyy');
        const displayProps: DisplayProps = {
          label: `fy${underlyingToken?.symbol}`,
          secondaryLabel: displayName,
          tertiaryLabel: matured ? 'Matured' : '',
          images: getImagesFromToken(underlyingToken!),
        };

        const token: AppTokenPosition = {
          type: ContractType.APP_TOKEN,
          appId,
          groupId,
          address,
          network,
          symbol,
          decimals,
          supply: +supply,
          pricePerShare,
          price,
          tokens: [underlyingToken],
          dataProps,
          displayProps,
        };

        return token;
      }),
    );
  }
}
