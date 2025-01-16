import React, { useContext, useState } from "react";
import Layout from "../../ui/Layout/Layout";
import Footer from "../../components/Footer/Footer";
import styles from "./Author.module.scss";
import { use } from "react";
import DataContext from "../../context";
import ParticipationConference from "../../modules/ParticipationConference/ParticipationConference";
import Collections from "../../modules/Collections/Collections";
import HeaderSecond from "../../components/HeaderSecond/HeaderSecond";
function Author() {
    const context = useContext(DataContext);
    return ( 
        <main className={styles.Author}>
            {/* <HeaderSecond/> */}
            <Layout>
                    <div className={styles.AuthorContainer}>
                        <div>
                            <button onClick={() => context.setActiveModule(false)}>1 модуль</button>
                            <button onClick={() => context.setActiveModule(true)}>2 модуль</button>
                        </div>
                        {!context.activeModule ? <ParticipationConference/> : <Collections/>}
                    </div>
            </Layout>
            <Footer/>
        </main>
     );
}

export default Author;