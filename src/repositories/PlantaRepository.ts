import { Prisma } from "@prisma/client";
import prisma from "@database";

// O prisma disponibiliza tipos para descrever os dados que enviaremos ao banco.
// E a segunda linha, faz eu conseguir ter acesso a ferramente que vai executar as operações no banco.

export const createPlanta = async (data: Prisma.PlantaCreateInput) => {
  return await prisma.planta.create({ data: data });
};

// export: permite que outros arquivos importem e utilizem essa função.
// async: indica que a função trabalha de maneira assíncrona, permitindo lidar com operações que podem demorar, como acessar um banco de dados.

// prisma.planta.create({ data: data }): Essa é a instrução que solicita a criação do registro.
// prisma.planta: acessa o modelo Planta.
// .create(): solicita a criação de um registro.
// { data: data }: informa quais dados devem ser utilizados nessa criação.

export const findAllPlantas = async (luminosidade?: string, petFriendly?: boolean) => {
 
  // Criei um objeto para armazenar os filtros:
  // Prisma.PlantaWhereInput é um tipo fornecido pelo Prisma que descreve as condições
  // que podemos utilizar na consulta de plantas.
  const filtros: Prisma.PlantaWhereInput = {};
  

  // Se houver uma luminosidade, adicionamos essa condição ao objeto
  if (luminosidade !== undefined) {
    filtros.luminosidade = luminosidade as Prisma.EnumLuminosidadeFilter["equals"];
  }

  if (petFriendly !== undefined) {
    filtros.petFriendly = petFriendly;
  }
  
  // O Prisma recebe as condições reunidas no objeto filtros.
  // Assim, os dois filtros podem ser utilizados juntos, separadamente ou não ser utilizados.
  return await prisma.planta.findMany({
    where: filtros,
  });
};

// prisma.planta.findMany(): solicita ao Prisma que busque todos os registros de plantas.
// Não precisa passar parâmetro porque não estou querendo buscar por ID, nome ou luminsoidade, quero buscar TODAS as plantas.


export const findPlantaById = async (id: number) => {
  return await prisma.planta.findUnique({ where: { id: id } });
};

// findUnique(): Busca um registro único com base em um identificador, o qual é passado como argumento da função.
// retorna os dados (que estão cadastrados no prisma) da planta que possui esse identificador.
// o findUnique() pode retornar null se não encontrar uma planta com aquele ID fornecido.

export const updatePlanta = async (id: number, data: Prisma.PlantaUpdateInput) => {
  return await prisma.planta.update({ where: { id: id }, data: data });
}

// data: Prisma.PlantaUpdateInput: recebe os campos que desejo alterar.
// prisma.planta.update(...): solicita ao Prisma a atualização do registro.

export const deletePlanta = async (id: number) => {
  return await prisma.planta.delete({ where: { id: id } });
};

// prisma.planta.delete(): solicita ao Prisma que exclua o registro.
// where: { id: id }: identifica qual registro será excluído.

// Venda de planta (decremento de estoque)
// Atualiza o registo utilizando a instrução decrement nativa do Prisma no campo estoque.
export const sellPlanta = async (id: number, quantidade: number) => {
  return await prisma.planta.update({
    where: { id: id },
    data: {
      estoque: {
        decrement: quantidade,
      },
    },
  });
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