import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// Firebase конфигурация (замени на свою)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Функция для отображения ресурсов
async function displayResources() {
  const resourceList = document.getElementById('resource-list');
  resourceList.innerHTML = ''; // Очищаем список

  const querySnapshot = await getDocs(collection(db, 'resources'));
  const resources = [];
  querySnapshot.forEach((doc) => {
    resources.push(doc.data());
  });

  resources.forEach(resource => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${resource.name}</h3>
      <img src="${resource.image}" alt="${resource.name}" style="max-width: 100%;">
      <p>Опис: ${resource.description}</p>
      <p>Жасы: ${resource.age}</p>
      <button onclick="viewResource('${resource.name}')">Қарау</button>
      <p id="feedback-${resource.name}">Скачиваний: 0</p>
    `;
    resourceList.appendChild(card);
  });
}

// Функция для просмотра ресурса
function viewResource(name) {
  const feedback = document.getElementById(`feedback-${name}`);
  let downloads = parseInt(feedback.textContent.split(': ')[1]) || 0;
  downloads++;
  feedback.textContent = `Скачиваний: ${downloads}`;

  // Здесь можно добавить логику для скачивания (например, ссылку на PDF)
  console.log(`Просмотр ресурса: ${name}, скачиваний: ${downloads}`);
}

// Функция фильтрации
function filterResources() {
  const category = document.getElementById('category-select').value;
  const age = document.getElementById('age-select').value;
  // Здесь можно добавить фильтрацию из Firebase
  displayResources(); // Пока просто перерисовываем все
}

// События
document.getElementById('view-resources').addEventListener('click', displayResources);
document.getElementById('category-select').addEventListener('change', filterResources);
document.getElementById('age-select').addEventListener('change', filterResources);

// Инициализация
window.onload = displayResources;

// Функции для переключения языка и меню
function setLanguage(lang) {
  console.log('Язык изменён на:', lang);
}

function toggleMenu() {
  document.getElementById('nav-menu').classList.toggle('active');
}
