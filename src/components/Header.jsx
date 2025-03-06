import React from "react";
import logo from "../assets/logo.svg";
import "./Header.css";

export default function Header({ username }) {
    return (
        <header>
            <div className="header__fio">
                <p className="header__fio-text">{username}</p>
            </div>
            <div className="header__logo-wrapper">
                <img className="header__logo" src={logo} alt="Логотип" />
            </div>
        </header>
    );
}