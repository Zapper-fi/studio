import { Injectable } from '@nestjs/common';
import Axios from 'axios';

import { MerkleCache } from '~app-toolkit/helpers/merkle/merkle.cache';
import { Network } from '~types/network.interface';

import { LLAMA_AIRFORCE_DEFINITION } from '../llama-airforce.definition';

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
  appId = LLAMA_AIRFORCE_DEFINITION.id;
  groupId = LLAMA_AIRFORCE_DEFINITION.groups.airdrop.id;
  network = Network.ETHEREUM_MAINNET;

  async resolveMerkleData() {
    const [{ data: uCrvData }, { data: uFxsData }, { data: uCvxData }] = await Promise.all([
      Axios.get<LlamaAirforceMerkleData>(
        'https://raw.githubusercontent.com/0xAlunara/Llama-Airforce-Airdrops/master/ucrv/latest.json',
      ),
      Axios.get<LlamaAirforceMerkleData>(
        'https://raw.githubusercontent.com/0xAlunara/Llama-Airforce-Airdrops/master/ufxs/latest.json',
      ),
      Axios.get<LlamaAirforceMerkleData>(
        'https://raw.githubusercontent.com/0xAlunara/Llama-Airforce-Airdrops/master/ucvx/latest.json',
      ),
    ]);

    const uCrvTokenAddress = '0x83507cc8c8b67ed48badd1f59f684d5d02884c81';
    const uFxsTokenAddress = '0xf964b0e3ffdea659c44a5a52bc0b82a24b89ce0e';
    const uCvxTokenAddress = '0x8659fc767cad6005de79af65dafe4249c57927af';

    return {
      [uCrvTokenAddress]: uCrvData.claims,
      [uFxsTokenAddress]: uFxsData.claims,
      [uCvxTokenAddress]: uCvxData.claims,
    };
  }
}
