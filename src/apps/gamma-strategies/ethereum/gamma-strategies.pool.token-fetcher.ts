import { Inject } from '@nestjs/common';
import _ from 'lodash';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { GammaStrategiesContractFactory } from '../contracts';
import { GAMMA_STRATEGIES_DEFINITION } from '../gamma-strategies.definition';

const FACTORY_ADDRESSES = [
  '0xd12fa3e3b60cfb96a735ab57a071f0f324860929',
  '0xc878c38f0df509a833d10de892e1cf7d361e3a67',
  '0x0ac51fb63d1915a77ab7a7bb53b031407584dd4c',
];

const DEPRECATED_HYPERVISORS = [
  '0xce721b5dc9624548188b5451bb95989a7927080a',
  '0x0e9e16f6291ba2aaaf41ccffdf19d32ab3691d15',
];

const appId = GAMMA_STRATEGIES_DEFINITION.id;
const groupId = GAMMA_STRATEGIES_DEFINITION.groups.pool.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumGammaStrategiesPoolTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(GammaStrategiesContractFactory)
    private readonly gammaStrategiesContractFactory: GammaStrategiesContractFactory,
  ) {}

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);
    const tokenSelector = this.appToolkit.getBaseTokenPriceSelector({ tags: { network, appId } });
    const baseTokens = await tokenSelector.getAll({ network });

    const hypervisorAddresses = await Promise.all(
      FACTORY_ADDRESSES.map(async factoryAddress => {
        const factoryContract = this.gammaStrategiesContractFactory.gammaStrategiesHypervisorFactory({
          network,
          address: factoryAddress,
        });
        const numTokens = await multicall.wrap(factoryContract).allHypervisorsLength();
        const addresses = await Promise.all(
          range(0, Number(numTokens)).map(i =>
            multicall
              .wrap(factoryContract)
              .allHypervisors(i)
              .then(v => v.toLowerCase()),
          ),
        );

        return addresses;
      }),
    );

    const tokens = await Promise.all(
      hypervisorAddresses.flat().map(async tokenAddress => {
        if (DEPRECATED_HYPERVISORS.includes(tokenAddress)) return null;

        const hypervisorContract = this.gammaStrategiesContractFactory.gammaStrategiesHypervisor({
          network,
          address: tokenAddress,
        });
        const [token0AddressRaw, token1AddressRaw, totalSupplyRaw, totalAmountInfo, symbol, name] = await Promise.all([
          multicall.wrap(hypervisorContract).token0(),
          multicall.wrap(hypervisorContract).token1(),
          multicall.wrap(hypervisorContract).totalSupply(),
          multicall.wrap(hypervisorContract).getTotalAmounts(),
          multicall.wrap(hypervisorContract).symbol(),
          multicall.wrap(hypervisorContract).name(),
        ]);

        const token0 = baseTokens.find(p => p.address == token0AddressRaw.toLowerCase());
        const token1 = baseTokens.find(p => p.address == token1AddressRaw.toLowerCase());
        if (!token0 || !token1) return null;

        const token0Reserve = Number(totalAmountInfo.total0) / 10 ** token0.decimals;
        const token0ReserveUSD = token0Reserve * token0.price;
        const token1Reserve = Number(totalAmountInfo.total1) / 10 ** token1.decimals;
        const token1ReserveUSD = token1Reserve * token1.price;
        const liquidity = token0ReserveUSD + token1ReserveUSD;
        const tokens = [token0, token1];

        const supply = Number(totalSupplyRaw) / 1e18;
        const price = (token0ReserveUSD + token1ReserveUSD) / supply;
        const pricePerShare = [token0Reserve, token1Reserve].map(r => r / supply);

        const poolToken: AppTokenPosition = {
          type: ContractType.APP_TOKEN,
          address: tokenAddress,
          appId,
          groupId,
          network,
          decimals: 18,
          symbol,
          supply,
          price,
          pricePerShare,
          tokens,

          dataProps: {
            liquidity,
          },

          displayProps: {
            label: name,
            images: tokens.map(t => getTokenImg(t.address, t.network)),
            statsItems: [{ label: 'Liquidity', value: buildDollarDisplayItem(liquidity) }],
          },
        };

        return poolToken;
      }),
    );

    return _.compact(tokens);
  }
}
