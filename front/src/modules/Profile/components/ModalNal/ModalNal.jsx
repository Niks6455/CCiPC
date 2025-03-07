import styles from "./ModalNal.module.scss";
import greenGalkaIcon from "@assets/img/UI/circleGalka.svg";
import { AnimatePresence, motion } from "framer-motion";

function ModalNal(props) {
  return (
    <div className={styles.ModalNal}>
      <AnimatePresence>
        {props.openModal && (
          <motion.div
            className={styles.bacgraund}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={styles.container}
              initial={{
                opacity: 0,
                transform: " scale(0)",
              }}
              animate={{
                opacity: 1,
                transform: " scale(1)",
              }}
              exit={{
                opacity: 0,
                transform: "scale(0)",
              }}
            >
              <h2>
                Вы успешно выбрали способ оплаты оргвзноса наличными. Оплата
                будет происходить во время регистрации на площадке конференции
              </h2>
              <img src={greenGalkaIcon} alt="✅" />
              <button onClick={() => props.setOpenModal(false)}>
                Перейти в профиль
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ModalNal;
