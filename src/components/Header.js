import React from 'react';
import { Route, Link } from 'react-router-dom';
import headerLogo from '../images/header-logo.svg';

export default function Header() {
  return (
    <header className="header">
        <div className="header__container">
          <img src={headerLogo} alt="логотип Mesto" className="header__logo" />
          <Route path="/signin" exact>
            <Link to="/signup" className="header__register">Регистрация</Link>
          </Route>
          <Route path="/signup" exact>
            <Link to="/signin" className="header__register">Войти</Link>
          </Route>
        </div>
    </header>
  )
};
