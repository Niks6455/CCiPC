import styles from "./InputLabel.module.scss";

function InputLabel(props) {
  return (
    <div className={styles.InputLabel}>
      <snan className={styles.label}>{props.label}</snan>
      <input
        className={styles.maininput}
        type={props.type}
        placeholder={props.placeholder}
        value={props.value}
      />
    </div>
  );
}

export default InputLabel;
