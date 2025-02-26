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
import Questions from "./features/questions/Questionnaire/RecentQuestions";
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
import { Toaster } from "sonner";
import QuestionsForum from "./features/questions/QuestionsForum";
import MyQuestions from "./features/questions/Questionnaire/myQuestions";
import Etudiants from "./features/questions/Etudiants";
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
        element: <QuestionsForum />,
        children: [
          {
            index: true,
            element: <Navigate to="patient/recents" />,
          },
          {
            path: "patient",
            element: <Patients />,
            children: [
              {
                index: true, // Matches /questions directly
                element: <Navigate to="recents" replace />,
              },
              {
                path: "my",
                element: <MyQuestions />,
              },
              {
                path: "recents",
                element: <Questions />,
              },
              {
                path: "ajouter",
                element: <AjouterQuestion />,
              },
            ],
          },
          {
            path: "etudiant",
            element: <Patients />,
            children: [
              {
                index: true, // Matches /questions directly
                element: <Navigate to="recents" replace />,
              },
              {
                path: "my",
                element: <MyQuestions />,
              },
              {
                path: "recents",
                element: <Questions />,
              },
              {
                path: "ajouter",
                element: <AjouterQuestion />,
              },
            ],
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
      <Toaster richColors />
    </QueryClientProvider>
  );
}

export default App;
