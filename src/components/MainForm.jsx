// MainForm.jsx
import React, { useContext } from 'react';
import { generatePDF } from './generatePDF';
import { HeaderSection } from './HeaderSection';
import { GlobalStateContext } from '../GlobalStateContext';
import { PdfContent } from './PdfContent';


const MainForm = () => {
  const {
    personalData,
    mainInfo,
    experiences,
    additionalInfo,
    aboutMe,
    date,
    errors,
    imageSrc,
  } = useContext(GlobalStateContext);

  const handleGeneratePDF = () => {
    generatePDF({
      personalData,
      mainInfo,
      experiences,
      additionalInfo,
      aboutMe,
      date,
      errors,
      imageSrc,
    });
  };

  return (
    <div className='mainForm'>
      <HeaderSection />
      {/* <PdfContent
        personalData={personalData}
        mainInfo={mainInfo}
        experiences={experiences}
        additionalInfo={additionalInfo}
        aboutMe={aboutMe}
        date={date}
        errors={errors}
        imageSrc={imageSrc} /> */}
      <button className="btn no-print generate-pdf-btn" onClick={handleGeneratePDF}>
        Скачать PDF
      </button>
    </div>
  );
};

export default MainForm;
