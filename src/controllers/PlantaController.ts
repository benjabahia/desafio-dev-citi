import { Request, Response } from "express";
import * as PlantaRepository from "@repositories/PlantaRepository";

// A importação permite chamar as funções que construí anteriormente.

export const createPlanta = async (req: Request, res: Response) => {
  try {
    const {
      nome,
      especie,
      preco,
      estoque,
      luminosidade,
      petFriendly,
      regaACadaDias,
    } = req.body;

    if (
      nome === undefined ||
      especie === undefined ||
      preco === undefined ||
      estoque === undefined ||
      luminosidade === undefined ||
      petFriendly === undefined ||
      regaACadaDias === undefined
    ) {
      return res.status(400).json({
        message: "Preencha todos os campos obrigatórios.",
      });
    }

    if (
      typeof nome !== "string" ||
      nome.trim() === "" ||
      typeof especie !== "string" ||
      especie.trim() === ""
    ) {
      return res.status(400).json({
        message: "Nome e espécie devem ser textos não vazios.",
      });
    }

    if (
      typeof preco !== "number" ||
      !Number.isInteger(preco) ||
      preco <= 0 ||
      typeof estoque !== "number" ||
      !Number.isInteger(estoque) ||
      estoque < 0 ||
      typeof regaACadaDias !== "number" ||
      !Number.isInteger(regaACadaDias) ||
      regaACadaDias < 1
    ) {
      return res.status(400).json({
        message: "Verifique o preço, o estoque e o intervalo de rega.",
      });
    }

    if (typeof petFriendly !== "boolean") {
      return res.status(400).json({
        message: "petFriendly deve ser true ou false.",
      });
    }

    const luminosidadesValidas = [
      "SOMBRA",
      "MEIA_SOMBRA",
      "SOL_PLENO",
    ];

    if (!luminosidadesValidas.includes(luminosidade)) {
      return res.status(400).json({
        message: "Luminosidade inválida.",
      });
    }

    const planta = await PlantaRepository.createPlanta({
      nome: nome,
      especie: especie,
      preco: preco,
      estoque: estoque,
      luminosidade: luminosidade,
      petFriendly: petFriendly,
      regaACadaDias: regaACadaDias,
    });

    return res.status(201).json(planta);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erro ao criar planta.",
    });
  }
};

// Recebe os dados: req.body contém os dados enviados na requisição. 
// Verifica os campos obrigatórios: rejeita o cadastro se algum campo estiver ausente. 
// Valida os textos: nome e espécie precisam ser textos não vazios.
// Valida os números: o preço deve ser um inteiro positivo; o estoque pode ser zero; o intervalo de rega deve ser um inteiro positivo. 
// Valida os tipos: petFriendly precisa ser booleano, aceitando tanto true quanto false.
// Valida a luminosidade: só aceita os três valores definidos no enum do Prisma. 
// Chama o repositório: PlantaRepository.createPlanta() envia os dados para o banco. 
// Responde à requisição: retorna 201 Created com os dados da planta criada.

// Além disso, se ocorrer um erro inesperado, o catch registra o erro e retorna 500.


export const readAllPlantas = async (req: Request, res: Response) => {
  try {
    const { luminosidade, petFriendly } = req.query;

    if (
      luminosidade !== undefined &&
      (typeof luminosidade !== "string" ||
        !["SOMBRA", "MEIA_SOMBRA", "SOL_PLENO"].includes(luminosidade))
    ) {
      return res.status(400).json({
        message: "Luminosidade inválida.",
      });
    }

    if (
      petFriendly !== undefined &&
      petFriendly !== "true" &&
      petFriendly !== "false"
    ) {
      return res.status(400).json({
        message: "O filtro petFriendly deve ser true ou false.",
      });
    }

    // Essa conversão da linha 135 fa com que "true" -> true; "false" -> false e ausência de parâmetro -> undefined
    const plantas = await PlantaRepository.findAllPlantas(
      luminosidade as string | undefined,
      petFriendly === undefined ? undefined : petFriendly === "true"
    );

    return res.status(200).json(plantas);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao buscar plantas.",
    });
  }
};

// .json(plantas): envia as plantas ao cliente no formato JSON.
// .findAllPlantas(): chama a função que criei anteriormente, a qual busca todas as plantas.


export const readPlantaById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "O ID deve ser um número inteiro positivo.",
      });
    }

    const planta = await PlantaRepository.findPlantaById(id);

    if (!planta) {
      return res.status(404).json({
        message: "Planta não encontrada.",
      });
    }

    return res.status(200).json(planta);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erro ao buscar planta.",
    });
  }
};



