
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api import (
    rotas_login,
    rotas_cadastro,
    rotas_funcionario,
    rotas_admin,
)


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def inicio():
    return {
        "mensagem": "API do Ministério da Saúde funcionando!"
    }


app.include_router(rotas_login.router)
app.include_router(rotas_cadastro.router)
app.include_router(rotas_funcionario.router)
app.include_router(rotas_admin.router)
