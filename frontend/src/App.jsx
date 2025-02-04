import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import AppLayout from "./AppLayout";
import Error from "./components/ui/Error";
import Home from "./pages/Home";
import International from "./features/questions/International";
import Questions from "./features/questions/Questionnaire/QuestionsRecents";
import Patients from "./features/questions/Patients";
import Etudiants from "./features/questions/Etudiants";
import MyQuestions, {
  loader as myQuestionsLoader,
} from "./features/questions/Questionnaire/MyQuestions";
import QuestionsRecents from "./features/questions/Questionnaire/QuestionsRecents";
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
                element: <Navigate to="my" replace />, // Redirects to /patients/my
              },
              {
                path: "my",
                element: <MyQuestions />,
                loader: myQuestionsLoader,
              },
              {
                path: "recents",
                element: <QuestionsRecents />,
              },
              {
                path: "ajouter",
                element: <Questions />,
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
      {
        path: "*",
        element: <Navigate to="/" />,
      },
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
