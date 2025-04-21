//! функция проверки не менее 8 символов
export function funEightSymbols(text) {
  const isValid = [...text].length >= 8; // Проверяем, что длина текста не менее 8 символов
  return { id: '0', done: isValid };
}

//! не более 16 символов
export function funSixteenSymbols(text) {
  const isValid = [...text].length <= 16; // Проверяем, что длина текста не более 16 символов
  return { id: '4', done: isValid };
}

//! проверка не меенее 1 заглавной буквы
export function funCapitalLetter(text) {
  const hasCapitalLetter = /[A-ZА-ЯЁ]/.test(text);
  return { id: '1', done: hasCapitalLetter };
}
//! Проверяем, есть ли хотя бы одна цифра
export function funDigit(text) {
  const hasDigit = /\d/.test(text);
  return { id: '2', done: hasDigit };
}

//! не менее 1 спецсимвола
export function funSpecialSymbol(text) {
  const hasSpecialSymbol = /[!@#$%&?]/.test(text);
  return { id: '3', done: hasSpecialSymbol };
}

//! только латинские буквы
export const validateLatinSymbols = value => {
  const regex = /^(?=.*[A-Za-z])[A-Za-z0-9!@#$№%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
  return { id: '5', done: regex.test(value) };
};

//! валидация только английские буквы
export const validatePassword = value => {
  const regex = /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/;
  return regex.test(value);
};
