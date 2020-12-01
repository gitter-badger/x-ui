import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

// const scssVariables = 'src/scss/variables.scss';
const { name, distDirs } = require('./package.json');

export const config: Config = {
  namespace: name,
  buildEs5: false,
  taskQueue: 'async',
  plugins: [
    sass(),
  ],
  globalStyle: 'src/global/app.scss',
  globalScript: 'src/global/app.ts',
  devServer: {
    openBrowser: false,
    reloadStrategy: 'hmr',
    port: 3333,
  },
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
    // creates readme.md for components in the documentation folder
    {
      type: 'docs-readme',
      dir: 'documentation',
    },
    // create components(.d.ts|json) into dist
    {
      type: 'docs-json',
      file: `${distDirs.stencil}/components.json`,
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
};
