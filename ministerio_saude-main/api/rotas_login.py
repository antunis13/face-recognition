
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from src import db
from api.auth import criar_token_usuario


router = APIRouter()


class DadosLogin(BaseModel):
    usuario: str
    senha: str


@router.post("/login")
def login(dados: DadosLogin):
    usuario = db.verificar_login(
        dados.usuario.strip(),
        dados.senha
    )

    if usuario is None:
        raise HTTPException(
            status_code=401,
            detail="Usuário ou senha incorretos."
        )

    resposta = {
        "mensagem": "Login realizado com sucesso.",
        "usuario": usuario["usuario"],
        "tipo": usuario["tipo"],
        "token": criar_token_usuario(
            usuario["id"],
            usuario["tipo"]
        )
    }

    return resposta
