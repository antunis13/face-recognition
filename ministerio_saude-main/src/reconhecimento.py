import cv2
import numpy as np
from pathlib import Path
from insightface.app import FaceAnalysis

_modelo = None

"""caminho_imagem = Path(__file__).resolve().parent.parent / "fotos_teste.py" / "minha_foto.jpeg"
img = cv2.imread(str(caminho_imagem))
#lê a imagem e armazena os pixels dela na variável "img"
"""


def carrega_modelo():   #função que carrega modelo de reconhecimento facial
    global _modelo
    if _modelo is None:
        _modelo = FaceAnalysis(name="buffalo_l") #cria o modelo "buffalo_l" do InsightFace
        _modelo.prepare(ctx_id=0, det_thresh=0.6, det_size=(640, 640)) # det_thresh define o nível mínimo de confiança para aceitar uma detecção de rosto
    return _modelo

def extrai_embedding(img):     #função que recebe uma imagem e extrai o embedding do rosto encontrado
    modelo = carrega_modelo()
    rostos = modelo.get(img)
    if len(rostos) == 0:       
        raise ValueError("Nenhum rosto encontrado na imagem.")
    return rostos[0].embedding

def similaridade_cosseno(embedding1, embedding2):  #função que calcula a similaridade entre dois embeddings
    produto_escalar = embedding1 @ embedding2
    norm1 = np.linalg.norm(embedding1)
    norm2 = np.linalg.norm(embedding2)
    return produto_escalar / (norm1 * norm2)

if __name__ == "__main__":
    caminho_imagem = Path(__file__).resolve().parent.parent / "fotos_teste.py" / "minha_foto.jpeg"
    img = cv2.imread(str(caminho_imagem))
    if img is None:
        raise ValueError(f"Não foi possível ler a imagem em {caminho_imagem}")  
    #envia a imagem para a função e recebe o embedding do rosto
    embedding = extrai_embedding(img)

    print("Embedding:", embedding) #printa o embedding completo

    score = similaridade_cosseno(embedding, embedding) #calcula a similaridade entre o embedding e ele mesmo, que deve ser 1,0

    print("Tamanho do embedding:", embedding.shape) #printa o tamanho do embedding
    print("Similaridade (tem que ser entre 1,0):", score) #printa a similaridade entre o embedding e ele mesmo

LIMIAR = 0.45


def reconhecer(embedding_novo, funcionarios):
    melhor_similaridade = None
    funcionario_reconhecido = None

    for funcionario in funcionarios:
        # Ignora usuários sem rosto cadastrado
        if funcionario["encoding_facial"] is None:
            continue

        score = similaridade_cosseno(embedding_novo, funcionario["encoding_facial"])

        if score > LIMIAR and (melhor_similaridade is None or score > melhor_similaridade):
            melhor_similaridade = score
            funcionario_reconhecido = funcionario

    if funcionario_reconhecido is not None:
        return {
            "id": funcionario_reconhecido["id"],
            "nome": funcionario_reconhecido["nome"],
            "nivel_acesso": funcionario_reconhecido["nivel_acesso"],
            "similaridade": float(melhor_similaridade)
        }

    return {"id": 0, "nome": "Desconhecido", "nivel_acesso": None, "similaridade": 0.0}
