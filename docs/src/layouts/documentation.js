import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { Helmet } from "react-helmet"
import Header from "../components/header"
import Sidebar from "../components/sidebar"

import "./documentation.css"

export default ({ children, location }) => {
  const data = useStaticQuery(graphql`
    query HeaderQuery {
      sidebar: allMarkdownRemark {
        edges {
          node {
            id
            fields {
              slug
              filename
              section
            }
          }
        }
      }
      title: site {
        siteMetadata {
          title
        }
      }
    }
  `)
  return (
    <ion-app>

      <Helmet>
        <title>{data.title.siteMetadata.title}</title>
        <script
          type="module"
          src="https://cdn.jsdelivr.net/npm/@ionic/core/dist/ionic/ionic.esm.js"></script>
        <link rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@ionic/core/css/ionic.bundle.css"
          media="print"
          onload="this.media='all'" />

        <script
          type="module"
          src="/dist/viewdo/viewdo.esm.js"></script>

        <script
          nomodule=""
          src="/dist/index.js"></script>
          <link
            rel="stylesheet"
            href="/build/viewdo.css"
            media="print"
            onload="this.media='all'" />
          <base href="/" />
      </Helmet>
      <Header />
      <Sidebar
          currentPage={location.pathname}
          components={data.sidebar.edges}
        />
      <ion-content id="main" class="ion-padding">
          <div
            style={{
              margin: `0 auto`,
              maxWidth: 960,
              padding: `0px 1.0875rem 1.45rem`,
              paddingTop: 0,
            }}
          >
          {children}
        </div>
      </ion-content>
    </ion-app>

  )
}
