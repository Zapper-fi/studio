import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import {
  IMorphoCompoundContractPositionHelper,
  MorphoCompoundContractPositionHelper,
} from '~apps/morpho/helpers/morpho.morpho-compound.contract-position-helper';
import { DefaultDataProps } from '~position/display.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MORPHO_DEFINITION } from '../morpho.definition';

const appId = MORPHO_DEFINITION.id;
const groupId = MORPHO_DEFINITION.groups.morphoCompound.id;
const network = Network.ETHEREUM_MAINNET;

export interface MorphoCompoundContractPositionDataProps extends DefaultDataProps {
  supplyApy: number;
  borrowApy: number;
  liquidity: number;
  p2pDisabled: boolean;
}

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumMorphoCompoundSupplyContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(MorphoCompoundContractPositionHelper)
    private readonly positionHelper: IMorphoCompoundContractPositionHelper<MorphoCompoundContractPositionDataProps>,
  ) {}

  async getPositions() {
    return this.positionHelper.getMarkets({ appId, groupId, network });
  }
}
