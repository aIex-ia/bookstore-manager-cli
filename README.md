# BookStore Manager CLI

Um sistema de gerenciamento de livraria via linha de comando (CLI) construído inteiramente com Node.js e TypeScript.

## Descrição do Projeto
Esta aplicação nasceu da necessidade de informatizar o controle de uma pequena livraria. Ao invés de usar planilhas ou cadernos, o sistema permite que o usuário gerencie o cadastro de autores, o acervo de livros, os clientes e todo o fluxo de empréstimos, tudo isso diretamente pelo terminal. O projeto foi construído pensando em escalabilidade e manutenção, aplicando os princípios do Clean Code e SOLID.

## Objetivo
O objetivo principal é consolidar conhecimentos em back-end, criando uma aplicação real que se conecta a um banco de dados relacional. Ele atende a todos os requisitos propostos para o projeto final, demonstrando o uso prático de Programação Orientada a Objetos, tipagem estática e arquitetura em camadas.

## Tecnologias Utilizadas
- **Linguagem:** TypeScript (rodando sobre Node.js via `tsx`).
- **Banco de Dados:** PostgreSQL.
- **Driver de Conexão:** Biblioteca `pg` (optamos por não usar ORMs para praticar consultas SQL nativas).
- **Ambiente:** `dotenv` para lidar com as variáveis de ambiente sem expor dados sensíveis.

## Arquitetura e Estrutura de Pastas
O projeto segue uma arquitetura baseada em camadas para separar bem as responsabilidades, facilitando a reutilização de código:

- **`src/main.ts`**: É o coração que dá o pontapé inicial no sistema e inicializa o menu.
- **`src/menus/`**: Concentra a interface do menu principal.
- **`src/controllers/`**: Faz o meio de campo entre o que o usuário digita no terminal e o resto do sistema.
- **`src/services/`**: Onde a mágica acontece. Aqui ficam as regras de negócio (ex: verificar se um livro tem estoque antes de emprestar ou impedir e-mails duplicados de clientes).
- **`src/repositories/`**: A única camada que conversa de fato com o banco de dados. Isolamos o SQL puro aqui.
- **`src/models/`**: As interfaces do TypeScript que garantem que as entidades possuam os atributos corretos ao longo do sistema.
- **`src/database/`**: Onde fica a configuração de conexão (`connection.ts`) e nosso script DDL de criação de tabelas (`schema.sql`).
- **`src/utils/`**: Funções auxiliares.

## Configuração do Banco de Dados
Para o sistema funcionar, você precisa do PostgreSQL rodando localmente (ou em nuvem).

1. Crie um banco de dados vazio chamado `bookstore`.
2. Na raiz do projeto, crie ou altere o arquivo `.env` com as suas credenciais reais:
   ```env
   DB_USER=postgres
   DB_PASSWORD=suasenha
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=bookstore
   ```
3. Abra sua ferramenta de banco de dados (como o pgAdmin ou DBeaver), conecte-se e rode todo o código que está dentro do arquivo `src/database/schema.sql`. Isso vai criar as tabelas `autores`, `livros`, `clientes` e `emprestimos` pra você.

## Instalação
Clone o projeto na sua máquina e instale as dependências utilizando o NPM.
```bash
git clone https://github.com/aIex-ia/bookstore-manager-cli.git
cd bookstore-manager-cli
npm install
```

## Execução
Com o banco configurado e as dependências instaladas, basta rodar o comando abaixo para iniciar a aplicação via terminal:
```bash
npm run dev
```

## Funcionalidades Implementadas
O sistema atende a todos os requisitos funcionais levantados no escopo:
- Cadastro, listagem, consulta, atualização e remoção (CRUD completo) de Autores, Livros e Clientes.
- Controle de Empréstimos (valida se o cliente e o livro existem, e checa se a quantidade em estoque é maior que zero).
- Registro de Devoluções (atualiza automaticamente a data de devolução utilizando `CURRENT_DATE` do banco e devolve o item pro estoque).
- Menu de Relatórios Gerenciais com consultas SQL complexas utilizando `JOIN`, `LEFT JOIN`, `GROUP BY` e `COUNT`.

## Exemplos de Utilização
Se você quiser realizar um empréstimo, o fluxo seria:
1. Cadastrar um **Autor** no menu correspondente (anote o ID).
2. Cadastrar um **Livro** usando o ID desse autor e definir a quantidade em estoque, por exemplo, `3`.
3. Cadastrar um **Cliente**.
4. Ir no menu de **Empréstimos** e informar o ID do livro e do cliente. 
5. O sistema vai confirmar o empréstimo de forma assíncrona e o estoque do livro vai cair automaticamente para `2`.


