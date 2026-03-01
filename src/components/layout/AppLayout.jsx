export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* space for mobile top bar */}
      <div className="h-14 md:hidden" />

      <div className="flex">
        {/* desktop sidebar space */}
        <div className="hidden md:block w-64" />

        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
    </div>
  );
}