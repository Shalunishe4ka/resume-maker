import React, { createContext, useState } from "react";

export const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const [personalData, setPersonalData] = useState({
    name: "",
    surname: "",
    patronymic: "",
    patronymicCheck: false,
    position: "",
    email: "",
    phone: "",
    address: "",
    sex: "",
    birthDate: "",
  });

  const [mainInfo, setMainInfo] = useState([
    {
      wishSalary: "",
      workGraph: [],
      movements: "",
      family: "",
    },
  ]);

  const [experiences, setExperiences] = useState([
    {
      company: "",
      dateFrom: "",
      deteTil: "",
      position: "",
      description: "",
    },
  ]);

  const [additionalInfo, setAdditionalInfo] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [date, setDate] = useState(new Date());
  const [errors, setErrors] = useState({});
  const [imageSrc, setImageSrc] = useState(null);

  return (
    <GlobalStateContext.Provider
      value={{
        personalData,
        setPersonalData,
        mainInfo,
        setMainInfo,
        experiences,
        setExperiences,
        additionalInfo,
        setAdditionalInfo,
        aboutMe,
        setAboutMe,
        date,
        setDate,
        errors,
        setErrors,
        imageSrc,
        setImageSrc,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};
