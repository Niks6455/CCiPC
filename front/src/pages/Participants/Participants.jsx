import Footer from "../../components/Footer/Footer";
import Layout from "../../ui/Layout/Layout";
import styles from "./Participants.module.scss";
function Participants() {
    return ( 
        <>
            <main className={styles.Participants}>
                <Layout>
                    <div className={styles.ParticipantsInner}>
                        <div className={styles.Title}>
                            <p >
                                Участники конференции              
                            </p>
                        </div>
                        <div className={styles.inputComponentInner}>
                            <div className={styles.inputComponentInnerContainer}>
                                <img src="/img/search.svg"/>
                                <input className={styles.inputComponent} placeholder="Поиск"/>
                            </div>
                        </div>
                    </div>
                </Layout>
            </main>
            <Footer/>
        </>
     );
}

export default Participants;