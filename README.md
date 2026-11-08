# APS Face Recognition

O frontend usa [Yarn 1.22](https://classic.yarnpkg.com/). O comando `yarn` só funciona depois de instalar o Node.js e ativar o Yarn.

Os comandos abaixo devem ser executados na pasta raiz do projeto, onde está o arquivo `package.json`.

## 1. Instalar o Node.js

O arquivo `.nvmrc` fixa o Node **22**, a versão usada no projeto. O Next.js aceita Node `20.9` ou mais recente.

Quem usa [nvm](https://github.com/nvm-sh/nvm) instala e ativa essa versão com:

```bash
nvm install
nvm use
```

Sem o nvm, baixe o Node.js **22 LTS** em [https://nodejs.org](https://nodejs.org) e instale. O `.nvmrc` só indica a versão. Ele não instala o Node sozinho.

Feche o terminal e abra outro. Confira a instalação:

```bash
node -v
npm -v
```

Os dois comandos precisam mostrar um número de versão. Se aparecer `command not found` ou “não é reconhecido”, o Node não entrou no PATH: feche o terminal, abra de novo e, se continuar, reinstale o Node marcando a opção de adicionar ao PATH.

## 2. Ativar o Yarn

O Node já traz o Corepack, que instala o Yarn usado por este projeto (`1.22.22`):

```bash
corepack enable
corepack prepare yarn@1.22.22 --activate
yarn -v
```

`yarn -v` deve mostrar `1.22.22`.

Se `corepack` não for reconhecido, instale o Yarn pelo npm e abra outro terminal:

```bash
npm install -g yarn
yarn -v
```

## 3. Instalar as dependências e subir o frontend

```bash
yarn install
yarn dev
```

O frontend fica em [http://localhost:3000](http://localhost:3000).

## 4. Subir a API

A API fica em `ministerio_saude-main` e usa Python 3.12. Em outro terminal, entre nessa pasta:

```bash
cd ministerio_saude-main
python3 -m venv .venv
```

Ative o ambiente virtual.

macOS e Linux:

```bash
source .venv/bin/activate
```

Windows:

```bash
.venv\Scripts\activate
```

Instale as dependências, crie a chave de criptografia e o banco, e suba o servidor:

```bash
pip install -r requirements.txt
python -c "from cryptography.fernet import Fernet; open('.env','w').write('FERNET_KEY=' + Fernet.generate_key().decode())"
python banco/criar_banco.py
python -m uvicorn api.main:app --reload --host 127.0.0.1 --port 8000
```

A API fica em [http://127.0.0.1:8000](http://127.0.0.1:8000) e a documentação em [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

O script do banco cria o administrador padrão `administrador` com a senha `123123`. Se o arquivo `.env` já existir, não rode de novo o comando que gera a `FERNET_KEY`: uma chave nova não abre os dados faciais gravados com a chave anterior.
