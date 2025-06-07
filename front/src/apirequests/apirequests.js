import api from './axios';
const URL = window.location.origin;
export let server = '';
URL.includes('localhost') ? (server = 'http://localhost:3000') : (server = `${URL}/api`);

//! Запрос на Выход
export const logout = async () => {
  const data = { refreshToken: localStorage.getItem('refreshToken') };
  try {
    const response = await api.post(`${server}/auth/logout`, data);
    return response;
  } catch (error) {
    alert('Ошибка при выходе из системы !');
  }
};

//! Запрос на регистрацию
export const apiRegister = async data => {
  try {
    const response = await api.post(`${server}/auth/register`, data);
    return response;
  } catch (error) {
    console.log('apiRegister', error);
    return error;
  }
};

//! Запрос востановление пароля
export const recoveryPassword = async data => {
  try {
    const response = await api.post(`${server}/auth/recovery`, data);
    return response;
  } catch (error) {
    alert('Воостановление пароля не прошло!');
  }
};

//! Запрос на выслать код
export const sandResetPassword = async data => {
  try {
    const response = await api.post(`${server}/auth/sandReset`, data);
    return response;
  } catch (error) {
    alert('Воостановление пароля не прошло!');
  }
};

//! Запрос на авторизацию
export const LoginFunc = async UserData => {
  try {
    const response = await api.post(`${server}/auth/login`, UserData);
    const { participant, token } = response.data;
    localStorage.setItem('accessToken', token);
    localStorage.setItem('userData', JSON.stringify(participant));
    return response;
  } catch (error) {
    // alert('Пользователь не найден!');
    return error;
  }
};

//! сфеду авторизация
export const LoginFuncSfedu = async () => {
  window.location.href=`${server}/auth/login/sfedu`
 /* try {
    const response = await api.get(`${server}/auth/login/sfedu`);
    const { participant, token } = response.data;
    localStorage.setItem('accessToken', token);
    localStorage.setItem('userData', JSON.stringify(participant));
    return response;
  } catch (error) {
    // alert('Пользователь не найден!');
    return error;
  }*/
};

//! получение кода сфеду для дальнейшей отправи на бэк
export const apiLoginGetCodeSfedu = async () => {
  const clientId = process.env.REACT_APP_SFEDU_ID;
  const tenant = process.env.REACT_APP_TENANT;
  const scope = 'openid profile email offline_access';
  const authUrl =
    `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize` +
    `?client_id=${clientId}` +
    `&response_type=code` +
    `&response_mode=query` +
    `&scope=${encodeURIComponent(scope)}` +
    `&state=12345`;
  window.location.href = authUrl;
};

//! Запрос на подтверждение почты
export const CheckEmail = async Data => {
  try {
    const response = await api.post(`${server}/auth/checkEmail`, Data);
    const { participant, jwt } = response.data;
    localStorage.setItem('accessToken', jwt);
    localStorage.setItem('userData', JSON.stringify(participant));
    return response;
  } catch (error) {
    console.error('CheckEmail', error);
  }
};

//! получение данных пользователя
export const apiGetUserData = async () => {
  try {
    const response = await api.get(`${server}/participants/self`);
    return response;
  } catch (error) {
    console.log('apiGetUserData ', error);
  }
};

//! изменение данных пользователя
export const apiUpdateUser = async data => {
  try {
    const response = await api.put(`${server}/participants`, data);
    return response;
  } catch (error) {
    console.log('apiUpdateUserData ', error);
    return error;
  }
};

//! создать доклад
export const apiCreateReport = async data => {
  try {
    const response = await api.post(`${server}/reports`, data);
    return response;
  } catch (error) {
    console.log('apiCreateReport ', error);

    return error;
  }
};

//! получение всех докладов пользователя
export const apiGetReports = async () => {
  try {
    const response = await api.get(`${server}/reports`);
    return response;
  } catch (error) {
    console.log('apiGetUserData ', error);
  }
};

//! получение доклада по Id
export const apiGetReportId = async id => {
  try {
    const response = await api.get(`${server}/reports/${id}`);
    return response;
  } catch (error) {
    console.error('apiGetReportId ', error);
  }
};

//! удаление доклада пользователя
export const apiDeleteReport = async id => {
  try {
    const response = await api.delete(`${server}/reports/${id}`);
    return response;
  } catch (error) {
    console.log('apiGetUserData ', error);
  }
};

//! редактирование доклада
export const apiEditReport = async (id, data) => {
  try {
    const response = await api.put(`${server}/reports/${id}`, data);
    return response;
  } catch (error) {
    console.log('apiEditReport ', error);
    return error;
  }
};

//! редактирование докладов через админу
export const apiEditMassReports = async data => {
  try {
    const response = await api.put(`${server}/reports/directions`, data);
    return response;
  } catch (error) {
    console.log('apiEditMassReports ', error);
  }
};

