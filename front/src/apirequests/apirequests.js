import api from "./axios";
export const server = "http://localhost:3000";

//! Запрос на Выход
export const logout = async () => {
  const data = { refreshToken: localStorage.getItem("refreshToken") };
  console.log(data);
  try {
    const response = await api.post(`${server}/auth/logout`, data);

    return response;
  } catch (error) {
    alert("Ошибка при выходе из системы !");
  }
};

//! Запрос на регистрацию
export const apiRegister = async (data) => {
  try {
    const response = await api.post(`${server}/auth/register`, data);
    return response;
  } catch (error) {
    alert("Регистрация не прошла!");
  }
};

//! Запрос востановление пароля
export const recoveryPassword = async (data) => {
  try {
    const response = await api.post(`${server}/auth/recovery`, data);
    return response;
  } catch (error) {
    alert("Регистрация не прошла!");
  }
};

//! Запрос на выслать код
export const sandResetPassword = async (data) => {
  try {
    const response = await api.post(`${server}/auth/sandReset`, data);
    return response;
  } catch (error) {
    alert("Регистрация не прошла!");
  }
};

//! Запрос на авторизацию
export const LoginFunc = async (UserData) => {
  try {
    const response = await api.post(`${server}/auth/login`, UserData);
    const { token, refreshToken, ...userData } = response.data;
    localStorage.setItem("accessToken", token);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("userData", JSON.stringify(userData));
    return response;
  } catch (error) {
    alert("Пользователь не найден!");
  }
};

//! Запрос на подтверждение почты
export const CheckEmail = async (Data) => {
  try {
    const response = await api.post(`${server}/auth/checkEmail`, Data);
    return response;
  } catch (error) {
    console.error("CheckEmail", error);
  }
};

//! получение данных пользователя
export const apiGetUserData = async () => {
  try {
    const response = await api.get(`${server}/participants/self`);
    return response;
  } catch (error) {
    console.log("apiGetUserData ", error);
  }
};

//! изменение данных пользователя
export const apiUpdateUser = async (data) => {
  try {
    const response = await api.put(`${server}/participants`, data);
    return response;
  } catch (error) {
    console.log("apiUpdateUserData ", error);
  }
};

//! создать доклад
export const apiCreateReport = async (data) => {
  try {
    const response = await api.post(`${server}/reports`, data);
    return response;
  } catch (error) {
    console.log("apiCreateReport ", error);
  }
};

//! получение всех докладов пользователя
export const apiGetReports = async () => {
  try {
    const response = await api.get(`${server}/reports`);
    return response;
  } catch (error) {
    console.log("apiGetUserData ", error);
  }
};

//! получение доклада по Id
export const apiGetReportId = async (id) => {
  try {
    const response = await api.get(`${server}/reports/${id}`);
    return response;
  } catch (error) {
    console.error("apiGetReportId ", error);
  }
};

//! удаление доклада пользователя
export const apiDeleteReport = async (id) => {
  try {
    const response = await api.delete(`${server}/reports/${id}`);
    return response;
  } catch (error) {
    console.log("apiGetUserData ", error);
  }
};

//! редактирование доклада
export const apiEditReport = async (id, data) => {
  try {
    const response = await api.put(`${server}/reports/${id}`, data);
    return response;
  } catch (error) {
    console.log("apiEditReport ", error);
  }
};

//! создать конференции в бд роль свою поменять на 1 чтобы работало
export const apiCreateConferences = async (dataConferences) => {
  try {
    const response = await api.post(`${server}/conferences`, dataConferences);
    return response;
  } catch (error) {
    console.log("apiCreateReport ", error);
  }
};

//! получение всех конференций
export const apiGetConferences = async () => {
  try {
    const response = await api.get(`${server}/conferences`);
    return response;
  } catch (error) {
    console.log("apiGetUserData ", error);
  }
};
//! получение конференции по id
export const apiGetConferencesById = async (id) => {
  try {
    const response = await api.get(`${server}/conferences/${id}`);
    return response;
  } catch (error) {
    console.log("apiGetConferencesById ", error);
  }
};

//! обновление конференции через админу
export const apiPutConferencesById = async (data, id) => {
  try {
    const response = await api.put(`${server}/conferences/${id}`, data);
    return response;
  } catch (error) {
    console.log("apiPutConferencesById ", error);
  }
};
//!Создание новости
export const createNews = async (data) => {
  try {
    const response = await api.post(`${server}/news`, data);
    return response;
  } catch (error) {
    console.log("apiCreateReport ", error);
  }
};

//!Получение новостей
export const getAllNews = async (param) => {
  try {
    const endpoint = param ? `/news/${param}` : "/news";
    const response = await api.get(`${server}${endpoint}`);
    return response;
  } catch (error) {
    console.log("apiCreateReport ", error);
  }
};

