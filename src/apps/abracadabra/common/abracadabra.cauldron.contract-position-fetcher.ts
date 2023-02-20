import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { isSupplied } from '~position/position.utils';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
} from '~position/template/contract-position.template.types';

import { AbracadabraContractFactory, AbracadabraCauldron } from '../contracts';

export abstract class AbracadabraCauldronContractPositionFetcher extends ContractPositionTemplatePositionFetcher<AbracadabraCauldron> {
  abstract cauldrons: string[];

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
    return this.cauldrons.map(address => ({ address }));
  }

  async getTokenDefinitions({ address, contract, multicall }: GetTokenDefinitionsParams<AbracadabraCauldron>) {
    const [collateralAddressRaw, debtAddressRaw] = await Promise.all([
      contract.collateral(),
      contract.magicInternetMoney(),
    ]);

    let realCollateralAddressRaw = collateralAddressRaw;

    // Abracadabra wraps Convex pools in its own wrapper ERC20 token
    const convexCauldrons = [
      '0x4eaed76c3a388f4a841e9c765560bbe7b3e4b3a0',
      '0x35a0dd182e4bca59d5931eae13d0a2332fa30321',
      '0x806e16ec797c69afa8590a55723ce4cc1b54050e',
      '0x6371efe5cd6e3d2d7c477935b7669401143b7985',
      '0x257101f20cb7243e2c7129773ed5dbbcef8b34e0',
    ];

    if (convexCauldrons.includes(address)) {
      const convexWrapper = this.contractFactory.abracadabraConvexWrapper({
        address: collateralAddressRaw.toLowerCase(),
        network: this.network,
      });

      realCollateralAddressRaw = await multicall.wrap(convexWrapper).convexToken();
    }

    // Abracadabra wraps GLP pools in its own wrapper ERC20 token
    const glpCauldrons = ['0x5698135ca439f21a57bddbe8b582c62f090406d5'];

    if (glpCauldrons.includes(address)) {
      const glpWrapper = this.contractFactory.abracadabraGlpWrapper({
        address: collateralAddressRaw.toLowerCase(),
        network: this.network,
      });

      const sGlpAddressRaw = await multicall.wrap(glpWrapper).underlying();
      const sGlp = this.contractFactory.abracadabraGmxSGlp({
        address: sGlpAddressRaw.toLowerCase(),
        network: this.network,
      });

      const glpAddress = await multicall.wrap(sGlp).glp();
      realCollateralAddressRaw = glpAddress;
    }

    return [
      {
        metaType: MetaType.SUPPLIED,
        address: realCollateralAddressRaw,
        network: this.network,
      },
      {
        metaType: MetaType.BORROWED,
        address: debtAddressRaw,
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
    const [borrowPartRaw, totalBorrowRaw, collateralShareRaw, bentoBoxAddressRaw] = await Promise.all([
      contract.userBorrowPart(address),
      contract.totalBorrow(),
      contract.userCollateralShare(address),
      contract.bentoBox(),
    ]);

    const bentoBoxTokenContract = multicall.wrap(
      this.contractFactory.abracadabraBentoBoxTokenContract({
        address: bentoBoxAddressRaw,
        network: this.network,
      }),
    );

    const suppliedToken = contractPosition.tokens.find(isSupplied)!;
    const suppliedBalanceRaw = await bentoBoxTokenContract.toAmount(suppliedToken.address, collateralShareRaw, false);
    const borrowedBalanceRaw = borrowPartRaw.mul(totalBorrowRaw.elastic).div(totalBorrowRaw.base);

    return [suppliedBalanceRaw, borrowedBalanceRaw];
  }
}
