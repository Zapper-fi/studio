import { Inject } from '@nestjs/common';
import { ethers } from 'ethers';
import moment from 'moment';
import 'moment-duration-format';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import {
  GetDataPropsParams,
  GetDisplayPropsParams,
  GetPriceParams,
  GetPricePerShareParams,
  GetUnderlyingTokensParams,
} from '~position/template/app-token.template.types';

import { OriginDollarContractFactory, Veogv } from '../contracts';

const oneEther = ethers.constants.WeiPerEther;
// Daily emissions in format: start_timestamp, end_timestamp, daily emissions
// Ref: https://github.com/OriginProtocol/ousd-governance/blob/955e2924f50b452d66a2506c00a293da4d8493d0/client/utils/apy.tsx#L6-L17
const dailyEmissionsTable = [
  [0, 1660176000, 3333333],
  [1660176000, 1665360000, 2666667],
  [1665360000, 1675728000, 1866667],
  [1675728000, 1696464000, 1120000],
  [1696464000, 1727568000, 560000],
  [1727568000, 1779408000, 224000],
  [1779408000, 1862352000, 67200],
];
const floatToBN = v => ethers.utils.parseUnits(v.toString(), 18);
const toBN = v => ethers.BigNumber.from(v);
const format = v => ethers.utils.formatUnits(v);
const stamp = () => Date.now() / 1000;

@PositionTemplate()
export class EthereumOriginDollarVeogvTokenFetcher extends AppTokenTemplatePositionFetcher<Veogv> {
  groupLabel = 'OGV Stake';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(OriginDollarContractFactory) private readonly contractFactory: OriginDollarContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string): Veogv {
    return this.contractFactory.veogv({ network: this.network, address });
  }

  async getAddresses() {
    return ['0x0c4576ca1c365868e162554af8e385dc3e7c66d9'];
  }

  async getUnderlyingTokenAddresses({ contract }: GetUnderlyingTokensParams<Veogv>) {
    return contract.ogv();
  }

  async getPrice({ appToken, contract, multicall }: GetPriceParams<Veogv>): Promise<number> {
    const supplyRaw = await contract.totalSupply();
    const underlyingTokenContract = this.contractFactory.erc20({
      network: this.network,
      address: appToken.tokens[0].address,
    });
    const underlyingBalance = await multicall.wrap(underlyingTokenContract).balanceOf(appToken.address);
    const ratio = Number(supplyRaw) / Number(underlyingBalance);
    const price = appToken.tokens[0].price / ratio;

    return price;
  }

  async getPricePerShare({ appToken, contract, multicall }: GetPricePerShareParams<Veogv>) {
    const supplyRaw = await contract.totalSupply();
    const underlyingTokenContract = this.contractFactory.erc20({
      network: this.network,
      address: appToken.tokens[0].address,
    });
    const underlyingBalance = await multicall.wrap(underlyingTokenContract).balanceOf(appToken.address);
    const ratio = Number(supplyRaw) / Number(underlyingBalance);

    return 1 / ratio;
  }

  async getLiquidity({ appToken }: GetDataPropsParams<Veogv>) {
    return appToken.supply * appToken.price;
  }

  async getReserves({ appToken }: GetDataPropsParams<Veogv>) {
    return [appToken.pricePerShare[0] * appToken.supply];
  }

  async getApy({ contract }: GetDataPropsParams<Veogv>) {
    const stakeAmount = ethers.BigNumber.from('1000000000000000000000');
    const fourYears = ethers.BigNumber.from(moment.duration(4, 'years').asSeconds());
    const [expectedVeOGV] = await contract.previewPoints(stakeAmount, fourYears);
    const supplyRaw = await contract.totalSupply();

    const pctShare = expectedVeOGV.mul(oneEther).div(supplyRaw.add(expectedVeOGV));
    const now = stamp();
    const dailyEmissionsRow = dailyEmissionsTable.find(([startTime, endTime]) => now > startTime && now < endTime);
    const dailyEmissions = dailyEmissionsRow ? dailyEmissionsRow[2] : 0;
    const dailyRewards = toBN(dailyEmissions).mul(pctShare);
    const yearlyRewards = dailyRewards.mul(floatToBN(365.25)).div(oneEther);
    const apr = yearlyRewards.mul(oneEther).div(stakeAmount);
    return parseFloat(format(apr));
  }

  async getLabel({ appToken }: GetDisplayPropsParams<Veogv>): Promise<string> {
    return `Vote Escrowed ${getLabelFromToken(appToken.tokens[0])}`;
  }
}
