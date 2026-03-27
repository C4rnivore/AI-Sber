import clsx from "clsx";
import Link from "next/link";

function NavigationLink({
  href,
  children,
  active,
  onNavigate,
}: {
  href: string;
  children: React.ReactNode;
  active: boolean;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "hover:cursor-pointer",
        active ? "text-[#4DAAEB]" : "text-black/60"
      )}
      onNavigate={onNavigate}
    >
      {children}
    </Link>
  );
}

export default NavigationLink;
