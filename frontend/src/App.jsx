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
import Etudiants from "./features/questions/Etudiants";
import Questions from "./features/questions/Questionnaire/Questions";
import AjouterQuestion from "./features/questions/Questionnaire/AjouterQuestion";
// import { loader as userLoader } from "./features/user/UserInfo";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />,
        // loader: userLoader,
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
            element: <Etudiants />,
          },
          {
            path: "international",
            element: <International />,
          },
        ],
      },
      // {
      //   path: "*",
      //   element: <Navigate to="/" />,
      // },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;
