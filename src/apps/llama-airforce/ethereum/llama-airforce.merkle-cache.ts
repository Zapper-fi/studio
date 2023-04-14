import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { MerkleCache } from '~position/template/merkle.cache';
import { Network } from '~types/network.interface';

type LlamaAirforceMerkleClaim = {
  index: number;
  amount: string;
  proof: string[];
};

type LlamaAirforceMerkleData = {
  merkleRoot: string;
  tokenTotal: string;
  claims: Record<string, LlamaAirforceMerkleClaim>;
};

@Injectable()
export class EthereumLlamaAirforceMerkleCache extends MerkleCache<LlamaAirforceMerkleClaim> {
  appId = 'llama-airforce';
  groupId = 'airdrop';
  network = Network.ETHEREUM_MAINNET;

  async resolveMerkleData() {
    const [{ data: uCrvData }, { data: uFxsData }, { data: uCvxData }] = await Promise.all([
      axios.get<LlamaAirforceMerkleData>(
        'https://raw.githubusercontent.com/0xAlunara/Llama-Airforce-Airdrops/master/ucrv/latest.json',
      ),
      axios.get<LlamaAirforceMerkleData>(
        'https://raw.githubusercontent.com/0xAlunara/Llama-Airforce-Airdrops/master/ufxs/latest.json',
      ),
      axios.get<LlamaAirforceMerkleData>(
        'https://raw.githubusercontent.com/0xAlunara/Llama-Airforce-Airdrops/master/ucvx/latest.json',
      ),
    ]);

    const uCrvTokenAddress = '0xde2bef0a01845257b4aef2a2eaa48f6eaeafa8b7';
    const uFxsTokenAddress = '0x3a886455e5b33300a31c5e77bac01e76c0c7b29c';
    const uCvxTokenAddress = '0x8659fc767cad6005de79af65dafe4249c57927af';

    return {
      [uCrvTokenAddress]: uCrvData.claims,
      [uFxsTokenAddress]: uFxsData.claims,
      [uCvxTokenAddress]: uCvxData.claims,
    };
  }
}
