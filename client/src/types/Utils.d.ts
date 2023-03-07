declare type KeysAndValuesOf<T> = T extends Record<infer K, infer V>
  ? {
      Keys: keyof Record<K, V>;
      Values: Record<K, V>[keyof Record<K, V>];
    }
  : never;
