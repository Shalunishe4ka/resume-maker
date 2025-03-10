import React from 'react';
import ReactMarkdown from 'react-markdown';

export const PdfContent = ({
  personalData,
  mainInfo,
  experiences,
  additionalInfo,
  aboutMe,
  imageSrc
}) => {
  // Общий стиль контейнера
  const containerStyle = {
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    color: '#333',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '60px 20px',
    backgroundColor: '#fff'
  };

  // Стиль для шапки: два столбца с мягким фоном
  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    background: 'rgba(0, 123, 255, 0.1)',
    borderRadius: '8px',
    marginBottom: '20px'
  };

  const leftHeaderStyle = {
    display: 'flex',
    alignItems: 'center'
  };

  const imageStyle = {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginRight: '10px',
    border: '2px solid #007bff'
  };

  // const nameStyle = {
  //   fontSize: '24px',
  //   fontWeight: 'bold'
  // };

  const contactsStyle = {
    textAlign: 'right'
  };

  // Стиль для секции основной информации – две колонки
  const mainInfoStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #007bff'
  };

  const mainInfoLabelsStyle = {
    flex: 1,
    fontWeight: 'bold'
  };

  const mainInfoValuesStyle = {
    flex: 2
  };

  // Функция для рендеринга поля, только если значение существует
  const renderField = (label, value) => {
    if (!value || value.trim() === '') return null;
    return (
      <p style={{ margin: '4px 0' }}>
        {label && <strong>{label}:</strong>} {value}
      </p>
    );
  };

  const renderMainField = (label, value) => {
    if (!value || value.trim() === '') return null;
    return (
      <h2>
        {label && <strong>{label}:</strong>} {value}
      </h2>
    );
  };
  // Контакты в шапке (справа)
  const headerContacts = (
    <>
      {renderField('Телефон', personalData.phone)}
      {renderField('Email', personalData.email)}
      {mainInfo[0]?.socialNetworks && mainInfo[0].socialNetworks.length > 0 && (
        <div>
          <strong>Соц. сети:</strong>
          {mainInfo[0].socialNetworks.map((sn, idx) => {
            if ((!sn.network || sn.network.trim() === '') && (!sn.link || sn.link.trim() === '')) return null;
            return (
              <div key={idx}>
                {sn.network && <span>{sn.network}</span>}
                {sn.link && <span> - {sn.link}</span>}
              </div>
            );
          })}
        </div>
      )}
    </>
  );

  // Данные основной информации
  const mainInfoData = mainInfo[0] || {};

  // Опыт работы – отрисовка компании, дат, должности и описания обязанностей
  const experienceItems = experiences && experiences.length > 0 ? experiences.map((exp, index) => {
    if (!exp.company && !exp.dateFrom && !exp.dateTil && !exp.position && !exp.description) return null;
    const responsibilities = exp.description
      ? exp.description.split('\n').filter(item => item.trim() !== '')
      : [];
      
    return (
      <div key={index} style={{
        marginBottom: '15px',
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '8px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ flex: 1, marginRight: '20px' }}>
            {exp.company && <h4 style={{ margin: '4px 0' }}>{exp.company}</h4>}
            {(exp.dateFrom || exp.dateTil) && (
              <p style={{ margin: '4px 0', color: '#555', fontStyle: 'italic' }}>
                {exp.dateFrom} {exp.dateFrom && exp.dateTil && '-'} {exp.dateTil}
              </p>
            )}
          </div>
          <div style={{ flex: 1 }}>
            {exp.position && <h4 style={{ margin: '4px 0' }}>{exp.position}</h4>}
            {responsibilities.length > 0 && (
              <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                {responsibilities.map((item, i) => (
                  <li key={i} style={{ marginBottom: '4px' }}>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  }).filter(item => item) : <p style={{ margin: '4px 0' }}>Нет опыта работы</p>;

  // Секция "Научная деятельность" – отдельное поле с нумерованным списком
  const scientificActivityRendered = experiences[0]?.scientificActivity && experiences[0].scientificActivity.trim() !== '' && (
    <div style={{ marginBottom: '20px' }}>
      <h3 style={{ borderBottom: '2px solid #007bff', paddingBottom: '5px', color: '#007bff' }}>
        Научная деятельность
      </h3>
      {(() => {
        const items = experiences[0].scientificActivity.split('\n').filter(item => item.trim() !== '');
        return (
          <ol style={{ margin: '4px 0', paddingLeft: '20px' }}>
            {items.map((item, index) => (
              <li key={index} style={{ marginBottom: '4px' }}>{item}</li>
            ))}
          </ol>
        );
      })()}
    </div>
  );

  // Дополнительная информация и "О себе" – рендерим только если заполнены
  const additionalInfoRendered = additionalInfo && additionalInfo.trim() !== '' && (
    <div style={{ marginBottom: '20px' }}>
      <h3 style={{ borderBottom: '2px solid #007bff', paddingBottom: '5px', color: '#007bff' }}>
        Дополнительная информация
      </h3>
      <ReactMarkdown>{additionalInfo}</ReactMarkdown>
    </div>
  );

  // О себе с Markdown
  const aboutMeRendered = aboutMe && aboutMe.trim() !== '' && (
    <div style={{ marginBottom: '20px' }}>
      <h3 style={{ borderBottom: '2px solid #007bff', paddingBottom: '5px', color: '#007bff' }}>
        О себе
      </h3>
      <ReactMarkdown>{aboutMe}</ReactMarkdown>
    </div>
  );

  // Скиллы
  const skillsRendered = personalData.skills && personalData.skills.trim() !== '' && (
    <div style={{ marginBottom: '20px' }}>
      <h3 style={{ borderBottom: '2px solid #007bff', paddingBottom: '5px', color: '#007bff' }}>
        Скиллы
      </h3>
      <p style={{ margin: '4px 0' }}>{personalData.skills}</p>
    </div>
  );


  return (
    <div id="pdfContent" style={containerStyle}>
      {/* Шапка */}
      <div style={headerStyle}>
        <div style={leftHeaderStyle}>
          {imageSrc && <img src={imageSrc} alt="Avatar" style={imageStyle} />}
          <div>
            {renderMainField('', `${personalData.surname} ${personalData.name} ${personalData.patronymic}`.trim())}
            {renderField('Дата рождения', personalData.birthDate)}
            {renderField('Пол', personalData.sex)}
            {renderField('Гражданство', personalData.citizenship)}
            {renderField('Город', personalData.address)}
            {renderField("Должность", personalData.position)}
          </div>
        </div>
        <div style={contactsStyle}>
          {headerContacts}
        </div>
      </div>

      {/* Основная информация */}
      {(mainInfoData.wishSalary ||
        (Array.isArray(mainInfoData.workGraph) && mainInfoData.workGraph.length > 0) ||
        mainInfoData.movements ||
        mainInfoData.family ||
        personalData.education) && (
          <div style={mainInfoStyle}>
            <div style={mainInfoLabelsStyle}>
              {mainInfoData.wishSalary && <p style={{ margin: '4px 0' }}>Желаемая зарплата:</p>}
              {Array.isArray(mainInfoData.workGraph) && mainInfoData.workGraph.length > 0 && <p style={{ margin: '4px 0' }}>График работы:</p>}
              {mainInfoData.movements && <p style={{ margin: '4px 0' }}>Готовность к переездам:</p>}
              {mainInfoData.family && <p style={{ margin: '4px 0' }}>Семейное положение:</p>}
              {personalData.education && <p style={{ margin: '4px 0' }}>Образование:</p>}
            </div>
            <div style={mainInfoValuesStyle}>
              {mainInfoData.wishSalary && <p style={{ margin: '4px 0' }}>{mainInfoData.wishSalary}</p>}
              {Array.isArray(mainInfoData.workGraph) && mainInfoData.workGraph.length > 0 && <p style={{ margin: '4px 0' }}>{mainInfoData.workGraph.join(', ')}</p>}
              {mainInfoData.movements && <p style={{ margin: '4px 0' }}>{mainInfoData.movements}</p>}
              {mainInfoData.family && <p style={{ margin: '4px 0' }}>{mainInfoData.family}</p>}
              {personalData.education && <p style={{ margin: '4px 0' }}>{personalData.education}</p>}
            </div>
          </div>
        )}

      {/* Опыт работы */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={experiences.length > 0 ? { borderBottom: '2px solid #007bff', paddingBottom: '5px', color: '#007bff' } : { display: "none" }}>Опыт работы</h3>
        {experiences && experiences.length > 0 ?
          experiences.map((exp, index) => {
            if (!exp.company && !exp.dateFrom && !exp.dateTil && !exp.position && !exp.description) return null;
            const responsibilities = exp.description
              ? exp.description.split('\n').filter(item => item.trim() !== '')
              : [];
            return (
              <div key={index} style={{
                marginBottom: '15px',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ flex: 1, marginRight: '20px' }}>
                    {exp.company && <h4 style={{ margin: '4px 0' }}>{exp.company}</h4>}
                    {(exp.dateFrom || exp.dateTil) && (
                      <p style={{ margin: '4px 0', color: '#555', fontStyle: 'italic' }}>
                        {exp.dateFrom} {exp.dateFrom && exp.dateTil && '-'} {exp.dateTil}
                      </p>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    {exp.position && <h4 style={{ margin: '4px 0' }}>{exp.position}</h4>}
                    {responsibilities.length > 0 && (
                      <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                        {responsibilities.map((item, i) => (
                          <li key={i} style={{ marginBottom: '4px' }}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            );
          }).filter(item => item)
          : <p style={{ margin: '4px 0' }}>Нет опыта работы</p>
        }
      </div>

      {/* Научная деятельность */}
      {scientificActivityRendered}
      {/* Скиллы */}
      {skillsRendered}

      {/* Дополнительная информация */}
      {additionalInfoRendered}

      {/* О себе */}
      {aboutMeRendered}
    </div>
  );
};

export default PdfContent;
