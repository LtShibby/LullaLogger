export default function HeaderBar({ title, backHref }: { title: string; backHref?: string }) {
  return (
    <div className="container-md">
      <div className="flex items-center gap-2">
        {backHref && (
          <a href={backHref} className="text-accent">← Babies</a>
        )}
        <div className="flex-1 text-center font-semibold">{title}</div>
        <div className="w-14" />
      </div>
    </div>
  );
}

