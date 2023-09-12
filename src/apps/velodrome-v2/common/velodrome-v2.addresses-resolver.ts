import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Cache } from '~cache/cache.decorator';
import { Network } from '~types';

import { VelodromeV2ContractFactory } from '../contracts';

type VelodromeV2OnChainAddresses = {
  poolAddress: string;
  guageAddress: string;
  bribeAddress: string;
}[];

@Injectable()
export class VelodromeV2AddressesResolver {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(VelodromeV2ContractFactory) private readonly contractFactory: VelodromeV2ContractFactory,
  ) {}

  @Cache({
    key: `studio:velodrome-v2:gauge-addresses`,
    ttl: 15 * 60,
  })
  private async getOnChainAddresses(network: Network): Promise<VelodromeV2OnChainAddresses> {
    const multicall = this.appToolkit.getMulticall(network);
    const voterContract = this.contractFactory.velodromeV2Voter({
      address: '0x41c914ee0c7e1a5edcd0295623e6dc557b5abf3c',
      network,
    });

    const appTokens = await this.appToolkit.getAppTokenPositions({
      appId: 'velodrome-v2',
      network,
      groupIds: ['pool'],
    });

    const poolAddresses = appTokens.map(x => x.address);

    return Promise.all(
      poolAddresses.map(async poolAddress => {
        const guageAddressRaw = await multicall.wrap(voterContract).gauges(poolAddress);
        const bribeAddressRaw = await multicall.wrap(voterContract).gaugeToBribe(guageAddressRaw);

        return {
          poolAddress,
          guageAddress: guageAddressRaw.toLowerCase(),
          bribeAddress: bribeAddressRaw.toLowerCase(),
        };
      }),
    );
  }

  public async getGaugeAddresses(network: Network) {
    const velodromeAddressesData = await this.getOnChainAddresses(network);

    return velodromeAddressesData.map(x => x.guageAddress).filter(x => x != ZERO_ADDRESS);
  }

  public async getBribeAddresses(network: Network) {
    const velodromeAddressesData = await this.getOnChainAddresses(network);

    return velodromeAddressesData.map(x => x.bribeAddress).filter(x => x != ZERO_ADDRESS);
  }
}