export const updatePlanta = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const dados = req.body;
    

    // Consulta o banco de dados para verificar se a planta existe.
    const planta = await PlantaRepository.findPlantaById(id);

    if (!planta) {
      return res.status(404).json({
        message: "Planta não encontrada.",
      });
    }


    // Verifica se o corpo da requisição é um objeto válido
    // e se contém pelo menos um campo para atualizar.
    if (
      dados === null ||
      typeof dados !== "object" ||
      Array.isArray(dados) ||
      Object.keys(dados).length === 0
    ) {
      return res.status(400).json({
        message: "Envie um objeto com pelo menos um campo para atualizar.",
      });
    }

    // Lista os campos que podem ser atualizados pelo cliente.
    const camposPermitidos = [
      "nome",
      "especie",
      "preco",
      "estoque",
      "luminosidade",
      "petFriendly",
      "regaACadaDias",
    ];


    // Verifica se o cliente enviou algum campo que não pode ser atualizado.
    if (Object.keys(dados).some((campo) => !camposPermitidos.includes(campo))) {
      return res.status(400).json({
        message: "A requisição contém campos inválidos.",
      });
    }

    // Se nome foi enviado, verifica se é um texto não vazio.
    if (
      dados.nome !== undefined &&
      (typeof dados.nome !== "string" || dados.nome.trim() === "")
    ) {
      return res.status(400).json({
        message: "O nome deve ser um texto não vazio.",
      });
    }

    // Se espécie foi enviada, verifica se é um texto não vazio.
    if (
      dados.especie !== undefined &&
      (typeof dados.especie !== "string" || dados.especie.trim() === "")
    ) {
      return res.status(400).json({
        message: "A espécie deve ser um texto não vazio.",
      });
    }

    // Se preço foi enviado, exige um número inteiro maior que zero.
    if (
      dados.preco !== undefined &&
      (
        typeof dados.preco !== "number" ||
        !Number.isInteger(dados.preco) ||
        dados.preco <= 0
      )
    ) {
      return res.status(400).json({
        message: "O preço deve ser um número inteiro maior que zero.",
      });
    }


    // Se estoque foi enviado, exige um inteiro maior ou igual a zero.

    if (
      dados.estoque !== undefined &&
      (
        typeof dados.estoque !== "number" ||
        !Number.isInteger(dados.estoque) ||
        dados.estoque < 0
      )
    ) {
      return res.status(400).json({
        message: "O estoque deve ser um número inteiro maior ou igual a zero.",
      });
    }

    // Se o intervalo de rega foi enviado, exige um inteiro positivo.
    if (
      dados.regaACadaDias !== undefined &&
      (
        typeof dados.regaACadaDias !== "number" ||
        !Number.isInteger(dados.regaACadaDias) ||
        dados.regaACadaDias < 1
      )
    ) {
      return res.status(400).json({
        message: "O intervalo de rega deve ser um número inteiro maior ou igual a 1.",
      });
    }
    
    // Se petFriendly foi enviado, exige apenas true ou false.
    if (
      dados.petFriendly !== undefined &&
      typeof dados.petFriendly !== "boolean"
    ) {
      return res.status(400).json({
        message: "petFriendly deve ser true ou false.",
      });
    }

    const luminosidadesValidas = [
      "SOMBRA",
      "MEIA_SOMBRA",
      "SOL_PLENO",
    ];

    // Se luminosidade foi enviada, verifica se pertence à lista permitida.
    if (
      dados.luminosidade !== undefined &&
      !luminosidadesValidas.includes(dados.luminosidade)
    ) {
      return res.status(400).json({
        message: "Luminosidade inválida.",
      });
    }


    // Envia o ID e os campos validados ao repositório.
    // O Prisma atualiza somente os campos fornecidos.
    // Guarda a planta atualizada na variável updatedPlanta.
    const updatedPlanta = await PlantaRepository.updatePlanta(id, dados);

    return res.status(200).json(updatedPlanta);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erro ao atualizar planta.",
    });
  }
};

// obs:
// Object.keys(dados) obtém os nomes dos campos enviados.
// some() verifica se pelo menos um elemento satisfaz a condição.
//includes(campo) verifica se o nome está na lista permitida.
// ! inverte o resultado: procuro um campo que NÃO esteja na lista.


