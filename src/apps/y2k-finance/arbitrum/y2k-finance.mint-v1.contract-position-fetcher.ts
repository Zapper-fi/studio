import { Inject } from '@nestjs/common';
import { BigNumber, BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { IMulticallWrapper } from '~multicall';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDefinitionsParams,
  DefaultContractPositionDefinition,
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
} from '~position/template/contract-position.template.types';

import { Y2KFinanceViemContractFactory } from '../contracts';
import { Y2KFinanceVaultV1 } from '../contracts/viem';

const vaultFactory = '0x984e0eb8fb687afa53fc8b33e12e04967560e092';

@PositionTemplate()
export class ArbitrumY2KFinanceMintV1ContractPositionFetcher extends ContractPositionTemplatePositionFetcher<Y2KFinanceVaultV1> {
  groupLabel = 'Positions';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(Y2KFinanceViemContractFactory) protected readonly contractFactory: Y2KFinanceViemContractFactory,
  ) {
    super(appToolkit);
  }

  async getEpochIds(multicall: IMulticallWrapper, contract: Y2KFinanceVaultV1): Promise<BigNumber[]> {
    const vault = multicall.wrap(contract);
    const epochsLength = await vault.epochsLength();
    const epochIds = await Promise.all(
      Array.from(Array(Number(epochsLength)).keys()).map(async i => await vault.epochs(i)),
    );
    return epochIds;
  }

  getContract(address: string) {
    return this.contractFactory.y2KFinanceVaultV1({ address, network: this.network });
  }

  async getDefinitions(params: GetDefinitionsParams): Promise<DefaultContractPositionDefinition[]> {
    const factory = params.multicall.wrap(
      this.contractFactory.y2KFinanceVaultFactoryV1({ address: vaultFactory, network: this.network }),
    );
    const poolLength = await factory.marketIndex();
    const vaults = (
      await Promise.all(Array.from(Array(Number(poolLength)).keys()).map(async i => await factory.getVaults(i)))
    ).flat();
    return vaults.map(vault => ({ address: vault }));
  }

  async getTokenDefinitions(
    params: GetTokenDefinitionsParams<Y2KFinanceVaultV1, DefaultContractPositionDefinition>,
  ): Promise<UnderlyingTokenDefinition[] | null> {
    const epochIdsRaw = await this.getEpochIds(params.multicall, params.contract);
    const claimableAsset = await params.contract.read.asset();
    const epochIds = epochIdsRaw.map(x => x.toString());
    return epochIds
      .map(tokenId => [
        {
          metaType: MetaType.SUPPLIED,
          address: params.contract.address,
          network: this.network,
          tokenId,
        },
        {
          metaType: MetaType.CLAIMABLE,
          address: claimableAsset,
          network: this.network,
        },
      ])
      .flat();
  }

  async getLabel(
    params: GetDisplayPropsParams<Y2KFinanceVaultV1, DefaultDataProps, DefaultContractPositionDefinition>,
  ): Promise<string> {
    const name = await params.contract.read.name();
    return name;
  }

  async getTokenBalancesPerPosition(
    params: GetTokenBalancesParams<Y2KFinanceVaultV1, DefaultDataProps>,
  ): Promise<BigNumberish[]> {
    const epochIds = await this.getEpochIds(params.multicall, params.contract);
    const vault = params.multicall.wrap(params.contract);
    const results = await Promise.all(
      epochIds.map(async id => {
        const finalTVL = await vault.idFinalTVL(id);
        const balance = await vault.balanceOf(params.address, id);
        if (finalTVL.isZero() || balance.isZero()) return [0, 0];
        const claimable = await vault.previewWithdraw(id, balance);
        return [balance, claimable];
      }),
    );
    return results.flat();
  }
}
