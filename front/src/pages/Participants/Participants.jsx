import Footer from "../../components/Footer/Footer";
import Layout from "../../ui/Layout/Layout";
import styles from "./Participants.module.scss";
function Participants() {
    return ( 
        <>
            <main>
                <Layout>
                    <div className={styles.Title}>
                        <p >
                            Страница не найдена                    
                        </p>
                    </div>
                </Layout>
            </main>
            <Footer/>
        </>
     );
}

export default Participants;