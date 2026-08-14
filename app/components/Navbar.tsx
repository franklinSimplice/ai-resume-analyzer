import { useTranslation } from "react-i18next";
import { Link as RouterLink, useLocation as useRouterLocation } from "react-router";
import LanguageSwitcher from "./LanguageSwitcher";
import { useApiStore } from "~/lib/api";

function Navbar() {
  const location = useRouterLocation();
  const isActive = (path: string) => location.pathname === path;
  const { t } = useTranslation();
  const { auth } = useApiStore();

  return (
    <nav className="navbar bg-white/90 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 w-full">
          <RouterLink 
            to="/" 
            className="text-2xl font-bold text-slate-900 tracking-tight"
            dangerouslySetInnerHTML={{ __html: t('navigation.title') }}
          />
          
          <div className="flex items-center space-x-1">
            <RouterLink 
              to="/" 
              className={`px-3 py-2 rounded-lg transition-colors font-medium text-sm ${
                isActive('/') ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {t('navigation.home')}
            </RouterLink>
            <RouterLink 
              to="/about" 
              className={`px-3 py-2 rounded-lg transition-colors font-medium text-sm ${
                isActive('/about') ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {t('navigation.about')}
            </RouterLink>
            <RouterLink 
              to="/pricing" 
              className={`px-3 py-2 rounded-lg transition-colors font-medium text-sm ${
                isActive('/pricing') ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {t('navigation.pricing')}
            </RouterLink>
            <RouterLink 
              to="/my-resumes" 
              className={`px-3 py-2 rounded-lg transition-colors font-medium text-sm ${
                isActive('/my-resumes') ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {t('navigation.myResumes')}
            </RouterLink>
            <RouterLink 
              to="/upload" 
              className={`px-3 py-2 rounded-lg transition-colors font-medium text-sm ${
                isActive('/upload') ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {t('navigation.analyze')}
            </RouterLink>
            
            <div className="pl-2 border-l border-slate-200 ml-2 flex items-center gap-2">
              <LanguageSwitcher />
            </div>

            {auth.isAuthenticated ? (
              <div className="flex items-center gap-2 ml-2">
                <span className="text-xs text-slate-500 font-medium hidden md:inline truncate max-w-[120px]">
                  {auth.user?.email}
                </span>
                <button
                  onClick={() => auth.signOut()}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <RouterLink
                to="/auth"
                className={`px-3 py-2 rounded-lg transition-colors font-medium text-sm ${
                  isActive('/auth') ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                Sign In
              </RouterLink>
            )}

            <RouterLink 
              to="/create-resume" 
              className="nav-cta-btn ml-3 px-4 py-2 rounded-xl text-white font-semibold transition-all duration-200 flex items-center gap-2 hover:-translate-y-0.5 hover:shadow-lg text-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              {t('navigation.createResume')}
            </RouterLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;