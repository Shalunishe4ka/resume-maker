import React, { useContext, useEffect } from 'react';
import { GlobalStateContext } from '../GlobalStateContext';

export const InputFields = () => {
    const {
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
        errors,
        setErrors
    } = useContext(GlobalStateContext);

    // Функция автоформатирования ввода даты
    const formatDateInput = (value, field) => {
        if (
            field === 'dateTil' &&
            (value.toLowerCase().includes("по сей день") ||
                value.toLowerCase().includes("на данный момент"))
        ) {
            return value;
        }
        let digits = value.replace(/\D/g, '');
        if (digits.length >= 2) {
            digits = digits.slice(0, 2) + '.' + digits.slice(2);
        }
        if (digits.length >= 5) {
            digits = digits.slice(0, 5) + '.' + digits.slice(5, 9);
        }
        return digits;
    };

    const handleDateChange = (field) => (e) => {
        let value = e.target.value;
        value = formatDateInput(value, field);
        setPersonalData((prev) => ({ ...prev, [field]: value }));
    };

    const handleExperienceDateChange = (index, field) => (e) => {
        let value = e.target.value;
        value = formatDateInput(value, field);
        const newExperiences = [...experiences];
        newExperiences[index] = { ...newExperiences[index], [field]: value };
        setExperiences(newExperiences);
    };

    const handleInputChange = (field) => (e) => {
        let value = e.target.value;
        setErrors((prev) => ({ ...prev, [field]: '' }));
        if (field === 'phone' && value && !/^\+?[0-9\s]*$/.test(value)) {
            setErrors((prev) => ({
                ...prev,
                [field]: 'Номер должен содержать только цифры и пробелы, может начинаться с +'
            }));
            return;
        }
        setPersonalData((prev) => ({ ...prev, [field]: value }));
    };

    const handleMainInfoChange = (field, value) => {
        setMainInfo([{
            ...mainInfo[0],
            [field]: value
        }]);
    };

    const handleTogglePatronymic = () => {
        if (!personalData.patronymicCheck) {
            setPersonalData({
                ...personalData,
                patronymicCheck: true,
                patronymic: ""
            });
        } else {
            setPersonalData({
                ...personalData,
                patronymicCheck: false,
                patronymic: ""
            });
        }
    };

    const handleExperienceChange = (index, field, value) => {
        const newExperiences = [...experiences];
        newExperiences[index] = { ...newExperiences[index], [field]: value };
        setExperiences(newExperiences);
    };

    const addCompany = () => {
        setExperiences((prevExperiences) => [
            ...prevExperiences,
            {
                company: "",
                dateFrom: "",
                dateTil: "",
                position: "",
                description: "",
                scientificActivity: ""
            }
        ]);
    };

    const removeCompany = (index) => {
        setExperiences((prevExperiences) =>
            prevExperiences.filter((_, i) => i !== index)
        );
    };

    const renderSingleChoiceButtons = (field, options, isPersonalData = false) => (
        <div className="btn-group">
            {options.map((option) => {
                const isSelected = isPersonalData
                    ? personalData[field] === option
                    : mainInfo[0]?.[field] === option;
                return (
                    <button
                        key={option}
                        onClick={() => {
                            if (isPersonalData) {
                                setPersonalData((prev) => ({
                                    ...prev,
                                    [field]: isSelected ? "" : option
                                }));
                            } else {
                                handleMainInfoChange(field, isSelected ? "" : option);
                            }
                        }}
                        className='rendered-btn'
                        style={{
                            border: isSelected ? '2px solid #007bff' : '2px solid #ccc',
                            backgroundColor: isSelected ? '#007bff' : '#fdfdfd',
                            color: isSelected ? '#fff' : '#333'
                        }}
                    >
                        {option}
                    </button>
                );
            })}
        </div>
    );

    const handleSocialNetworkChange = (index, key, value) => {
        const currentNetworks = mainInfo[0]?.socialNetworks || [];
        const updatedNetworks = [...currentNetworks];
        updatedNetworks[index] = { ...updatedNetworks[index], [key]: value };
        handleMainInfoChange('socialNetworks', updatedNetworks);
    };

    const addSocialNetwork = () => {
        const currentNetworks = mainInfo[0]?.socialNetworks || [];
        const updatedNetworks = [...currentNetworks, { network: '', link: '' }];
        handleMainInfoChange('socialNetworks', updatedNetworks);
    };

    const removeSocialNetwork = (index) => {
        const currentNetworks = mainInfo[0]?.socialNetworks || [];
        const updatedNetworks = currentNetworks.filter((_, i) => i !== index);
        handleMainInfoChange('socialNetworks', updatedNetworks);
    };

    return (
        <div className='input-group'>
            {/* Поля personalData */}
            <div className='names-container'>
                <div className='names-items'>
                    <input
                        placeholder='Фамилия'
                        value={personalData.surname}
                        onChange={handleInputChange('surname')}
                    />
                    {errors.surname && <span className="error">{errors.surname}</span>}

                    <input
                        placeholder='Имя'
                        value={personalData.name}
                        onChange={handleInputChange('name')}
                    />
                    {errors.name && <span className="error">{errors.name}</span>}

                    {personalData.patronymicCheck === false ? (
                        <>
                            <input
                                placeholder="Отчество"
                                value={personalData.patronymic}
                                onChange={handleInputChange('patronymic')}
                            />
                            {errors.patronymic && <span className="error">{errors.patronymic}</span>}
                        </>
                    ) : (
                        <div style={{ display: "none" }}>
                            <input placeholder="Отчество" value="" readOnly />
                            {errors.patronymic && <span className="error">{errors.patronymic}</span>}
                        </div>
                    )}
                </div>

                <div className='patronymic-check-container'>
                    <p>Нет отчества</p>
                    <input
                        type='checkbox'
                        className='checkbox-patronymic'
                        checked={personalData.patronymicCheck}
                        onChange={handleTogglePatronymic}
                    />
                </div>
                <input
                    placeholder='Гражданство'
                    value={personalData.citizenship || ''}
                    onChange={handleInputChange('citizenship')}
                />
            </div>

            <input
                placeholder='Желаемая должность'
                value={personalData.position}
                onChange={handleInputChange('position')}
            />
            {errors.position && <span className="error">{errors.position}</span>}

            <input
                type='email'
                placeholder='Email'
                value={personalData.email}
                onChange={handleInputChange('email')}
            />
            {errors.email && <span className="error">{errors.email}</span>}

            <input
                type='tel'
                placeholder='Номер телефона'
                value={personalData.phone}
                onChange={handleInputChange('phone')}
            />
            {errors.phone && <span className="error">{errors.phone}</span>}

            <input
                placeholder='Адрес проживания'
                value={personalData.address}
                onChange={handleInputChange('address')}
            />

            <div className='toggle-buttons-container'>
                <p>Укажите пол:</p>
                {renderSingleChoiceButtons('sex', ["Мужской", "Женский"], true)}
            </div>

            <input
                placeholder='Дата рождения (ДД.ММ.ГГГГ)'
                value={personalData.birthDate}
                onChange={handleDateChange('birthDate')}
            />

            {/* Основная информация */}
            <h3>Основная информация</h3>
            <div className='social-networks'>
                <h4>Социальные сети</h4>
                {mainInfo[0]?.socialNetworks &&
                    mainInfo[0].socialNetworks.map((sn, index) => (
                        <div key={index} className='social-network-field'>
                            <input
                                placeholder='Название сети (например, Telegram)'
                                value={sn.network || ''}
                                onChange={(e) => handleSocialNetworkChange(index, 'network', e.target.value)}
                                style={{ marginRight: '10px' }}
                            />
                            <input
                                placeholder='Ссылка'
                                value={sn.link || ''}
                                onChange={(e) => handleSocialNetworkChange(index, 'link', e.target.value)}
                                style={{ marginRight: '10px' }}
                            />
                            <button
                                onClick={() => removeSocialNetwork(index)}
                                className='btn-del-socials'
                            >
                                X
                            </button>
                        </div>
                    ))}
                <button className='btn' onClick={addSocialNetwork}>
                    Добавить соц. сеть
                </button>
            </div>

            <div className='salary-container'>
                <input
                    placeholder='Желаемая зарплата'
                    value={mainInfo[0]?.wishSalary || ''}
                    onChange={(e) => handleMainInfoChange('wishSalary', e.target.value)}
                    disabled={mainInfo[0]?.wishSalary === "Договорная"}
                    className={`wishSalary-input-disabled-${mainInfo[0]?.wishSalary === "Договорная"}`}
                />
                <button
                    onClick={() => {
                        if (mainInfo[0]?.wishSalary !== "Договорная") {
                            handleMainInfoChange('wishSalary', "Договорная");
                        } else {
                            handleMainInfoChange('wishSalary', "");
                        }
                    }}
                    className='wishSalary-btn'
                    style={{
                        backgroundColor: mainInfo[0]?.wishSalary === "Договорная" ? '#007bff' : '#fdfdfd',
                        color: mainInfo[0]?.wishSalary === "Договорная" ? '#fff' : '#333'
                    }}
                >
                    Договорная
                </button>
            </div>

            <div className='toggle-buttons-container'>
                <p>Выберите предпочитаемый график работы:</p>
                <div className="btn-group">
                    {["Полный день", "Неполный день", "Удалённая работа"].map((option) => {
                        const isSelected = mainInfo[0]?.workGraph.includes(option);
                        return (
                            <button
                                key={option}
                                onClick={() => {
                                    let updatedWorkGraph = mainInfo[0]?.workGraph ? [...mainInfo[0].workGraph] : [];
                                    if (isSelected) {
                                        updatedWorkGraph = updatedWorkGraph.filter(item => item !== option);
                                    } else {
                                        updatedWorkGraph.push(option);
                                    }
                                    handleMainInfoChange('workGraph', updatedWorkGraph);
                                }}
                                className='rendered-btn'
                                style={{
                                    border: isSelected ? '2px solid #007bff' : '2px solid #ccc',
                                    backgroundColor: isSelected ? '#007bff' : '#fdfdfd',
                                    color: isSelected ? '#fff' : '#333'
                                }}
                            >
                                {option}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className='toggle-buttons-container'>
                <p>Образование:</p>
                {renderSingleChoiceButtons('education', ["Высшее", "Среднее специальное", "Среднее"])}
            </div>

            {personalData.sex !== "Женский" ? (
                <>
                    <div className='toggle-buttons-container'>
                        <p>Готовность к переезду:</p>
                        {renderSingleChoiceButtons('movements', ["Готов", "Не готов"])}
                    </div>
                    <div className='toggle-buttons-container'>
                        <p>Семейное положение:</p>
                        {renderSingleChoiceButtons('family', ["Женат", "Холост"])}
                    </div>
                </>
            ) : (
                <>
                    <div className='toggle-buttons-container'>
                        <p>Готовность к переезду:</p>
                        {renderSingleChoiceButtons('movements', ["Готова", "Не готова"])}
                    </div>
                    <div className='toggle-buttons-container'>
                        <p>Семейное положение:</p>
                        {renderSingleChoiceButtons('family', ["Замужем", "Не замужем"])}
                    </div>
                </>
            )}

            {/* Опыт работы */}
            {experiences.length > 0 && (
                <>
                    <h3>Опыт работы</h3>
                    {experiences.map((exp, index) => (
                        <div key={index} className='company-names-container'>
                            <div className='company-names-item'>
                                <input
                                    placeholder='Компания'
                                    value={exp.company}
                                    onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                                />
                                <div className='exp-dates-contrainer' style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <input
                                        placeholder='Дата трудоустройства (ДД.ММ.ГГГГ)'
                                        value={exp.dateFrom}
                                        onChange={handleExperienceDateChange(index, 'dateFrom')}
                                        style={{ flex: 0.65 }}
                                    />
                                    <div className='dateTil-container' style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '5px' }}>
                                        <input
                                            placeholder='Дата увольнения (ДД.ММ.ГГГГ или "По сей день")'
                                            value={exp.dateTil}
                                            onChange={(e) => handleExperienceDateChange(index, 'dateTil')(e)}
                                            disabled={exp.dateTil === "По сей день"}
                                            className={`dateTil-input-disabled-${exp.dateTil === "По сей день"}`}
                                            style={{ flex: 2 }}
                                        />
                                        <button
                                            onClick={() => {
                                                if (exp.dateTil !== "По сей день") {
                                                    handleExperienceChange(index, 'dateTil', "По сей день");
                                                } else {
                                                    handleExperienceChange(index, 'dateTil', "");
                                                }
                                            }}
                                            className='dateTil-btn'
                                            style={{
                                                backgroundColor: exp.dateTil === "По сей день" ? '#007bff' : '#fdfdfd',
                                                color: exp.dateTil === "По сей день" ? '#fff' : '#333'
                                            }}
                                        >
                                            По сей день
                                        </button>
                                    </div>
                                </div>
                                <input
                                    placeholder='Должность'
                                    value={exp.position}
                                    onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                                />
                                <textarea
                                    placeholder='Описание'
                                    value={exp.description}
                                    onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                                />
                            </div>
                            <button className='btn-del-company' onClick={() => removeCompany(index)}>
                                Удалить
                            </button>
                        </div>
                    ))}
                </>
            )}
            <button className='btn' onClick={addCompany}>Добавить место работы</button>

            {/* Дополнительная информация */}
            <h3>Дополнительная информация</h3>
            <input
                placeholder='Скиллы (например: React, Node.js, ...)'
                value={personalData.skills || ''}
                onChange={handleInputChange('skills')}
            />
            <textarea
                placeholder='Дополнительная информация'
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
            />

            {/* Научная деятельность */}
            {experiences[0] &&
                (
                    <>
                        <h3>Научная деятельность</h3>
                        <textarea
                            placeholder='Укажите ваши научные достижения, если они есть'
                            value={experiences[0].scientificActivity}
                            onChange={(e) => {
                                const newExperiences = [...experiences];
                                newExperiences[0] = {
                                    ...newExperiences[0],
                                    scientificActivity: e.target.value
                                };
                                setExperiences(newExperiences);
                            }}
                        />
                    </>
                )}

            {/* О себе */}
            <h3>О себе</h3>
            <textarea
                placeholder='Расскажите о себе'
                value={aboutMe}
                onChange={(e) => setAboutMe(e.target.value)}
            />
        </div>
    );
};
