import { createContext, useContext, useState } from "react";

const DnDContext = createContext([null, (_) => {}]);

export const DnDProvider = ({ children }) => {
  const [circuitId, setCircuitId] = useState("null");

  return (
    <DnDContext.Provider value={[circuitId, setCircuitId]}>
      {children}
    </DnDContext.Provider>
  );
};

export default DnDContext;

export const useDnD = () => {
  return useContext(DnDContext);
};
