import { useState } from 'react';
import { supabase } from '../lib/supabase';

const PERSONAL_DOMAINS = new Set([
  'gmail.com','googlemail.com','yahoo.com','yahoo.co.uk','yahoo.com.au',
  'hotmail.com','hotmail.co.uk','hotmail.fr','outlook.com','outlook.co.uk',
  'live.com','live.co.uk','msn.com','icloud.com','me.com','mac.com',
  'aol.com','protonmail.com','proton.me','zoho.com','ymail.com',
  'mail.com','inbox.com','gmx.com','gmx.net','fastmail.com',
]);

function isPersonalEmail(email) {
  const domain = email.split('@')[1]?.toLowerCase();
  return domain ? PERSONAL_DOMAINS.has(domain) : false;
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isPersonalEmail(email)) {
      setError('Please use your work email address — personal emails like Gmail or Outlook are not accepted.');
      return;
    }

    setLoading(true);

    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + '/dashboard' },
    });

    if (err) {
      setError(err.message);
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="https://www.inclusiongeeks.com/wp-content/uploads/2024/08/iglogo-header-berry3.png"
            alt="Inclusion Geeks"
            className="h-10 mx-auto mb-6"
          />
          <h1 className="text-3xl font-bold text-ig-text mb-2">SHIFT Readiness Hub</h1>
          <p className="text-sm text-ig-text-muted">
            Sign in to access your assessments and track your progress over time.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-ig-rose shadow-sm p-8">
          {sent ? (
            <div className="text-center fade-in">
              <div className="w-16 h-16 bg-ig-rose rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✉️</span>
              </div>
              <h2 className="text-xl font-bold text-ig-text mb-2">Check your email</h2>
              <p className="text-sm text-ig-text-muted leading-relaxed">
                We sent a magic link to <strong>{email}</strong>. Click the link to sign in — no password needed.
              </p>
              <button
                onClick={() => { setSent(false); setEmail(''); }}
                className="mt-6 text-sm text-ig-berry hover:underline"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-bold text-ig-text mb-1">Sign in with email</h2>
              <p className="text-sm text-ig-text-muted mb-6">
                We'll send you a magic link — no password required.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ig-text mb-1.5">
                    Work email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@organization.com"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-ig-berry focus:border-ig-berry outline-none transition-shadow"
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-ig-berry text-white rounded-xl font-semibold text-sm hover:bg-ig-berry-light transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending…
                    </>
                  ) : (
                    'Send magic link →'
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-xs text-ig-text-muted mt-6">
          Part of the{' '}
          <a href="https://inclusiongeeks.com" target="_blank" rel="noopener noreferrer" className="text-ig-berry hover:underline">
            Inclusion Geeks
          </a>{' '}
          SHIFT Readiness Suite
        </p>
      </div>
    </div>
  );
}
