import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { InverseViemContractFactory } from '../contracts';
import { InverseDcaVaultToken } from '../contracts/viem';

@PositionTemplate()
export class EthereumInverseDcaVaultDividendContractPositionFetcher extends ContractPositionTemplatePositionFetcher<InverseDcaVaultToken> {
  groupLabel = 'DCA Vault Dividends';
  isExcludedFromExplore = true;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(InverseViemContractFactory) protected readonly contractFactory: InverseViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.inverseDcaVaultToken({ address, network: this.network });
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    return [
      '0x89ec5df87a5186a0f0fa8cb84edd815de6047357', // USDC to ETH vault
      '0xc8f2e91dc9d198eded1b2778f6f2a7fd5bbeac34', // DAI to WBTC vault
      '0x41d079ce7282d49bf4888c71b5d9e4a02c371f9b', // DAI to YFI vault
      '0x2dcdca085af2e258654e47204e483127e0d8b277', // DAI to ETH vault
    ].map(address => ({ address }));
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<InverseDcaVaultToken>) {
    return [{ metaType: MetaType.CLAIMABLE, address: await contract.read.target(), network: this.network }];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<InverseDcaVaultToken>) {
    return `${getLabelFromToken(contractPosition.tokens[0])} Dividends`;
  }

  async getTokenBalancesPerPosition({ address, contract }: GetTokenBalancesParams<InverseDcaVaultToken>) {
    const [totalRaw, withdrawnRaw] = await Promise.all([
      contract.read.accumulativeDividendOf([address]),
      contract.read.withdrawnDividendOf([address]),
    ]);

    return [BigNumber.from(totalRaw).sub(withdrawnRaw)];
  }
}
