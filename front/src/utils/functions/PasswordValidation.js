//! функция проверки не менее 8 символов
export function funEightSymbols(text) {
  const isValid = [...text].length >= 8; // Проверяем, что длина текста не менее 8 символов
  return { id: '0', done: isValid };
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
