import { Inject } from '@nestjs/common';
import { sumBy } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import { ContractType } from '~position/contract.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import {
  DefaultContractPositionDefinition,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
} from '~position/template/contract-position.template.types';
import { CustomContractPositionTemplatePositionFetcher } from '~position/template/custom-contract-position.template.position-fetcher';

import { PolynomialAccountResolver } from '../common/polynomial.account-resolver';
import { PolynomialViemContractFactory } from '../contracts';
import { PolynomialSmartWalletIndex } from '../contracts/viem';

export type PolynomialSmartWalletDataProp = {
  liquidity: number;
};

@PositionTemplate()
export class OptimismPolynomialSmartWalletContractPositionFetcher extends CustomContractPositionTemplatePositionFetcher<PolynomialSmartWalletIndex> {
  groupLabel = 'Smart Wallet';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PolynomialViemContractFactory) protected readonly contractFactory: PolynomialViemContractFactory,
    @Inject(PolynomialAccountResolver) protected readonly polynomialAccountResolver: PolynomialAccountResolver,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.polynomialSmartWalletIndex({ address, network: this.network });
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    return [{ address: '0xb43c0899eccf98bc7a0f3e2c2a211d6fc4f9b3fe' }];
  }

  async getLabel(_params: GetDisplayPropsParams<PolynomialSmartWalletIndex>): Promise<string> {
    return `Smart Wallet Balances`;
  }

  async getTokenDefinitions(
    _params: GetTokenDefinitionsParams<PolynomialSmartWalletIndex>,
  ): Promise<UnderlyingTokenDefinition[]> {
    return [
      '0x8c6f28f2f1a3c87f0f938b96d27520d9751ec8d9', //sUSD
      '0x7f5c764cbc14f9669b88837ca1490cca17c31607', //USDC
      '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58', //USDT
      '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1', //DAI
      '0x4200000000000000000000000000000000000042', //OP
    ].map(address => ({ metaType: MetaType.SUPPLIED, address, network: this.network }));
  }

  async getTokenBalancesPerPosition({
    address,
    multicall,
    contractPosition,
  }: GetTokenBalancesParams<PolynomialSmartWalletIndex>) {
    return await Promise.all(
      contractPosition.tokens.map(token => {
        const contract = this.appToolkit.globalViemContracts.erc20({ address: token.address, network: this.network });
        return multicall.wrap(contract).read.balanceOf([address]);
      }),
    );
  }

  async getSmartWalletAddress(address: string): Promise<string> {
    return this.polynomialAccountResolver.getSmartWalletAddress(address);
  }

  async getBalances(address: string): Promise<ContractPositionBalance[]> {
    const multicall = this.appToolkit.getViemMulticall(this.network);
    if (address === ZERO_ADDRESS) return [];

    const smartWalletAddress = await this.getSmartWalletAddress(address);
    if (smartWalletAddress === ZERO_ADDRESS) return [];

    const contractPositions = await this.appToolkit.getAppContractPositions({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    if (contractPositions.length === 0) return [];
    const contractPosition = contractPositions[0];

    const contract = multicall.wrap(this.getContract(contractPosition.address));
    const balancesRaw = await this.getTokenBalancesPerPosition({
      address: smartWalletAddress,
      contract,
      contractPosition,
      multicall,
    });

    const allTokens = contractPosition.tokens.map((cp, idx) =>
      drillBalance(cp, balancesRaw[idx]?.toString() ?? '0', { isDebt: cp.metaType === MetaType.BORROWED }),
    );

    const tokens = allTokens.filter(v => Math.abs(v.balanceUSD) > 0.01);
    const balanceUSD = sumBy(tokens, t => t.balanceUSD);

    const balance: ContractPositionBalance = {
      type: ContractType.POSITION,
      address: smartWalletAddress,
      network: this.network,
      appId: this.appId,
      groupId: this.groupId,
      groupLabel: this.groupLabel,
      tokens,
      dataProps: contractPosition.dataProps,
      displayProps: contractPosition.displayProps,
      balanceUSD,
    };

    return [balance];
  }
}
