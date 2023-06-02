import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { UnderlyingTokenDefinition } from '~position/template/app-token.template.types';

import { RaftContractFactory, RaftToken } from '../contracts';

export abstract class EthereumRaftDebtTokenFetcher extends AppTokenTemplatePositionFetcher<RaftToken> {
  abstract collateral: string;
  abstract stablecoin: string;
  abstract positionManagerAddress: string;

  isExcludedFromBalances = true;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(RaftContractFactory) protected readonly contractFactory: RaftContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): RaftToken {
    return this.contractFactory.raftToken({ address, network: this.network });
  }

  async getAddresses(): Promise<string[]> {
    const positionManager = this.contractFactory.raftPositionManager({
      address: this.positionManagerAddress,
      network: this.network,
    });
    return [await positionManager.raftDebtToken(this.collateral)];
  }

  async getUnderlyingTokenDefinitions(): Promise<UnderlyingTokenDefinition[]> {
    return [{ address: this.stablecoin, network: this.network }];
  }

  async getPricePerShare({ contract }): Promise<number[]> {
    const precision = Number(await contract.INDEX_PRECISION());
    const index = Number(await contract.currentIndex());
    return [index / precision];
  }
}
