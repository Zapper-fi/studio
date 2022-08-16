import { getAddress } from 'ethers/lib/utils';

import { drillBalance } from '~app-toolkit';
import { getAppImg, getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { ContractPositionBalance, TokenBalance } from '~position/position-balance.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types';

import REVERT_FINANCE_DEFINITION from '../revert-finance.definition';

const CompoundorContractAddress = getAddress('0x5411894842e610c4d0f6ed4c232da689400f94a1');

export const getCompoundorRewardsContractPosition = (
  network: Network,
  tokens: Array<TokenBalance>,
): ContractPositionBalance => ({
  type: ContractType.POSITION,
  address: CompoundorContractAddress,
  network,
  appId: REVERT_FINANCE_DEFINITION.id,
  groupId: REVERT_FINANCE_DEFINITION.groups.compoundorRewards.id,
  tokens: tokens.sort((a, b) => b.balanceUSD - a.balanceUSD),
  balanceUSD: tokens.reduce((a, token) => a + token.balanceUSD, 0),
  dataProps: {},
  displayProps: {
    label: `Compoundor claimable fees`,
    images: [getAppImg(REVERT_FINANCE_DEFINITION.id)],
    statsItems: [],
  },
});

export const getCompoundingContractPosition = (
  network: Network,
  uniV3Lp: AppTokenPosition,
): ContractPositionBalance => ({
  address: CompoundorContractAddress,
  type: ContractType.POSITION,
  network,
  appId: REVERT_FINANCE_DEFINITION.id,
  groupId: REVERT_FINANCE_DEFINITION.groups.compoundingPositions.id,
  tokens: [{ ...uniV3Lp, ...drillBalance(uniV3Lp, '1') }],
  balanceUSD: drillBalance(uniV3Lp, '1').balanceUSD,
  dataProps: {},
  displayProps: {
    label: `Compounding ${uniV3Lp.displayProps.label}`,
    images: [getTokenImg(uniV3Lp.address, network)],
    statsItems: [],
  },
});
