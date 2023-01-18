import { Inject } from '@nestjs/common';
import { BigNumberish } from 'ethers';
import { compact, range, sumBy } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { drillBalance } from '~app-toolkit/helpers/drill-balance.helper';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType, Standard } from '~position/position.interface';
import { GetDisplayPropsParams, GetTokenDefinitionsParams } from '~position/template/contract-position.template.types';
import { CustomContractPositionTemplatePositionFetcher } from '~position/template/custom-contract-position.template.position-fetcher';
import { Network } from '~types';

import { GoldfinchContractFactory, GoldfinchSeniorBond } from '../contracts';

export type GoldfinchSeniorBondDataProps = {
  assetStandard: Standard;
};

export type GoldfinchSeniorBondDefinition = {
  address: string;
  underlyingTokenAddress: string;
};

@PositionTemplate()
export class EthereumGoldfinchSeniorBondContractPositionFetcher extends CustomContractPositionTemplatePositionFetcher<
  GoldfinchSeniorBond,
  GoldfinchSeniorBondDataProps,
  GoldfinchSeniorBondDefinition
> {
  groupLabel = 'Staking';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(GoldfinchContractFactory) protected readonly contractFactory: GoldfinchContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): GoldfinchSeniorBond {
    return this.contractFactory.goldfinchSeniorBond({ address, network: this.network });
  }

  async getDefinitions() {
    return [
      {
        address: '0xfd6ff39da508d281c2d255e9bbbfab34b6be60c3',
        underlyingTokenAddress: '0x6a445e9f40e0b97c92d0b8a3366cef1d67f700bf', // FIDU
      },
      {
        address: '0xfd6ff39da508d281c2d255e9bbbfab34b6be60c3',
        underlyingTokenAddress: '0x42ec68ca5c2c80036044f3eead675447ab3a8065', // Curve FIDU / USDC
      },
    ];
  }

  async getTokenDefinitions({
    definition,
  }: GetTokenDefinitionsParams<GoldfinchSeniorBond, GoldfinchSeniorBondDefinition>) {
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

  async getLabel({ contractPosition }: GetDisplayPropsParams<GoldfinchSeniorBond>) {
    return `Staked ${getLabelFromToken(contractPosition.tokens[0])}`;
  }

  async getTokenBalancesPerPosition(): Promise<BigNumberish[]> {
    throw new Error('Method not implemented.');
  }

  async getBalances(address: string): Promise<ContractPositionBalance<GoldfinchSeniorBondDataProps>[]> {
    const multicall = this.appToolkit.getMulticall(this.network);
    const positions = await this.appToolkit.getAppContractPositions<GoldfinchSeniorBondDataProps>({
      appId: this.appId,
      groupIds: [this.groupId],
      network: this.network,
    });

    const fiduPosition = positions.find(v => v.tokens[0].address === '0x6a445e9f40e0b97c92d0b8a3366cef1d67f700bf');
    const fiduUsdcPosition = positions.find(v => v.tokens[0].address === '0x42ec68ca5c2c80036044f3eead675447ab3a8065');
    if (!fiduPosition || !fiduUsdcPosition) return [];

    const contract = this.contractFactory.goldfinchSeniorBond({ address: fiduPosition.address, network: this.network });
    const balanceRaw = await multicall.wrap(contract).balanceOf(address);
    const balance = Number(balanceRaw);
    if (balance === 0) return [];

    const positionBalances = await Promise.all(
      range(0, balance).map(async i => {
        const tokenId = await multicall.wrap(contract).tokenOfOwnerByIndex(address, i);
        const positionData = await multicall.wrap(contract).positions(tokenId);
        if (positionData.positionType !== 0 && positionData.positionType !== 1) return null;

        const position = positionData.positionType === 0 ? fiduPosition : fiduUsdcPosition;
        const tokens = [drillBalance(position.tokens[0], positionData.amount.toString())];
        const balanceUSD = sumBy(tokens, v => v.balanceUSD);

        const positionBalance: ContractPositionBalance<GoldfinchSeniorBondDataProps> = {
          ...position,
          tokens,
          balanceUSD,
        };

        return positionBalance;
      }),
    );

    return compact(positionBalances).filter(v => v.balanceUSD > 0);
  }
}
