import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

// const scssVariables = 'src/scss/variables.scss';
const { distDirs } = require('./package.json');

export const config: Config = {
  namespace: 'viewdo',
  buildEs5: false,
  plugins: [
    sass(),
  ],
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
    // create components(.d.ts|json) into docs
    {
      type: 'docs-json',
      file: `${distDirs.docs}/content/components.json`,
    },
    // create components(.d.ts|json) into www
    {
      type: 'docs-json',
      file: `www/components.json`,
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
      copy: [
        { src: 'index.html' },
        { src: '**/*.md' },
        { src: 'docs/**/*.*' },
      ],
    },
  ],
};
