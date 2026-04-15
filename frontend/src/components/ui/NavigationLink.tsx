import clsx from "clsx";
import Link from "next/link";

function NavigationLink({
  href,
  children,
  active,
  className,
  onNavigate,
}: {
  href: string;
  children: React.ReactNode;
  active: boolean;
  className?: string;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "hover:cursor-pointer",
        className,
        active ? "text-[#4DAAEB]" : "text-black/60"
      )}
      onNavigate={onNavigate}
    >
      {children}
    </Link>
  );
}

export default NavigationLink;
