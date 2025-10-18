// Импорт глобальных объектов из firebase-init.js
import { db, auth } from './firebase-init.js';
import { signInAnonymously } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js';
import { collection, addDoc } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js'; // Добавлены импорты

let currentLang = 'kk';
let isAuthenticated = false; // Флаг авторизации

const translations = {
    kk: {
        headerTitle: 'Bala Edu Project',
        viewResources: 'Қарау',
        libraryTitle: 'Digital кітапхана',
        libraryDesc: 'Балалардың дамуын қызықты әрі қолжетімді етеміз! Мұнда сіз жас ерекшеліктеріне сай ойындар мен карточкаларды тегін жүктей аласыз.',
        footerText: '© 2025. Bala Edu Project. Балалардың дамуы үшін'
    },
    en: {
        headerTitle: 'Bala Edu Project',
        viewResources: 'View',
        libraryTitle: 'Digital Library',
        libraryDesc: 'Making children\'s development interesting and accessible! Here you can download age-appropriate games and cards for free.',
        footerText: '© 2025. Bala Edu Project. For Children\'s Development.'
    }
};

const resources = [
    {
        id: 'emotions1',
        category: 'emotions',
        age: '3-5',
        title: {kk: 'Эмоцияларды тану', en: 'Recognizing Emotions'},
        desc: {kk: 'Балаларға эмоцияларды ажыратуға көмектесетін карточкалар.', en: 'Cards to help children distinguish emotions.'},
        img: '/Bala-Edu/images/12.png',
        file: '/Bala-Edu/resources/emotion.pdf',
        downloads: 0
    },
    {
        id: 'colors1',
        category: 'colors',
        age: '3-5',
        title: {kk: 'Түстерді үйренеміз', en: 'Learning Colors'},
        desc: {kk: 'Негізгі түстерді тануға арналган тапсырмалар.', en: 'Tasks to recognize basic colors.'},
        img: '/Bala-Edu/images/8.png',
        file: '/Bala-Edu/resources/Colours.pdf',
        downloads: 0
    },
    {
        id: 'fruit1',
        category: 'fruit',
        age: '3-5',
        title: {kk: 'Жеміс-жидектер', en: 'Fruit'},
        desc: {kk: 'Балаларға жемістерді тануға көмектесетін карточкалар.', en: 'Cards to help children recognize fruits.'},
        img: '/Bala-Edu/images/6.png',
        file: '/Bala-Edu/resources/Fruits.pdf',
        downloads: 0
    },
    {
        id: 'Home_animal1',
        category: 'Home_animal',
        age: '3-5',
        title: {kk: 'үй жануарлары pdf', en: 'Home Animals'},
        desc: {kk: 'Үй жануарлаryn тануға арналған карточкалар.', en: 'Cards to help recognize home animals.'},
        img: '/Bala-Edu/images/3.png',
        file: '/Bala-Edu/resources/Home_animal.pdf',
        downloads: 0
    },
    {
        id: 'Vegetables1',
        category: 'Vegetables',
        age: '3-5',
        title: {kk: 'көкөністер', en: 'Vegetables'},
        desc: {kk: 'Көкөністерді тануға арналған карточкалар.', en: 'Cards to help recognize vegetables.'},
        img: '/Bala-Edu/images/4.png',
        file: '/Bala-Edu/resources/Vegetables.pdf',
        downloads: 0
    },
    {
        id: 'language1',
        category: 'language',
        age: '3-5',
        title: {kk: 'Alipi', en: 'Alipi'},
        desc: {kk: 'Алифбаға арналған карточкалар.', en: 'Cards for learning the alphabet.'},
        img: '/Bala-Edu/images/7.png',
        file: '/Bala-Edu/resources/Alipi.pdf',
        downloads: 0
    },
    {
        id: 'sandar1',
        category: 'sandar',
        age: '3-5',
        title: {kk: 'Сандар', en: 'Numbers'},
        desc: {kk: 'Сандарды тануға арналған карточкалар.', en: 'Cards for learning numbers.'},
        img: '/Bala-Edu/images/10.png',
        file: '/Bala-Edu/resources/sandar.pdf',
        downloads: 0
    }
];

