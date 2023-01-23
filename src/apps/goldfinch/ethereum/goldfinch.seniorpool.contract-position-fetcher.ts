import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { compact, sumBy } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType, Standard } from '~position/position.interface';
import { GetDisplayPropsParams, GetTokenDefinitionsParams } from '~position/template/contract-position.template.types';
import { CustomContractPositionTemplatePositionFetcher } from '~position/template/custom-contract-position.template.position-fetcher';
import { Network } from '~types';

import { GoldfinchContractFactory, GoldfinchSeniorPool } from '../contracts';

export type GoldfinchSeniorPoolDataProps = {
  assetStandard: Standard;
};

export type GoldfinchSeniorPoolDefinition = {
  address: string;
  underlyingTokenAddress: string;
};

@PositionTemplate()
export class EthereumGoldfinchSeniorPoolContractPositionFetcher extends CustomContractPositionTemplatePositionFetcher<
  GoldfinchSeniorPool,
  GoldfinchSeniorPoolDataProps,
  GoldfinchSeniorPoolDefinition
> {
  groupLabel = 'Senior Pool Withdrawals';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(GoldfinchContractFactory) protected readonly contractFactory: GoldfinchContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): GoldfinchSeniorPool {
    return this.contractFactory.goldfinchSeniorPool({ address, network: this.network });
  }

  async getDefinitions() {
    const SENIOR_POOL = '0x8481a6ebaf5c7dabc3f7e09e44a89531fd31f822';
    const FIDU = '0x6a445e9f40e0b97c92d0b8a3366cef1d67f700bf';
    const USDC = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';

    return [
      {
        address: SENIOR_POOL,
        underlyingTokenAddress: FIDU,
      },
      {
        address: SENIOR_POOL,
        underlyingTokenAddress: USDC,
      },
    ];
  }

  async getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<GoldfinchSeniorPool, GoldfinchSeniorPoolDefinition>) {
    const USDC = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';

    return [
      {
        metaType: MetaType.SUPPLIED,
        address: definition.underlyingTokenAddress, // FIDU
        network: Network.ETHEREUM_MAINNET,
      },
      {
        metaType: MetaType.CLAIMABLE,
        address: USDC,
        network: Network.ETHEREUM_MAINNET,
      },
    ];
  }

  async getDataProps() {
    return {
      assetStandard: Standard.ERC_721,
    };
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<GoldfinchSeniorPool>) {
    return `Senior Pool ${getLabelFromToken(contractPosition.tokens[0])}`;
  }

  async getTokenBalancesPerPosition(): Promise<BigNumberish[]> {
    throw new Error('Method not implemented.');
  }

  async getBalances(address: string): Promise<ContractPositionBalance<GoldfinchSeniorPoolDataProps>[]> {
    const SENIORPOOL_WITHDRAWAL_TOKEN = '0xc84d4a45d1d7eb307bbdea94b282bee9892bd523';
    const SENIOR_POOL = '0x8481a6ebaf5c7dabc3f7e09e44a89531fd31f822';
    const FIDU = '0x6a445e9f40e0b97c92d0b8a3366cef1d67f700bf';
    const USDC = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';

    const multicall = this.appToolkit.getMulticall(this.network);
    const positions = await this.appToolkit.getAppContractPositions<GoldfinchSeniorPoolDataProps>({
      appId: this.appId,
      groupIds: [this.groupId],
      network: this.network,
    });
    const usdcPosition = positions.find(v => v.tokens[0].address === USDC);
    const fiduPosition = positions.find(v => v.tokens[0].address === FIDU);
    if (!usdcPosition || !fiduPosition) return [];

    const goldfinchWithdrawalRequestTokenContract = this.contractFactory.goldfinchWithdrawalRequestToken({
      address: SENIORPOOL_WITHDRAWAL_TOKEN,
      network: this.network,
    });
    const goldfinchSeniorPoolContract = this.contractFactory.goldfinchSeniorPool({
      address: SENIOR_POOL,
      network: this.network,
    });

    // get balance of user
    const balanceRaw = await multicall.wrap(goldfinchWithdrawalRequestTokenContract).balanceOf(address);
    const balance = Number(balanceRaw);
    if (balance === 0) return [];

    // get withdrawal token id of user
    const tokenId = await multicall.wrap(goldfinchWithdrawalRequestTokenContract).tokenOfOwnerByIndex(address, 0);

    const positionData = await multicall.wrap(goldfinchSeniorPoolContract).withdrawalRequest(tokenId);

    // get FIDU amount supplied
    const suppliedFIDU = [drillBalance(fiduPosition.tokens[0], positionData.fiduRequested.toString())];
    const suppliedFiduBalanceUSD = sumBy(suppliedFIDU, v => v.balanceUSD);
    const suppliedFiduContractPositionBalance = {
      ...usdcPosition,
      tokens: suppliedFIDU,
      balanceUSD: suppliedFiduBalanceUSD,
    };

    // check if they have claimable usdc
    const claimableUsdcTokens = [drillBalance(usdcPosition.tokens[1], positionData.usdcWithdrawable.toString())];
    const claimableUsdcBalanceUSD = sumBy(claimableUsdcTokens, v => v.balanceUSD);
    const claimableUsdcContractPositionBalance = {
      ...usdcPosition,
      tokens: claimableUsdcTokens,
      balanceUSD: claimableUsdcBalanceUSD,
    };

    return compact([suppliedFiduContractPositionBalance, claimableUsdcContractPositionBalance]).filter(
      v => v.balanceUSD > 0,
    );
  }
}
