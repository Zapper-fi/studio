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
const groupId = SOLACE_DEFINITION.groups.scp.id;
const network = Network.ETHEREUM_MAINNET;

const SCP_ADDRESS = "0x501acee83a6f269b77c167c6701843d454e2efa0";
const symbol = "SCP";
const decimals = 18;
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

@Register.TokenPositionFetcher({ appId, groupId, network })
export class EthereumSolaceScpTokenFetcher implements PositionFetcher<AppTokenPosition> {
  constructor(
    @Inject(APP_TOOLKIT) private readonly appToolkit: IAppToolkit,
    @Inject(SolaceContractFactory) private readonly solaceContractFactory: SolaceContractFactory,
  ) {}

  async getPositions() {
    const multicall = this.appToolkit.getMulticall(network);
    const scp = this.solaceContractFactory.scp({ address: SCP_ADDRESS, network });
    const mcscp = multicall.wrap(scp);
    const [supplyRaw, pps, ethPrice] = await Promise.all([
      mcscp.totalSupply(),
      mcscp.pricePerShare(),
      this.getEthPrice()
    ]);
    const supply = bnToFloat(decimals)(supplyRaw);
    const scpPrice = ethPrice * bnToFloat(decimals)(pps);

    return [{
      type: ContractType.APP_TOKEN,
      appId,
      groupId,
      address: SCP_ADDRESS,
      network,
      symbol,
      decimals,
      supply,
      price: scpPrice
    }];
  }

  async getEthPrice() {
    const baseTokens = await this.appToolkit.getBaseTokenPrices(network);
    const eth = baseTokens.find((v:any) => v.address === ZERO_ADDRESS);
    if(!eth || !eth.price) return 0.0;
    return eth.price;
  }
}
