import React from "react";
import { createRoot } from "react-dom/client"; // Импортируем createRoot
import App from "./App";
import { GlobalStateProvider } from "./GlobalStateContext";
import reportWebVitals from "./reportWebVitals";

// Находим корневой элемент
const container = document.getElementById("root");

// Создаем корневой экземпляр React
const root = createRoot(container);

// Рендерим приложение
root.render(
  <GlobalStateProvider>
    <App />
  </GlobalStateProvider>
);

// Если вы хотите измерять производительность приложения
reportWebVitals();