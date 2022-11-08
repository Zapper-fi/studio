import { Inject, Injectable, NotImplementedException } from '@nestjs/common';
import { range, sumBy } from 'lodash';

import { drillBalance } from '~app-toolkit';
import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { isMulticallUnderlyingError } from '~multicall/multicall.ethers';
import { ContractPositionBalance } from '~position/position-balance.interface';
import { MetaType, Standard } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetTokenDefinitionsParams,
  GetDisplayPropsParams,
  GetDataPropsParams,
} from '~position/template/contract-position.template.types';

import { QiDaoContractFactory, QiDaoVaultNft } from '../contracts';

type QiDaoVaultDataProps = {
  liquidity: number;
  assetStandard: Standard;
  vaultInfoAddress: string;
  tokenId?: string;
};

type QiDaoVaultDefinition = {
  address: string;
  vaultInfoAddress: string;
};

@Injectable()
export abstract class QiDaoVaultContractPositionFetcher extends ContractPositionTemplatePositionFetcher<
  QiDaoVaultNft,
  QiDaoVaultDataProps,
  QiDaoVaultDefinition
> {
  abstract vaultDefinitions: QiDaoVaultDefinition[];

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(QiDaoContractFactory) protected readonly contractFactory: QiDaoContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): QiDaoVaultNft {
    return this.contractFactory.qiDaoVaultNft({ address, network: this.network });
  }

  async getDefinitions(): Promise<QiDaoVaultDefinition[]> {
    return this.vaultDefinitions;
  }

  async getTokenDefinitions({ definition, multicall }: GetTokenDefinitionsParams<QiDaoVaultNft, QiDaoVaultDefinition>) {
    const infoContract = this.contractFactory.qiDaoVaultInfo({
      address: definition.vaultInfoAddress,
      network: this.network,
    });

    const [collateralTokenAddressRaw, debtTokenAddressRaw] = await Promise.all([
      multicall
        .wrap(infoContract)
        .collateral()
        .catch(err => {
          if (isMulticallUnderlyingError(err)) return null;
          throw err;
        }),
      multicall
        .wrap(infoContract)
        .mai()
        .catch(err => {
          if (isMulticallUnderlyingError(err)) return null;
          throw err;
        }),
    ]);

    if (!collateralTokenAddressRaw || !debtTokenAddressRaw) return null;

    return [
      { metaType: MetaType.SUPPLIED, address: collateralTokenAddressRaw.toLowerCase() },
      { metaType: MetaType.BORROWED, address: debtTokenAddressRaw.toLowerCase() },
    ];
  }

  async getDataProps({
    contractPosition,
    multicall,
    definition,
  }: GetDataPropsParams<QiDaoVaultNft, QiDaoVaultDataProps, QiDaoVaultDefinition>): Promise<QiDaoVaultDataProps> {
    const vaultInfoAddress = definition.vaultInfoAddress;
    const collateralToken = contractPosition.tokens[0];
    const collateralTokenContract = this.contractFactory.erc20({
      address: collateralToken.address,
      network: this.network,
    });

    const reserveRaw = await (contractPosition.tokens[0].address === ZERO_ADDRESS
      ? multicall.wrap(multicall.contract).getEthBalance(contractPosition.address)
      : multicall.wrap(collateralTokenContract).balanceOf(contractPosition.address));

    const reserve = Number(reserveRaw) / 10 ** collateralToken.decimals;
    const liquidity = reserve * collateralToken.price;

    return {
      assetStandard: Standard.ERC_721,
      liquidity,
      vaultInfoAddress,
    };
  }

  async getLabel({ contractPosition }: GetDisplayPropsParams<QiDaoVaultNft>) {
    return `${getImagesFromToken(contractPosition.tokens[0])} Vault`;
  }

  // @ts-ignore
  async getTokenBalancesPerPosition() {
    throw new NotImplementedException();
  }

  async getBalances(address: string): Promise<ContractPositionBalance<QiDaoVaultDataProps>[]> {
    const multicall = this.appToolkit.getMulticall(this.network);
    const contractPositions = await this.appToolkit.getAppContractPositions<QiDaoVaultDataProps>({
      appId: this.appId,
      network: this.network,
      groupIds: [this.groupId],
    });

    const positionsAll = await Promise.all(
      contractPositions.map(async contractPosition => {
        const vaultNftContract = this.contractFactory.qiDaoVaultNft({
          address: contractPosition.address,
          network: this.network,
        });

        const vaultInfoContract = this.contractFactory.qiDaoVaultInfo({
          address: contractPosition.dataProps.vaultInfoAddress,
          network: this.network,
        });

        const numOfVaults = await multicall.wrap(vaultNftContract).balanceOf(address).then(Number);
        if (numOfVaults === 0) return [];

        const tokenIds = await Promise.all(
          range(0, numOfVaults).map(i => multicall.wrap(vaultNftContract).tokenOfOwnerByIndex(address, i)),
        );

        const positionBalances = await Promise.all(
          tokenIds.map(async tokenId => {
            const balancesRaw = await Promise.all([
              multicall.wrap(vaultInfoContract).vaultCollateral(tokenId),
              multicall.wrap(vaultInfoContract).vaultDebt(tokenId),
            ]);

            const allTokens = contractPosition.tokens.map((cp, idx) =>
              drillBalance(cp, balancesRaw[idx]?.toString() ?? '0', { isDebt: cp.metaType === MetaType.BORROWED }),
            );

            const tokens = allTokens.filter(v => Math.abs(v.balanceUSD) > 0.01);
            const balanceUSD = sumBy(tokens, t => t.balanceUSD);
            const dataProps = { ...contractPosition.dataProps, tokenId: tokenId.toString() };
            const balance: ContractPositionBalance<QiDaoVaultDataProps> = {
              ...contractPosition,
              dataProps,
              tokens,
              balanceUSD,
            };

            balance.key = this.appToolkit.getPositionKey(balance, ['tokenId']);
            return balance;
          }),
        );

        return positionBalances;
      }),
    );

    return positionsAll.flat();
  }
}
