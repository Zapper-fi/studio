import { Inject } from '@nestjs/common';
import { ethers } from 'ethers';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken, getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDisplayPropsParams,
  GetPriceParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { OriginDollarContractFactory, Wousd } from '../contracts';
const oneEther = ethers.constants.WeiPerEther;
const format = v => ethers.utils.formatUnits(v);

@PositionTemplate()
export class EthereumOriginDollarGovernanceWousdTokenFetcher extends AppTokenTemplatePositionFetcher<Wousd> {
  groupLabel = 'Wrapped OUSD';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(OriginDollarContractFactory) private readonly contractFactory: OriginDollarContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): Wousd {
    return this.contractFactory.wousd({ network: this.network, address });
  }

  async getAddresses() {
    return ['0xd2af830e8cbdfed6cc11bab697bb25496ed6fa62'];
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<Wousd>) {
    return [{ address: await contract.asset(), network: this.network }];
  }

  async getPrice({ appToken, contract, multicall }: GetPriceParams<Wousd>): Promise<number> {
    const supplyRaw = await contract.totalSupply();
    const underlyingTokenContract = this.contractFactory.erc20({
      network: this.network,
      address: appToken.tokens[0].address,
    });
    const underlyingBalance = await multicall.wrap(underlyingTokenContract).balanceOf(appToken.address);
    const ratio = parseFloat(format(supplyRaw.mul(oneEther).div(underlyingBalance)));
    const price = appToken.tokens[0].price / ratio;

    return price;
  }

  async getPricePerShare({ appToken, contract, multicall }: GetPricePerShareParams<Wousd>) {
    const supplyRaw = await contract.totalSupply();
    const underlyingTokenContract = this.contractFactory.erc20({
      network: this.network,
      address: appToken.tokens[0].address,
    });
    const underlyingBalance = await multicall.wrap(underlyingTokenContract).balanceOf(appToken.address);
    const ratio = parseFloat(format(supplyRaw.mul(oneEther).div(underlyingBalance)));

    return [1 / ratio];
  }

  async getLabel({ appToken }: GetDisplayPropsParams<Wousd>): Promise<string> {
    return `Wrapped ${getLabelFromToken(appToken.tokens[0])}`;
  }

  async getImages({ appToken }: GetDisplayPropsParams<Wousd>) {
    return [getTokenImg(appToken.address, this.network)];
  }
}
