import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { SteakHutContractFactory } from '../contracts';
import { STEAK_HUT_DEFINITION } from '../steak-hut.definition';

const appId = STEAK_HUT_DEFINITION.id;
const groupId = STEAK_HUT_DEFINITION.groups.ve.id;
const network = Network.AVALANCHE_MAINNET;

const address = '0xe7250b05bd8dee615ecc681eda1196add5156f2b'.toLowerCase();

// TODO: remove when this becomes a baseToken

@Register.TokenPositionFetcher({ appId, groupId, network })
export class AvalancheSteakHutVeTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SteakHutContractFactory) private readonly contractFactory: SteakHutContractFactory,
  ) {}

  async getPositions() {
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const multicall = this.appToolkit.getMulticall(network);
    const contract = this.contractFactory.steakHutHjoe({ network, address });

    const [symbol, decimals, supplyRaw, underlyingTokenAddressRaw] = await Promise.all([
      multicall.wrap(contract).symbol(),
      multicall.wrap(contract).decimals(),
      multicall.wrap(contract).totalSupply(),
      multicall.wrap(contract).JOE(),
    ]);

    const supply = Number(supplyRaw) / 10 ** decimals;
    const underlyingTokenAddress = underlyingTokenAddressRaw.toLowerCase();
    const underlyingToken = baseTokens.find(v => v.address === underlyingTokenAddress)!;

    const images = getImagesFromToken(underlyingToken);

    const token: AppTokenPosition = {
      type: ContractType.APP_TOKEN,
      address,
      network,
      appId,
      groupId,
      symbol,
      decimals,
      supply,
      price: underlyingToken.price,
      pricePerShare: 1,
      tokens: [underlyingToken],
      dataProps: {},
      displayProps: {
        label: symbol,
        images,
      },
    };

    return [token];
  }
}
