require('dotenv').config();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();
const { Telegraf } = require('telegraf');
//const Markup = require('telegraf/markup');
const com = require('./commands')
const { Advice } = require('random-advice');

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply(`Привет, ${ctx.message.from.first_name ? ctx.message.from.first_name : 'какой-то незнакомый человек'}!
Здесь ты можешь узнать рандомный совет, который поможет отвлечься от серых будней 🙃
Начнем?)`))
//bot.help((ctx) => ctx.reply(com.commands))

bot.on('text', async (ctx)=>{
let data = {};
data = await Advice.getAdvice(); 
//data = await Advice.getRaw()
const formatData = `
Совет: ${data}
`

ctx.reply(formatData);
})


bot.launch()

console.log('Бот запущен');

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
