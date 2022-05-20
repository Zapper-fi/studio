import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { ImpermaxContractFactory, Borrowable } from '../contracts';
import { getBorrowAddresses } from '../ethereum/impermax.lend.token-fetcher';
import { IMPERMAX_DEFINITION } from '../impermax.definition';

const appId = IMPERMAX_DEFINITION.id;
const groupId = IMPERMAX_DEFINITION.groups.lend.id;
const network = Network.ARBITRUM_MAINNET;
export const address = '0x8C3736e2FE63cc2cD89Ee228D9dBcAb6CE5B767B'.toLowerCase();

@Register.TokenPositionFetcher({ appId, groupId, network })
export class ArbitrumImpermaxLendTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(ImpermaxContractFactory) private readonly contractFactory: ImpermaxContractFactory,
  ) {}

  async getPositions() {
    const contract = this.contractFactory.factory({ address, network });
    const multicall = this.appToolkit.getMulticall(network).wrap(contract);
    const collateralAddresses = await getBorrowAddresses(multicall);

    const tokens = await this.appToolkit.helpers.vaultTokenHelper.getTokens<Borrowable>({
      appId,
      groupId,
      network,
      resolveVaultAddresses: () => collateralAddresses,
      resolveContract: ({ address, network }) => this.contractFactory.borrowable({ address, network }),
      resolveUnderlyingTokenAddress: ({ multicall, contract }) => multicall.wrap(contract).underlying(),
      resolveReserve: () => 0,
      resolvePricePerShare: ({ multicall, contract, underlyingToken }) =>
        multicall
          .wrap(contract)
          .exchangeRateLast()
          .then(rate => Number(rate) / 10 ** underlyingToken.decimals),
    });
    return tokens;
  }
}
