const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

const TOKEN = process.env.BOT_TOKEN;
const bot = new TelegramBot(TOKEN, { polling: true });

let data = {
  income: [],
  expense: []
};

function saveData() {
  fs.writeFileSync('data.json', JSON.stringify(data));
}

function loadData() {
  if (fs.existsSync('data.json')) {
    data = JSON.parse(fs.readFileSync('data.json'));
  }
}

loadData();

const keyboard = {
  reply_markup: {
    keyboard: [
      [{ text: '➕ Доход' }, { text: '➖ Расход' }],
      [{ text: '📊 Баланс' }, { text: '📅 Отчёт' }]
    ],
    resize_keyboard: true
  }
};

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Добро пожаловать! Выберите действие:', keyboard);
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === '➕ Доход') {
    bot.sendMessage(chatId, 'Введите доход в формате: сумма категория\n\nПример: `1000000 зарплата`', { parse_mode: 'Markdown' });
    bot.once('message', (msg) => {
      const [amount, ...category] = msg.text.split(' ');
      data.income.push({ amount: Number(amount), category: category.join(' '), date: new Date() });
      saveData();
      bot.sendMessage(chatId, `✅ Доход добавлен: ${amount} сум — ${category.join(' ')}`, keyboard);
    });
  } else if (text === '➖ Расход') {
    bot.sendMessage(chatId, 'Введите расход в формате: сумма категория\n\nПример: `25000 еда`', { parse_mode: 'Markdown' });
    bot.once('message', (msg) => {
      const [amount, ...category] = msg.text.split(' ');
      data.expense.push({ amount: Number(amount), category: category.join(' '), date: new Date() });
      saveData();
      bot.sendMessage(chatId, `❌ Расход добавлен: ${amount} сум — ${category.join(' ')}`, keyboard);
    });
  } else if (text === '📊 Баланс') {
    const incomeSum = data.income.reduce((sum, i) => sum + i.amount, 0);
    const expenseSum = data.expense.reduce((sum, e) => sum + e.amount, 0);
    const balance = incomeSum - expenseSum;
    bot.sendMessage(chatId, `💰 Баланс: ${balance} сум\n\nДоходов: ${incomeSum} сум\nРасходов: ${expenseSum} сум`);
  } else if (text === '📅 Отчёт') {
    let income = '';
    let expense = '';
    data.income.forEach(i => income += `+${i.amount} сум — ${i.category}\n`);
    data.expense.forEach(e => expense += `-${e.amount} сум — ${e.category}\n`);
    bot.sendMessage(chatId, `📥 Доходы:\n${income || 'Нет данных'}\n📤 Расходы:\n${expense || 'Нет данных'}`);
  }
});
