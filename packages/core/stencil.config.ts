import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

// const scssVariables = 'src/scss/variables.scss';
export const config: Config = {
  namespace: 'x-ui',
  plugins: [
    sass(),
  ],
  bundles: [
    { components: ['x-ui', 'x-view', 'x-view-do', 'x-link', 'x-swipe'] },
    { components: [
      'x-audio-player',
      'x-audio-music-load',
      'x-audio-sound-load',
      'x-audio-music-action',
      'x-audio-sound-action']
    }
  ],
  preamble: 'view.DO 2021',
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
      esmLoaderPath: 'loader',
      empty: true,
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
        { src: 'docs', dest: './', keepDirStructure: true },
        {
          src: 'docs/*.html', dest: './'
        },
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
