import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import path from 'path';

import postcss from 'rollup-plugin-postcss';

const packageJson = require('./package.json');

const isProduction = process.env.NODE_ENV === 'production';

const deps = Object.keys(packageJson.dependencies || {});

const projectRootDir = path.resolve(__dirname);

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: !isProduction,
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: !isProduction,
      },
    ],
    watch: {
      clearScreen: false,
      include: 'src/**',
      exclude: [
        'node_modules/**',
        'dist/**',
        'examples/**',
        'src/**/*.stories.tsx',
      ],
    },
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        compilerOptions: {
          sourceMap: !isProduction,
          inlineSources: !isProduction,
          ...(!isProduction && { target: 'esnext' }),
        },
        exclude: ['stories/**/*.@(ts|tsx)'],
      }),
      isProduction &&
        terser({
          format: {
            comments: /^\s*([@#]__[A-Z]+__\s*$|@cc_on)/,
          },
        }),
      postcss({
        config: {
          path: './postcss.config.js',
        },
        extensions: ['.css'],
        minimize: isProduction,
        extract: false,
        inject: true,
      }),
    ],
    external: (id) => {
      const [pkg] = id.split('/');
      return deps.includes(pkg);
    },
  },
];
