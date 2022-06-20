import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { EthersMulticall as Multicall } from '~multicall/multicall.ethers';
import { ContractType } from '~position/contract.interface';
import { ContractPosition } from '~position/position.interface';
import { claimable, vesting } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { CurveContractFactory as ContractFactory } from '../contracts';

type CurveVestingEscrowContractPositionHelperParams<T> = {
  appId: string;
  groupId: string;
  network: Network;
  vestingEscrowAddress: string;
  resolveVestingEscrowContract: (opts: { contractFactory: ContractFactory; address: string }) => T;
  resolveVestingTokenAddress: (opts: { contract: T; multicall: Multicall }) => Promise<string>;
};

export class CurveVestingEscrowContractPositionHelper {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(ContractFactory) private readonly contractFactory: ContractFactory,
  ) {}

  async getContractPositions<T>({
    appId,
    groupId,
    network,
    vestingEscrowAddress,
    resolveVestingEscrowContract,
    resolveVestingTokenAddress,
  }: CurveVestingEscrowContractPositionHelperParams<T>) {
    const contractFactory = this.contractFactory;
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);

    // Resolve escrowed token
    const escrowContract = resolveVestingEscrowContract({ contractFactory, address: vestingEscrowAddress });
    const escrowedTokenAddressRaw = await resolveVestingTokenAddress({ contract: escrowContract, multicall });
    const escrowedTokenAddress = escrowedTokenAddressRaw.toLowerCase();
    const escrowedToken = baseTokens.find(v => v.address === escrowedTokenAddress)!;
    const tokens = [claimable(escrowedToken), vesting(escrowedToken)];

    const escrowedTokenContract = this.contractFactory.erc20({ address: escrowedToken.address, network });
    const balanceOfRaw = await multicall.wrap(escrowedTokenContract).balanceOf(vestingEscrowAddress);
    const balanceOf = Number(balanceOfRaw) / 10 ** escrowedToken.decimals;
    const liquidity = balanceOf * escrowedToken.price;

    // Display Props
    const label = `Vesting Escrow ${escrowedToken.symbol}`;
    const secondaryLabel = buildDollarDisplayItem(escrowedToken.price);
    const images = [getTokenImg(escrowedToken.address, network)];
    const statsItems = [
      {
        label: 'Liquidity',
        value: buildDollarDisplayItem(liquidity),
      },
    ];

    const dataProps = {
      liquidity,
    };
    const displayProps = { label, secondaryLabel, images, statsItems };

    const contractPosition: ContractPosition = {
      address: vestingEscrowAddress,
      type: ContractType.POSITION,
      appId,
      groupId,
      network,
      tokens,
      dataProps,
      displayProps,
    };

    return [contractPosition];
  }
}
