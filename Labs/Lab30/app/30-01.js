import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
  polling: {
    interval: 300,
    autoStart: true,
    params: {
      timeout: 10,
    },
  },
});
bot.onText(/\/echo (.+)/, async (message, match) => {
  const chatId = message.chat.id;
  const response = match[1];
  await bot.sendMessage(chatId, `echo: ${ response }`);
})