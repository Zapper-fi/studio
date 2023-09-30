import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { isSupplied } from '~position/position.utils';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDefinitionsParams,
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
} from '~position/template/contract-position.template.types';

import { AdminContract, BorrowerOperations, GravitaContractFactory, PriceFeed, VesselManager } from '../contracts';

export type GravitaVesselDefinition = {
  address: string;
  collateralAddress: string;
};

export abstract class GravitaVesselContractPositionFetcher extends ContractPositionTemplatePositionFetcher<BorrowerOperations> {
  groupLabel = 'Vessel';
  abstract borrowerOperationsAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(GravitaContractFactory) protected readonly gravitaContractFactory: GravitaContractFactory,
  ) {
    super(appToolkit);
  }

  // Using BorrowerOperations, rather than VesselManager
  // As per https://studio.zapper.fi/docs/concepts/contract-positions#what-address-should-i-use-for-a-contractposition
  getContract(address: string): BorrowerOperations {
    return this.gravitaContractFactory.borrowerOperations({ address, network: this.network });
  }

  getVesselManager(address: string): VesselManager {
    return this.gravitaContractFactory.vesselManager({ address, network: this.network });
  }

  getAdminContract(address: string): AdminContract {
    return this.gravitaContractFactory.adminContract({ address, network: this.network });
  }

  getPriceFeed(address: string): PriceFeed {
    return this.gravitaContractFactory.priceFeed({ address, network: this.network });
  }

  async getDefinitions({ multicall }: GetDefinitionsParams): Promise<GravitaVesselDefinition[]> {
    const contract = this.gravitaContractFactory.borrowerOperations({
      address: this.borrowerOperationsAddress,
      network: this.network,
    });
    const adminContractAddress = await multicall.wrap(contract).adminContract();
    const adminContract = this.getAdminContract(adminContractAddress);
    const allCollaterals = await multicall.wrap(adminContract).getValidCollateral();
    return allCollaterals.map(collateralAddress => ({ address: this.borrowerOperationsAddress, collateralAddress }));
  }

  async _getDebtToken(contract: BorrowerOperations): Promise<UnderlyingTokenDefinition> {
    return {
      metaType: MetaType.BORROWED,
      address: await contract.debtToken(),
      network: this.network,
    };
  }

  async getTokenDefinitions({
    contract,
    definition,
  }: GetTokenDefinitionsParams<BorrowerOperations, GravitaVesselDefinition>): Promise<UnderlyingTokenDefinition[]> {
    const debtToken = await this._getDebtToken(contract);
    const collateralToken = {
      metaType: MetaType.SUPPLIED,
      address: definition.collateralAddress,
      network: this.network,
    };
    return [debtToken, collateralToken];
  }

  async getLabel({ contractPosition }): Promise<string> {
    const collateralToken = contractPosition.tokens.find(isSupplied)!;
    return `${getLabelFromToken(collateralToken)} Vessel`;
  }

  async getTokenBalancesPerPosition({ address, contractPosition, contract }) {
    const vesselManager = this.getVesselManager(await contract.vesselManager());
    const collateral = contractPosition.tokens.find(isSupplied)!;
    return Promise.all([
      vesselManager.getVesselDebt(collateral.address, address),
      vesselManager.getVesselColl(collateral.address, address),
    ]);
  }
}
