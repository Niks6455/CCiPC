import styles from "./Profile.module.scss"

function Profile() {
    return ( 
        <section className={styles.Profile}>
            <div>
                <img src="/img/ProfilePictureBackground.svg" className={styles.ProfileImg}/>
            </div>
            <p>Profile</p>
        </section>
     );
}

export default Profile;