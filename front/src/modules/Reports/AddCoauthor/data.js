import { validateFIO } from "../../../utils/functions/Validations";

export const inpustTypeEmail = [
  {
    id: "1",
    label: "Email*",
    placeholder: "Email",
    type: "email",
    key: "email",
    capitalLetter: false,
    valdate: null,
    error: "Некорректная почта",
  },
];

export const inpustType = [
  {
    id: "1",
    label: "Email*",
    placeholder: "Email",
    type: "email",
    key: "email",
    capitalLetter: false,
    valdate: null,
    error: "Некорректная почта",
  },
  {
    id: "2",
    label: "Имя соавтора*",
    placeholder: "Имя",
    type: "text",
    key: "name",
    capitalLetter: true,
    valdate: validateFIO,
    error: "",
  },
  {
    id: "3",
    label: "Фамилия соавтора*",
    placeholder: "Фамилия",
    type: "text",
    key: "surname",
    capitalLetter: true,
    valdate: validateFIO,
    error: "",
  },
  {
    id: "4",
    label: "Отчество соавтора",
    placeholder: "Отчество",
    type: "text",
    key: "patronymic",
    capitalLetter: true,
    valdate: validateFIO,
    error: "",
  },
  {
    id: "5",
    label: "Организация*",
    placeholder: "Не заполнено",
    type: "text",
    key: "organization",
    capitalLetter: false,
    valdate: null,
    error: "",
  },

  {
    id: "6",
    label: "Номер*",
    placeholder: "+7-900-000-00-00",
    type: "tel",
    key: "phone",
    capitalLetter: false,
    valdate: null,
    error: "Некорректный номер",
  },
];
