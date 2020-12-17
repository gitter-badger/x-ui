---
title: Getting Started
date: "2019-11-13"
---

<page-header header="Get Started" subheader="Start your next web project with Pure." />>

## Add Pure to Your Page

You can add Pure to your page via the **free unpkg CDN**. Just add the following `<link>` element into your page's `<head>`, before your project's stylesheets.

```html
    <link rel="stylesheet" href="https://unpkg.com/purecss@1.0.1/build/pure-min.css" integrity="sha384-oAOxQR6DkCoMliIh8yFnu25d7Eq/PHS21PClpwjOTeU2jRSq11vu66rf90/cZr47" crossorigin="anonymous">
```

<aside><p>Alternatively, you can <a href="https://github.com/pure-css/pure-release/archive/v1.0.1.zip">download Pure</a>, or <a href="https://purecss.io/customize/">check out other CDNs</a> that host Pure.</p></aside>

## Add the Viewport Meta Element

The viewport `meta` element lets you control the the width and scale of the viewport on mobile browsers. Since you're building a responsive website, you want the width to be equal to the device's native width. Add this into your page's `<head>`.

```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

## Understand Pure Grids

Pure's grid system is very simple. You create a row by using the `.pure-g` class, and create columns within that row by using the `pure-u-*` classes.

Here's a grid with three columns:

```html
<div class="pure-g">
  <div class="pure-u-1-3"><p>Thirds</p></div>
  <div class="pure-u-1-3"><p>Thirds</p></div>
  <div class="pure-u-1-3"><p>Thirds</p></div>
</div>
```

## Responsive Grids

Pure's grid system is also **mobile-first** and **responsive**, and you're able to customize the grid by specifying CSS Media Query breakpoints and grid classnames. If needed, you can [customize Pure Grids below](https://purecss.io/start/#build-your-pure-starter-kit), but let's start off with an example.

You'll need to _also_ include Pure's `grids-responsive.css` onto your page:

```html
<!--[if lte IE 8]>
  <link
    rel="stylesheet"
    href="https://unpkg.com/purecss@1.0.1/build/grids-responsive-old-ie-min.css"
  />
<![endif]-->
<!--[if gt IE 8]><!-->
<link
  rel="stylesheet"
  href="https://unpkg.com/purecss@1.0.1/build/grids-responsive-min.css"
/>
<!--<![endif]-->
```

Here's the default responsive breakpoints included in `grids-responsive.css`:

| Key  | CSS Media Query                         | Applies  | Classname      |
| ---- | --------------------------------------- | -------- | -------------- |
| None | None                                    | Always   | `.pure-u-*`    |
| `sm` | `@media screen and (min-width: 35.5em)` | ≥ 568px  | `.pure-u-sm-*` |
| `md` | `@media screen and (min-width: 48em)`   | ≥ 768px  | `.pure-u-md-*` |
| `lg` | `@media screen and (min-width: 64em)`   | ≥ 1024px | `.pure-u-lg-*` |
| `xl` | `@media screen and (min-width: 80em)`   | ≥ 1280px | `.pure-u-xl-*` |

Here's an example of what you'd be able to do. _Try resizing your screen to see how the grid responds._

<div class="grids-example">
    <pure-grid>
        <div class="pure-u-1">.pure-u-1</div>
        <div class="pure-u-1 pure-u-md-1-2 pure-u-lg-1-4">
            .pure-u-1<br>.pure-u-md-1-2<br>.pure-u-lg-1-4
        </div>
        <div class="pure-u-1 pure-u-md-1-2 pure-u-lg-1-4">
            .pure-u-1<br>.pure-u-md-1-2<br>.pure-u-lg-1-4
        </div>
        <div class="pure-u-1 pure-u-md-1-2 pure-u-lg-1-4">
            .pure-u-1<br>.pure-u-md-1-2<br>.pure-u-lg-1-4
        </div>
        <div class="pure-u-1 pure-u-md-1-2 pure-u-lg-1-4">
            .pure-u-1<br>.pure-u-md-1-2<br>.pure-u-lg-1-4
        </div>
        <div class="pure-u-1 pure-u-md-3-4">.pure-u-1<br>.pure-u-md-3-4</div>
        <div class="pure-u-1 pure-u-md-1-4">.pure-u-1<br>.pure-u-md-1-4</div>
    </pure-grid>
</div>

<aside><p><a href="https://purecss.io/grids/#pure-responsive-grids">Learn More</a> about how to include and use Pure's Responsive Grids system, and how it compares to Basic Grids.</p></aside>

## Build Your Pure Starter Kit

Now that you know how grids work, you might want to customize things to better suit your web project. You can define your own breakpoints by specifying a CSS Media Queries. You can also customize the number of columns that your layout needs.

We'll generate an `index.html` file, and if needed, a `grid.css` file that you can download and use as the starting-point for your project.
