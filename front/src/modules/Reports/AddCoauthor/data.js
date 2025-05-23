import { validateFIO } from '../../../utils/functions/Validations';

export const inpustTypeEmail = [
  {
    id: '1',
    label: 'Email*',
    labelEn: 'Email*',
    placeholder: 'Email',
    placeholderEn: 'Email',
    type: 'email',
    key: 'email',
    capitalLetter: false,
    valdate: null,
    error: 'Некорректная почта',
    errorEn: 'Invalid email address',
  },
];

export const inpustType = [
  {
    id: '2',
    label: 'Имя соавтора*',
    labelEn: "Co-author's first name*",
    placeholder: 'Имя',
    placeholderEn: 'First name',
    type: 'text',
    key: 'name',
    capitalLetter: true,
    valdate: validateFIO,
    error: '',
    errorEn: '',
  },
  {
    id: '3',
    label: 'Фамилия соавтора*',
    labelEn: "Co-author's last name*",
    placeholder: 'Фамилия',
    placeholderEn: 'Last name',
    type: 'text',
    key: 'surname',
    capitalLetter: true,
    valdate: validateFIO,
    error: '',
    errorEn: '',
  },
  {
    id: '4',
    label: 'Отчество соавтора',
    labelEn: "Co-author's middle name",
    placeholder: 'Отчество',
    placeholderEn: 'Middle name',
    type: 'text',
    key: 'patronymic',
    capitalLetter: true,
    valdate: validateFIO,
    error: '',
    errorEn: '',
  },
];

export const inpustTypeSoavtor = [
  {
    id: '5',
    label: 'Организация*',
    labelEn: 'Collaborator*',
    placeholder: 'Не заполнено',
    placeholderEn: 'Not filled',
    type: 'text',
    key: 'organization',
    capitalLetter: false,
    error: '',
    errorEn: '',
    valdate: validateFIO,
  },
  {
    id: '6',
    label: 'Форма участия',
    labelEn: 'Form of participation',
    placeholder: 'Не заполнено',
    placeholderEn: 'Not filled',
    type: 'text',
    key: 'form',
    capitalLetter: false,
    error: '',
    errorEn: '',
    valdate: null,
  },
  {
    id: '7',
    label: 'Статус участия',
    labelEn: 'Participation status',
    placeholder: 'Не заполнено',
    placeholderEn: 'Not filled',
    type: 'text',
    key: 'status',
    capitalLetter: false,
    error: '',
    errorEn: '',
    valdate: null,
  },
];

export const errorsNames = [
  {
    key: 'name',
    error: 'Некорректное название доклада!',
    errorEn: 'Invalid report title!',
  },
  {
    key: 'surname',
    error: 'Некорректная фамилия соавтора!',
    errorEn: "Invalid co-author's last name!",
  },
  {
    key: 'email',
    error: 'Некорректная почта соавтора!',
    errorEn: "Invalid co-author's email!",
  },
  {
    key: 'organization',
    error: 'Некорректная организация!',
    errorEn: 'Invalid organization!',
  },
];
