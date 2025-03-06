import React, { useState } from "react";
import "./Footer.css";

export default function Footer({ setType }) {
    const [activeButton, setActiveButton] = useState("profile");

    const swapToProfile = () => {
        setType("profile");
        setActiveButton("profile");
    };

    const swapToTodo = () => {
        setType("todo");
        setActiveButton("todo");
    };

    return (
        <footer>
            <button
                className={`footer__button ${activeButton === "profile" ? "footer__button-active" : ""}`}
                onClick={swapToProfile}
            >
                Профиль
            </button>
            <button
                className={`footer__button ${activeButton === "todo" ? "footer__button-active" : ""}`}
                onClick={swapToTodo}
            >
                Задачи
            </button>
        </footer>
    );
}