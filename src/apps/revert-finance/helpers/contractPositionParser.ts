import { getAddress } from 'ethers/lib/utils';

import { drillBalance } from '~app-toolkit';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { AppTokenPosition } from '~position/position.interface';
import { claimable } from '~position/position.utils';
import { BaseToken } from '~position/token.interface';
import { Network } from '~types';

import REVERT_FINANCE_DEFINITION from '../revert-finance.definition';

const CompoundorContractAddress = getAddress('0x5411894842e610c4d0f6ed4c232da689400f94a1');

export const getCompoundorContractPosition = (
  network: Network,
  existingToken: BaseToken,
  balanceRaw: string,
): ContractPositionBalance => {
  const balance = [drillBalance(claimable(existingToken), balanceRaw)];
  const dataProps = {};
  const displayProps = {
    label: `Claimable ${existingToken.symbol}`,
    secondaryLabel: buildDollarDisplayItem(existingToken.price),
    images: [getTokenImg(existingToken.address, network)],
    statsItems: [],
  };

  return {
    type: ContractType.POSITION,
    address: CompoundorContractAddress,
    network,
    appId: REVERT_FINANCE_DEFINITION.id,
    groupId: REVERT_FINANCE_DEFINITION.groups.compoundorRewards.id,
    tokens: balance,
    balanceUSD: balance[0].balanceUSD,
    dataProps,
    displayProps,
  };
};

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
