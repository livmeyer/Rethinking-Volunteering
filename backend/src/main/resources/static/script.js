/* File: script.js */

// 1. Translation Dictionary
const translations = {
    en: {
        // Header
        nav_login: "Volunteer Login",
        nav_lang: "🌐 English | Deutsch",
        
        // Hero
        hero_title: "How can we help you?",
        hero_subtitle: "Select a category for your appointment",
        
        // Cards
        card_docs_title: "Documents & Registration",
        card_docs_desc: "Government, IDs, Registration",
        card_travel_title: "Tickets & Travel",
        card_travel_desc: "MVV, Deutschlandticket, Parking",
        card_new_title: "New in Munich",
        card_new_desc: "Registration, Integration, Orientation",
        card_general_title: "General Questions",
        card_general_desc: "Other digital assistance",
        
        // Trust Section
        trust_title: "Find help at your convenience",
        trust_text_1: "Your step towards a simplified digital experience",
        trust_text_2: "All volunteers are verified and supported by the City of Munich.",
        trust_badge: "✓ Certified Helpers of the City of Munich",
        
        // // Volunteer Section
        // vol_title: "Want to help others?",
        // vol_desc: "Become a DigiCoach! Help people in Munich with digital questions.",
        // vol_btn: "Become a DigiCoach",
        
        // Footer
        footer_text: "© 2026 City of Munich | BeurocraticHelper Program"
    },
    de: {
        // Header
        nav_login: "Freiwilligen Login",
        nav_lang: "🌐 Deutsch | English",
        
        // Hero
        hero_title: "Wie können wir Ihnen helfen?",
        hero_subtitle: "Wählen Sie eine Kategorie für Ihren Termin",
        
        // Cards
        card_docs_title: "Dokumente & Meldewesen",
        card_docs_desc: "Behörden, Ausweise, Anmeldung",
        card_travel_title: "Tickets & Reisen",
        card_travel_desc: "MVV, Deutschlandticket, Parken",
        card_new_title: "Neu in München",
        card_new_desc: "Registrierung, Integration, Orientierung",
        card_general_title: "Allgemeine Fragen",
        card_general_desc: "Sonstige digitale Unterstützung",
        
        // Trust Section
        trust_title: "Hilfe finden, wann es Ihnen passt",
        trust_text_1: "Ihr Schritt zu einem einfacheren digitalen Erlebnis",
        trust_text_2: "Alle Freiwilligen sind von der Stadt München geprüft und unterstützt",
        trust_badge: "✓ Zertifizierte Helfer der Stadt München",
        
        // // Volunteer Section
        // vol_title: "Möchten Sie anderen helfen?",
        // vol_desc: "Werden Sie DigiCoach! Helfen Sie Menschen in München bei digitalen Fragen.",
        // vol_btn: "DigiCoach werden",
        
        // Footer
        footer_text: "© 2026 Stadt München | BeurocraticHelper Programm"
    }
};

let currentLang = 'en';

function toggleLanguage() {
    // 1. Toggle State
    currentLang = currentLang === 'en' ? 'de' : 'en';
    
    // 2. Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            element.textContent = translations[currentLang][key];
        }
    });
    
    // 3. Update Language Button Text specifically
    // (Optional: if the button itself has a data-i18n tag, this isn't needed, but safe to keep)
    const langBtn = document.querySelector('.language-toggle');
    if(langBtn) langBtn.textContent = translations[currentLang].nav_lang;
}

// --- Keep your existing logic for Modals/Links below ---
// (If you removed modals in favor of separate pages, you can remove the modal functions)

function openLoginModal() {
    // Redirect to new login page
    window.location.href = 'volunteer-login.html';
}

function openSignupModal() {
    // Redirect to new login page (signup section could be handled via query param if desired)
    window.location.href = 'volunteer-login.html';
}
