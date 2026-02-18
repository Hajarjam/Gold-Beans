import { createContext, useState } from "react";

export const BreadcrumbContext = createContext();

export default function BreadcrumbProvider({ children }) {
  const [breadcrumbData, setBreadcrumbData] = useState({});

  return (
    <BreadcrumbContext.Provider value={{ breadcrumbData, setBreadcrumbData }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}
