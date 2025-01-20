import React, { useState } from 'react';
import styles from './RightMenuLk.module.scss';
import { useNavigate } from 'react-router-dom';

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
                <div className={styles.RightMenuLkList}>
                    <ul>
                        <li
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            className={styles.dropdownMenu}
                            onClick={(e) => clickNavigate(e, '')}
                        >
                            Главная
                            <img
                                src="/img/ArrowBotGreen.svg"
                                alt="Arrow"
                                className={styles.arrowTopMenu}
                            />
                            {isDropdownOpen && (
                                <ul className={styles.subMenu}>
                                    <li onClick={(e) => clickNavigate(e, 'Author')}>
                                        Автору
                                    </li>
                                    <li onClick={(e) => clickNavigate(e, 'Участники')}>
                                        Участники
                                    </li>
                                    <li onClick={(e) => clickNavigate(e, 'Оргкомитет')}>
                                        Оргкомитет
                                    </li>
                                </ul>
                            )}
                        </li>
                    </ul>
                    <div className={styles.RightMenuText}>
                        <div className={styles.RightMenuTextCont}>
                            <p className={styles.RightMenuTextGroup}>01.09.2024</p>
                            <p>Представление текстов докладов и регистрационных форм</p>
                        </div>
                        <div className={styles.RightMenuTextCont}>
                            <p className={styles.RightMenuTextGroup}>08.09.2024</p>
                            <p>Информирование авторов о результатах экспертизы докладов</p>
                        </div>
                        <div className={styles.RightMenuTextCont}>
                            <p className={styles.RightMenuTextGroup}>15.09.2024</p>
                            <p>Оплата оргвзноса за опубликование принятых докладов</p>
                        </div>
                        <div className={styles.RightMenuTextCont}>
                            <p className={styles.RightMenuTextGroup}>23.09.2024</p>
                            <p>Начало работы конференции</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default RightMenuLk;
