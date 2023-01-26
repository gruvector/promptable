import { atom, useAtom } from "jotai";
import classnames from "classnames";
import { useState } from "react";

export const tabs = {
  Chains: "chains",
  Index: "index",
  Documents: "documents",
  // Agents: "agents",
  // Policies: "policies",
  // Events: "events",
  // Settings: "settings",
};

export const tabAtom = atom(tabs.Chains);

export const Tabs = () => {
  const [activeTab, setActiveTab] = useAtom(tabAtom);

  const handleClickTab = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div
      className="daisy-tabs"
      style={{
        borderStyle: "solid",
        borderColor: "lightgray",
        // borderBottomWidth: "calc(var(--tab-border, .5px))",
        borderBottomWidth: ".25px",
      }}
    >
      {Object.values(tabs).map((tab) => {
        return (
          <button
            className={classnames(
              "daisy-tab daisy-tab-bordered daisy-tab-lg",
              activeTab === tab && "daisy-tab-active",
              "capitalize"
            )}
            key={tab}
            onClick={() => handleClickTab(tab)}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
};