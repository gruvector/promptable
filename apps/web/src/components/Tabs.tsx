import { atom, useAtom } from "jotai";
import classnames from "classnames";
import { useState } from "react";

export const tabs = {
  Traces: "traces",
};

export const tabAtom = atom(tabs.Traces);

export const Tabs = () => {
  const [activeTab, setActiveTab] = useAtom(tabAtom);

  const handleClickTab = (tab: string) => {
    setActiveTab(tab);
  };

  const consoleFunc = () => {
    console.log(activeTab);
  }

  return (
    <div
      className="daisy-tabs"
      style={
        {
          // borderStyle: "solid",
          // borderBottomWidth: "calc(var(--tab-border, .5px))",
        }
      }
    >
      {Object.values(tabs).map((tab) => {
        return (
          <button
            className={classnames(
              "daisy-tab daisy-tab-bordered daisy-tab-lg ",
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
      {/* hack for border */}
      <div className="daisy-tab daisy-tab-bordered daisy-tab-lg flex-grow" />
    </div>
  );
};
