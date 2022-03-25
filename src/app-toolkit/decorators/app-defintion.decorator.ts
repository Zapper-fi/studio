import { applyDecorators, Injectable, SetMetadata } from '@nestjs/common';

export const APP_V3_NAME = 'APP_NAME_V3';

export function AppDefinition(name: string) {
  return applyDecorators(SetMetadata(APP_V3_NAME, name), Injectable);
}
