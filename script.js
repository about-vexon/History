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

// ====== مودال عمومی ======
function openModal(item) {
    const modal = document.getElementById('detail-modal');
    const modalBody = document.getElementById('modal-body');

    modalBody.innerHTML = `
        <h2 class="modal-title">${item.name}</h2>
        <p class="modal-text" id="typewriter-text"></p>
    `;

    modal.classList.add('show');

    // شروع انیمیشن تایپ
    const textElement = document.getElementById('typewriter-text');
    typeText(textElement, item.text);
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
// ====== افکت تایپ متن ======
let typewriterInterval = null;

function typeText(element, text, speed = 40) {
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

// ====== ساعت و تاریخ ======
function updateHeaderDateTime() {
    const now = new Date();
    
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;
    
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const persianTime = timeString.replace(/\d/g, (d) => persianNumbers[d]);
    
    document.getElementById('historical-clock').textContent = persianTime;

    const gregorianDate = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('gregorian-date').textContent = gregorianDate;

    const jalaliDate = now.toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('jalali-date').textContent = jalaliDate;
}

// ====== نقشه تاریخی ======
let myMap = null;

function openMap() {
    // حفظ موقعیت اسکرول فعلی
    const currentScrollPosition = window.scrollY;
    
    // مخفی کردن دکمه و نمایش نقشه
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
    
    // جلوی اسکرول به بالا را بگیر
    setTimeout(() => {
        window.scrollTo(0, currentScrollPosition);
    }, 100);
    
    // تنظیم اندازه نقشه
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
let quoteTimeout = null;

function loadDailyQuote() {
    if (quoteTimeout) clearTimeout(quoteTimeout);
    
    const randomIndex = Math.floor(Math.random() * quotesData.length);
    const quote = quotesData[randomIndex];
    
    const quoteElement = document.getElementById('daily-quote');
    const authorElement = document.getElementById('quote-author');
    
    typeText(quoteElement, `«${quote.text}»`);
    
    quoteTimeout = setTimeout(() => {
        authorElement.textContent = `- ${quote.author}`;
    }, quote.text.length * 15);
}

// ====== بازی حدس بزن کی هستم ======
let currentGuessIndex = -1;
let isGuessing = false;

function initGuessGame() {
    document.getElementById('game-start-btn').style.display = 'none';
    document.getElementById('game-content').style.display = 'block';
    
    if (currentGuessIndex === -1) {
        const randomIndex = Math.floor(Math.random() * guessPeople.length);
        currentGuessIndex = randomIndex;
    }
    
    const clue = guessPeople[currentGuessIndex];
    
    // انیمیشن تایپ برای سوال
    typeTextElement('game-question', clue.hint);
    
    document.getElementById('game-result').textContent = '';
    document.getElementById('game-input').focus();
    isGuessing = true;
}

// تابع تایپ برای بازی (با آیدی)
function typeTextElement(elementId, text) {
    const element = document.getElementById(elementId);
    
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
    }, 30);


    // ====== جلوگیری از تکرار سوالات ======


function initGuessGame() {
    document.getElementById('game-start-btn').style.display = 'none';
    document.getElementById('game-content').style.display = 'block';
    
    // اگر همه سوالات استفاده شده‌اند، لیست را ریست کن
    if (usedGuessIndices.length === guessPeople.length) {
        usedGuessIndices = [];
    }
    
    // انتخاب سوالی که قبلاً استفاده نشده است
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * guessPeople.length);
    } while (usedGuessIndices.includes(randomIndex));
    
    usedGuessIndices.push(randomIndex);
    currentGuessIndex = randomIndex;
    
    const clue = guessPeople[currentGuessIndex];
    
    typeTextElement('game-question', clue.hint);
    
    document.getElementById('game-result').textContent = '';
    document.getElementById('game-input').focus();
    isGuessing = true;
}
}



