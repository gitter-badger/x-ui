import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

// const scssVariables = 'src/scss/variables.scss';
export const config: Config = {
  namespace: 'x-ui',
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
      esmLoaderPath: 'loader',
    },
    // one file in es6
    {
      type: 'dist-custom-elements-bundle'
    },
    // creates readme.md for components
    {
      type: 'docs-readme',
    },
    // create components(.d.ts|json) into dist
    {
      type: 'docs-json',
      file: `dist/components.json`,
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
