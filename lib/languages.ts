export interface Language {
  code: string
  name: string
  flag: string
}

export const languages: Language[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "bn", name: "বাংলা", flag: "🇧🇩" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
]

export const translations = {
  en: {
    // Authentication & Basic
    activationTitle: "Trading Calculator Access",
    activationSubtitle: "Enter your activation key to continue",
    activationKey: "Activation Key",
    username: "Username",
    login: "Login",
    invalidKey: "Invalid activation key",
    userBanned: "User is banned",
    connectionError: "Connection error",
    welcome: "Welcome to Trading Calculator",
    calculator: "Calculator",
    results: "Results",
    admin: "Admin Panel",
    logout: "Logout",
    youAreBanned: "You Are Banned",
    accountSuspended: "Your account has been suspended by the administrator.",

    // Calculator Form
    tradingProfitCalculator: "MT Smart Calculator",
    calculateTradingProfits: "Calculate your trading profits with advanced analytics",
    basicSetup: "Basic Setup",
    riskParameters: "Risk Parameters",
    advancedOptions: "Advanced Options",
    timePeriod: "Time Period",
    stepOf: "Step {current} of {total}",
    percentComplete: "{percent}% Complete",

    // Step descriptions
    configureBasicSetup: "Configure your trading currency and initial capital",
    setRiskParameters: "Set your risk management and performance parameters",
    optionalStopLoss: "Optional stop loss and daily trading limits",
    defineTimePeriod: "Define your trading period and frequency",

    // Form fields
    tradingCurrency: "Trading Currency",
    initialCapital: "Initial Capital",
    riskPerTrade: "Risk Per Trade (%)",
    winRate: "Win Rate (%)",
    riskRewardRatio: "Risk:Reward Ratio",
    selectRatio: "Select ratio",
    enableStopLoss: "Enable Stop Loss",
    addStopLossCalculations: "Add stop loss calculations to your trades",
    percentage: "Percentage",
    fixedAmount: "Fixed Amount",
    limitDailyTrades: "Limit Daily Trades",
    setMaximumTrades: "Set maximum trades per day",
    tradingDaysPerWeek: "Trading Days per Week",
    selectTradingDays: "Select trading days",
    startDate: "Start Date",
    endDate: "End Date",

    // Currency options
    addCustomCurrency: "Add Custom Currency",

    // Trading days
    oneDay: "1 Day",
    twoDays: "2 Days",
    threeDays: "3 Days",
    fourDays: "4 Days",
    fiveDaysWeekdays: "5 Days (Weekdays)",
    sixDays: "6 Days",
    sevenDaysFullWeek: "7 Days (Full Week)",

    // Buttons
    previous: "Previous",
    next: "Next",
    reset: "Reset",
    calculate: "Calculate",

    // Results
    tradingResults: "Trading Results",
    viewTradingPerformance: "View your trading performance and analytics",
    runCalculationToSeeResults: "Run a calculation to see results here",

    // Export
    exportSuccessful: "Export Successful",
    tradingResultsExported: "Trading results exported to CSV file",
    printReady: "Print Ready",
    tradingResultsPrepared: "Trading results prepared for printing",
    pdfExport: "PDF Export",
    pdfExportFunctionality: "PDF export functionality would be implemented with jsPDF library",

    // Report headers
    tradingResultsReport: "Trading Results Report",
    generatedOn: "Generated on",
    netProfit: "Net Profit",
    totalReturn: "Total Return",
    totalTrades: "Total Trades",
    metric: "Metric",
    value: "Value",
    finalCapital: "Final Capital",
    returnPercentage: "Return Percentage",
    winningTrades: "Winning Trades",
    losingTrades: "Losing Trades",

    // Owner info
    tradingCalculatorOwner: "MT Smart Calculator Owner :",

    // Navigation & Tabs
    binary: "Binary",
    forex: "Forex",
    plSheet: "P/L Sheet",
    language: "Language",

    // Forex Calculator Options
    pipCalculator: "Pip Calculator",
    forexMarketHour: "Forex Market Hour",
    smartForexCalculator: "Smart Forex Calculator",
    fxMoneyManage: "Fx Money Manage",
    advancedTradingCalculations: "Advanced trading calculations with AI-powered insights",
    beforeTradeForexManagement: "Before Trade In Forex Management You're Money First",
    start: "Start",
    result: "Result",
    available: "Available",

    // Common UI Elements
    loading: "Loading...",
    clickHereToSeeResult: "Click here to see result",
    noResultsAvailable: "No Results Available",
    pleaseRunCalculationFirst: "Please run a calculation first to see results",
    doBinaryCalculator: "Do Binary Calculator",
    navigationError: "Navigation Error",
    unableToNavigate: "Unable to navigate. Please try again.",

    // FX Money Manager
    fxMoneyManager: "FX Money Manager",
    interestType: "Interest Type",
    tradeLimits: "Trade Limits",
    stopLoss: "Stop Loss",
    reportType: "Report Type",
    dateSelection: "Date Selection",

    // Trade Limits Options
    dailyTrade: "Daily Trade",
    winRateOption: "Win Rate",
    perTradeLot: "Per Trade Lot",
    enableDailyTrade: "Enable Daily Trade",
    enableWinRate: "Enable Win Rate",
    enablePerTradeLot: "Enable Per Trade Lot",

    // Date Selection Options
    manualDate: "Manual Date",
    calendarDate: "Calendar Date",
    years: "Years",
    months: "Months",
    days: "Days",

    // Results & Sheets
    createSheet: "Create Sheet",
    sheetCreated: "Sheet Created",
    plSheetCreatedDescription: "P/L Sheet has been created with your calculation results",
    comprehensiveTradingBreakdown: "Comprehensive Trading Breakdown",
    youreSheetCreateAlert: "You're Sheet Create On Your Fx Result, You Can Edit Losses",

    // Common Messages
    back: "Back",
    continue: "Continue",
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    confirm: "Confirm",

    // Error Messages
    errorOccurred: "An error occurred",
    tryAgain: "Please try again",
    invalidInput: "Invalid input",
    requiredField: "This field is required",
  },
  bn: {
    // Authentication & Basic
    activationTitle: "ট্রেডিং ক্যালকুলেটর অ্যাক্সেস",
    activationSubtitle: "চালিয়ে যেতে আপনার অ্যাক্টিভেশন কী লিখুন",
    activationKey: "অ্যাক্টিভেশন কী",
    username: "ব্যবহারকারীর নাম",
    login: "লগইন",
    invalidKey: "অবৈধ অ্যাক্টিভেশন কী",
    userBanned: "ব্যবহারকারী নিষিদ্ধ",
    connectionError: "সংযোগ ত্রুটি",
    welcome: "ট্রেডিং ক্যালকুলেটরে স্বাগতম",
    calculator: "ক্যালকুলেটর",
    results: "ফলাফল",
    admin: "অ্যাডমিন প্যানেল",
    logout: "লগআউট",
    youAreBanned: "আপনি নিষিদ্ধ",
    accountSuspended: "আপনার অ্যাকাউন্ট প্রশাসক দ্বারা স্থগিত করা হয়েছে।",

    // Calculator Form
    tradingProfitCalculator: "এমটি স্মার্ট ক্যালকুলেটর",
    calculateTradingProfits: "উন্নত বিশ্লেষণ সহ আপনার ট্রেডিং লাভ গণনা করুন",
    basicSetup: "মৌলিক সেটআপ",
    riskParameters: "ঝুঁকি পরামিতি",
    advancedOptions: "উন্নত বিকল্প",
    timePeriod: "সময়কাল",
    stepOf: "ধাপ {current} এর {total}",
    percentComplete: "{percent}% সম্পূর্ণ",

    // Step descriptions
    configureBasicSetup: "আপনার ট্রেডিং মুদ্রা এবং প্রাথমিক পুঁজি কনফিগার করুন",
    setRiskParameters: "আপনার ঝুঁকি ব্যবস্থাপনা এবং কর্মক্ষমতা পরামিতি সেট করুন",
    optionalStopLoss: "ঐচ্ছিক স্টপ লস এবং দৈনিক ট্রেডিং সীমা",
    defineTimePeriod: "আপনার ট্রেডিং সময়কাল এবং ফ্রিকোয়েন্সি নির্ধারণ করুন",

    // Form fields
    tradingCurrency: "ট্রেডিং মুদ্রা",
    initialCapital: "প্রাথমিক পুঁজি",
    riskPerTrade: "প্রতি ট্রেডে ঝুঁকি (%)",
    winRate: "জয়ের হার (%)",
    riskRewardRatio: "ঝুঁকি:পুরস্কার অনুপাত",
    selectRatio: "অনুপাত নির্বাচন করুন",
    enableStopLoss: "স্টপ লস সক্রিয় করুন",
    addStopLossCalculations: "আপনার ট্রেডে স্টপ লস গণনা যোগ করুন",
    percentage: "শতাংশ",
    fixedAmount: "নির্দিষ্ট পরিমাণ",
    limitDailyTrades: "দৈনিক ট্রেড সীমিত করুন",
    setMaximumTrades: "প্রতিদিন সর্বোচ্চ ট্রেড সেট করুন",
    tradingDaysPerWeek: "সপ্তাহে ট্রেডিং দিন",
    selectTradingDays: "ট্রেডিং দিন নির্বাচন করুন",
    startDate: "শুরুর তারিখ",
    endDate: "শেষ তারিখ",

    // Currency options
    addCustomCurrency: "কাস্টম মুদ্রা যোগ করুন",

    // Trading days
    oneDay: "১ দিন",
    twoDays: "২ দিন",
    threeDays: "৩ দিন",
    fourDays: "৪ দিন",
    fiveDaysWeekdays: "৫ দিন (সপ্তাহের দিন)",
    sixDays: "৬ দিন",
    sevenDaysFullWeek: "৭ দিন (পূর্ণ সপ্তাহ)",

    // Buttons
    previous: "পূর্ববর্তী",
    next: "পরবর্তী",
    reset: "রিসেট",
    calculate: "গণনা করুন",

    // Results
    tradingResults: "ট্রেডিং ফলাফল",
    viewTradingPerformance: "আপনার ট্রেডিং কর্মক্ষমতা এবং বিশ্লেষণ দেখুন",
    runCalculationToSeeResults: "এখানে ফলাফল দেখতে একটি গণনা চালান",

    // Export
    exportSuccessful: "রপ্তানি সফল",
    tradingResultsExported: "ট্রেডিং ফলাফল CSV ফাইলে রপ্তানি করা হয়েছে",
    printReady: "প্রিন্ট প্রস্তুত",
    tradingResultsPrepared: "ট্রেডিং ফলাফল প্রিন্টের জন্য প্রস্তুত",
    pdfExport: "PDF রপ্তানি",
    pdfExportFunctionality: "PDF রপ্তানি কার্যকারিতা jsPDF লাইব্রেরি দিয়ে বাস্তবায়িত হবে",

    // Report headers
    tradingResultsReport: "ট্রেডিং ফলাফল রিপোর্ট",
    generatedOn: "তৈরি হয়েছে",
    netProfit: "নেট লাভ",
    totalReturn: "মোট রিটার্ন",
    totalTrades: "মোট ট্রেড",
    metric: "মেট্রিক",
    value: "মান",
    finalCapital: "চূড়ান্ত পুঁজি",
    returnPercentage: "রিটার্ন শতাংশ",
    winningTrades: "জয়ী ট্রেড",
    losingTrades: "হারানো ট্রেড",

    // Owner info
    tradingCalculatorOwner: "এমটি স্মার্ট ক্যালকুলেটর মালিক :",

    // Navigation & Tabs
    binary: "বাইনারি",
    forex: "ফরেক্স",
    plSheet: "P/L শিট",
    language: "ভাষা",

    // Forex Calculator Options
    pipCalculator: "পিপ ক্যালকুলেটর",
    forexMarketHour: "ফরেক্স মার্কেট আওয়ার",
    smartForexCalculator: "স্মার্ট ফরেক্স ক্যালকুলেটর",
    fxMoneyManage: "এফএক্স মানি ম্যানেজ",
    advancedTradingCalculations: "AI-চালিত অন্তর্দৃষ্টি সহ উন্নত ট্রেডিং গণনা",
    beforeTradeForexManagement: "ফরেক্স ম্যানেজমেন্টে ট্রেড করার আগে প্রথমে আপনার অর্থ",
    start: "শুরু",
    result: "ফলাফল",
    available: "উপলব্ধ",

    // Common UI Elements
    loading: "লোড হচ্ছে...",
    clickHereToSeeResult: "ফলাফল দেখতে এখানে ক্লিক করুন",
    noResultsAvailable: "কোন ফলাফল উপলব্ধ নেই",
    pleaseRunCalculationFirst: "প্রথমে একটি গণনা চালান ফলাফল দেখতে",
    doBinaryCalculator: "বাইনারি ক্যালকুলেটর করুন",
    navigationError: "নেভিগেশন ত্রুটি",
    unableToNavigate: "নেভিগেট করতে অক্ষম। আবার চেষ্টা করুন।",

    // FX Money Manager
    fxMoneyManager: "এফএক্স মানি ম্যানেজার",
    interestType: "সুদের ধরন",
    tradeLimits: "ট্রেড সীমা",
    stopLoss: "স্টপ লস",
    reportType: "রিপোর্টের ধরন",
    dateSelection: "তারিখ নির্বাচন",

    // Trade Limits Options
    dailyTrade: "দৈনিক ট্রেড",
    winRateOption: "জয়ের হার",
    perTradeLot: "প্রতি ট্রেড লট",
    enableDailyTrade: "দৈনিক ট্রেড সক্রিয় করুন",
    enableWinRate: "জয়ের হার সক্রিয় করুন",
    enablePerTradeLot: "প্রতি ট্রেড লট সক্রিয় করুন",

    // Date Selection Options
    manualDate: "ম্যানুয়াল তারিখ",
    calendarDate: "ক্যালেন্ডার তারিখ",
    years: "বছর",
    months: "মাস",
    days: "দিন",

    // Results & Sheets
    createSheet: "শিট তৈরি করুন",
    sheetCreated: "শিট তৈরি হয়েছে",
    plSheetCreatedDescription: "আপনার গণনার ফলাফল সহ P/L শিট তৈরি করা হয়েছে",
    comprehensiveTradingBreakdown: "ব্যাপক ট্রেডিং ব্রেকডাউন",
    youreSheetCreateAlert: "আপনার এফএক্স ফলাফলে শিট তৈরি হয়েছে, আপনি ক্ষতি সম্পাদনা করতে পারেন",

    // Common Messages
    back: "পিছনে",
    continue: "চালিয়ে যান",
    save: "সংরক্ষণ",
    cancel: "বাতিল",
    edit: "সম্পাদনা",
    delete: "মুছুন",
    confirm: "নিশ্চিত করুন",

    // Error Messages
    errorOccurred: "একটি ত্রুটি ঘটেছে",
    tryAgain: "আবার চেষ্টা করুন",
    invalidInput: "অবৈধ ইনপুট",
    requiredField: "এই ক্ষেত্রটি প্রয়োজনীয়",
  },
  hi: {
    // Authentication & Basic
    activationTitle: "ट्रेडिंग कैलकुलेटर एक्सेस",
    activationSubtitle: "जारी रखने के लिए अपनी एक्टिवेशन की दर्ज करें",
    activationKey: "एक्टिवेशन की",
    username: "उपयोगकर्ता नाम",
    login: "लॉगिन",
    invalidKey: "अमान्य एक्टिवेशन की",
    userBanned: "उपयोगकर्ता प्रतिबंधित है",
    connectionError: "कनेक्शन त्रुटि",
    welcome: "ट्रेडिंग कैलकुलेटर में आपका स्वागत है",
    calculator: "कैलकुलेटर",
    results: "परिणाम",
    admin: "एडमिन पैनल",
    logout: "लॉगआउट",
    youAreBanned: "आप प्रतिबंधित हैं",
    accountSuspended: "आपका खाता प्रशासक द्वारा निलंबित कर दिया गया है।",

    // Calculator Form
    tradingProfitCalculator: "एमटी स्मार्ट कैलकुलेटर",
    calculateTradingProfits: "उन्नत विश्लेषण के साथ अपने ट्रेडिंग मुनाफे की गणना करें",
    basicSetup: "बुनियादी सेटअप",
    riskParameters: "जोखिम पैरामीटर",
    advancedOptions: "उन्नत विकल्प",
    timePeriod: "समय अवधि",
    stepOf: "चरण {current} का {total}",
    percentComplete: "{percent}% पूर्ण",

    // Step descriptions
    configureBasicSetup: "अपनी ट्रेडिंग मुद्रा और प्रारंभिक पूंजी कॉन्फ़िगर करें",
    setRiskParameters: "अपने जोखिम प्रबंधन और प्रदर्शन पैरामीटर सेट करें",
    optionalStopLoss: "वैकल्पिक स्टॉप लॉस और दैनिक ट्रेडिंग सीमा",
    defineTimePeriod: "अपनी ट्रेडिंग अवधि और आवृत्ति परिभाषित करें",

    // Form fields
    tradingCurrency: "ट्रेडिंग मुद्रा",
    initialCapital: "प्रारंभिक पूंजी",
    riskPerTrade: "प्रति ट्रेड जोखिम (%)",
    winRate: "जीत दर (%)",
    riskRewardRatio: "जोखिम:पुरस्कार अनुपात",
    selectRatio: "अनुपात चुनें",
    enableStopLoss: "स्टॉप लॉस सक्षम करें",
    addStopLossCalculations: "अपने ट्रेड में स्टॉप लॉस गणना जोड़ें",
    percentage: "प्रतिशत",
    fixedAmount: "निश्चित राशि",
    limitDailyTrades: "दैनिक ट्रेड सीमित करें",
    setMaximumTrades: "प्रति दिन अधिकतम ट्रेड सेट करें",
    tradingDaysPerWeek: "सप्ताह में ट्रेडिंग दिन",
    selectTradingDays: "ट्रेडिंग दिन चुनें",
    startDate: "प्रारंभ तिथि",
    endDate: "समाप्ति तिथि",

    // Currency options
    addCustomCurrency: "कस्टम मुद्रा जोड़ें",

    // Trading days
    oneDay: "1 दिन",
    twoDays: "2 दिन",
    threeDays: "3 दिन",
    fourDays: "4 दिन",
    fiveDaysWeekdays: "5 दिन (सप्ताह के दिन)",
    sixDays: "6 दिन",
    sevenDaysFullWeek: "7 दिन (पूरा सप्ताह)",

    // Buttons
    previous: "पिछला",
    next: "अगला",
    reset: "रीसेट",
    calculate: "गणना करें",

    // Results
    tradingResults: "ट्रेडिंग परिणाम",
    viewTradingPerformance: "अपने ट्रेडिंग प्रदर्शन और विश्लेषण देखें",
    runCalculationToSeeResults: "यहाँ परिणाम देखने के लिए एक गणना चलाएं",

    // Export
    exportSuccessful: "निर्यात सफल",
    tradingResultsExported: "ट्रेडिंग परिणाम CSV फ़ाइल में निर्यात किए गए",
    printReady: "प्रिंट तैयार",
    tradingResultsPrepared: "ट्रेडिंग परिणाम प्रिंटिंग के लिए तैयार",
    pdfExport: "PDF निर्यात",
    pdfExportFunctionality: "PDF निर्यात कार्यकारिता jsPDF लाइब्रेरी के साथ लागू की जाएगी",

    // Report headers
    tradingResultsReport: "ट्रेडिंग परिणाम रिपोर्ट",
    generatedOn: "पर उत्पन्न",
    netProfit: "शुद्ध लाभ",
    totalReturn: "कुल रिटर्न",
    totalTrades: "कुल ट्रेड",
    metric: "मेट्रिक",
    value: "मान",
    finalCapital: "अंतिम पूंजी",
    returnPercentage: "रिटर्न प्रतिशत",
    winningTrades: "जीतने वाले ट्रेड",
    losingTrades: "हारने वाले ट्रेड",

    // Owner info
    tradingCalculatorOwner: "एमटी स्मार्ट कैलकुलेटर मालिक :",

    // Navigation & Tabs
    binary: "बाइनरी",
    forex: "फॉरेक्स",
    plSheet: "P/L शीट",
    language: "भाषा",

    // Forex Calculator Options
    pipCalculator: "पिप कैलकुलेटर",
    forexMarketHour: "फॉरेक्स मार्केट आवर",
    smartForexCalculator: "स्मार्ट फॉरेक्स कैलकुलेटर",
    fxMoneyManage: "एफएक्स मनी मैनेज",
    advancedTradingCalculations: "AI-संचालित अंतर्दृष्टि के साथ उन्नत ट्रेडिंग गणना",
    beforeTradeForexManagement: "फॉरेक्स प्रबंधन में व्यापार से पहले पहले अपना पैसा",
    start: "शुरू करें",
    result: "परिणाम",
    available: "उपलब्ध",

    // Common UI Elements
    loading: "लोड हो रहा है...",
    clickHereToSeeResult: "परिणाम देखने के लिए यहाँ क्लिक करें",
    noResultsAvailable: "कोई परिणाम उपलब्ध नहीं",
    pleaseRunCalculationFirst: "परिणाम देखने के लिए पहले एक गणना चलाएं",
    doBinaryCalculator: "बाइनरी कैलकुलेटर करें",
    navigationError: "नेवीगेशन त्रुटि",
    unableToNavigate: "नेवीगेट करने में असमर्थ। कृपया पुनः प्रयास करें।",

    // FX Money Manager
    fxMoneyManager: "एफएक्स मनी मैनेजर",
    interestType: "ब्याज प्रकार",
    tradeLimits: "ट्रेड सीमा",
    stopLoss: "स्टॉप लॉस",
    reportType: "रिपोर्ट प्रकार",
    dateSelection: "तारीख चयन",

    // Trade Limits Options
    dailyTrade: "दैनिक ट्रेड",
    winRateOption: "जीत दर",
    perTradeLot: "प्रति ट्रेड लॉट",
    enableDailyTrade: "दैनिक ट्रेड सक्षम करें",
    enableWinRate: "जीत दर सक्षम करें",
    enablePerTradeLot: "प्रति ट्रेड लॉट सक्षम करें",

    // Date Selection Options
    manualDate: "मैनुअल तारीख",
    calendarDate: "कैलेंडर तारीख",
    years: "वर्ष",
    months: "महीने",
    days: "दिन",

    // Results & Sheets
    createSheet: "शीट बनाएं",
    sheetCreated: "शीट बनाई गई",
    plSheetCreatedDescription: "आपके गणना परिणामों के साथ P/L शीट बनाई गई है",
    comprehensiveTradingBreakdown: "व्यापक ट्रेडिंग ब्रेकडाउन",
    youreSheetCreateAlert: "आपके एफएक्स परिणाम पर शीट बनाई गई है, आप नुकसान संपादित कर सकते हैं",

    // Common Messages
    back: "वापस",
    continue: "जारी रखें",
    save: "सहेजें",
    cancel: "रद्द करें",
    edit: "संपादित करें",
    delete: "हटाएं",
    confirm: "पुष्टि करें",

    // Error Messages
    errorOccurred: "एक त्रुटि हुई",
    tryAgain: "कृपया पुनः प्रयास करें",
    invalidInput: "अमान्य इनपुट",
    requiredField: "यह फ़ील्ड आवश्यक है",
  },
}

export const useTranslation = (language: string) => {
  return translations[language as keyof typeof translations] || translations.en
}
