import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import { MetaType } from '~position/position.interface';
import {
  DefaultContractPositionDefinition,
  UnderlyingTokenDefinition,
} from '~position/template/contract-position.template.types';

import { RaftContractFactory, RaftPositionManager } from '../../contracts';

export const R = '0x183015a9ba6ff60230fdeadc3f43b3d788b13e21'
export const PositionManager = '0x5f59b322eb3e16a0c78846195af1f588b77403fc'

export abstract class EthereumRaftContractPositionFetcher extends ContractPositionTemplatePositionFetcher<RaftPositionManager> {
  collateral: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(RaftContractFactory) protected readonly raftContractFactory: RaftContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): RaftPositionManager {
    return this.raftContractFactory.raftPositionManager({ address, network: this.network })
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    return [{ address: PositionManager }]
  }

  async getTokenDefinitions(
    params
  ): Promise<UnderlyingTokenDefinition[] | null> {
    const { collateralToken, debtToken } = await params.contract.collateralInfo(this.collateral)
    const tokens = [{
      metaType: MetaType.SUPPLIED,
      address: collateralToken.toLowerCase(),
      network: this.network,
    }, {
      metaType: MetaType.BORROWED,
      address: debtToken.toLowerCase(),
      network: this.network,
    }]
    return tokens
  }

  async getLabel(
  ): Promise<string> {
    const baseTokens = await this.appToolkit.getBaseTokenPrices(this.network);
    const tokenFound = baseTokens.find(p => p.address === this.collateral)
    return `${tokenFound?.symbol ?? 'Raft'} Loan`
  }

  async getTokenBalancesPerPosition(
    { address, contractPosition }
  ): Promise<BigNumberish[]> {
    const collateral = this.raftContractFactory.raftToken({ address: contractPosition.tokens[0].address, network: this.network })
    const debt = this.raftContractFactory.raftToken({ address: contractPosition.tokens[1].address, network: this.network })
    const balances = await Promise.all([
      collateral.balanceOf(address),
      debt.balanceOf(address),
    ])
    return balances
  }
}
