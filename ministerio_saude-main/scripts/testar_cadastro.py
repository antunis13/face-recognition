
import sys
from pathlib import Path

RAIZ_PROJETO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ_PROJETO))

import cv2
from src import db, reconhecimento, seguranca

#criei uma função pare receber o caminho da imagem via terminal
def obter_caminho_imagem():
    caminho_digitado = input("Digite o caminho da imagem: ").strip() #digite o caminho absoluto da imagem
    caminho = Path(caminho_digitado)

    if not caminho.is_file():
        raise FileNotFoundError(f"Imagem não encontrada: {caminho}")

    return caminho

def cadastrar_pelo_terminal():
    print("========== CADASTRO DE FUNCIONÁRIO ==========")

    usuario = input("Nome de usuário: ").strip()
    senha = input("Senha: ")

    if not usuario or not senha:
        print("Usuário e senha são obrigatórios.")
        return

    caminho_imagem = obter_caminho_imagem()
    imagem = cv2.imread(str(caminho_imagem))

    if imagem is None:
        raise ValueError(
            "Não foi possível abrir a imagem informada."
        )

    embedding = reconhecimento.extrai_embedding(imagem)
    embedding_bytes = embedding.tobytes()

    embedding_criptografado = (seguranca.criptografar_dado(embedding_bytes))

    db.cadastrar_funcionario(usuario, senha, embedding_criptografado)

    print(f"\nFuncionário '{usuario}' cadastrado com sucesso!")

