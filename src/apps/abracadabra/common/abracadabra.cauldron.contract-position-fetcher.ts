import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { DefaultDataProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { isSupplied } from '~position/position.utils';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { AbracadabraContractFactory, AbracadabraCauldron } from '../contracts';

interface AbracadabraCauldronContractPositionDefinition extends DefaultContractPositionDefinition {
  type: 'REGULAR' | 'CONVEX' | 'GLP';
}

export abstract class AbracadabraCauldronContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  AbracadabraCauldron,
  DefaultDataProps,
  AbracadabraCauldronContractPositionDefinition
> {
  cauldrons: string[] = [];
  convexCauldrons: string[] = [];
  glpCauldrons: string[] = [];

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(AbracadabraContractFactory) protected readonly contractFactory: AbracadabraContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): AbracadabraCauldron {
    return this.contractFactory.abracadabraCauldron({ address, network: this.network });
  }

  async getDefinitions() {
    const regularCauldronDefinitions: AbracadabraCauldronContractPositionDefinition[] = this.cauldrons.map(address => ({
      address,
      type: 'REGULAR',
    }));
    const convexCauldronDefinitions: AbracadabraCauldronContractPositionDefinition[] = this.convexCauldrons.map(
      address => ({
        address,
        type: 'CONVEX',
      }),
    );
    const glpCauldronDefinitions: AbracadabraCauldronContractPositionDefinition[] = this.glpCauldrons.map(address => ({
      address,
      type: 'GLP',
    }));
    return [...regularCauldronDefinitions, ...convexCauldronDefinitions, ...glpCauldronDefinitions];
  }

  async getTokenDefinitions(
    params: GetTokenDefinitionsParams<AbracadabraCauldron, AbracadabraCauldronContractPositionDefinition>,
  ) {
    const {
      definition: { type },
    } = params;
    switch (type) {
      case 'REGULAR':
        return this.getRegularTokenDefinitions(params);
      case 'CONVEX':
        return this.getConvexTokenDefinitions(params);
      case 'GLP':
        return this.getGlpTokenDefinitions(params);
    }
  }

  private async getRegularTokenDefinitions({
    contract,
  }: GetTokenDefinitionsParams<AbracadabraCauldron, AbracadabraCauldronContractPositionDefinition>) {
    const [collateralAddressRaw, debtAddressRaw] = await Promise.all([
      contract.collateral(),
      contract.magicInternetMoney(),
    ]);

    return [
      {
        metaType: MetaType.SUPPLIED,
        address: collateralAddressRaw,
        network: this.network,
      },
      {
        metaType: MetaType.BORROWED,
        address: debtAddressRaw,
        network: this.network,
      },
    ];
  }

  private async getConvexTokenDefinitions({
    contract,
    multicall,
  }: GetTokenDefinitionsParams<AbracadabraCauldron, AbracadabraCauldronContractPositionDefinition>) {
    const [collateralTokenAddress, debtTokenAddress] = await Promise.all([
      contract.collateral().then(collateralTokenAddress => {
        const convexWrapper = multicall.wrap(
          this.contractFactory.abracadabraConvexWrapper({
            address: collateralTokenAddress.toLowerCase(),
            network: this.network,
          }),
        );

        return convexWrapper.convexToken();
      }),
      contract.magicInternetMoney(),
    ]);

    return [
      {
        metaType: MetaType.SUPPLIED,
        address: collateralTokenAddress,
        network: this.network,
      },
      {
        metaType: MetaType.BORROWED,
        address: debtTokenAddress,
        network: this.network,
      },
    ];
  }

  private async getGlpTokenDefinitions({
    contract,
    multicall,
  }: GetTokenDefinitionsParams<AbracadabraCauldron, AbracadabraCauldronContractPositionDefinition>) {
    const [collateralTokenAddress, debtTokenAddress] = await Promise.all([
      contract.collateral(),
      contract.magicInternetMoney(),
    ]);

    const glpWrapper = multicall.wrap(
      this.contractFactory.abracadabraGlpWrapper({
        address: collateralTokenAddress,
        network: this.network,
      }),
    );

    const sGlpAddress = await glpWrapper.underlying();

    const sGlp = multicall.wrap(
      this.contractFactory.abracadabraGmxSGlp({
        address: sGlpAddress,
        network: this.network,
      }),
    );

    const glpAddress = await sGlp.glp();

    return [
      {
        metaType: MetaType.SUPPLIED,
        address: glpAddress,
        network: this.network,
      },
      {
        metaType: MetaType.BORROWED,
        address: debtTokenAddress,
        network: this.network,
      },
    ];
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<AbracadabraCauldron>) {
    const suppliedToken = contractPosition.tokens.find(isSupplied)!;
    return `${getLabelFromToken(suppliedToken)} Cauldron`;
  }

  async getTokenBalancesPerPosition({
    address,
    contractPosition,
    contract,
    multicall,
  }: GetTokenBalancesParams<AbracadabraCauldron>) {
    const [borrowPartRaw, totalBorrowRaw, suppliedBalanceRaw] = await Promise.all([
      contract.userBorrowPart(address),
      contract.totalBorrow(),
      Promise.all([contract.userCollateralShare(address), contract.bentoBox()]).then(
        ([collateralShareRaw, bentoBoxAddress]) => {
          const bentoBoxContract = multicall.wrap(
            this.contractFactory.abracadabraBentoBoxTokenContract({
              address: bentoBoxAddress,
              network: this.network,
            }),
          );

          const suppliedToken = contractPosition.tokens.find(isSupplied)!;

          return bentoBoxContract.toAmount(suppliedToken.address, collateralShareRaw, false);
        },
      ),
    ]);

    const borrowedBalanceRaw = totalBorrowRaw.base.eq(0)
      ? 0
      : borrowPartRaw.mul(totalBorrowRaw.elastic).div(totalBorrowRaw.base);

    return [suppliedBalanceRaw, borrowedBalanceRaw];
  }
}
