import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetUnderlyingTokensParams, DefaultAppTokenDataProps } from '~position/template/app-token.template.types';

import { ParaspaceReserveTokenAddressesData } from '../common/paraspace.lending.token-fetcher';
import { ParaspaceContractFactory } from '../contracts';
import { ParaspaceDToken } from '../contracts/ethers/ParaspaceDToken';

@PositionTemplate()
export class EthereumParaspaceBorrowTokenFetcher extends AppTokenTemplatePositionFetcher<
  ParaspaceDToken,
  DefaultAppTokenDataProps
> {
  groupLabel: string;
  providerAddress = '0xbc88150ebefda53fb61f4c59e98d0de5ebbb8cd3';
  isDebt = true;

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(ParaspaceContractFactory) protected readonly contractFactory: ParaspaceContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): ParaspaceDToken {
    return this.contractFactory.paraspaceDToken({ address: address, network: this.network });
  }

  async getAddresses(): Promise<string[]> {
    const multicall = this.appToolkit.getMulticall(this.network);
    const pool = multicall.wrap(
      this.contractFactory.paraspaceLending({
        address: this.providerAddress,
        network: this.network,
      }),
    );

    const reserveTokens = await pool.getAllReservesTokens();
    const reserveTokenAddresses = reserveTokens.map(token => token[1]);
    const reserveTokensData = await Promise.all(
      reserveTokenAddresses.map(address => pool.getReserveTokensAddresses(address)),
    );

    return reserveTokensData.map(v =>
      this.getTokenAddress({
        pTokenAddress: v.xTokenAddress,
        variableDebtTokenAddress: v.variableDebtTokenAddress.toLowerCase(),
      }),
    );
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<ParaspaceDToken>) {
    return [{ address: await contract.UNDERLYING_ASSET_ADDRESS(), network: this.network }];
  }

  async getPricePerShare() {
    return [1];
  }

  getTokenAddress(reserveTokenAddressesData: ParaspaceReserveTokenAddressesData): string {
    return reserveTokenAddressesData.variableDebtTokenAddress;
  }
}
