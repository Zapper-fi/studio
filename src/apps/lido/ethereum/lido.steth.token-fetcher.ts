import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetPricePerShareParams } from '~position/template/app-token.template.types';

import { LidoContractFactory } from '../contracts';
import { LidoSteth } from '../contracts/ethers/LidoSteth';

@PositionTemplate()
export class EthereumLidoStethTokenFetcher extends AppTokenTemplatePositionFetcher<LidoSteth> {
  groupLabel = 'stETH';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(LidoContractFactory) protected readonly contractFactory: LidoContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): LidoSteth {
    return this.contractFactory.lidoSteth({ network: this.network, address });
  }

  async getAddresses() {
    return ['0xae7ab96520de3a18e5e111b5eaab095312d7fe84'];
  }

  async getUnderlyingTokenDefinitions() {
    return [{ address: '0x0000000000000000000000000000000000000000', network: this.network }];
  }

  async getPricePerShare({ appToken, multicall }: GetPricePerShareParams<LidoSteth>) {
    const oracleContract = this.contractFactory.lidoStethEthOracle({
      address: '0x86392dc19c0b719886221c78ab11eb8cf5c52812',
      network: this.network,
    });

    const latestRound = await multicall.wrap(oracleContract).latestRound();
    const pricePerShareRaw = await multicall.wrap(oracleContract).getAnswer(latestRound);

    return [Number(pricePerShareRaw) / 10 ** appToken.decimals];
  }
}
