import { Outlet, ScrollRestoration, useNavigation } from "react-router-dom";
import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";
import Loader from "./components/ui/Loader";
import Toaster from "@/components/ui/toaster";
function AppLayout() {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  return (
    <div className="h-screen">
      {isLoading && <Loader />}

      <Header />
      <div className="mx-auto">
        <main className="">
          <Outlet />
        </main>
      </div>
      <Toaster />
      <Footer />
    </div>
  );
}

export default AppLayout;
