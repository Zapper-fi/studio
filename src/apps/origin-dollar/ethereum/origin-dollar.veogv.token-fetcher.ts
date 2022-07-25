import { Inject } from '@nestjs/common';
import { ethers } from 'ethers';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getLabelFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { OriginDollarContractFactory } from '../contracts';
import { ORIGIN_DOLLAR_DEFINITION } from '../origin-dollar.definition';

const appId = ORIGIN_DOLLAR_DEFINITION.id;
const groupId = ORIGIN_DOLLAR_DEFINITION.groups.veogv.id;
const network = Network.ETHEREUM_MAINNET;

export type VeOGVTokenDataProps = {
  apy: number;
  liquidity: number;
};
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

/**
 * Calculate the expectd maximum rewards APY for a stake
 *
 * Ref: https://github.com/OriginProtocol/ousd-governance/blob/955e2924f50b452d66a2506c00a293da4d8493d0/client/utils/apy.tsx#L27-L56
 *
 * @param ogv {BigNumber} - The amount of OGV for the stake
 * @param veogv {BigNumber} - The amount of veOGV expected to be given for the stake
 * @param totalSupplyVeOGV {BigNumber} - The total supply of veOGV
 * @return {number} A decimal representation of expected APY for a 4 year stake
 */
function getRewardsApy(ogv, veogv, totalSupplyVeOGV) {
  const pctShare = veogv.mul(oneEther).div(totalSupplyVeOGV.add(veogv));
  const now = stamp();
  const dailyEmissionsRow = dailyEmissionsTable.find(([startTime, endTime]) => now > startTime && now < endTime);
  const dailyEmissions = dailyEmissionsRow ? dailyEmissionsRow[2] : 0;
  const dailyRewards = toBN(dailyEmissions).mul(pctShare);
  const yearlyRewards = dailyRewards.mul(floatToBN(365.25)).div(oneEther);
  const apr = yearlyRewards.mul(oneEther).div(ogv);
  return parseFloat(format(apr));
}

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumOriginDollarVeogvTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(OriginDollarContractFactory) private readonly originDollarContractFactory: OriginDollarContractFactory,
  ) {}

  async getPositions() {
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const multicall = this.appToolkit.getMulticall(network);

    const ogv = baseTokens.find(v => v.address === '0x9c354503c38481a7a7a51629142963f98ecc12d0');
    if (!ogv) return [];

    const contract = this.originDollarContractFactory.veogv({
      address: '0x0c4576ca1c365868e162554af8e385dc3e7c66d9',
      network,
    });

    // Amount we'll use to calculate APY (1000 OGV)
    const stakeAmount = ethers.BigNumber.from('1000000000000000000000');

    // Get contract data
    const [supplyRaw, [expectedVeOGV], ogvBalance] = await Promise.all([
      multicall.wrap(contract).totalSupply(),
      // 1000e18 @ 4 year stake (1461 days)
      multicall.wrap(contract).previewPoints(stakeAmount, ethers.BigNumber.from('126230400')),
      multicall
        .wrap(this.appToolkit.globalContracts.erc20({ network, address: ogv.address }))
        .balanceOf(contract.address),
    ]);

    // Calculate TVL in USD
    const supply = parseFloat(format(supplyRaw));
    const liquidity = parseFloat(
      format(supplyRaw.mul(ethers.utils.parseUnits(ogv.price.toString(), 18)).div(oneEther)),
    );
    const apy = getRewardsApy(stakeAmount, expectedVeOGV, supplyRaw);

    // Approximate value of position
    const ratio = parseFloat(format(supplyRaw.mul(oneEther).div(ogvBalance)));
    const price = ogv.price / ratio;

    const token: AppTokenPosition<VeOGVTokenDataProps> = {
      type: ContractType.APP_TOKEN,
      appId,
      groupId,
      address: contract.address,
      network,
      symbol: 'veOGV',
      decimals: 18,
      supply,
      tokens: [ogv],
      pricePerShare: 1 / ratio,
      price,
      dataProps: {
        apy,
        liquidity,
      },
      displayProps: {
        label: `Vote Escrowed ${getLabelFromToken(ogv)}`,
        secondaryLabel: `Up to ${(apy * 100).toFixed(3)}% APY`,
        images: ['https://governance.ousd.com/veogv.svg'],
        statsItems: [{ label: 'Liquidity', value: buildDollarDisplayItem(liquidity) }],
      },
    };

    return [token];
  }
}
