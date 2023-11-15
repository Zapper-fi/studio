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

import { GearboxViemContractFactory } from '../contracts';
import { DieselToken } from '../contracts/viem';

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
    @Inject(GearboxViemContractFactory) private readonly gearboxContractFactory: GearboxViemContractFactory,
  ) {
    super(appToolkit);
  }

  groupLabel = 'Lending';

  async getAddresses({ multicall }: GetAddressesParams): Promise<string[]> {
    const contractsRegister = this.gearboxContractFactory.contractsRegister({
      address: '0xa50d4e7d8946a7c90652339cdbd262c375d54d99',
      network,
    });

    return contractsRegister.read.getPools().then(v => [...v]);
  }

  async getDefinitions({ multicall }: GetDefinitionsParams): Promise<GearboxLendingDefinition[]> {
    const contractsRegister = this.gearboxContractFactory.contractsRegister({
      address: '0xa50d4e7d8946a7c90652339cdbd262c375d54d99',
      network,
    });

    const poolAddresses = await contractsRegister.read.getPools().then(v => [...v]);

    const dieselTokens = await Promise.all(
      poolAddresses.map(poolAddress => {
        const contract = this.gearboxContractFactory.poolService({ address: poolAddress, network });
        return multicall.wrap(contract).read.dieselToken();
      }),
    );

    return poolAddresses.map((pool, idx) => ({ address: dieselTokens[idx], poolAddress: pool }));
  }

  getContract(address: string) {
    return this.gearboxContractFactory.dieselToken({ address, network });
  }

  async getLiquidity({
    multicall,
    definition,
    appToken,
  }: GetDataPropsParams<DieselToken, DefaultAppTokenDataProps, GearboxLendingDefinition>): Promise<number> {
    const poolContract = this.gearboxContractFactory.poolService({ address: definition.poolAddress, network });

    const [liquidity, underlyingToken] = await Promise.all([
      multicall.wrap(poolContract).read.expectedLiquidity(),
      multicall.wrap(poolContract).read.underlyingToken(),
    ]);

    const tokenContract = this.appToolkit.globalViemContracts.erc20({ address: underlyingToken, network });
    const underlyingTokenDecimals = await multicall.wrap(tokenContract).read.decimals();
    const underlyingBalance = +formatUnits(liquidity, underlyingTokenDecimals);

    return underlyingBalance * appToken.tokens[0].price;
  }

  async getReserves(_: GetDataPropsParams<DieselToken, DefaultAppTokenDataProps, DefaultAppTokenDefinition>) {
    return [];
  }

  async getUnderlyingTokenDefinitions({
    definition,
    multicall,
  }: GetUnderlyingTokensParams<DieselToken, GearboxLendingDefinition>) {
    const poolContract = this.gearboxContractFactory.poolService({ address: definition.poolAddress, network });
    const underlyingTokenAddress = await multicall.wrap(poolContract).read.underlyingToken();
    return [{ address: underlyingTokenAddress, network: this.network }];
  }

  async getPricePerShare({
    contract: dieselTokenContract,
    definition,
    multicall,
  }: GetPricePerShareParams<DieselToken, DefaultAppTokenDataProps, GearboxLendingDefinition>) {
    const poolContract = this.gearboxContractFactory.poolService({ address: definition.poolAddress, network });

    const [underlying, underlyingToken, dieselTokenTotalSupply, dieselTokenDecimals] = await Promise.all([
      multicall.wrap(poolContract).read.expectedLiquidity(),
      multicall.wrap(poolContract).read.underlyingToken(),
      multicall.wrap(dieselTokenContract).read.totalSupply(),
      multicall.wrap(dieselTokenContract).read.decimals(),
    ]);

    const underlyingTokenContract = this.appToolkit.globalViemContracts.erc20({ address: underlyingToken, network });
    const underlyingTokenDecimals = await underlyingTokenContract.read.decimals();
    const pricePerShare =
      +formatUnits(underlying, underlyingTokenDecimals) / +formatUnits(dieselTokenTotalSupply, dieselTokenDecimals);

    return [pricePerShare];
  }
}
