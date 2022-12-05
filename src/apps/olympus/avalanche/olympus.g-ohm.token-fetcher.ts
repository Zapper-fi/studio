import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { WrapperTemplateTokenFetcher } from '~position/template/wrapper.template.token-fetcher';
import { Network } from '~types/network.interface';

@PositionTemplate()
export class AvalancheOlympusGOhmTokenFetcher extends WrapperTemplateTokenFetcher {
  groupLabel = 'gOHM';
  vaultAddress = '0x321e7092a180bb43555132ec53aaa65a5bf84251';
  underlyingTokenAddress = '0x0ab87046fbb341d058f17cbc4c1133f25a20a52f';
  fromNetwork = Network.ETHEREUM_MAINNET;
}
