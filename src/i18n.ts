import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Navigation
      home: "Home",
      browseEvents: "Browse Events",
      contactUs: "Contact Us",
      login: "Login",
      signUp: "Sign Up",
      logout: "Logout",
      
      // Common
      loading: "Loading...",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      
      // Events
      upcomingEvents: "Upcoming Events",
      noEventsFound: "No events found",
      ticketsLeft: "tickets left",
      buyTicket: "Buy Ticket",
      soldOut: "Sold Out",
      share: "Share",
      
      // Profile
      profile: "Profile",
      myTickets: "My Tickets",
      dashboard: "Dashboard",
      createEvent: "Create Event",
      analytics: "Analytics",
      
      // Forms
      name: "Name",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
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
      
      // Messages
      welcomeBack: "Welcome back!",
      registrationSuccessful: "Registration successful! Please login.",
      paymentSuccessful: "Payment successful!",
      eventCreated: "Event created successfully!",
      eventDeleted: "Event deleted successfully",
      
      // Footer
      product: "Product",
      company: "Company",
      legal: "Legal",
      support: "Support",
      builtBy: "Built with ❤️ by Alaya Ibrahim @ AltSchool Africa"
    }
  },
  ha: {
    translation: {
      // Navigation
      home: "Gida",
      browseEvents: "Bincika Abubuwan",
      contactUs: "Tuntube Mu",
      login: "Shiga",
      signUp: "Rajista",
      logout: "Fita",
      
      // Common
      loading: "Ana lodin...",
      save: "Ajiye",
      cancel: "Soke",
      delete: "Share",
      edit: "Gyara",
      
      // Events
      upcomingEvents: "Abubuwan Masu Zuwa",
      noEventsFound: "Ba a sami abubuwan ba",
      ticketsLeft: "tikiti suka rage",
      buyTicket: "Sayi Tikiti",
      soldOut: "An Sayar Duka",
      share: "Raba",
      
      // Profile
      profile: "Bayanan Kai",
      myTickets: "Tikitina",
      dashboard: "Dashboard",
      createEvent: "Ƙirƙiri Taron",
      analytics: "Bincike",
      
      // Forms
      name: "Suna",
      email: "Imel",
      password: "Kalmar Sirri",
      confirmPassword: "Tabbatar Kalmar Sirri",
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
      
      // Messages
      welcomeBack: "Barka da dawowa!",
      registrationSuccessful: "An yi rajista cikin nasara! Da fatan za a shiga.",
      paymentSuccessful: "Biyan kuɗi ya yi nasara!",
      eventCreated: "An ƙirƙiri taron cikin nasara!",
      eventDeleted: "An share taron cikin nasara",
      
      // Footer
      product: "Samfur",
      company: "Kamfani",
      legal: "Doka",
      support: "Taimako",
      builtBy: "An gina shi da ❤️ ta Alaya Ibrahim @ AltSchool Africa"
    }
  },
  yo: {
    translation: {
      // Navigation
      home: "Ile",
      browseEvents: "Ṣawari Awọn Iṣẹlẹ",
      contactUs: "Kan si Wa",
      login: "Wọle",
      signUp: "Forukọsilẹ",
      logout: "Jade",
      
      // Common
      loading: "Ń gbéwọlé...",
      save: "Fipamọ",
      cancel: "Fagilee",
      delete: "Paarẹ",
      edit: "Ṣatunkọ",
      
      // Events
      upcomingEvents: "Awọn Iṣẹlẹ ti n Bọ",
      noEventsFound: "Ko ri awọn iṣẹlẹ",
      ticketsLeft: "tiketi ti o ku",
      buyTicket: "Ra Tiketi",
      soldOut: "Ti Ta Tan",
      share: "Pin",
      
      // Profile
      profile: "Profaili",
      myTickets: "Awọn Tiketi Mi",
      dashboard: "Dashibọọdu",
      createEvent: "Ṣẹda Iṣẹlẹ",
      analytics: "Itupalẹ",
      
      // Forms
      name: "Orukọ",
      email: "Imeeli",
      password: "Ọrọigbaniwọle",
      confirmPassword: "Jẹrisi Ọrọigbaniwọle",
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
      
      // Messages
      welcomeBack: "Kaabo!",
      registrationSuccessful: "Iforukọsilẹ ṣaṣeyọri! Jọwọ wọle.",
      paymentSuccessful: "Isanwo ṣaṣeyọri!",
      eventCreated: "Ṣẹda iṣẹlẹ ni ifijiṣẹ!",
      eventDeleted: "Paarẹ iṣẹlẹ ni ifijiṣẹ",
      
      // Footer
      product: "Ọja",
      company: "Ile-iṣẹ",
      legal: "Ofin",
      support: "Atilẹyin",
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