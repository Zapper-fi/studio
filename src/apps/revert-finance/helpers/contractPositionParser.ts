import { getAddress } from 'ethers/lib/utils';

import { drillBalance } from '~app-toolkit';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { ContractPositionBalance } from '~position/position-balance.interface';
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
    groupId: REVERT_FINANCE_DEFINITION.groups.compoundorBotRewards.id,
    tokens: balance,
    balanceUSD: balance[0].balanceUSD,
    dataProps,
    displayProps,
  };
};
