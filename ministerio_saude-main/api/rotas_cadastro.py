
import sqlite3

import cv2
import numpy as np

from fastapi import APIRouter, Form, File, UploadFile, HTTPException

from src import db, seguranca
from src.reconhecimento import extrai_embedding


router = APIRouter()


@router.post("/cadastro", status_code=201)
async def cadastrar(
    usuario: str = Form(...),
    senha: str = Form(...),
    foto: UploadFile = File(...)
):
    usuario = usuario.strip()

    if not usuario or not senha:
        raise HTTPException(
            status_code=400,
            detail="Usuário e senha são obrigatórios."
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
        embedding = extrai_embedding(imagem)
    except ValueError as erro:
        raise HTTPException(
            status_code=400,
            detail=str(erro)
        )

    embedding_bytes = embedding.astype(np.float32).tobytes()

    embedding_criptografado = seguranca.criptografar_dado(
        embedding_bytes
    )

    try:
        db.cadastrar_funcionario(
            usuario,
            senha,
            embedding_criptografado
        )
    except sqlite3.IntegrityError:
        raise HTTPException(
            status_code=409,
            detail="Esse usuário já está cadastrado."
        )

    return {
        "mensagem": "Funcionário cadastrado com sucesso!",
        "usuario": usuario,
        "nivel_acesso": None
    }
