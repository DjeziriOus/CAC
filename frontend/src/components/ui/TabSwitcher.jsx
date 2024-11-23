import styles from "./TabSwitcher.module.css";
import { NavLink } from "react-router-dom";
import { Button } from "./button";
const TabSwitcher = ({ tabs }) => {
  // const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="flex w-full items-center justify-center py-4">
      <div className={styles.nav}>
        <div className="flex max-w-4xl gap-2 overflow-hidden rounded-full border border-gray-200">
          {tabs.map((tab) => (
            <NavLink key={tab.name} to={tab.link} className="font-medium">
              <Button
                variant=""
                className={`bg-lgt- rounded-full text-sm text-blk-60 hover:bg-slate-100 xl:text-xs 4xl:text-base`}
              >
                {tab.name}
              </Button>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabSwitcher;
