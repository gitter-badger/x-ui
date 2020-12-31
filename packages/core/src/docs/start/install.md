## Install with NPM

If you want library assets to be local to your application, you have a build-process or framework for your web-application, install it.


### 1. Install the NPM package.

````bash
  npm i @viewdo/x-ui
````

### 2. Add the script tags to the head

````html
<head>
  ...
  <script type="module" src="/node_modules/@viewdo/ui/dist/viewdo.esm.js"></script>
  <script nomodule src="/node_modules/@viewdo/ui/dist/viewdo.js"></script>
  ...
</head>
````
