import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import {
  IMorphoCompoundSupplyContractPositionHelper,
  MorphoCompoundSupplyContractPositionHelper,
} from '~apps/morpho/helpers/morpho.morpho-compound-supply.contract-position-helper';
import { DefaultDataProps } from '~position/display.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { MorphoContractFactory } from '../contracts';
import { MORPHO_DEFINITION } from '../morpho.definition';

const appId = MORPHO_DEFINITION.id;
const groupId = MORPHO_DEFINITION.groups.morphoCompoundSupply.id;
const network = Network.ETHEREUM_MAINNET;

export interface MorphoCompoundSupplyContractPositionDataProps extends DefaultDataProps {
  supplyApy: number;
  borrowApy: number;
  liquidity: number;
  p2pDisabled: boolean;
}

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumMorphoCompoundSupplyContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(MorphoContractFactory) private readonly morphoContractFactory: MorphoContractFactory,
    @Inject(MorphoCompoundSupplyContractPositionHelper)
    private readonly positionHelper: IMorphoCompoundSupplyContractPositionHelper<MorphoCompoundSupplyContractPositionDataProps>,
  ) {}

  async getPositions() {
    return this.positionHelper.getMarkets({ appId, groupId, network });
  }
}
