import { Inject } from '@nestjs/common';
import { compact } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { OLYMPUS_DEFINITION } from '~apps/olympus';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { JonesDaoContractFactory } from '../contracts';
import { JONES_DAO_DEFINITION } from '../jones-dao.definition';

const vaults = [
  {
    vaultTokenAddress: '0x662d0f9ff837a51cf89a1fe7e0882a906dac08a3', // jETH
    underlyingTokenAddress: ZERO_ADDRESS,
  },
  {
    vaultTokenAddress: '0x5375616bb6c52a90439ff96882a986d8fcdce421', // jgOHM
    underlyingTokenAddress: '0x8d9ba570d6cb60c7e3e0f31343efe75ab8e65fb1', // gOHM
  },
  {
    vaultTokenAddress: '0xf018865b26ffab9cd1735dcca549d95b0cb9ea19', // jDPX
    underlyingTokenAddress: '0x6c2c06790b3e3e3c38e12ee22f8183b37a13ee55', // DPX
  },
  {
    vaultTokenAddress: '0x1f6fa7a58701b3773b08a1a16d06b656b0eccb23', // jrDPX
    underlyingTokenAddress: '0x32eb7902d4134bf98a28b963d26de779af92a212', // rDPX
  },
];

const appId = JONES_DAO_DEFINITION.id;
const groupId = JONES_DAO_DEFINITION.groups.vault.id;
const network = Network.ARBITRUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class ArbitrumJonesDaoVaultTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(JonesDaoContractFactory) private readonly contractFactory: JonesDaoContractFactory,
  ) {}

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);

    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const appTokens = await this.appToolkit.getAppTokenPositions({
      appId: OLYMPUS_DEFINITION.id,
      groupIds: [OLYMPUS_DEFINITION.groups.gOhm.id],
      network,
    });
    const allTokens = [...appTokens, ...baseTokens];

    const tokens = await Promise.all(
      vaults.flatMap(async ({ vaultTokenAddress, underlyingTokenAddress }) => {
        const vaultTokenContract = this.contractFactory.jonesAsset({ network, address: vaultTokenAddress });

        const [symbol, decimals, supplyRaw] = await Promise.all([
          multicall.wrap(vaultTokenContract).symbol(),
          multicall.wrap(vaultTokenContract).decimals(),
          multicall.wrap(vaultTokenContract).totalSupply(),
        ]);

        const underlyingToken = allTokens.find(p => p.address === underlyingTokenAddress);
        if (!underlyingToken) return null;

        const supply = Number(supplyRaw) / 10 ** decimals;
        const pricePerShare = 1;
        const price = underlyingToken.price;
        const liquidity = price * supply;
        const tokens = [underlyingToken];

        // Display Props
        const label = symbol;
        const secondaryLabel = buildDollarDisplayItem(price);
        const images = getImagesFromToken(underlyingToken);
        const statsItems = [{ label: 'Liquidity', value: buildDollarDisplayItem(liquidity) }];

        const vaultToken: AppTokenPosition = {
          type: ContractType.APP_TOKEN,
          address: vaultTokenAddress,
          network,
          appId,
          groupId,
          symbol,
          decimals,
          supply,
          price,
          pricePerShare,
          tokens,

          dataProps: {
            liquidity,
          },

          displayProps: {
            label,
            secondaryLabel,
            images,
            statsItems,
          },
        };

        return vaultToken;
      }),
    );

    return compact(tokens);
  }
}
