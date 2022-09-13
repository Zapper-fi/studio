import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import {
  CompoundClaimableContractPositionFetcher,
  CompoundClaimablePositionDataProps,
} from '../common/compound.claimable.contract-position-fetcher';
import { COMPOUND_DEFINITION } from '../compound.definition';
import { CompoundComptroller, CompoundContractFactory, CompoundLens } from '../contracts';

@Injectable()
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

  appId = COMPOUND_DEFINITION.id;
  groupId = COMPOUND_DEFINITION.groups.claimable.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'Claimable';
  isExcludedFromExplore = true;

  lensAddress = '0xd513d22422a3062bd342ae374b4b9c20e0a9a074';
  rewardTokenAddress = '0xc00e94cb662c3520282e6f5717214004a7f26888';
  comptrollerAddress = '0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b';

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
