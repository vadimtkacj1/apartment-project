import { defineMessages } from '@/lib/adminI18n';

/** Admin homepage content manager: section titles editor + displayed-properties picker. */
export const homepageMessages = defineMessages({
  he: {
    pageTitle: 'ניהול עמוד הבית',
    pageSubtitle: 'ערוך כותרות וניהול נכסים מוצגים בדף הבית',

    // Section titles editor
    sectionTitlesCard: 'עריכת כותרות סעיפים',
    tabMain: 'סעיפים ראשיים',
    tabSecondary: 'סעיפים נוספים',
    labelHotTitle: 'כותרת: הצעות חמות',
    labelFeaturedTitle: 'כותרת: נכסים נבחרים',
    labelFeaturedSubtitle: 'תת-כותרת: נכסים נבחרים',
    labelValuesTitle: 'כותרת: למה לבחור בנו?',
    labelAboutTitle: 'כותרת: אודות',
    labelProcessTitle: 'כותרת: מה חשוב לדעת',
    labelTestimonialsTitle: 'כותרת: מה הלקוחות אומרים',
    labelNoCommissionTitle: 'כותרת: דירה ללא עמלה',
    phHotTitle: 'הצעות חמות',
    phFeaturedTitle: 'נכסים באיזור המרכז',
    phFeaturedSubtitle: 'מגוון דירות למכירה ולהשכרה אטרקטיביות באיזור המרכז',
    phValuesTitle: 'למה לבחור בנו?',
    phAboutTitle: 'אודות',
    phProcessTitle: 'מה חשוב לדעת כשקונים נכס?',
    phTestimonialsTitle: 'מה הלקוחות שלנו אומרים',
    phNoCommissionTitle: 'דירה ללא עמלת תיווך',
    saveTitles: 'שמור כותרות',

    // Feedback messages
    titlesSaved: 'הכותרות נשמרו בהצלחה!',
    unknownError: 'שגיאה לא ידועה',
    titlesSaveError: (error: string) => `שגיאה בשמירת הכותרות: ${error}`,
    propertiesLoadError: 'שגיאה בטעינת הנכסים',
    onlyOneNoCommissionWarning: 'ניתן לבחור רק נכס אחד לדירות ללא עמלה',
    propertiesSelected: 'הנכסים נבחרו בהצלחה',
    propertySelected: 'הנכס נבחר בהצלחה',
    allChangesSaved: 'כל השינויים נשמרו בהצלחה!',
    changesSaveError: 'שגיאה בשמירת השינויים',

    // Displayed-properties manager
    managePropertiesTitle: 'ניהול נכסים מוצגים',
    managePropertiesSubtitle: 'בחר נכסים להצגה בסעיפים שונים בדף הבית',
    savePropertySelection: 'שמור בחירת נכסים',

    // Statistics
    hotDeals: 'הצעות חמות',
    statPropertiesSuffix: 'נכסים',
    statNoCommissionTitle: 'דירות ללא עמלה (מקסימום 1)',
    statPropertySuffix: 'נכס',

    // Hot propositions section
    addProperties: 'הוסף נכסים',
    manualSelection: 'בחירה ידנית',
    priceFilter: 'סינון לפי מחיר',
    maxPricePlaceholder: 'מחיר מקסימלי',
    noPropertiesShown: 'אין נכסים מוצגים',

    // No-commission section
    noCommissionSection: 'דירות ללא עמלה',
    onlyOneNote: 'ניתן לבחור נכס אחד בלבד',
    propertyChosen: 'נבחר נכס',
    chooseProperty: 'בחר נכס',
    noPropertyChosen: 'לא נבחר נכס',

    // Property selector modal
    modalTitleHot: 'בחר נכסים להצעות חמות',
    modalTitleNoCommission: 'בחר נכס אחד ללא עמלה',
    modalNoteOnlyOne: 'שים לב: ניתן לבחור רק נכס אחד',
    ok: 'אישור',
    cancel: 'ביטול',
    selectAll: (selected: number, total: number) => `בחר הכל (${selected}/${total})`,

    // Table / cards
    colImage: 'תמונה',
    colTitle: 'כותרת',
    colLocation: 'מיקום',
    colPrice: 'מחיר',
    colRooms: 'חדרים',
    colArea: 'שטח',
    colActions: 'פעולות',
    propertyAlt: 'נכס',
    rented: 'מושכר',
    sold: 'נמכר',
    areaSqm: (area: number) => `${area} מ"ר`,
    remove: 'הסר',
  },
  en: {
    pageTitle: 'Homepage Management',
    pageSubtitle: 'Edit titles and manage the properties displayed on the homepage',

    // Section titles editor
    sectionTitlesCard: 'Edit Section Titles',
    tabMain: 'Main Sections',
    tabSecondary: 'Additional Sections',
    labelHotTitle: 'Title: Hot Deals',
    labelFeaturedTitle: 'Title: Featured Properties',
    labelFeaturedSubtitle: 'Subtitle: Featured Properties',
    labelValuesTitle: 'Title: Why Choose Us?',
    labelAboutTitle: 'Title: About',
    labelProcessTitle: 'Title: What You Should Know',
    labelTestimonialsTitle: 'Title: What Clients Say',
    labelNoCommissionTitle: 'Title: No-Commission Apartment',
    phHotTitle: 'Hot Deals',
    phFeaturedTitle: 'Properties in Central Israel',
    phFeaturedSubtitle: 'A variety of attractive apartments for sale and rent in Central Israel',
    phValuesTitle: 'Why Choose Us?',
    phAboutTitle: 'About',
    phProcessTitle: 'What should you know when buying a property?',
    phTestimonialsTitle: 'What Our Clients Say',
    phNoCommissionTitle: 'Apartment with No Brokerage Fee',
    saveTitles: 'Save Titles',

    // Feedback messages
    titlesSaved: 'Titles saved successfully!',
    unknownError: 'Unknown error',
    titlesSaveError: (error: string) => `Error saving titles: ${error}`,
    propertiesLoadError: 'Error loading properties',
    onlyOneNoCommissionWarning: 'Only one property can be selected for no-commission apartments',
    propertiesSelected: 'Properties selected successfully',
    propertySelected: 'Property selected successfully',
    allChangesSaved: 'All changes saved successfully!',
    changesSaveError: 'Error saving changes',

    // Displayed-properties manager
    managePropertiesTitle: 'Manage Displayed Properties',
    managePropertiesSubtitle: 'Select properties to display in different homepage sections',
    savePropertySelection: 'Save Property Selection',

    // Statistics
    hotDeals: 'Hot Deals',
    statPropertiesSuffix: 'properties',
    statNoCommissionTitle: 'No-Commission Apartments (max 1)',
    statPropertySuffix: 'property',

    // Hot propositions section
    addProperties: 'Add Properties',
    manualSelection: 'Manual selection',
    priceFilter: 'Filter by price',
    maxPricePlaceholder: 'Maximum price',
    noPropertiesShown: 'No properties displayed',

    // No-commission section
    noCommissionSection: 'No-Commission Apartments',
    onlyOneNote: 'Only one property can be selected',
    propertyChosen: 'Property Selected',
    chooseProperty: 'Select Property',
    noPropertyChosen: 'No property selected',

    // Property selector modal
    modalTitleHot: 'Select Properties for Hot Deals',
    modalTitleNoCommission: 'Select One No-Commission Property',
    modalNoteOnlyOne: 'Note: only one property can be selected',
    ok: 'Confirm',
    cancel: 'Cancel',
    selectAll: (selected: number, total: number) => `Select all (${selected}/${total})`,

    // Table / cards
    colImage: 'Image',
    colTitle: 'Title',
    colLocation: 'Location',
    colPrice: 'Price',
    colRooms: 'Rooms',
    colArea: 'Area',
    colActions: 'Actions',
    propertyAlt: 'Property',
    rented: 'Rented',
    sold: 'Sold',
    areaSqm: (area: number) => `${area} sqm`,
    remove: 'Remove',
  },
});
