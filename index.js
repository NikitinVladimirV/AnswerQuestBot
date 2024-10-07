require("dotenv").config();

const TelegramApi = require("node-telegram-bot-api");
const {gameOptions, againOptions} = require('./options.js');

const TOKEN = process.env.TG_TOKEN;
const chats = {};
const bot = new TelegramApi(TOKEN, {
  polling: true
  // polling: {
  //   interval: 300,
  //   autoStart: true,
  //   params: {
  //     timeout: 10
  //   }
  // }
});

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, "Сейчас я загадаю цифру от 0 до 9, а ты попробуй ее угадать)");
  
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;

  await bot.sendMessage(chatId, "Отгадывай!", gameOptions);
};

const start = () => {
  bot.setMyCommands([
    {command: "/start", description: "Начальное приветствие"},
    {command: "/info", description: "Информация о себе"},
    {command: "/game", description: "Играть"},
  ]);

  bot.on("message", async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;
    const userData = msg.from;

    console.log(msg);

    if (text === '/start') {
      // await bot.sendSticker(chatId, "https://tgram.ru/wiki/stickers/img/Privet_1/png/16.png");
      return await bot.sendMessage(chatId, `${userData.first_name}, привет)! Очень рад познакомиться!`);
    };

    if (text === "/info") {
      await bot.sendSticker(chatId, "https://tgram.ru/wiki/stickers/img/Privet_1/png/16.png");
      return await bot.sendMessage(chatId, `Тебя зовут ${userData.first_name} ${userData.last_name ?? ''})`);
    };

    if (text === "/game") {
      return startGame(chatId);
    };

    return await bot.sendMessage(chatId, "Что-то я тебя не очень понял, ты точно не хотел меня обидеть?");
    
  });

  bot.on('callback_query', async msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === "/again") return startGame(chatId);

    console.log(+data, chats[chatId]);

    if (+data === chats[chatId]) {
      return await bot.sendMessage(chatId, `Ура! Ты угадал, это цифра ${chats[chatId]}`, againOptions);
    } else {
      return await bot.sendMessage(chatId, `Неа, ты не угадал, это цифра ${chats[chatId]}...`, againOptions);
    };

  });
};

start();