export const deletePlanta = async (req: Request, res: Response) => {
  try {

    // O ID chega da URL como texto, então o converto para número.
    const id = Number(req.params.id);

    // Busca a planta no banco de dados usando seu ID.
    const planta = await PlantaRepository.findPlantaById(id);

    // Verifica se a busca não encontrou uma planta.
    if (!planta) {
      // Retorna 404 (Not Found) se a planta não existir.
      return res.status(404).json({
        message: "Planta não encontrada.",
      });
    }

    // Exclui a planta do banco de dados.
    await PlantaRepository.deletePlanta(id);

    // Retorna 204 (No Content), indicando que a exclusão foi concluída.
    return res.status(204).send();
  } catch (error) {
    // Exibe detalhes do erro no terminal para ajudar na depuração.
    console.error(error);

    // Retorna 500 (Internal Server Error) se ocorrer um erro inesperado.
    return res.status(500).json({
      message: "Erro ao deletar planta.",
    });
  }
};

// Exemplo do funcionamento dessa função:
// Enviam uma requisição para excluir a planta de ID 7: DELETE /plantas/7
// Converte o ID: transforma "7" no número 7.
// Procura a planta: consulta o banco de dados para verificar se existe uma planta com esse ID.
// Se a planta não existir, retorna 404 e encerra a função. Se existir, continua para a próxima instrução.
// Exclui a planta: chama PlantaRepository.deletePlanta(7).
// Confirma o sucesso: retorna 204.
// Se ocorrer um erro inesperado durante as operações do try, a execução passa para o catch.



export const sellPlanta = async (req: Request, res: Response) => {
  try {
    // Converte o ID recebido nos parâmetros da rota para número.
    const id = Number(req.params.id);

    // Valida se o ID é um inteiro positivo.
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "O ID deve ser um número inteiro positivo.",
      });
    }

    // Extrai o campo quantidade enviado no corpo da requisição.
    const { quantidade } = req.body;

    // Valida se a quantidade foi enviada, é um número, é um inteiro e é maior do que zero.
    if (
      quantidade === undefined ||
      typeof quantidade !== "number" ||
      !Number.isInteger(quantidade) ||
      quantidade <= 0
    ) {
      // Retorna erro 400 se a quantidade for inválida.
      return res.status(400).json({
        message: "A quantidade deve ser um número inteiro maior que zero.",
      });
    }

    // Procura a planta na base de dados para verificar existência e estoque atual.
    const planta = await PlantaRepository.findPlantaById(id);

    // Se a planta não for encontrada, retorna resposta 404 Not Found.
    if (!planta) {
      return res.status(404).json({ message: "Planta não encontrada." });
    }

    // Verifica se a quantidade solicitada é maior do que o estoque disponível.
    if (planta.estoque < quantidade) {
      // Retorna erro 400 indicando a falta de estoque sem alterar a base de dados.
      return res.status(400).json({
        message: `Estoque insuficiente. Estoque atual: ${planta.estoque}`,
      });
    }

    // Decrementa a quantidade vendida chamando a função do repositório.
    const updatedPlanta = await PlantaRepository.sellPlanta(id, quantidade);

    // Retorna status 200 OK com os dados atualizados da planta.
    return res.status(200).json(updatedPlanta);
  } catch (error) {
    // Regista a exceção no terminal.
    console.error(error);
    // Retorna erro 500 para falhas no servidor.
    return res.status(500).json({ message: "Erro ao realizar venda." });
  }
};

export const getEstoqueValorTotal = async (req: Request, res: Response) => {
  try {
    // Procura os campos preco e estoque de todas as plantas no banco de dados.
    const plantas = await PlantaRepository.getEstoqueInfo();

    // Executa um reduce no array de plantas para calcular o valor total em centavos e o total de vasos.
    const resultado = plantas.reduce(
      (acc, planta) => {
        // Multiplica o preço individual pelo estoque e acumula o valor total em centavos.
        acc.valorTotalEmCentavos += planta.preco * planta.estoque;
        // Soma a quantidade de estoque ao acumulador total de vasos.
        acc.totalDeVasos += planta.estoque;
        // Retorna o acumulador atualizado para a próxima iteração.
        return acc;
      },
      // Define os valores iniciais dos acumuladores como zero.
      { valorTotalEmCentavos: 0, totalDeVasos: 0 }
    );

    // Retorna status 200 OK com o objeto contendo os totais calculados.
    return res.status(200).json(resultado);
  } catch (error) {
    // Regista o erro no terminal.
    console.error(error);
    // Retorna erro 500 para falhas do servidor.
    return res.status(500).json({ message: "Erro ao calcular valor do estoque." });
  }
};