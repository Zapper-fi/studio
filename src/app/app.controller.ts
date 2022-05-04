import { Controller, Get, Inject, NotFoundException, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';

@Controller('/apps')
export class AppController {
  constructor(@Inject(AppService) private readonly appService: AppService) {}

  @ApiTags('App Definitions')
  @ApiOperation({
    summary: 'Get all app definitions',
    description:
      'Retrieves all app definitions. An app definition includes information such as the groups, supported networks and so on.',
  })
  @Get()
  getApps() {
    return this.appService.getApps();
  }

  @ApiTags('App Definitions')
  @ApiOperation({
    summary: 'Get a single app definitions',
    description:
      'Retrieves a single app definition. An app definition includes information such as the groups, supported networks and so on.',
  })
  @Get(`/:appId`)
  getApp(@Param('appId') appId: string) {
    try {
      return this.appService.getApp(appId);
    } catch (e) {
      throw new NotFoundException(e.message);
    }
  }
}
