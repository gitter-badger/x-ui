import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import nodePolyfills from 'rollup-plugin-node-polyfills';

// const scssVariables = 'src/scss/variables.scss';
const { distDirs } = require('./package.json');

export const config: Config = {
  namespace: 'viewdo',
  buildEs5: false,
  plugins: [
    sass(),
  ],
  rollupPlugins: {
    after: [
      nodePolyfills({
        include: 'crypto',
      }),
    ],
  },
  globalStyle: 'src/global/app.scss',
  globalScript: 'src/global/app.ts',
  devServer: {
    openBrowser: false,
    reloadStrategy: 'pageReload',
    port: 3333,
  },
  watch: true,
  outputTargets: [
    // creates /dist dir
    {
      type: 'dist',
      dir: distDirs.stencil,
      esmLoaderPath: 'loader',
      // copy: [
      //   // copy fonts into static for storybook and stencil build
      //   { src: 'fonts' },
      // ],
    },
    // one file in es6
    {
      type: 'dist-custom-elements-bundle',
      dir: distDirs.stencil,
    },
    // creates readme.md for components
    {
      type: 'docs-readme',
    },
    // create components(.d.ts|json) into dist
    {
      type: 'docs-json',
      file: `${distDirs.stencil}/components.json`,
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
      copy: [
        { src: '**/*.md' },
        { src: '**/*.html' },
      ],
    },
  ],
};
