"use client";
import React, { useContext, useRef } from "react";
import { RootContext } from "./RootContext";

export default function TabBar() {
  const { repositories, setActiveTab } = useContext(RootContext);
  const tabRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  return (
    <div className="flex gap-4 relative h-20 py-4 items-center">
      {Object.keys(repositories).map((key) => {
        const { title }: { title: string } = repositories[parseInt(key)];

        return (
          <Tab
            key={key}
            title={title}
            id={parseInt(key)}
            ref={(el) => {
              tabRefs.current[key] = el;
            }}
          />
        );
      })}
      {Object.keys(repositories).length > 0 && (
        <div
          className="w-12 h-12 bg-foreground-tint"
          onClick={() => setActiveTab(null)}
        ></div>
      )}
    </div>
  );
}

function TabComponent(
  { title, id }: { title: string; id: number },
  ref: React.Ref<HTMLDivElement>
) {
  const { activeTab, setActiveTab } = useContext(RootContext);

  const isActive = activeTab == id;

  const handleClick = () => {
    setActiveTab(id);
  };

  return (
    <div
      ref={ref}
      onClick={handleClick}
      className={` ${
        isActive
          ? "opacity-100 bg-foreground-tint"
          : "opacity-70 cursor-pointer border-transparent "
      } rounded-full h-fit line-clamp-1 px-8 py-2 text-[16px] transition-all duration-300 border`}
    >
      <span>{title}</span>
    </div>
  );
}

const Tab = React.forwardRef(TabComponent);
