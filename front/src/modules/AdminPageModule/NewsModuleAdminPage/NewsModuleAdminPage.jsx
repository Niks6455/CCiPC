import styles from "./NewsModuleAdminPage.module.scss";
import plusLigthImg from "@assets/img/UI/plusLigth.svg";
import search from "@assets/img/AdminPanel/search.svg";
import { useEffect, useState } from "react";
import AddNews from "./AddNews/AddNews";
import { getAllNews } from "../../../apirequests/apirequests";
import UnivarsalTableAdmin from "../../../components/UnivarsalTableAdmin/UnivarsalTableAdmin";
import { headerTableNews, testData } from "./data";
function NewsModuleAdminPage() {
    const [addNews, setAddNews] = useState(false);
    const [dataNews, setDataNews] = useState([]);
    const closeAddNews = () => {
        setAddNews(false);
    }
    useEffect(()=>{
        getAllNews().then((res)=>{
            if(res?.status === 200){
                setDataNews(res.data)
            }
        })
    },[])
    
    return ( 
        <section className={styles.NewsModuleAdminPage}>
        {  !addNews &&
        <div>
            <div className={styles.NewsModuleAdminPageInner}>
                <p className={styles.title}>Новости</p>
                <div className={styles.NewsTopMenu}>
                    <div className={styles.NewsTopMenuinput}>
                        <img src={search}/>
                        <input placeholder="Поиск"/>
                    </div>
                    <div className={styles.NewsTopMenuButton}>
                        <button onClick={()=> setAddNews(true)}><img src={plusLigthImg} />Добавить новость</button>
                    </div>
                </div>
            </div>
            {testData.length === 0 ? <div className={styles.notNews}>
                <p>Новости отсутствуют</p>
            </div> : 
                <div className={styles.UnivarsalTableAdmin}>
                    <UnivarsalTableAdmin tableData={testData} tableHeader={headerTableNews}/>
                </div>
             }
        
        </div>
            
        }
            {
                addNews &&  <AddNews closeAddNews={closeAddNews}/>
            }
           
        </section>
     );
}

export default NewsModuleAdminPage;