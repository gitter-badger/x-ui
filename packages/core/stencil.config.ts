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
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: 'loader'
    },
    {
      type: 'dist-custom-elements-bundle',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'docs-json',
      file: `dist/components.json`
    },
    // create components(.d.ts|json) into www
    {
      type: 'docs-json',
      file: `../../www/data/x-components.json`,
    },
    {
      type: 'www',
      dir: '../../www',
      buildDir: 'x-ui',
      empty: false,
      serviceWorker: null, // disable service workers
      copy: [
        { src: 'docs' },
        {
          src: 'components/**/*.md',
          dest: 'docs',
          keepDirStructure: true
        },
        {
          src: 'services/**/*.md',
          dest: 'docs',
          keepDirStructure: true
        },
      ],
    },
  ],
};
