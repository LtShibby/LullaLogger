export default function BigButton({ children, onClick, href }: { children: React.ReactNode; onClick?: () => void; href?: string; }) {
  if (href) {
    return (
      <a href={href} className="big-button">
        {children}
      </a>
    );
  }
  return (
    <button className="big-button" onClick={onClick}>
      {children}
    </button>
  );
}

