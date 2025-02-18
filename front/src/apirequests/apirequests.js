import api from "./axios";
const server = "http://localhost:3000";

const REFRESH_INTERVAL = 1500000; // 25 минут
let refreshTokensTimeout;

export const refreshTokens = async (accessToken, refreshToken) => {
  try {
    const response = await api.post(
      `${server}/auth/refresh`,
      { refreshToken },
      {
        headers: {
          Authorization: accessToken,
        },
      }
    );
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      response.data;
    localStorage.setItem("accessToken", newAccessToken);
    localStorage.setItem("refreshToken", newRefreshToken);
  } catch (error) {
    console.error("Тоекны не обновлены!");
  }
};

const refreshTokensTimer = () => {
  clearTimeout(refreshTokensTimeout);
  if (localStorage.getItem("accessToken") === "null") {
    return;
  }
  const lastRefreshTime = localStorage.getItem("lastRefreshTime");
  const currentTime = Date.now();
  let timeRemaining;
  if (lastRefreshTime) {
    const nextRefreshTime = parseInt(lastRefreshTime) + REFRESH_INTERVAL;
    timeRemaining = Math.max(0, nextRefreshTime - currentTime);
  } else {
    timeRemaining = 0;
  }
  refreshTokensTimeout = setTimeout(() => {
    refreshTokens(
      localStorage.getItem("accessToken"),
      localStorage.getItem("refreshToken")
    );
    localStorage.setItem("lastRefreshTime", Date.now());
    refreshTokensTimer();
  }, timeRemaining);

  localStorage.setItem("refreshTokensInterval", refreshTokensTimeout);
};

window.addEventListener("load", () => {
  refreshTokensTimer();
});

window.addEventListener("unload", () => {
  clearTimeout(refreshTokensTimeout);
});

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

//! Запрос на авторизацию
export const LoginFunc = async (UserData) => {
  try {
    const response = await api.post(`${server}/auth/login`, UserData);
    const { token, refreshToken, ...userData } = response.data;
    localStorage.setItem("accessToken", token);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("userData", JSON.stringify(userData));
    refreshTokensTimer();
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
    alert("Пользователь не найден!");
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

//!Создание новости 
export const createNews = async (data) => {
  try {
    const response = await api.post(`${server}/news`, data);
    return response;
  } catch (error) {
    console.log("apiCreateReport ", error);
  }
}

//!Получение новостей
export const getAllNews = async (data) => {
  try {
    const response = await api.get(`${server}/news?year=2025?limit=10`, data);
    return response;
  } catch (error) {
    console.log("apiCreateReport ", error);
  }
}