import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken, getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { IMulticallWrapper } from '~multicall/multicall.interface';
import { ContractType } from '~position/contract.interface';
import { ContractPosition, MetaType } from '~position/position.interface';
import { AppGroupsDefinition } from '~position/position.service';
import { supplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

export type CurveVotingEscrowContractPositionDataProps = {
  rewardAddress?: string;
  liquidity: number;
};

type CurveVotingEscrowContractPositionHelperParams<T, V = null> = {
  appId: string;
  groupId: string;
  network: Network;
  votingEscrowAddress: string;
  votingEscrowRewardAddress?: string;
  appTokenDependencies?: AppGroupsDefinition[];
  resolveContract: (opts: { network: Network; address: string }) => T;
  resolveRewardContract?: (opts: { network: Network; address: string }) => V;
  resolveLockedTokenAddress: (opts: { contract: T; multicall: IMulticallWrapper }) => Promise<string>;
  resolveRewardTokenAddress?: (opts: { contract: V; multicall: IMulticallWrapper }) => Promise<string>;
};

export class CurveVotingEscrowContractPositionHelper {
  constructor(@Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit) {}

  async getContractPositions<T, V = null>({
    votingEscrowAddress,
    votingEscrowRewardAddress,
    appId,
    groupId,
    network,
    appTokenDependencies = [],
    resolveContract,
    resolveLockedTokenAddress,
    resolveRewardContract,
    resolveRewardTokenAddress,
  }: CurveVotingEscrowContractPositionHelperParams<T, V>) {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const appTokens = await this.appToolkit.getAppTokenPositions(...appTokenDependencies);
    const allTokens = [...appTokens, ...baseTokens];

    // Resolve escrowed token
    const escrowContract = resolveContract({ network, address: votingEscrowAddress });
    const escrowedTokenAddressRaw = await resolveLockedTokenAddress({ contract: escrowContract, multicall });
    const escrowedTokenAddress = escrowedTokenAddressRaw.toLowerCase();
    const escrowedToken = allTokens.find(v => v.address === escrowedTokenAddress);
    if (!escrowedToken) return [];

    const escrowedTokenContract = this.appToolkit.globalContracts.erc20({ address: escrowedToken.address, network });
    const balanceOfRaw = await multicall.wrap(escrowedTokenContract).balanceOf(votingEscrowAddress);
    const balanceOf = Number(balanceOfRaw) / 10 ** escrowedToken.decimals;
    const liquidity = balanceOf * escrowedToken.price;

    const tokens = [supplied(escrowedToken)];
    const dataProps: CurveVotingEscrowContractPositionDataProps = { liquidity };

    // Resolve reward token if applicable
    if (resolveRewardContract && resolveRewardTokenAddress) {
      const rewardContract = resolveRewardContract({ network, address: votingEscrowRewardAddress! });
      const rewardTokenAddressRaw = await resolveRewardTokenAddress({ contract: rewardContract, multicall });
      const rewardTokenAddress = rewardTokenAddressRaw.toLowerCase();
      const rewardToken = allTokens.find(v => v.address === rewardTokenAddress)!;
      tokens.push({ metaType: MetaType.CLAIMABLE, ...rewardToken });
      dataProps.rewardAddress = votingEscrowRewardAddress;
    }

    // Display Props
    const label = `Voting Escrow ${getLabelFromToken(escrowedToken)}`;
    const secondaryLabel = buildDollarDisplayItem(escrowedToken.price);
    const images = getImagesFromToken(escrowedToken);
    const statsItems = [
      {
        label: 'Liquidity',
        value: buildDollarDisplayItem(liquidity),
      },
    ];
    const displayProps = { label, secondaryLabel, images, statsItems };

    const contractPosition: ContractPosition<CurveVotingEscrowContractPositionDataProps> = {
      address: votingEscrowAddress,
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
