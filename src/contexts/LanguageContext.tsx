import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    home: 'Home',
    hotels: 'Hotels',
    rooms: 'Rooms & Suites',
    myBookings: 'My Bookings',
    dashboard: 'Dashboard',
    admin: 'Admin',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signOut: 'Sign Out',
    welcomeBack: 'Welcome Back',
    createAccount: 'Create Account',
    email: 'Email',
    password: 'Password',
    fullName: 'Full Name',
    phone: 'Phone',
    accountType: 'Account Type',
    guest: 'Guest',
    hotelOwner: 'Hotel Owner',
    luxuryAwaits: 'Luxury Awaits',
    yourPerfectStay: 'Your Perfect Stay',
    discoverHotels: 'Discover exceptional hotels and create unforgettable memories',
    searchHotels: 'Search Hotels',
    city: 'City',
    checkIn: 'Check In',
    checkOut: 'Check Out',
    guests: 'Guests',
    featuredHotels: 'Featured Hotels',
    viewAllHotels: 'View All Hotels',
    viewDetails: 'View Details',
    bookNow: 'Book Now',
    whyChooseHotex: 'Why Choose Hotex',
    secureBooking: 'Secure Booking',
    bestPriceGuarantee: 'Best Price Guarantee',
    support247: '24/7 Support',
    instantConfirmation: 'Instant Confirmation',
    myHotels: 'My Hotels',
    addHotel: 'Add Hotel',
    manageRooms: 'Manage Rooms',
    hotelName: 'Hotel Name',
    description: 'Description',
    address: 'Address',
    country: 'Country',
    starRating: 'Star Rating',
    status: 'Status',
    actions: 'Actions',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    bookingManagement: 'Booking Management',
    userManagement: 'User Management',
    hotelManagement: 'Hotel Management',
    analytics: 'Analytics',
    totalRevenue: 'Total Revenue',
    totalBookings: 'Total Bookings',
    activeHotels: 'Active Hotels',
    totalUsers: 'Total Users',
    pending: 'Pending',
    confirmed: 'Confirmed',
    checkedIn: 'Checked In',
    completed: 'Completed',
    canceled: 'Canceled',
    roomTitle: 'Room Title',
    pricePerNight: 'Price per Night',
    maxGuests: 'Max Guests',
    available: 'Available',
    notAvailable: 'Not Available',
    totalPrice: 'Total Price',
    specialRequests: 'Special Requests',
    bookingDetails: 'Booking Details',
    guestName: 'Guest Name',
    nights: 'nights',
    perNight: 'per night',
    createBooking: 'Create Booking',
    selectRoom: 'Select Room',
    confirmBooking: 'Confirm Booking',
    bookingSuccess: 'Booking confirmed successfully!',
    bookingError: 'Failed to create booking',
    loading: 'Loading...',
    noResults: 'No results found',
    searchPlaceholder: 'Search by hotel name, city, or country...',
    filters: 'Filters',
    sortBy: 'Sort By',
    highestRated: 'Highest Rated',
    nameAZ: 'Name (A-Z)',
    minRating: 'Minimum Rating',
    anyRating: 'Any Rating',
    starCategory: 'Star Category',
    anyCategory: 'Any Category',
    found: 'Found',
    hotel: 'hotel',
    role: 'Role',
    client: 'Client',
    owner: 'Owner',
    createdAt: 'Created At',
    updatedAt: 'Updated At',
  },
  ar: {
    home: 'الرئيسية',
    hotels: 'الفنادق',
    rooms: 'الغرف والأجنحة',
    myBookings: 'حجوزاتي',
    dashboard: 'لوحة التحكم',
    admin: 'المدير',
    signIn: 'تسجيل الدخول',
    signUp: 'إنشاء حساب',
    signOut: 'تسجيل الخروج',
    welcomeBack: 'مرحبا بعودتك',
    createAccount: 'إنشاء حساب',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    fullName: 'الاسم الكامل',
    phone: 'الهاتف',
    accountType: 'نوع الحساب',
    guest: 'ضيف',
    hotelOwner: 'صاحب فندق',
    luxuryAwaits: 'الفخامة بانتظارك',
    yourPerfectStay: 'إقامتك المثالية',
    discoverHotels: 'اكتشف فنادق استثنائية وأنشئ ذكريات لا تنسى',
    searchHotels: 'ابحث عن الفنادق',
    city: 'المدينة',
    checkIn: 'تسجيل الوصول',
    checkOut: 'تسجيل المغادرة',
    guests: 'الضيوف',
    featuredHotels: 'الفنادق المميزة',
    viewAllHotels: 'عرض جميع الفنادق',
    viewDetails: 'عرض التفاصيل',
    bookNow: 'احجز الآن',
    whyChooseHotex: 'لماذا تختار هوتكس',
    secureBooking: 'حجز آمن',
    bestPriceGuarantee: 'ضمان أفضل سعر',
    support247: 'دعم على مدار الساعة',
    instantConfirmation: 'تأكيد فوري',
    myHotels: 'فنادقي',
    addHotel: 'إضافة فندق',
    manageRooms: 'إدارة الغرف',
    hotelName: 'اسم الفندق',
    description: 'الوصف',
    address: 'العنوان',
    country: 'الدولة',
    starRating: 'تصنيف النجوم',
    status: 'الحالة',
    actions: 'الإجراءات',
    edit: 'تعديل',
    delete: 'حذف',
    save: 'حفظ',
    cancel: 'إلغاء',
    bookingManagement: 'إدارة الحجوزات',
    userManagement: 'إدارة المستخدمين',
    hotelManagement: 'إدارة الفنادق',
    analytics: 'التحليلات',
    totalRevenue: 'إجمالي الإيرادات',
    totalBookings: 'إجمالي الحجوزات',
    activeHotels: 'الفنادق النشطة',
    totalUsers: 'إجمالي المستخدمين',
    pending: 'قيد الانتظار',
    confirmed: 'مؤكد',
    checkedIn: 'تم تسجيل الوصول',
    completed: 'مكتمل',
    canceled: 'ملغى',
    roomTitle: 'عنوان الغرفة',
    pricePerNight: 'السعر لكل ليلة',
    maxGuests: 'الحد الأقصى للضيوف',
    available: 'متاح',
    notAvailable: 'غير متاح',
    totalPrice: 'السعر الإجمالي',
    specialRequests: 'الطلبات الخاصة',
    bookingDetails: 'تفاصيل الحجز',
    guestName: 'اسم الضيف',
    nights: 'ليالي',
    perNight: 'لكل ليلة',
    createBooking: 'إنشاء حجز',
    selectRoom: 'اختر غرفة',
    confirmBooking: 'تأكيد الحجز',
    bookingSuccess: 'تم تأكيد الحجز بنجاح!',
    bookingError: 'فشل إنشاء الحجز',
    loading: 'جاري التحميل...',
    noResults: 'لم يتم العثور على نتائج',
    searchPlaceholder: 'ابحث حسب اسم الفندق أو المدينة أو الدولة...',
    filters: 'الفلاتر',
    sortBy: 'ترتيب حسب',
    highestRated: 'الأعلى تقييمًا',
    nameAZ: 'الاسم (أ-ي)',
    minRating: 'الحد الأدنى للتقييم',
    anyRating: 'أي تقييم',
    starCategory: 'فئة النجوم',
    anyCategory: 'أي فئة',
    found: 'تم العثور على',
    hotel: 'فندق',
    role: 'الدور',
    client: 'عميل',
    owner: 'مالك',
    createdAt: 'تاريخ الإنشاء',
    updatedAt: 'تاريخ التحديث',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        dir: language === 'ar' ? 'rtl' : 'ltr',
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
