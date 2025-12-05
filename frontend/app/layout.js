import "../styles/globals.css";

export const metadata = {
  title: "Generador de Módulos",
  description: "Frontend para generar módulos dinámicos",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-gray-100 min-h-screen p-10">{children}</body>
    </html>
  );
}
