import { Injectable } from '@nestjs/common';
import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';

import { BLOCKS_PER_DAY } from '~app-toolkit/constants/blocks';
import { Network } from '~types';

@Injectable()
export class MorphoRateHelper {
  rateToAPY = ({ network, rate }: { network: Network; rate: BigNumber }) =>
    Math.pow(1 + BLOCKS_PER_DAY[network] * +formatUnits(rate), 365) - 1;
}
