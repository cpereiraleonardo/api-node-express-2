import NaoEncontrado from "../erros/NaoEncontrado.js";
import { livros, autores } from "../models/index.js";

class LivroController {
  static listarLivros = async (req, res, next) => {
    try {
      const livrosResultado = await livros.find().populate("autor").exec();

      if (livrosResultado !== null) {
        res.status(200).json(livrosResultado);
      } else {
        res.status(404).send({ message: "Id do livro não encontrado." });
      }
    } catch (erro) {
      next(erro);
    }
  };

  static listarLivroPorId = async (req, res, next) => {
    try {
      const busca = await processaBusca(req.query);

      if (busca !== null) {
        const livroResultados = await livros.find(busca).populate("autor");

        res.status(200).send(livroResultados);
      } else {
        next(new NaoEncontrado("Livro não encontrado!"));
      }
    } catch (erro) {
      next(erro);
    }
  };

  static cadastrarLivro = async (req, res, next) => {
    try {
      let livro = new livros(req.body);

      const livroResultado = await livro.save();

      res.status(201).send(livroResultado.toJSON());
    } catch (erro) {
      next(erro);
    }
  };

  static atualizarLivro = async (req, res, next) => {
    try {
      const id = req.params.id;

      const livroResultado = await livros.findByIdAndUpdate(id, {
        $set: req.body,
      });
      if (livroResultado !== null) {
        res.status(200).send({ message: "Livro atualizado com sucesso!" });
      } else {
        next(new NaoEncontrado("Id do livro não encontrado!"));
      }
    } catch (erro) {
      next(erro);
    }
  };

  static excluirLivro = async (req, res, next) => {
    try {
      const id = req.params.id;

      const livroResultado = await livros.findByIdAndDelete(id);
      if (livroResultado !== null) {
        res.status(200).send({ message: "Livro removido com sucesso!" });
      } else {
        next(new NaoEncontrado("Id do livro não encontrado!"));
      }
    } catch (erro) {
      next(erro);
    }
  };

  static listarLivroPorFiltro = async (req, res, next) => {
    try {
      const busca = await processaBusca(req.query);

      if (busca !== null) {
        const livrosResultado = await livros.find(busca).populate("autor");

        res.status(200).send(livrosResultado);
      } else {
        next(new NaoEncontrado("Id do livro não encontrado!"));
      }
    } catch (erro) {
      next(erro);
    }
  };
}

async function processaBusca(paramentros) {
  const { editora, titulo, minPaginas, maxPaginas, nomeAutor } = paramentros;
  //const regex = new RegExp(titulo, "i");

  let busca = {};

  if (editora) busca.editora = editora;

  if (titulo) busca.titulo = { $regex: titulo, $options: "i" };

  if (minPaginas || maxPaginas) busca.numeroPaginas = {};

  if (minPaginas) busca.numeroPaginas.$gte = minPaginas;

  if (maxPaginas) busca.numeroPaginas.$lte = maxPaginas;

  if (nomeAutor) {
    const autor = await autores.findOne({ nome: nomeAutor });

    if (autor !== null) {
      busca.autor = autor._id;
    } else {
      busca = null;
    }
  }

  return busca;
}

export default LivroController;
