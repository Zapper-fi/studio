import { Inject, Injectable } from '@nestjs/common';
import { BigNumberish } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { isSupplied } from '~position/position.utils';
import {
  GetTokenDefinitionsParams,
  GetTokenBalancesParams,
  GetDisplayPropsParams,
} from '~position/template/contract-position.template.types';
import { VotingEscrowTemplateContractPositionFetcher } from '~position/template/voting-escrow.template.contract-position-fetcher';
import { Network } from '~types/network.interface';

import { RedactedCartelContractFactory, RedactedRevenueLock } from '../contracts';
import { REDACTED_CARTEL_DEFINITION } from '../redacted-cartel.definition';

@Injectable()
export class EthereumRedactedCartelRevenueLockContractPositionFetcher extends VotingEscrowTemplateContractPositionFetcher<RedactedRevenueLock> {
  appId = REDACTED_CARTEL_DEFINITION.id;
  groupId = REDACTED_CARTEL_DEFINITION.groups.revenueLock.id;
  network = Network.ETHEREUM_MAINNET;
  groupLabel = 'Revenue Lock';

  veTokenAddress = '0x742b70151cd3bc7ab598aaff1d54b90c3ebc6027';
  rewardAddress = '0x74c6cade3ef61d64dcc9b97490d9fbb231e4bdcc';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(RedactedCartelContractFactory) protected readonly contractFactory: RedactedCartelContractFactory,
  ) {
    super(appToolkit);
  }

  getEscrowContract(address: string): RedactedRevenueLock {
    return this.contractFactory.redactedRevenueLock({ address, network: this.network });
  }

  async getEscrowedTokenAddress({ contract }: GetTokenDefinitionsParams<RedactedRevenueLock>) {
    return contract.btrflyV2();
  }

  async getEscrowedTokenBalance({
    address,
    contract,
  }: GetTokenBalancesParams<RedactedRevenueLock>): Promise<BigNumberish> {
    return (await contract.lockedBalances(address)).locked;
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<RedactedRevenueLock>) {
    const suppliedToken = contractPosition.tokens.find(isSupplied)!;
    return `Revenue Lock ${getLabelFromToken(suppliedToken)}`;
  }
}
