import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { ViemMulticallDataLoader } from '~multicall';
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
import { Y2KFinanceVaultV1Contract } from '../contracts/viem/Y2KFinanceVaultV1';

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

  async getEpochIds(multicall: ViemMulticallDataLoader, contract: Y2KFinanceVaultV1Contract): Promise<BigNumberish[]> {
    const vault = multicall.wrap(contract);
    const epochsLength = await vault.read.epochsLength();

    const epochIds = await Promise.all(
      Array.from(Array(Number(epochsLength)).keys()).map(async i => await vault.read.epochs([BigInt(i)])),
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
    const poolLength = await factory.read.marketIndex();
    const vaults = (
      await Promise.all(
        Array.from(Array(Number(poolLength)).keys()).map(async i => await factory.read.getVaults([BigInt(i)])),
      )
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
        const finalTVL = await vault.read.idFinalTVL([BigInt(id.toString())]);
        const balance = await vault.read.balanceOf([params.address, BigInt(id.toString())]);
        if (Number(finalTVL) === 0 || Number(balance) === 0) return [0, 0];

        const claimable = await vault.read.previewWithdraw([BigInt(id.toString()), balance]);
        return [balance, claimable];
      }),
    );
    return results.flat();
  }
}
