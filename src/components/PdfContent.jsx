import React from 'react';
import "./pdfContent.css"


export const PdfContent = ({
  personalData,
  mainInfo,
  experiences,
  additionalInfo,
  aboutMe,
  date,
  imageSrc
}) => {

  // Стиль для разделителей между секциями и внутри блока опыта
  const separatorStyle = {
    border: '0',
    height: '1px',
    backgroundImage: 'linear-gradient(to right, rgba(0, 123, 255, 0), rgba(0, 123, 255, 0.75), rgba(0, 123, 255, 0))',
    margin: '10px 0'
  };

  return (
    <div id="pdfContent" className="container">
      {/* Шапка резюме */}
      <div className="header">
        {imageSrc && (
          <img src={imageSrc} alt="Avatar" className="avatar-pdf" />
        )}
        <div className="nameContainer">
          <h1 className="name">
            {personalData.surname} {personalData.name} {personalData.patronymic}
          </h1>
          <h2 className="position">
            {personalData.position || 'Должность'}
          </h2>
        </div>
      </div>

      {/* Контактная информация */}
      <div className="section">
        <h3 className="sectionTitle">Контактная информация</h3>
        <div style={separatorStyle} />
        <p className="paragraph"><strong>Email:</strong> {personalData.email}</p>
        <p className="paragraph"><strong>Телефон:</strong> {personalData.phone}</p>
        <p className="paragraph"><strong>Адрес:</strong> {personalData.address}</p>
        <p className="paragraph"><strong>Дата рождения:</strong> {personalData.birthDate}</p>
      </div>

      {/* Основная информация */}
      <div className="section">
        <h3 className="sectionTitle">Основная информация</h3>
        <div style={separatorStyle} />
        <p className="paragraph">
          <strong>Желаемая зарплата:</strong> {(mainInfo[0]?.wishSalary || "").toLowerCase()}
        </p>
        <p className="paragraph">
          <strong>График работы:</strong> {
            Array.isArray(mainInfo[0]?.workGraph)
              ? mainInfo[0].workGraph.map(item => item.toLowerCase()).join(', ')
              : (mainInfo[0]?.workGraph || "").toLowerCase()
          }
        </p>
        <p className="paragraph">
          <strong>Перемещения:</strong> {(mainInfo[0]?.movements || "").toLowerCase()}
        </p>
        <p className="paragraph">
          <strong>Семейное положение:</strong> {(mainInfo[0]?.family || "").toLowerCase()}
        </p>
      </div>

      {/* Опыт работы */}
      <div className="section">
        <h3 className="sectionTitle">Опыт работы</h3>
        <div style={separatorStyle} />
        {experiences && experiences.length > 0 ? (
          experiences.map((exp, index) => {
            // Разбиваем обязанности по переносу строки
            const responsibilities = exp.description
              ? exp.description.split('\n').filter(item => item.trim() !== '')
              : [];
            return (
              <div
                key={index}
                className="experienceItem"
              >
                <div className='experiences-wrapper'>
                  {/* Левая колонка: название компании и даты */}
                  <div style={{ flex: 1, marginRight: '20px' }}>
                    <h4 className="experienceCompany">
                      {exp.company}
                    </h4>
                    <p className="experienceDates">
                      {exp.dateFrom} - {exp.dateTil}
                    </p>
                  </div>
                  {/* Правая колонка: должность и обязанности */}
                  <div style={{ flex: 1 }}>
                    <h3 className="experienceTitle">
                      {exp.position}
                    </h3>
                    {responsibilities.length > 0 && (
                      <ul className='responsibilities-ul'>
                        {responsibilities.map((item, i) => (
                          <li key={i} className='responsibilities-li'>
                            <span className='responsibilities-span'>✓</span>{item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                {index < experiences.length - 1 && <div style={separatorStyle} />}
              </div>
            );
          })
        ) : (
          <p className="paragraph">Нет опыта работы</p>
        )}
      </div>

      {/* Дополнительная информация */}
      <div className="section">
        <h3 className="sectionTitle">Дополнительная информация</h3>
        <div style={separatorStyle} />
        <p className="paragraph">
          {additionalInfo}
        </p>
      </div>

      {/* О себе */}
      <div className="section">
        <h3 className="sectionTitle">О себе</h3>
        <div style={separatorStyle} />
        <p className="paragraph">
          {aboutMe}
        </p>
      </div>
    </div>
  );
};
