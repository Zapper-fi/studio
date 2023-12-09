import { Inject } from '@nestjs/common';
import { compact, isArray, sortBy } from 'lodash';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { UniswapV3LiquidityContractPositionBuilder } from '~apps/uniswap-v3/common/uniswap-v3.liquidity.contract-position-builder';
import { isViemMulticallUnderlyingError } from '~multicall/errors';
import { ContractType } from '~position/contract.interface';
import { DefaultDataProps } from '~position/display.interface';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDataPropsParams,
  GetPricePerShareParams,
  GetTokenPropsParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { PickleViemContractFactory } from '../contracts';
import { PickleJarUniv3 } from '../contracts/viem';

import { PickleApiJarRegistry } from './pickle.api.jar-registry';

export abstract class PickleJarUniv3TokenFetcher extends AppTokenTemplatePositionFetcher<PickleJarUniv3> {
  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(PickleViemContractFactory) protected readonly contractFactory: PickleViemContractFactory,
    @Inject(PickleApiJarRegistry) protected readonly jarRegistry: PickleApiJarRegistry,
    @Inject(UniswapV3LiquidityContractPositionBuilder)
    private readonly uniswapV3LiquidityContractPositionBuilder: UniswapV3LiquidityContractPositionBuilder,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.pickleJarUniv3({ address, network: this.network });
  }

  async getPositions() {
    const multicall = this.appToolkit.getViemMulticall(this.network);
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

        const underlyingTokenDefinitions = await this.getUnderlyingTokenDefinitions(context)
          .then(v => v.map(t => ({ address: t.address.toLowerCase(), network: t.network })))
          .catch(err => {
            if (isViemMulticallUnderlyingError(err)) return null;
            throw err;
          });

        if (!underlyingTokenDefinitions) return null;

        const controllerAddr = await contract.read.controller();
        const controller = multicall.wrap(
          this.contractFactory.pickleController({ address: controllerAddr, network: this.network }),
        );
        const strategyAddr = await controller.read.strategies([underlyingTokenDefinitions[0].address]);
        const strategy = multicall.wrap(
          this.contractFactory.pickleStrategyUniv3({ address: strategyAddr, network: this.network }),
        );

        const tokenId = await strategy.read
          .tokenId()
          .then(x => x?.toString())
          .catch(err => {
            if (isViemMulticallUnderlyingError(err)) return null;
            throw err;
          });
        if (!tokenId) return null;

        return { address, definition, underlyingTokenDefinitions, tokenId };
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

        const baseFragment: GetTokenPropsParams<PickleJarUniv3>['appToken'] = {
          type: ContractType.APP_TOKEN,
          appId: this.appId,
          groupId: this.groupId,
          network: this.network,
          address,
          tokens: uniV3Token.tokens,
        };

        const baseContext = { address, definition, contract, multicall, tokenLoader, appToken: baseFragment };
        const [symbol, decimals, totalSupplyRaw] = await Promise.all([
          this.getSymbol(baseContext),
          this.getDecimals(baseContext),
          this.getSupply(baseContext),
        ]);
        const supply = Number(totalSupplyRaw) / 10 ** decimals;

        // Resolve price per share stage
        const pricePerShareStageFragment = { ...baseFragment, symbol, decimals, supply };
        const pricePerShareContext = { ...baseContext, appToken: pricePerShareStageFragment };
        const pricePerShare = await this.getPricePerShare(pricePerShareContext).then(v => (isArray(v) ? v : [v]));

        // Resolve Price Stage
        const priceStageFragment = { ...pricePerShareStageFragment, pricePerShare };
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
        const key = this.appToolkit.getPositionKey(appToken);
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
    const jarDefinitionData = await this.jarRegistry.getJarDefinitions(this.network);
    return jarDefinitionData.map(x => x.jarAddress);
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<PickleJarUniv3>) {
    return [{ address: await contract.read.pool(), network: this.network }];
  }

  async getPricePerShare({ contract }: GetPricePerShareParams<PickleJarUniv3, DefaultDataProps>) {
    return contract.read.getRatio().then(v => [Number(v) / 10 ** 18]);
  }

  async getLiquidity() {
    return this.minLiquidity; // to be reassigned
  }

  async getReserves({ contract }: GetDataPropsParams<PickleJarUniv3>) {
    const reserveRaw = await contract.read.totalLiquidity();
    const reserve = Number(reserveRaw) / 10 ** 18;
    return [reserve];
  }
}
