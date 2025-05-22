import { useTranslation } from 'react-i18next';
import { doljnostList, stepenList, zwanieList } from '../../utils/Lists/List';

export const useInputsData = () => {
  const { t } = useTranslation('profileEditing');

  return [
    {
      id: '0',
      name: t('form.name'), // локализованное название
      title: 'name',
      required: true,
      list: null,
      type: 'text',
    },
    {
      id: '1',
      name: t('form.surname'),
      title: 'surname',
      required: true,
      list: null,
      type: 'text',
    },
    {
      id: '2',
      name: t('form.patronymic'),
      title: 'patronymic',
      required: false,
      list: null,
      type: 'text',
    },
    {
      id: '6',
      name: t('form.organization'),
      title: 'organization',
      required: true,
      list: null,
      type: 'text',
    },
    {
      id: '7',
      name: t('form.email'),
      title: 'email',
      required: true,
      list: null,
      type: 'email',
      disabled: true,
      readOnly: true,
    },
    {
      id: '8',
      name: t('form.phone'),
      title: 'phone',
      required: true,
      list: null,
      type: 'text',
    },
    {
      id: '3',
      name: t('form.academicTitle'),
      title: 'academicTitle',
      required: true,
      list: zwanieList,
      type: 'text',
    },
    {
      id: '4',
      name: t('form.degree'),
      title: 'degree',
      required: true,
      list: stepenList,
      type: 'text',
    },
    {
      id: '5',
      name: t('form.position'),
      title: 'position',
      required: false,
      list: null,
      type: 'text',
    },
  ];
};

export const useErrorMessages = () => {
  const { t } = useTranslation();

  return [
    {
      key: 'name',
      error: t('errors.name'),
    },
    {
      key: 'surname',
      error: t('errors.surname'),
    },
    {
      key: 'email',
      error: t('errors.email'),
    },
    {
      key: 'phone',
      error: t('errors.phone'),
    },
    {
      key: 'organization',
      error: t('errors.organization'),
    },
    {
      key: 'academicTitle',
      error: t('errors.academicTitle'),
    },
    {
      key: 'degree',
      error: t('errors.degree'),
    },
    {
      key: 'position',
      error: t('errors.position'),
    },
    {
      key: 'phone entity already exists',
      error: t('errors.phoneExists'),
    },
  ];
};
