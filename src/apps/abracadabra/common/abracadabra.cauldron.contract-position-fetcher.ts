import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { isMulticallUnderlyingError } from '~multicall/multicall.ethers';
import { MetaType } from '~position/position.interface';
import { isSupplied } from '~position/position.utils';
import {
  ContractPositionTemplatePositionFetcher,
  DisplayPropsStageParams,
  GetTokenBalancesPerPositionParams,
  TokenStageParams,
} from '~position/template/contract-position.template.position-fetcher';

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

  async getDescriptors() {
    return this.cauldrons.map(address => ({ address }));
  }

  async getTokenDescriptors({ contract, multicall }: TokenStageParams<AbracadabraCauldron>) {
    const [collateralAddressRaw, debtAddressRaw] = await Promise.all([
      contract.collateral(),
      contract.magicInternetMoney(),
    ]);

    // Abracadabra wraps Convex pools in its own wrapper ERC20 token
    const _convexWrapper = this.contractFactory.abracadabraConvexWrapper({
      address: collateralAddressRaw.toLowerCase(),
      network: this.network,
    });

    const convexWrapper = multicall.wrap(_convexWrapper);
    const maybeConvexAddressRaw = await convexWrapper.convexToken().catch(err => {
      if (isMulticallUnderlyingError(err)) return null;
      throw err;
    });

    const collateralAddress = maybeConvexAddressRaw
      ? maybeConvexAddressRaw.toLowerCase()
      : collateralAddressRaw.toLowerCase();

    return [
      { metaType: MetaType.SUPPLIED, address: collateralAddress },
      { metaType: MetaType.BORROWED, address: debtAddressRaw },
    ];
  }

  async getLabel({ contractPosition }: DisplayPropsStageParams<AbracadabraCauldron>) {
    const suppliedToken = contractPosition.tokens.find(isSupplied)!;
    return `${getLabelFromToken(suppliedToken)} Cauldron`;
  }

  async getTokenBalancesPerPosition({
    address,
    contractPosition,
    contract,
  }: GetTokenBalancesPerPositionParams<AbracadabraCauldron>) {
    const [borrowPartRaw, totalBorrowRaw, collateralShareRaw, bentoBoxAddressRaw] = await Promise.all([
      contract.userBorrowPart(address),
      contract.totalBorrow(),
      contract.userCollateralShare(address),
      contract.bentoBox(),
    ]);

    const bentoBoxTokenContract = this.contractFactory.abracadabraBentoBoxTokenContract({
      address: bentoBoxAddressRaw,
      network: this.network,
    });

    const suppliedToken = contractPosition.tokens.find(isSupplied)!;
    const suppliedBalanceRaw = await bentoBoxTokenContract.toAmount(suppliedToken.address, collateralShareRaw, false);
    const borrowedBalanceRaw = borrowPartRaw.mul(totalBorrowRaw.elastic).div(totalBorrowRaw.base);

    return [suppliedBalanceRaw, borrowedBalanceRaw];
  }
}
