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
const groupId = OOKI_DEFINITION.groups.lend.id;
const network = Network.ETHEREUM_MAINNET;

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumOokiOokiTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(OokiContractFactory) private readonly contractFactory: OokiContractFactory,
  ) {}

  async getPositions() {
      const multicall = this.appToolkit.getMulticall(network);
      const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
      const registryContract = this.contractFactory.tokenRegistry({
        network,
        address: '0xf0E474592B455579Fe580D610b846BdBb529C6F7',
      });

      const tokenAddresses = await registryContract.getTokens(0, 100);

      const tokens = await Promise.all(
          tokenAddresses.map(async v => {
          const tokenAddress = v.asset
          const itokenAddress = v.token
           const iTokenContract =  this.contractFactory.iToken({ network, address: itokenAddress })
           const tokenContract = this.appToolkit.globalContracts.erc20({ network, address: tokenAddress })

          const underlyingToken = baseTokens.find(v => v.address.toLowerCase() === tokenAddress.toLowerCase())
          if(!underlyingToken)
                return null
          const [symbol, decimals, supplyRaw, tokenPrice] = await Promise.all([
            multicall.wrap(iTokenContract).symbol(),
            multicall.wrap(tokenContract).decimals(),
            multicall.wrap(iTokenContract).totalSupply(),
            multicall.wrap(iTokenContract).tokenPrice(),
          ]);
          const supply = Number(supplyRaw) / 10 ** decimals;
          const liquidity = underlyingToken.price * supply;
          const token: AppTokenPosition = {
                  type: ContractType.APP_TOKEN,
                  appId,
                  groupId,
                  address: itokenAddress,
                  tokens: [underlyingToken],
                  price: underlyingToken.price,
                  pricePerShare: Number(tokenPrice) / 10 ** 18,
                  symbol,
                  decimals,
                  supply,
                  network,
                  dataProps: {
                    supply
                  },
                  displayProps: {
                    label: symbol,
                    images: [getTokenImg(itokenAddress)],
                    statsItems: [
                      {
                        label: 'Liquidity',
                        value: buildDollarDisplayItem(liquidity),
                      },
                    ],
                  },
              };

              return token;
        }),
      );
      return compact(tokens);
    }
}