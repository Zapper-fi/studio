import { Inject } from '@nestjs/common';
import { ethers } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { Erc20 } from '~contract/contracts';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetAddressesParams,
  DefaultAppTokenDefinition,
  GetUnderlyingTokensParams,
  UnderlyingTokenDefinition,
  GetPricePerShareParams,
  DefaultAppTokenDataProps,
} from '~position/template/app-token.template.types';
import { Network } from '~types';

import { AbracadabraContractFactory } from '../contracts';

import { MAGIC_GLP_ADDRESS, S_GLP_ADDRESS } from './abracadabra.arbitrum.constants';

@PositionTemplate()
export class ArbitrumAbracadabraMagicGlpTokenFetcher extends AppTokenTemplatePositionFetcher<Erc20> {
  groupLabel: string;

  constructor(
    @Inject(APP_TOOLKIT) public readonly appToolkit: IAppToolkit,
    @Inject(AbracadabraContractFactory) private readonly abracadabraContractFactory: AbracadabraContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(_address: string): Erc20 {
    return this.abracadabraContractFactory.erc20({ address: _address, network: this.network });
  }

  async getAddresses(_params: GetAddressesParams<DefaultAppTokenDefinition>): Promise<string[]> {
    return [MAGIC_GLP_ADDRESS];
  }

  async getUnderlyingTokenDefinitions(
    _params: GetUnderlyingTokensParams<Erc20, DefaultAppTokenDefinition>,
  ): Promise<UnderlyingTokenDefinition[]> {
    const glpTokenDefinitions = await this.appToolkit.getAppTokenPositionsFromDatabase({
      appId: 'gmx',
      groupIds: ['glp'],
      network: Network.ARBITRUM_MAINNET,
    });

    const glpUnderlying = glpTokenDefinitions[0];

    return [{ address: glpUnderlying.address, network: glpUnderlying.network }];
  }

  async getPricePerShare(
    _params: GetPricePerShareParams<Erc20, DefaultAppTokenDataProps, DefaultAppTokenDefinition>,
  ): Promise<number[]> {
    const glpContract = this.abracadabraContractFactory.erc20({
      address: S_GLP_ADDRESS,
      network: this.network,
    });
    const [totalSupply, balanceOf] = await Promise.all([
      _params.contract.totalSupply(),
      glpContract.balanceOf(_params.address),
    ]);

    const glpDecimals = await glpContract.decimals();
    const pricePerShare =
      parseFloat(ethers.utils.formatUnits(balanceOf, glpDecimals)) /
      parseFloat(ethers.utils.formatUnits(totalSupply, glpDecimals));

    return [pricePerShare];
  }

  async getLabel(): Promise<string> {
    return 'magicGLP';
  }
}
