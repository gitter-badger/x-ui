# Experience UI Documentation

Documentation for view.DO Experience UI Components using GatsbyJS and ReactJS. Automatically generates a full documentation PWA for our Web Components.

## 🚀 Quick start

1.  **Build components.**

    Navigate to the project folder and run the StencilJS build process:

    ```shell
    yarn build:stencil
    ```

1.  **Start developing.**

    Navigate to the docs and spin up the GatsbyJS server:

    ```shell
    cd docs/
    yarn develop
    ```

1.  **Open the source code and start editing!**

    Your site is now running at `http://localhost:8000`!

    _Note: You'll also see a second link: _`http://localhost:8000/___graphql`_. This is a tool you can use to experiment with querying your data. Learn more about using this tool in the [Gatsby tutorial](https://www.gatsbyjs.org/tutorial/part-five/#introducing-graphiql)._

    Open the `pure-web-components/docs/` directory in your code editor of choice and edit `src/pages/index.md`. Save your changes and the browser will update in real time!

## ⚙️ How it works

When you run `yarn develop` it copies over your built web components from the parent folder, then runs `gatsby develop` (which spins up a Gatsby powered development server).

Gatsby is setup to primarily use Markdown -- either directly from the component folders (the auto-generated Stencil docs) or inside Gatsby's `/pages/` directory. Gatsby will create a page for each component that has a Markdown file. And in the pages directory, you can find pages like the [site index](./src/pages/index.md), or [Getting Started guide](./src/pages/getting-started.md).

More info: https://github.com/whoisryosuke/gatsby-theme-stencil-docs

## Using Web Components

The Pure Web Components are imported into every Gatsby page, so you can use them in any Markdown, React/JS, or HTML file.

> If you use the Markdown syntax for tables, the Markdown compiler will automatically use the Pure Web Component version.

### Custom Components

There are also various custom components created to make writing and formatting documentation easier.

- `<page-header header={header} subheader={subheader}>` - Used for documentation page headings with a large heading and smaller subheader.

These components can be used anywhere in Markdown files, cannot be used in HTML files, or require importing of the component directly in React (e.g. `import PageHeader from '../components/pageHeader'`).

> You can create new components by adding them to [the Component Docs template](./src/templates/component-docs.js) that is used to render Markdown pages.

## 🧐 What's inside?

A quick look at the top-level files and directories you'll see in a Gatsby project.

    .
    ├── node_modules
    ├── src
    ├── .gitignore
    ├── .prettierrc
    ├── gatsby-browser.js
    ├── gatsby-config.js
    ├── gatsby-node.js
    ├── gatsby-ssr.js
    ├── LICENSE
    ├── package-lock.json
    ├── package.json
    └── README.md

1.  **`/node_modules`**: This directory contains all of the modules of code that your project depends on (npm packages) are automatically installed.

2.  **`/src`**: This directory will contain all of the code related to what you will see on the front-end of your site (what you see in the browser) such as your site header or a page template. `src` is a convention for “source code”.

3.  **`.gitignore`**: This file tells git which files it should not track / not maintain a version history for.

4.  **`.prettierrc`**: This is a configuration file for [Prettier](https://prettier.io/). Prettier is a tool to help keep the formatting of your code consistent.

5.  **`gatsby-browser.js`**: This file is where Gatsby expects to find any usage of the [Gatsby browser APIs](https://www.gatsbyjs.org/docs/browser-apis/) (if any). These allow customization/extension of default Gatsby settings affecting the browser.

6.  **`gatsby-config.js`**: This is the main configuration file for a Gatsby site. This is where you can specify information about your site (metadata) like the site title and description, which Gatsby plugins you’d like to include, etc. (Check out the [config docs](https://www.gatsbyjs.org/docs/gatsby-config/) for more detail).

7.  **`gatsby-node.js`**: This file is where Gatsby expects to find any usage of the [Gatsby Node APIs](https://www.gatsbyjs.org/docs/node-apis/) (if any). These allow customization/extension of default Gatsby settings affecting pieces of the site build process.

8.  **`gatsby-ssr.js`**: This file is where Gatsby expects to find any usage of the [Gatsby server-side rendering APIs](https://www.gatsbyjs.org/docs/ssr-apis/) (if any). These allow customization of default Gatsby settings affecting server-side rendering.

9.  **`LICENSE`**: Gatsby is licensed under the MIT license.

10. **`package-lock.json`** (See `package.json` below, first). This is an automatically generated file based on the exact versions of your npm dependencies that were installed for your project. **(You won’t change this file directly).**

11. **`package.json`**: A manifest file for Node.js projects, which includes things like metadata (the project’s name, author, etc). This manifest is how npm knows which packages to install for your project.

12. **`README.md`**: A text file containing useful reference information about your project.

## 🎓 Learning Gatsby

Looking for more guidance? Full documentation for Gatsby lives [on the website](https://www.gatsbyjs.org/). Here are some places to start:

- **For most developers, we recommend starting with our [in-depth tutorial for creating a site with Gatsby](https://www.gatsbyjs.org/tutorial/).** It starts with zero assumptions about your level of ability and walks through every step of the process.

- **To dive straight into code samples, head [to our documentation](https://www.gatsbyjs.org/docs/).** In particular, check out the _Guides_, _API Reference_, and _Advanced Tutorials_ sections in the sidebar.
