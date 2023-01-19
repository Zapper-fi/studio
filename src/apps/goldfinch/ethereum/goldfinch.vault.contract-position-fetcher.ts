import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { sumBy } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
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
    const MEMBERSHIP_ORCHESTRATOR = '0x4e5d9b093986d864331d88e0a13a616e1d508838';
    const FIDU = '0x6a445e9f40e0b97c92d0b8a3366cef1d67f700bf';
    const GFI = '0xdab396ccf3d84cf2d07c4454e10c8a6f5b008d2b';
    return [
      {
        address: MEMBERSHIP_ORCHESTRATOR,
        underlyingTokenAddress: GFI,
      },
      {
        address: MEMBERSHIP_ORCHESTRATOR,
        underlyingTokenAddress: FIDU,
      },
    ];
  }

  async getTokenDefinitions({ definition }: GetTokenDefinitionsParams<GoldfinchVault, GoldfinchVaultDefinition>) {
    const FIDU = '0x6a445e9f40e0b97c92d0b8a3366cef1d67f700bf';
    return [
      {
        metaType: MetaType.SUPPLIED,
        address: definition.underlyingTokenAddress,
        network: Network.ETHEREUM_MAINNET,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: FIDU,
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
    return `${getLabelFromToken(contractPosition.tokens[0])} Membership Vault`;
  }

  async getTokenBalancesPerPosition(): Promise<BigNumberish[]> {
    throw new Error('Method not implemented.');
  }

  async getBalances(address: string): Promise<ContractPositionBalance<GoldfinchVaultDataProps>[]> {
    // Membership = Total Capital in Vault (FIDU+PoolTokens) + Total GFI in Vault
    // Claimable = Claimable FIDU from Vault + @TODO Claimable GFI from StakedFIDU
    const GFI = '0xdab396ccf3d84cf2d07c4454e10c8a6f5b008d2b';
    const FIDU = '0x6a445e9f40e0b97c92d0b8a3366cef1d67f700bf';
    const SENIOR_POOL = '0x8481a6ebaf5c7dabc3f7e09e44a89531fd31f822';
    const multicall = this.appToolkit.getMulticall(this.network);
    const positions = await this.appToolkit.getAppContractPositions<GoldfinchVaultDataProps>({
      appId: this.appId,
      groupIds: [this.groupId],
      network: this.network,
    });

    const gfiPosition = positions.find(v => v.tokens[0].address === GFI);
    const fiduPosition = positions.find(v => v.tokens[0].address === FIDU);
    if (!gfiPosition || !fiduPosition) return [];

    const goldfinchVaultContract = this.contractFactory.goldfinchVault({
      address: fiduPosition.address,
      network: this.network,
    });

    // GFI
    const gfiBalanceRaw = await multicall.wrap(goldfinchVaultContract).totalGFIHeldBy(address); // denominated in gfi units
    const gfiTokens = [drillBalance(gfiPosition.tokens[0], gfiBalanceRaw.totalAmount.toString())];
    const gfiBalanceUSD = sumBy(gfiTokens, v => v.balanceUSD);
    const gfiContractPositionBalance = { ...gfiPosition, tokens: gfiTokens, balanceUSD: gfiBalanceUSD };

    // @TODO: this logic is incorrect, `totalCapitalHeldBy` is the USDC balance of the FIDU+PoolTokens at time of deposit, not the current value. This code also implies that it is always going to be FIDU, which is not the case. The future fix should 1) query CapitalLedger by owners 2) get balanceOf(owner) 3) tokenOfOwnerByIndex() then fetch positions 4) erc721IdOf returns tokenId 5) hit StakingRewards or PT for dollar balance
    // @TODO need to support showing each PoolTokens value
    // @TODO show claimable USDC for each PoolToken
    // @TODO need to support claimable GFI for each Staked FIDU position
    const seniorPoolContract = this.contractFactory.goldfinchSeniorPool({
      address: SENIOR_POOL,
      network: this.network,
    });
    const capitalBalanceRaw = await multicall.wrap(goldfinchVaultContract).totalCapitalHeldBy(address); // response denominated in USDC
    const fiduBalanceRaw = await multicall
      .wrap(seniorPoolContract)
      .getNumShares(capitalBalanceRaw.totalAmount.toString());
    const fiduTokens = [drillBalance(fiduPosition.tokens[0], fiduBalanceRaw.toString())];
    const fiduBalanceUSD = sumBy(fiduTokens, v => v.balanceUSD);
    const fiduContractPositionBalance = { ...fiduPosition, tokens: fiduTokens, balanceUSD: fiduBalanceUSD };

    // Claimable FIDU from MembershipVaults
    const claimableFIDU = await multicall.wrap(goldfinchVaultContract).claimableRewards(address);
    const claimableFiduTokens = [drillBalance(fiduPosition.tokens[1], claimableFIDU.toString())];
    const claimableFiduBalanceUSD = sumBy(claimableFiduTokens, v => v.balanceUSD);
    const claimableFiduContractPositionBalance = {
      ...fiduPosition,
      tokens: claimableFiduTokens,
      balanceUSD: claimableFiduBalanceUSD,
    };

    return [gfiContractPositionBalance, fiduContractPositionBalance, claimableFiduContractPositionBalance].filter(
      v => v.balanceUSD > 0,
    );
  }
}
