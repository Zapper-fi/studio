import { Inject } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { range } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { DefaultDataProps } from '~position/display.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetAddressesParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { StargateViemContractFactory } from '../contracts';
import { StargatePool } from '../contracts/viem';

export abstract class StargatePoolTokenFetcher extends AppTokenTemplatePositionFetcher<StargatePool> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(StargateViemContractFactory) protected readonly contractFactory: StargateViemContractFactory,
  ) {
    super(appToolkit);
  }

  abstract factoryAddress: string;
  abstract useLocalDecimals: boolean;

  getContract(address: string) {
    return this.contractFactory.stargatePool({ address, network: this.network });
  }

  async getAddresses({ multicall }: GetAddressesParams) {
    const factory = this.contractFactory.stargateFactory({
      address: this.factoryAddress,
      network: this.network,
    });

    const numPools = await multicall.wrap(factory).read.allPoolsLength();
    return Promise.all(range(0, Number(numPools)).map(pid => multicall.wrap(factory).read.allPools([BigInt(pid)])));
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<StargatePool>) {
    return [{ address: await contract.read.token(), network: this.network }];
  }

  async getPricePerShare({ appToken, contract }: GetPricePerShareParams<StargatePool, DefaultDataProps>) {
    const lpAmount = new BigNumber(10 ** appToken.tokens[0].decimals).toFixed(0);
    const [convertRate, localDecimalsRaw, pricePerShareRaw] = await Promise.all([
      contract.read.convertRate(),
      contract.read.localDecimals(),
      contract.read.amountLPtoLD([BigInt(lpAmount)]).catch(() => 0),
    ]);

    const pricePerShare = this.useLocalDecimals
      ? Number(pricePerShareRaw) / Number(convertRate) / 10 ** Number(localDecimalsRaw)
      : Number(pricePerShareRaw) / 10 ** appToken.tokens[0].decimals;

    return [pricePerShare];
  }
}
