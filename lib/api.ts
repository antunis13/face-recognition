export const API_URL = "http://127.0.0.1:8000";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly code: "sem-token" | "nao-autorizado" | "api" = "api",
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface UsuarioAdmin {
  id: number;
  nome: string;
  nivel_acesso: number | null;
}

export interface FuncionarioAtual {
  nivel_acesso: number;
}

export interface LoginResultado {
  tipo: "admin" | "funcionario";
  token: string;
}

async function mensagemDaResposta(resposta: Response, fallback: string) {
  const resultado = await resposta.json().catch(() => null);
  const detalhe =
    resultado && typeof resultado === "object" && "detail" in resultado
      ? resultado.detail
      : null;

  return typeof detalhe === "string" && detalhe ? detalhe : fallback;
}

export async function buscarUsuariosAdmin() {
  const token = sessionStorage.getItem("adminToken");

  if (!token) {
    throw new ApiError("Sessão de administrador não encontrada.", "sem-token");
  }

  let resposta: Response;

  try {
    resposta = await fetch(`${API_URL}/admin/usuarios`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    throw new ApiError("Não foi possível conectar à API.");
  }

  if (resposta.status === 401 || resposta.status === 403) {
    sessionStorage.removeItem("adminToken");
    throw new ApiError("Sessão de administrador inválida.", "sem-token");
  }

  if (!resposta.ok) {
    throw new ApiError("Não foi possível carregar os funcionários.");
  }

  return (await resposta.json()) as UsuarioAdmin[];
}

export async function atualizarNivelUsuario(id: number, nivelAcesso: number) {
  const token = sessionStorage.getItem("adminToken");

  if (!token) {
    throw new ApiError("Sessão de administrador não encontrada.", "sem-token");
  }

  let resposta: Response;

  try {
    resposta = await fetch(`${API_URL}/admin/usuarios/${id}/nivel`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nivel_acesso: nivelAcesso,
      }),
    });
  } catch {
    throw new ApiError("Não foi possível conectar à API.");
  }

  if (!resposta.ok) {
    throw new ApiError(
      await mensagemDaResposta(resposta, "Não foi possível salvar."),
    );
  }

  return resposta.json();
}

export async function entrar(usuario: string, senha: string) {
  let resposta: Response;

  try {
    resposta = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ usuario, senha }),
    });
  } catch {
    throw new ApiError("Não foi possível conectar à API.");
  }

  const resultado = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    throw new ApiError(
      resultado?.detail || "Falha no login.",
    );
  }

  if (resultado?.tipo === "admin" && resultado.token) {
    return {
      tipo: "admin",
      token: resultado.token,
    } satisfies LoginResultado;
  }

  if (resultado?.tipo === "funcionario" && resultado.token) {
    return {
      tipo: "funcionario",
      token: resultado.token,
    } satisfies LoginResultado;
  }

  throw new ApiError("Tipo de usuário não reconhecido.");
}

export async function cadastrarBiometria(dados: {
  usuario: string;
  senha: string;
  foto: File;
}) {
  const formulario = new FormData();
  formulario.append("usuario", dados.usuario);
  formulario.append("senha", dados.senha);
  formulario.append("foto", dados.foto);

  let resposta: Response;

  try {
    resposta = await fetch(`${API_URL}/cadastro`, {
      method: "POST",
      body: formulario,
    });
  } catch {
    throw new ApiError("Não foi possível conectar à API.");
  }

  if (!resposta.ok) {
    if (resposta.status === 409) {
      throw new ApiError(
        "Usuário já existente. Escolha outro nome de usuário.",
      );
    }

    throw new ApiError(
      await mensagemDaResposta(
        resposta,
        "Não foi possível realizar o cadastro.",
      ),
    );
  }

  return resposta.json();
}

export async function reconhecerRosto(token: string, foto: Blob) {
  if (!token) {
    throw new ApiError(
      "Token de login não encontrado. Volte e faça login novamente.",
    );
  }

  const formulario = new FormData();
  formulario.append("foto", foto, "rosto.jpg");

  let resposta: Response;

  try {
    resposta = await fetch(`${API_URL}/reconhecimento`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formulario,
    });
  } catch {
    throw new ApiError("Não foi possível conectar à API.");
  }

  const resultado = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    throw new ApiError(
      typeof resultado?.detail === "string"
        ? resultado.detail
        : "Não foi possível reconhecer o rosto.",
    );
  }

  if (!resultado?.token || !resultado.nivel_acesso) {
    throw new ApiError("A API não retornou os dados de acesso esperados.");
  }

  return {
    token: String(resultado.token),
    nivelAcesso: String(resultado.nivel_acesso),
  };
}

export async function buscarFuncionarioAtual() {
  const token = sessionStorage.getItem("employeeToken");

  if (!token) {
    throw new ApiError("Sessão não encontrada.", "sem-token");
  }

  let resposta: Response;

  try {
    resposta = await fetch(`${API_URL}/funcionario/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
  } catch {
    throw new ApiError("Não foi possível verificar sua autorização.", "api");
  }

  if (!resposta.ok) {
    sessionStorage.removeItem("employeeToken");
    sessionStorage.removeItem("nivelAcesso");
    throw new ApiError("Sessão inválida.", "nao-autorizado");
  }

  const usuario = await resposta.json();
  const nivel = Number(usuario.nivel_acesso);

  if (!Number.isInteger(nivel) || nivel < 1 || nivel > 3) {
    sessionStorage.removeItem("employeeToken");
    sessionStorage.removeItem("nivelAcesso");
    throw new ApiError("Nível de acesso inválido.", "nao-autorizado");
  }

  sessionStorage.setItem("nivelAcesso", String(nivel));

  return { nivel_acesso: nivel } satisfies FuncionarioAtual;
}

export const funcionarioQueryKey = ["funcionario", "me"] as const;
export const usuariosAdminQueryKey = ["admin", "usuarios"] as const;
