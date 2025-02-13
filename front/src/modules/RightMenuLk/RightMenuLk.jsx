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

    return (
        <section className={styles.RightMenuLk}>
            <div className={styles.RightMenuLkContainer}>
                <NavBar/>
            </div>
        </section>
    );
}

export default RightMenuLk;
