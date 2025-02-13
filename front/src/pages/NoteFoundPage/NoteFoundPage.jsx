import { useNavigate } from "react-router-dom";
import styles from "./NoteFoundPage.module.scss";
import Layout from "../../ui/Layout/Layout";
import Footer from "../../components/Footer/Footer";
import HeaderSecond from "../../components/HeaderSecond/HeaderSecond";
import NoteFound from "./../../assets/img/NoteFound.png";
function NoteFoundPage() {
    const navigate = useNavigate();
    return ( 
        <>
        <HeaderSecond/>
        <section className={styles.NoteFoundPage}>
            <div>
                <div>
                    <div className={styles.Title}>
                        <p >
                            Страница не найдена                    
                        </p>
                    </div>
                </div>
                <Layout>
                    <div className={styles.NoteFoundPageText}>
                        <div className={styles.NoteFoundPageTextContainer}>
                            <p>404</p>
                            <p>Кажется, что-то пошло не так! Страница, которую вы запрашиваете, не существует. Возможно, она была удалена, или вы набрали неверный адрес. Перейдите на нашу <span onClick={() => navigate('/HomePage')}>главную страницу</span> и попробуйте найти необходимую вам информацию там.</p>
                            <button onClick={() => navigate('/')}>Перейти на главную</button>
                        </div>
                        <div>
                            <img src={NoteFound} alt="NoteFound"/>
                        </div>
                    </div>
                </Layout>
            </div>
        </section>
        <Footer/>
        </>

     );
}

export default NoteFoundPage;