//!Получение новости по Id
export const getNewsId = async (id) => {
  try {
    const response = await api.get(`${server}/news/${id}`);
    return response;
  } catch (error) {
    console.log("apiCreateReport ", error);
  }
};

//!Получение новостей
export const deleteNews = async (id) => {
  try {
    const response = await api.delete(`${server}/news/${id}`);
    return response;
  } catch (error) {
    console.log("apiCreateReport ", error);
  }
};

//!Получение новостей
export const updateNews = async (id, data) => {
  try {
    const response = await api.put(`${server}/news/${id}`, data);
    return response;
  } catch (error) {
    console.log("apiCreateReport ", error);
  }
};

//!Создание Human Оргкомитет
export const createOrgCommitet = async (data) => {
  try {
    const response = await api.post(`${server}/committees`, data);
    return response;
  } catch (error) {
    console.log("apiCreateReport ", error);
  }
};

//!Создание Human Оргкомитет
export const updateOrgCommitet = async (data, id) => {
  try {
    const response = await api.put(`${server}/committees/${id}`, data);
    return response;
  } catch (error) {
    console.log("apiCreateReport ", error);
  }
};

//!Получение  Human Оргкомитета
export const getOrgCommitet = async () => {
  try {
    const response = await api.get(`${server}/committees`);
    return response;
  } catch (error) {
    console.log("apiCreateReport ", error);
  }
};

//!Удаление Human Оргкомитета
export const deleteOrgCommitet = async (id) => {
  try {
    const response = await api.delete(`${server}/committees/${id}`);
    return response;
  } catch (error) {
    console.log("apiCreateReport ", error);
  }
};

//! изменение пароля
export const apiChangePassword = async (data) => {
  try {
    const response = await api.post(`${server}/auth/changePassword`, data);
    return response;
  } catch (error) {
    console.log("apiChangePassword ", error);
  }
};

//! отправка кода на емаил для востановления пароля
export const apiSandReset = async (data) => {
  try {
    const response = await api.post(`${server}/auth/sandReset`, data);
    return response;
  } catch (error) {
    console.log("apiSandReset ", error);
  }
};

//! востановление пароля последний этап
export const apiPasswordRecovery = async (data) => {
  try {
    const response = await api.post(`${server}/auth/recovery`, data);
    return response;
  } catch (error) {
    console.log("apiPasswordRecovery ", error);
  }
};

//!Получение участников конференции по Id конференции
export const getConfParticipants = async (id) => {
  try {
    const response = await api.get(`${server}/conferences/${id}/participants`);
    return response;
  } catch (error) {
    console.log("getConfParticipants ", error);
  }
};

//! получение оргвзнос таблицы в админ панели
export const getOrgWznos = async (id) => {
  try {
    const response = await api.get(`${server}/conferences/${id}/fee`);
    return response;
  } catch (error) {
    console.log("getOrgWznos ", error);
  }
};

//! экспорт архива статей
export const apiExportArchiveState = async (id) => {
  try {
    const response = await api.get(`${server}/conferences/${id}/saveArchive`, {
      responseType: "blob", // Ожидаем бинарные данные (архив)
    });
    return response;
  } catch (error) {
    console.log("getConfParticipants ", error);
  }
};

//! загрузка файлов
export const uploadPhoto = async (file, type) => {
  try {
    const response = await api.post(`${server}/uploads?type=${type}`, file, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.error("uploadPhoto ", error);
  }
};

//! Архивы создание

export const createArchive = async (data) => {
  try {
    const response = await api.post(`${server}/archive`, data);
    return response;
  } catch (error) {
    console.log("getConfParticipants ", error);
  }
};

//! Получение Архивов сборников

export const getAllArchiveReport = async () => {
  try {
    const response = await api.get(`${server}/archive/report`);
    return response;
  } catch (error) {
    console.log("getConfParticipants ", error);
  }
};

//! Получение Архивов фотографий

export const getAllArchivePhoto = async () => {
  try {
    const response = await api.get(`${server}/archive/photo`);
    return response;
  } catch (error) {
    console.log("getConfParticipants ", error);
  }
};

//! Получение Архивов фотографий
export const updateArchive = async (data, id) => {
  try {
    const response = await api.put(`${server}/archive/${id}`, data);
    return response;
  } catch (error) {
    console.log("getConfParticipants ", error);
  }
};

//! Получение Архивов фотографий
export const deleteArchive = async (id) => {
  try {
    const response = await api.delete(`${server}/archive/${id}`);
    return response;
  } catch (error) {
    console.log("getConfParticipants ", error);
  }
};
