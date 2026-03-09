import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/ai',        label: 'Ethical AI' },
  { to: '/change',    label: 'Change Readiness' },
  { to: '/equity',    label: 'Workplace Equity' },
];

export default function Header({ user }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-ig-rose shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <a href="https://inclusiongeeks.com" target="_blank" rel="noopener noreferrer" className="shrink-0">
          <img
            src="https://www.inclusiongeeks.com/wp-content/uploads/2024/08/iglogo-header-berry3.png"
            alt="Inclusion Geeks"
            className="h-7"
          />
        </a>

        {/* Nav (hidden on mobile) */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ to, label }) => {
            const active = location.pathname === to || location.pathname.startsWith(to + '/');
            return (
              <Link
                key={to}
                to={to}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  active
                    ? 'bg-ig-berry text-white'
                    : 'text-ig-text-muted hover:text-ig-text hover:bg-ig-rose'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3 shrink-0">
          {user && (
            <span className="hidden sm:block text-xs text-ig-text-muted truncate max-w-[160px]">
              {user.email}
            </span>
          )}
          <button
            onClick={handleSignOut}
            className="text-xs px-3 py-1.5 rounded-full border border-ig-rose text-ig-text-muted hover:text-ig-berry hover:border-ig-berry transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
