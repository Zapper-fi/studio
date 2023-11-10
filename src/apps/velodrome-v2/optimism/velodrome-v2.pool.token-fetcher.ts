import { Inject } from '@nestjs/common';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetAddressesParams,
  GetDisplayPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { VelodromeV2ViemContractFactory } from '../contracts';
import { VelodromeV2Pool } from '../contracts/viem/VelodromeV2Pool';

@PositionTemplate()
export class OptimismVelodromeV2PoolTokenFetcher extends AppTokenTemplatePositionFetcher<VelodromeV2Pool> {
  groupLabel = 'Pools';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(VelodromeV2ViemContractFactory) protected readonly contractFactory: VelodromeV2ViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.velodromeV2Pool({ address, network: this.network });
  }

  async getDefinitions() {
    const multicall = this.appToolkit.getViemMulticall(this.network);
    const factoryContract = this.contractFactory.velodromeV2PoolFactory({
      address: '0xf1046053aa5682b4f9a81b5481394da16be5ff5a',
      network: this.network,
    });

    const poolLength = await multicall.wrap(factoryContract).read.allPoolsLength();

    const poolAddresses = await Promise.all(
      range(0, Number(poolLength)).map(async i => {
        const poolAddressRaw = await multicall.wrap(factoryContract).read.allPools([BigInt(i)]);
        return { address: poolAddressRaw.toLowerCase() };
      }),
    );

    return poolAddresses;
  }

  async getAddresses({ definitions }: GetAddressesParams<VelodromeV2Pool>) {
    return definitions.map(v => v.address);
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<VelodromeV2Pool>) {
    const [token0, token1] = await contract.read.tokens();

    return [
      { address: token0.toLowerCase(), network: this.network },
      { address: token1.toLowerCase(), network: this.network },
    ];
  }

  async getPricePerShare({ contract, appToken }: GetPricePerShareParams<VelodromeV2Pool>) {
    const [reserveRaw0, reserveRaw1] = await Promise.all([contract.read.reserve0(), contract.read.reserve1()]);

    const reserves = [reserveRaw0, reserveRaw1].map((v, i) => Number(v) / 10 ** appToken.tokens[i].decimals);
    return reserves.map(v => v / appToken.supply);
  }

  async getLabel({ appToken }: GetDisplayPropsParams<VelodromeV2Pool>) {
    return appToken.tokens.map(v => getLabelFromToken(v)).join(' / ');
  }
}
