import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { MuxMlpTokenFetcher } from '../common/mux.mlp.token-fetcher';

@PositionTemplate()
export class AvalancheMuxMlpTokenFetcher extends MuxMlpTokenFetcher {
  groupLabel = 'MUX LP';
  mlpAddress = '0xaf2d365e668baafedcfd256c0fbbe519e594e390';
  subgraphUrl = 'https://api.thegraph.com/subgraphs/name/mux-world/mux-ava';
}
