import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { UniswapV3LiquidityContractPositionBuilder } from '../common/uniswap-v3.liquidity.contract-position-builder';

@PositionTemplate()
export class CeloUniswapV3LiquidityContractPositionBuilder extends UniswapV3LiquidityContractPositionBuilder {
  managerAddress = '0x3d79edaabc0eab6f08ed885c05fc0b014290d95a';
  factoryAddress = '0xafe208a311b21f13ef87e33a90049fc17a7acdec';
}
