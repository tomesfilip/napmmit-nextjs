import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ['next/core-web/vitals', 'next/typescript', 'prettier'],
    rules: {
      semi: 'error',
      quotes: ['error', 'double'],
      'import/no-unresolved': ['error', { caseSensitive: true }],
    },
  }),
];

export default eslintConfig;
