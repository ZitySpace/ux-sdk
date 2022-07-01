import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

import postcss from 'rollup-plugin-postcss';

const packageJson = require('./package.json');

const isProduction = process.env.NODE_ENV === 'production';

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
        format: 'es',
        sourcemap: !isProduction,
      },
    ],
    watch: {
      clearScreen: false,
      include: 'src/**',
      exclude: [
        'node_modules/**',
        'dist/**',
        'src/**/*.stories.tsx',
        'src/**/*.test.tsx',
        'src/**/examples/**',
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
        extract: 'index.css',
        inject: false,
      }),
    ],
    external: [
      'react',
      'react-dom',
      'echarts',
      'echarts-gl',
      'fabric',
      'rc-slider',
      'react-ace',
      'react-query',
    ],
  },
];
