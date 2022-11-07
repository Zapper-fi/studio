import { Inject, Injectable } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  GetTokenDefinitionsParams,
  GetDisplayPropsParams,
  GetDataPropsParams,
} from '~position/template/contract-position.template.types';
import { Network } from '~types/network.interface';

import { QiDaoContractFactory } from '../contracts';
import { QiDaoAnchorVault } from '../contracts/ethers/QiDaoAnchorVault';
import { QI_DAO_DEFINITION } from '../qi-dao.definition';

type QiDaoAnchorVaultDataProps = {
  liquidity: number;
  reserves: number[];
};

type QiDaoAnchorVaultDefinition = {
  address: string;
  tokenAddress: string;
};

@Injectable()
export class PolygonQiDaoAnchorVaultPositionFetcher extends ContractPositionTemplatePositionFetcher<
  QiDaoAnchorVault,
  QiDaoAnchorVaultDataProps,
  QiDaoAnchorVaultDefinition
> {
  appId = QI_DAO_DEFINITION.id;
  groupId = QI_DAO_DEFINITION.groups.anchorVault.id;
  network = Network.POLYGON_MAINNET;
  groupLabel = 'Anchor Vaults';

  isExcludedFromBalances = true;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(QiDaoContractFactory) protected readonly contractFactory: QiDaoContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): QiDaoAnchorVault {
    return this.contractFactory.qiDaoAnchorVault({ address, network: this.network });
  }

  async getDefinitions() {
    return [
      {
        address: '0x947d711c25220d8301c087b25ba111fe8cbf6672',
        tokenAddress: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', // USDC
      },
      {
        address: '0xa4742a65f24291aa421497221aaf64c70b098d98',
        tokenAddress: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f', //USDT
      },
      {
        address: '0x6062e92599a77e62e0cc9749261eb2eac3abd44f',
        tokenAddress: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063', //DAI
      },
    ];
  }

  async getTokenDefinitions({ definition }: GetTokenDefinitionsParams<QiDaoAnchorVault, QiDaoAnchorVaultDefinition>) {
    return [{ metaType: MetaType.SUPPLIED, address: definition.tokenAddress }];
  }

  async getDataProps({
    contractPosition,
  }: GetDataPropsParams<
    QiDaoAnchorVault,
    QiDaoAnchorVaultDataProps,
    QiDaoAnchorVaultDefinition
  >): Promise<QiDaoAnchorVaultDataProps> {
    const underlyingToken = contractPosition.tokens[0];
    const contract = this.contractFactory.erc20({ address: underlyingToken.address, network: this.network });
    const reserveRaw = await contract.balanceOf(contractPosition.address);
    const reserve = Number(reserveRaw) / 10 ** underlyingToken?.decimals;
    const liquidity = reserve * underlyingToken.price;
    return { liquidity, reserves: [reserve] };
  }

  async getLabel({
    contractPosition,
  }: GetDisplayPropsParams<QiDaoAnchorVault, QiDaoAnchorVaultDataProps, QiDaoAnchorVaultDefinition>) {
    return `${getLabelFromToken(contractPosition.tokens[0])} Anchor Vault`;
  }

  async getTokenBalancesPerPosition() {
    return [0];
  }
}
