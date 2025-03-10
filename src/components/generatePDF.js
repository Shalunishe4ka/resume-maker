import ReactDOMServer from 'react-dom/server';
import { PdfContent } from './PdfContent';

// Функция сжатия изображения с использованием Canvas API
const compressImage = (imageSrc, maxWidth = 140, maxHeight = 140) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "Anonymous"; // Для загрузки изображений с другого домена
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = maxWidth;
      canvas.height = maxHeight;
      const ctx = canvas.getContext('2d');
      
      // Реализуем логику cover (заполнение холста с сохранением пропорций)
      const ratio = Math.max(maxWidth / image.width, maxHeight / image.height);
      const newWidth = image.width * ratio;
      const newHeight = image.height * ratio;
      const x = (maxWidth - newWidth) / 2;
      const y = (maxHeight - newHeight) / 2;
      
      ctx.drawImage(image, x, y, newWidth, newHeight);
      // Получаем сжатое изображение в формате JPEG с качеством 80%
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      resolve(compressedDataUrl);
    };
    image.onerror = (err) => {
      reject(err);
    };
    image.src = imageSrc;
  });
};

export const generatePDF = async (state) => {
  // Клонируем состояние, чтобы не изменять исходный объект
  let updatedState = { ...state };
  
  // Если есть изображение, сжимаем его перед генерацией PDF
  if (state.imageSrc) {
    try {
      const compressedImage = await compressImage(state.imageSrc);
      updatedState.imageSrc = compressedImage;
    } catch (error) {
      console.error("Ошибка сжатия изображения:", error);
    }
  }

  // Генерация HTML с помощью ReactDOMServer
  const htmlString = ReactDOMServer.renderToStaticMarkup(
    <PdfContent {...updatedState} />
  );

  try {
    const response = await fetch('http://localhost:3001/generate-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html: htmlString })
    });

    if (!response.ok) {
      throw new Error('Ошибка при генерации PDF');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'resume.pdf';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Ошибка при генерации PDF:', error);
  }
};
