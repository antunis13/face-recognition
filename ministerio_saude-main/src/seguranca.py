import os
from dotenv import load_dotenv
from cryptography.fernet import Fernet

load_dotenv()
fernet_key = os.getenv("FERNET_KEY")

def criptografar_dado(dado: bytes) -> bytes:
    fernet = Fernet(fernet_key)
    dado_criptografado = fernet.encrypt(dado)
    return dado_criptografado.decode()

def descriptografar_dado(dado_criptografado: bytes) -> bytes:
    fernet = Fernet(fernet_key)
    dado_descriptografado = fernet.decrypt(dado_criptografado)
    return dado_descriptografado

if __name__ == "__main__":
    teste = criptografar_dado(b"ola mundo")
    print("Criptografado:", teste)
    print("Descriptografado:", descriptografar_dado(teste))