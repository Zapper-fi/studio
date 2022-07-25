import { Inject } from '@nestjs/common';
import { ethers } from 'ethers';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { getLabelFromToken, getImagesFromToken } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { OriginDollarContractFactory } from '../contracts';
import { ORIGIN_DOLLAR_DEFINITION } from '../origin-dollar.definition';

const appId = ORIGIN_DOLLAR_DEFINITION.id;
const groupId = ORIGIN_DOLLAR_DEFINITION.groups.wousd.id;
const network = Network.ETHEREUM_MAINNET;

export type VeOGVTokenDataProps = {
  totalValueLocked: number;
};

const oneEther = ethers.constants.WeiPerEther;
const format = v => ethers.utils.formatUnits(v);

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumOriginDollarWousdTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(OriginDollarContractFactory) private readonly originDollarContractFactory: OriginDollarContractFactory,
  ) {}

  async getPositions() {
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const multicall = this.appToolkit.getMulticall(network);

    const ousd = baseTokens.find(v => v.address === '0x2a8e1e676ec238d8a992307b495b45b3feaa5e86');
    if (!ousd) return [];

    const contract = this.originDollarContractFactory.wousd({
      address: '0xd2af830e8cbdfed6cc11bab697bb25496ed6fa62',
      network,
    });

    // Get contract data
    const [supplyRaw, ousdBalance] = await Promise.all([
      multicall.wrap(contract).totalSupply(),
      multicall
        .wrap(this.appToolkit.globalContracts.erc20({ network, address: ousd.address }))
        .balanceOf(contract.address),
    ]);

    const supply = parseFloat(format(supplyRaw));
    const totalValueLocked = parseFloat(
      format(supplyRaw.mul(ethers.utils.parseUnits(ousd.price.toString(), 18)).div(oneEther)),
    );
    const ratio = parseFloat(format(supplyRaw.mul(oneEther).div(ousdBalance)));
    const price = ousd.price / ratio;

    const token: AppTokenPosition<VeOGVTokenDataProps> = {
      type: ContractType.APP_TOKEN,
      appId,
      groupId,
      address: contract.address,
      network,
      symbol: 'wOUSD',
      decimals: 18,
      supply,
      tokens: [ousd],
      pricePerShare: 1 / ratio,
      price,
      dataProps: {
        totalValueLocked,
      },
      displayProps: {
        label: `Wrapped ${getLabelFromToken(ousd)}`,
        images: getImagesFromToken(ousd),
      },
    };

    return [token];
  }
}