function checkGuess() {
    const input = document.getElementById('game-input');
    const result = document.getElementById('game-result');
    const guess = input.value.trim().toLowerCase();
    
    // اگر راهنمایی نمایش داده شده است، حدس نزن (فقط سوال بعدی)
    if (isHintShown) {
        result.textContent = 'سوال بعدی را بزن!';
        return;
    }
    
    // اگر بازی تمام شده است، دوباره شروع نکن
    if (!isGuessing) {
        return;
    }
    
    const clue = guessPeople[currentGuessIndex];
    
    // بررسی حالت دقیق: اگر جواب کامل بود
    if (guess === clue.answer.toLowerCase()) {
        result.textContent = '🏆 آفرین! حدس درست بود!';
        isGuessing = false;
        const nextIndex = (currentGuessIndex + 1) % guessPeople.length;
        currentGuessIndex = nextIndex;
        
        setTimeout(() => {
            initGuessGame();
            input.value = '';
        }, 2000);
        return;
    }
    
    // بررسی جداگانه: اگر فقط اسم یا فامیل نوشته شده بود
    const answerParts = clue.answer.toLowerCase().split(" ");
    for (let i = 0; i < answerParts.length; i++) {
        if (answerParts[i].length >= 3 && guess === answerParts[i]) {
            result.textContent = '🏆 آفرین! حدس درست بود!';
            isGuessing = false;
            const nextIndex = (currentGuessIndex + 1) % guessPeople.length;
            currentGuessIndex = nextIndex;
            
            setTimeout(() => {
                initGuessGame();
                input.value = '';
            }, 2000);
            return;
        }
    }
    
    // اگر حدس نادرست بود
    if (guess === '') {
        result.textContent = 'درست حدس بزن، می‌دانی!';
        return;
    } else {
        result.textContent = '❌ اشتباه است! یک نفر دیگر را حدس بزن.';
        return;
    }
}
// ====== آیا راهنمایی نمایش داده شده است؟ ======
let isHintShown = false;

// ====== دکمه بلد نیستم (نمایش اطلاعات) ======
// ====== دکمه بلد نیستم (نمایش اطلاعات) ======
function showHint() {
    const personName = guessPeople[currentGuessIndex].answer;
    const personInfo = peopleData.find(p => p.name === personName);
    
    if (personInfo) {
        typeTextElement('game-question', personInfo.text);
    } else {
        // فقط نام شخصیت را نمایش بده
        typeTextElement('game-question', `پاسخ صحیح: ${personName}`);
    }
    
    document.getElementById('game-result').textContent = '';
    isHintShown = true;
    isGuessing = false;
}

// ====== دکمه سوال بعدی ======
function nextGuessQuestion() {
    // اگر سوالات تمام شدند، لیست را ریست کن
    if (usedGuessIndices.length === guessPeople.length) {
        usedGuessIndices = [];
    }
    
    // انتخاب سوالی که قبلاً استفاده نشده است
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * guessPeople.length);
    } while (usedGuessIndices.includes(randomIndex));
    
    usedGuessIndices.push(randomIndex);
    currentGuessIndex = randomIndex;
    
    const clue = guessPeople[currentGuessIndex];
    
    typeTextElement('game-question', clue.hint);
    
    document.getElementById('game-result').textContent = '';
    document.getElementById('game-input').value = '';
    isHintShown = false;
    isGuessing = true;
}

// ====== دکمه سوال بعدی ======
function nextGuessQuestion() {
    // اگر سوالات تمام شدند، لیست را ریست کن
    if (usedGuessIndices.length === guessPeople.length) {
        usedGuessIndices = [];
    }
    
    // انتخاب سوالی که قبلاً استفاده نشده است
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * guessPeople.length);
    } while (usedGuessIndices.includes(randomIndex));
    
    usedGuessIndices.push(randomIndex);
    currentGuessIndex = randomIndex;
    
    const clue = guessPeople[currentGuessIndex];
    
    typeTextElement('game-question', clue.hint);
    
    document.getElementById('game-result').textContent = '';
    document.getElementById('game-input').value = '';
    isHintShown = false; // راهنمایی جدید نمایش داده نشده است
    isGuessing = true;
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
    function closeGuessGame() {
        document.getElementById('game-start-btn').style.display = 'block';
        document.getElementById('game-content').style.display = 'none';
        document.getElementById('game-input').value = '';
        document.getElementById('game-result').textContent = '';
    }
});

