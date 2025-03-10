import React, { useContext } from 'react';
import { InputFields } from './InputFields';
import { GlobalStateContext } from '../GlobalStateContext';

export const HeaderSection = () => {
  const { imageSrc, setImageSrc } = useContext(GlobalStateContext);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="header-section">
      <div id='resume-text'>
        <h1>Резюме</h1>
      </div>
      <div className='image-upload-div'>

        <div className="avatar-wrapper" style={imageSrc ? { display: "block" } : { display: "none" }}>
          <img className="avatar" id="uploadedImage" alt="Uploaded" src={imageSrc} />
        </div>
        <label htmlFor="file-upload" className="upload-btn">
          <div className="plus-icon" />
        </label>

        <input
          id="file-upload"
          type="file"
          onChange={handleImageUpload}
          className="hidden-input"
        />
      </div>
      <InputFields />
    </div>
  );
};
