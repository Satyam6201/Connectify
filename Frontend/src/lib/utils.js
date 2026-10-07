import { LANGUAGE_TO_FLAG } from "../constants";

export const capitialize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getLanguageFlagUrl = (language) => {
  if (!language) return null;
  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];
  return countryCode ? `https://flagcdn.com/24x18/${countryCode}.png` : null;
};