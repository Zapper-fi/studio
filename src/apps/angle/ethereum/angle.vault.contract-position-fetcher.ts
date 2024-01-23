import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { sum } from 'lodash';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
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

import { AnglePositionResolver } from '../common/angle.position-resolver';
import { AngleViemContractFactory } from '../contracts';
import { AngleVaultManager } from '../contracts/viem';

@PositionTemplate()
export class EthereumAngleVaultsContractPositionFetcher extends ContractPositionTemplatePositionFetcher<AngleVaultManager> {
  groupLabel = 'Vaults';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AngleViemContractFactory) protected readonly contractFactory: AngleViemContractFactory,
    @Inject(AnglePositionResolver) protected readonly anglePositionResolver: AnglePositionResolver,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.angleVaultManager({ address, network: this.network });
  }

  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    const vaultAddresses = await this.anglePositionResolver.getVaultManagers(this.network);
    return vaultAddresses.map(address => {
      return {
        address,
      };
    });
  }

  async getTokenDefinitions({ contract }: GetTokenDefinitionsParams<AngleVaultManager>) {
    return [
      { metaType: MetaType.SUPPLIED, address: await contract.read.collateral(), network: this.network },
      { metaType: MetaType.BORROWED, address: await contract.read.stablecoin(), network: this.network },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<AngleVaultManager>): Promise<string> {
    return `${getLabelFromToken(contractPosition.tokens[0])} - ${getLabelFromToken(contractPosition.tokens[1])}`;
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
  }: GetTokenBalancesParams<AngleVaultManager>): Promise<BigNumberish[]> {
    const userBalanceCount = await contract.read.balanceOf([address]);

    if (Number(userBalanceCount) < 1) return [0, 0];

    const vaultIds = Object.values(await this.anglePositionResolver.getVaultIds(address, this.network));

    const balances = await Promise.all(
      vaultIds.map(async vaultId => {
        const [collateralData, vaultDebt] = await Promise.all([
          contract.read.vaultData([BigInt(vaultId)]),
          contract.read.getVaultDebt([BigInt(vaultId)]),
        ]);

        return {
          supplied: collateralData[0],
          borrowed: vaultDebt,
        };
      }),
    );

    const supplied = sum(balances.map(x => Number(x.supplied)));
    const borrowed = sum(balances.map(x => Number(x.borrowed)));

    return [supplied, borrowed];
  }
}
