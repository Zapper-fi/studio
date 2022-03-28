import { Module } from '@nestjs/common';

import { MyAppAppDefinition } from './my-app.definition';

@Module({
  providers: [MyAppAppDefinition],
})
export class MyAppAppModule {}
