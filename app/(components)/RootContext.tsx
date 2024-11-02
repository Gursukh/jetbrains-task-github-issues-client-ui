"use client";

import { createContext, useState } from "react";
import { RepoDetails, Repository, RootContextType } from "../types";
import { CONSTANT_TEXT } from "../(constants)/text";

export const RootContext = createContext<RootContextType>({
  activeTab: null,
  setActiveTab: () => {},
  repositories: {},
  addRepository: () => {},
  removeRepository: () => {},
});

/*
  This clears up space in page files and allows initialisation
  of a global state that can be used across the application.
*/
export default function RootContextProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const [repositories, setRepositories] = useState<{
    [key: number]: Repository;
  }>({
    
  });

  const addRepository = (repo: RepoDetails) => {
    setRepositories({
      ...repositories,
      [repo.id]: {
        title: repo.owner.login + "/" + repo.name,
        url: repo.html_url,
        element: <></>,
      },
    });
  };

  const removeRepository = (id: number) => {
    const newRepositories = { ...repositories };
    const keys = Object.keys(newRepositories);
  
    delete newRepositories[id];
    setRepositories(newRepositories);

  };
  
  return (
    <RootContext.Provider
      value={{ activeTab, setActiveTab, repositories, addRepository, removeRepository }}
    >
      {children}
    </RootContext.Provider>
  );
}
