import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  CompoundClaimableContractPositionFetcher,
  CompoundClaimablePositionDataProps,
} from '~apps/compound/common/compound.claimable.contract-position-fetcher';
import { ContractPosition } from '~position/position.interface';

import { LodestarComptroller, LodestarContractFactory } from '../contracts';
import { LodestarLens } from '../contracts/ethers/LodestarLens';

@PositionTemplate()
export class ArbitrumLodestarClaimableContractPositionFetcher extends CompoundClaimableContractPositionFetcher<
  LodestarComptroller,
  LodestarLens
> {
  groupLabel = 'Claimable';

  lensAddress = '0xf19e4c9757ae4d22b97dd43c30aead7f8a533dc3';
  rewardTokenAddress = '0xf19547f9ed24aa66b03c3a552d181ae334fbb8db';
  comptrollerAddress = '0x92a62f8c4750d7fbdf9ee1db268d18169235117b';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(LodestarContractFactory) protected readonly contractFactory: LodestarContractFactory,
  ) {
    super(appToolkit);
  }

  getCompoundComptrollerContract(address: string): LodestarComptroller {
    return this.contractFactory.lodestarComptroller({ address, network: this.network });
  }

  getCompoundLensContract(address: string): LodestarLens {
    return this.contractFactory.lodestarLens({ address, network: this.network });
  }

  async getClaimableBalance(
    address: string,
    {
      contract,
      contractPosition,
    }: { contract: LodestarLens; contractPosition: ContractPosition<CompoundClaimablePositionDataProps> },
  ): Promise<BigNumberish> {
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
