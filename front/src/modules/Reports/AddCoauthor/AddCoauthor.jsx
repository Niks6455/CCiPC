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
  setCoauthorAutocompletion,
  setValueCoauthors,
} from "../../../store/reportCreateSlice/reportCreateSlice";
import InputLabel from "../../../ui/InputLabel/InputLabel";
import trash from "./../../../assets/img/UI/trash.svg";
import InputListForma from "../../../components/InputListForma/InputListForma";
import { formParticipationList } from "../../../utils/Lists/List";
import {
  capitalizeFirstLetter,
  formatPhoneNumber,
  validateEmail,
} from "../../../utils/functions/Validations";
import { inpustType, inpustTypeEmail } from "./data";
import SameEmail from "../../../components/AddReportModal/SameEmail/SameEmail";
import SuccessModal from "../../../components/AddReportModal/SuccessModal/SuccessModal";
import NotFullyFilled from "../../../components/AddReportModal/NotFullyFilled/NotFullyFilled";
import NotFullyFilledCoauthors from "../../../components/AddReportModal/NotFullyFilledCoauthors/NotFullyFilledCoauthors";
import {
  apiCreateReport,
  apiEditReport,
} from "../../../apirequests/apirequests";
import { fetchUserData } from "../../../store/userSlice/user.Slice";
import { fetchReports } from "../../../store/reportsSlice/reportsSlice";

function AddCoauthor({ edit, number }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const report = useSelector((state) => state.reportCreateSlice);

  const funDeleteCoauthor = (index) => {
    dispatch(deleteCoauthor({ index }));
  };

  const funNoEmail = (index) => {
    dispatch(setCoauthorAutocompletion({ index, autocompletion: "true" }));
  };

  const funChangeInput = (index, key, value) => {
    if (key === "email") {
      if (validateEmail(value) && value) {
        dispatch(
          setCoauthorAutocompletion({ index, autocompletion: "noemail" })
        );
      }
      if (!validateEmail(value)) {
        dispatch(setCoauthorAutocompletion({ index, autocompletion: "" }));
      }
    }
    let newValue = value;
    const item = inpustType.find((el) => el.key === key);
    if (key === "phone") {
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
    if (edit) {
      //! редактирование доклада
      const temp = {
        coAuthors: report.data.soauthors.map((soauthor) => ({
          name: soauthor?.data?.name || "",
          surname: soauthor?.data?.surname || "",
          patronymic: soauthor?.data?.patronymic || "",
          organization: soauthor?.data?.organization || "",
          email: soauthor?.data?.email || "",
          phone: soauthor?.data?.phone || "",
          form: soauthor?.data?.formParticipation || "",
        })),
        comment: report.data.comments || "",
        conclusion: report.data.fileExpertOpinion || "",
        direction: report.data.directionConference || "",
        form: report.data.formParticipation || "",
        name: report.data.name || "",
        reportFile: report.data.fileArticle || "",
        organization: report.data.organization || "",
      };
      apiEditReport(report.data.id, temp).then((res) => {
        console.log("res", res);
        if (res?.status === 200) {
          dispatch(fetchReports());
          navigate(
            `./../viewreports?idReport=${report.data.id}&number=${number}`
          );
        }
      });
      return;
    } else {
      //! создание доклада
      dispatch(funSaveDataState());
      const data = {
        name: report.data.name,
        form: report.data.formParticipation,
        direction: report.data.directionConference,
        comment: report.data.comments,
        organization: report.data.organization,
        coAuthors: report.data.soauthors.map((el) => ({
          name: el.data.name,
          surname: el.data.surname,
          patronymic: el.data.patronymic,
          email: el.data.email,
          organization: el.data.organization,
          phone: el.data.phone,
          form: el.data.formParticipation,
        })),
      };
      apiCreateReport(data).then((res) => {
        console.log("res", res);
        if (res?.status === 200) {
          dispatch(fetchUserData());
          dispatch(fetchReports());
        }
      });
    }
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
      {!edit && (
        <div className={styles.backImg}>
          <img
            src={leftArrow}
            alt="назад"
            draggable="false"
            onClick={() => navigate(-1)}
          />
        </div>
      )}

      {!edit && (
        <div className={styles.slider}>
          <div
            className={styles.sliderInner}
            style={{
              width: `${report.sliderState}%`,
              transition: "all 0.15s linear",
            }}
          ></div>
        </div>
      )}

      {report?.data.soauthors?.map((soauthtor, index) => (
        <div key={index} className={styles.inputContainer}>
          <div className={styles.deletecoauthor}>
            <button onClick={() => funDeleteCoauthor(index)}>
              <span>Удалить соавтора №{index + 1}</span>
              <img src={trash} alt="удалить" />
            </button>
          </div>
          {inpustTypeEmail.map((inp) => (
            <div className={styles.inputbox} key={inp.id}>
              <InputLabel
                label={inp.label}
                type={inp.type}
                index={index}
                itemKey={inp.key}
                value={soauthtor.data?.[inp.key]}
                funChange={funChangeInput}
                placeholder={inp.placeholder}
                error={inp.error}
              />
              {soauthtor.autocompletion === "noemail" && (
                <div className={styles.modalEmail}>
                  <p>
                    Пользователь с такой почтой не найден на платформе.
                    Необходимо внести данные о соавторе вручную.
                  </p>
                  <button onClick={() => funNoEmail(index)}>Продолжить</button>
                </div>
              )}
              {soauthtor.autocompletion === "emailhave" && (
                <div className={styles.modalEmail}>
                  <p>
                    Пользователь с такой почтой найден на платформе. Данные о
                    соавторе заполнятся автоматически, кроме его формы участия.
                  </p>
                  <button>Продолжить</button>
                </div>
              )}
            </div>
          ))}

          {soauthtor.autocompletion === "true" && (
            <>
              {inpustType.map((inp) => (
                <div className={styles.inputbox} key={inp.id}>
                  <InputLabel
                    label={inp.label}
                    type={inp.type}
                    index={index}
                    itemKey={inp.key}
                    value={soauthtor.data[inp.key]}
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
                  value={report.data.soauthors[index]?.data?.formParticipation}
                  handleChangeForm={handleChangeForm}
                  index={index}
                />
              </div>
            </>
          )}
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
        <button onClick={funSaveData}>
          {edit ? "Сохранить изменения" : "Сохранить"}
        </button>
      </div>
    </div>
  );
}

export default AddCoauthor;
