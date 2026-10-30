import { Prisma } from "@prisma/client";
import prisma from "@database";

// O prisma disponibiliza tipos para descrever os dados que enviaremos ao banco.
// E a segunda linha, faz eu conseguir ter acesso a ferramenta que vai executar as operações no banco.

export const createPlanta = async (data: Prisma.PlantaCreateInput) => {
  return await prisma.planta.create({ data: data });
};

// export: permite que outros arquivos importem e utilizem essa função.
// async: indica que a função trabalha de maneira assíncrona, permitindo lidar com operações que podem demorar, como acessar um banco de dados.

// prisma.planta.create({ data: data }): Essa é a instrução que solicita a criação do registro.
// prisma.planta: acessa o modelo Planta.
// .create(): solicita a criação de um registro.
// { data: data }: informa quais dados devem ser utilizados nessa criação.

export const findAllPlantas = async (
  luminosidade?: string,
  petFriendly?: boolean,
  nome?: string,
  ordem?: string
) => {
  // Criei um objeto para armazenar os filtros:
  // Prisma.PlantaWhereInput é um tipo fornecido pelo Prisma que descreve as condições
  // que podemos utilizar na consulta de plantas.
  const filtros: Prisma.PlantaWhereInput = {};

  // Se houver uma luminosidade, adicionamos essa condição ao objeto
  if (luminosidade !== undefined) {
    filtros.luminosidade =
      luminosidade as Prisma.EnumLuminosidadeFilter["equals"];
  }

  if (petFriendly !== undefined) {
    filtros.petFriendly = petFriendly;
  }

  // BÔNUS 1: busca plantas pelo nome sem diferenciar maiúsculas e minúsculas.
  if (nome !== undefined && nome.trim() !== "") {
    filtros.nome = {
      contains: nome,
      mode: "insensitive",
    };
  }

  // BÔNUS 2: define a ordenação das plantas por preço ou nome.
  let orderBy: Prisma.PlantaOrderByWithRelationInput | undefined;

  if (ordem === "preco") {
    orderBy = { preco: "asc" };
  } else if (ordem === "nome") {
    orderBy = { nome: "asc" };
  }

  // O Prisma recebe as condições reunidas no objeto filtros.
  // Assim, os filtros podem ser utilizados juntos, separadamente ou não ser utilizados.
  return await prisma.planta.findMany({
    where: filtros,
    orderBy: orderBy,
  });
};

// prisma.planta.findMany(): solicita ao Prisma que busque todos os registros de plantas.
// Os filtros e a ordenação são opcionais, permitindo buscar todas as plantas ou refinar os resultados.

export const findPlantaById = async (id: number) => {
  return await prisma.planta.findUnique({ where: { id: id } });
};

// findUnique(): Busca um registro único com base em um identificador, o qual é passado como argumento da função.
// retorna os dados (que estão cadastrados no prisma) da planta que possui esse identificador.
// o findUnique() pode retornar null se não encontrar uma planta com aquele ID fornecido.

export const updatePlanta = async (
  id: number,
  data: Prisma.PlantaUpdateInput
) => {
  return await prisma.planta.update({ where: { id: id }, data: data });
};

// data: Prisma.PlantaUpdateInput: recebe os campos que desejo alterar.
// prisma.planta.update(...): solicita ao Prisma a atualização do registro.

export const deletePlanta = async (id: number) => {
  return await prisma.planta.delete({ where: { id: id } });
};

// prisma.planta.delete(): solicita ao Prisma que exclua o registro.
// where: { id: id }: identifica qual registro será excluído.

// Venda de planta com atualização atômica e condicional
// Utiliza updateMany para atualizar o estoque apenas se a quantidade no banco for maior ou igual à solicitada.
// Isso impede condições de corrida em compras simultâneas diretamente no banco de dados.
export const sellPlanta = async (id: number, quantidade: number) => {
  const resultado = await prisma.planta.updateMany({
    where: {
      id: id,
      estoque: {
        gte: quantidade,
      },
    },
    data: {
      estoque: {
        decrement: quantidade,
      },
    },
  });

  return resultado.count > 0;
};

// Busca de dados agregados do estoque
// Função responsável por procurar os dados necessários para o cálculo do valor total do estoque.
// Procura todas as plantas trazendo apenas os campos preco e estoque para otimizar a consulta.
export const getEstoqueInfo = async () => {
  return await prisma.planta.findMany({
    select: {
      preco: true,
      estoque: true,
    },
  });
};

// BÔNUS 3: busca todas as plantas cujo estoque seja igual a zero.
export const findPlantasEsgotadas = async () => {
  return await prisma.planta.findMany({
    where: {
      estoque: 0,
    },
  });
};