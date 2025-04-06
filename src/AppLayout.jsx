import { Outlet, useNavigation } from "react-router-dom";
import Header from "./components/ui/Header";
import Footer from "./components/ui/Footer";
import Loader from "./components/ui/Loader";

function AppLayout() {
  // useEffect(() => {
  //   if (localStorage.getItem("token")) {
  //     dispatch(fetchUser());
  //   }
  // }, [dispatch]);

  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  // TODO: do this in dashboard of Questions to wait for the totalPagesPromise to fullfill or not
  return (
    <div className="h-screen">
      {isLoading && <Loader />}
      {/* <ScrollRestoration /> */}
      <Header />
      <div className="mx-auto">
        <main className="">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default AppLayout;
