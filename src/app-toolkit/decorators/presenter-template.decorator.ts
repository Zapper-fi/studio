import { Injectable } from '@nestjs/common';
import { Class } from 'type-fest';

import { getStack } from '~utils/stack';

import { getTemplateFragments } from './position-template.decorator';

export const PresenterTemplate = () => {
  return (target: Class<any>) => {
    const [, , , templateFile] = getStack();

    try {
      const { appId, network } = getTemplateFragments(templateFile.getFileName());
      target.prototype.appId = appId;
      target.prototype.network = network;
    } catch (e) {
      console.error(e);
    }

    return Injectable()(target);
  };
};
