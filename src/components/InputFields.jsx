import React, { useContext } from 'react';
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
        // Для даты увольнения разрешаем специальные значения
        if (field === 'dateTil' && (value.toLowerCase().includes("по сей день") || value.toLowerCase().includes("на данный момент"))) {
            return value;
        }
        // Удаляем все символы, кроме цифр
        let digits = value.replace(/\D/g, '');
        if (digits.length >= 2) {
            digits = digits.slice(0, 2) + '.' + digits.slice(2);
        }
        if (digits.length >= 5) {
            digits = digits.slice(0, 5) + '.' + digits.slice(5, 9);
        }
        return digits;
    };

    // Обёртка для обработки даты в personalData
    const handleDateChange = (field) => (e) => {
        let value = e.target.value;
        value = formatDateInput(value, field);
        setPersonalData((prev) => ({ ...prev, [field]: value }));
    };

    // Для дат в опыте (dateFrom и dateTil)
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
        newExperiences[index] = {
            ...newExperiences[index],
            [field]: value
        };
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
                description: ""
            }
        ]);
    };

    const removeCompany = (index) => {
        setExperiences((prevExperiences) =>
            prevExperiences.filter((_, i) => i !== index)
        );
    };

    // Функция для отрисовки группы кнопок для одиночного выбора
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
                                setPersonalData((prev) => ({ ...prev, [field]: isSelected ? "" : option }));
                            } else {
                                handleMainInfoChange(field, isSelected ? "" : option);
                            }
                        }}
                        className='rendered-btn'
                        style={{
                            border: isSelected ? '2px solid #007bff' : '2px solid #ccc',
                            backgroundColor: isSelected ? '#007bff' : '#fdfdfd',
                            color: isSelected ? '#fff' : '#333',
                        }}
                    >
                        {option}
                    </button>
                );
            })}
        </div>
    );

    return (
        <div className='input-group'>
            {/* Поля personalData */}
            <div className='names-container'>
                <div className='names-items'>
                    <input placeholder='Фамилия' value={personalData.surname} onChange={handleInputChange('surname')} />
                    {errors.surname && <span className="error">{errors.surname}</span>}

                    <input placeholder='Имя' value={personalData.name} onChange={handleInputChange('name')} />
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
                    <input type='checkbox' className='checkbox-patronymic' checked={personalData.patronymicCheck} onChange={handleTogglePatronymic} />
                </div>
                {/* Новое поле: Гражданство */}
                <input placeholder='Гражданство' value={personalData.citizenship || ''} onChange={handleInputChange('citizenship')} />
            </div>

            <input placeholder='Желаемая должность' value={personalData.position} onChange={handleInputChange('position')} />
            {errors.position && <span className="error">{errors.position}</span>}

            <input type='email' placeholder='Email' value={personalData.email} onChange={handleInputChange('email')} />
            {errors.email && <span className="error">{errors.email}</span>}

            <input type='tel' placeholder='Номер телефона' value={personalData.phone} onChange={handleInputChange('phone')} />
            {errors.phone && <span className="error">{errors.phone}</span>}

            <input placeholder='Адрес проживания' value={personalData.address} onChange={handleInputChange('address')} />

            {/* Замена выбора пола на кнопки */}
            <div className='toggle-buttons-container'>
                <p>Укажите пол:</p>
                {renderSingleChoiceButtons('sex', ["Мужской", "Женский"], true)}
            </div>

            <input placeholder='Дата рождения (ДД.ММ.ГГГГ)' value={personalData.birthDate} onChange={handleDateChange('birthDate')} />

            {/* Основная информация */}
            <h3>Основная информация</h3>
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
                        color: mainInfo[0]?.wishSalary === "Договорная" ? '#fff' : '#333',
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
                                    color: isSelected ? '#fff' : '#333',
                                }}
                            >
                                {option}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Образование в основной информации */}
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
            <h3>Опыт работы</h3>
            {experiences.map((exp, index) => (
                <div key={index} className='company-names-container'>
                    <div className='company-names-item'>
                        <input
                            placeholder='Компания'
                            value={exp.company}
                            onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                        />
                        <div className='exp-dates-contrainer'>
                            <input placeholder='Дата трудоустройства (ДД.ММ.ГГГГ)' value={exp.dateFrom} onChange={handleExperienceDateChange(index, 'dateFrom')} />
                            <input
                                placeholder='Дата увольнения (ДД.ММ.ГГГГ или "По сей день")'
                                value={exp.dateTil}
                                onChange={handleExperienceDateChange(index, 'dateTil')}
                            />
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
            <button className='btn' onClick={addCompany}>Добавить место работы</button>

            {/* Дополнительная информация */}
            <h3>Дополнительная информация</h3>
            {/* Поле для скиллов / hard skills */}
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
            <h3>Научная деятельность</h3>
            <textarea
                placeholder='Укажите ваши научные достижения, если они есть'
                value={personalData.scientificActivity || ''}
                onChange={handleInputChange('scientificActivity')}
            />

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