//! создать конференции в бд роль свою поменять на 1 чтобы работало
export const apiCreateConferences = async dataConferences => {
  try {
    const response = await api.post(`${server}/conferences`, dataConferences);
    return response;
  } catch (error) {
    console.log('apiCreateReport ', error);
  }
};

//! получение всех конференций
export const apiGetConferences = async () => {
  try {
    const response = await api.get(`${server}/conferences`);
    return response;
  } catch (error) {
    console.log('apiGetUserData ', error);
  }
};
//! получение конференции по id
export const apiGetConferencesById = async id => {
  try {
    const response = await api.get(`${server}/conferences/${id}`);
    return response;
  } catch (error) {
    console.log('apiGetConferencesById ', error);
  }
};

//! обновление конференции через админу
export const apiPutConferencesById = async (data, id) => {
  try {
    const response = await api.put(`${server}/conferences/${id}`, data);
    return response;
  } catch (error) {
    console.log('apiPutConferencesById ', error);
  }
};
//!Создание новости
export const createNews = async data => {
  try {
    const response = await api.post(`${server}/news`, data);
    return response;
  } catch (error) {
    console.log('apiCreateReport ', error);
    return error;
  }
};

//!Получение новостей
export const getAllNews = async param => {
  try {
    const endpoint = param ? `/news/${param}` : '/news';
    const response = await api.get(`${server}${endpoint}`);
    return response;
  } catch (error) {
    console.log('apiCreateReport ', error);
  }
};

//!Получение новости по Id
export const getNewsId = async id => {
  try {
    const response = await api.get(`${server}/news/${id}`);
    return response;
  } catch (error) {
    console.log('apiCreateReport ', error);
  }
};

//!Получение новостей
export const deleteNews = async id => {
  try {
    const response = await api.delete(`${server}/news/${id}`);
    return response;
  } catch (error) {
    console.log('apiCreateReport ', error);
  }
};

//!Получение новостей
export const updateNews = async (id, data) => {
  try {
    const response = await api.put(`${server}/news/${id}`, data);
    return response;
  } catch (error) {
    console.log('apiCreateReport ', error);
  }
};

//!Создание Human Оргкомитет
export const createOrgCommitet = async data => {
  try {
    const response = await api.post(`${server}/committees`, data);
    return response;
  } catch (error) {
    console.log('apiCreateReport ', error);
  }
};

//!Создание Human Оргкомитет
export const updateOrgCommitet = async (data, id) => {
  try {
    const response = await api.put(`${server}/committees/${id}`, data);
    return response;
  } catch (error) {
    console.log('apiCreateReport ', error);
  }
};

//!Получение  Human Оргкомитета
export const getOrgCommitet = async id => {
  try {
    const response = await api.get(`${server}/committees?conferenceId=${id}`);
    return response;
  } catch (error) {
    console.log('apiCreateReport ', error);
  }
};

//!Удаление Human Оргкомитета
export const deleteOrgCommitet = async id => {
  try {
    const response = await api.delete(`${server}/committees/${id}`);
    return response;
  } catch (error) {
    console.log('apiCreateReport ', error);
  }
};

//! изменение пароля
export const apiChangePassword = async data => {
  try {
    const response = await api.post(`${server}/auth/changePassword`, data);
    return response;
  } catch (error) {
    console.log('apiChangePassword ', error);
    return error;
  }
};

//! отправка кода на емаил для востановления пароля
export const apiSandReset = async data => {
  try {
    const response = await api.post(`${server}/auth/sandReset`, data);
    return response;
  } catch (error) {
    console.log('apiSandReset ', error);
  }
};

//! востановление пароля последний этап
export const apiPasswordRecovery = async data => {
  try {
    const response = await api.post(`${server}/auth/recovery`, data);
    return response;
  } catch (error) {
    console.log('apiPasswordRecovery ', error);
  }
};

//!Получение участников конференции по Id конференции
export const getConfParticipants = async id => {
  try {
    const response = await api.get(`${server}/conferences/${id}/participants`);
    return response;
  } catch (error) {
    console.log('getConfParticipants ', error);
  }
};

//! получение оргвзнос таблицы в админ панели
export const getOrgWznos = async id => {
  try {
    const response = await api.get(`${server}/conferences/${id}/fee`);
    return response;
  } catch (error) {
    console.log('getOrgWznos ', error);
  }
};

//! получение оргвзнос таблицы в админ панели
export const apiUpdateOrgWznos = async (id, data) => {
  try {
    const response = await api.put(`${server}/conferences/${id}/fee`, data);
    return response;
  } catch (error) {
    console.log('getOrgWznos ', error);
  }
};

//! экспорт архива статей
export const apiExportArchiveState = async id => {
  try {
    const response = await api.get(`${server}/conferences/${id}/saveArchive`, {
      responseType: 'blob', // Ожидаем бинарные данные (архив)
    });
    return response;
  } catch (error) {
    console.log('getConfParticipants ', error);
  }
};

