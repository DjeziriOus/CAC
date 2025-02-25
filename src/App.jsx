import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import AppLayout from "./AppLayout";
import Error from "./components/ui/Error";
import Home from "./pages/Home";
import International from "./features/questions/International";
import Patients, {
  myQuestionsLoader,
  recentQuestionsLoader,
} from "./features/questions/Patients";
// import Etudiants from "./features/questions/Etudiants";
import Questions from "./features/questions/Questionnaire/Questions";
import AjouterQuestion from "./features/questions/Questionnaire/AjouterQuestion";
import Services from "./features/services/services";
import Dashboard from "./pages/Dashboard";
// import Page from "./app/dashboard/page";
import Utilisateurs from "./features/dashboard/Utilisateurs";
import Evenements from "./features/dashboard/Evenements";
import QuestionsDashboard from "./features/dashboard/Questions";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// import { loader as userLoader } from "./features/user/UserInfo";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});
const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/contact",
        element: <Home />,
      },
      {
        path: "/questions",
        children: [
          {
            index: true, // Matches /questions directly
            element: <Navigate to="/" />,
          },
          {
            path: "patients",
            element: <Patients />,
            children: [
              {
                index: true, // Matches /patients directly
                element: <Navigate to="recents" replace />, // Redirects to /patients/my
              },
              {
                path: "my",
                element: <Questions />,
                loader: myQuestionsLoader,
              },
              {
                path: "recents",
                element: <Questions />,
                loader: recentQuestionsLoader,
              },
              {
                path: "ajouter",
                element: <AjouterQuestion />,
              },
            ],
          },
          {
            path: "etudiants",
            element: <Patients />,
            children: [
              {
                index: true, // Matches /patients directly
                element: <Navigate to="recents" replace />, // Redirects to /patients/my
              },
              {
                path: "my",
                element: <Questions />,
                loader: myQuestionsLoader,
              },
              {
                path: "recents",
                element: <Questions />,
                loader: recentQuestionsLoader,
              },
              {
                path: "ajouter",
                element: <AjouterQuestion />,
              },
            ],
          },
          {
            path: "international",
            element: <International />,
          },
        ],
      },
      {
        path: "/services",
        element: <Services />,
      },
      // {
      //   path: "*",
      //   element: <Navigate to="/" />,
      // },
    ],
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Navigate to={"/dashboard/utilisateurs"} replace />,
      },
      {
        path: "utilisateurs",
        element: <Utilisateurs />,
      },
      {
        path: "services",
        element: <Services />,
      },
      {
        path: "questions",
        element: <QuestionsDashboard />,
        loader: recentQuestionsLoader,
      },
      {
        path: "evenements",
        element: <Evenements />,
      },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
