import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Cache } from '~cache/cache.decorator';
import { Network } from '~types';

import { VelodromeViemContractFactory } from '../contracts';

type VelodromeOnChainAddresses = {
  poolAddress: string;
  guageAddress: string;
  bribeAddress: string;
}[];

@Injectable()
export class VelodromeDefinitionsResolver {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(VelodromeViemContractFactory) private readonly contractFactory: VelodromeViemContractFactory,
  ) {}

  network = Network.OPTIMISM_MAINNET;

  @Cache({
    key: `studio:velodrome:on-chain-addresses`,
    ttl: 15 * 60,
  })
  private async getOnChainAddresses(): Promise<VelodromeOnChainAddresses> {
    const multicall = this.appToolkit.getViemMulticall(this.network);
    const voterContract = this.contractFactory.velodromeVoter({
      address: '0x09236cff45047dbee6b921e00704bed6d6b8cf7e',
      network: this.network,
    });

    const appTokens = await this.appToolkit.getAppTokenPositions({
      appId: 'velodrome',
      network: this.network,
      groupIds: ['pool'],
    });

    const poolAddresses = appTokens.map(x => x.address);

    return Promise.all(
      poolAddresses.map(async poolAddress => {
        const guageAddressRaw = await multicall.wrap(voterContract).read.gauges([poolAddress]);
        const bribeAddressRaw = await multicall.wrap(voterContract).read.internal_bribes([guageAddressRaw]);

        return {
          poolAddress,
          guageAddress: guageAddressRaw.toLowerCase(),
          bribeAddress: bribeAddressRaw.toLowerCase(),
        };
      }),
    );
  }

  public async getGaugeAddresses() {
    const velodromeAddressesData = await this.getOnChainAddresses();

    return velodromeAddressesData.map(x => x.guageAddress).filter(x => x != ZERO_ADDRESS);
  }

  public async getBribeAddresses() {
    const velodromeAddressesData = await this.getOnChainAddresses();

    return velodromeAddressesData.map(x => x.bribeAddress).filter(x => x != ZERO_ADDRESS);
  }
}
