import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import AppLayout from "./AppLayout";
import Error from "./components/ui/Error";
import Home from "./pages/Home";
import Patients, {
  myQuestionsLoader,
  recentQuestionsLoader,
} from "./features/questions/Questions";
// import Etudiants from "./features/questions/Etudiants";
import Questions from "./features/questions/Questionnaire/RecentQuestions";
import AjouterQuestion from "./features/questions/Questionnaire/AjouterQuestion";
import ServicesDashboard from "./features/dashboard/Services/Services";

import Services from "./features/services hospitaliers/Services";
import Dashboard from "./pages/Dashboard";
// import Page from "./app/dashboard/page";
import Utilisateurs from "./features/dashboard/Utilisateurs/Utilisateurs";
import Evenements from "./features/dashboard/Evenements/Evenements";
import QuestionsDashboard from "./features/dashboard/Questions/QuestionsDashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// import { loader as userLoader } from "./features/user/UserInfo";
import { Toaster } from "sonner";
import QuestionsForum from "./features/questions/QuestionsForum";
import MyQuestions from "@/features/questions/Questionnaire/MyQuestions";
// import Etudiants from "./features/questions/Etudiants";
import AjouterEvenement from "./features/dashboard/Evenements/AjouterEvenementForm";
import EditEvenement from "./features/dashboard/Evenements/EditEvenement";
import EventDetails from "./features/evenements/EventDetails";
import Events from "./features/evenements/Events";
import AjouterService from "./features/dashboard/Services/AjouterService";
import EditService from "./features/dashboard/Services/EditService";
import ServiceDetails from "./features/services hospitaliers/ServicesDetails";
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
        path: "evenements",
        element: <Events />,
      },
      {
        path: "evenements/:eventId",
        element: <EventDetails />,
      },
      {
        path: "services",
        element: <Services />,
      },
      {
        path: "services/:serviceId",
        element: <ServiceDetails />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Navigate to={"/dashboard/questions"} replace />,
      },
      {
        path: "utilisateurs",
        element: <Utilisateurs />,
      },
      {
        path: "services",
        element: <ServicesDashboard />,
      },
      {
        path: "services/ajouter",
        element: <AjouterService />,
      },
      {
        path: "services/edit/:serviceId",
        element: <EditService />,
      },
      {
        path: "questions",
        element: <QuestionsDashboard />,
      },
      {
        path: "evenements",
        element: <Evenements />,
      },
      {
        path: "evenements/ajouter",
        element: <AjouterEvenement />,
      },
      {
        path: "evenements/edit/:eventId",
        element: <EditEvenement />,
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
