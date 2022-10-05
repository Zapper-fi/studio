import { Inject } from '@nestjs/common';
import { compact, isArray, sortBy } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { UniswapV3LiquidityContractPositionBuilder } from '~apps/uniswap-v3/common/uniswap-v3.liquidity.contract-position-builder';
import { isMulticallUnderlyingError } from '~multicall/multicall.ethers';
import { ContractType } from '~position/contract.interface';
import { DefaultDataProps } from '~position/display.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDataPropsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { PickleContractFactory, PickleJarUniv3 } from '../contracts';

import { PickleApiJarRegistry } from './pickle.api.jar-registry';

export abstract class PickleJarUniv3TokenFetcher extends AppTokenTemplatePositionFetcher<PickleJarUniv3> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PickleContractFactory) protected readonly contractFactory: PickleContractFactory,
    @Inject(PickleApiJarRegistry) protected readonly jarRegistry: PickleApiJarRegistry,
    @Inject(UniswapV3LiquidityContractPositionBuilder)
    private readonly uniswapV3LiquidityContractPositionBuilder: UniswapV3LiquidityContractPositionBuilder,
  ) {
    super(appToolkit);
  }

  getContract(address: string): PickleJarUniv3 {
    return this.contractFactory.pickleJarUniv3({ address, network: this.network });
  }

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(this.network);
    const tokenLoader = this.appToolkit.getTokenDependencySelector({
      tags: { network: this.network, context: `${this.appId}__template` },
    });

    const definitions = await this.getDefinitions({ multicall, tokenLoader });
    const addressesRaw = await this.getAddresses();
    const addresses = addressesRaw.map(x => x.toLowerCase());

    const maybeSkeletons = await Promise.all(
      addresses.map(async address => {
        const definition = definitions.find(v => v.address.toLowerCase() === address);
        if (!definition) return null;

        const contract = multicall.wrap(this.getContract(address));
        const context = { address, definition, contract, multicall, tokenLoader };

        const underlyingTokenAddress = await this.getUnderlyingTokenAddresses(context)
          .then(v => v.toLowerCase())
          .catch(err => {
            if (isMulticallUnderlyingError(err)) return null;
            throw err;
          });

        if (!underlyingTokenAddress) return null;

        const controllerAddr = await contract.controller();
        const controller = multicall.wrap(
          this.contractFactory.pickleController({ address: controllerAddr, network: this.network }),
        );
        const strategyAddr = await controller.strategies(underlyingTokenAddress);
        const strategy = multicall.wrap(
          this.contractFactory.pickleStrategyUniv3({ address: strategyAddr, network: this.network }),
        );

        const tokenId = await strategy
          .tokenId()
          .then(x => x?.toString())
          .catch(err => {
            if (isMulticallUnderlyingError(err)) return null;
            throw err;
          });
        if (!tokenId) return null;

        return { address, definition, underlyingTokenAddress, tokenId };
      }),
    );

    const skeletons = compact(maybeSkeletons);

    const tokens = await Promise.all(
      skeletons.map(async ({ address, definition, tokenId }) => {
        const uniV3Token = await this.uniswapV3LiquidityContractPositionBuilder.buildPosition({
          positionId: tokenId,
          network: this.network,
          multicall,
          tokenLoader,
          collapseClaimable: true,
        });
        if (!uniV3Token) return null;

        // Get standard Jar stats
        const contract = multicall.wrap(this.getContract(address));
        const baseContext = { address, definition, contract, multicall, tokenLoader };

        const [symbol, decimals, totalSupplyRaw] = await Promise.all([
          this.getSymbol(baseContext),
          this.getDecimals(baseContext),
          this.getSupply(baseContext),
        ]);
        const supply = Number(totalSupplyRaw) / 10 ** decimals;

        const baseFragment: GetPricePerShareParams<PickleJarUniv3, DefaultDataProps>['appToken'] = {
          type: ContractType.APP_TOKEN,
          appId: this.appId,
          groupId: this.groupId,
          network: this.network,
          address,
          symbol,
          decimals,
          supply,
          tokens: uniV3Token.tokens,
        };

        // Resolve price per share stage
        const pricePerShareContext = { ...baseContext, appToken: baseFragment };
        const pricePerShare = await this.getPricePerShare(pricePerShareContext).then(v => (isArray(v) ? v : [v]));

        // Resolve Price Stage
        const priceStageFragment = { ...baseFragment, pricePerShare };
        const price = uniV3Token.balanceUSD / supply;

        // Resolve Data Props Stage
        const dataPropsStageFragment = { ...priceStageFragment, price };
        const dataPropsStageParams = { ...baseContext, appToken: dataPropsStageFragment };
        let dataProps = await this.getDataProps(dataPropsStageParams);

        // Re-assign based on univ3 liquidity
        dataProps = { ...dataProps, liquidity: uniV3Token.balanceUSD };

        // Resolve Display Props Stage
        const displayPropsStageFragment = { ...dataPropsStageFragment, dataProps };
        const displayProps = uniV3Token.displayProps;
        const appToken = { ...displayPropsStageFragment, displayProps };
        const key = this.getKey({ appToken });
        return { key, ...appToken };
      }),
    );

    const positionsSubset = compact(tokens).filter(v => {
      if (typeof v.dataProps.liquidity === 'number') return Math.abs(v.dataProps.liquidity) >= this.minLiquidity;
      return true;
    });

    return sortBy(positionsSubset, t => {
      if (typeof t.dataProps.liquidity === 'number') return -t.dataProps.liquidity;
      return 1;
    });
  }

  async getAddresses() {
    const vaults = await this.jarRegistry.getJarDefinitions({ network: this.network });
    return vaults.map(v => v.vaultAddress);
  }

  async getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<PickleJarUniv3>): Promise<string> {
    const pool = await contract.pool();
    return pool;
  }

  async getPricePerShare({ contract }: GetPricePerShareParams<PickleJarUniv3, DefaultDataProps>): Promise<number> {
    return contract.getRatio().then(v => Number(v) / 10 ** 18);
  }

  async getLiquidity() {
    return this.minLiquidity; // to be reassigned
  }

  async getReserves({ contract }: GetDataPropsParams<PickleJarUniv3>) {
    const reserveRaw = await contract.totalLiquidity();
    const reserve = Number(reserveRaw) / 10 ** 18;
    return [reserve];
  }

  async getApy({ appToken }: GetDataPropsParams<PickleJarUniv3>) {
    const vaultDefinitions = await this.jarRegistry.getJarDefinitions({ network: this.network });
    const vaultDefinition = vaultDefinitions.find(v => v.vaultAddress === appToken.address);
    return vaultDefinition?.apy ?? 0;
  }
}
