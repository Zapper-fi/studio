import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { SushiswapBentoboxViemContractFactory } from '../contracts';
import { SushiswapBentobox } from '../contracts/viem';

import { SushiswapBentoboxVaultTokensResolver } from './sushiswap-bentobox.vault-tokens-resolver';

export type SushiswapBentoboxVaultDefinition = {
  address: string;
  underlyingTokenAddress: string;
};

export abstract class SushiswapBentoboxVaultContractPositionFetcher extends ContractPositionTemplatePositionFetcher<SushiswapBentobox> {
  abstract subgraphUrl: string;
  abstract bentoboxAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(SushiswapBentoboxViemContractFactory)
    private readonly contractFactory: SushiswapBentoboxViemContractFactory,
    @Inject(SushiswapBentoboxVaultTokensResolver)
    private readonly vaultTokenResolver: SushiswapBentoboxVaultTokensResolver,
  ) {
    super(appToolkit);
  }

  async getDefinitions(): Promise<SushiswapBentoboxVaultDefinition[]> {
    const bentoboxTokens = await this.vaultTokenResolver.getVaultTokens(this.subgraphUrl, this.network);

    const vaultDefinitons = bentoboxTokens.map(underlyingTokenAddress => {
      return {
        address: this.bentoboxAddress,
        underlyingTokenAddress,
      };
    });

    return vaultDefinitons;
  }

  async getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<SushiswapBentobox, SushiswapBentoboxVaultDefinition>) {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: definition.underlyingTokenAddress,
        network: this.network,
      },
    ];
  }

  getContract(address: string) {
    return this.contractFactory.sushiswapBentobox({ network: this.network, address });
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<SushiswapBentobox>): Promise<string> {
    return `${getLabelFromToken(contractPosition.tokens[0])} Deposit`;
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
    contractPosition,
  }: GetTokenBalancesParams<SushiswapBentobox>): Promise<BigNumberish[]> {
    const token = contractPosition.tokens[0].address;
    const share = await contract.read.balanceOf([token, address]);
    const amount = await contract.read.toAmount([token, share, false]);

    return [amount];
  }
}
