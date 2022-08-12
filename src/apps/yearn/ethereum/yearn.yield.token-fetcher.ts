import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import {
  AppTokenTemplatePositionFetcher,
  DataPropsStageParams,
  PricePerShareStageParams,
} from '~position/template/app-token.template.position-fetcher';
import { Network } from '~types/network.interface';

import { YearnContractFactory, YearnVault } from '../contracts';
import { YEARN_DEFINITION } from '../yearn.definition';

import { Y_TOKENS } from './yearn.yield.token-definitions';

type YearnYieldTokenDataProps = {
  liquidity: number;
  reserve: number;
};

const appId = YEARN_DEFINITION.id;
const groupId = YEARN_DEFINITION.groups.yield.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumYearnYieldTokenFetcher extends AppTokenTemplatePositionFetcher<
  YearnVault,
  YearnYieldTokenDataProps
> {
  appId = appId;
  groupId = groupId;
  network = network;

  constructor(
    @Inject(APP_TOOLKIT) appToolkit: IAppToolkit,
    @Inject(YearnContractFactory)
    private readonly contractFactory: YearnContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): YearnVault {
    return this.contractFactory.yearnVault({ network: this.network, address });
  }

  async getAddresses(): Promise<string[]> {
    return Y_TOKENS.map(yToken => yToken.address);
  }

  async getUnderlyingTokenAddresses(contract: YearnVault): Promise<string[]> {
    const match = Y_TOKENS.find(yToken => yToken.address === contract.address.toLowerCase());
    if (!match) throw new Error('Cannot find specified Y token');
    return [match.underlyingAddress];
  }

  async getPricePerShare({
    contract,
    appToken,
  }: PricePerShareStageParams<YearnVault, YearnYieldTokenDataProps>): Promise<number> {
    return contract
      .getPricePerFullShare()
      .catch(() => 0)
      .then(pps => Number(pps) / 10 ** appToken.decimals);
  }

  async getDataProps(
    opts: DataPropsStageParams<YearnVault, YearnYieldTokenDataProps>,
  ): Promise<YearnYieldTokenDataProps> {
    const { appToken } = opts;
    const reserve = appToken.supply * appToken.pricePerShare[0];
    const liquidity = reserve * appToken.tokens[0].price;

    return { liquidity, reserve };
  }
}