// ====== شروع ======
renderCards();
renderCountries();
setTimeout(() => {
    loadDailyQuote();
}, 1700);

updateHeaderDateTime();
setInterval(updateHeaderDateTime, 1000);
// ====== تابع بازگشت ======
function closeGuessGame() {
    document.getElementById('game-start-btn').style.display = 'block';
    document.getElementById('game-content').style.display = 'none';
    document.getElementById('game-input').value = '';
    document.getElementById('game-result').textContent = '';
}

// ====== شروع بازی ======
function initGuessGame() {
    document.getElementById('game-start-btn').style.display = 'none';
    document.getElementById('game-content').style.display = 'block';
    
    if (currentGuessIndex === -1) {
        const randomIndex = Math.floor(Math.random() * guessPeople.length);
        currentGuessIndex = randomIndex;
    }
    
    const clue = guessPeople[currentGuessIndex];
    
    typeTextElement('game-question', clue.hint);
    
    document.getElementById('game-result').textContent = '';
    document.getElementById('game-input').focus();
    isGuessing = true;
}

// ====== دکمه بلد نیستم (نمایش اطلاعات از peopleData) ======
function showHint() {
    // پیدا کردن اطلاعات کامل شخصیت از دیتابیس peopleData
    const personName = guessPeople[currentGuessIndex].answer;
    const personInfo = peopleData.find(p => p.name === personName);
    
    if (personInfo) {
        // تایپ اطلاعات کامل شخصیت
        typeTextElement('game-question', personInfo.text);
    } else {
        // اگر شخصیت در دیتابیس نبود، فقط نام را نشان بده
        typeTextElement('game-question', `پاسخ صحیح: ${personName}. برای اطلاعات بیشتر به بخش شخصیت‌های تاریخی مراجعه کنید.`);
    }
    
    document.getElementById('game-result').textContent = '';
    isGuessing = false; // بازی تمام شده است
}

// ====== دکمه بلد نیستم (نمایش اطلاعات از peopleData) ======
function showHint() {
    // پیدا کردن اطلاعات کامل شخصیت از دیتابیس peopleData
    const personName = guessPeople[currentGuessIndex].answer;
    const personInfo = peopleData.find(p => p.name === personName);
    
    if (personInfo) {
        // تایپ اطلاعات کامل شخصیت
        typeTextElement('game-question', personInfo.text);
    } else {
        // اگر شخصیت در دیتابیس نبود، فقط نام را نشان بده
        typeTextElement('game-question', `پاسخ صحیح: ${personName}.`);
    }
    
    document.getElementById('game-result').textContent = '';
    isGuessing = false; // بازی تمام شده است
}
let usedGuessIndices = [];
// ====== دکمه سوال بعدی ======
function nextGuessQuestion() {
    // اگر سوالات تمام شدند، لیست را ریست کن
    if (usedGuessIndices.length === guessPeople.length) {
        usedGuessIndices = [];
    }
    
    // انتخاب سوالی که قبلاً استفاده نشده است
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * guessPeople.length);
    } while (usedGuessIndices.includes(randomIndex));
    
    usedGuessIndices.push(randomIndex);
    currentGuessIndex = randomIndex;
    
    const clue = guessPeople[currentGuessIndex];
    
    typeTextElement('game-question', clue.hint);
    
    document.getElementById('game-result').textContent = '';
    document.getElementById('game-input').value = '';
    isGuessing = true;
}
// ====== تایم‌لاین تاریخی ======
let timelineRendered = false;

