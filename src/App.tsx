import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../src/componentes/login.tsx";
import Cadastro from "../src/componentes/cadastro.tsx";
import Perfil from "../src/componentes/perfil.tsx";

function App() {
  return (
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/cadastro" element={<Cadastro />} />
    <Route path="/perfil/" element={<Perfil />} />
  </Routes>
  </BrowserRouter>
)
}
export default App;