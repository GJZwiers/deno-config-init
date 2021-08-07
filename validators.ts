export interface Validator {
  pattern: RegExp;
}

export const validators: Validator[] = [
  {
    pattern: /\bmod$/,
  },
  {
    pattern: /(?<!dev_|\w)deps$/,
  },
  {
    pattern: /\bdev_deps$/,
  },
  {
    pattern: /\.(?:js|ts)$/,
  },
];
