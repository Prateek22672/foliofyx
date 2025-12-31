import { createContext, useContext, useState } from "react";

const ElementContext = createContext();

export const ElementProvider = ({ children }) => {
  const [elements, setElements] = useState([]);

  const addElement = (el) => {
    setElements((prev) => [...prev, { ...el, id: Date.now() }]);
  };

  return (
    <ElementContext.Provider value={{ elements, setElements, addElement }}>
      {children}
    </ElementContext.Provider>
  );
};

export const useElements = () => useContext(ElementContext);
