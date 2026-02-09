export function LandingFooter() {
  return (
    <footer className="w-full border-gray-100 py-12 h-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <div className="w-6 h-6 rounded bg-gray-900 flex items-center justify-center text-white text-xs font-bold">A</div>
          <span className="font-bold text-gray-900">AutoAds</span>
        </div>
        <p className="text-sm text-gray-500">© 2024 AutoAds Inc. All rights reserved.</p>
      </div>
    </footer>
  );
}
