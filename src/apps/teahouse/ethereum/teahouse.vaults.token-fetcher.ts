import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import { TeahouseVaultsTokenFetcher } from '../common/teahouse.vaults.token-fetcher';

@PositionTemplate()
export class EthereumTeahouseVaultsTokenFetcher extends TeahouseVaultsTokenFetcher {
  groupLabel = 'Vault share';
  fromBlock = 15615676;

  async getAddresses() {
    return [
      '0xe1b3c128c0d0a9e41ab3ff8f0984e5d5bef81677',
      '0xb54e2764bef6994245527f75eb8f180c484c404d',
      '0x478afa95f40bf5504cff32796c20bfd0b4e38330',
      '0x9ed9c1c0f1c68666668a7aedec5fec95abc7f943',
    ];
  }
}
