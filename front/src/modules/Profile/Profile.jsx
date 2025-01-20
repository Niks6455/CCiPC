import styles from "./Profile.module.scss"

function Profile() {
    return ( 
        <section className={styles.Profile}>
            <div>
                <img src="/img/ProfilePictureBackground.svg" className={styles.ProfileImg}/>
                <img src="/img/noPhotoLk.svg" className={styles.noPhotoLk}/>
            </div>
            <div className={styles.mainSection}>
                 <div className={styles.mainSectionInfoPeople}>
                    <p>Веселов Геннадий Евгеньевич</p>
                    <p><span>Ученое звание:</span> Доцент</p>
                    <p><span>Степень:</span> Доктор технических наук</p>
                 </div>
            </div>
        </section>
     );
}

export default Profile;