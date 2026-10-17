# Sistema Escolar

## Sobre o projeto

Este projeto consiste em um sistema web escolar desenvolvido como atividade acadêmica para o curso Técnico em Desenvolvimento de Sistemas.O sistema utiliza tecnologias web no front-end e uma API no back-end para trabalhar com um banco de dados MySQL.

O objetivo é organizar e gerenciar informações relacionadas ao ambiente escolar.

## Tecnologias utilizadas

- **HTML5:** estrutura das páginas.
- **CSS3:** estilização e layout.
- **JavaScript:** funcionalidades e interações do sistema.
- **Node.js:** ambiente de execução do back-end.
- **Express:** criação e organização das rotas da API.
- **MySQL:** armazenamento dos dados.
- **mysql2:** comunicação entre a aplicação e o banco de dados.

## Funcionalidades

O projeto possui módulos relacionados a:

- Alunos;
- Professores;
- Disciplinas;
- Turmas;
- Matrículas;
- Notas;
- Usuários.

Consulte o código-fonte para verificar as operações disponíveis em cada módulo.

## Estrutura do projeto

A estrutura principal inclui:

- `controller/`:controladores e arquivos relacionados às rotas da aplicação.
- `db/`:conexão com o banco de dados.
- `server.js`:inicialização do servidor.
- `package.json`:informações do projeto e dependências do Node.js.
- `package-lock.json`:registro das versões das dependências instaladas.
- `tabelinhas.sql`:arquivo SQL para consulta e configuração do banco, conforme seu conteúdo.
- `README.md`:documentação do projeto.

As páginas HTML,os arquivos CSS e os demais arquivos JavaScript ficam nos diretórios definidos pela estrutura atual do projeto.

## Requisitos

Para executar o projeto localmente,são necessários:

- Node.js e npm;
- MySQL Server;
- Um cliente MySQL, como o MySQL Workbench;
- Git, caso deseje clonar o repositório.

## Instalação

1. Clone o repositório ou baixe os arquivos do projeto.
2. Acesse a pasta do projeto pelo terminal.
3. Instale as dependências:
   `npm install`
4. Configure as variáveis de ambiente para a conexão com o banco de dados,conforme explicado na seção seguinte.
5. Prepare o banco de dados MySQL utilizando os scripts SQL necessários para o projeto.

## Configuração do banco de dados

O projeto utiliza um banco de dados MySQL local.

Crie um banco de dados com o nome `escola` ou configure o nome utilizado pela aplicação.Verifique o arquivo SQL do projeto para identificar as tabelas e os dados necessários.

As credenciais de acesso devem ser configuradas em um arquivo `.env` local,que não deve ser enviado ao GitHub.

Exemplo das variáveis necessárias,utilizando um arquivo `.env.example`:

- `DB_HOST`: endereço do servidor MySQL.
- `DB_USER`: usuário do banco de dados.
- `DB_PASSWORD`: senha do banco de dados.
- `DB_NAME`: nome do banco de dados.
- `DB_PORT`: porta do MySQL.

O arquivo `.env.example` serve como referência de configuração e não deve conter senhas reais.

## Como executar

1. Configure o banco de dados MySQL.
2. Preencha o arquivo `.env` com as credenciais locais.
3. Instale as dependências com `npm install`.
4. Inicie o servidor utilizando o comando com `node server.js`.
5. Acesse o endereço local configurado no servidor,normalmente `http://localhost:3000`,se essa for a porta definida no código.

## Segurança

- Não compartilhe senhas,tokens ou outras credenciais.
- O arquivo `.env` deve permanecer fora do controle de versão.
- A pasta `node_modules/` não precisa ser enviada ao repositório.
- Não inclua dados pessoais ou informações confidenciais nos scripts SQL.

## Status do projeto

Projeto acadêmico ja desenvolvido desenvolvimento.