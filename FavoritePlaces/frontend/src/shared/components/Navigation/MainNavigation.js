import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';

import { AuthContext } from '../../context/auth-context';
import './MainNavigation.css';

const MainNavigation = props => {
  const auth = useContext(AuthContext);

  return (
    <React.Fragment>
      <header className="main-header">
        <button className="main-navigation__menu-btn">
          <span />
          <span />
          <span />
        </button>
        <h1 className="main-navigation__title">
          <Link to="/">FavoritePlaces</Link>
        </h1>
        <nav className="main-navigation__header-nav">
          <ul className="nav-links">
            <li>
              <NavLink to="/" exact>
                USERS
              </NavLink>
            </li>
            {auth.isLoggedIn && (
              <li>
                <NavLink to={`/${auth.userId}/places`}>MY PLACES</NavLink>
              </li>
            )}
            {auth.isLoggedIn && (
              <li>
                <NavLink to="/places/new">ADD PLACE</NavLink>
              </li>
            )}
            {!auth.isLoggedIn && (
              <li>
                <NavLink to="/auth">SIGN IN</NavLink>
              </li>
            )}
            {auth.isLoggedIn && (
              <li>
                <button onClick={auth.logout}>LOGOUT</button>
              </li>
            )}
          </ul>
        </nav>
      </header>
    </React.Fragment>
  );
};

export default MainNavigation;
