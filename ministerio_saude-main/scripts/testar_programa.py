
import sys
from pathlib import Path

RAIZ_PROJETO = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ_PROJETO))

from testar_cadastro import cadastrar_pelo_terminal
from testar_reconhecimento import reconhecer_pelo_terminal
from src.db import mostrar_banco

#essa função permite testar o funcionamento de todo o sistema via terminal
#ela importa as funções dos outros arquivos, fica mais fácil de testar tudo
def main():
    while True:
        print("\n========== SISTEMA DE RECONHECIMENTO FACIAL ==========")
        print("[1] - Cadastrar funcionário")
        print("[2] - Fazer reconhecimento")
        print("[3] - Verificar banco de dados")
        print("[4] - Sair")

        opcao = input("\nEscolha uma opção: ").strip()

        try:
            if opcao == "1":
                cadastrar_pelo_terminal()

            elif opcao == "2":
                reconhecer_pelo_terminal()

            elif opcao == "3":
                mostrar_banco()

            elif opcao == "4":
                print("Encerrando o programa...")
                break

            else:
                print("Opção inválida. Escolha de 1 a 4.")

        except Exception as erro:
            print(f"\nOcorreu um erro: {erro}")

        if opcao != "4":
            input("\nPressione ENTER para voltar ao menu ")


if __name__ == "__main__":
    main()
