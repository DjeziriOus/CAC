import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import AppLayout from "./AppLayout";
import Error from "./components/ui/Error";
import Home from "./pages/Home";
import International from "./pages/questions/International";
import Questions from "./pages/questions/Questionnaire/QuestionsRecents";
import Patients from "./pages/questions/Patients";
import Etudiants from "./pages/questions/Etudiants";
import MyQuestions from "./pages/questions/Questionnaire/MyQuestions";
import QuestionsRecents from "./pages/questions/Questionnaire/QuestionsRecents";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
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
                element: <Navigate to="my" replace />, // Redirects to /patients/my
              },
              {
                path: "my",
                element: <MyQuestions />,
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
