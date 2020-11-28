export default function Layout({ children }) {
  return (
    <div className="font-sans font-medium antialiased w-screen min-h-screen bg-emerald-100 flex items-center justify-center">
      <div className="container mx-auto px-4 py-8">{children}</div>
    </div>
  );
}
