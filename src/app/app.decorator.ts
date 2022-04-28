import { applyDecorators, Injectable, Module, ModuleMetadata, SetMetadata } from '@nestjs/common';
import { omit } from 'lodash';

export const APP_NAME = 'APP_NAME_V3';
export const APP_DEPENDENCIES = 'APP_DEPENDENCIES';
export const APP_ID = 'APP_ID';

export function AppDefinition(name: string) {
  return applyDecorators(SetMetadata(APP_NAME, name), Injectable);
}

export type AppModuleMetadata = ModuleMetadata & { appId: string };

export function AppModule(metadata: AppModuleMetadata) {
  return applyDecorators(SetMetadata(APP_ID, metadata.appId), Module(omit(metadata, 'appId')));
}
