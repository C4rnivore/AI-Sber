import { useEffect, useState } from "react";

/**
 * Хук для синхронизации двух значений
 * @param mode - режим синхронизации (max - максимальное значение, min - минимальное значение)
 * @returns объект с синхронизированным значением и функциями для установки значений
 */
export default function useSyncValues(mode: "max" | "min" = "max") {
  const [syncedValue, setSyncedValue] = useState<number>(0);
  const [value1, setValue1] = useState<number>(0);
  const [value2, setValue2] = useState<number>(0);

  useEffect(() => {
    const newSyncedValue =
      mode === "max" ? Math.max(value1, value2) : Math.min(value1, value2);
    setSyncedValue(newSyncedValue);
  }, [value1, value2, mode]);

  return {
    syncedValue,
    setValue1,
    setValue2,
  };
}
