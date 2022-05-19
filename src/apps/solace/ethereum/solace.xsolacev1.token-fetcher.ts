import { Inject } from '@nestjs/common';

import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
import { Register } from '~app-toolkit/decorators';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { AppTokenPosition } from '~position/position.interface';
import { ContractType } from '~position/contract.interface';
import { Network } from '~types/network.interface';

import { SolaceContractFactory } from '../contracts';
import { SOLACE_DEFINITION } from '../solace.definition';

import { bnToFloat } from '../utils';

const appId = SOLACE_DEFINITION.id;
const groupId = SOLACE_DEFINITION.groups.xsolacev1.id;
const network = Network.ETHEREUM_MAINNET;

const SOLACE_ADDRESS = "0x501ace9c35e60f03a2af4d484f49f9b1efde9f40";
const XSOLACE_V1_ADDRESS = "0x501ace5ac3af20f49d53242b6d208f3b91cfc411";
const symbol = "xSOLACEv1";
const decimals = 18;
const ONE_ETHER = "1000000000000000000";

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumSolaceXsolacev1TokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SolaceContractFactory) private readonly solaceContractFactory: SolaceContractFactory,
  ) {}

  async getPositions() {
    return new Promise(async (resolve) => {
      const multicall = this.appToolkit.getMulticall(network);
      const xsolacev1 = this.solaceContractFactory.xSolacev1({ address: XSOLACE_V1_ADDRESS, network });
      const mcxs = multicall.wrap(xsolacev1);
      const [supplyRaw, pps, solacePrice] = await Promise.all([
        mcxs.totalSupply(),
        mcxs.xSolaceToSolace(ONE_ETHER),
        this.getSolacePrice()
      ]);
      const supply = bnToFloat(decimals)(supplyRaw);
      const xsolacePrice = solacePrice * bnToFloat(decimals)(pps);

      resolve([{
        type: ContractType.APP_TOKEN,
        appId,
        groupId,
        address: XSOLACE_V1_ADDRESS,
        network,
        symbol,
        decimals,
        supply,
        price: xsolacePrice
      }]);
    });
  }

  async getSolacePrice() {
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const solace = baseTokens.find((v:any) => v.address === SOLACE_ADDRESS);
    if(!solace || !solace.price) return 0.0;
    return solace.price;
  }
}
