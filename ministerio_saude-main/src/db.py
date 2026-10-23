
import sqlite3
from pathlib import Path
import numpy as np
from src import seguranca


CAMINHO_BANCO = (Path(__file__).resolve().parent.parent / "banco" / "funcionarios.db")

def conectarNoBanco():
    return sqlite3.connect(CAMINHO_BANCO)

def cadastrar_funcionario(usuario, senha, embedding_criptografado):
    conexao = conectarNoBanco()
    try:
        conexao.execute(
            "INSERT INTO usuarios (usuario, senha, encoding_facial, nivelDeAcesso, tipo) VALUES (?, ?, ?, NULL, 'funcionario')",
            (usuario, senha, embedding_criptografado)
        )
        conexao.commit()
    finally:
        conexao.close()


def listar_funcionarios():
    conexao = conectarNoBanco()
    resultado = conexao.execute( "SELECT id, usuario, nivelDeAcesso, encoding_facial, tipo FROM usuarios"
    ).fetchall()
    conexao.close()

    funcionarios = []
    for linha in resultado:
        if linha[3] is None:
            embedding = None
        else:
            embedding_bytes = seguranca.descriptografar_dado(linha[3])
            embedding = np.frombuffer(embedding_bytes, dtype=np.float32)
        funcionarios.append({
            "id": linha[0],
            "nome": linha[1],
            "nivel_acesso": linha[2],
            "encoding_facial": embedding,
            "tipo": linha[4]
        })

    return funcionarios

#criei essa função para mostrar os usuarios cadastrados no terminal, para testar o funcionamento
def mostrar_banco():
    print("\n========== USUÁRIOS CADASTRADOS ==========")

    usuarios = listar_funcionarios()

    if not usuarios:
        print("O banco de dados está vazio.")
        return

    for usuario in usuarios:
        print("----------------------------------------")
        print(f"ID: {usuario['id']}")
        print(f"Usuário: {usuario['nome']}")
        print(f"Tipo: {usuario['tipo']}")

        nivel = usuario["nivel_acesso"]

        if nivel is None:
            print("Nível de acesso: ainda não atribuído")
        else:
            print(f"Nível de acesso: {nivel}")

        if usuario["encoding_facial"] is None:
            print("Imagem facial: não cadastrada")
        else:
            print("Imagem facial: cadastrada")

    print("----------------------------------------")
    print(f"Total de registros: {len(usuarios)}")


def verificar_login(usuario, senha):
    conexao = conectarNoBanco()

    try:
        resultado = conexao.execute("""
            SELECT id, usuario, senha, tipo
            FROM usuarios
            WHERE usuario = ?
        """, (usuario,)).fetchone()
    finally:
        conexao.close()

    if resultado is None or resultado[2] != senha:
        return None

    return {
        "id": resultado[0],
        "usuario": resultado[1],
        "tipo": resultado[3]
    }


def listar_usuarios_painel():
    conexao = conectarNoBanco()

    try:
        resultado = conexao.execute("""
            SELECT id, usuario, nivelDeAcesso
            FROM usuarios
            WHERE tipo = 'funcionario'
            ORDER BY id ASC
        """).fetchall()
    finally:
        conexao.close()

    return [
        {
            "id": linha[0],
            "nome": linha[1],
            "nivel_acesso": linha[2]
        }
        for linha in resultado
    ]


def atualizar_nivel_acesso(id_usuario, nivel):
    if nivel not in (None, 1, 2, 3):
        raise ValueError("Nível de acesso inválido.")

    conexao = conectarNoBanco()

    try:
        cursor = conexao.execute("""
            UPDATE usuarios
            SET nivelDeAcesso = ?
            WHERE id = ? AND tipo = 'funcionario'
        """, (nivel, id_usuario))

        if cursor.rowcount == 0:
            conexao.rollback()
            return False

        conexao.commit()
        return True
    finally:
        conexao.close()


def buscar_funcionario_por_id(id_usuario):
    conexao = conectarNoBanco()

    try:
        resultado = conexao.execute("""
            SELECT id, usuario, encoding_facial, nivelDeAcesso, tipo
            FROM usuarios
            WHERE id = ? AND tipo = 'funcionario'
        """, (id_usuario,)).fetchone()
    finally:
        conexao.close()

    if resultado is None:
        return None

    if resultado[2] is None:
        embedding = None
    else:
        embedding_bytes = seguranca.descriptografar_dado(resultado[2])
        embedding = np.frombuffer(embedding_bytes, dtype=np.float32)

    return {
        "id": resultado[0],
        "nome": resultado[1],
        "encoding_facial": embedding,
        "nivel_acesso": resultado[3],
        "tipo": resultado[4]
    }
