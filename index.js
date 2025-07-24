const TelegramBot = require('node-telegram-bot-api');
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// /start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `Привет, ${msg.from.first_name}! Я — Финансовый Ассистент 🤖. Напиши /help, чтобы узнать, что я умею.`);
});

// /help
bot.onText(/\/help/, (msg) => {
  const helpText = `
Вот что я умею:
🟢 /balance — Показать баланс (заглушка)
🔄 /convert <сумма> — Конвертация сум в доллары (по курсу 12500)
  Пример: /convert 100000
  `;
  bot.sendMessage(msg.chat.id, helpText);
});

// /balance
bot.onText(/\/balance/, (msg) => {
  bot.sendMessage(msg.chat.id, '💰 Ваш баланс: 1 250 000 сум (заглушка)');
});

// /convert
bot.onText(/\/convert (.+)/, (msg, match) => {
  const amount = parseFloat(match[1]);
  const rate = 12500;
  if (isNaN(amount)) {
    return bot.sendMessage(msg.chat.id, '❗ Укажите сумму в числах. Пример: /convert 100000');
  }
  const result = (amount / rate).toFixed(2);
  bot.sendMessage(msg.chat.id, `💱 ${amount} сум ≈ $${result} (по курсу 1$ = ${rate} сум)`);
});
