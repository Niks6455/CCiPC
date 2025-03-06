import { useEffect, useRef, useState } from 'react';
import styles from './InputListForma.module.scss';
import { ReactComponent as ArrowBottom } from './../../assets/img/UI/blackArrowBottom.svg';
import ListInput from '../ListInput/ListInput';
import { AnimatePresence } from 'framer-motion';

function InputListForma(props) {
  const refCalendar = useRef(null);
  const [listOpen, setListOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = event => {
      if (refCalendar.current && !refCalendar.current.contains(event.target)) {
        setListOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.InputListForma}>
      <p>{props.name}</p>
      <div className={styles.boxInner} ref={refCalendar}>
        <input
          type="text"
          placeholder="Не выбрано"
          value={props.value}
          className={listOpen ? styles.active : ''}
          onClick={() => setListOpen(!listOpen)}
          readOnly={true}
        />
        <ArrowBottom
          className={`${styles.ArrowBottom} ${listOpen ? styles.openArrow : ''}`}
          onClick={() => setListOpen(!listOpen)}
        />
        <AnimatePresence>
          {listOpen && (
            <ListInput
              index={props.index}
              list={props.list}
              value={props.value}
              name={props.itemKey}
              setListOpen={setListOpen}
              handleChangeForm={props.handleChangeForm}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default InputListForma;
