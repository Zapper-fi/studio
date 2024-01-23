import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  CompoundClaimableContractPositionFetcher,
  CompoundClaimablePositionDataProps,
} from '~apps/compound/common/compound.claimable.contract-position-fetcher';
import { ContractPosition } from '~position/position.interface';

import { LodestarV0ViemContractFactory } from '../contracts';
import { LodestarV0Comptroller, LodestarV0Lens } from '../contracts/viem';
import { LodestarV0LensContract } from '../contracts/viem/LodestarV0Lens';

@PositionTemplate()
export class ArbitrumLodestarV0ClaimableContractPositionFetcher extends CompoundClaimableContractPositionFetcher<
  LodestarV0Comptroller,
  LodestarV0Lens
> {
  groupLabel = 'Claimable';

  lensAddress = '0xf19e4c9757ae4d22b97dd43c30aead7f8a533dc3';
  rewardTokenAddress = '0xf19547f9ed24aa66b03c3a552d181ae334fbb8db';
  comptrollerAddress = '0x92a62f8c4750d7fbdf9ee1db268d18169235117b';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(LodestarV0ViemContractFactory) protected readonly contractFactory: LodestarV0ViemContractFactory,
  ) {
    super(appToolkit);
  }

  getCompoundComptrollerContract(address: string) {
    return this.contractFactory.lodestarV0Comptroller({ address, network: this.network });
  }

  getCompoundLensContract(address: string) {
    return this.contractFactory.lodestarV0Lens({ address, network: this.network });
  }

  async getClaimableBalance(
    address: string,
    {
      contract,
      contractPosition,
    }: {
      contract: LodestarV0LensContract;
      contractPosition: ContractPosition<CompoundClaimablePositionDataProps>;
    },
  ): Promise<BigNumberish> {
    const [rewardToken] = contractPosition.tokens;
    const { address: comptrollerAddress } = contractPosition;

    const { result: rewardMetadata } = await contract.simulate.getCompBalanceMetadataExt([
      rewardToken.address,
      comptrollerAddress,
      address,
    ]);

    return rewardMetadata[3];
  }
}
