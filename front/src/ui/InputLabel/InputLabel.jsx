import { useEffect, useState } from "react";
import styles from "./InputLabel.module.scss";
import { validateEmail } from "../../utils/functions/Validations";

function InputLabel(props) {
  const [errorShow, setErrorShow] = useState(false);
  useEffect(() => {
    if (props.itemKey === "email") {
      if (validateEmail(props.value)) {
        setErrorShow(false);
      }
    }
    if (props.itemKey === "phone") {
      if (props.value?.length > 17) {
        setErrorShow(false);
      }
    }
  }, [props.value]);

  const handleBlur = () => {
    if (props.itemKey === "email") {
      if (validateEmail(props.value)) {
        setErrorShow(false);
      } else {
        setErrorShow(true);
      }
    }
    if (props.itemKey === "phone") {
      if (props.value?.length > 17) {
        setErrorShow(false);
      } else {
        setErrorShow(true);
      }
    }
  };

  return (
    <div className={styles.InputLabel}>
      <snan className={styles.label}>{props.label}</snan>
      {errorShow && <span className={styles.error}>{props.error}</span>}
      <input
        className={styles.maininput}
        type={props.type}
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e) =>
          props.funChange(props.index, props.itemKey, e.target.value)
        }
        onBlur={handleBlur}
      />
    </div>
  );
}

export default InputLabel;
