import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  CompoundClaimableContractPositionFetcher,
  CompoundClaimablePositionDataProps,
} from '~apps/compound/common/compound.claimable.contract-position-fetcher';
import { ContractPosition } from '~position/position.interface';

import { TectonicContractFactory, TectonicCore, TectonicLens } from '../contracts';

@PositionTemplate()
export class CronosTectonicClaimableContractPositionFetcher extends CompoundClaimableContractPositionFetcher<
  TectonicCore,
  TectonicLens
> {
  constructor(
    @Inject(APP_TOOLKIT) readonly appToolkit: IAppToolkit,
    @Inject(TectonicContractFactory)
    private readonly contractFactory: TectonicContractFactory,
  ) {
    super(appToolkit);
  }

  groupLabel = 'Claimable';
  isExcludedFromExplore = true;

  lensAddress = '0x37bafe282cb7d4ef6ad80ee979c341c91def4c17';
  rewardTokenAddress = '0xdd73dea10abc2bff99c60882ec5b2b81bb1dc5b2';
  comptrollerAddress = '0xb3831584acb95ed9ccb0c11f677b5ad01deaeec0';

  getCompoundComptrollerContract(address: string): TectonicCore {
    return this.contractFactory.tectonicCore({ address, network: this.network });
  }

  getCompoundLensContract(address: string): TectonicLens {
    return this.contractFactory.tectonicLens({ address, network: this.network });
  }

  async getClaimableBalance(
    address: string,
    {
      contract,
      contractPosition,
    }: { contract: TectonicLens; contractPosition: ContractPosition<CompoundClaimablePositionDataProps> },
  ) {
    const [rewardToken] = contractPosition.tokens;
    const { address: comptrollerAddress } = contractPosition;

    const rewardMetadata = await contract.callStatic.getTonicBalanceMetadataExt(
      rewardToken.address,
      comptrollerAddress,
      address,
    );

    return rewardMetadata[3];
  }
}
