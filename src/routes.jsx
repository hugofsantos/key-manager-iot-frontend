import {createBrowserRouter} from "react-router-dom";
import App from "./App";
import CadastroProfessor from "./views/CadastroProfessor";
import CadastroReserva from "./views/CadastroReserva";
import Dashboard from "./views/Dashboard";
import Error404 from "./views/errors/Error404";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <Error404/>,
    children: [
      {
        path: "/",
        element: <Dashboard/>
      },
      {
        path: "/cadastro-professor",
        element: <CadastroProfessor/>
      },
      {
        path: "/cadastro-reserva",
        element: <CadastroReserva/>
      }
    ]
  }
]);

export default appRouter;