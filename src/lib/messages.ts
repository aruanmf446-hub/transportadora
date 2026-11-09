/** Message builders shared by the WhatsApp widget and the quote form.
 *  Nothing is stored: data lives only in the open form until submission. */
export interface LeadData {
  [key: string]: string | undefined;
}

export const LABELS: Record<string, string> = {
  name: 'Nome',
  company: 'Empresa',
  email: 'E-mail',
  phone: 'Telefone',
  cargo: 'Tipo de carga',
  origin: 'Origem',
  destination: 'Destino',
  weight: 'Peso estimado',
  volume: 'Volume / paletes',
  frequency: 'Frequência',
  date: 'Data prevista',
  notes: 'Observações',
};

export function buildMessage(title: string, data: LeadData, footer?: string): string {
  const lines = [title, ''];
  for (const [k, v] of Object.entries(data)) {
    if (v && v.trim()) lines.push(`• ${LABELS[k] ?? k}: ${v.trim()}`);
  }
  if (footer) lines.push('', footer);
  return lines.join('\n');
}

export const whatsappUrl = (number: string, text: string) => `https://wa.me/${number}?text=${encodeURIComponent(text)}`;

export const mailtoUrl = (to: string, subject: string, body: string) =>
  `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
