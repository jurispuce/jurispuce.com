/**
 * Cookie Consent Management
 * Handles user consent for cookies and manages analytics/marketing scripts
 */

class CookieConsent {
    constructor() {
        this.consentKey = 'cookie_consent_settings';
        this.consentBanner = null;
        this.settings = {
            necessary: true, // Always required
            preferences: false,
            analytics: false,
            marketing: false
        };
        
        this.init();
    }
    
    init() {
        // Try to load saved consent settings
        this.loadSavedSettings();
        
        // Create and display the consent banner if no consent has been given
        if (!this.hasConsent()) {
            this.createConsentBanner();
        } else {
            // If consent was already given, load the appropriate scripts
            this.loadConsentedScripts();
        }
        
        // Add event listener for the "Manage Cookies" link in the footer
        document.addEventListener('DOMContentLoaded', () => {
            const manageCookiesLink = document.getElementById('manage-cookies-link');
            if (manageCookiesLink) {
                manageCookiesLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showConsentBanner();
                });
            }
        });
    }
    
    loadSavedSettings() {
        const savedSettings = localStorage.getItem(this.consentKey);
        if (savedSettings) {
            try {
                const parsedSettings = JSON.parse(savedSettings);
                this.settings = { ...this.settings, ...parsedSettings };
            } catch (e) {
                console.error('Error parsing saved cookie settings:', e);
            }
        }
    }
    
    hasConsent() {
        return localStorage.getItem(this.consentKey) !== null;
    }
    
    saveSettings() {
        localStorage.setItem(this.consentKey, JSON.stringify(this.settings));
        this.loadConsentedScripts();
    }
    
    createConsentBanner() {
        // Create the banner element
        this.consentBanner = document.createElement('div');
        this.consentBanner.className = 'cookie-consent-banner';
        this.consentBanner.innerHTML = `
            <div class="cookie-consent-container">
                <div class="cookie-consent-content">
                    <h3>Cookie Consent</h3>
                    <p>We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.</p>
                    
                    <div class="cookie-settings-panel">
                        <div class="cookie-setting">
                            <label>
                                <input type="checkbox" name="necessary" checked disabled>
                                <span>Necessary</span>
                            </label>
                            <p>Essential cookies enable core functionality. The website cannot function properly without these cookies.</p>
                        </div>
                        
                        <div class="cookie-setting">
                            <label>
                                <input type="checkbox" name="preferences" ${this.settings.preferences ? 'checked' : ''}>
                                <span>Preferences</span>
                            </label>
                            <p>Preference cookies enable the website to remember information that changes the way the website behaves or looks.</p>
                        </div>
                        
                        <div class="cookie-setting">
                            <label>
                                <input type="checkbox" name="analytics" ${this.settings.analytics ? 'checked' : ''}>
                                <span>Analytics</span>
                            </label>
                            <p>Analytics cookies help us understand how visitors interact with our website. We use Google Analytics.</p>
                        </div>
                        
                        <div class="cookie-setting">
                            <label>
                                <input type="checkbox" name="marketing" ${this.settings.marketing ? 'checked' : ''}>
                                <span>Marketing</span>
                            </label>
                            <p>Marketing cookies are used to track visitors across websites. We use HubSpot for marketing purposes.</p>
                        </div>
                    </div>
                </div>
                
                <div class="cookie-consent-actions">
                    <button class="btn btn-outline" id="cookie-accept-necessary">Accept Necessary</button>
                    <button class="btn btn-primary" id="cookie-accept-all">Accept All</button>
                    <button class="btn btn-secondary" id="cookie-save-preferences">Save Preferences</button>
                </div>
                
                <a href="/privacy-policy" class="cookie-policy-link">View our Privacy Policy</a>
            </div>
        `;
        
        document.body.appendChild(this.consentBanner);
        
        // Add event listeners to the buttons
        this.consentBanner.querySelector('#cookie-accept-necessary').addEventListener('click', () => {
            this.settings = { necessary: true, preferences: false, analytics: false, marketing: false };
            this.saveSettings();
            this.hideConsentBanner();
        });
        
        this.consentBanner.querySelector('#cookie-accept-all').addEventListener('click', () => {
            this.settings = { necessary: true, preferences: true, analytics: true, marketing: true };
            this.saveSettings();
            this.hideConsentBanner();
        });
        
        this.consentBanner.querySelector('#cookie-save-preferences').addEventListener('click', () => {
            // Update settings based on checkbox values
            const checkboxes = this.consentBanner.querySelectorAll('.cookie-setting input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                if (checkbox.name !== 'necessary') { // Necessary is always true
                    this.settings[checkbox.name] = checkbox.checked;
                }
            });
            
            this.saveSettings();
            this.hideConsentBanner();
        });
    }
    
    showConsentBanner() {
        if (!this.consentBanner) {
            this.createConsentBanner();
        } else {
            // Update checkbox states to match current settings
            const checkboxes = this.consentBanner.querySelectorAll('.cookie-setting input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                if (checkbox.name !== 'necessary') {
                    checkbox.checked = this.settings[checkbox.name];
                }
            });
            
            this.consentBanner.style.display = 'block';
        }
    }
    
    hideConsentBanner() {
        if (this.consentBanner) {
            this.consentBanner.style.display = 'none';
        }
    }
    
    loadConsentedScripts() {
        // Load Google Analytics if analytics consent is given
        if (this.settings.analytics) {
            this.loadGoogleAnalytics();
        }
        
        // Load HubSpot if marketing consent is given
        if (this.settings.marketing) {
            this.loadHubSpot();
        }
    }
    
    loadGoogleAnalytics() {
        // Enable Google Analytics by setting the consent parameter
        if (window.gtag) {
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        } else {
            // If Google Analytics isn't loaded yet (unlikely with our implementation), we'll enable it
            // Add Google Analytics script
            const gaScript = document.createElement('script');
            gaScript.async = true;
            gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-JXNC3QP8DW';
            document.head.appendChild(gaScript);
            
            window.dataLayer = window.dataLayer || [];
            function gtag() { dataLayer.push(arguments); }
            gtag('js', new Date());
            gtag('config', 'G-JXNC3QP8DW');
        }
    }
    
    loadHubSpot() {
        // Check if HubSpot is already loaded
        if (window._hsq) return;
        
        // Add HubSpot script
        const hsScript = document.createElement('script');
        hsScript.async = true;
        hsScript.src = '//js.hs-scripts.com/HUBSPOT_ID.js'; // Replace with your actual HubSpot ID
        document.head.appendChild(hsScript);
    }
}

// Initialize cookie consent when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Set default consent mode to denied for analytics
    if (window.gtag) {
        gtag('consent', 'default', {
            'analytics_storage': 'denied'
        });
    }
    
    window.cookieConsent = new CookieConsent();
});
