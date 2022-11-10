import { Inject } from '@nestjs/common';
import { formatUnits } from 'ethers/lib/utils';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  DefaultAppTokenDataProps,
  DefaultAppTokenDefinition,
  GetAddressesParams,
  GetDataPropsParams,
  GetDefinitionsParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';
import { Network } from '~types/network.interface';

import { DieselToken, GearboxContractFactory } from '../contracts';

const network = Network.ETHEREUM_MAINNET;

interface GearboxLendingDefinition extends DefaultAppTokenDefinition {
  poolAddress: string;
}

@PositionTemplate()
export class EthereumGearboxLendingTokenFetcher extends AppTokenTemplatePositionFetcher<
  DieselToken,
  DefaultAppTokenDataProps,
  GearboxLendingDefinition
> {
  constructor(
    @Inject(APP_TOOLKIT) readonly appToolkit: IAppToolkit,
    @Inject(GearboxContractFactory) private readonly gearboxContractFactory: GearboxContractFactory,
  ) {
    super(appToolkit);
  }

  groupLabel = 'Lending';

  private async _getPoolAddresses(): Promise<string[]> {
    const contractsRegister = this.gearboxContractFactory.contractsRegister({
      address: '0xa50d4e7d8946a7c90652339cdbd262c375d54d99',
      network,
    });
    return contractsRegister.getPools();
  }

  private async _getDieselTokens(pools: string[]): Promise<string[]> {
    const multicall = this.appToolkit.getMulticall(network);
    return Promise.all(
      pools.map(pool =>
        multicall.wrap(this.gearboxContractFactory.poolService({ address: pool, network })).dieselToken(),
      ),
    );
  }

  private _getPoolContract(definition: GearboxLendingDefinition) {
    return this.gearboxContractFactory.poolService({ address: definition.poolAddress, network });
  }

  async getAddresses(_: GetAddressesParams): Promise<string[]> {
    const pools = await this._getPoolAddresses();
    return this._getDieselTokens(pools);
  }

  async getDefinitions(_: GetDefinitionsParams): Promise<GearboxLendingDefinition[]> {
    const pools = await this._getPoolAddresses();
    const dieselTokens = await this._getDieselTokens(pools);
    return pools.map((pool, idx) => ({ address: dieselTokens[idx], poolAddress: pool }));
  }

  getContract(address: string): DieselToken {
    return this.gearboxContractFactory.dieselToken({ address, network });
  }

  async getApy() {
    return 0;
  }

  async getLiquidity(
    params: GetDataPropsParams<DieselToken, DefaultAppTokenDataProps, GearboxLendingDefinition>,
  ): Promise<number> {
    const multicall = this.appToolkit.getMulticall(network);
    const poolContract = this._getPoolContract(params.definition);
    const [liquidity, underlyingToken] = await Promise.all([
      multicall.wrap(poolContract).expectedLiquidity(),
      multicall.wrap(poolContract).underlyingToken(),
    ]);
    const underlyingTokenDecimals = await this.gearboxContractFactory
      .erc20({ address: underlyingToken, network })
      .decimals();
    return +formatUnits(liquidity, underlyingTokenDecimals);
  }

  getReserves(
    _: GetDataPropsParams<DieselToken, DefaultAppTokenDataProps, DefaultAppTokenDefinition>,
  ): number[] | Promise<number[]> {
    return [];
  }

  async getUnderlyingTokenAddresses({ definition }: GetUnderlyingTokensParams<DieselToken, GearboxLendingDefinition>) {
    return this._getPoolContract(definition).underlyingToken();
  }

  async getPricePerShare({
    contract: dieselTokenContract,
    definition,
  }: GetPricePerShareParams<DieselToken, DefaultAppTokenDataProps, GearboxLendingDefinition>) {
    const multicall = this.appToolkit.getMulticall(network);
    const poolContract = this._getPoolContract(definition);

    const [underlying, underlyingToken, dieselTokenTotalSupply, dieselTokenDecimals] = await Promise.all([
      multicall.wrap(poolContract).expectedLiquidity(),
      multicall.wrap(poolContract).underlyingToken(),
      multicall.wrap(dieselTokenContract).totalSupply(),
      multicall.wrap(dieselTokenContract).decimals(),
    ]);

    const underlyingTokenContract = this.gearboxContractFactory.erc20({ address: underlyingToken, network });
    const underlyingTokenDecimals = await underlyingTokenContract.decimals();

    return (
      +formatUnits(underlying, underlyingTokenDecimals) / +formatUnits(dieselTokenTotalSupply, dieselTokenDecimals)
    );
  }
}
