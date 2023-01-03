import { Inject } from '@nestjs/common';
import 'moment-duration-format';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Erc20 } from '~contract/contracts';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetPricePerShareParams } from '~position/template/app-token.template.types';

import { LidoContractFactory } from '../contracts';

@PositionTemplate()
export class EthereumLidoStethTokenFetcher extends AppTokenTemplatePositionFetcher<Erc20> {
  groupLabel = 'stETH';
  isExcludedFromBalances = true;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(LidoContractFactory) protected readonly contractFactory: LidoContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): Erc20 {
    return this.contractFactory.erc20({ network: this.network, address });
  }

  async getAddresses() {
    return ['0xae7ab96520de3a18e5e111b5eaab095312d7fe84'];
  }

  async getUnderlyingTokenDefinitions() {
    return [{ address: '0x0000000000000000000000000000000000000000', network: this.network }];
  }

  async getPricePerShare({ appToken, multicall }: GetPricePerShareParams<Erc20>) {
    const oracleContract = this.contractFactory.stethEthOracle({
      address: '0x86392dc19c0b719886221c78ab11eb8cf5c52812',
      network: this.network,
    });

    const latestRound = await multicall.wrap(oracleContract).latestRound();
    const pricePerShareRaw = await multicall.wrap(oracleContract).getAnswer(latestRound);

    return Number(pricePerShareRaw) / 10 ** appToken.decimals;
  }
}
