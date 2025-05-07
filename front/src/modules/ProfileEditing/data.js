import { doljnostList, stepenList, zwanieList } from '../../utils/Lists/List';

export const inputsData = [
  {
    id: '0',
    name: 'Ваше имя*',
    title: 'name',
    required: true,
    list: null,
    type: 'text',
  },
  {
    id: '1',
    name: 'Ваша фамилия*',
    title: 'surname',
    required: true,
    list: null,
    type: 'text',
  },
  {
    id: '2',
    name: 'Ваше отчество',
    title: 'patronymic',
    required: false,
    list: null,
    type: 'text',
  },

  {
    id: '6',
    name: 'Организация*',
    title: 'organization',
    required: true,
    list: null,
    type: 'text',
  },
  {
    id: '7',
    name: 'Email*',
    title: 'email',
    required: true,
    list: null,
    type: 'email',
    disabled: true,
    readOnly: true,
  },
  {
    id: '8',
    name: 'Номер*',
    title: 'phone',
    required: true,
    list: null,
    type: 'text',
  },
  {
    id: '3',
    name: 'Учёное звание*',
    title: 'academicTitle',
    required: true,
    list: zwanieList,
    type: 'text',
  },
  {
    id: '4',
    name: 'Учёная степень*',
    title: 'degree',
    required: true,
    list: stepenList,
    type: 'text',
  },
  {
    id: '5',
    name: 'Должность*',
    title: 'position',
    required: true,
    list: doljnostList,
    type: 'text',
  },
];

export const errorsNames = [
  {
    key: 'name',
    error: 'Некорректное имя!',
  },
  {
    key: 'surname',
    error: 'Некорректная фамилия!',
  },
  {
    key: 'email',
    error: 'Некорректная почта!',
  },
  {
    key: 'phone',
    error: 'Некорректный номер!',
  },
  {
    key: 'organization',
    error: 'Некорректная организация!',
  },
  {
    key: 'academicTitle',
    error: 'Некорректное ученое звание!',
  },
  {
    key: 'degree',
    error: 'Некорректная степень!',
  },
  {
    key: 'position',
    error: 'Некорректная должность!',
  },
  {
    key: 'phone entity already exists',
    error: 'Пользователь с таким номером уже существует!',
  },
];
