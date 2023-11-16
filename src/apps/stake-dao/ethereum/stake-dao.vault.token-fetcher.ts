import { Inject } from '@nestjs/common';

import { APP_TOOLKIT, IAppToolkit } from '~app-toolkit/app-toolkit.interface';
import { PositionTemplate } from '~app-toolkit/decorators/position-template.decorator';
import { AppTokenTemplatePositionFetcher } from '~position/template/app-token.template.position-fetcher';
import { GetUnderlyingTokensParams } from '~position/template/app-token.template.types';

import { StakeDaoViemContractFactory } from '../contracts';
import { StakeDaoVault } from '../contracts/viem';

@PositionTemplate()
export class EthereumStakeDaoVaultTokenFetcher extends AppTokenTemplatePositionFetcher<StakeDaoVault> {
  groupLabel = 'Vaults';

  constructor(
    @Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit,
    @Inject(StakeDaoViemContractFactory) protected readonly contractFactory: StakeDaoViemContractFactory,
  ) {
    super(appToolkit);
  }

  getContract(address: string) {
    return this.contractFactory.stakeDaoVault({ address, network: this.network });
  }

  getAddresses() {
    return [
      '0x41bd96ad3cb2a96329a88559e055e56bd559461b', // TricryptoLLAMA
      '0xd935a972758342c8807cf99870eebca8108b4fbf', // frxETH
      '0xdd007cb6005017e548c761c2d12d9aa03961c30a', // STG/USDC
      '0x5a76a7fd20dde55cecefb0803ac3a1051c954eaa', // TricryptoUSDC
      '0x2d1bd6ba23f587abcb405bce008839c8978c5222', // TricryptoUSDT
      '0x37b24ac19504c0c6fc1adc8deb5d24f5c4f6a2f2', // crvUSD/USDT
      '0xbc61f6973ce564effb16cd79b5bc3916ead592e2', // UZD/FRAXBP
      '0x11d87d278432bb2ca6ce175e4a8b4abdade80fd0', // FRAX/USDC
      '0x04718089aa7574785f0ae88d53c19f4df43a4de8', // cvxCRV/CRV
      '0x1513b44a589ffc76d0727968eb55da4110b39422', // SDT/ETH
      '0x5d0cc286fc6282c50ddfcb997ecca35e77a10650', // sdCRV/CRV
      '0xb618ea40cb1f5b08839ba228c8dd58ac3dca12f3', // crvUSD/USDC
      '0x41bd96ad3cb2a96329a88559e055e56bd559461b', // TricryptoLLama
      '0xa0022debeb2275cf05b9c659493f89efe3ab89a6', // Arrakis agEUR/ETH LP
      '0x199faf9aeb75764d08d761e77a188c97ca0f04ea', // dETH/frxETH
      '0x98dd95d0ac5b70b0f4ae5080a1c2eea8c5c48387', // MIM
      '0xd4ed44aa0ac185ad3024f5433442d9aef4b39ed8', // XAI/FRAX
      '0xc60347f8dab2511326981710c689da9f7fe4e375', // ETH+/ETH
      '0x3ea0ad89b647b14c44906d2abe7ba04470c86736', // crvUSD/DOLA
      '0x035652a14e27de1d7ca36bff0c4dfc3e2f0749b4', // stETH
      '0xcbb7e515154e2d746e0afbe1a4c3c7d1b5f87faa', // WETH/frxETH
      '0xd1861b79f54edb964e28aa3c6a3f4282b0751243', // crvUSD/frxETH+SDT
      '0x0cbd1fb1c170ddcf1fd945f50429f84f94e670f8', // Sushi agEUR/ANGLE LP
      '0xd59b663cc1e758f546658dc4649e8724720872fd', // ALUSDFRAX
      '0x903f3c7b4c3b18df9a06157f9fd5176e6a1fde68', // Tricrypto2
      '0x7ca0a95c96cd34013d619effcb02f200a031210d', // sdBAL/B-80BAL-20WETH
      '0xe67b54bf07f5dfd3c7a992627f6bb8c35b239fb4', // StaFi-rETH/ETH
      '0x27da51e2d9e5fd70fb6a27dd2976377827e52884', // crvUSD/FRAX
      '0xde46532a49c88af504594f488822f452b7fbc7bd', // agEUR/EUROC
      '0xd20467794b11ba1ef8bfa1d28a62fc3681683a0a', // USDC+USDC+
      '0xb764840e187272b64494f7088932b2a2e14f9a7a', // hyUSD/eUSD
      '0x9c6c4959739b3eb9bfc89622b35a5a1064b875f5', // TriCRV
      '0xd6415ff2639835300ab947fe67bad6f0b31400c1', // sdCRV/CRV
      '0x2cfe0e7b0eff280d74c2f406c05511b9b7c72549', // sdANGLE/ANGLE
      '0x68e5001da84b87581484c0c204140b6c439f2245', // LDO/ETH
      '0x8881c497f6f5f2cecd0742c37c6840bcf5234535', // sanUSDC
      '0xd9663a5e08f0b3db295c5346c1b52677b7398585', // baoUSD/LUSD
      '0x85c1f8c9a401ea5091b7eac0de01c84f831d5d49', // COIL/FRAXBP
      '0x450f23e276f6bb63de231e3a5bec382b99444d80', // crvUSC+STBT
      '0xc880128758b3dd19ceb29f72d3dcabf8887f0681', // stETH 26/12/2024
      '0xc4218a70bec9328278d8f1cd4f01b3c56cd162ba', // Stafi rETH-WETH 27/06/24
      '0xe793d86bd201bdbf6ca0d594271b3b118f599196', // sdYFI/YFI
      '0x7b42852eae151b7ab46d6a9d4a049019c818231f', // crvUSD/TUSD
      '0x4c37680eb50e1ca2f6cfb77a4dd58f932d7818c5', // TRYB/USD
      '0x91c460c99fc83cd817d646977fb2ec29da6b951a', // crvUSD/GUSD
      '0xb9205784b05fbe5b5298792a24c2cb844b7dc467', // 3 Pool
      '0xd1861b79f54edb964e28aa3c6a3f4282b0751243', // crvUSD+frxETH+SD
      '0x9e2e1dca29feb74505de0da8d08ee846b1146027', // COW/ETH
      '0x1bd865ba36a510514d389b2ea763bad5d96b6ff9', // sanFRAX
      '0x13cb956866fd76636383d7b769f08c64bbe81d6c', // sdYFI/YFI
      '0xe8310ae8ff61e191356823b6bc3872c30ac850f3', // sdANGLE/ANGLE
      '0x94c68501f02c9da94512cb47968d57af0da766f9', // 3EUR
      '0x3261631cc57768f3edc325f43480a0c2a2e9dab6', // crvUSD+stUSDT
      '0x49c1a638de9ef6fd2740a30d4c2fb3c8b2e3768d', // sdFXS/FXS
      '0x061e0353dc1fefcd5b21c5570cb528d1a1342d66', // FXN+sdFXN
      '0x43cb3d038b09593ba1ddb749efa7e6d3c1370aaa', // RAI3CRV
      '0x40cbbe087e7ac6d42896d60b9e00ee02da9d5b25', // fETH+FRAXBP
      '0x832af84a3012a5f804002fc6dbb4f53e00c72f4e', // CNCETH
      '0x70d4556729efb02247037bea3a9c469573a96de1', // SDT/FRAXBP
      '0x51cfa9a05058390cd3dc6eb0a0488ff557eb66aa', // sdFXS/FXS
      '0x97ba0311babab0ccde141d9fe52f8826547509a5', // FRAX3CRV
      '0xa73faf1e4db7cc3deb0726ee1221c50397a3e16e', // crvUSD/MAI
      '0x069ae6419a4e040243e223cc643f1612f5e4cf1f', // crvUSD/USDP
      '0x9ab7b153565fbafa2224c79fc237b7d9c157463f', // stETH 25/12/2025
      '0xbef443c49afcea6773329562fe1660c2c98dd2f8', // yCRV v2
      '0xefb5a00c3f7c732d12ca7d937cb6167913d17b31', // rETH
      '0x391ec41f9ac7e16d6a1e286a9807de61e702ef1f', // BADGER/WBTC
      '0x16caaf6f8208fa11e0ea077fc70316774476f291', // PUSd+FRAXBP
      '0x3b26d78812ddc7679485701f5a3fcfc1735be76d', // crvUSD/sUSD
      '0x058275e934174d40037fecf2daa7611f372a3729', // clevCVX/CVX
      '0xd3731d9571f63fc5950a295ca90b092cd4033f55', // ETHx+frxETH
      '0x9cd237e0aafeaea71b8684b7dd6867c4c0fd8f63', // stETH 30/12/2027
      '0x6145d4e396b2adb76f7a5aa369e25cc2cef95703', // sBTC2
      '0xc625402960f453c09bb80c40e2e9c649daf49177', // EUROC3CRV
      '0x8194d5d07dc7b6354ecf1efd96755f01454870aa', // EUROPool
      '0x20370d3c0241b9899ef13e1dd5191506348f7680', // crUSDC+FRAXBP
      '0x4bef7cac19b256b37415aa03c29de7a12fb18be9', // PAL/ETH
      '0xfb5312107c4150c86228e8fd719b8b0ae2db581d', // LUSD
      '0x7c3420d06fc78e2fdc8ca42dd890f77cc8c5f2a8', // TBTC2
      '0x35e27b68c75e5b6431b823ceb664537b91e87ffe', // sanDAI
      '0xa90755727aac633bd1a189121922d0ea3b49974c', // OGVETH
      '0x6c1b9a168dcc7bdbed92621d1c7d84f58c04d7ff', // WETH/FEI
      '0xf95722dc6b84495923cf201a91b1ab20bdfbc975', // ETH+FXN
      '0x7dbab34cfaccf4aabac9d5ec298497dc252e2920', // wstETH/WETH
      '0xada7ccb62331737d77a3950ac253f333de260318', // sfrxETH-stETH-rETH-BPT
      '0xa6538eeed7579e5da0b7bcb2b3186e0c5eebc54d', // sETH
      '0xf6bccd68d12223349dfa2c500d89ccd075adc430', // DYDX/ETH
      '0x5da5228d95653b5c2c082c53a5e83112e8114aa4', // Compound
      '0x2d40fadca899da8636e064b8d25f93e972d4f4dd', // ALCX/FRAXBP
      '0x231bcdae916daf34686f85f372ac51d0c0afa08d', // BADGER/WBTC
      '0xff01ea43b164452754968b362e8fbd876bf57fdb', // OETH
      '0x2b59f2711df8b73736d043a1aa3d23840da3ee31', // MAI/USDC
      '0xe594001a80685e70e9e6357fd85136728feff111', // GEAR/ETH
      '0x7894c2cb6b29892c0675c1b7d488e4efb59a658b', // LDO/WETH
      '0x077741779b482f4cbd6e91f9c939f7ea2d761c4d', // DOLA3POOL
      '0xf50d0d94ef9c40f06645d274945d7ca6aef18f84', // PYUSD+FRAXBP
      '0x48ec7b470de85564d839293a2bf41a6fcba30811', // VITA/WETH
      '0x9fc8bb6b851e495b868f1f4826b4665422727466', // WETH/DAI
      '0xa2742cecf2f4c315d96e9420fa4dd2f58bdc3c08', // crvUSD/MIM
      '0x4673b50d9419ada1d2581d714cf9f2c04e1d35e9', // crvUSD/GHO
      '0xac723a9eb4ddb0f7d55cc175c49a407d9f590ec6', // agEUR/FRAXBP
      '0x8904daca6c2f39e0c4d99d72e7bfccd15d73811c', // IronBank
      '0xc34487651feab5919fe128a0fc186f39a7d0c681', // WETH/LINK
      '0x45f492751e88497b6c38fe4e8920307532699f79', // yCRV
      '0x42a83d2935224fd93fabcd92c032dd5661675198', // 80palStkAAVE-20AAVE
      '0xb686cb269409b8431cce19412b3e57d0a146c674', // OHM/ETH
      '0xf2f19314f693b5d4dc12a578272464d138684d38', // RETH/WETH
      '0x34cee8e574e78c3269d96768bf873f133c14b640', // hBTC
      '0x2f3fc84df1e44f3cb5227f54617a20098b5a1735', // WBTC/WETH
      '0xb4d704b6d3dedefcea4b384da189ba7bd250127d', // pitchFXS/FXS
      '0x2c33d8a09c6f47b2446884e0eb8e783eca31fa12', // SILO/FRAX
      '0xa99ce10312b55dc145c56e1960e6b5f713c25280', // WETH/YFI
      '0xfb2a5d65e41f023a5f805b94f07fcb16c67799ef', // SUSDFRAXBP
      '0xc25d747e93003807cea17cd8c16528f98602da25', // FPI2Pool
      '0x9b1b7a318c2511ab53c5bd06caec18540819a238', // GNO/WETH
      '0xbac96b9411c11844fc525323c5261550e62dfd4d', // USDC/WETH
      '0xe6abcc59cdf31dc09ee856395dd46e21665b4d09', // cvxCRV
      '0x059d3a4c6ce6d1454219ad118d14c16ad66bb47b', // USDP3CRV
      '0xc6aa301d1eff676229aa2738577dd7ff5b9f6be6', // SNX/WETH
      '0x6b03e9c8e8d2d8a8c21a090e9d363d3d0bf2ee19', //USDDFRAXBP
      '0x70cefc71e988309c8361f64ec21d1bbf6097762c', // alUSD
      '0x76cd1dcc429c2a7ccdb01564fd1bd0c0ceb1de90', // OHM/FRAXBP
      '0xed2c4c7518e0a9cb70da8aa89e58efa04cac59c9', // CREAM/WETH
      '0xf106cd073fc25ad42c7617d2f1630e538e9bd736', // YFI/ETH
    ];
  }

  async getUnderlyingTokenDefinitions({ contract }: GetUnderlyingTokensParams<StakeDaoVault>) {
    return [{ address: await contract.read.token(), network: this.network }];
  }

  async getPricePerShare() {
    return [1];
  }
}
