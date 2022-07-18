import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { RocketPoolContractFactory } from '../contracts';
import { ROCKET_POOL_DEFINITION } from '../rocket-pool.definition';

const appId = ROCKET_POOL_DEFINITION.id;
const groupId = ROCKET_POOL_DEFINITION.groups.rpl.id;
const network = Network.ETHEREUM_MAINNET;

const addresses = {
  rplv1: { label: 'RPL Legacy', address: '0xB4EFd85c19999D84251304bDA99E90B92300Bd93' },
  rplv2: { label: 'RPL', address: '0xD33526068D116cE69F19A9ee46F0bd304F21A51f' },
};

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumRocketPoolRplTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(RocketPoolContractFactory) private readonly rocketPoolContractFactory: RocketPoolContractFactory,
  ) {}

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);

    return await Promise.all(
      Object.values(addresses).map(async ({ label, address }) => {
        const contract = this.rocketPoolContractFactory.erc20({
          address,
          network,
        });

        const [symbol, decimals, supplyRaw] = await Promise.all([
          multicall.wrap(contract).symbol(),
          multicall.wrap(contract).decimals(),
          multicall.wrap(contract).totalSupply(),
        ]);

        const supply = Number(supplyRaw) / 10 ** decimals;

        const baseTokenDependencies = await this.appToolkit.getBaseTokenPrices(network);
        const rplToken = baseTokenDependencies.find(v => v.address.toLowerCase() === address.toLowerCase())!;

        const token: AppTokenPosition = {
          type: ContractType.APP_TOKEN,
          appId,
          groupId,
          address,
          network,
          symbol,
          decimals,
          supply,
          price: rplToken.price,
          pricePerShare: 1,
          dataProps: {},
          displayProps: {
            label,
            secondaryLabel: buildDollarDisplayItem(rplToken.price),
            images: [getTokenImg(address, network)],
          },
          tokens: [],
        };

        return token;
      }),
    );
  }
}
