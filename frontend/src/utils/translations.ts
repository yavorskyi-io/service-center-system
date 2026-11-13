export type Language = 'ua' | 'en';

export const translations = {
  ua: {
    city: 'Київ',
    address: 'м. Київ, вул. Хрещатик, 10',
    fullAddress: 'м. Київ, вул. Хрещатик, 22 (біля ст. м. Майдан Незалежності)',
    workingHours: 'Пн–Сб: 09:00–20:00',
    fullWorkingHours: 'Пн–Пт: 09:00 – 20:00 • Сб–Нд: 10:00 – 18:00 (без перерви)',
    hotlineBadge: 'Безкоштовно по Україні',
    consultation: 'Консультація майстра:',

    // Nav
    navServices: 'Послуги та ціни',
    navStatus: 'Статус ремонту',
    navCorporate: 'Корпоративним клієнтам',
    navWarranty: 'Гарантія',
    navContacts: 'Контакти',
    navCabinet: 'Мій кабінет',
    btnCheckStatus: 'Перевірити статус',
    btnSubmitOrder: 'Залишити заявку',
    btnRegister: 'Реєстрація',
    btnLogin: 'Увійти',
    btnLogout: 'Вийти',
    btnProfile: 'Профіль та безпека',

    // Hero
    heroBadge: 'Офіційна гарантія до 6 місяців • Працюємо онлайн',
    heroTitle1: 'Професійний ремонт техніки з ',
    heroTitle2: 'онлайн-відстеженням',
    heroSubtitle: 'Швидка діагностика за 30 хвилин, оригінальні комплектуючі та прозорі ціни. Перевірте статус вашого ремонту в реальному часі прямо зараз.',
    searchPlaceholder: 'Введіть номер телефону або трек-код (напр. TRK-A8F91B)...',
    searchBtn: 'Перевірити статус',
    searchSearching: 'Пошук...',
    searchHint: 'Підказка: можна ввести код квитанції або номер телефону',
    searchTry: 'Спробувати: TRK-A8F91B',

    // 4 Badges
    feature1Title: 'Від 30 хвилин',
    feature1Desc: 'Експрес-діагностика дефектів',
    feature2Title: 'Гарантія 6 міс.',
    feature2Desc: 'Офіційний акт та чек',
    feature3Title: 'Оригінальні деталі',
    feature3Desc: 'Власний склад комплектуючих',
    feature4Title: 'Live-трекінг',
    feature4Desc: 'Прозорий статус ремонту',

    // Search Results
    resultsTitle: 'Результати перевірки статусу',
    resultsFound: 'знайдено:',
    resultsClear: 'Очистити',
    notFoundTitle: 'Замовлення не знайдено',
    notFoundDesc: 'Перевірте правильність введеного трек-коду або номера телефону. Якщо ви щойно здали пристрій, реєстрація триває до 5 хвилин.',

    // Cabinet
    cabinetAuthorized: 'Авторизований клієнт',
    cabinetWelcome: 'Вітаємо,',
    cabinetDesc: 'У вашому особистому кабінеті доступні історія звернень, онлайн-статус ремонту пристроїв та керування захистом облікового запису (2FA).',
    cabinetSecBtn: 'Профіль та безпека (2FA)',
    cabinetNewOrderBtn: 'Нова заявка на ремонт',
    cabinetMyOrders: 'Мої заявки на ремонт',
    cabinetNoOrdersTitle: 'У вас поки немає активних заявок',
    cabinetNoOrdersDesc: 'Оформіть онлайн-запис на діагностику або ремонт, і статус виконання одразу відобразиться у вашому кабінеті.',
    cabinetFirstOrderBtn: 'Оформити першу заявку',

    // Order card
    orderReceipt: 'Квитанція №',
    orderDevice: 'Пристрій',
    orderProblem: 'Заявлена несправність',
    orderTotal: 'Разом до сплати:',
    orderCopied: 'Скопійовано!',
    orderCopyCode: 'Копіювати трек-код',

    // Services
    servicesHeaderBadge: 'Прайс-лист',
    servicesTitle: 'Популярні послуги та орієнтовні ціни',
    servicesDesc: 'Точна вартість узгоджується майстром після безкоштовної діагностики перед початком будь-яких робіт.',
    servicesBookBtn: 'Замовити ремонт',
    servicesPriceFrom: 'від',

    // Service categories
    catSmartphones: 'Смартфони',
    catLaptops: 'Ноутбуки',
    catTablets: 'Планшети',
    catMonitors: 'Монітори та ПК',

    // Workflow
    workflowBadge: 'Етапи роботи',
    workflowTitle: 'Як відбувається ремонт пристрою',
    workflowDesc: 'Прозорий та контрольований процес на кожному кроці — без несподіванок та переплат.',
    step1Title: 'Прийом та реєстрація',
    step1Desc: 'Оформлення заявки онлайн або в нашому центрі, видача трек-коду для онлайн-відстеження.',
    step2Title: 'Детальна діагностика',
    step2Desc: 'Апаратне та програмне тестування інженером на спеціалізованому стенді протягом 30–60 хв.',
    step3Title: 'Узгодження вартості',
    step3Desc: 'Дзвінок або повідомлення клієнту, погодження переліку деталей і вартості без прихованих платежів.',
    step4Title: 'Професійний ремонт',
    step4Desc: 'Встановлення оригінальних деталей із власного складу та складна пайка на BGA-станціях.',
    step5Title: 'Контроль якості (QC)',
    step5Desc: 'Стрес-тестування всіх функцій пристрою та перевірка теплових режимів перед видачею клієнту.',
    step6Title: 'Видача та гарантія',
    step6Desc: 'SMS/Viber сповіщення про готовність, видача замінених компонентів та гарантійного талона на 6 місяців.',

    // About
    aboutBadge: 'Про сервісний центр FixPoint',
    aboutTitle: 'Надійний партнер з ремонту цифрової техніки в Києві',
    aboutP1: 'FixPoint — це сучасна лабораторія з ремонту електроніки будь-якої складності. Ми оснащені високоточними інфрачервоними BGA-станціями, цифровими мікроскопами та програматорами.',
    aboutP2: 'Кожен пристрій проходить обов\'язковий вхідний та вихідний контроль якості. Усі замінені комплектуючі повертаються клієнту разом із гарантійним талоном.',
    aboutStatYears: 'Років на ринку',
    aboutStatRepairs: 'Відремонтовано',
    aboutStatSuccess: 'Успішних робіт',

    // Contacts
    contactsTitle: 'Контактна інформація та графік',
    contactAddressLabel: 'Адреса сервісного центру:',
    contactHotlineLabel: 'Гаряча лінія приймання:',
    contactHoursLabel: 'Графік роботи:',
    contactCtaText: 'Потрібна швидка консультація?',
    contactCtaBtn: 'Подати заявку',

    // Footer
    footerRights: 'Всі права захищено',
    footerSupport: 'Служба підтримки',
    footerStaffLogin: 'Вхід для персоналу',

    // Status Workflow
    stNew: 'Прийом',
    stNewDesc: 'Зареєстровано в системі',
    stDiag: 'Діагностика',
    stDiagDesc: 'Визначення несправності',
    stAppr: 'Узгодження',
    stApprDesc: 'Погодження кошторису',
    stProg: 'Ремонт',
    stProgDesc: 'Виконання робіт',
    stReady: 'Готово',
    stReadyDesc: 'Очікує видачі',
    stComp: 'Видано',
    stCompDesc: 'Отримано клієнтом'
  },
  en: {
    city: 'Kyiv',
    address: '10 Khreshchatyk St., Kyiv',
    fullAddress: '22 Khreshchatyk St., Kyiv (near Maidan Nezalezhnosti metro station)',
    workingHours: 'Mon–Sat: 09:00–20:00',
    fullWorkingHours: 'Mon–Fri: 09:00 – 20:00 • Sat–Sun: 10:00 – 18:00 (no break)',
    hotlineBadge: 'Toll-free across Ukraine',
    consultation: 'Master consultation:',

    // Nav
    navServices: 'Services & Prices',
    navStatus: 'Repair Status',
    navCorporate: 'Corporate Clients',
    navWarranty: 'Warranty',
    navContacts: 'Contacts',
    navCabinet: 'My Account',
    btnCheckStatus: 'Check Status',
    btnSubmitOrder: 'Submit Request',
    btnRegister: 'Sign Up',
    btnLogin: 'Sign In',
    btnLogout: 'Logout',
    btnProfile: 'Profile & Security',

    // Hero
    heroBadge: 'Official warranty up to 6 months • Online support',
    heroTitle1: 'Professional device repair with ',
    heroTitle2: 'real-time tracking',
    heroSubtitle: 'Fast diagnosis in 30 minutes, genuine components, and transparent pricing. Track your device repair progress right now.',
    searchPlaceholder: 'Enter phone number or tracking code (e.g. TRK-A8F91B)...',
    searchBtn: 'Check Status',
    searchSearching: 'Searching...',
    searchHint: 'Tip: you can enter a receipt code or phone number',
    searchTry: 'Try: TRK-A8F91B',

    // 4 Badges
    feature1Title: 'From 30 mins',
    feature1Desc: 'Express defect diagnostics',
    feature2Title: '6-Month Warranty',
    feature2Desc: 'Official invoice & receipt',
    feature3Title: 'Genuine Parts',
    feature3Desc: 'In-house components stock',
    feature4Title: 'Live Tracking',
    feature4Desc: 'Transparent repair progress',

    // Search Results
    resultsTitle: 'Status Check Results',
    resultsFound: 'found:',
    resultsClear: 'Clear',
    notFoundTitle: 'Order not found',
    notFoundDesc: 'Please verify the tracking code or phone number. If you recently dropped off the device, registration takes up to 5 minutes.',

    // Cabinet
    cabinetAuthorized: 'Authorized Client',
    cabinetWelcome: 'Welcome,',
    cabinetDesc: 'In your personal account you can view service history, live repair status, and manage two-factor authentication (2FA).',
    cabinetSecBtn: 'Profile & Security (2FA)',
    cabinetNewOrderBtn: 'New Repair Request',
    cabinetMyOrders: 'My Repair Requests',
    cabinetNoOrdersTitle: 'No active requests yet',
    cabinetNoOrdersDesc: 'Submit an online request for diagnostics or repair, and its status will immediately appear in your account.',
    cabinetFirstOrderBtn: 'Create First Request',

    // Order card
    orderReceipt: 'Receipt #',
    orderDevice: 'Device',
    orderProblem: 'Reported Issue',
    orderTotal: 'Total Due:',
    orderCopied: 'Copied!',
    orderCopyCode: 'Copy tracking code',

    // Services
    servicesHeaderBadge: 'Price List',
    servicesTitle: 'Popular Services & Estimated Prices',
    servicesDesc: 'Exact cost is confirmed by the master after free diagnostics before any work begins.',
    servicesBookBtn: 'Book Repair',
    servicesPriceFrom: 'from',

    // Service categories
    catSmartphones: 'Smartphones',
    catLaptops: 'Laptops',
    catTablets: 'Tablets',
    catMonitors: 'Monitors & PC',

    // Workflow
    workflowBadge: 'How We Work',
    workflowTitle: 'Our Device Repair Process',
    workflowDesc: 'A fully transparent and controlled process at every stage — no surprises or hidden fees.',
    step1Title: 'Intake & Registration',
    step1Desc: 'Submit an order online or at our service center; receive an instant tracking code.',
    step2Title: 'Detailed Diagnostics',
    step2Desc: 'Hardware and software inspection by certified engineers in 30–60 minutes.',
    step3Title: 'Cost Approval',
    step3Desc: 'Call or message to confirm parts list and exact cost with no hidden charges.',
    step4Title: 'Professional Repair',
    step4Desc: 'Installation of genuine components from our warehouse and precision BGA soldering.',
    step5Title: 'Quality Control (QC)',
    step5Desc: 'Full functional stress testing and thermal checks before device return.',
    step6Title: 'Pick-up & Warranty',
    step6Desc: 'SMS/Viber notification upon completion, return of replaced parts, and 6-month warranty.',

    // About
    aboutBadge: 'About FixPoint Service Center',
    aboutTitle: 'Reliable Digital Repair Partner in Kyiv',
    aboutP1: 'FixPoint is a modern laboratory for repairing electronics of any complexity. Equipped with infrared BGA stations, digital microscopes, and chip programmers.',
    aboutP2: 'Every device undergoes rigorous incoming and outgoing quality control. All replaced parts are returned to the client along with an official warranty.',
    aboutStatYears: 'Years on market',
    aboutStatRepairs: 'Repaired devices',
    aboutStatSuccess: 'Success rate',

    // Contacts
    contactsTitle: 'Contact Information & Schedule',
    contactAddressLabel: 'Service Center Address:',
    contactHotlineLabel: 'Intake Hotline:',
    contactHoursLabel: 'Working Hours:',
    contactCtaText: 'Need quick advice?',
    contactCtaBtn: 'Submit Request',

    // Footer
    footerRights: 'All rights reserved',
    footerSupport: 'Customer Support',
    footerStaffLogin: 'Staff Login',

    // Status Workflow
    stNew: 'Intake',
    stNewDesc: 'Registered in system',
    stDiag: 'Diagnostics',
    stDiagDesc: 'Identifying issue',
    stAppr: 'Approval',
    stApprDesc: 'Budget confirmation',
    stProg: 'Repair',
    stProgDesc: 'Work in progress',
    stReady: 'Ready',
    stReadyDesc: 'Awaiting pickup',
    stComp: 'Completed',
    stCompDesc: 'Received by client'
  }
};