function openTimeline() {
    document.getElementById('timeline-open-btn').style.display = 'none';
    document.getElementById('timeline-wrapper').style.display = 'block';
    
    // اگر اولین بار است که تایم‌لاین باز می‌شود، آیتم‌ها را بساز
    if (!timelineRendered) {
        renderTimeline();
        timelineRendered = true;
    }
}

function closeTimeline() {
    document.getElementById('timeline-open-btn').style.display = 'block';
    document.getElementById('timeline-wrapper').style.display = 'none';
}

function renderTimeline() {
    const timelineContainer = document.getElementById('timeline-items');
    timelineContainer.innerHTML = '';
    
    // ساخت آیتم‌های تایم‌لاین از دیتابیس تایم‌لاین
    timelineData.forEach((event, index) => {
        const item = document.createElement('div');
        item.classList.add('timeline-item');
        
        item.innerHTML = `
            <div class="timeline-info">
                <p class="timeline-date">${event.date}</p>
                <h3 class="timeline-title">${event.name}</h3>
            </div>
        `;
        
        // اگر روی آیتم کلیک شد، اطلاعات کامل رویداد را نمایش بده
        item.addEventListener('click', () => openTimelineModal(event));
        
        timelineContainer.appendChild(item);
    });
}

// ====== مودال تایم‌لاین ======
function openTimelineModal(event) {
    const modal = document.getElementById('detail-modal');
    const modalBody = document.getElementById('modal-body');
    
    modalBody.innerHTML = `
        <h2 class="modal-title">${event.name}</h2>
        <p class="modal-text" id="typewriter-text"></p>
    `;
    
    modal.classList.add('show');
    
    // شروع انیمیشن تایپ
    const textElement = document.getElementById('typewriter-text');
    typeText(textElement, event.text);
}
// ==========================================
// 1. ساخت ذرات غبار زمان
// ==========================================
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30; // تعداد ذرات (زیاد نباشد)

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // تنظیمات تصادفی
        const size = Math.random() * 5 + 2; // اندازه بین 2 تا 7 پیکسل
        const leftPosition = Math.random() * 100;
        const duration = Math.random() * 20 + 15; // مدت زمان بین 15 تا 35 ثانیه
        const delay = Math.random() * 20; // تاخیر تصادفی
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${leftPosition}vw`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `-${delay}s`; // شروع از وسط انیمیشن
        
        particlesContainer.appendChild(particle);
    }
}

// اجرای ساخت ذرات
createParticles();



// ==========================================
// 1. Cursor Trail (رد موس)
// ==========================================
document.addEventListener('mousemove', (e) => {
    const trail = document.createElement('div');
    trail.classList.add('cursor-trail');
    trail.style.left = `${e.clientX}px`;
    trail.style.top = `${e.clientY}px`;
    
    document.body.appendChild(trail);
    
    setTimeout(() => {
        trail.remove();
    }, 300);
});




searchInput.addEventListener('blur', () => {
    setTimeout(() => {
        searchDropdown.classList.remove('show');
    }, 200);
});

// ==========================================
// ====== جستجو (فقط فیلتر کردن کارت‌ها) ======
document.getElementById('search-input').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    
    // فیلتر کردن شخصیت‌ها
    const peopleContainer = document.getElementById('people-scroll');
    peopleContainer.innerHTML = '';
    peopleData.filter(p => p.name.toLowerCase().includes(query)).forEach(person => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `<div class="card-title">${person.name}</div><div class="card-date">${person.date}</div>`;
        card.addEventListener('click', () => openModal(person));
        peopleContainer.appendChild(card);
    });

    // فیلتر کردن رویدادها
    const eventsContainer = document.getElementById('events-scroll');
    eventsContainer.innerHTML = '';
    eventsData.filter(ev => ev.name.toLowerCase().includes(query)).forEach(event => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `<div class="card-title">${event.name}</div><div class="card-date">${event.date}</div>`;
        card.addEventListener('click', () => openModal(event));
        eventsContainer.appendChild(card);
    });

    // فیلتر کردن علم و دانش
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
