import Footer from "../../components/Footer/Footer";
import { TestDataTable, tableHead } from "../../components/UniversalTable/HeaderTable";
import UniversalTable from "../../components/UniversalTable/UniversalTable";
import Layout from "../../ui/Layout/Layout";
import styles from "./Participants.module.scss";
function Participants() {

    const filterdATA = (data) => {
        return  data
    }
    
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
                                <UniversalTable tableHeader={tableHead} tableBody={filterdATA(TestDataTable)}/>
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