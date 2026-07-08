export const GOOGLE_ENTRIES = {
  PROD: {
    NOME: 'entry.1773563523',
    MATRICULA: 'entry.1642444040',
    REFEICAO: 'entry.24359638',
    PERFIL: 'entry.919059448',
    DATA: 'entry.438994047', // _year, _month, _day
    // Form também tem 2 páginas; sem isso o Google Forms descarta
    // as respostas da página 1.
    PAGE_HISTORY: '0,1',
  },
  STAGING: {
    EMAIL: 'entry.1492417277',
    DATA: 'entry.1801437263', // _year, _month, _day
    REFEICAO: 'entry.1988784789',
    NOME: 'entry.1076655601',
    PERFIL: 'entry.336191021',
    MATRICULA: 'entry.1251347209',
    // Form tem 2 páginas (E-mail na página 0, resto na página 1);
    // sem isso o Google Forms descarta as respostas da página 1.
    PAGE_HISTORY: '0,1',
  },
} as const;
