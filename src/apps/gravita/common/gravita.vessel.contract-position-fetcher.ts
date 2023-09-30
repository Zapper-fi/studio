import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';
import { sumBy } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
} from '~position/template/contract-position.template.types';

import { GravitaContractFactory, VesselManager } from '../contracts';

export abstract class GravitaVesselContractPositionFetcher extends ContractPositionTemplatePositionFetcher<VesselManager> {
  groupLabel = 'Vessel';
  abstract vesselManagerAddress: string;
  abstract borrowerOperationsAddress: string;
  abstract collateralTokenAddresses: string[];

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(GravitaContractFactory) protected readonly gravitaContractFactory: GravitaContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): VesselManager {
    return this.gravitaContractFactory.vesselManager({ address, network: this.network });
  }

  // Using BorrowerOperations, rather than VesselManager - per https://studio.zapper.fi/docs/concepts/contract-positions#what-address-should-i-use-for-a-contractposition
  async getDefinitions(): Promise<DefaultContractPositionDefinition[]> {
    return [{ address: this.borrowerOperationsAddress }];
  }

  async _getDebtToken(contract: VesselManager): Promise<UnderlyingTokenDefinition> {
    return {
      metaType: MetaType.BORROWED,
      address: await contract.debtToken(),
      network: this.network,
    };
  }

  async _getCollateralTokens(): Promise<UnderlyingTokenDefinition[]> {
    return this.collateralTokenAddresses.map(collateralAddress => ({
      metaType: MetaType.SUPPLIED,
      address: collateralAddress,
      network: this.network,
    }));
  }

  async getPositionsForBalances() {
    const defaultContractPositions = await this.appToolkit.getAppContractPositions({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    return this.collateralTokenAddresses.map(collateralToken => {
      return {
        ...defaultContractPositions[0],
        collateralToken,
      };
    });
  }

  async getTokenDefinitions({
    contract,
  }: GetTokenDefinitionsParams<VesselManager>): Promise<UnderlyingTokenDefinition[]> {
    const debtToken = await this._getDebtToken(contract);
    const collateralTokens = await this._getCollateralTokens();
    return [debtToken, ...collateralTokens];
  }

  async getLabel(): Promise<string> {
    // async getLabel({ contractPosition }): Promise<string> {
    // FIXME: Can't label the Vessel with collateral type, because getLabel is called before getPositionsForBalances,
    // and so collateralToken class variable isn't available yet.
    // const collateralToken = contractPosition.tokens.find(t => t.address === contractPosition.collateralToken)!;
    // return `${getLabelFromToken(collateralToken)} Vessel`;
    return 'Gravita Vessel';
  }

  async getBalances(_address: string) {
    const multicall = this.appToolkit.getMulticall(this.network);
    const address = await this.getAccountAddress(_address);

    const contractPositions = await this.getPositionsForBalances();
    const filteredPositions = await this.filterPositionsForAddress(address, contractPositions);

    const contract = multicall.wrap(this.getContract(this.vesselManagerAddress));
    const balances = await Promise.all(
      filteredPositions.map(async contractPosition => {
        const balancesRaw = await this.getTokenBalancesPerPosition({ address, contractPosition, contract });
        const allTokens = contractPosition.tokens.map((cp, idx) =>
          drillBalance(cp, balancesRaw[idx]?.toString() ?? '0', { isDebt: cp.metaType === MetaType.BORROWED }),
        );

        const tokens = allTokens.filter(v => Math.abs(v.balanceUSD) > 0.01);
        const balanceUSD = sumBy(tokens, t => t.balanceUSD);

        const balance = { ...contractPosition, tokens, balanceUSD };
        return balance;
      }),
    );

    return balances;
  }

  getTokenBalancesPerPosition({ address, contractPosition, contract }) {
    return Promise.all(
      contractPosition.tokens.map(token => {
        if (token.metaType == MetaType.BORROWED)
          return contract.getVesselDebt(contractPosition.collateralToken, address);
        else if (token.address == contractPosition.collateralToken)
          return contract.getVesselColl(contractPosition.collateralToken, address);
        else return BigNumber.from(0);
      }),
    );
  }
}
