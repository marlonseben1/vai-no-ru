import { GOOGLE_ENTRIES } from '@repo/shared';
import dayjs from 'dayjs';

export type AmbienteFormulario = 'PROD' | 'STAGING';

export interface DadosSubmitReserva {
  nome: string;
  matricula: string | null;
  perfil: string;
  email: string;
  refeicao: string;
  dataReserva: string;
}

export function resolverAmbienteFormulario(): AmbienteFormulario {
  return process.env.NODE_ENV !== 'production' ? 'STAGING' : 'PROD';
}

export function validarConfiguracaoFormulario(): void {
  if (
    resolverAmbienteFormulario() === 'PROD' &&
    !process.env.GOOGLE_FORM_URL_PROD
  ) {
    throw new Error(
      'A variável GOOGLE_FORM_URL_PROD não está definida no arquivo .env',
    );
  }
}

function obterUrlFormulario(ambiente: AmbienteFormulario): string {
  const url =
    ambiente === 'PROD'
      ? process.env.GOOGLE_FORM_URL_PROD
      : process.env.GOOGLE_FORM_URL_STAGING;

  if (!url) {
    throw new Error(`A variável GOOGLE_FORM_URL_${ambiente} não está definida`);
  }

  return url;
}

export function derivarUrlSubmit(urlFormulario: string): string {
  const url = new URL(urlFormulario);
  url.search = '';
  url.pathname = url.pathname.replace(/\/viewform$/, '/formResponse');
  return url.toString();
}

export function montarPayloadFormulario(
  dados: DadosSubmitReserva,
  ambiente: AmbienteFormulario,
): URLSearchParams {
  const entries: Record<string, string> = GOOGLE_ENTRIES[ambiente];
  const payload = new URLSearchParams();

  if (entries.NOME) payload.append(entries.NOME, dados.nome);
  if (entries.MATRICULA && dados.matricula)
    payload.append(entries.MATRICULA, dados.matricula);
  if (entries.REFEICAO) payload.append(entries.REFEICAO, dados.refeicao);
  if (entries.PERFIL) payload.append(entries.PERFIL, dados.perfil);
  if (entries.EMAIL) payload.append(entries.EMAIL, dados.email);
  if (entries.PAGE_HISTORY)
    payload.append('pageHistory', entries.PAGE_HISTORY);

  if (entries.DATA) {
    const data = dayjs(dados.dataReserva);
    payload.append(`${entries.DATA}_year`, data.format('YYYY'));
    payload.append(`${entries.DATA}_month`, data.format('M'));
    payload.append(`${entries.DATA}_day`, data.format('D'));
  }

  return payload;
}

export async function enviarFormulario(
  urlSubmit: string,
  payload: URLSearchParams,
): Promise<boolean> {
  try {
    const response = await fetch(urlSubmit, {
      method: 'POST',
      body: payload,
    });
    return response.ok;
  } catch (error) {
    console.error('Erro ao enviar formulário ao Google Forms:', error);
    return false;
  }
}

export async function submitReserva(
  dados: DadosSubmitReserva,
): Promise<boolean> {
  const ambiente = resolverAmbienteFormulario();
  const urlSubmit = derivarUrlSubmit(obterUrlFormulario(ambiente));
  const payload = montarPayloadFormulario(dados, ambiente);

  return enviarFormulario(urlSubmit, payload);
}

validarConfiguracaoFormulario();
