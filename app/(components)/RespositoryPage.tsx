"use client";
import { useContext } from "react";
import FindARepository from "./FindARepository";
import { RootContext } from "./RootContext";

export default function RespositoryPage() {
  const { activeTab, repositories } = useContext(RootContext);

  return (
    <>{activeTab ? repositories[activeTab].element : <FindARepository />}</>
  );
}
