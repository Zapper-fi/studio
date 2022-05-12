import inquirer from 'inquirer';

import { AppTag } from '../../src/app/app.interface';
import { Network } from '../../src/types/network.interface';

export const promptAppName = async () => {
  return inquirer
    .prompt<{ name: string }>({
      name: 'name',
      message: 'What is the name of your app?',
      validate: v => {
        if (v.length === 0) return 'App name is required';
        return true;
      },
    })
    .then(v => v.name);
};

export const promptAppDescription = async () => {
  return inquirer
    .prompt<{ description: string }>({
      name: 'description',
      message: 'What is the description of your app?',
      validate: v => {
        if (v.length === 0) return 'Description is required';
        return true;
      },
    })
    .then(v => v.description);
};

export const promptAppUrl = async () => {
  return inquirer
    .prompt<{ url: string }>({
      name: 'url',
      message: 'What is the URL of your app?',
      validate: v => {
        if (v.length === 0) return 'URL is required';
        return true;
      },
    })
    .then(v => v.url);
};

export const promptAppNetwork = async networks => {
  return inquirer
    .prompt<{ network: Network }>({
      name: 'network',
      message: 'Select a network',
      type: 'list',
      choices: networks,
    })
    .then(v => v.network);
};

export const promptAppNetworks = async () => {
  return inquirer
    .prompt<{ networks: Network[] }>({
      name: 'networks',
      message: 'Select (at least one) network supported by the app',
      type: 'checkbox',
      choices: Object.values(Network)
        .filter(v => v !== Network.BITCOIN_MAINNET)
        .map(name => ({ name })),
      validate: v => {
        if (v.length === 0) return 'At least one network is required';
        return true;
      },
    })
    .then(v => v.networks);
};

export const promptAppTags = async () => {
  return inquirer
    .prompt<{ tags: AppTag[] }>({
      name: 'tags',
      message: 'Select (at least one) tag representing your app',
      type: 'checkbox',
      choices: Object.values(AppTag).map(name => ({ name })),
      validate: v => {
        if (v.length === 0) return 'At least one tag is required';
        return true;
      },
    })
    .then(v => v.tags);
};

export const promptAppGroupId = async (groupIds: string[]) => {
  return inquirer
    .prompt<{ groupId: string | null }>({
      name: 'groupId',
      message: 'Select an existing group or create new:',
      type: 'list',
      choices: [...groupIds.map(name => ({ name })), { name: 'Create New', value: null }],
    })
    .then(v => v.groupId);
};

export const promptNewGroupId = async () => {
  return inquirer
    .prompt<{ groupId: string }>({
      name: 'groupId',
      message: 'What is the ID of the group?',
      type: 'input',
      validate: v => {
        if (/[a-z0-9]+(?:-[a-z0-9]+)*/.test(v)) return true;
        return 'ID must be kebab-case';
      },
    })
    .then(v => v.groupId);
};

export const promptNewGroupLabel = async () => {
  return inquirer
    .prompt<{ groupLabel: string }>({
      name: 'groupLabel',
      message: 'What is the label of the group?',
      type: 'input',
    })
    .then(v => v.groupLabel);
};
