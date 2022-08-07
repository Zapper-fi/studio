import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';
import { compact } from 'lodash';
import { OokiContractFactory, TokenRegistry, IbZx, IToken } from '../contracts';
import { OOKI_DEFINITION } from '../ooki.definition';
import { ContractType } from '~position/contract.interface';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import type {
  BigNumber
} from 'ethers'


const appId = OOKI_DEFINITION.id;
const groupId = OOKI_DEFINITION.groups.ooki.id;
const network = Network.ETHEREUM_MAINNET;
const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
const OOKI = "0x0De05F6447ab4D22c8827449EE4bA2D5C288379B"
const BZRX = "0x56d811088235F11C8920698a204A5010a788f4b3"
const vOOKI = "0x5abc9e082bf6e4f930bbc79742da3f6259c4ad1d"

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumOokiOokiTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(OokiContractFactory) private readonly contractFactory: OokiContractFactory,
  ) {}

  async getPositions() {
    const registryContract = this.contractFactory.tokenRegistry({
      network,
      address: '0xf0E474592B455579Fe580D610b846BdBb529C6F7',
    });

    const protocol = this.contractFactory.ibZx({
      network,
      address: '0xD8Ee69652E4e4838f2531732a46d1f7F584F0b7f',
    });
    const priceFeedAddress = await protocol.priceFeeds();

    const priceFeeds = this.contractFactory.iPriceFeeds({
      network,
      address: priceFeedAddress,
    });

    const tokens = await registryContract.getTokens(0, 100);
    const res = []
    for(let i =0; i<tokens.length; i++){
        const tokenAddress = tokens[i][1]
        const itokenAddress = tokens[i][0]
        const iToken = await this.getITokenDetails(priceFeeds, itokenAddress, tokenAddress)
        res.push(iToken);
    }
     return compact(res);
  }

    private async getITokenDetails(priceFeeds: IPriceFeeds, iTokenAddress: String, tokenAddress: String) {
        const iTokenContract =  this.contractFactory.iToken({ network, address: iTokenAddress })
        const tokenContract = this.appToolkit.globalContracts.erc20({ network, address: tokenAddress })

        const address = iTokenAddress
        const symbol = await iTokenContract.symbol()
        const decimals = await tokenContract.decimals()
        const tokenPrice = await iTokenContract.tokenPrice()

        const totalSupplyRaw = await iTokenContract.totalSupply();
        const supply = Number(totalSupplyRaw) / 10 ** decimals;

        let price = 0
        if(tokenAddress == BZRX){
            const priceRaw = (await priceFeeds.queryRate(OOKI, USDC)).rate
            price = Number(priceRaw.mul(10).mul(tokenPrice)) / (10 ** 18)
        }
        else {
            const priceRaw =  (await priceFeeds.queryRate(tokenAddress, USDC)).rate
            price = Number(priceRaw.mul(tokenPrice)) / (10 ** 18)
        }

        if (!price) return null;
        const liquidity = price * supply;
        return {
          type: ContractType.APP_TOKEN,
          appId,
          groupId,
          address,
          tokens: [],
          price,
          pricePerShare: 1,
          symbol,
          decimals,
          supply,
          network,
          dataProps: {},
          displayProps: {
            label: symbol,
            images: [getTokenImg(address)],
            statsItems: [
              {
                label: 'Liquidity',
                value: buildDollarDisplayItem(liquidity),
              },
            ],
          },
        };
    }
}