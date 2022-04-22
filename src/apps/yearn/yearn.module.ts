import { Module } from '@nestjs/common';

import { AbstractDynamicApp } from '~app/app.dynamic-module';

import { YearnContractFactory } from './contracts';
import { YearnLikeVaultTokenHelper } from './helpers/yearn-like.vault.token-helper';
import { YearnVaultTokenDefinitionsResolver } from './helpers/yearn.vault.token-definitions-resolver';
import { YearnVaultTokenHelper } from './helpers/yearn.vault.token-helper';

@Module({
  providers: [YearnVaultTokenHelper, YearnLikeVaultTokenHelper, YearnVaultTokenDefinitionsResolver],
  exports: [YearnLikeVaultTokenHelper, YearnContractFactory],
})
export class YearnAppModule extends AbstractDynamicApp<YearnAppModule>() {}
