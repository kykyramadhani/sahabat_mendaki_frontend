// src/components/shared/NavLink.tsx
export default function NavLink({ href, label, setPage, isButton = false }: {
  href: string;
  label: string;
  setPage: (page: string) => void;
  isButton?: boolean;
}) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setPage(href);
  };

  if (isButton) {
    return (
      <a
        href="#"
        onClick={handleClick}
        className="bg-green-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-green-700 transition-shadow shadow-md"
      >
        {label}
      </a>
    );
  }

  return (
    <a
      href="#"
      onClick={handleClick}
      className="text-gray-600 hover:text-green-600 font-medium transition-colors"
    >
      {label}
    </a>
  );
}