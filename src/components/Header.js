import React from 'react';
import headerLogo from '../images/header-logo.svg';

export default function Header() {
  return (
    <header className="header">
        <a className="page__container">
            <img src={headerLogo} alt="логотип Mesto" className="header__logo" />
        </a>
    </header>
  )
}
