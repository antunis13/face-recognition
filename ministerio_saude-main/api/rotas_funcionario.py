
import cv2
import numpy as np

from fastapi import APIRouter, Depends, File, UploadFile, HTTPException

from src import db
from src.reconhecimento import (
    extrai_embedding,
    similaridade_cosseno,
    LIMIAR,
)
from api.auth import (
    criar_token_usuario,
    exigir_funcionario,
    exigir_rosto_verificado,
)


router = APIRouter()


@router.post("/reconhecimento")
async def reconhecer_rosto(
    foto: UploadFile = File(...),
    funcionario=Depends(exigir_funcionario)
):
    usuario = db.buscar_funcionario_por_id(funcionario["id"])

    if usuario is None:
        raise HTTPException(
            status_code=404,
            detail="Funcionário não encontrado."
        )

    if usuario["encoding_facial"] is None:
        raise HTTPException(
            status_code=400,
            detail="Esta conta não possui biometria cadastrada."
        )

    conteudo = await foto.read()

    imagem = cv2.imdecode(
        np.frombuffer(conteudo, dtype=np.uint8),
        cv2.IMREAD_COLOR
    )

    if imagem is None:
        raise HTTPException(
            status_code=400,
            detail="A imagem enviada é inválida."
        )

    try:
        embedding_novo = extrai_embedding(imagem)
    except ValueError as erro:
        raise HTTPException(
            status_code=400,
            detail=str(erro)
        )

    similaridade = float(
        similaridade_cosseno(
            embedding_novo,
            usuario["encoding_facial"]
        )
    )

    if not np.isfinite(similaridade) or similaridade < LIMIAR:
        raise HTTPException(
            status_code=401,
            detail="Rosto não reconhecido para esta conta."
        )

    nivel = usuario["nivel_acesso"]

    if nivel is None:
        raise HTTPException(
            status_code=403,
            detail=(
                "Rosto reconhecido, mas seu nível de acesso "
                "ainda não foi atribuído pelo administrador."
            )
        )

    token_verificado = criar_token_usuario(
        usuario["id"],
        "funcionario",
        rosto_verificado=True
    )

    return {
        "mensagem": "Reconhecimento facial realizado com sucesso.",
        "id": usuario["id"],
        "usuario": usuario["nome"],
        "nivel_acesso": nivel,
        "similaridade": similaridade,
        "token": token_verificado
    }


@router.get("/funcionario/me")
def funcionario_atual(
    funcionario=Depends(exigir_rosto_verificado)
):
    usuario = db.buscar_funcionario_por_id(funcionario["id"])

    if usuario is None:
        raise HTTPException(
            status_code=404,
            detail="Funcionário não encontrado."
        )

    if usuario["nivel_acesso"] is None:
        raise HTTPException(
            status_code=403,
            detail="Seu nível de acesso ainda não foi atribuído."
        )

    return {
        "id": usuario["id"],
        "usuario": usuario["nome"],
        "nivel_acesso": usuario["nivel_acesso"]
    }
