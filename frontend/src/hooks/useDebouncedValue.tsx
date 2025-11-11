import { useState, useEffect } from "react";

/**
 * Хук для debounce значения
 * @param value - значение
 * @param delay - задержка
 * @returns debounced значение
 */
function useDebouncedValue(value: unknown, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebouncedValue;
