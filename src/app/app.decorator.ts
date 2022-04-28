import { applyDecorators, Injectable, Module, ModuleMetadata, SetMetadata } from '@nestjs/common';
import { omit } from 'lodash';

export const APP_NAME = 'APP_NAME_V3';
export const APP_DEPENDENCIES = 'APP_DEPENDENCIES';
export const APP_ID = 'APP_ID';

export function AppDefinition(name: string) {
  return applyDecorators(SetMetadata(APP_NAME, name), Injectable);
}

export function AppModule(metadata: ModuleMetadata) {
  const stack = new Error().stack!.split('\n');
  const callSite = stack[2].slice(stack[2].lastIndexOf('(') + 1, stack[2].lastIndexOf(')'));
  const appId = callSite.split('/').reverse()[1];
  return applyDecorators(SetMetadata(APP_ID, appId), Module(omit(metadata, 'appId')));
}
