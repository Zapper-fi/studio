import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetPricePerShareParams, GetUnderlyingTokensParams } from '~position/template/app-token.template.types';
import { Network } from '~types/network.interface';

import { SideshiftViemContractFactory } from '../contracts';
import { SvxaiVault } from '../contracts/ethers';

const network = Network.ETHEREUM_MAINNET;

@PositionTemplate()
export class EthereumSideshiftSvxaiTokenFetcher extends AppTokenTemplatePositionFetcher<SvxaiVault> {
  groupLabel = 'xvXAI';

  constructor(
    @Inject(APP_TOOLKIT) readonly appToolkit: IAppToolkit,
    @Inject(SideshiftViemContractFactory) private readonly contractFactory: SideshiftViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): SvxaiVault {
    return this.contractFactory.svxaiVault({ address, network });
  }

  async getAddresses() {
    return ['0x3808708e761b988d23ae011ed0e12674fb66bd62'];
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<SvxaiVault>) {
    return [{ address: await contract.asset(), network: this.network }];
  }

  async getPricePerShare({ contract, appToken }: GetPricePerShareParams<SvxaiVault>) {
    const reserveRaw = await contract.totalAssets();
    const reserve = Number(reserveRaw) / 10 ** appToken.tokens[0].decimals;
    const pricePerShare = reserve / appToken.supply;
    return [pricePerShare];
  }
}
