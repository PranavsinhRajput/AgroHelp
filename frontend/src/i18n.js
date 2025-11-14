import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import hiTranslation from './locales/hi/translation.json';
import mrTranslation from './locales/mr/translation.json';

// Language direction configuration
const languageDirections = {
  en: 'ltr',
  hi: 'ltr',
  mr: 'ltr',
  ar: 'rtl' // Arabic as an example of RTL language
};

// the translations
const resources = {
  en: {
    translation: {
      welcome: 'Welcome',
      dashboard: 'Dashboard',
      home: 'Home',
      disease: 'Disease',
      weather: 'Weather',
      profile: 'Profile',
      logout: 'Logout',
      diseaseDetection: 'Disease Detection',
      uploadImage: 'Upload Image',
      getStarted: 'GET STARTED',
      marketPrice: 'Market Price',
      temperature: 'Temperature',
      humidity: 'Humidity',
      smartAgriculture: 'Smart Agriculture',
      appDescription: 'AgroHelp is a software application that helps farmers manage and optimize their agricultural operations.',
      selectLanguage: 'Select Language',
      weatherPrediction: 'Weather Prediction',
      location: 'Location',
      submit: 'Submit',
      results: 'Results',
      loading: 'Loading...',
      error: 'An error occurred',
      tryAgain: 'Try Again',
      noData: 'No data available',
      about: 'About',
      contact: 'Contact',
      ourMission: 'Our Mission',
      whyChooseUs: 'Why Choose Us',
      contactUs: 'Contact Us',
      sendMessage: 'Send Message',
      yourName: 'Your Name',
      yourEmail: 'Your Email',
      yourMessage: 'Your Message',
      meetOurTeam: 'Meet Our Team',
      contactInformation: 'Contact Information',
      address: 'Address',
      email: 'Email',
      phone: 'Phone',
      empoweringFarmers: 'Empowering farmers with smart technology for sustainable agriculture',
      missionDescription: 'AgroHelp is dedicated to revolutionizing agriculture through innovative technology. We provide farmers with intelligent tools to detect plant diseases early, predict weather patterns, and make informed decisions that lead to healthier crops and better yields.',
      platformDescription: 'Our platform combines cutting-edge AI and machine learning to deliver accurate, real-time insights that help farmers protect their investments and contribute to sustainable farming practices.',
      diseaseDetectionDescription: 'Advanced AI-powered image recognition to identify plant diseases quickly and accurately.',
      weatherForecasting: 'Weather Forecasting',
      weatherForecastingDescription: 'Real-time weather predictions to help you plan farming activities and protect crops.',
      smartAnalytics: 'Smart Analytics',
      smartAnalyticsDescription: 'Data-driven insights to optimize crop management and increase productivity.',
      userFriendly: 'User-friendly interface designed for farmers of all tech levels',
      accuratePredictions: 'Accurate AI-powered predictions backed by extensive research',
      multiLanguageSupport: 'Multi-language support for accessibility',
      regularUpdates: 'Regular updates with latest agricultural insights',
      dedicatedSupport: 'Dedicated support team committed to your success',
      getInTouch: 'Get in touch with our team',
      subject: 'Subject',
      followUs: 'Follow Us',
      windSpeed: 'Wind Speed',
      precipitation: 'Precipitation'
    }
  },
  hi: {
    translation: hiTranslation
  },
  mr: {
    translation: mrTranslation
  }
};

i18n
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next
  .use(initReactI18next)
  // init i18next
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'hi', 'mr'],
    debug: false,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    react: {
      useSuspense: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

// Function to set document direction based on language
export const setDocumentDirection = (language) => {
  document.documentElement.dir = languageDirections[language] || 'ltr';
  document.documentElement.lang = language;
};

export default i18n;