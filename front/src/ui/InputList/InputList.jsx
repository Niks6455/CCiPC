import styles from "./InputList.module.scss";
import arrowMini from "./../../assets/img/UI/arrowMini.svg";

function InputList(props) {
  const liClick = (item) => {
    props.funSelectElement(props?.name, item.text);
    props.funOpen("");
  };
  return (
    <div className={styles.InputList} ref={props?.divRef}>
      {!props?.value && props?.imgSrc && (
        <img src={props?.imgSrc} alt={props?.name} />
      )}
      <input
        name={props?.name}
        onChange={props?.onChange}
        value={props?.value}
        placeholder={props?.placeholder}
        className={props?.error ? styles.errorInputList : ""}
        type={props.type || "text"}
        style={{
          paddingLeft:
            props?.imgSrc && !props?.value && "55px"
              ? !props?.value
                ? "55px"
                : ""
              : "25px",
        }}
      />
      <div className={styles.arrow} onClick={() => props.funOpen(props.name)}>
        <img
          src={arrowMini}
          alt="img"
          style={
            props.open
              ? { transform: "scaleY(1)", transition: "all 0.15s" }
              : { transform: "scaleY(-1)", transition: "all 0.15s" }
          }
        />
      </div>
      <div className={`${styles.List} ${props?.open && styles.open}`}>
        <ul>
          {props.list?.map((item, index) => (
            <li key={index} onClick={() => liClick(item)}>
              {item.text}
            </li>
          ))}
        </ul>
      </div>

      {props?.value && !props?.error && (
        <div className={styles.placeholderClose}>{props?.placeholder}</div>
      )}
      {props?.error && <div className={styles.errorText}>{props?.error}</div>}
    </div>
  );
}

export default InputList;