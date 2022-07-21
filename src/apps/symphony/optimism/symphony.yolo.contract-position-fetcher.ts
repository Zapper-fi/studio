import { Inject } from '@nestjs/common';
import axios from 'axios';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { ZERO_ADDRESS } from '~app-toolkit/constants/address';
import { Register } from '~app-toolkit/decorators';
import { buildDollarDisplayItem } from '~app-toolkit/helpers/presentation/display-item.present';
import { getTokenImg } from '~app-toolkit/helpers/presentation/image.present';
import { ContractType } from '~position/contract.interface';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { supplied } from '~position/position.utils';
import { Network } from '~types/network.interface';

import { SymphonyContractFactory } from '../contracts';
import { SymphonyYoloTokenDataProps, Token } from '../helpers/types';
import { SYMPHONY_DEFINITION } from '../symphony.definition';

const appId = SYMPHONY_DEFINITION.id;
const groupId = SYMPHONY_DEFINITION.groups.yolo.id;
const network = Network.OPTIMISM_MAINNET;
const YOLO_ADDRESS = '0x3ff61f4d7e1d912ca3cb342581b2e764ae24d017';
const TOKENLIST_URL = 'https://raw.githubusercontent.com/symphony-finance/token-list/master/symphony.tokenlist.json';

@Register.ContractPositionFetcher({ appId, groupId, network })
export class OptimismSymphonyYoloContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SymphonyContractFactory) private readonly symphonyContractFactory: SymphonyContractFactory,
  ) {}

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);

    const tokenList: Token[] = (await axios.get(TOKENLIST_URL)).data.tokens
      .filter((data: Token) => data.chainId == 10 && !data.extensions.isNative)
      .map((token: Token) => token);

    const yoloContract = this.symphonyContractFactory.symphonyYolo({
      address: YOLO_ADDRESS,
      network,
    });

    const balances = await Promise.all(
      tokenList.map(async (token, i: number) => {
        const tokenContract = this.appToolkit.globalContracts.erc20({ address: token.address, network });

        const [contractBalances] = await Promise.all([multicall.wrap(tokenContract).balanceOf(YOLO_ADDRESS)]);

        const [totalBalances] = await Promise.all([
          multicall
            .wrap(yoloContract)
            .callStatic.getTotalTokens(
              token.address,
              contractBalances && contractBalances[i] ? contractBalances[i] : 0,
              token.extensions.strategy ? token.extensions.strategy : ZERO_ADDRESS,
            ),
        ]);

        const tokenData = baseTokens.find(p => p.address.toLocaleLowerCase() === token.address.toLocaleLowerCase())!;

        const tokenBalance = Number(totalBalances) / 10 ** token.decimals;
        const tokenBalanceUSD = tokenBalance * (tokenData && tokenData.price ? tokenData.price : 0);

        // Display Props
        const label = `${token.symbol} Order`;
        const images = [getTokenImg(token.address.toLocaleLowerCase(), network)];

        const position: ContractPosition<SymphonyYoloTokenDataProps> = {
          type: ContractType.POSITION,
          address: token.address,
          appId: SYMPHONY_DEFINITION.id,
          groupId: SYMPHONY_DEFINITION.groups.yolo.id,
          network,
          tokens: [supplied(tokenData)],
          dataProps: {
            liquidity: tokenBalanceUSD,
          },
          displayProps: {
            label,
            images,
            statsItems: [{ label: 'Liquidity', value: buildDollarDisplayItem(tokenBalanceUSD) }],
          },
        };

        return position;
      }),
    );

    return balances;
  }
}
