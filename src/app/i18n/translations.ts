export type Language = 'ru' | 'kk' | 'en';

export const translations = {
  ru: {
    // Header
    appTitle: 'Панель управления умным городом - Алматы',
    appSubtitle: 'Мониторинг и аналитика Алматы в реальном времени',
    
    // Stats
    population: 'Население',
    energyUsage: 'Энергопотребление',
    waterUsage: 'Водопотребление',
    publicTransport: 'Общ. транспорт',
    airQuality: 'Качество воздуха',
    buildingPermits: 'Строит. разрешения',
    
    // AI Insights
    aiInsights: 'ИИ-аналитика и рекомендации',
    aiAnalyzing: 'ИИ анализирует данные города...',
    aiGenerating: 'Генерация...',
    aiGenerated: 'Сгенерировано ИИ',
    aiFallback: 'Резервный режим',
    staticMode: 'Статический режим',
    aiAnalysis: 'ИИ-анализ',
    aiSuccess: 'ИИ сгенерировал через OpenRouter',
    aiError: 'Ошибка ИИ-запроса, показаны статические данные',
    aiStatic: 'Статические данные. Добавьте VITE_OPENROUTER_API_KEY в .env для ИИ',
    cooldown: 'Ожидание',
    retrying: 'Повторная попытка через',
    
    // Short/Long term
    shortTerm: 'Краткосрочные (сейчас)',
    longTerm: 'Долгосрочные (тренды)',
    
    // Filters
    quickFilters: 'Быстрые фильтры',
    showAdvanced: 'Показать расширенные',
    hideAdvanced: 'Скрыть расширенные',
    refresh: 'Обновить',
    export: 'Экспорт',
    geographicZone: 'Географическая зона',
    dataType: 'Тип данных',
    search: 'Поиск',
    searchPlaceholder: 'Поиск метрик...',
    yoyComparison: 'Сравнение год к году',
    active: 'Активные',
    allCategories: 'Все категории',
    allData: 'Все данные',
    energy: 'Энергия',
    transport: 'Транспорт',
    water: 'Вода',
    traffic: 'Трафик',
    weather: 'Погода',
    
    // Date ranges
    lastHour: '1 час',
    last24h: '24 часа',
    last7d: '7 дней',
    last30d: '30 дней',
    last3m: '3 месяца',
    lastYear: 'Год',
    custom: 'Свой',
    
    // Zones
    allDistricts: 'Все районы',
    almaly: 'Алмалинский',
    bostandyk: 'Бостандыкский',
    medeu: 'Медеуский',
    auezov: 'Ауэзовский',
    turksib: 'Турксибский',
    zhetysu: 'Жетысуский',
    alatau: 'Алатауский',
    nauryzbai: 'Наурызбайский',
    
    // Data types
    realTime: 'Реальное время',
    historical: 'Исторические',
    predicted: 'Прогноз',
    
    // Charts
    energyChart: 'Потребление и производство энергии',
    transportChart: 'Использование общественного транспорта',
    waterChart: 'Потребление воды по секторам (м³)',
    consumption: 'Потребление',
    production: 'Производство',
    aiAnalysisLabel: 'ИИ-анализ',
    generateAI: 'Сгенерировать ИИ-анализ',
    rateLimited: 'Ограничение. Попробуйте через',
    
    // Weather
    weatherConditions: 'Погодные условия',
    weatherForecast: 'Прогноз погоды',
    windSpeed: 'Скорость ветра',
    humidity: 'Влажность',
    forecast5day: 'Прогноз на 5 дней',
    sunny: 'Ясно',
    cloudy: 'Облачно',
    rainy: 'Дождь',
    snowy: 'Снег',
    
    // Traffic
    trafficStatus: 'Статус трафика',
    activeIncidents: 'активных инцидентов',
    avgSpeed: 'Ср. скорость',
    vehiclesPerMin: 'Авто/мин',
    avgCommute: 'Ср. поездка',
    heavy: 'Сильный',
    moderate: 'Умеренный',
    light: 'Лёгкий',
    
    // Debug
    debugMode: 'Режим отладки',
    regenerateAll: 'Перегенерировать все ИИ-анализы',
    generating: 'Генерация...',
    energyLabel: 'Энергия',
    transportLabel: 'Транспорт',
    waterLabel: 'Вода',
    weatherLabel: 'Погода',
    tempLabel: 'Темп.',
    windLabel: 'Ветер',
    conditionLabel: 'Условия',
    
    // New features
    darkMode: 'Тёмная тема',
    lightMode: 'Светлая тема',
    language: 'Язык',
    autoRefresh: 'Автообновление',
    refreshInterval: 'Интервал обновления',
    every1min: '1 минута',
    every5min: '5 минут',
    every15min: '15 минут',
    lastUpdated: 'Обновлено',
    secondsAgo: 'сек. назад',
    aiChat: 'ИИ-чат',
    aiChatPlaceholder: 'Задайте вопрос о данных города...',
    aiChatSend: 'Отправить',
    aiChatThinking: 'ИИ думает...',
    incidentReport: 'Сообщить об инциденте',
    incidentType: 'Тип инцидента',
    incidentLocation: 'Местоположение',
    incidentDescription: 'Описание',
    incidentSubmit: 'Отправить',
    incidentSuccess: 'Инцидент зарегистрирован',
    incidentTraffic: 'ДТП / Пробка',
    incidentPower: 'Отключение электричества',
    incidentWater: 'Прорыв воды',
    incidentRoad: 'Повреждение дороги',
    incidentOther: 'Другое',
    incidentsLog: 'Журнал инцидентов',
    noIncidents: 'Инцидентов не зарегистрировано',

    // Default AI Insights
    energyDefaultInsight: 'Стабильность сети в норме за этот период. Тренды потребления соответствуют прогнозируемым показателям.',
    transportDefaultInsight: 'Метро наиболее востребовано. Рекомендуется динамическая корректировка маршрутов.',
    waterDefaultInsight: 'Объёмы воды стабильны по всем секторам за выбранный период. Аномалий не обнаружено.',

    // Traffic Widget
    trafficStatusTitle: 'Статус трафика',
    activeIncidentsAlert: 'активных инцидентов',
    trafficHeavyAlert: 'Крупные заторы в Алмалинском районе. Рассмотрите альтернативные маршруты.',
    trafficHeavy: 'Сильный',
    trafficModerate: 'Умеренный',
    trafficLight: 'Лёгкий',
    trafficLabel: 'трафик',
    incidentsCount: 'инцидентов',
    avgSpeedLabel: 'Ср. скорость',
    vehiclesPerMinLabel: 'Авто/мин',
    avgCommuteLabel: 'Ср. поездка',

    // Weather Widget
    weatherForecastTitle: 'Прогноз погоды',
    weatherConditionsTitle: 'Погодные условия',
    forecastBadge: 'Прогноз',
    windSpeedLabel: 'Скорость ветра',
    humidityLabel: 'Влажность',
    forecast5dayTitle: 'Прогноз на 5 дней',

    // Chart AI Insights
    aiAnalysisShort: 'ИИ-анализ',
    generateAIInsight: 'Сгенерировать ИИ-анализ',
    rateLimitedTryAgain: 'Ограничение. Попробуйте через',
    secondsSuffix: 'с',

    // Energy Chart
    energyChartTitle: 'Потребление и производство энергии',
    consumptionMW: 'Потребление (МВт)',
    productionMW: 'Производство (МВт)',

    // Transport Chart
    transportChartTitle: 'Использование общественного транспорта',
    busLabel: 'Автобус',
    metroLabel: 'Метро',
    tramLabel: 'Трамвай',

    // Water Chart
    waterChartTitle: 'Потребление воды по секторам (м³)',
    residentialLabel: 'Жилые',
    commercialLabel: 'Коммерч.',
    industrialLabel: 'Промышл.',

    // Traffic Map
    trafficMapTitle: 'Интерактивная карта трафика',
    interactiveBadge: 'Интерактив',
    activeIncidentsLabel: 'Активных инцидентов',
    avgSpeedCity: 'Ср. скорость',
    congestionZones: 'Заторных зон',
    speedLabel: 'Скорость',
    vehiclesLabel: 'Авто',
    incidentsLabel: 'Инциденты',
    aiAnalysisBadge: 'ИИ-анализ',
    trafficMapHeavy: 'Сильный',
    trafficMapModerate: 'Умеренный',
    trafficMapLight: 'Лёгкий',
    sensorsLabel: 'Датчики',

    // Weather Map
    weatherMapTitle: 'Карта мониторинга погоды',
    tempShort: 'Темп.',
    humidityShort: 'Влажн.',
    avgTemp: 'Ср. температура',
    avgHumidity: 'Ср. влажность',
    sunnyZones: 'Ясных зон',
    weatherAIForecast: 'ИИ-прогноз погоды',
    pressureLabel: 'Давл.',

    // Date Range Filter
    periodLabel: 'Период',
    categoryLabel: 'Категория',
    shownLabel: 'Показано',
    allCategoriesLabel: 'Все категории',

    // Debug Panel
    debugPanelTitle: 'Режим отладки',
    resetTooltip: 'Сбросить значения',
    closeDebugTooltip: 'Закрыть панель отладки',
    regenerateAllDebug: 'Перегенерировать все ИИ-анализы',
    debugGenerating: 'Генерация...',
    energySectionTitle: 'Энергия (МВт)',
    transportSectionTitle: 'Транспорт (ед.)',
    waterSectionTitle: 'Вода (м³)',
    weatherSectionTitle: 'Погода',
    debugFooter: 'Изменения применятся при следующей генерации ИИ',
    consumptionLabel: 'Потребление',
    productionLabel: 'Производство',
    busesLabel: 'Автобусы',
    tramsLabel: 'Трамваи',
    residentialShortLabel: 'Жилые',
    commercialShortLabel: 'Коммерч.',
    industrialShortLabel: 'Промышл.',
    tempLabelShort: 'Темп. (°C)',
    windLabelShort: 'Ветер (км/ч)',
    humidityLabelShort: 'Влажность (%)',
    conditionLabelShort: 'Условия',
  },
  kk: {
    // Header
    appTitle: 'Ақылды қала басқару панелі - Алматы',
    appSubtitle: 'Алматыны нақты уақытта мониторинг және талдау',
    
    // Stats
    population: 'Халық саны',
    energyUsage: 'Энергия тұтыну',
    waterUsage: 'Су тұтыну',
    publicTransport: 'Қоғамдық көлік',
    airQuality: 'Ауа сапасы',
    buildingPermits: 'Құрылыс рұқсаттары',
    
    // AI Insights
    aiInsights: 'ЖИ-талдау және ұсыныстар',
    aiAnalyzing: 'ЖИ қала деректерін талдауда...',
    aiGenerating: 'Генерация...',
    aiGenerated: 'ЖИ жасады',
    aiFallback: 'Резервтік режим',
    staticMode: 'Статикалық режим',
    aiAnalysis: 'ЖИ-талдау',
    aiSuccess: 'ЖИ OpenRouter арқылы жасады',
    aiError: 'ЖИ сұрау қатесі, статикалық деректер көрсетілуде',
    aiStatic: 'Статикалық деректер. ЖИ үшін VITE_OPENROUTER_API_KEY қосыңыз',
    cooldown: 'Күту',
    retrying: 'Қайталау арқылы',
    
    // Short/Long term
    shortTerm: 'Қысқа мерзімді (қазір)',
    longTerm: 'Ұзақ мерзімді (трендтер)',
    
    // Filters
    quickFilters: 'Жылды сүзгілер',
    showAdvanced: 'Кеңейтілгенді көрсету',
    hideAdvanced: 'Кеңейтілгенді жасыру',
    refresh: 'Жаңарту',
    export: 'Экспорт',
    geographicZone: 'Географиялық аймақ',
    dataType: 'Деректер түрі',
    search: 'Іздеу',
    searchPlaceholder: 'Метрикаларды іздеу...',
    yoyComparison: 'Жылдық салыстыру',
    active: 'Белсенді',
    allCategories: 'Барлық санаттар',
    allData: 'Барлық деректер',
    energy: 'Энергия',
    transport: 'Көлік',
    water: 'Су',
    traffic: 'Трафик',
    weather: 'Ауа райы',
    
    // Date ranges
    lastHour: '1 сағат',
    last24h: '24 сағат',
    last7d: '7 күн',
    last30d: '30 күн',
    last3m: '3 ай',
    lastYear: 'Жыл',
    custom: 'Өзінше',
    
    // Zones
    allDistricts: 'Барлық аудандар',
    almaly: 'Алмалы',
    bostandyk: 'Бостандық',
    medeu: 'Медеу',
    auezov: 'Әуезов',
    turksib: 'Түрксіб',
    zhetysu: 'Жетісу',
    alatau: 'Алатау',
    nauryzbai: 'Наурызбай',
    
    // Data types
    realTime: 'Нақты уақыт',
    historical: 'Тарихи',
    predicted: 'Болжам',
    
    // Charts
    energyChart: 'Энергия тұтыну және өндіріс',
    transportChart: 'Қоғамдық көлік қолдану',
    waterChart: 'Секторлар бойынша су тұтыну (м³)',
    consumption: 'Тұтыну',
    production: 'Өндіріс',
    aiAnalysisLabel: 'ЖИ-талдау',
    generateAI: 'ЖИ-талдау жасау',
    rateLimited: 'Шектеу. Әрекетті қайталаңыз',
    
    // Weather
    weatherConditions: 'Ауа райы жағдайлары',
    weatherForecast: 'Ауа райы болжамы',
    windSpeed: 'Жел жылдамдығы',
    humidity: 'Ылғалдылық',
    forecast5day: '5 күнге болжам',
    sunny: 'Ашық',
    cloudy: 'Бұлтты',
    rainy: 'Жаңбырлы',
    snowy: 'Қарлы',
    
    // Traffic
    trafficStatus: 'Трафик жағдайы',
    activeIncidents: 'белсенді оқиға',
    avgSpeed: 'Орт. жылдамдық',
    vehiclesPerMin: 'Көлік/мин',
    avgCommute: 'Орт. жол',
    heavy: 'Ауыр',
    moderate: 'Орташа',
    light: 'Жеңіл',
    
    // Debug
    debugMode: 'Түзету режимі',
    regenerateAll: 'Барлық ЖИ-талдауларды қайта жасау',
    generating: 'Генерация...',
    energyLabel: 'Энергия',
    transportLabel: 'Көлік',
    waterLabel: 'Су',
    weatherLabel: 'Ауа райы',
    tempLabel: 'Темп.',
    windLabel: 'Жел',
    conditionLabel: 'Жағдай',
    
    // New features
    darkMode: 'Қараңғы тақырып',
    lightMode: 'Жарық тақырып',
    language: 'Тіл',
    autoRefresh: 'Автожаңарту',
    refreshInterval: 'Жаңарту аралығы',
    every1min: '1 минут',
    every5min: '5 минут',
    every15min: '15 минут',
    lastUpdated: 'Жаңартылды',
    secondsAgo: 'сек. бұрын',
    aiChat: 'ЖИ-чат',
    aiChatPlaceholder: 'Қала деректері туралы сұрақ қойыңыз...',
    aiChatSend: 'Жіберу',
    aiChatThinking: 'ЖИ ойлауда...',
    incidentReport: 'Оқиға туралы хабарлау',
    incidentType: 'Оқиға түрі',
    incidentLocation: 'Орналасуы',
    incidentDescription: 'Сипаттама',
    incidentSubmit: 'Жіберу',
    incidentSuccess: 'Оқиға тіркелді',
    incidentTraffic: 'ЖКО / Кептеліс',
    incidentPower: 'Электр өшіру',
    incidentWater: 'Су жарылысы',
    incidentRoad: 'Жол зақымы',
    incidentOther: 'Басқа',
    incidentsLog: 'Оқиғалар журналы',
    noIncidents: 'Оқиғалар тіркелмеді',

    // Default AI Insights
    energyDefaultInsight: 'Желінің тұрақтылығы қалыпты. Тұтыну трендтері болжамға сәйкес.',
    transportDefaultInsight: 'Метро ең көп талап етіледі. Маршруттарды динамикалық түрде түзету ұсынылады.',
    waterDefaultInsight: 'Су көлемі барлық секторлар бойынша тұрақты. Ауытқулар анықталмады.',

    // Traffic Widget
    trafficStatusTitle: 'Трафик жағдайы',
    activeIncidentsAlert: 'белсенді оқиға',
    trafficHeavyAlert: 'Алмалы ауданында қатты кептеліс. Балама маршруттарды қарастырыңыз.',
    trafficHeavy: 'Ауыр',
    trafficModerate: 'Орташа',
    trafficLight: 'Жеңіл',
    trafficLabel: 'трафик',
    incidentsCount: 'оқиға',
    avgSpeedLabel: 'Орт. жылдамдық',
    vehiclesPerMinLabel: 'Көлік/мин',
    avgCommuteLabel: 'Орт. жол',

    // Weather Widget
    weatherForecastTitle: 'Ауа райы болжамы',
    weatherConditionsTitle: 'Ауа райы жағдайлары',
    forecastBadge: 'Болжам',
    windSpeedLabel: 'Жел жылдамдығы',
    humidityLabel: 'Ылғалдылық',
    forecast5dayTitle: '5 күнге болжам',

    // Chart AI Insights
    aiAnalysisShort: 'ЖИ-талдау',
    generateAIInsight: 'ЖИ-талдау жасау',
    rateLimitedTryAgain: 'Шектеу. Әрекетті қайталаңыз',
    secondsSuffix: 'с',

    // Energy Chart
    energyChartTitle: 'Энергия тұтыну және өндіріс',
    consumptionMW: 'Тұтыну (МВт)',
    productionMW: 'Өндіріс (МВт)',

    // Transport Chart
    transportChartTitle: 'Қоғамдық көлік қолдану',
    busLabel: 'Автобус',
    metroLabel: 'Метро',
    tramLabel: 'Трамвай',

    // Water Chart
    waterChartTitle: 'Секторлар бойынша су тұтыну (м³)',
    residentialLabel: 'Тұрғын',
    commercialLabel: 'Коммерч.',
    industrialLabel: 'Өнеркәсіп',

    // Traffic Map
    trafficMapTitle: 'Интерактивті трафик картасы',
    interactiveBadge: 'Интерактив',
    activeIncidentsLabel: 'Белсенді оқиғалар',
    avgSpeedCity: 'Орт. жылдамдық',
    congestionZones: 'Кептеліс аймақтары',
    speedLabel: 'Жылдамдық',
    vehiclesLabel: 'Көлік',
    incidentsLabel: 'Оқиғалар',
    aiAnalysisBadge: 'ЖИ-талдау',
    trafficMapHeavy: 'Ауыр',
    trafficMapModerate: 'Орташа',
    trafficMapLight: 'Жеңіл',
    sensorsLabel: 'Сенсорлар',

    // Weather Map
    weatherMapTitle: 'Ауа райы мониторинг картасы',
    tempShort: 'Темп.',
    humidityShort: 'Ылғал.',
    avgTemp: 'Орт. температура',
    avgHumidity: 'Орт. ылғалдылық',
    sunnyZones: 'Ашық аймақтар',
    weatherAIForecast: 'ЖИ-ауа райы болжамы',
    pressureLabel: 'Қысым',

    // Date Range Filter
    periodLabel: 'Кезең',
    categoryLabel: 'Санат',
    shownLabel: 'Көрсетілген',
    allCategoriesLabel: 'Барлық санаттар',

    // Debug Panel
    debugPanelTitle: 'Түзету режимі',
    resetTooltip: 'Мәндерді қалпына келтіру',
    closeDebugTooltip: 'Түзету панелін жабу',
    regenerateAllDebug: 'Барлық ЖИ-талдауларды қайта жасау',
    debugGenerating: 'Генерация...',
    energySectionTitle: 'Энергия (МВт)',
    transportSectionTitle: 'Көлік (дана)',
    waterSectionTitle: 'Су (м³)',
    weatherSectionTitle: 'Ауа райы',
    debugFooter: 'Өзгерістер келесі ЖИ генерациясында қолданылады',
    consumptionLabel: 'Тұтыну',
    productionLabel: 'Өндіріс',
    busesLabel: 'Автобустар',
    tramsLabel: 'Трамвайлар',
    residentialShortLabel: 'Тұрғын',
    commercialShortLabel: 'Коммерч.',
    industrialShortLabel: 'Өнеркәсіп',
    tempLabelShort: 'Темп. (°C)',
    windLabelShort: 'Жел (км/ч)',
    humidityLabelShort: 'Ылғалдылық (%)',
    conditionLabelShort: 'Жағдай',
  },
  en: {
    // Header
    appTitle: 'Smart City Management Dashboard - Almaty',
    appSubtitle: 'Real-time monitoring and analytics for Almaty',
    
    // Stats
    population: 'Population',
    energyUsage: 'Energy Usage',
    waterUsage: 'Water Consumption',
    publicTransport: 'Public Transport',
    airQuality: 'Air Quality',
    buildingPermits: 'Building Permits',
    
    // AI Insights
    aiInsights: 'AI Insights & Recommendations',
    aiAnalyzing: 'AI is analyzing city data...',
    aiGenerating: 'Generating...',
    aiGenerated: 'AI Generated',
    aiFallback: 'Fallback Mode',
    staticMode: 'Static Mode',
    aiAnalysis: 'AI Analysis',
    aiSuccess: 'AI generated via OpenRouter',
    aiError: 'AI request failed, showing static data',
    aiStatic: 'Static data. Add VITE_OPENROUTER_API_KEY to .env for AI',
    cooldown: 'Cooldown',
    retrying: 'Retrying in',
    
    // Short/Long term
    shortTerm: 'Short-term (now)',
    longTerm: 'Long-term (trends)',
    
    // Filters
    quickFilters: 'Quick Filters',
    showAdvanced: 'Show Advanced',
    hideAdvanced: 'Hide Advanced',
    refresh: 'Refresh',
    export: 'Export',
    geographicZone: 'Geographic Zone',
    dataType: 'Data Type',
    search: 'Search',
    searchPlaceholder: 'Search metrics...',
    yoyComparison: 'Year-over-Year Comparison',
    active: 'Active',
    allCategories: 'All Categories',
    allData: 'All Data',
    energy: 'Energy',
    transport: 'Transport',
    water: 'Water',
    traffic: 'Traffic',
    weather: 'Weather',
    
    // Date ranges
    lastHour: '1 Hour',
    last24h: '24 Hours',
    last7d: '7 Days',
    last30d: '30 Days',
    last3m: '3 Months',
    lastYear: 'Year',
    custom: 'Custom',
    
    // Zones
    allDistricts: 'All Districts',
    almaly: 'Almaly',
    bostandyk: 'Bostandyk',
    medeu: 'Medeu',
    auezov: 'Auezov',
    turksib: 'Turksib',
    zhetysu: 'Zhetysu',
    alatau: 'Alatau',
    nauryzbai: 'Nauryzbai',
    
    // Data types
    realTime: 'Real-time',
    historical: 'Historical',
    predicted: 'Predicted',
    
    // Charts
    energyChart: 'Energy Consumption & Production',
    transportChart: 'Public Transport Usage',
    waterChart: 'Water Usage by Sector (m³)',
    consumption: 'Consumption',
    production: 'Production',
    aiAnalysisLabel: 'AI Analysis',
    generateAI: 'Generate AI Insight',
    rateLimited: 'Rate limited. Try again in',
    
    // Weather
    weatherConditions: 'Weather Conditions',
    weatherForecast: 'Weather Forecast',
    windSpeed: 'Wind Speed',
    humidity: 'Humidity',
    forecast5day: '5-Day Forecast',
    sunny: 'Sunny',
    cloudy: 'Cloudy',
    rainy: 'Rainy',
    snowy: 'Snowy',
    
    // Traffic
    trafficStatus: 'Traffic Status',
    activeIncidents: 'active incidents',
    avgSpeed: 'Avg Speed',
    vehiclesPerMin: 'Vehicles/min',
    avgCommute: 'Avg Commute',
    heavy: 'Heavy',
    moderate: 'Moderate',
    light: 'Light',
    
    // Debug
    debugMode: 'Debug Mode',
    regenerateAll: 'Regenerate All AI Insights',
    generating: 'Generating...',
    energyLabel: 'Energy',
    transportLabel: 'Transport',
    waterLabel: 'Water',
    weatherLabel: 'Weather',
    tempLabel: 'Temp',
    windLabel: 'Wind',
    conditionLabel: 'Condition',
    
    // New features
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    language: 'Language',
    autoRefresh: 'Auto Refresh',
    refreshInterval: 'Refresh Interval',
    every1min: '1 minute',
    every5min: '5 minutes',
    every15min: '15 minutes',
    lastUpdated: 'Updated',
    secondsAgo: 'seconds ago',
    aiChat: 'AI Chat',
    aiChatPlaceholder: 'Ask a question about city data...',
    aiChatSend: 'Send',
    aiChatThinking: 'AI is thinking...',
    incidentReport: 'Report an Incident',
    incidentType: 'Incident Type',
    incidentLocation: 'Location',
    incidentDescription: 'Description',
    incidentSubmit: 'Submit',
    incidentSuccess: 'Incident reported',
    incidentTraffic: 'Accident / Traffic',
    incidentPower: 'Power Outage',
    incidentWater: 'Water Main Break',
    incidentRoad: 'Road Damage',
    incidentOther: 'Other',
    incidentsLog: 'Incidents Log',
    noIncidents: 'No incidents reported',

    // Default AI Insights
    energyDefaultInsight: 'Network stability is normal. Consumption trends match forecasts.',
    transportDefaultInsight: 'Metro is most in demand. Dynamic route adjustment recommended.',
    waterDefaultInsight: 'Water volumes are stable across all sectors. No anomalies detected.',

    // Traffic Widget
    trafficStatusTitle: 'Traffic Status',
    activeIncidentsAlert: 'active incidents',
    trafficHeavyAlert: 'Heavy congestion in Almaly district. Consider alternative routes.',
    trafficHeavy: 'Heavy',
    trafficModerate: 'Moderate',
    trafficLight: 'Light',
    trafficLabel: 'traffic',
    incidentsCount: 'incidents',
    avgSpeedLabel: 'Avg Speed',
    vehiclesPerMinLabel: 'Vehicles/min',
    avgCommuteLabel: 'Avg Commute',

    // Weather Widget
    weatherForecastTitle: 'Weather Forecast',
    weatherConditionsTitle: 'Weather Conditions',
    forecastBadge: 'Forecast',
    windSpeedLabel: 'Wind Speed',
    humidityLabel: 'Humidity',
    forecast5dayTitle: '5-Day Forecast',

    // Chart AI Insights
    aiAnalysisShort: 'AI Analysis',
    generateAIInsight: 'Generate AI Insight',
    rateLimitedTryAgain: 'Rate limited. Try again in',
    secondsSuffix: 's',

    // Energy Chart
    energyChartTitle: 'Energy Consumption & Production',
    consumptionMW: 'Consumption (MW)',
    productionMW: 'Production (MW)',

    // Transport Chart
    transportChartTitle: 'Public Transport Usage',
    busLabel: 'Bus',
    metroLabel: 'Metro',
    tramLabel: 'Tram',

    // Water Chart
    waterChartTitle: 'Water Usage by Sector (m³)',
    residentialLabel: 'Residential',
    commercialLabel: 'Commercial',
    industrialLabel: 'Industrial',

    // Traffic Map
    trafficMapTitle: 'Interactive Traffic Map',
    interactiveBadge: 'Interactive',
    activeIncidentsLabel: 'Active Incidents',
    avgSpeedCity: 'Avg Speed',
    congestionZones: 'Congestion Zones',
    speedLabel: 'Speed',
    vehiclesLabel: 'Vehicles',
    incidentsLabel: 'Incidents',
    aiAnalysisBadge: 'AI Analysis',
    trafficMapHeavy: 'Heavy',
    trafficMapModerate: 'Moderate',
    trafficMapLight: 'Light',
    sensorsLabel: 'Sensors',

    // Weather Map
    weatherMapTitle: 'Weather Monitoring Map',
    tempShort: 'Temp',
    humidityShort: 'Humid.',
    avgTemp: 'Avg Temperature',
    avgHumidity: 'Avg Humidity',
    sunnyZones: 'Sunny Zones',
    weatherAIForecast: 'AI Weather Forecast',
    pressureLabel: 'Pressure',

    // Date Range Filter
    periodLabel: 'Period',
    categoryLabel: 'Category',
    shownLabel: 'Showing',
    allCategoriesLabel: 'All Categories',

    // Debug Panel
    debugPanelTitle: 'Debug Mode',
    resetTooltip: 'Reset values',
    closeDebugTooltip: 'Close debug panel',
    regenerateAllDebug: 'Regenerate All AI Insights',
    debugGenerating: 'Generating...',
    energySectionTitle: 'Energy (MW)',
    transportSectionTitle: 'Transport (units)',
    waterSectionTitle: 'Water (m³)',
    weatherSectionTitle: 'Weather',
    debugFooter: 'Changes will apply on next AI generation',
    consumptionLabel: 'Consumption',
    productionLabel: 'Production',
    busesLabel: 'Buses',
    tramsLabel: 'Trams',
    residentialShortLabel: 'Residential',
    commercialShortLabel: 'Commercial',
    industrialShortLabel: 'Industrial',
    tempLabelShort: 'Temp (°C)',
    windLabelShort: 'Wind (km/h)',
    humidityLabelShort: 'Humidity (%)',
    conditionLabelShort: 'Condition',
  },
};

export function t(lang: Language, key: keyof typeof translations['en']): string {
  return translations[lang][key] || translations['en'][key] || key;
}
