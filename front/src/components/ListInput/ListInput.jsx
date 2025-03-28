import styles from './ListInput.module.scss';
import { motion } from 'framer-motion';

function ListInput(props) {
  console.log('props', props);
  // const dispatch = useDispatch();

  const funClickLi = text => {
    // dispatch(setValue({ key: props.name, value: text }));
    props.handleChangeForm(props.name, text, props.index);
    props.setListOpen(false);
  };

  return (
    <motion.div
      className={styles.ListInput}
      initial={{ height: 0, overflow: 'hidden' }}
      animate={{ height: 'auto' }}
      exit={{ height: 0 }}
    >
      <ul>
        {props.list.map((el, index) => (
          <li
            className={props.value === el.text ? styles.active : ''}
            key={index}
            onClick={() => funClickLi(el.text)}
          >
            {el.text}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default ListInput;
