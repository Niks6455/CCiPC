import RightMenuLk from "../../modules/RightMenuLk/RightMenuLk";
import Layout from "../../ui/Layout/Layout";
import styles from "./Lks.module.scss";
import Footer from "../../components/Footer/Footer";
import LeftMenuLk from "../../modules/LeftMenuLK/LeftMenuLK";
import { useContext } from "react";
import DataContext from "../../context";
import DocumentsLk from "../../modules/DocumentsLk/DocumentsLk";
function Lks() {
    const context = useContext(DataContext);
    return ( 
        <>
            <main className={styles.Lks}>
                <LeftMenuLk/>
                    <Layout>
                        <div className={styles.LksContainer}>
                            {context.selectFrameLks === "documents" && <DocumentsLk/>}
                        </div>
                    </Layout>
                <RightMenuLk/>
            </main>
            <Footer/>
        </>
       
     );
}

export default Lks;