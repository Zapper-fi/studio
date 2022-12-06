import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { WrapperTemplateTokenFetcher } from '~position/template/wrapper.template.token-fetcher';
import { Network } from '~types/network.interface';

@PositionTemplate()
export class AvalancheOlympusWsOhmV1TokenFetcher extends WrapperTemplateTokenFetcher {
  groupLabel = 'wsOHM v1';
  vaultAddress = '0x8cd309e14575203535ef120b5b0ab4dded0c2073';
  underlyingTokenAddress = '0xca76543cf381ebbb277be79574059e32108e3e65';
  fromNetwork = Network.ETHEREUM_MAINNET;
}