//! экспорт докладов
export const apiExportReports = async id => {
  try {
    const response = await api.get(`${server}/conferences/${id}/exportReports`, {
      responseType: 'blob', // Ожидаем бинарные данные (архив)
    });
    return response;
  } catch (error) {
    console.log('apiExportReports ', error);
  }
};

//! Экспорт экспертных заключений
export const apiExportConclusion = async id => {
  try {
    const response = await api.get(`${server}/conferences/${id}/saveConclusion`, {
      responseType: 'blob', // Ожидаем бинарные данные (архив)
    });
    return response;
  } catch (error) {
    console.log('apiExportConclusion ', error);
  }
};

//! Экспорт фотографий пользователей
export const apiExportPhotoParticipant = async id => {
  try {
    const response = await api.get(`${server}/conferences/${id}/savePhotoParticipants`, {
      responseType: 'blob', // Ожидаем бинарные данные (архив)
    });
    return response;
  } catch (error) {
    console.log('apiExportPhotoParticipant ', error);
  }
};

//! загрузка файлов
export const uploadPhoto = async (file, type) => {
  try {
    const response = await api.post(`${server}/uploads?type=${type}`, file, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    console.error('uploadPhoto ', error);
  }
};

//! загрузка файлов массивом
export const uploadMulti = async file => {
  try {
    const response = await api.post(`${server}/uploads/multi`, file, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    console.error('uploadPhoto ', error);
  }
};

// {
//   ids : [id, id]
// }

//! удаление файлов
export const apiDeleteMulti = async file => {
  try {
    const response = await api.post(`${server}/uploads/delete`, file);
    return response;
  } catch (error) {
    console.error('uploadPhoto ', error);
  }
};

//! Архивы создание

export const createArchive = async data => {
  try {
    const response = await api.post(`${server}/archive`, data);
    return response;
  } catch (error) {
    console.log('getConfParticipants ', error);
  }
};

//! Получение Архивов сборников

export const getAllArchiveReport = async () => {
  try {
    const response = await api.get(`${server}/archive/report`);
    return response;
  } catch (error) {
    console.log('getConfParticipants ', error);
  }
};

//! Получение Архивов фотографий

export const getAllArchivePhoto = async () => {
  try {
    const response = await api.get(`${server}/archive/photo`);
    return response;
  } catch (error) {
    console.log('getConfParticipants ', error);
  }
};

//! Получение Архивов фотографий
export const updateArchive = async (data, id) => {
  try {
    const response = await api.put(`${server}/archive/${id}`, data);
    return response;
  } catch (error) {
    console.log('getConfParticipants ', error);
  }
};

//! Получение Архивов фотографий
export const deleteArchive = async id => {
  try {
    const response = await api.delete(`${server}/archive/${id}`);
    return response;
  } catch (error) {
    console.log('getConfParticipants ', error);
  }
};

//! Получение Архивов фотографий
export const getConferencesParticipants = async id => {
  try {
    const response = await api.get(`${server}/conferences/${id}/participants`);
    return response;
  } catch (error) {
    console.log('getConfParticipants ', error);
  }
};

//! Получение пользователя по почте
export const getUserEmail = async email => {
  try {
    const response = await api.get(`${server}/participants/checkEmail?email=${email}`);
    return response;
  } catch (error) {
    console.log('getUserEmail ', error);
  }
};

//! удаление пользователя
export const apiDeleteAccount = async () => {
  try {
    const response = await api.delete(`${server}/participants/self`);
    return response;
  } catch (error) {
    localStorage.removeItem('accessToken');
    console.log('apiDeleteAccount ', error);
  }
};

export const apiSendConfirm = async email => {
  try {
    const response = await api.post(`${server}/auth/sandConfirm`, email);
    return response;
  } catch (error) {
    console.log('apiSendConfirm ', error);
  }
};

//! завершить конференцию
export const apiFinishConfirm = async id => {
  try {
    const response = await api.put(`${server}/conferences/${id}/finish`);
    return response;
  } catch (error) {
    console.log('apiFinishConfirm ', error);
  }
};

//! получение партнеров и организаторов
export const apiGetOrganizersPartners = async () => {
  try {
    const response = await api.get(`${server}/collaborators`);
    return response;
  } catch (error) {
    console.log('apiGetOrganizersPartners ', error);
  }
};

//! создание организатора партнера
export const apiCreateOrganizersPartners = async data => {
  try {
    const response = await api.post(`${server}/collaborators`, data);
    return response;
  } catch (error) {
    console.log('apiCreateOrganizersPartners ', error);
  }
};

//! удаление организатора партнера
export const apiDeleteOrganizersPartners = async id => {
  try {
    const response = await api.delete(`${server}/collaborators/${id}`);
    return response;
  } catch (error) {
    console.log('apiDeleteOrganizersPartners ', error);
  }
};

//! обновление организатора партнера
export const apiUpdateOrganizersPartners = async (data, id) => {
  try {
    const response = await api.put(`${server}/collaborators/${id}`, data);
    return response;
  } catch (error) {
    console.log('apiUpdateOrganizersPartners ', error);
  }
};
