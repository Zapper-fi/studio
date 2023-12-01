import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { Erc20 } from '~contract/contracts/viem';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

import { PolynomialAccountResolver } from '../common/polynomial.account-resolver';

export type PolynomialSmartWalletDataProp = {
  liquidity: number;
};

@PositionTemplate()
export class OptimismPolynomialSmartWalletContractPositionFetcher extends ContractPositionTemplatePositionFetcher<Erc20> {
  groupLabel = 'Smart Wallet';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PolynomialAccountResolver) protected readonly polynomialAccountResolver: PolynomialAccountResolver,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.appToolkit.globalViemContracts.erc20({ address: address, network: this.network });
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    return [{ address: '0xb43c0899eccf98bc7a0f3e2c2a211d6fc4f9b3fe' }];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<Erc20>): Promise<string> {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  async getTokenDefinitions() {
    return [
      '0x8c6f28f2f1a3c87f0f938b96d27520d9751ec8d9', //sUSD
      '0x7f5c764cbc14f9669b88837ca1490cca17c31607', //USDC
      '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58', //USDT
      '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1', //DAI
      '0x4200000000000000000000000000000000000042', //OP
    ].map(address => ({ metaType: MetaType.SUPPLIED, address, network: this.network }));
  }

  async getAccountAddress(address: string): Promise<string> {
    return this.polynomialAccountResolver.getSmartWalletAddress(address);
  }

  async getTokenBalancesPerPosition({ address, multicall, contractPosition }: GetTokenBalancesParams<Erc20>) {
    return await Promise.all(
      contractPosition.tokens.map(token => {
        const contract = this.appToolkit.globalViemContracts.erc20({ address: token.address, network: this.network });
        return multicall.wrap(contract).read.balanceOf([address]);
      }),
    );
  }
}
