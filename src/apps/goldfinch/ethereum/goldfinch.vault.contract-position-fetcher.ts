import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { sumBy } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType, Standard } from '~position/position.interface';
import { GetDisplayPropsParams, GetTokenDefinitionsParams } from '~position/template/contract-position.template.types';
import { CustomContractPositionTemplatePositionFetcher } from '~position/template/custom-contract-position.template.position-fetcher';
import { Network } from '~types';

import { GoldfinchContractFactory, GoldfinchVault } from '../contracts';

export type GoldfinchVaultDataProps = {
  assetStandard: Standard;
};

export type GoldfinchVaultDefinition = {
  address: string;
  underlyingTokenAddress: string;
};

@PositionTemplate()
export class EthereumGoldfinchVaultContractPositionFetcher extends CustomContractPositionTemplatePositionFetcher<
  GoldfinchVault,
  GoldfinchVaultDataProps,
  GoldfinchVaultDefinition
> {
  groupLabel = 'Membership';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(GoldfinchContractFactory) protected readonly contractFactory: GoldfinchContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): GoldfinchVault {
    return this.contractFactory.goldfinchVault({ address, network: this.network });
  }

  async getDefinitions() {
    return [
      {
        address: '0x4e5d9b093986d864331d88e0a13a616e1d508838',
        underlyingTokenAddress: '0xdab396ccf3d84cf2d07c4454e10c8a6f5b008d2b', // GFI
      },
      {
        address: '0x4e5d9b093986d864331d88e0a13a616e1d508838',
        underlyingTokenAddress: '0x6a445e9f40e0b97c92d0b8a3366cef1d67f700bf', // FIDU
      },
    ];
  }

  async getTokenDefinitions({ definition }: GetTokenDefinitionsParams<GoldfinchVault, GoldfinchVaultDefinition>) {
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: definition.underlyingTokenAddress,
        network: Network.ETHEREUM_MAINNET,
      },
    ];
  }

  async getDataProps() {
    return {
      assetStandard: Standard.ERC_721,
    };
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<GoldfinchVault>) {
    return `${getLabelFromToken(contractPosition.tokens[0])} Vault`;
  }

  async getTokenBalancesPerPosition(): Promise<BigNumberish[]> {
    throw new Error('Method not implemented.');
  }

  async getBalances(address: string): Promise<ContractPositionBalance<GoldfinchVaultDataProps>[]> {
    const multicall = this.appToolkit.getMulticall(this.network);
    const positions = await this.appToolkit.getAppContractPositions<GoldfinchVaultDataProps>({
      appId: this.appId,
      groupIds: [this.groupId],
      network: this.network,
    });

    const gfiPosition = positions.find(v => v.tokens[0].address === '0xdab396ccf3d84cf2d07c4454e10c8a6f5b008d2b');
    const fiduPosition = positions.find(v => v.tokens[0].address === '0x6a445e9f40e0b97c92d0b8a3366cef1d67f700bf');
    if (!gfiPosition || !fiduPosition) return [];

    const contract = this.contractFactory.goldfinchVault({ address: fiduPosition.address, network: this.network });
    const gfiBalanceRaw = await multicall.wrap(contract).totalGFIHeldBy(address);
    const capitalBalanceRaw = await multicall.wrap(contract).totalCapitalHeldBy(address);

    const gfiTokens = [drillBalance(gfiPosition.tokens[0], gfiBalanceRaw.totalAmount.toString())];
    const gfiBalanceUSD = sumBy(gfiTokens, v => v.balanceUSD);
    const gfiContractPositionBalance = { ...gfiPosition, tokens: gfiTokens, balanceUSD: gfiBalanceUSD };

    const seniorPoolAdress = '0x8481a6ebaf5c7dabc3f7e09e44a89531fd31f822';
    const seniorPool = this.contractFactory.goldfinchSeniorPool({ address: seniorPoolAdress, network: this.network });
    const fiduBalanceRaw = await multicall.wrap(seniorPool).getNumShares(capitalBalanceRaw.totalAmount.toString());
    const fiduTokens = [drillBalance(fiduPosition.tokens[0], fiduBalanceRaw.toString())];
    const fiduBalanceUSD = sumBy(fiduTokens, v => v.balanceUSD);
    const fiduContractPositionBalance = { ...fiduPosition, tokens: fiduTokens, balanceUSD: fiduBalanceUSD };

    return [gfiContractPositionBalance, fiduContractPositionBalance].filter(v => v.balanceUSD > 0);
  }
}
