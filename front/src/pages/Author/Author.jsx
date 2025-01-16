import React, { useState } from "react";
import Layout from "../../ui/Layout/Layout";
import Footer from "../../components/Footer/Footer";
import styles from "./Author.module.scss";
function Author() {
    const [activeModule, setActiveModule] = useState(false);
    return ( 
        <main className={styles.Author}>
            <Layout>
                <button onClick={() => setActiveModule(false)}>1 модуль</button>
                <button onClick={() => setActiveModule(true)}>2 модуль</button>
                    {!activeModule ? <p>1 модуль</p> : <p>2 модуль</p>}
            </Layout>
            <Footer/>
        </main>
     );
}

export default Author;