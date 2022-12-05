import { Abstract } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';

export type Registry<T extends ReadonlyArray<unknown>, U> = T extends readonly [infer Head, ...infer Tail]
  ? Map<Head, Registry<Tail, U>>
  : U;

export const buildTemplateRegistry = <T extends ReadonlyArray<unknown>, U>(
  discovery: DiscoveryService,
  {
    template,
    keySelector,
  }: {
    template: Abstract<U>;
    keySelector: (instance: U) => T;
  },
) => {
  const wrappers = discovery.getProviders();
  const matched = wrappers.filter(wrapper => !!wrapper.metatype && wrapper.instance instanceof template);

  const registry = matched.reduce((acc, wrapper) => {
    let node = acc;
    const metadataKeys = keySelector(wrapper.instance);

    // Trace through the registry tree
    for (let i = 0; i < metadataKeys.length; i++) {
      const value = metadataKeys[i];
      const next = i === metadataKeys.length - 1 ? wrapper.instance : new Map();

      if (!node.get(value)) node.set(value, next);
      node = node.get(value);
    }

    return acc;
  }, new Map());

  return registry as Registry<T, U>;
};
