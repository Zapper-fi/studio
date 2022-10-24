import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { ContractPosition } from '~position/position.interface';

import {
  CompoundClaimableContractPositionFetcher,
  CompoundClaimablePositionDataProps,
} from '../common/damm.claimable.contract-position-fetcher';
import { CompoundComptroller, CompoundContractFactory, CompoundLens } from '../contracts';

@PositionTemplate()
export class EthereumCompoundClaimableContractPositionFetcher extends CompoundClaimableContractPositionFetcher<
  CompoundComptroller,
  CompoundLens
> {
  constructor(
    @Inject(APP_TOOLKIT) readonly appToolkit: IAppToolkit,
    @Inject(CompoundContractFactory)
    private readonly contractFactory: CompoundContractFactory,
  ) {
    super(appToolkit);
  }

  groupLabel = 'Claimable';
  isExcludedFromExplore = true;

  lensAddress = '0xd513d22422a3062bd342ae374b4b9c20e0a9a074';
  rewardTokenAddress = '0xfa372ff1547fa1a283b5112a4685f1358ce5574d';
  comptrollerAddress = '0x4f96ab61520a6636331a48a11eafba8fb51f74e4';

  getCompoundComptrollerContract(address: string): CompoundComptroller {
    return this.contractFactory.compoundComptroller({ address, network: this.network });
  }

  getCompoundLensContract(address: string): CompoundLens {
    return this.contractFactory.compoundLens({ address, network: this.network });
  }

  async getClaimableBalance(
    address: string,
    {
      contract,
      contractPosition,
    }: { contract: CompoundLens; contractPosition: ContractPosition<CompoundClaimablePositionDataProps> },
  ) {
    const [rewardToken] = contractPosition.tokens;
    const { address: comptrollerAddress } = contractPosition;

    const rewardMetadata = await contract.callStatic.getCompBalanceMetadataExt(
      rewardToken.address,
      comptrollerAddress,
      address,
    );

    return rewardMetadata[3];
  }
}
