import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { WrapperTemplateTokenFetcher } from '~position/template/wrapper.template.token-fetcher';

@PositionTemplate()
export class EthereumPirexPxBtrflyTokenFetcher extends WrapperTemplateTokenFetcher {
  groupLabel = 'Pirex BTRFLY';
  vaultAddress = '0x10978db3885ba79bf1bc823e108085fb88e6f02f';
  underlyingTokenAddress = '0xc55126051b22ebb829d00368f4b12bde432de5da';
}
