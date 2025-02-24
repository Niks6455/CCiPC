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


    const editClicker = () => {
        addNews ? setAddNews(false) : setAddNews(true);
    }

    useEffect(()=>{
        updateNewsData()
    },[])
    const updateNewsData = () =>{
        getAllNews().then((res)=>{
            if(res?.status === 200){
                setDataNews(res?.data?.news)
            }
        })
    }
    
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
                        <button onClick={()=> editClicker()}><img src={plusLigthImg} />Добавить новость</button>
                    </div>
                </div>
            </div>
            {dataNews.length === 0 ? <div className={styles.notNews}>
                <p>Новости отсутствуют</p>
            </div> : 
                <div className={styles.UnivarsalTableAdmin}>
                    <UnivarsalTableAdmin tableData={dataNews} tableHeader={headerTableNews} updateNewsData={updateNewsData} editClicker={editClicker}/>
                </div>
             }
        
        </div>
            
        }
            {
                addNews &&  <AddNews closeAddNews={editClicker} updateNewsData={updateNewsData} />

            }
           
        </section>
     );
}

export default NewsModuleAdminPage;