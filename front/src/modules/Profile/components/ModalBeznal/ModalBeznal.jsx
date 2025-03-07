import styles from "./ModalBeznal.module.scss";
import docIcon from "@assets/img/AdminPanel/docImport.svg";
import loadIcon from "@assets/img/AdminPanel/load.svg";
import { AnimatePresence, motion } from "framer-motion";

function ModalBeznal({ openModalBeznal, setOpenModalBeznal }) {
  return (
    <div className={styles.ModalBeznal}>
      <AnimatePresence>
        {openModalBeznal && (
          <motion.div
            className={styles.bacground}
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
              <h2 className={styles.title}>
                Просим вас скачать шаблон договора, заполнить поля и
                <span>
                  загрузить подписанный скан договора и скан квитанции
                </span>{" "}
                об оплате в личный кабинет
              </h2>
              <div className={styles.file_container}>
                <button className={styles.inner}>
                  <img src={docIcon} alt="doc" />
                  <div className={styles.doc_name}>
                    <span>Для ФИЗИЧЕСКОГО лица</span>
                    <button className={styles.load}>
                      <img src={loadIcon} alt="Скачать" />
                    </button>
                  </div>
                </button>
                <button className={styles.inner}>
                  <img src={docIcon} alt="doc" />
                  <div className={styles.doc_name}>
                    <span>Для ЮРИДИЧЕСКОГО лица</span>
                    <button className={styles.load}>
                      <img src={loadIcon} alt="Скачать" />
                    </button>
                  </div>
                </button>
              </div>
              <div className={styles.buttons}>
                <button onClick={() => setOpenModalBeznal(false)}>
                  Сменить способ оплаты
                </button>
                <button onClick={() => setOpenModalBeznal(false)}>
                  Продолжить
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ModalBeznal;
