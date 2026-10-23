
import sqlite3
from pathlib import Path

pasta_atual = Path(__file__).resolve().parent

caminho_banco = pasta_atual / "funcionarios.db"

conexao = sqlite3.connect(caminho_banco)

conexao.execute("""
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario TEXT NOT NULL UNIQUE,
        senha TEXT NOT NULL,
        encoding_facial BLOB,
        nivelDeAcesso INTEGER,
        tipo TEXT NOT NULL
    )
""")

# Cria o administrador padrão.
conexao.execute("""
    INSERT OR IGNORE INTO usuarios
        (usuario, senha, encoding_facial, nivelDeAcesso, tipo)
    VALUES
        ('administrador', '123123', NULL, NULL, 'admin')
""")

conexao.commit()
conexao.close()

