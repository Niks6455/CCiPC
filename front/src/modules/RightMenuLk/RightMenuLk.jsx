import React, { useState } from 'react';
import styles from './RightMenuLk.module.scss';
import { useNavigate } from 'react-router-dom';
import arrowBot from "./../../assets/img/ArrowBotGreen.svg"
import NavBar from '../../components/NavBar/NavBar';
function RightMenuLk() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const handleMouseEnter = () => {
        setIsDropdownOpen(true);
    };

    const handleMouseLeave = () => {
        setIsDropdownOpen(false);
    };

    const clickNavigate = (e, text) => {
        e.stopPropagation(); // Останавливаем всплытие события
        navigate(`/${text}`);
    };

    const checkPathName = () => {
        window.location.pathname.includes("/adminPage")
    };

    

    return (
        <section className={styles.RightMenuLk} style={{ width: !checkPathName() ? "310px" : "0px", minWidth: !checkPathName() ? "310px" : "0px" , borderLeft: !checkPathName() ? "1px solid #C8D0CE" : "none" }}>
            <div className={styles.RightMenuLkContainer}>
                <NavBar/>
            </div>
        </section>
    );
}

export default RightMenuLk;
