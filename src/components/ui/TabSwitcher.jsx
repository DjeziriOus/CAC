import styles from "./TabSwitcher.module.css";
import { NavLink } from "react-router-dom";
import { Button } from "./button";
import { useSelector } from "react-redux";
import AuthDialog from "@/features/user/AuthDialog";
const TabSwitcher = ({ tabs }) => {
  // const [activeTab, setActiveTab] = useState(0);
  const { user, status } = useSelector((state) => state.user);

  return (
    <div className="flex w-full items-center justify-center py-4">
      <div className={styles.nav}>
        <div className="flex max-w-4xl gap-2 overflow-hidden rounded-full border border-gray-200 2xl:gap-4">
          {tabs.map((tab) => {
            if ((tab.link === "my" || tab.link === "ajouter") && !user) {
              return (
                <AuthDialog key={tab.name} to={tab.link}>
                  <Button
                    variant=""
                    className={`bg-lgt rounded-full text-sm text-blk-60 hover:bg-slate-100 xl:text-xs 2xl:p-6 2xl:text-base 4xl:text-lg`}
                  >
                    {tab.name}
                  </Button>
                </AuthDialog>
              );
            }
            return (
              <NavLink key={tab.name} to={tab.link} className="font-medium">
                <Button
                  variant=""
                  className={`bg-lgt rounded-full text-sm text-blk-60 hover:bg-slate-100 xl:text-xs 2xl:p-6 2xl:text-base 4xl:text-lg`}
                >
                  {tab.name}
                </Button>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TabSwitcher;
