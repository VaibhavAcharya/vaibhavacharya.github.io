export default function Layout({ children }) {
  return (
    <div className="font-mono font-medium antialiased w-screen min-h-screen bg-rose-50">
      <div className="container mx-auto px-4">{children}</div>
    </div>
  );
}
