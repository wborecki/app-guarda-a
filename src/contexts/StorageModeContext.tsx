import { createContext, useContext, useState, type ReactNode } from "react";
import type { StorageMode } from "@/data/vehicleCategories";

interface StorageModeContextType {
  mode: StorageMode;
  setMode: (mode: StorageMode) => void;
}

const StorageModeContext = createContext<StorageModeContextType>({
  mode: "objects",
  setMode: () => {},
});

export const StorageModeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<StorageMode>("objects");
  return (
    <StorageModeContext.Provider value={{ mode, setMode }}>
      {children}
    </StorageModeContext.Provider>
  );
};

export const useStorageMode = () => useContext(StorageModeContext);
