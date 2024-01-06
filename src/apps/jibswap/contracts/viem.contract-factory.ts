
        import { Injectable, Inject } from '@nestjs/common';
        import { PublicClient } from 'viem';

        import { Network } from '~types/network.interface';
        import { IAppToolkit, APP_TOOLKIT } from '~app-toolkit/app-toolkit.interface';
        
        
        
        
        
        

        @Injectable()
        export class JibswapViemContractFactory {
          constructor(@Inject(APP_TOOLKIT) protected readonly appToolkit: IAppToolkit) {}

          
        }
      