import { validateFIO } from '../../../utils/functions/Validations';

export const inpustTypeEmail = [
  {
    id: '1',
    label: 'Email*',
    placeholder: 'Email',
    type: 'email',
    key: 'email',
    capitalLetter: false,
    valdate: null,
    error: 'Некорректная почта',
  },
];

export const inpustType = [
  // {
  //   id: "1",
  //   label: "Email*",
  //   placeholder: "Email",
  //   type: "email",
  //   key: "email",
  //   capitalLetter: false,
  //   valdate: null,
  //   error: "Некорректная почта",
  // },
  {
    id: '2',
    label: 'Имя соавтора*',
    placeholder: 'Имя',
    type: 'text',
    key: 'name',
    capitalLetter: true,
    valdate: validateFIO,
    error: '',
  },
  {
    id: '3',
    label: 'Фамилия соавтора*',
    placeholder: 'Фамилия',
    type: 'text',
    key: 'surname',
    capitalLetter: true,
    valdate: validateFIO,
    error: '',
  },
  {
    id: '4',
    label: 'Отчество соавтора',
    placeholder: 'Отчество',
    type: 'text',
    key: 'patronymic',
    capitalLetter: true,
    valdate: validateFIO,
    error: '',
  },
];

export const inpustTypeSoavtor = [
  {
    id: '5',
    label: 'Организация*',
    placeholder: 'Не заполнено',
    type: 'text',
    key: 'organization',
    capitalLetter: false,
    error: '',
    valdate: validateFIO,
  },
  {
    id: '6',
    label: 'Форма участия',
    placeholder: 'Не заполнено',
    type: 'text',
    key: 'form',
    capitalLetter: false,
    error: '',
    valdate: null,
  },
  {
    id: '6',
    label: 'Статус участия',
    placeholder: 'Не заполнено',
    type: 'text',
    key: 'status',
    capitalLetter: false,
    error: '',
    valdate: null,
  },
];