function setLanguage(lang) {
    currentLang = lang;
    document.getElementById('header-title').innerText = translations[lang].headerTitle;
    document.getElementById('view-resources').innerText = translations[lang].viewResources;
    document.getElementById('library-title').innerText = translations[lang].libraryTitle;
    document.getElementById('library-desc').innerText = translations[lang].libraryDesc;
    document.getElementById('footer-text').innerText = translations[lang].footerText;
    filterResources();
}

function toggleMenu() {
    document.getElementById('nav-menu').classList.toggle('active');
}

// Добавляем обработчики событий
document.addEventListener('DOMContentLoaded', async () => {
    setLanguage('kk');
    filterResources();

    document.getElementById('view-resources').addEventListener('click', filterResources);
    document.getElementById('category-select').addEventListener('change', filterResources);
    document.getElementById('age-select').addEventListener('change', filterResources);

    // Обработчик для кнопок просмотра
    document.getElementById('resource-list').addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            const resourceId = event.target.dataset.id;
            const file = resources.find(r => r.id === resourceId).file;
            downloadResource(resourceId, file);
        }
    });

    // Инициализация авторизации с ожиданием
    console.log("Starting authentication check...");
    try {
        await new Promise((resolve) => {
            auth.onAuthStateChanged(user => {
                if (user) {
                    isAuthenticated = true;
                    console.log("User authenticated:", user.uid);
                    resolve();
                } else {
                    console.log("Attempting to authenticate...");
                    signInAnonymously(auth)
                        .then((userCredential) => {
                            isAuthenticated = true;
                            console.log("Authentication succeeded:", userCredential.user.uid);
                            resolve();
                        })
                        .catch(error => console.error("Authentication failed:", error.code, error.message));
                }
            });
        });
    } catch (error) {
        console.error("Authentication error:", error);
    }
});

function filterResources() {
    let category = document.getElementById('category-select').value;
    let age = document.getElementById('age-select').value;
    let resourceList = document.getElementById('resource-list');
    resourceList.innerHTML = '';

    resources.forEach(resource => {
        if ((category === 'all' || resource.category === category) && (age === 'all' || resource.age === age)) {
            let card = document.createElement('div');
            card.classList.add('resource-card');
            card.innerHTML = `
                <img src="${resource.img}" alt="${resource.title[currentLang]}">
                <h3>${resource.title[currentLang]}</h3>
                <p>${resource.desc[currentLang]}</p>
                <p>Жас: ${resource.age} / Age: ${resource.age}</p>
                <button data-id="${resource.id}">${currentLang === 'kk' ? 'Қарау' : 'View'}</button>
                <p>${currentLang === 'kk' ? 'Қаралымдар: ' : 'Views: '}<span id="downloads-${resource.id}">${resource.downloads}</span></p>
            `;
            resourceList.appendChild(card);
        }
    });
}

function downloadResource(id, file) {
    let resource = resources.find(r => r.id === id);
    if (resource) {
        resource.downloads++; // Увеличиваем счётчик
        document.getElementById(`downloads-${id}`).innerText = resource.downloads; // Обновляем отображение
        // Открываем PDF в новой вкладке
        window.open(file, '_blank', 'noopener,noreferrer');
        if (isAuthenticated) {
            logDownload(id); // Записываем в Firestore
        } else {
            console.log("Authentication not completed yet, skipping log...");
        }
    }
}

function logDownload(resourceId) {
    console.log("Checking user state before log...");
    auth.onAuthStateChanged(user => {
        console.log("User state:", user);
        if (user) {
            console.log("User found, logging download...");
            addDoc(collection(db, "downloads"), { // Исправлен вызов Firestore
                userId: user.uid,
                resourceId: resourceId,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }).then(() => console.log("Download logged")).catch(error => console.error("Firestore error:", error));
        } else {
            console.log("No user authenticated, please wait...");
        }
    });
}
