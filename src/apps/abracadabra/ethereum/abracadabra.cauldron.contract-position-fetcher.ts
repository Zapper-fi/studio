import { Inject } from '@nestjs/common';

import { Register } from '~app-toolkit/decorators';
import { CURVE_DEFINITION } from '~apps/curve';
import { OLYMPUS_DEFINITION } from '~apps/olympus';
import { YEARN_DEFINITION } from '~apps/yearn/yearn.definition';
import { PositionFetcher } from '~position/position-fetcher.interface';
import { ContractPosition } from '~position/position.interface';
import { Network } from '~types/network.interface';

import { ABRACADABRA_DEFINITION } from '../abracadabra.definition';
import { AbracadabraCauldronContractPositionHelper } from '../helpers/abracadabra.cauldron.contract-position-helper';

const CAULDRONS = [
  '0xc1879bf24917ebe531fbaa20b0d05da027b592ce', // AGLD
  '0x7b7473a76d6ae86ce19f7352a1e89f6c9dc39020', // ALCX
  '0x05500e2ee779329698df35760bedcaac046e7c27', // FTM
  '0x003d5a75d284824af736df51933be522de9eed0f', // wsOHM
  '0x98a84eff6e008c5ed0289655ccdca899bcb6b99f', // xSUSHI v3
  '0x0bf90b3b5cad7dfcf70de198c498b61b3ba35cff', // xSUSHI v2
  '0xbb02a884621fb8f5bfd263a67f58b65df5b090f3', // xSUSHI (deprecated)
  '0xebfde87310dc22404d918058faa4d56dc4e93f0a', // yvcrvIB
  '0x0bca8ebcb26502b013493bf8fe53aa2b1ed401c1', // yvstETH
  '0x6cbafee1fab76ca5b5e144c43b3b50d42b7c8c8f', // yvUSDC (deprecated)
  '0x551a7cff4de931f32893c928bbc3d25bf1fc5147', // yvUSDT (deprecated)
  '0x6ff9061bb8f97d948942cef376d98b51fa38b91f', // yvWETH (deprecated)
  '0x920d9bd936da4eafb5e25c6bdc9f6cb528953f9f', // yvWETH
  '0xffbf4892822e0d552cff317f65e1ee7b5d3d9ae6', // yvYFI (deprecated)
  '0x5db0ebf9feeecfd0ee82a4f27078dbce7b4cd1dc', // sSPELL
  '0xc319eea1e792577c319723b5e60a15da3857e7da', // sSPELL v2 (deprecated)
  '0x3410297d89dcdaf4072b805efc1ef701bb3dd9bf', // sSPELL v3
  '0x4eaed76c3a388f4a841e9c765560bbe7b3e4b3a0', // cvxTricrypto2
  '0x35a0dd182e4bca59d5931eae13d0a2332fa30321', // cvxRenCrv
  '0x252dcf1b621cc53bc22c256255d2be5c8c32eae4', // SHIB
  '0x9617b633ef905860d919b88e1d9d9a6191795341', // FTT
  '0xcfc571f3203756319c231d3bc643cee807e74636', // SPELL (DegenBox)
  '0x806e16ec797c69afa8590a55723ce4cc1b54050e', // cvx3Pool (deprecated)
  '0x6371efe5cd6e3d2d7c477935b7669401143b7985', // cvx3pool (deprecated)
  '0x257101f20cb7243e2c7129773ed5dbbcef8b34e0', // cvx3pool
  '0xbc36fde44a7fd8f545d459452ef9539d7a14dd63', // UST V1 (Deprecated)
  '0x59e9082e068ddb27fc5ef1690f9a9f22b32e573f', // UST V2
  '0x390db10e65b5ab920c19149c919d970ad9d18a41', // WETH
  '0x5ec47ee69bede0b6c2a2fc0d9d094df16c192498', // WBTC
  '0xf179fe36a36b32a4644587b8cdee7a23af98ed37', // yvCVXETH
  '0x7ce7d9ed62b9a6c5ace1c6ec9aeb115fa3064757', // yvDAI
  '0xd31E19A0574dBF09310c3B06f3416661B4Dc7324', // Stargate USDC
  '0xc6b2b3fe7c3d7a6f823d9106e22e66660709001e', // Stargate USDT
];

const appId = ABRACADABRA_DEFINITION.id;
const groupId = ABRACADABRA_DEFINITION.groups.cauldron.id;
const network = Network.ETHEREUM_MAINNET;

@Register.ContractPositionFetcher({ appId, groupId, network })
export class EthereumAbracadabraCauldronContractPositionFetcher implements PositionFetcher<ContractPosition> {
  constructor(
    @Inject(AbracadabraCauldronContractPositionHelper)
    private readonly abracadabraCauldronContractPositionHelper: AbracadabraCauldronContractPositionHelper,
  ) {}

  async getPositions() {
    return this.abracadabraCauldronContractPositionHelper.getContractPositions({
      cauldronAddresses: CAULDRONS,
      network,
      dependencies: [
        { appId: ABRACADABRA_DEFINITION.id, groupIds: [ABRACADABRA_DEFINITION.groups.stakedSpell.id], network },
        { appId: CURVE_DEFINITION.id, groupIds: [CURVE_DEFINITION.groups.pool.id], network },
        { appId: OLYMPUS_DEFINITION.id, groupIds: [OLYMPUS_DEFINITION.groups.wsOhmV1.id], network },
        { appId: YEARN_DEFINITION.id, groupIds: [YEARN_DEFINITION.groups.vault.id], network },
        // @TODO: Migrate these over
        { appId: 'convex', groupIds: ['deposit'], network },
        { appId: 'sushiswap', groupIds: ['pool'], network },
        { appId: 'stargate', groupIds: ['pool'], network },
      ],
    });
  }
}
