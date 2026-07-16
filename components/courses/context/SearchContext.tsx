"use client";

import { createContext, useContext, type ReactNode } from "react";
interface SearchContextType {
  search: string;
  setSearch: (value: string) => void;
}

const SearchContext = createContext<SearchContextType>({
  search: "",
  setSearch: () => {},
});

export function useSearch() {
  return useContext(SearchContext);
}

export function SearchProvider({
  search,
  setSearch,
  children,
}: {
  search: string;
  setSearch: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <SearchContext.Provider value={{ search, setSearch }}>
      {children}
    </SearchContext.Provider>
  );
}
