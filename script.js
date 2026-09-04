// ====== ساخت کارت‌ها ======
function renderCards() {
    const peopleContainer = document.getElementById('people-scroll');
    peopleContainer.innerHTML = '';
    peopleData.forEach(person => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `<div class="card-title">${person.name}</div><div class="card-date">${person.date}</div>`;
        card.addEventListener('click', () => openModal(person));
        peopleContainer.appendChild(card);
    });

    const eventsContainer = document.getElementById('events-scroll');
    eventsContainer.innerHTML = '';
    eventsData.forEach(event => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `<div class="card-title">${event.name}</div><div class="card-date">${event.date}</div>`;
        card.addEventListener('click', () => openModal(event));
        eventsContainer.appendChild(card);
    });

    const scienceContainer = document.getElementById('science-scroll');
    scienceContainer.innerHTML = '';
    scienceData.forEach(fact => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `<div class="card-title">${fact.name}</div><div class="card-date">${fact.date}</div>`;
        card.addEventListener('click', () => openModal(fact));
        scienceContainer.appendChild(card);
    });
}

// ====== ساخت کارت کشورها ======
function renderCountries() {
    const countriesContainer = document.getElementById('countries-scroll');
    countriesContainer.innerHTML = '';
    
    countries.forEach(country => {
        const card = document.createElement('div');
        card.classList.add('country-card');
        card.innerHTML = `
            <div class="country-flag">${country.flag}</div>
            <div class="country-name">${country.name}</div>
        `;
        card.addEventListener('click', () => openCountryModal(country));
        countriesContainer.appendChild(card);
    });
}

// ====== مودال کشور ======
function openCountryModal(country) {
    const modal = document.getElementById('detail-modal');
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = `
        <div class="modal-flag">${country.flag}</div>
        <h2 class="modal-title">${country.name}</h2>
        <p class="modal-text" id="typewriter-text"></p>
    `;
    
    modal.classList.add('show');
    
    const textElement = document.getElementById('typewriter-text');
    typeText(textElement, country.text);
}

// ====== مودال عمومی ======
function openModal(item) {
    const modal = document.getElementById('detail-modal');
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = `
        <h2 class="modal-title">${item.name}</h2>
        <p class="modal-text" id="typewriter-text"></p>
    `;
    
    modal.classList.add('show');
    
    const textElement = document.getElementById('typewriter-text');
    typeText(textElement, item.text);
}

// ====== افکت تایپ متن ======
let typewriterInterval = null;

function typeText(element, text, speed = 15) {
    if (typewriterInterval) clearInterval(typewriterInterval);
    
    element.textContent = '';
    let charIndex = 0;
    
    typewriterInterval = setInterval(() => {
        element.textContent += text.charAt(charIndex);
        charIndex++;
        
        if (charIndex >= text.length) {
            clearInterval(typewriterInterval);
            typewriterInterval = null;
        }
    }, speed);
}

// ====== بستن مودال ======
function closeModal() {
    if (typewriterInterval) clearInterval(typewriterInterval);
    typewriterInterval = null;
    
    document.getElementById('detail-modal').classList.remove('show');
}

// ====== کاوش تصادفی ======
function openRandom() {
    const allItems = [
        ...countries,
        ...peopleData,
        ...eventsData,
        ...scienceData,
        ...mapData
    ];
    
    const randomItem = allItems[Math.floor(Math.random() * allItems.length)];
    
    if (randomItem.flag) {
        openCountryModal(randomItem);
    } else if (randomItem.name && randomItem.text) {
        openModal(randomItem);
    }
}

// ====== نقشه تاریخی ======
let myMap = null;

function openMap() {
    document.getElementById('map-open-btn').style.display = 'none';
    document.getElementById('historical-map-wrapper').style.display = 'block';
    
    if (myMap) {
        myMap.remove();
    }
    
    myMap = L.map('historical-map', {
        minZoom: 3
    }).setView([30, 20], 3);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 18,
        detectRetina: true
    }).addTo(myMap);
    
    mapData.forEach(item => {
        const marker = L.marker([item.lat, item.lng]).addTo(myMap);
        marker.bindPopup(`<b>${item.title}</b><br>${item.description}`);
    });
    
    setTimeout(() => {
        myMap.invalidateSize();
    }, 100);
}

