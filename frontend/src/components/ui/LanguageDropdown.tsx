import ChevronIcon from "@/icons/ChevronIcon";
import { cn } from "@/lib/utils";
import { useState, useRef, useId, useEffect } from "react";

interface LanguageDropdownProps {
  options: { value: "russian" | "nanai"; label: string }[];
  value: string;
  onChange: (value: "russian" | "nanai") => void;
  disabled?: boolean;
  className?: string;
}

function LanguageFlag({ code }: { code: "russian" | "nanai" }) {
  const sizeClass =
    "lg:size-[1.389vw] size-5 shrink-0 rounded-full overflow-hidden";

  if (code === "russian") {
    return (
      <span className={cn(sizeClass, "ring-1 ring-black/5")} aria-hidden>
        <svg
          viewBox="0 0 24 24"
          className="size-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="24" height="8" y="0" fill="#FFFFFF" />
          <rect width="24" height="8" y="8" fill="#0039A6" />
          <rect width="24" height="8" y="16" fill="#D52B1E" />
        </svg>
      </span>
    );
  }

  if (code === "nanai") {
    return (
      <span
        className={cn(
          sizeClass,
          "bg-[#F4D03F] ring-1 ring-black/10 flex items-center justify-center"
        )}
        aria-hidden
      >
        <svg
          viewBox="0 0 24 24"
          className="lg:size-[0.833vw] size-3"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 4v16M8 8c0 2.5 2 4 4 4s4-1.5 4-4"
            stroke="#1a1a1a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }

  return (
    <span
      className={cn(sizeClass, "bg-neutral-200 ring-1 ring-black/5")}
      aria-hidden
    />
  );
}

function LanguageDropdown({
  options,
  value,
  onChange,
  disabled,
  className,
}: LanguageDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selected = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current?.contains(e.target as Node)) return;
      setIsOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  const rowClass =
    "flex lg:w-[10.139vw] w-[35.667vw] items-center gap-[0.556vw] lg:px-[0.417vw] px-2 lg:py-[0.417vw] py-[1.667vw] lg:pr-[0.617vw] text-left";

  return (
    <div ref={rootRef} className={cn("relative", isOpen && "z-200", className)}>
      <button
        type="button"
        className={cn(
          rowClass,
          "min-w-0 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:cursor-pointer"
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listId}
        onClick={() => setIsOpen((o) => !o)}
        disabled={disabled}
      >
        <LanguageFlag code={selected.value} />
        <span className="flex-1 truncate lg:text-[0.903vw] text-sm font-medium text-neutral-900 text-center">
          {selected.label}
        </span>
        <ChevronIcon open={isOpen} />
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute left-0 top-full mt-[0.278vw] min-w-full w-max z-5",
            "lg:rounded-[0.972vw] rounded-[3.333vw] bg-white/95 backdrop-blur-sm",
            "shadow-[0_4px_20px_rgba(0,0,0,0.12)] ring-1 ring-black/5",
            "overflow-hidden py-[0.278vw]"
          )}
          role="presentation"
        >
          <ul id={listId} role="listbox" aria-label="Язык">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <li key={option.value} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={cn(
                      rowClass,
                      isSelected
                        ? "opacity-45 cursor-default"
                        : "cursor-pointer hover:bg-black/4 text-neutral-900"
                    )}
                    onClick={() => {
                      if (!isSelected) onChange(option.value);
                      setIsOpen(false);
                    }}
                  >
                    <LanguageFlag code={option.value} />
                    <span className="flex-1 truncate lg:text-[0.903vw] text-sm font-medium">
                      {option.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default LanguageDropdown;
