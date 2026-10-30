# Relatório de Desenvolvimento - Desafio Back-End Folhagem & Cia

## 1. O que foi feito
Foi desenvolvida uma API para o gerenciamento de plantas da loja fictícia Folhagem & Cia, contemplando as operações de criação, consulta, atualização e exclusão de registros. Além das funcionalidades básicas de CRUD, a API permite filtrar as plantas por luminosidade e pela compatibilidade com animais de estimação, realizar vendas com atualização do estoque e consultar o valor total dos produtos disponíveis.

Também foram implementadas validações para garantir a integridade dos dados, como a obrigatoriedade dos campos no cadastro, a restrição de valores inválidos e a verificação da existência de uma planta antes de determinadas operações. Para tornar o comportamento da API consistente, foram utilizadas respostas HTTP adequadas para situações de sucesso e erro.

## 2. Como foi feito
O desenvolvimento foi realizado utilizando TypeScript, Express, Prisma ORM e PostgreSQL, com o ambiente de banco de dados configurado por meio do Docker.

A implementação foi organizada em rotas, controllers e repository, separando o recebimento das requisições, o tratamento das regras de negócio e o acesso ao banco de dados. O Prisma foi utilizado para intermediar as operações com o PostgreSQL, enquanto o Express ficou responsável pelo gerenciamento das rotas e das respostas HTTP.

Durante o desenvolvimento, as funcionalidades foram implementadas gradualmente e testadas com o Thunder Client, permitindo verificar as respostas da API tanto em situações válidas quanto em cenários de erro. Esse processo possibilitou identificar problemas, corrigir comportamentos inesperados e validar o funcionamento das funcionalidades implementadas.


## 3. As principais dificuldades
Por ser meu primeiro contato com a construção de APIs e com a linguagem TypeScript, a principal dificuldade que enfrentei foi no tratamento e validação de erros. Inicialmente, pela falta de bagagem técnica prévia nesses conceitos, eu não sabia quais comandos, verificações ou estruturas condicionais utilizar para capturar e responder adequadamente a cenários inválidos.

No entanto, ao longo do desafio, encarei cada erro  como uma oportunidade de aprendizado, compreendi como manipular tipos, tratar valores nulos ou indefinidos e estruturar as respostas HTTP corretas (como 400 e 404). Fiquei bastante feliz com minha evolução ao longo do desafio.

## 4. O uso de IA
Por eu só ter tido um contato mais aprofundado com Python até então, eu sei a Inteligência Artificial como um tutor. Consultei a ferramenta para entender a sintaxe, a estrutura dos comandos de CRUD e a lógica por trás de cada etapa da implementação. O processo seguiu um ritmo gradual e bem passo-a-passo: eu implementava os comandos aos poucos e, em cada etapa, pedia explicações sobre a construção da API e os detalhes da sintaxe do TypeScript.

## Funcionalidades bônus

Além das operações básicas de CRUD para plantas, foram implementadas as seguintes funcionalidades adicionais:

### 1. Busca por nome

Permite pesquisar plantas pelo nome utilizando uma correspondência parcial, sem diferenciar letras maiúsculas e minúsculas.

**Exemplo de requisição:**

`GET /plantas?nome=costela`

### 2. Ordenação de plantas

Permite ordenar a listagem de plantas por nome ou preço, em ordem crescente.

**Exemplos de requisição:**

- `GET /plantas?ordem=nome` — ordena por nome.
- `GET /plantas?ordem=preco` — ordena por preço.

A busca por nome pode ser combinada com a ordenação e com os filtros disponíveis.

**Exemplo:**

`GET /plantas?nome=a&ordem=preco`

### 3. Listagem de plantas esgotadas

Disponibiliza um endpoint para consultar exclusivamente as plantas cujo estoque seja igual a zero.

**Exemplo de requisição:**

`GET /plantas/esgotadas`

### Combinação de filtros

A listagem de plantas também permite combinar os parâmetros de busca por nome, luminosidade, `petFriendly` e ordenação, conforme os parâmetros disponíveis na API.