// ====== بستن نقشه ======
function closeMap() {
    if (myMap) {
        myMap.remove();
        myMap = null;
    }
    
    document.getElementById('historical-map-wrapper').style.display = 'none';
    document.getElementById('map-open-btn').style.display = 'block';
}

// ====== نقل قول روز ======
function loadDailyQuote() {
    const randomIndex = Math.floor(Math.random() * quotesData.length);
    const quote = quotesData[randomIndex];
    
    document.getElementById('daily-quote').textContent = `«${quote.text}»`;
    document.getElementById('quote-author').textContent = `- ${quote.author}`;
}

// ====== جستجو ======
document.getElementById('search-input').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    
    const peopleContainer = document.getElementById('people-scroll');
    peopleContainer.innerHTML = '';
    peopleData.filter(p => p.name.toLowerCase().includes(query)).forEach(person => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `<div class="card-title">${person.name}</div><div class="card-date">${person.date}</div>`;
        card.addEventListener('click', () => openModal(person));
        peopleContainer.appendChild(card);
    });

    const eventsContainer = document.getElementById('events-scroll');
    eventsContainer.innerHTML = '';
    eventsData.filter(ev => ev.name.toLowerCase().includes(query)).forEach(event => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `<div class="card-title">${event.name}</div><div class="card-date">${event.date}</div>`;
        card.addEventListener('click', () => openModal(event));
        eventsContainer.appendChild(card);
    });

    const scienceContainer = document.getElementById('science-scroll');
    scienceContainer.innerHTML = '';
    scienceData.filter(fact => fact.name.toLowerCase().includes(query)).forEach(fact => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `<div class="card-title">${fact.name}</div><div class="card-date">${fact.date}</div>`;
        card.addEventListener('click', () => openModal(fact));
        scienceContainer.appendChild(card);
    });
});

// ====== شروع ======
renderCards();
renderCountries();
loadDailyQuote();
// ====== ساعت و تاریخ ======
function updateHeaderDateTime() {
    const now = new Date();
    
    // ساعت با اعداد فارسی
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;
    
    // تبدیل به اعداد فارسی
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const persianTime = timeString.replace(/\d/g, (d) => persianNumbers[d]);
    
    document.getElementById('historical-clock').textContent = persianTime;

    // تاریخ میلادی
    const gregorianDate = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('gregorian-date').textContent = gregorianDate;

    // تاریخ شمسی
    const jalaliDate = now.toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('jalali-date').textContent = jalaliDate;
}

// اجرای به‌روزرسانی هر ثانیه
setInterval(updateHeaderDateTime, 1000);
updateHeaderDateTime();


// ====== افکت تایپ متن ======


function typeText(element, text, speed = 15) {
    if (typewriterInterval) clearInterval(typewriterInterval);
    
    element.textContent = '';
    let charIndex = 0;
    
    typewriterInterval = setInterval(() => {
        element.textContent += text.charAt(charIndex);
        charIndex++;
        
        if (charIndex >= text.length) {
            clearInterval(typewriterInterval);
            typewriterInterval = null;
        }
    }, speed);
}

// ====== تایپ شدن نقل قول روز ======
function loadDailyQuote() {
    const randomIndex = Math.floor(Math.random() * quotesData.length);
    const quote = quotesData[randomIndex];
    
    const quoteElement = document.getElementById('daily-quote');
    const authorElement = document.getElementById('quote-author');
    
    // فقط تایپ شدن متن (بدون هیچ افکت یا تایمر اضافه)
    typeText(quoteElement, `«${quote.text}»`);
    
    // نمایش نویسنده
    authorElement.textContent = `- ${quote.author}`;
}

// اجرای نقل قول روز
loadDailyQuote();
