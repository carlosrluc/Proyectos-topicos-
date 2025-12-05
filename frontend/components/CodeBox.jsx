export default function CodeBox({ children }) {
  return (
    <pre className="bg-gray-900 text-green-400 p-4 rounded-xl shadow-lg border border-gray-700 text-sm overflow-auto whitespace-pre-wrap">
      {children}
    </pre>
  );
}
