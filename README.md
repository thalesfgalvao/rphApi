# API REST

API REST desenvolvida em **Node.js + TypeScript**, destinada a fornecer os serviços de backend para uma aplicação frontend desenvolvida em React + TypeScript.

O projeto será desenvolvido seguindo boas práticas de desenvolvimento de software, com separação de responsabilidades, autenticação, autorização, validação de dados e persistência em banco de dados MySQL.

## 🚧 Status

Em desenvolvimento.

## 🛠️ Tecnologias

* Node.js
* TypeScript
* MySQL
* Yarn
* REST
* Git

As bibliotecas e ferramentas adicionais serão adicionadas conforme as necessidades do projeto.

## 📋 Pré-requisitos

Antes de executar o projeto, certifique-se de possuir instalado:

* Node.js
* Yarn
* MySQL
* Git

## 🚀 Instalação

Clone o repositório:

```bash
git clone <URL_DO_REPOSITORIO>
```

Entre no diretório:

```bash
cd <NOME_DO_PROJETO>
```

Instale as dependências:

```bash
yarn install
```

## ▶️ Execução

O projeto possui diferentes comandos para execução conforme o ambiente.

### Desenvolvimento

```bash
yarn dev
```

### Produção

```bash
yarn start
```

> Os scripts serão configurados conforme a estrutura da aplicação for implementada.

## 🗄️ Banco de dados

A aplicação utilizará **MySQL** como banco de dados.

As configurações de conexão e demais informações sensíveis deverão ser armazenadas em variáveis de ambiente e **não devem ser versionadas no Git**.

Exemplo:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=database_name
DB_USER=database_user
DB_PASSWORD=database_password
```

## 📁 Estrutura do projeto

A estrutura será organizada de acordo com as responsabilidades de cada componente da aplicação.

```text
src/
├── controllers/
├── services/
├── repositories/
├── routes/
├── middlewares/
├── models/
├── database/
└── app.ts
```

A estrutura poderá ser modificada conforme a aplicação evoluir.

## 🔐 Segurança

A API contará com mecanismos de segurança, incluindo:

* Hash seguro de senhas
* Autenticação
* Autorização
* Controle de permissões
* Validação de dados
* Tratamento adequado de erros
* Proteção de informações sensíveis através de variáveis de ambiente

## 🌐 API

A aplicação seguirá os princípios de uma **API REST**, utilizando os métodos HTTP de acordo com a responsabilidade de cada operação.

Exemplos:

```http
GET /users
GET /users/:id
POST /users
PUT /users/:id
DELETE /users/:id
```

Os endpoints serão documentados conforme forem implementados.

## 🌿 Git

O projeto utiliza Git para controle de versão.

A branch `dev` será utilizada como principal branch de desenvolvimento, enquanto `main` representará versões estáveis da aplicação.

Branches de funcionalidade seguirão, preferencialmente, o padrão:

```text
feature/nome-da-funcionalidade
```

Exemplo:

```text
feature/user-registration
```

Os commits seguirão uma convenção semântica, utilizando prefixos como:

```text
feat: nova funcionalidade
fix: correção de problema
chore: configuração/manutenção
refactor: refatoração
docs: documentação
test: testes
```

## 📌 Objetivo

O objetivo deste projeto é desenvolver uma API REST completa e estruturada, aplicando conceitos e boas práticas utilizadas no desenvolvimento profissional de aplicações backend.

O projeto será desenvolvido de forma incremental, adicionando funcionalidades conforme as regras de negócio da aplicação forem implementadas.
