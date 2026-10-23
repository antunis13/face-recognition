import json
import time

from cryptography.fernet import Fernet, InvalidToken
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from src import seguranca


bearer = HTTPBearer()


def criar_token_usuario(
    id_usuario: int,
    tipo: str,
    rosto_verificado: bool = False
):
    chave = seguranca.fernet_key

    if not chave:
        raise HTTPException(
            status_code=500,
            detail="A chave FERNET_KEY não está configurada."
        )

    conteudo = json.dumps({
        "id": id_usuario,
        "tipo": tipo,
        "exp": int(time.time()) + 3600,
        "rosto_verificado": rosto_verificado
    }).encode()

    fernet = Fernet(
        chave.encode() if isinstance(chave, str) else chave
    )

    return fernet.encrypt(conteudo).decode()


def ler_token(
    credenciais: HTTPAuthorizationCredentials
):
    chave = seguranca.fernet_key

    if not chave:
        raise HTTPException(
            status_code=500,
            detail="A chave FERNET_KEY não está configurada."
        )

    try:
        fernet = Fernet(
            chave.encode() if isinstance(chave, str) else chave
        )

        conteudo = fernet.decrypt(
            credenciais.credentials.encode()
        )

        dados = json.loads(conteudo)

        if dados.get("exp", 0) < time.time():
            raise HTTPException(
                status_code=401,
                detail="Sessão expirada. Faça login novamente."
            )

        return dados

    except HTTPException:
        raise
    except (InvalidToken, ValueError, json.JSONDecodeError):
        raise HTTPException(
            status_code=401,
            detail="Token inválido."
        )


def exigir_admin(
    credenciais: HTTPAuthorizationCredentials = Depends(bearer)
):
    dados = ler_token(credenciais)

    if dados.get("tipo") != "admin":
        raise HTTPException(
            status_code=403,
            detail="Acesso permitido somente ao administrador."
        )

    return dados


def exigir_funcionario(
    credenciais: HTTPAuthorizationCredentials = Depends(bearer)
):
    dados = ler_token(credenciais)

    if dados.get("tipo") != "funcionario":
        raise HTTPException(
            status_code=403,
            detail="Acesso permitido somente a funcionários."
        )

    return dados


def exigir_rosto_verificado(
    credenciais: HTTPAuthorizationCredentials = Depends(bearer)
):
    dados = ler_token(credenciais)

    if dados.get("tipo") != "funcionario":
        raise HTTPException(
            status_code=403,
            detail="Esta operação é exclusiva para funcionários."
        )

    if not dados.get("rosto_verificado", False):
        raise HTTPException(
            status_code=403,
            detail="Realize o reconhecimento facial primeiro."
        )

    return dados
