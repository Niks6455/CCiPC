import { server } from '../../../../apirequests/apirequests';
import styles from './ModalPhoto.module.scss';
import { ReactComponent as Close } from '@assets/img/UI/bigX.svg';
import { AnimatePresence, motion } from 'framer-motion';
import noPhotoLk from '@assets/img/noPhotoLk.svg';

function ModalPhoto({ funOpenPhotoProfile, showProfilePhoto, user, urlPhoto }) {
  return (
    <div className={styles.ModalPhoto}>
      <AnimatePresence>
        {showProfilePhoto && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.bacgraund}
            ></motion.div>
            <motion.div
              className={styles.ProfilePhotoShow}
              initial={{
                opacity: 0,
                transform: 'translate(-50%, -50%) scale(0)',
              }}
              animate={{
                opacity: 1,
                transform: 'translate(-50%, -50%) scale(1)',
              }}
              exit={{
                opacity: 0,
                transform: 'translate(-50%, -50%) scale(0)',
              }}
            >
              <img
                className={styles.ProfileImg}
                src={urlPhoto || `${server}/${user?.avatar?.url}`}
                alt="img"
                onError={e => (e.target.src = noPhotoLk)}
              />
              <Close onClick={funOpenPhotoProfile} className={styles.close} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ModalPhoto;
