
from fastapi import APIRouter, Depends, Body, HTTPException

from src import db
from api.auth import exigir_admin


router = APIRouter()


@router.get("/admin/usuarios")
def listar_usuarios_admin(
    _admin=Depends(exigir_admin)
):
    return db.listar_usuarios_painel()


@router.patch("/admin/usuarios/{id_usuario}/nivel")
def alterar_nivel_admin(
    id_usuario: int,
    dados: dict = Body(...),
    _admin=Depends(exigir_admin)
):
    nivel = dados.get("nivel_acesso")

    if type(nivel) is not int or nivel not in (0, 1, 2, 3):
        raise HTTPException(
            status_code=400,
            detail="O nível deve ser 0, 1, 2 ou 3."
        )

    nivel_banco = None if nivel == 0 else nivel

    atualizado = db.atualizar_nivel_acesso(
        id_usuario,
        nivel_banco
    )

    if not atualizado:
        raise HTTPException(
            status_code=404,
            detail="Funcionário não encontrado."
        )

    return {
        "mensagem": "Nível de acesso atualizado!",
        "id": id_usuario,
        "nivel_acesso": nivel
    }
