import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { ETH_ADDR_ALIAS, ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { BLOCKS_PER_DAY } from '~app-toolkit/constants/blocks';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { isMulticallUnderlyingError } from '~multicall/multicall.ethers';
import { DisplayProps } from '~position/display.interface';
import { MetaType } from '~position/position.interface';
import { ContractPositionTemplatePositionFetcher } from '~position/template/contract-position.template.position-fetcher';
import {
  DefaultContractPositionDefinition,
  GetDataPropsParams,
  GetDefinitionsParams,
  GetDisplayPropsParams,
  GetTokenBalancesParams,
  GetTokenDefinitionsParams,
  UnderlyingTokenDefinition,
} from '~position/template/contract-position.template.types';

import { CompoundContractFactory, CompoundCToken } from '../contracts';

export type CompoundBorrowTokenDataProps = {
  apy: number;
  liquidity: number;
  isActive: boolean;
};

export abstract class CompoundBorrowContractPositionFetcher extends ContractPositionTemplatePositionFetcher<CompoundCToken> {
  abstract comptrollerAddress: string;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(CompoundContractFactory) protected readonly contractFactory: CompoundContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): CompoundCToken {
    return this.contractFactory.compoundCToken({ address, network: this.network });
  }

  async getDefinitions({ multicall }: GetDefinitionsParams): Promise<DefaultContractPositionDefinition[]> {
    const comptroller = multicall.wrap(
      this.contractFactory.compoundComptroller({ address: this.comptrollerAddress, network: this.network }),
    );
    const addresses = await comptroller.getAllMarkets();
    return addresses.map(addr => ({ address: addr.toLowerCase() }));
  }

  async getTokenDefinitions({
    contract,
  }: GetTokenDefinitionsParams<CompoundCToken, DefaultContractPositionDefinition>): Promise<
    UnderlyingTokenDefinition[] | null
  > {
    const underlyingAddressRaw = await contract.underlying().catch(err => {
      // if the underlying call failed, it's the compound-wrapped native token
      if (isMulticallUnderlyingError(err)) return ZERO_ADDRESS;
      throw err;
    });

    const underlyingAddress = underlyingAddressRaw.toLowerCase().replace(ETH_ADDR_ALIAS, ZERO_ADDRESS);
    return [{ address: underlyingAddress, metaType: MetaType.BORROWED }];
  }

  async getLabel({
    contractPosition,
  }: GetDisplayPropsParams<CompoundCToken, CompoundBorrowTokenDataProps>): Promise<DisplayProps['label']> {
    const [underlyingToken] = contractPosition.tokens;
    return getLabelFromToken(underlyingToken);
  }

  async getSecondaryLabel({
    contractPosition,
  }: GetDisplayPropsParams<CompoundCToken, CompoundBorrowTokenDataProps>): Promise<DisplayProps['secondaryLabel']> {
    const [underlyingToken] = contractPosition.tokens;
    return buildDollarDisplayItem(underlyingToken.price);
  }

  protected async getApy({ contract }: GetDataPropsParams<CompoundCToken, CompoundBorrowTokenDataProps>) {
    const borrowRate = await contract.borrowRatePerBlock().catch(() => 0);
    const blocksPerDay = BLOCKS_PER_DAY[this.network];
    return 100 * (Math.pow(1 + (blocksPerDay * Number(borrowRate)) / Number(1e18), 365) - 1);
  }

  protected async getPricePerShare({
    contract,
    contractPosition,
  }: GetDataPropsParams<CompoundCToken, CompoundBorrowTokenDataProps>) {
    const [underlyingToken] = contractPosition.tokens;
    const rateRaw = await contract.exchangeRateCurrent();
    const mantissa = underlyingToken.decimals + 10;

    return Number(rateRaw) / 10 ** mantissa;
  }

  async getDataProps(
    opts: GetDataPropsParams<CompoundCToken, CompoundBorrowTokenDataProps>,
  ): Promise<CompoundBorrowTokenDataProps> {
    const { contractPosition, contract } = opts;
    const [underlyingToken] = contractPosition.tokens;

    const [decimals, supplyRaw, pricePerShare, apy, cashRaw] = await Promise.all([
      contract.decimals(),
      contract.totalSupply(),
      this.getPricePerShare(opts),
      this.getApy(opts),
      contract.getCash().catch(e => {
        if (isMulticallUnderlyingError(e)) return 0;
        throw e;
      }),
    ]);

    const supply = Number(supplyRaw) / 10 ** decimals;
    const price = pricePerShare * underlyingToken.price;
    const underlyingLiquidity = price * supply;

    // The "cash" needs to be converted back into a proper number format.
    // We use the underlying token as the basis for the conversion.
    const cashSupply = Number(cashRaw) / 10 ** underlyingToken.decimals;
    // Liquidity is the total supply of "cash" multiplied by the price of an underlying token
    const borrowedPositionliquidity = cashSupply * underlyingToken.price;

    const borrowLiquidity =
      borrowedPositionliquidity > underlyingLiquidity ? 0 : underlyingLiquidity - borrowedPositionliquidity;

    return {
      liquidity: -borrowLiquidity,
      isActive: Boolean(borrowLiquidity > 0),
      apy,
    };
  }

  async getTokenBalancesPerPosition({
    address,
    contract,
  }: GetTokenBalancesParams<CompoundCToken, CompoundBorrowTokenDataProps>) {
    const balanceRaw = await contract.borrowBalanceCurrent(address);
    return [balanceRaw];
  }
}
