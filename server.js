const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');  // ⬅ Добавили CORS
const wkhtmltopdf = require('wkhtmltopdf');

const app = express();
app.use(cors());  // ⬅ Разрешаем запросы с любого источника
app.use(bodyParser.json({ limit: '10mb' }));

app.post('/generate-pdf', (req, res) => {
  let { html } = req.body;

  if (!html) {
    return res.status(400).send('Ошибка: нет HTML-контента');
  }

  // Оборачиваем в полноценный HTML-документ
  const fullHtml = `
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta charset="UTF-8">
      <title>Резюме</title>
      <style>
        body { font-family: Arial, sans-serif; font-size: 14px; margin: 20px; }
        .pdf-content { width: 100%; max-width: 800px; margin: auto; }
        .pdf-section { margin-bottom: 20px; }
        .section-header { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
        .pdf-experience-item { border-bottom: 1px solid #ccc; padding-bottom: 10px; margin-bottom: 10px; }
      </style>
    </head>
    <body>
      ${html}
    </body>
    </html>
  `;
  console.log(fullHtml)
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');

  wkhtmltopdf(fullHtml, { pageSize: 'A4', orientation: 'Portrait' })
    .on('error', (err) => {
      console.error('Ошибка при генерации PDF:', err);
      res.status(500).send('Ошибка генерации PDF');
    })
    .pipe(res);
});


const PORT = process.env.PORT || 3001;  // ⬅ Убедись, что порт правильный
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
