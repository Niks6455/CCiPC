import styles from './TableModule.module.scss';
import { motion } from 'framer-motion';

function DirectionList({ listModalRef, posDirList, data, selected, funSetDirection, indexRow }) {
  return (
    <motion.div
      ref={listModalRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={styles.DirectionList}
      style={{
        top: posDirList.y,
        left: posDirList.x,
      }}
    >
      <ul>
        {data?.map((el, index) => (
          <li
            className={selected === el.name ? styles.selected : ''}
            key={index}
            onClick={() => funSetDirection(el, indexRow)}
          >
            {el.name}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default DirectionList;
