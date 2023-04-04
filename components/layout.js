import Header from "./Header";

export default function Layout({ children }) {
  return (
    <main>
      <div className="max-w-4xl mx-auto">
        <Header />
        {children}
      </div>
    </main>
  );
}
