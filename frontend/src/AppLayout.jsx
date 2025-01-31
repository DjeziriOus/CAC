import { Outlet, ScrollRestoration, useNavigation } from "react-router-dom";
import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";
import Loader from "./components/ui/Loader";

function AppLayout() {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  return (
    <div className="relative h-screen">
      {isLoading && <Loader />}
      <Header />
      <div className="mx-auto">
        <main className="relative">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default AppLayout;
