import { Inject } from '@nestjs/common';
import { BigNumberish, utils } from 'ethers';
import { compact, sumBy } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DefaultDataProps } from '~position/display.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType } from '~position/position.interface';
import { isBorrowed, isSupplied } from '~position/position.utils';
import { GetDisplayPropsParams, GetTokenDefinitionsParams } from '~position/template/contract-position.template.types';
import { CustomContractPositionTemplatePositionFetcher } from '~position/template/custom-contract-position.template.position-fetcher';

import { AngleApiHelper } from '../common/angle.api';
import { AngleContractFactory, AngleVaultManager } from '../contracts';

export type AngleVaultDefinition = {
  address: string;
  collateral: string;
  stablecoin: string;
};

@PositionTemplate()
export class EthereumAngleVaultsContractPositionFetcher extends CustomContractPositionTemplatePositionFetcher<
  AngleVaultManager,
  DefaultDataProps,
  AngleVaultDefinition
> {
  groupLabel = 'Vaults';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AngleContractFactory) protected readonly contractFactory: AngleContractFactory,
    @Inject(AngleApiHelper) protected readonly angleApiHelper: AngleApiHelper,
  ) {
    super(appToolkit);
  }

  getContract(address: string): AngleVaultManager {
    return this.contractFactory.angleVaultManager({ address, network: this.network });
  }

  async getDefinitions() {
    const vaultManagers = Object.values(await this.angleApiHelper.getVaultManagers(this.network));
    return vaultManagers;
  }

  async getTokenDefinitions({ definition }: GetTokenDefinitionsParams<AngleVaultManager, AngleVaultDefinition>) {
    return [
      { metaType: MetaType.SUPPLIED, address: definition.collateral, network: this.network },
      { metaType: MetaType.BORROWED, address: definition.stablecoin, network: this.network },
    ];
  }

  async getLabel({
    contractPosition,
  }: GetDisplayPropsParams<AngleVaultManager, DefaultDataProps, AngleVaultDefinition>): Promise<string> {
    return `${getLabelFromToken(contractPosition.tokens[0])} - ${getLabelFromToken(contractPosition.tokens[1])}`;
  }

  async getTokenBalancesPerPosition(): Promise<BigNumberish[]> {
    throw new Error('Method not implemented.');
  }

  async getBalances(address: string): Promise<ContractPositionBalance<DefaultDataProps>[]> {
    const contractPositions = await this.appToolkit.getAppContractPositions({
      appId: this.appId,
      groupIds: [this.groupId],
      network: this.network,
    });

    const vaults = Object.values(await this.angleApiHelper.getUserVaults(address, this.network));

    const balances = vaults.map(vault => {
      const contractPosition = contractPositions.find(v => v.address.toLowerCase() === vault.address.toLowerCase());
      if (!contractPosition) return null;

      const collateralToken = contractPosition!.tokens.find(isSupplied)!;
      const borrowedToken = contractPosition!.tokens.find(isBorrowed)!;

      const collateral = utils.parseUnits(vault.collateralAmount.toString(), collateralToken.decimals);
      const debt = utils.parseUnits(vault.debt.toString(), borrowedToken.decimals);

      const tokens = [
        drillBalance(collateralToken, collateral.toString()),
        drillBalance(borrowedToken, debt.toString(), { isDebt: true }),
      ];

      const balanceUSD = sumBy(tokens, t => t.balanceUSD);

      return {
        ...contractPosition,
        balanceUSD,
        tokens,
      };
    });

    return compact(balances);
  }
}
