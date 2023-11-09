import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import {
  CompoundClaimableContractPositionFetcher,
  CompoundClaimablePositionDataProps,
} from '~apps/compound/common/compound.claimable.contract-position-fetcher';
import { ContractPosition } from '~position/position.interface';

import { InverseContractFactory, InverseController } from '../contracts';
import { InverseLens } from '../contracts/viem/InverseLens';

@PositionTemplate()
export class EthereumInverseClaimableContractPositionFetcher extends CompoundClaimableContractPositionFetcher<
  InverseController,
  InverseLens
> {
  groupLabel = 'Claimable';

  lensAddress = '0xd513d22422a3062bd342ae374b4b9c20e0a9a074';
  rewardTokenAddress = '0x41d5d79431a913c4ae7d69a668ecdfe5ff9dfb68';
  comptrollerAddress = '0x4dcf7407ae5c07f8681e1659f626e114a7667339';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(InverseViemContractFactory) protected readonly contractFactory: InverseViemContractFactory,
  ) {
    super(appToolkit);
  }

  getCompoundComptrollerContract(address: string): InverseController {
    return this.contractFactory.inverseController({ address, network: this.network });
  }

  getCompoundLensContract(address: string): InverseLens {
    return this.contractFactory.inverseLens({ address, network: this.network });
  }

  async getClaimableBalance(
    address: string,
    {
      contract,
      contractPosition,
    }: { contract: InverseLens; contractPosition: ContractPosition<CompoundClaimablePositionDataProps> },
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
