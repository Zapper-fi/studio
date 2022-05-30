import { DiscoveryService } from '@nestjs/core';

export type Registry<T extends any[], U> = T extends [head: infer V, ...tail: infer Tail_]
  ? Map<V, Registry<Tail_, U>>
  : U;

export const buildRegistry = <T extends any[], U>(
  discovery: DiscoveryService,
  metadataKeys: string[],
  filterKeys: string[] = [],
) => {
  const wrappers = discovery.getProviders();
  const matchable = wrappers.filter(wrapper => !!wrapper.metatype);
  const allKeys = [...metadataKeys, ...filterKeys];
  const matched = matchable.filter(wrapper => allKeys.every(k => Reflect.getMetadata(k, wrapper.metatype)));

  const registry = matched.reduce((acc, wrapper) => {
    let node = acc;

    // Trace through the registry tree with the metadata to set
    for (let i = 0; i < metadataKeys.length; i++) {
      const next = i === metadataKeys.length - 1 ? wrapper.instance : new Map();
      const value = Reflect.getMetadata(metadataKeys[i], wrapper.metatype);

      if (!node.get(value)) node.set(value, next);
      node = node.get(value);
    }

    return acc;
  }, new Map());

  return registry as Registry<T, U>;
};
