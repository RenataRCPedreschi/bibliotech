import { useEffect, useState } from "react";
import { getLivros } from "../../firebase/livros";
import { getEmprestimos, getUltimosEmprestimos } from "../../firebase/emprestimos";
import { getUsers } from "../../firebase/users";
import { ThemeColorContext } from "../../contexts/ThemeColorContext";
import "./Home.css"
import EmprestimosGrafico from "../../components/ChartJS/EmprestimosGrafico";
import TimeAgo from 'timeago-react';
import { format, register } from 'timeago.js';
import ptBR from 'timeago.js/lib/lang/pt_BR';

export function Home() {
  const [totalLivros, setTotalLivros] = useState(0);
  const [totalEmprestimos, setTotalEmprestimos] = useState(0);
  const [emprestimosPendentes, setEmprestimosPendentes] = useState(0);
  const [emprestimosDevolvidos, setEmprestimosDevolvidos] = useState(0);
  const [emprestimos, setEmprestimos] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const { temaEscuro } = ThemeColorContext();


  useEffect(() => {
    getLivros().then((result) => {
      setTotalLivros(result.length);
    });
    getEmprestimos().then((result) => {
      setTotalEmprestimos(result.length);
      setEmprestimosPendentes(
        result.filter((emprestimo) => emprestimo.status === "Pendente").length
      );
      setEmprestimosDevolvidos(
        result.filter((emprestimo) => emprestimo.status === "Entregue").length
      );
      getUsers().then((result) => {
        setTotalUsers(result.length)
      });
    });
    getUltimosEmprestimos().then((result) => {
      setEmprestimos(result)
      
    });

  }, []);


  useEffect(() => {
    if (totalUsers && emprestimosPendentes && emprestimosDevolvidos) {
      renderizaGrafico();
    }
  }, [totalUsers]);

  function renderizaGrafico() {
    return (
      <div>
        <EmprestimosGrafico emprestimos={{ pendentes: emprestimosPendentes, devolvidos: emprestimosDevolvidos, total: totalEmprestimos }} />
      </div>
    )
  }

  register('pt_BR', ptBR);
  
  return (

    <div className={temaEscuro === 'dark' ? "dark bg-secondary" : ""}>
      <div className="container mt-4">
        <div className="row d-flex flex-wrap">
          <div className="col-md-4 col-sm-12">
            <div className="card h-100 d-flex justify-content-center align-items-center">
              <i className="bi bi-people-fill iconText"></i>
              <span className="fw-bold cardText">{totalUsers} usuários</span>
            </div>
          </div>
          <div className="col-md-4 col-sm-12">
            <div className="card h-100 d-flex justify-content-center align-items-center">
              <i className="bi bi-book iconText"></i>
              <span className="fw-bold cardText">{totalLivros} livros</span>
            </div>
          </div>
          <div className="col-md-4 col-sm-12">
            {renderizaGrafico()}
          </div>
        </div>
        <div className="row mt-4">
        
          <table className={temaEscuro === 'dark' ? "table table-dark table-hover table-responsive shadow  rounded" : "table table-hover table-responsive shadow  rounded"}>
            <thead>
              <tr>
                <th>Leitor</th>
                <th>Título</th>
                <th>Tempo</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {emprestimos.map((emprestimo) => {
                return(
                  <tr key={emprestimo.id}>
                  <td>{emprestimo.leitor}</td>
                  <td>{emprestimo.livro.titulo}</td>
                  <td><TimeAgo datetime={emprestimo.dataEmprestimo.toDate()} formatter={format} locale='pt_BR' /></td>
                </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
