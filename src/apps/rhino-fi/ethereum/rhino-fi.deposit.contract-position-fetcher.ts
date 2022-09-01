// '0xed9d63a96c27f87b07115b56b2e3572827f21646';
import { Inject } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { compact, sumBy } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { drillBalance } from '~app-toolkit/helpers/balance/token-balance.helper';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DefaultDataProps } from '~position/display.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { GetDisplayPropsParams, GetTokenDefinitionsParams } from '~position/template/contract-position.template.types';
import { Network } from '~types/network.interface';

import { RhinoFiApiClient } from '../common/rhino-fi.api-client';
import { RhinoFiCacheManager } from '../common/rhino-fi.cache-manager';
import { RhinoFiContractFactory, RhinoFiStarkEx } from '../contracts';
import { RHINO_FI_DEFINITION } from '../rhino-fi.definition';

const appId = RHINO_FI_DEFINITION.id;
const groupId = RHINO_FI_DEFINITION.groups.deposit.id;
const network = Network.ETHEREUM_MAINNET;

type RhinoFiDepositDefinition = {
  address: string;
  tokenAddress: string;
};

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumRhinoFiDepositContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  RhinoFiStarkEx,
  DefaultDataProps,
  RhinoFiDepositDefinition
> {
  appId = appId;
  groupId = groupId;
  network = network;
  groupLabel = 'Deposits';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(RhinoFiContractFactory) protected readonly contractFactory: RhinoFiContractFactory,
    @Inject(RhinoFiCacheManager) protected readonly cacheManager: RhinoFiCacheManager,
    @Inject(RhinoFiApiClient) protected readonly apiClient: RhinoFiApiClient,
  ) {
    super(appToolkit);
  }

  getContract(address: string): RhinoFiStarkEx {
    return this.contractFactory.rhinoFiStarkEx({ address, network: this.network });
  }

  async getDefinitions() {
    const supportedTokens = await this.cacheManager.getCachedSupportedTokens();
    return supportedTokens.map(supportedToken => ({
      address: '0xed9d63a96c27f87b07115b56b2e3572827f21646',
      tokenAddress: supportedToken.address,
    }));
  }

  async getTokenDefinitions({ definition }: GetTokenDefinitionsParams<RhinoFiStarkEx, RhinoFiDepositDefinition>) {
    return [
      { metaType: MetaType.SUPPLIED, address: definition.tokenAddress },
      { metaType: MetaType.LOCKED, address: definition.tokenAddress },
    ];
  }

  async getLabel({
    contractPosition,
  }: GetDisplayPropsParams<RhinoFiStarkEx, DefaultDataProps, RhinoFiDepositDefinition>): Promise<string> {
    return `${getLabelFromToken(contractPosition.tokens[0])} Rhino-Fi Deposit`;
  }

  async getTokenBalancesPerPosition() {
    return [];
  }

  async getBalances(address: string): Promise<ContractPositionBalance<DefaultDataProps>[]> {
    const balancesResponse = await this.apiClient.getUserBalances(address);
    if (balancesResponse.length === 0) return [];

    const supportedTokens = await this.cacheManager.getCachedSupportedTokens();
    const contractPositions = await this.appToolkit.getAppContractPositions({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    const balances = balancesResponse.map(userBalance => {
      const supportedToken = supportedTokens.find(supportedToken => supportedToken.symbol === userBalance.token);
      if (!supportedToken) return null;

      const contractPosition = contractPositions.find(v => v.tokens[0].address === supportedToken.address);
      if (!contractPosition) return null;

      const quantization = supportedToken.quantization;
      const availableBalanceRaw = new BigNumber(userBalance.available).times(quantization).toFixed(0);
      const lockedBalanceRaw = new BigNumber(userBalance.locked).times(quantization).toFixed(0);

      const availableTokenBalance = drillBalance(contractPosition.tokens[0], availableBalanceRaw);
      const lockedTokenBalance = drillBalance(contractPosition.tokens[1], lockedBalanceRaw);
      const tokens = [availableTokenBalance, lockedTokenBalance];
      const balanceUSD = sumBy(tokens, t => t.balanceUSD);

      const balance: ContractPositionBalance = { ...contractPosition, tokens, balanceUSD };
      return balance;
    });

    return compact(balances);
  }
}
