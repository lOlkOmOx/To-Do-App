import React, { createContext, useContext, useState } from "react";
import en from "../lang/en.json"
import cz from "../lang/cz.json"
import de from "../lang/de.json"

const translations = {en, cz, de}

const TranslationContext = createContext();

export const useTranslation = () => useContext(TranslationContext);

export const Translation = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [Translations, setTranslations] = useState(translations[currentLanguage]);

  const changeLanguage = (newLanguage) => {
    setCurrentLanguage(newLanguage);
    setTranslations(translations[newLanguage]);
  };

  return (
    <TranslationContext.Provider value={{ t: Translations, changeLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
};