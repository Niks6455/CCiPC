import styles from './InputList.module.scss';
import arrowMini from './../../assets/img/UI/arrowMini.svg';

function InputList(props) {
  const liClick = item => {
    props.funSelectElement(props?.name, item.text);
    props.funOpen('');
  };
  return (
    <div
      className={`${styles.InputList}`}
      ref={props?.divRef}
      onClick={() => props.funOpen(props?.name)}
    >
      {!props?.value && props?.imgSrc && <img src={props?.imgSrc} alt={props?.name} />}
      {props.labelText && (
        <div className={styles.labelText}>
          <span>{props.labelText}</span>
        </div>
      )}
      <input
        name={props?.name}
        onChange={props?.onChange}
        value={props?.value}
        placeholder={props?.placeholder}
        className={`${props?.error ? styles.errorInputList : ''} ${
          props?.open && styles.openInput
        } ${props?.imgSrc && !props?.value ? styles.paddingLeft : ''}`}
        type={props.type || 'text'}
        autoComplete={!props.autoComplete && 'new-password'}
        onClick={() => props.funOpen(props?.name)}
        readOnly={props.readOnly || true}
      />
      <div
        className={styles.arrow}
        // onClick={() => props.funOpen(props?.name)}
        style={props.styleArrow ? props.styleArrow : {}}
      >
        <img
          src={arrowMini}
          alt="img"
          style={
            props.open
              ? { transform: 'scaleY(1)', transition: 'all 0.15s' }
              : { transform: 'scaleY(-1)', transition: 'all 0.15s' }
          }
        />
      </div>
      <div
        className={`${styles.List} ${props?.open && styles.open}`}
        style={props.listStyle ? props.listStyle : {}}
      >
        <ul>
          {props.list?.map((item, index) => (
            <li
              key={index}
              onClick={() => liClick(item)}
              className={`${props?.value === item.text && styles.active}`}
            >
              {item.text}
            </li>
          ))}
        </ul>
      </div>

      {props?.value && !props?.error && (
        <div className={styles.placeholderClose}>{props?.placeholder}</div>
      )}
      {props?.error && (
        <div
          className={styles.errorText}
          style={props.inputerrorStyle ? props.inputerrorStyle : {}}
          name="error"
        >
          {props?.error}
        </div>
      )}
    </div>
  );
}

export default InputList;
