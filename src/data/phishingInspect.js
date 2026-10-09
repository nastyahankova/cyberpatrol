export const phishingInspect = {
  icon: '📧',
  channel: 'Почта',
  parts: [
    {
      id: 'from',
      label: 'От кого',
      value: 'security@bank-online.security-check.ru',
      isSuspicious: true,
      reason: 'Адрес поддельный: настоящий банк не использует такие длинные и странные адреса.',
    },
    {
      id: 'subject',
      label: 'Тема письма',
      value: 'СРОЧНО! Ваш счёт заблокирован!',
      isSuspicious: true,
      reason: 'Давят на срочность. Так делают мошенники, чтобы ты не успел подумать.',
    },
    {
      id: 'greeting',
      label: 'Приветствие',
      value: 'Уважаемый клиент!',
      isSuspicious: false,
      reason: 'Обычное обращение. Не является признаком мошенничества.',
    },
    {
      id: 'text',
      label: 'Текст письма',
      value: 'Мы обнаружили подозрительную активность на вашем счёте. Чтобы избежать блокировки, срочно подтвердите данные по ссылке.',
      isSuspicious: true,
      reason: 'Просят «срочно подтвердить данные» по ссылке. Настоящий банк так не делает.',
    },
    {
      id: 'link',
      label: 'Ссылка',
      value: 'http://bank-online.security-check.ru/login',
      isSuspicious: true,
      reason: 'Ссылка ведёт не на официальный сайт банка. Никогда не переходи по таким ссылкам.',
    },
    {
      id: 'footer',
      label: 'Подпись',
      value: 'С уважением, служба безопасности банка',
      isSuspicious: false,
      reason: 'Подпись стандартная. Не является признаком мошенничества.',
    },
  ],
};