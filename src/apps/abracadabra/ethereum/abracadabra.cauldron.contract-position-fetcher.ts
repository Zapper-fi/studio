import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';

import {
  AbracadabraCauldronContractPositionDefinition,
  AbracadabraCauldronContractPositionFetcher,
} from '../common/abracadabra.cauldron.contract-position-fetcher';

@PositionTemplate()
export class EthereumAbracadabraCauldronContractPositionFetcher extends AbracadabraCauldronContractPositionFetcher {
  groupLabel = 'Cauldrons';
  cauldrons: AbracadabraCauldronContractPositionDefinition[] = [
    { version: 'V1', risk: 'LOW', type: 'REGULAR', address: '0x6cbafee1fab76ca5b5e144c43b3b50d42b7c8c8f' }, // yvUSDC (deprecated)
    { version: 'V1', risk: 'LOW', type: 'REGULAR', address: '0x551a7cff4de931f32893c928bbc3d25bf1fc5147' }, // yvUSDT (deprecated)
    { version: 'V1', risk: 'MEDIUM', type: 'REGULAR', address: '0xbb02a884621fb8f5bfd263a67f58b65df5b090f3' }, // xSUSHI (deprecated)
    { version: 'V1', risk: 'MEDIUM', type: 'REGULAR', address: '0x6ff9061bb8f97d948942cef376d98b51fa38b91f' }, // yvWETH (deprecated)
    { version: 'V1', risk: 'MEDIUM', type: 'REGULAR', address: '0xffbf4892822e0d552cff317f65e1ee7b5d3d9ae6' }, // yvYFI (deprecated)
    { version: 'V2', type: 'REGULAR', address: '0xc1879bf24917ebe531fbaa20b0d05da027b592ce' }, // AGLD
    { version: 'V2', type: 'REGULAR', address: '0x7b7473a76d6ae86ce19f7352a1e89f6c9dc39020' }, // ALCX
    { version: 'V2', type: 'REGULAR', address: '0x05500e2ee779329698df35760bedcaac046e7c27' }, // FTM
    { version: 'V2', type: 'REGULAR', address: '0x003d5a75d284824af736df51933be522de9eed0f' }, // wsOHM
    { version: 'V2', type: 'REGULAR', address: '0x98a84eff6e008c5ed0289655ccdca899bcb6b99f' }, // xSUSHI v3
    { version: 'V2', type: 'REGULAR', address: '0x0bf90b3b5cad7dfcf70de198c498b61b3ba35cff' }, // xSUSHI v2
    { version: 'V2', type: 'REGULAR', address: '0xebfde87310dc22404d918058faa4d56dc4e93f0a' }, // yvcrvIB
    { version: 'V2', type: 'REGULAR', address: '0x0bca8ebcb26502b013493bf8fe53aa2b1ed401c1' }, // yvstETH (deprecated)
    { version: 'V2', type: 'REGULAR', address: '0x920d9bd936da4eafb5e25c6bdc9f6cb528953f9f' }, // yvWETH
    { version: 'V2', type: 'REGULAR', address: '0x5db0ebf9feeecfd0ee82a4f27078dbce7b4cd1dc' }, // sSPELL
    { version: 'V2', type: 'REGULAR', address: '0xc319eea1e792577c319723b5e60a15da3857e7da' }, // sSPELL v2 (deprecated)
    { version: 'V2', type: 'REGULAR', address: '0x3410297d89dcdaf4072b805efc1ef701bb3dd9bf' }, // sSPELL v3
    { version: 'V2', type: 'REGULAR', address: '0x252dcf1b621cc53bc22c256255d2be5c8c32eae4' }, // SHIB
    { version: 'V2', type: 'REGULAR', address: '0x9617b633ef905860d919b88e1d9d9a6191795341' }, // FTT
    { version: 'V2', type: 'REGULAR', address: '0xcfc571f3203756319c231d3bc643cee807e74636' }, // SPELL (DegenBox)
    { version: 'V2', type: 'REGULAR', address: '0xbc36fde44a7fd8f545d459452ef9539d7a14dd63' }, // UST V1 (deprecated)
    { version: 'V2', type: 'REGULAR', address: '0x59e9082e068ddb27fc5ef1690f9a9f22b32e573f' }, // UST V2 (deprecated)
    { version: 'V2', type: 'REGULAR', address: '0x390db10e65b5ab920c19149c919d970ad9d18a41' }, // WETH
    { version: 'V2', type: 'REGULAR', address: '0x5ec47ee69bede0b6c2a2fc0d9d094df16c192498' }, // WBTC
    { version: 'V2', type: 'REGULAR', address: '0xf179fe36a36b32a4644587b8cdee7a23af98ed37' }, // yvCVXETH
    { version: 'V2', type: 'CONVEX', address: '0x4eaed76c3a388f4a841e9c765560bbe7b3e4b3a0' }, // cvxTricrypto2
    { version: 'V2', type: 'CONVEX', address: '0x806e16ec797c69afa8590a55723ce4cc1b54050e' }, // cvx3Pool (deprecated)
    { version: 'V2', type: 'CONVEX', address: '0x6371efe5cd6e3d2d7c477935b7669401143b7985' }, // cvx3pool (deprecated)
    { version: 'V2', type: 'CONVEX', address: '0x257101f20cb7243e2c7129773ed5dbbcef8b34e0' }, // cvx3pool
    { version: 'V3', type: 'REGULAR', address: '0x7ce7d9ed62b9a6c5ace1c6ec9aeb115fa3064757' }, // yvDAI
    { version: 'V3', type: 'REGULAR', address: '0xd31e19a0574dbf09310c3b06f3416661b4dc7324' }, // Stargate USDC
    { version: 'V3', type: 'REGULAR', address: '0xc6b2b3fe7c3d7a6f823d9106e22e66660709001e' }, // Stargate USDT
    { version: 'V3', type: 'REGULAR', address: '0x53375add9d2dfe19398ed65baaeffe622760a9a6' }, // yvstETH Concentrated (deprecated)
    { version: 'V3', type: 'REGULAR', address: '0x8227965a7f42956549afaec319f4e444aa438df5' }, // LUSD
    { version: 'V4', type: 'REGULAR', address: '0x207763511da879a900973a5e092382117c3c1588' }, // CRV
    { version: 'V4', type: 'REGULAR', address: '0x85f60d3ea4e86af43c9d4e9cc9095281fc25c405' }, // Migrated WBTC
    { version: 'V4', type: 'REGULAR', address: '0x7259e152103756e1616a77ae982353c3751a6a90' }, // yvCrv3Crypto
    { version: 'V4', type: 'REGULAR', address: '0x1062eb452f8c7a94276437ec1f4aaca9b1495b72' }, // Stargate USDT (POF)
    { version: 'V4', type: 'REGULAR', address: '0x692887e8877c6dd31593cda44c382db5b289b684' }, // magicAPE
    { version: 'V4', type: 'REGULAR', address: '0x7d8df3e4d06b0e19960c19ee673c0823beb90815' }, // CRV V2
    { version: 'POD', type: 'REGULAR', address: '0xedcf198bc94ddcabb21dbeb38ad9f9793208f12a' }, // Protocol Owned Debt
  ];
}
