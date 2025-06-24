export const funValidateAll = data => {
  //! проверяем что все поля заполнены
  let errors = [];
  [
    'comments',
    'directionConference',
    'formParticipation',
    'name',
    'organization',
    'participationStatus',
  ].map(key => {
    if (data[key] === '' || data[key] === null || data[key] === undefined) {
      errors.push({
        key: key,
        error: 'Поле обязательно для заполнения',
      });
    }
  });
  ['name', 'comments', 'organization'].map(key => {
    if (data[key]?.length > 300) {
      errors.push({
        key: key,
        error: 'Не более 300 символов',
      });
    }
  });
  return errors;
};

export const funGetError = (errors, key) => {
  return errors?.find(item => item.key === key)?.error;
};
