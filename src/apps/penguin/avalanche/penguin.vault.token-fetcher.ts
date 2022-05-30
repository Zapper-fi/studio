import { Inject } from '@nestjs/common';
import { compact } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types';

import { PenguinContractFactory } from '../contracts';
import { PENGUIN_DEFINITION } from '../penguin.definition';

type PenguinVaultTokenDataProps = {
  liquidity: number;
};

const VAULTS = [
  '0xab6eed788beed09d1279b21b6c91f9750242e0f5',
  '0xbbd9dd1f15c729745edffd8e46253463d40a7d84',
  '0x323c5cc630c0ce1f2823d1a3d48260f770b5669b',
  '0xb6cd0569563549033c129769dbc58d1843ed98cb',
  '0x9acbca2315a517a3dab8e857f5921a8b3435891a',
  '0xdf5fb3fa0161a8508599a6dfc9d6c004cb58652b',
  '0x1ad8ff956247f87de904f31b0322843f32f19a5c',
  '0xbe42a57f4a08636c26457475e94409516fa39b3b',
  '0xfc8deac2f93e5b4739ece2802e5c5e05106fd872',
  '0xc90b9a965c800a0318ec4282a86e387beeef0ffe',
  '0xb4558486cd8fd2dd5e3b078e7822c1bb66c782d0',
  '0x85fc4ec9dee0df5060f321b743838f7068499177',
  '0xd6da9d000ffa1ea6d3939fcd80f4d473f2027567',
  '0x4ec41d1e25925c57876885c34fe0b323d7cc3846',
  '0x7dd48db5372539d01ed4b6cc525403d98bc61bdd',
  '0x21d2aaed1d2f5e36ff02b008b091054d065c9824',
];

@Register.TokenPositionFetcher({
  appId: PENGUIN_DEFINITION.id,
  groupId: PENGUIN_DEFINITION.groups.vault.id,
  network: Network.AVALANCHE_MAINNET,
})
export class AvalanchePenguinVaultTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(PenguinContractFactory) private readonly contractFactory: PenguinContractFactory,
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
  ) {}

  async getPositions() {
    const network = Network.AVALANCHE_MAINNET;
    const multicall = this.appToolkit.getMulticall(network);

    const appTokens = await this.appToolkit.getAppTokenPositions(
      { appId: 'lydia', groupIds: ['pool'], network },
      { appId: 'pangolin', groupIds: ['pool'], network },
    );

    const vaultTokens = await Promise.all(
      VAULTS.map(async vaultAddress => {
        const vaultContract = this.contractFactory.penguinVault({ network, address: vaultAddress });

        const [symbol, decimals, supplyRaw, depositTokenAddressRaw, reserveRaw] = await Promise.all([
          multicall.wrap(vaultContract).symbol(),
          multicall.wrap(vaultContract).decimals(),
          multicall.wrap(vaultContract).totalSupply(),
          multicall.wrap(vaultContract).depositToken(),
          multicall.wrap(vaultContract).totalDeposits(),
        ]);

        const depositTokenAddress = depositTokenAddressRaw.toLowerCase();
        const underlyingToken = appTokens.find(t => t.address === depositTokenAddress);
        if (!underlyingToken) return null;

        const supply = Number(supplyRaw) / 10 ** 18;
        const reserve = Number(reserveRaw) / 10 ** underlyingToken.decimals;
        const liquidity = reserve * underlyingToken.price;
        const price = liquidity / supply;
        const pricePerShare = price / underlyingToken.price;
        const tokens = [underlyingToken];

        // Display Props
        const label = `${underlyingToken.displayProps.label} Penguin Compounder`;
        const secondaryLabel = buildDollarDisplayItem(price);
        const images = underlyingToken.displayProps.images;

        const vaultToken: AppTokenPosition<PenguinVaultTokenDataProps> = {
          type: ContractType.APP_TOKEN,
          appId: PENGUIN_DEFINITION.id,
          groupId: PENGUIN_DEFINITION.groups.vault.id,
          network: Network.AVALANCHE_MAINNET,
          address: vaultAddress,
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
          },
        };

        return vaultToken;
      }),
    );

    return compact(vaultTokens);
  }
}
