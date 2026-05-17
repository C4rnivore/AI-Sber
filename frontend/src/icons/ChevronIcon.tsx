import { cn } from "@/lib/utils";

export default function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={cn(
        "lg:size-[0.625vw] size-2.5 shrink-0 text-neutral-500 transition-transform duration-200",
        open && "-rotate-180",
      )}
      viewBox="0 0 12 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M1 1.5L6 6.5L11 1.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
