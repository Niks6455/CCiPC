import styles from "./AddCoauthor.module.scss";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import leftArrow from "./../../../assets/img/UI/leftArrow.svg";
import plus from "./../../../assets/img/UI/plus.svg";
import errorList from "./../../../assets/img/UI/errorZnak.svg";
import {
  addSoauthors,
  deleteCoauthor,
  funSaveDataState,
  setValueCoauthors,
} from "../../../store/reportCreateSlice/reportCreateSlice";
import InputLabel from "../../../ui/InputLabel/InputLabel";
import trash from "./../../../assets/img/UI/trash.svg";
import InputListForma from "../../../components/InputListForma/InputListForma";
import { formParticipationList } from "../../../utils/Lists/List";
import {
  capitalizeFirstLetter,
  formatPhoneNumber,
} from "../../../utils/functions/Validations";
import { inpustType } from "./data";
import SameEmail from "../../../components/AddReportModal/SameEmail/SameEmail";
import SuccessModal from "../../../components/AddReportModal/SuccessModal/SuccessModal";
import NotFullyFilled from "../../../components/AddReportModal/NotFullyFilled/NotFullyFilled";
import NotFullyFilledCoauthors from "../../../components/AddReportModal/NotFullyFilledCoauthors/NotFullyFilledCoauthors";

function AddCoauthor() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const report = useSelector((state) => state.reportCreateSlice);

  const funDeleteCoauthor = (index) => {
    dispatch(deleteCoauthor({ index }));
  };

  const funChangeInput = (index, key, value) => {
    let newValue = value;
    const item = inpustType.find((el) => el.key === key);
    if (item.key === "phone") {
      newValue = formatPhoneNumber(value);
    }
    //! делаем букву заглавной
    if (item?.capitalLetter) {
      newValue = capitalizeFirstLetter(value);
    }
    //! применяем валидацию из списка
    if (item?.valdate) {
      if (!item.valdate(newValue)) {
        return;
      }
    }

    dispatch(setValueCoauthors({ index, key, value: newValue }));
  };

  //! функция onChange на InputListForm
  const handleChangeForm = (key, value, index) => {
    dispatch(setValueCoauthors({ index, key, value }));
  };

  //! сохранение данных
  const funSaveData = () => {
    dispatch(funSaveDataState());
  };

  return (
    <div className={styles.AddCoauthor}>
      {report?.openPopUpName && (
        <div className={styles.popups}>
          {report?.openPopUpName === "SameEmail" && <SameEmail />}
          {report?.openPopUpName === "SuccessModal" && <SuccessModal />}
          {report?.openPopUpName === "NotFullyFilled" && <NotFullyFilled />}
          {report?.openPopUpName === "NotFullyFilledCoauthors" && (
            <NotFullyFilledCoauthors />
          )}
        </div>
      )}

      <h2 className={styles.title}>Соавторы</h2>
      <div className={styles.backImg}>
        <img
          src={leftArrow}
          alt="назад"
          draggable="false"
          onClick={() => navigate(-1)}
        />
      </div>
      <div className={styles.slider}>
        <div
          className={styles.sliderInner}
          style={{
            width: `${report.sliderState}%`,
            transition: "all 0.15s linear",
          }}
        ></div>
      </div>
      {report?.data.soauthors?.map((soauthtor, index) => (
        <div key={index} className={styles.inputContainer}>
          <div className={styles.deletecoauthor}>
            <button onClick={() => funDeleteCoauthor(index)}>
              <span>Удалить соавтора №{index + 1}</span>
              <img src={trash} alt="удалить" />
            </button>
          </div>
          {inpustType.map((inp) => (
            <div className={styles.inputbox} key={inp.id}>
              <InputLabel
                label={inp.label}
                type={inp.type}
                index={index}
                itemKey={inp.key}
                value={soauthtor[inp.key]}
                funChange={funChangeInput}
                placeholder={inp.placeholder}
                error={inp.error}
              />
            </div>
          ))}
          <div className={styles.inputbox}>
            <InputListForma
              name={"Форма участия*"}
              list={formParticipationList}
              itemKey={"formParticipation"}
              value={report.data.soauthors[index].formParticipation}
              handleChangeForm={handleChangeForm}
              index={index}
            />
          </div>
        </div>
      ))}
      <button
        className={styles.addsoaftor}
        onClick={() => dispatch(addSoauthors())}
      >
        <span>Добавить соавтора</span>
        <img src={plus} alt="+" />
      </button>

      <div className={styles.srokContainer}>
        <div className={styles.text}>
          <img src={errorList} alt="img" />
          <span>
            В срок до XX.XX.XХХX необходимо прислать заявку на доклад, а в срок
            до ХХ.ХХ.ХХХХ загрузить статью и экспертное заключение.
          </span>
        </div>
        <button onClick={funSaveData}>Сохранить</button>
      </div>
    </div>
  );
}

export default AddCoauthor;
