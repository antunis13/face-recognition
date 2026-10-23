
import sys
from pathlib import Path

RAIZ_PROJETO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ_PROJETO))

import cv2
from src import db, reconhecimento

def reconhecer_pelo_terminal():
    print("========== RECONHECIMENTO FACIAL ==========")

    funcionarios = db.listar_funcionarios()

    caminho_digitado = input("Digite o caminho da imagem para reconhecimento: ").strip()

    caminho_imagem = Path(caminho_digitado)

    caminho_imagem = caminho_imagem.resolve()

    if not caminho_imagem.is_file():
        raise FileNotFoundError(
            f"Imagem não encontrada: {caminho_imagem}"
        )

    imagem = cv2.imread(str(caminho_imagem))

    if imagem is None:
        raise ValueError(
            "Não foi possível abrir a imagem informada."
        )

    embedding_novo = reconhecimento.extrai_embedding(imagem)

    resultado = reconhecimento.reconhecer(embedding_novo,funcionarios)

    print("\n========== RESULTADO ==========")
    print(f"Usuário: {resultado['nome']}")

    if resultado["id"] != 0:
        print(f"ID: {resultado['id']}")

        if resultado.get("tipo") is not None:
            print(f"Tipo: {resultado['tipo']}")

        nivel = resultado["nivel_acesso"]

        if nivel is None:
            print("Nível de acesso: ainda não atribuído")
        else:
            print(f"Nível de acesso: {nivel}")

        print(
            f"Similaridade: {resultado['similaridade']:.4f}"
        )
    else:
        print("Nenhum usuário reconhecido.")
