import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { AirswapContractFactory } from '../contracts';
import { AIRSWAP_DEFINITION } from '../airswap.definition';
import { ContractType } from '~position/contract.interface';

const appId = AIRSWAP_DEFINITION.id;
const groupId = AIRSWAP_DEFINITION.groups.sAST.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumAirswapSAstTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(AirswapContractFactory) private readonly airswapContractFactory: AirswapContractFactory,
  ) {}

  async getPositions() {
    const address = '0x579120871266ccd8De6c85EF59E2fF6743E7CD15';
    const multicall = this.appToolkit.getMulticall(network);
    const contract = this.airswapContractFactory.staking({ address, network });

    const [symbol, decimals, supplyRaw] = await Promise.all([
      multicall.wrap(contract).symbol(),
      multicall.wrap(contract).decimals(),
      multicall.wrap(contract).totalSupply(),
    ]);

    const appTokenDependencies = await this.appToolkit.getAppTokenPositions(
        { appId: 'airswap', groupIds: ['ast'], network },
    );

    const [underlyingTokenAddressRaw] = await multicall
      .wrap(contract)
      .token()
      .catch(() => '');

    const underlyingTokenAddress = underlyingTokenAddressRaw.toLowerCase();
    const underlyingToken = appTokenDependencies.find(v => v.address === underlyingTokenAddress)

    const supply = Number(supplyRaw) / 10 ** decimals;

    const token: AppTokenPosition = {
      type: ContractType.APP_TOKEN,
      appId,
      groupId,
      address,
      network,
      symbol,
      decimals,
      supply,
      tokens: underlyingToken ? [underlyingToken] : [],
      pricePerShare: 1,
    };

    return [token];
  }
}
