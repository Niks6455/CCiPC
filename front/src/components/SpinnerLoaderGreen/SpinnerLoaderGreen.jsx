import styles from "./SpinnerLoaderGreen.module.scss"
import { motion } from 'framer-motion';

function SpinnerLoaderGreen() {
    return (
        <div className={styles.SpinnerLoaderGreen}>
            <motion.div
                  initial={{ opacity: 0 }}
                  exit={{ opacity: 0 }}
                  className={styles.loading}
                  animate={{ rotate: 360, opacity: 1 }}
                  transition={{
                    opacity: { duration: 1 }, // Плавное появление за 1 секунду
                    rotate: { repeat: Infinity, duration: 1, ease: 'linear' }, // Бесконечное вращение
                  }}
                />
        </div>
    );
}

export default SpinnerLoaderGreen;