import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      home: "Home",
      browseEvents: "Browse Events",
      contactUs: "Contact Us",
      login: "Login",
      signUp: "Sign Up",
      logout: "Logout",
      profile: "Profile",
      myTickets: "My Tickets",
      dashboard: "Dashboard",
      createEvent: "Create Event",
      analytics: "Analytics",
      name: "Name",
      email: "Email",
      password: "Password",
      description: "Description",
      category: "Category",
      date: "Date",
      time: "Time",
      location: "Location",
      venue: "Venue",
      address: "Address",
      city: "City",
      state: "State",
      country: "Country",
      phone: "Phone",
      website: "Website",
      builtBy: "Built with ❤️ by Alaya Ibrahim @ AltSchool Africa"
    }
  },
  ar: {
    translation: {
      home: "الرئيسية",
      browseEvents: "تصفح الفعاليات",
      contactUs: "اتصل بنا",
      login: "تسجيل الدخول",
      signUp: "اشتراك",
      logout: "تسجيل الخروج",
      profile: "الملف الشخصي",
      myTickets: "تذاكري",
      dashboard: "لوحة التحكم",
      createEvent: "إنشاء فعالية",
      analytics: "تحليلات",
      name: "الاسم",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      description: "الوصف",
      category: "الفئة",
      date: "التاريخ",
      time: "الوقت",
      location: "الموقع",
      venue: "المكان",
      address: "العنوان",
      city: "المدينة",
      state: "الولاية",
      country: "البلد",
      phone: "الهاتف",
      website: "الموقع الإلكتروني",
      builtBy: "تم بناؤه بـ ❤️ بواسطة Alaya Ibrahim @ AltSchool Africa"
    }
  },
  fr: {
    translation: {
      home: "Accueil",
      browseEvents: "Parcourir les événements",
      contactUs: "Contactez-nous",
      login: "Connexion",
      signUp: "S'inscrire",
      logout: "Déconnexion",
      profile: "Profil",
      myTickets: "Mes billets",
      dashboard: "Tableau de bord",
      createEvent: "Créer un événement",
      analytics: "Analyses",
      name: "Nom",
      email: "E-mail",
      password: "Mot de passe",
      description: "Description",
      category: "Catégorie",
      date: "Date",
      time: "Heure",
      location: "Lieu",
      venue: "Salle",
      address: "Adresse",
      city: "Ville",
      state: "État",
      country: "Pays",
      phone: "Téléphone",
      website: "Site web",
      builtBy: "Construit avec ❤️ par Alaya Ibrahim @ AltSchool Africa"
    }
  },
  zh: {
    translation: {
      home: "首页",
      browseEvents: "浏览活动",
      contactUs: "联系我们",
      login: "登录",
      signUp: "注册",
      logout: "退出",
      profile: "个人资料",
      myTickets: "我的门票",
      dashboard: "仪表板",
      createEvent: "创建活动",
      analytics: "分析",
      name: "姓名",
      email: "电子邮件",
      password: "密码",
      description: "描述",
      category: "类别",
      date: "日期",
      time: "时间",
      location: "地点",
      venue: "场地",
      address: "地址",
      city: "城市",
      state: "州",
      country: "国家",
      phone: "电话",
      website: "网站",
      builtBy: "由 Alaya Ibrahim @ AltSchool Africa 用 ❤️ 构建"
    }
  },
  ha: {
    translation: {
      home: "Gida",
      browseEvents: "Bincika Abubuwan",
      contactUs: "Tuntube Mu",
      login: "Shiga",
      signUp: "Rajista",
      logout: "Fita",
      profile: "Bayanan Kai",
      myTickets: "Tikitina",
      dashboard: "Dashboard",
      createEvent: "Ƙirƙiri Taron",
      analytics: "Bincike",
      name: "Suna",
      email: "Imel",
      password: "Kalmar Sirri",
      description: "Bayani",
      category: "Rukuni",
      date: "Kwanan",
      time: "Lokaci",
      location: "Wuri",
      venue: "Wurin",
      address: "Adireshi",
      city: "Gari",
      state: "Jiha",
      country: "Ƙasa",
      phone: "Waya",
      website: "Gidan Yanar",
      builtBy: "An gina shi da ❤️ ta Alaya Ibrahim @ AltSchool Africa"
    }
  },
  yo: {
    translation: {
      home: "Ile",
      browseEvents: "Ṣawari Awọn Iṣẹlẹ",
      contactUs: "Kan si Wa",
      login: "Wọle",
      signUp: "Forukọsilẹ",
      logout: "Jade",
      profile: "Profaili",
      myTickets: "Awọn Tiketi Mi",
      dashboard: "Dashibọọdu",
      createEvent: "Ṣẹda Iṣẹlẹ",
      analytics: "Itupalẹ",
      name: "Orukọ",
      email: "Imeeli",
      password: "Ọrọigbaniwọle",
      description: "Apejuwe",
      category: "Ẹka",
      date: "Ọjọ",
      time: "Aago",
      location: "Ibi",
      venue: "Ibi isere",
      address: "Adirẹsi",
      city: "Ilu",
      state: "Ipinle",
      country: "Orilẹ-ede",
      phone: "Foonu",
      website: "Oju opo wẹẹbu",
      builtBy: "Ti a ṣe pẹlu ❤️ nipasẹ Alaya Ibrahim @ AltSchool Africa"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;