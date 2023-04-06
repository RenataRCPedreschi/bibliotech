import { useEffect, useState } from "react";
import {
  Button,
  Container,
  Table,
  Modal,
  Tooltip,
  OverlayTrigger,
  Pagination,
} from "react-bootstrap";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { Loader } from "../../components/Loader/Loader";
import {
  avancarPagina,
  deleteLivro,
  getLivro,
  getLivros,
  paginaInicial,
  voltarPagina,
} from "../../firebase/livros";
import "./Livros.css";
import { ThemeColorContext } from "../../contexts/ThemeColorContext";
import { DetalhesLivroModal } from "../../components/DetalhesLivroModal/DetalhesLivroModal";

export function Livros() {
  const { temaEscuro } = ThemeColorContext();
  const [livros, setLivros] = useState(null);
  const [show, setShow] = useState(false);
  const [livro, setLivro] = useState(null);
  const [search, setSearch] = useState(""); //busca de livros
  const [firstObject, setFirstObject] = useState(null);
  const [lastObject, setLastObject] = useState(null);
  const [totalLivros, setTotalLivros] = useState(0);
  const [count, setCount] = useState(1);

  // Estado para mostrar ou ocultar o modal de detalhes do livro
  const [showDetalhesLivro, setShowDetalhesLivro] = useState(false);

  const tooltipAddLivro = <Tooltip>Clique para adicionar um livro</Tooltip>;
  const tooltipEditarLivro = <Tooltip>Clique para Editar</Tooltip>;
  const tooltipApagarLivro = (
    <Tooltip>Clique para apagar o livro da biblioteca</Tooltip>
  );
  const tooltipDetalhesLivro = (
    <Tooltip>Clique para ver mais detalhes do livro</Tooltip>
  );

  function avancarPag() {
    avancarPagina(lastObject).then((res) => {
      setLivros(res);
      setFirstObject(res[0]);
      setLastObject(res[2]);
    });
  }

  function voltarPag() {
    voltarPagina(firstObject).then((res) => {
      setLivros(res);
      setFirstObject(res[0]);
      setLastObject(res[2]);
    });
  }

  useEffect(() => {
    initializeTable();
  }, [search]); // search começa vazio então mostra todos os livros
  
  useEffect(() => {
    getLivros().then((busca) => {
      setLivros(busca);
      setTotalLivros(busca.length);
    });

    paginaInicial().then((res) => {
      setFirstObject(res[0]);
      setLastObject(res[2]);
      setLivros(res);
    });

   
  }, []);

 
  useEffect(() => {
    initializeTable();
  }, [search]); // search começa vazio então mostra todos os livros

  function initializeTable() {
    getLivros().then((resultados) => {
      setLivros(
        resultados.filter(
          (
            livro //tratando a busca de livros
          ) =>
            livro.titulo.toLowerCase().includes(search.toLowerCase()) ||
            livro.isbn.toLowerCase().includes(search.toLowerCase())
        )
      );
    });
  }

  // Função que exibe o modal de detalhes do livro
  function openDetalhesLivro(livro) {
    setLivro(livro); // Atualiza o estado do Livro com o livro selecionado
    setShowDetalhesLivro(true); // Ativa o estado para mostrar o modal de detalhes do livro
  }

  // Função para fechar o modal de detalhes do livro
  function closeDetalhesLivro() {
    setShowDetalhesLivro(false); // Desative o estado para ocultar o modal de detalhes do livro
  }

  function onDeleteLivro(id, titulo) {
    const deletar = window.confirm(
      `Tem certeza que deseja excluir o livro ${titulo}?`
    );
    if (deletar) {
      deleteLivro(id).then(() => {
        toast.success(`${titulo} apagado com sucesso!`, {
          duration: 2000,
          position: "bottom-right",
        });
        initializeTable();
      });
    }
  }

  function handleShow(livro) {
    setLivro(livro);
    setShow(true);
  }
  function handleClose() {
    setShow(false);
    setLivro(null);
  }

  return (
    <div
      className={
        temaEscuro === "dark"
          ? "bg-secondary text-white livrosContainer"
          : "livrosContainer"
      }
    >
      <Container>
        <div className="d-flex justify-content-between align-items-center">
          <h1>Livros</h1>
          <OverlayTrigger overlay={tooltipAddLivro}>
            <Button
              as={Link}
              to="/livros/adicionar"
              className={
                temaEscuro === "dark" ? "bg-dark text-white" : "bg-success"
              }
              variant="bg-dark"
            >
              Adicionar Livro
            </Button>
          </OverlayTrigger>
        </div>
        {/* Campo de busca INICIO */}
        <div className="input-group d-flex justify-content-center mb-3">
          <span className="input-group-text bi bi-search" id=""></span>
          <input
            className=""
            type="text"
            placeholder="Digite o título ou ISBN"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {/* Campo de busca FIM */}

        <hr />
        {livros === null ? (
          <Loader />
        ) : (
          <Table
            striped
            bordered
            hover
            className={
              temaEscuro === "dark" ? "table table-dark table-striped" : ""
            }
          >
            <thead>
              <tr>
                <th>Título</th>
                <th>Autor</th>
                <th>Categoria</th>
                <th>ISBN</th>
                <th>Imagem</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {livros.map((livro) => {
                return (
                  <tr
                    key={livro.id}
                    className={
                      temaEscuro === "dark"
                        ? "themeDark-livros"
                        : "themeLight-livros"
                    }
                  >
                    <td>{livro.titulo}</td>
                    <td>{livro.autor}</td>
                    <td>{livro.categoria}</td>
                    <td>{livro.isbn}</td>
                    <td onClick={() => handleShow(livro)}>
                      <img
                        className="imagensLivro"
                        src={livro.urlCapa}
                        alt={livro.titulo}
                      />
                    </td>
                    <td>
                      <div className="d-flex flex-column mb-3">
                        <OverlayTrigger overlay={tooltipEditarLivro}>
                          <Button
                            as={Link}
                            to={`/livros/editar/${livro.id}`}
                            variant="warning"
                            size="sm"
                            className="mt-2"
                          >
                            <i className="bi bi-pencil-fill"></i>
                          </Button>
                        </OverlayTrigger>

                        <OverlayTrigger overlay={tooltipApagarLivro}>
                          <Button
                            size="sm"
                            variant="danger"
                            className="mt-2"
                            onClick={() =>
                              onDeleteLivro(livro.id, livro.titulo)
                            }
                          >
                            <i className="bi bi-trash3-fill"></i>
                          </Button>
                        </OverlayTrigger>
                        <OverlayTrigger overlay={tooltipDetalhesLivro}>
                          <Button
                            onClick={() => openDetalhesLivro(livro)}
                            size="sm"
                            variant="success"
                            className="mt-2"
                          >
                            <i className="bi bi-info-lg"></i>
                          </Button>
                        </OverlayTrigger>

                     
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}

           {/* Paginação */}
           <Pagination className="justify-content-center">
                          <Pagination.First
                            disabled={count <= 1}
                            onClick={() => {
                              voltarPag();
                              setCount(count - 1);
                            }}
                          />

                          <Pagination.Item>{count}</Pagination.Item>

                          <Pagination.Last
                            disabled={count >= totalLivros / 1}
                            onClick={() => {
                              avancarPag();
                              setCount(count + 1);
                            }}
                          />
                        </Pagination>
      </Container>
      <>
        <Modal className="text-center" show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title bsPrefix="modal-title text-center">
              {livro?.titulo}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img
              className="imagensLivroDestaque"
              src={livro?.urlCapa}
              alt={livro?.titulo}
            />
          </Modal.Body>
        </Modal>
      </>
      <div>
        <DetalhesLivroModal
          livro={livro}
          show={showDetalhesLivro}
          handleClose={closeDetalhesLivro}
        />
      </div>
    </div>
  );
}
