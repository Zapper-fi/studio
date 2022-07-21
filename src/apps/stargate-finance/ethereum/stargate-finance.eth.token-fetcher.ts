import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { ZERO_ADDRESS } from '~app-toolkit/constants/address';

import { StargateFinanceContractFactory, StargateEth } from '../contracts';
import { STARGATE_FINANCE_DEFINITION } from '../stargate-finance.definition';

const appId = STARGATE_FINANCE_DEFINITION.id;
const groupId = STARGATE_FINANCE_DEFINITION.groups.eth.id;
const network = Network.ETHEREUM_MAINNET;

const address = '0x72E2F4830b9E45d52F80aC08CB2bEC0FeF72eD9c'.toLowerCase()

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumStargateFinanceEthTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(StargateFinanceContractFactory)
    private readonly contractFactory: StargateFinanceContractFactory,
  ) { }

  async getPositions() {
    return await this.appToolkit.helpers.vaultTokenHelper.getTokens<StargateEth>({
      appId,
      groupId,
      network,
      resolveVaultAddresses: () => [address],
      resolveContract: ({ address, network }) => this.contractFactory.stargateEth({ address, network }),
      resolveUnderlyingTokenAddress: () => ZERO_ADDRESS,
      resolveReserve: ({ multicall, contract }) => multicall.wrap(contract).totalSupply().then(Number),
      resolvePricePerShare: ({ underlyingToken }) => underlyingToken.price,
    });
  }
}
