// src/components/ui/Layout.jsx
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useBackendHealth } from '../../hooks/useBackendHealth.js';
import { BackendBanner } from './BackendBanner.jsx';
import AccessibilityMenu from './AccessibilityMenu.jsx';
import OnboardingTour from '../tour/OnboardingTour.jsx';
import { useOnboardingTour } from '../../hooks/useOnboardingTour.js';

export default function Layout({ children }) {
  const { isHealthy, isChecking } = useBackendHealth();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const tour = useOnboardingTour();

  const navLinks = [
    { to: '/',             label: t('nav.dashboard'),   icon: '📊', tourId: 'nav-dashboard' },
    { to: '/ranking',      label: t('nav.ranking'),     icon: '🏆', tourId: 'nav-ranking' },
    { to: '/map',          label: t('nav.map'),         icon: '🗺️',  tourId: 'nav-map' },
    { to: '/about-sensors',label: t('nav.sensors'),    icon: '📡', tourId: 'nav-sensors' },
    { to: '/about-icaud',  label: t('nav.howItWorks'), icon: '❓', tourId: 'nav-howitworks' },
  ];

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'pt' : 'en');
  };

  // O tour depende de elementos que só existem no Painel (mapa, alertas,
  // ranking). Se disparado de outra página, navega pra "/" primeiro.
  const startTour = () => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(tour.start, 300);
    } else {
      tour.start();
    }
  };

  // Se o tour automático dispara enquanto o usuário não está no Painel
  // (ex: entrou direto por /ranking), leva pra lá também.
  useEffect(() => {
    if (tour.isActive && tour.stepIndex === 0 && location.pathname !== '/') {
      navigate('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tour.isActive]);

  return (
    <div className="min-h-screen bg-gray-50 font-display">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-green-700 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium"
      >
        {t('nav.skipToContent', 'Pular para o conteúdo')}
      </a>

      <BackendBanner isHealthy={isHealthy} isChecking={isChecking} />

      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">🌿</div>
              <span className="font-bold text-gray-900 text-lg tracking-tight">EcoSense</span>
              <span className="hidden sm:block text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">{t('nav.platform')}</span>
            </Link>

            <div className="flex items-center gap-1">
              <nav aria-label={t('nav.mainNavigation', 'Navegação principal')} className="flex items-center gap-1">
                {navLinks.map(link => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/'}
                    aria-label={link.label}
                    data-tour={link.tourId}
                    className={({ isActive }) =>
                      `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1 ${
                        isActive
                          ? 'bg-green-50 text-green-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`
                    }
                  >
                    <span aria-hidden="true">{link.icon}</span>
                    <span className="hidden sm:inline">{link.label}</span>
                  </NavLink>
                ))}
              </nav>

              <div className="ml-2" data-tour="a11y-menu">
                <AccessibilityMenu />
              </div>

              {/* Language toggle */}
              <button
                onClick={toggleLang}
                title={i18n.language === 'en' ? 'Switch to Portuguese' : 'Mudar para Inglês'}
                aria-label={i18n.language === 'en' ? 'Switch to Portuguese' : 'Mudar para Inglês'}
                className="ml-2 flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1"
              >
                {i18n.language === 'en' ? '🇧🇷 PT' : '🇺🇸 EN'}
              </button>

              {/* Reabrir o tour guiado */}
              <button
                onClick={startTour}
                title="Ver tour guiado"
                aria-label="Ver tour guiado"
                className="ml-2 flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-1"
              >
                <span aria-hidden="true">❔</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main id="main-content" tabIndex={-1} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 focus:outline-none">
        {children}
      </main>

      <OnboardingTour
        isActive={tour.isActive}
        step={tour.step}
        stepIndex={tour.stepIndex}
        total={tour.total}
        next={tour.next}
        prev={tour.prev}
        finish={tour.finish}
      />

      <footer className="border-t border-gray-100 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{t('footer.tagline')}</span>
            <span>{t('footer.index')}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
