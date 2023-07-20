import { Inject } from '@nestjs/common';
import Axios from 'axios';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Erc20 } from '~contract/contracts';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';

import { PolynomialAccountResolver } from '../common/polynomial.account-resolver';

export type PolynomialSmartWalletDataProp = {
  liquidity: number;
};

@PositionTemplate()
export class OptimismPolynomialSmartWalletContractPositionFetcher extends ContractPositionTemplatePositionFetcher<Erc20> {
  supportedTokens = [
    '0x8c6f28f2f1a3c87f0f938b96d27520d9751ec8d9', //sUSD
    '0x7f5c764cbc14f9669b88837ca1490cca17c31607', //USDC
    '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58', //USDT
    '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1', //DAI
    '0x4200000000000000000000000000000000000042'  //OP
  ];
  groupLabel = 'Smart Wallet';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PolynomialAccountResolver) protected readonly polynomialAccountResolver: PolynomialAccountResolver,
  ) {
    super(appToolkit);
  }

  getContract(address: string): Erc20 {
    return this.appToolkit.globalContracts.erc20({ address: address, network: this.network });
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    return this.supportedTokens.map(token => {
      return { address: token };
    });
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<Erc20>): Promise<string> {
    return getLabelFromToken(contractPosition.tokens[0]);
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<Erc20>) {
    return [{
      address: contract.address,
      metaType: MetaType.SUPPLIED,
      network: this.network,
    }];
  }

  async getAccountAddress(address: string): Promise<string> {
    return this.polynomialAccountResolver.getSmartWalletAddress(address);
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<Erc20>) {
    return [await contract.balanceOf(address)];
  }

  async getDataProps({ contract }): Promise<PolynomialSmartWalletDataProp> {
    if (await contract.symbol() != 'sUSD') {
      return { liquidity: 0 };
    }
    const { data } = await Axios.get<{ tvl: number }>('https://perps-api-experimental.polynomial.fi/snx-perps/tvl');
    return {
      liquidity: data.tvl,
    };
  }
}
