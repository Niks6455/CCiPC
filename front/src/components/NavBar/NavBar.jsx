import { useContext, useState } from 'react';
import styles from './NavBar.module.scss';
import closeImg from "./../../assets/img/closeImg.png";
import { useNavigate } from 'react-router-dom';
import DataContext from '../../context';

function NavBar() {
    const context = useContext(DataContext);
    const navigate = useNavigate();

    return ( 
        <section className={styles.NavBar}>
            <button className={styles.NavBarButton} onClick={() => context.setActiveMenu(true)}>
                <p>Меню</p>
                <div className={styles.NavBarMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </button>
            <div 
                onClick={() => context.setActiveMenu(false)} 
                className={`${styles.menu} ${context.activeMenu ? styles.active : styles.disable}`}
            >
            <div className={styles.menuInner}>

                <button>Скрыть <img src={closeImg} alt="Close"/></button>
                <ul>
                    <li onClick={()=>{navigate('/Lks/profile'); context.setActiveMenu(false)}}>Личный кабинет <span className={styles.arowLi}><img src="/img/ArrowMenu.png" alt="Arrow" /></span></li>
                    <li onClick={()=>{navigate('/'); context.setActiveMenu(false)}}>Главная <span className={styles.arowLi}><img src="/img/ArrowMenu.png" alt="Arrow" /></span></li>
                    <li onClick={()=>{navigate('/Author'); context.setActiveMenu(false)}}>Автору <span className={styles.arowLi}><img src="/img/ArrowMenu.png" alt="Arrow" /></span></li>
                    <li onClick={()=>{navigate('/NewsPage'); context.setActiveMenu(false)}}>Новости <span className={styles.arowLi}><img src="/img/ArrowMenu.png" alt="Arrow" /></span></li>
                    <li onClick={()=>{navigate('/Participants'); context.setActiveMenu(false)}}>Участники <span className={styles.arowLi}><img src="/img/ArrowMenu.png" alt="Arrow" /></span></li>
                    <li onClick={()=>{navigate('/OrganizationComite'); context.setActiveMenu(false)}}>Оргкомитет <span className={styles.arowLi}><img src="/img/ArrowMenu.png" alt="Arrow" /></span></li>
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

export default NavBar;