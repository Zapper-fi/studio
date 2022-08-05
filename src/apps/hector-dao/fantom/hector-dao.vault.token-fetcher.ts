import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { HectorDaoContractFactory } from '../contracts';
import { HECTOR_DAO_DEFINITION } from '../hector-dao.definition';

const HECTORDAO_ADDRESS = '0x5c4fdfc5233f935f20d2adba572f770c2e377ab0';
const STAKED_HECTORDAO_ADDRESS_V1 = '0x36f26880c6406b967bdb9901cde43abc9d53f106';
const STAKED_HECTORDAO_ADDRESS_V2 = '0x75bdef24285013387a47775828bec90b91ca9a5f';
const STAKED_HECTORDAO_DEPOSIT_ADDRESS_V1 = '0x9ae7972ba46933b3b20aae7acbf6c311847aca40';
const STAKED_HECTORDAO_DEPOSIT_ADDRESS_V2 = '0xd12930c8deedafd788f437879cba1ad1e3908cc5';
const WRAPPED_STAKED_HECTORDAO_ADDRESS = '0x94ccf60f700146bea8ef7832820800e2dfa92eda';

const appId = HECTOR_DAO_DEFINITION.id;
const groupId = HECTOR_DAO_DEFINITION.groups.vault.id;
const network = Network.FANTOM_OPERA_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class FantomHectorDaoVaultTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(HectorDaoContractFactory)
    private readonly hectorContractFactory: HectorDaoContractFactory,
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
  ) {}

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);
    const tokenSelector = this.appToolkit.getBaseTokenPriceSelector({ tags: { network, appId } });
    const baseTokens = await tokenSelector.getAll({ network });
    const allTokens = [...baseTokens];

    const hectorDaoToken = allTokens.find(p => p.address === HECTORDAO_ADDRESS)!;

    const hectorDaoTokenContract = this.hectorContractFactory.erc20({ network, address: hectorDaoToken.address });
    const sHectorTokenContractV1 = this.hectorContractFactory.hectorDaoStaked({
      network,
      address: STAKED_HECTORDAO_ADDRESS_V1,
    });
    const sHectorTokenContractV2 = this.hectorContractFactory.hectorDaoStaked({
      network,
      address: STAKED_HECTORDAO_ADDRESS_V2,
    });
    const wsHectorTokenContract = this.hectorContractFactory.erc20({
      network,
      address: WRAPPED_STAKED_HECTORDAO_ADDRESS,
    });

    const [
      sHectorDecimalsRawV1,
      sHectorSymbolV1,
      sHectorSupplyRawV1,
      hectorInSHectorRawV1,

      sHectorDecimalsRawV2,
      sHectorSymbolV2,
      sHectorSupplyRawV2,
      hectorInSHectorRawV2,

      wsHectorDecimalsRaw,
      wsHectorSymbol,
      wsHectorSupplyRaw,
      sHectorInWsHectorRaw,
    ] = await Promise.all([
      multicall.wrap(sHectorTokenContractV1).decimals(),
      multicall.wrap(sHectorTokenContractV1).symbol(),
      multicall.wrap(sHectorTokenContractV1).circulatingSupply(),
      multicall.wrap(hectorDaoTokenContract).balanceOf(STAKED_HECTORDAO_DEPOSIT_ADDRESS_V1),

      multicall.wrap(sHectorTokenContractV2).decimals(),
      multicall.wrap(sHectorTokenContractV2).symbol(),
      multicall.wrap(sHectorTokenContractV2).circulatingSupply(),
      multicall.wrap(hectorDaoTokenContract).balanceOf(STAKED_HECTORDAO_DEPOSIT_ADDRESS_V2),

      multicall.wrap(wsHectorTokenContract).decimals(),
      multicall.wrap(wsHectorTokenContract).symbol(),
      multicall.wrap(wsHectorTokenContract).totalSupply(),
      multicall.wrap(sHectorTokenContractV2).balanceOf(WRAPPED_STAKED_HECTORDAO_ADDRESS),
    ]);

    // sHectorV1
    const sHectorSupplyV1 = Number(sHectorSupplyRawV1) / 10 ** sHectorDecimalsRawV1;
    const sHectorPricePerShareV1 = 1;
    const sHectorPriceV1 = Number(sHectorPricePerShareV1) * hectorDaoToken.price;
    const sHectorPricePerShareLiquidityV1 = sHectorSupplyV1 * sHectorPriceV1;
    const hectorInSHectorV1 = Number(hectorInSHectorRawV1) / 10 ** hectorDaoToken.decimals;
    const sHectorUnderlyingTokenV1 = { ...hectorDaoToken, reserve: hectorInSHectorV1 };
    const sHectorTokensV1 = [sHectorUnderlyingTokenV1];

    // sHectorV2
    const sHectorSupplyV2 = Number(sHectorSupplyRawV2) / 10 ** sHectorDecimalsRawV2;
    const sHectorPricePerShareV2 = 1;
    const sHectorPriceV2 = Number(sHectorPricePerShareV2) * hectorDaoToken.price;
    const sHectorPricePerShareLiquidityV2 = sHectorSupplyV2 * sHectorPriceV2;
    const hectorInSHectorV2 = Number(hectorInSHectorRawV2) / 10 ** hectorDaoToken.decimals;
    const sHectorUnderlyingTokenV2 = { ...hectorDaoToken, reserve: hectorInSHectorV2 };
    const sHectorTokensV2 = [sHectorUnderlyingTokenV2];

    // Display properties
    const sHectorLabelV1 = 'Staked HEC V1';
    const sHectorSecondaryLabelV1 = buildDollarDisplayItem(sHectorPriceV1);
    const sHectorImagesV1 = [getTokenImg(hectorDaoToken.address, network)];

    const sHectorLabelV2 = 'Staked HEC V2';
    const sHectorSecondaryLabelV2 = buildDollarDisplayItem(sHectorPriceV2);
    const sHectorImagesV2 = [getTokenImg(hectorDaoToken.address, network)];

    const stakeHectorV1: AppTokenPosition = {
      type: ContractType.APP_TOKEN,
      address: STAKED_HECTORDAO_ADDRESS_V1,
      network,
      appId,
      groupId,
      symbol: sHectorSymbolV1,
      decimals: sHectorDecimalsRawV1,
      supply: sHectorSupplyV1,
      price: sHectorPriceV1,
      pricePerShare: sHectorPricePerShareV1,
      tokens: sHectorTokensV1,

      dataProps: {
        liquidity: sHectorPricePerShareLiquidityV1,
      },

      displayProps: {
        label: sHectorLabelV1,
        secondaryLabel: sHectorSecondaryLabelV1,
        images: sHectorImagesV1,
        statsItems: [{ label: 'Liquidity', value: buildDollarDisplayItem(sHectorPricePerShareLiquidityV1) }],
      },
    };

    const stakeHectorV2: AppTokenPosition = {
      type: ContractType.APP_TOKEN,
      address: STAKED_HECTORDAO_ADDRESS_V2,
      network,
      appId,
      groupId,
      symbol: sHectorSymbolV2,
      decimals: sHectorDecimalsRawV2,
      supply: sHectorSupplyV2,
      price: sHectorPriceV2,
      pricePerShare: sHectorPricePerShareV2,
      tokens: sHectorTokensV2,

      dataProps: {
        liquidity: sHectorPricePerShareLiquidityV2,
      },

      displayProps: {
        label: sHectorLabelV2,
        secondaryLabel: sHectorSecondaryLabelV2,
        images: sHectorImagesV2,
        statsItems: [{ label: 'Liquidity', value: buildDollarDisplayItem(sHectorPricePerShareLiquidityV2) }],
      },
    };

    // wsHector
    const wsHectorSupply = Number(wsHectorSupplyRaw) / 10 ** wsHectorDecimalsRaw;
    const wsHectorReserve = Number(sHectorInWsHectorRaw) / 10 ** sHectorDecimalsRawV2;
    const wsHectorPricePerShare = wsHectorReserve / wsHectorSupply;
    const wsHectorPrice = Number(wsHectorPricePerShare) * hectorDaoToken.price;
    const wsHectorUnderlyingToken = { ...stakeHectorV2, reserve: wsHectorReserve };
    const wsHectorTokens = [wsHectorUnderlyingToken];

    const wsHectorLabel = 'Wrapped sHEC';
    const wsHectorSecondaryLabel = buildDollarDisplayItem(wsHectorPrice);
    const wsHectorImages = [getTokenImg(hectorDaoToken.address, network)];

    const wrappedStakedHector: AppTokenPosition = {
      type: ContractType.APP_TOKEN,
      address: WRAPPED_STAKED_HECTORDAO_ADDRESS,
      network,
      appId,
      groupId,
      symbol: wsHectorSymbol,
      decimals: wsHectorDecimalsRaw,
      supply: wsHectorSupply,
      price: wsHectorPrice,
      pricePerShare: wsHectorPricePerShare,
      tokens: wsHectorTokens,

      dataProps: {
        exchangeable: true,
      },

      displayProps: {
        label: wsHectorLabel,
        secondaryLabel: wsHectorSecondaryLabel,
        images: wsHectorImages,
      },
    };

    return [stakeHectorV1, stakeHectorV2, wrappedStakedHector];
  }
}
