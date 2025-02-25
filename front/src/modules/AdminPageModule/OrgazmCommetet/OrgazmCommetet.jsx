import styles from "./OrgazmCommetet.module.scss";
import { useEffect, useState } from "react";
import React from "react";
import CapImg from "./../../../assets/img/Cap.svg";
import plusLigthImg from "./../../../assets/img/UI/plusLigth.svg";
import AddOrgPeople from "../../../components/AdminModuleComponents/AddOrgPeople/AddOrgPeople";
import { getOrgCommitet } from "../../../apirequests/apirequests";
import CardOrganization from "./CardOrganization/CardOrganization";
function OrgazmCommetet() {
    const [activeButtonFirst, setActiveButtonFirst] = useState(0);
    const [activeButtonTwoo, setActiveButtonTwoo] = useState(0);
    const [addFirstOne, setAddFirstOne] = useState(false);
    const [addFirstTwo, setAddFirstTwo] = useState(false);
    const [dataCommitet, setDataCommitet] = useState([]);
    const closeCreateOne = () => {
        setAddFirstOne(false);
    }

    const closeCreateTwo = () => {
        setAddFirstTwo(false);
    }

    useEffect(()=>{
        getDataOrg();
    },[])

    const getDataOrg = () =>{
        getOrgCommitet().then((res)=>{
            if(res?.status === 200){
                setDataCommitet(res.data.committee)
            }
        })
    }

    useEffect(()=>{
        dataCommitet?.map((item) => {
            console.log("item", item.committee)
        })
    },[dataCommitet])

    return ( 
        <section className={styles.OrgazmCommetet}>
           <div className={styles.OrgazmCommetetInner}>
                <p className={styles.title}>Оргкомитет</p>
                <div>
                    <p className={styles.subtitle}>Организационный комитет</p>
                    <div className={styles.buttonBlock}>
                        <div className={styles.buttonBlockCont}>
                            <button 
                                onClick={() => {setAddFirstOne(false); setActiveButtonFirst(0)}}
                                className={activeButtonFirst === 0 ? styles.active : styles.noActive}
                            >
                                Сопредседатели <img src={CapImg} alt="cap"/>
                            </button>
                            <button 
                                onClick={() => {setAddFirstOne(false); setActiveButtonFirst(1)}}
                                className={activeButtonFirst === 1 ? styles.active : styles.noActive}
                            >
                                Члены комитета <img src={CapImg} alt="cap"/>
                            </button>
                        </div>
                        <div>
                            <button onClick={() => setAddFirstOne(true)} className={styles.ButtonAdd}><img src={plusLigthImg} />Добавить сотрудника</button>
                        </div>
                    </div>
                    <div className={styles.orgCargCont}>
                        {addFirstOne && <div className={styles.orgCargContCards}>
                            <AddOrgPeople type={activeButtonFirst} closeCreateOne={closeCreateOne}/>
                        </div>}
                        <div className={styles.orgCargContCards}>
                            {dataCommitet && dataCommitet?.map((item) => <CardOrganization getDataOrg={getDataOrg} item={item?.committee}/>)}
                        </div>

                    </div>
                </div>
                <div>
                    <p className={styles.subtitle}>Программный комитет</p>
                    <div className={styles.buttonBlock}>
                        <div className={styles.buttonBlockCont}>
                            <button 
                                onClick={() => {setAddFirstTwo(false); setActiveButtonTwoo(0)}}
                                className={activeButtonTwoo === 0 ? styles.active : styles.noActive}
                            >
                                Почётный председатель <img src={CapImg} alt="cap"/>
                            </button>
                            <button 
                                onClick={() => {setAddFirstTwo(false); setActiveButtonTwoo(1)}}
                                className={activeButtonTwoo === 1 ? styles.active : styles.noActive}
                            >
                                Сопредседатели <img src={CapImg} alt="cap"/>
                            </button>
                            <button 
                                onClick={() => {setAddFirstTwo(false); setActiveButtonTwoo(2)}}
                                className={activeButtonTwoo === 2 ? styles.active : styles.noActive}
                            >
                                Заместитель председателя <img src={CapImg} alt="cap"/>
                            </button>
                            <button 
                                onClick={() => setActiveButtonTwoo(3)}
                                className={activeButtonTwoo === 3 ? styles.active : styles.noActive}
                            >
                                Члены комитета <img src={CapImg} alt="cap"/>
                            </button>
                        </div>
                        <div>
                            <button onClick={() => setAddFirstTwo(true)} className={styles.ButtonAdd}><img src={plusLigthImg} /> Добавить сотрудника</button>
                        </div>
                    </div>
                    <div className={styles.orgCargCont}>
                            {addFirstTwo && <AddOrgPeople type={activeButtonTwoo + 2} closeCreateOne={closeCreateTwo}/>}
                    </div>
                </div>
           </div>
        </section>
    );
}

export default OrgazmCommetet;