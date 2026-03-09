export default function Footer() {
  return (
    <footer className="border-t border-gray-100 py-8 px-4 mt-auto">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
        <div className="flex items-center gap-3">
          <img
            src="https://www.inclusiongeeks.com/wp-content/uploads/2024/08/iglogo-header-berry3.png"
            alt="Inclusion Geeks"
            className="h-6 w-auto opacity-70"
          />
          <span>·</span>
          <span>SHIFT Readiness Hub</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://inclusiongeeks.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ig-berry transition-colors"
          >
            Website
          </a>
          <a
            href="https://inclusiongeeks.com/contact/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ig-berry transition-colors"
          >
            Contact
          </a>
          <span>© {new Date().getFullYear()} Inclusion Geeks</span>
        </div>
      </div>
    </footer>
  );
}
