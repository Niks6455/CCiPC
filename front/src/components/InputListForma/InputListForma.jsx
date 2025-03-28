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
    <div name="InputListForma" className={styles.InputListForma}>
      <p>{props.name}</p>
      <div
        className={`${styles.boxInner} ${props.error ? styles.errorBoxInner : ''}`}
        ref={refCalendar}
      >
        {props.error && <span className={styles.error}>{props.error}</span>}
        <input
          type="text"
          placeholder="Не выбрано"
          value={props.value}
          className={listOpen ? styles.active : ''}
          onClick={() => (!props.readOnly ? setListOpen(!listOpen) : null)}
          readOnly={true}
        />
        {!props.readOnly && (
          <ArrowBottom
            className={`${styles.ArrowBottom} ${listOpen ? styles.openArrow : ''}`}
            onClick={() => setListOpen(!listOpen)}
          />
        )}

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
