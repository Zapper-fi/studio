import { Inject } from '@nestjs/common';
import { BigNumber } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getAppImg } from '~app-toolkit/helpers/presentation/image.present';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { OlympusContractFactory, OlympusGOhmToken } from '../contracts';
import { OLYMPUS_DEFINITION } from '../olympus.definition';

const appId = OLYMPUS_DEFINITION.id;
const network = Network.ETHEREUM_MAINNET;
const groupId = OLYMPUS_DEFINITION.groups.gOhm.id;

@Register.TokenPositionFetcher({
  appId,
  groupId,
  network,
})
export class EthereumOlympusGOhmTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(OlympusContractFactory) private readonly contractFactory: OlympusContractFactory,
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
  ) {}

  async getPositions() {
    return this.appToolkit.helpers.vaultTokenHelper.getTokens<OlympusGOhmToken>({
      appId: OLYMPUS_DEFINITION.id,
      groupId: OLYMPUS_DEFINITION.groups.gOhm.id,
      network: Network.ETHEREUM_MAINNET,
      dependencies: [{ appId, groupIds: [OLYMPUS_DEFINITION.groups.sOhm.id], network }],
      resolveVaultAddresses: () => ['0x0ab87046fbb341d058f17cbc4c1133f25a20a52f'], // gOHM
      resolveContract: ({ address, network }) => this.contractFactory.olympusGOhmToken({ address, network }),
      resolveUnderlyingTokenAddress: ({ contract, multicall }) => multicall.wrap(contract).sOHM(),
      resolvePricePerShare: async ({ multicall, contract, underlyingToken }) => {
        const oneOhm = BigNumber.from(1).mul(10).pow(underlyingToken.decimals);
        const [gOhmDecimalsRaw, gOhmConvertedAmountRaw] = await Promise.all([
          multicall.wrap(contract).decimals(),
          multicall.wrap(contract).balanceTo(oneOhm),
        ]);

        const convertedAmount = Number(gOhmConvertedAmountRaw) / 10 ** gOhmDecimalsRaw;
        const pricePerShare = 1 / convertedAmount;
        return pricePerShare;
      },
      resolveImages: () => [getAppImg(OLYMPUS_DEFINITION.id)],
      resolveReserve: ({ underlyingToken, network }) =>
        this.contractFactory
          .erc20({ address: underlyingToken.address, network })
          .balanceOf('0xb63cac384247597756545b500253ff8e607a8020')
          .then(v => Number(v) / 10 ** underlyingToken.decimals),
      resolvePrimaryLabel: ({ symbol }) => symbol,
    });
  }
}
