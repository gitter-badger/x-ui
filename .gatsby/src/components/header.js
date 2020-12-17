import { Link } from "gatsby"
import PropTypes from "prop-types"
import React, { useEffect, useState } from "react"

const Header = ({ siteTitle }) => {

  return (
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-toggle>
            <ion-button>
              <ion-icon name="menu"></ion-icon>
            </ion-button>
          </ion-menu-toggle>
          <Link href="/">
            <ion-button size="large">
              <ion-icon slot="icon-only" name="home"></ion-icon>
            </ion-button>
          </Link>
        </ion-buttons>
        <ion-title>{ siteTitle }</ion-title>
        <ion-buttons slot="end">
          <a
            href="https://github.com/viewdo/ui"
            className="pure-menu-link"
            target="_blank">
            <ion-button>
              <ion-icon name="logo-github"></ion-icon>
            </ion-button>
          </a>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
  )
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: `view.DO Experience UI Web Components Docs`,
}

export default Header
