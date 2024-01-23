import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetPricePerShareParams, UnderlyingTokenDefinition } from '~position/template/app-token.template.types';

import { RaftViemContractFactory } from '../contracts';
import { RaftToken } from '../contracts/viem';

export abstract class RaftCollateralTokenFetcher extends AppTokenTemplatePositionFetcher<RaftToken> {
  abstract collateral: string;
  abstract positionManagerAddress: string;

  isExcludedFromBalances = true;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(RaftViemContractFactory) protected readonly contractFactory: RaftViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.raftToken({ address, network: this.network });
  }

  async getAddresses(): Promise<string[]> {
    const positionManager = this.contractFactory.raftPositionManager({
      address: this.positionManagerAddress,
      network: this.network,
    });
    return [await positionManager.read.raftCollateralToken([this.collateral])];
  }

  async getUnderlyingTokenDefinitions(): Promise<UnderlyingTokenDefinition[]> {
    return [{ address: this.collateral, network: this.network }];
  }

  async getPricePerShare({ contract }: GetPricePerShareParams<RaftToken>): Promise<number[]> {
    const precision = Number(await contract.read.INDEX_PRECISION());
    const index = Number(await contract.read.currentIndex());
    return [index / precision];
  }
}
