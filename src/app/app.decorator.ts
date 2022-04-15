import { applyDecorators, Injectable, SetMetadata } from '@nestjs/common';

export const APP_NAME = 'APP_NAME_V3';

export function AppDefinition(name: string) {
  return applyDecorators(SetMetadata(APP_NAME, name), Injectable);
}
