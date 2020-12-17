import React from "react"
import { Link } from "gatsby"

const Sidebar = ({ components, currentPage }) => {

  const pages = [
    {
      name: "Getting Started",
      url: "/getting-started",
    },
  ]

  const componentList = components.map(component => {
    const {
      node: {
        fields: { section, slug, filename },
      },
    } = component
    if (section === "components") {
      // Set active depending on currentPage vs slug
      return (
        <ion-item
          className={`ion-item ${
            currentPage.includes(slug.slice(0, -1)) ? `ion-item-active` : ""
          }`}
        >
          <Link to={slug} >
            {`<`}
            {filename.split('/').join("")}
            {`>`}
          </Link>
        </ion-item>
      )
    }
  })

  const pageList = pages.map(page => {
    // Set active depending on currentPage vs slug
    return (
      <ion-item
        className={`ion-item ${
          currentPage.includes(page.url) ? `ion-item-selected` : ""
        }`}
      >
        <Link to={page.url}>
          {page.name}
        </Link>
      </ion-item>
      )
  })

  return (
    <ion-menu side="start" menu-id="main" content-id="main">
      <ion-content>
        <ion-list>
          <ion-list-header>Guides</ion-list-header>
          {pageList}
        </ion-list>
        <ion-list>
          <ion-list-header>Components</ion-list-header>
          {componentList}
        </ion-list>
      </ion-content>
    </ion-menu>
  )
}

export default Sidebar
