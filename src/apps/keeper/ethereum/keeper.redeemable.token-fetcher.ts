import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';

import { KeeperContractFactory } from '../contracts';
import { KeeperRedeemableToken } from '../contracts/ethers/KeeperRedeemableToken';

@PositionTemplate()
export class EthereumKeeperRedeemableTokenFetcher extends AppTokenTemplatePositionFetcher<KeeperRedeemableToken> {
  groupLabel = 'rKP3R';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(KeeperContractFactory) protected readonly contractFactory: KeeperContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): KeeperRedeemableToken {
    return this.contractFactory.keeperRedeemableToken({ address, network: this.network });
  }

  async getAddresses() {
    return ['0xedb67ee1b171c4ec66e6c10ec43edbba20fae8e9'];
  }

  async getUnderlyingTokenDefinitions() {
    return [{ address: '0x1ceb5cb57c4d4e2b2433641b95dd330a33185a44', network: this.network }];
  }
}
