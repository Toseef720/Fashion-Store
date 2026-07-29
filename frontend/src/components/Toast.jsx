export default function Toast({ show, message }) {
  return (
    <div
      className={`fixed top-16 right-6 z-[100]
      bg-dark text-white px-4 py-3 rounded shadow-lg
      transition-all duration-300
      ${
        show
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-4 pointer-events-none"
      }`}
    >
      {message}
    </div>
  );
}
