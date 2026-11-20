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

Na pasta raiz do projeto:

```bash
yarn install
```

Para subir o frontend em desenvolvimento, use:

```bash
yarn dev
```

O frontend fica em [http://localhost:3000](http://localhost:3000). Deixe esse terminal aberto enquanto a API estiver rodando.

## 4. Subir a API

A API fica em `ministerio_saude-main` e usa Python 3.12. Em outro terminal, entre nessa pasta e crie o ambiente virtual com o Python 3.12.

macOS e Linux:

```bash
cd ministerio_saude-main
python3.12 -m venv .venv
```

Windows:

```bash
cd ministerio_saude-main
py -3.12 -m venv .venv
```

Se o comando não for encontrado, o Python 3.12 não está instalado. Baixe em [https://www.python.org/downloads/](https://www.python.org/downloads/) e tente de novo.

Ative o ambiente virtual.

macOS e Linux:

```bash
source .venv/bin/activate
```

Windows:

```bash
.venv\Scripts\activate
```

Instale as dependências:

```bash
pip install -r requirements.txt
```

Crie a chave de criptografia no arquivo `.env`. Os dados faciais são gravados com essa chave, e uma chave nova não abre o que foi gravado com a anterior. Por isso o comando abaixo só cria o `.env` quando ele ainda não existe. Não apague nem edite a `FERNET_KEY` de um `.env` em uso.

```bash
python -c "import os; from cryptography.fernet import Fernet; os.path.exists('.env') or open('.env','w').write('FERNET_KEY=' + Fernet.generate_key().decode())"
```

Crie o banco. O script pode ser rodado mais de uma vez: ele não apaga tabelas nem usuários existentes. Ele cria o administrador padrão `administrador` com a senha `123123`.

```bash
python banco/criar_banco.py
```

Suba o servidor:

```bash
python -m uvicorn api.main:app --reload --host 127.0.0.1 --port 8000
```

A API fica em [http://127.0.0.1:8000](http://127.0.0.1:8000) e a documentação em [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

Nas próximas vezes, basta entrar em `ministerio_saude-main`, ativar o ambiente virtual e rodar o comando do `uvicorn`.
