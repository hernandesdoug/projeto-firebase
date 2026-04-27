import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../src/componentes/login.tsx";
import Cadastro from "../src/componentes/cadastro.tsx";
import Paciente from "./componentes/paciente.tsx";
import Medico from "./componentes/medico.tsx";
import Home from "./componentes/home.tsx";

function App() {
  return (
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />}/>
    <Route path="/login" element={<Login />} />
    <Route path="/cadastro" element={<Cadastro />} />
    <Route path="/paciente/" element={<Paciente />} />
    <Route path="/medico/" element={<Medico />} />
  </Routes>
  </BrowserRouter>
)
}
export default App;