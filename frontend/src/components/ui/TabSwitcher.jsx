import React, { useState } from "react";
import LinkButton from "./LinkButton";

const TabSwitcher = ({ tabs }) => {
  // const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex w-full items-center justify-center py-4">
      <div className="flex max-w-4xl gap-2 overflow-hidden rounded-full border border-gray-200">
        {tabs.map((tab, index) => (
          <LinkButton
            key={index}
            to={tab.link}
            className={`flex cursor-pointer items-center justify-center rounded-full px-6 py-3 text-center text-sm font-semibold transition-colors ${
              {
                /*
                activeTab === index
                  ? "bg-blue-2 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
                  */
              }
            }`}
            // onClick={() => setActiveTab(index)}
          >
            {tab.name}
          </LinkButton>
        ))}
      </div>
    </div>
  );
};

export default TabSwitcher;
