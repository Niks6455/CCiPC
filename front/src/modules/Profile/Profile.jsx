import styles from "./Profile.module.scss"

function Profile() {
    const testData = [
        {name: "Название доклада №1:", text: "Исследование управления процессами биологической очистки на предприятии «ИДАВАНГ Агро»"},
        {name: "Название доклада №1:", text: "Исследование управления процессами биологической очистки на предприятии «ИДАВАНГ Агро»"},
        {name: "Название доклада №1:", text: "Исследование управления процессами биологической очистки на предприятии «ИДАВАНГ Агро»"},
    ]
    return ( 
        <section className={styles.Profile}>
            <div>
                <img src="/img/ProfilePictureBackground.svg" className={styles.ProfileImg}/>
                <img src="/img/noPhotoLk.svg" className={styles.noPhotoLk}/>
                <img src="/img/EditPhotoLk.png" className={styles.editPhotoLk}/>
            </div>
            <div className={styles.mainSection}>
                 <div className={styles.mainSectionInfoPeople}>
                    <p>Веселов Геннадий Евгеньевич</p>
                    <p><span>Ученое звание:</span> Доцент</p>
                    <p><span>Степень:</span> Доктор технических наук</p>
                 </div>
            </div>
            <div className={styles.containerMoreInfo}>
                <div className={styles.containerMoreInfoOne}>
                    <p><span>Организация:</span> Южный федеральный университет</p>
                    <p><span>Должность:</span> Лаборант </p>
                    <p><span>Email:</span> gev@sfedu.ru</p>
                    <p><span>Телефон:</span> +7-919-888-22-45</p>
                    <p><span>Направление конференции:</span> Отсутствует</p>
                </div>
                <div className={styles.containerMoreInfoSecond}>
                    {testData.map((el)=>(
                        <div className={styles.containerMoreInfoSecondText}>
                            <p>{el.name}</p>
                            <p>{el.text}</p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
     );
}

export default Profile;