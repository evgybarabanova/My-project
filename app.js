require('dotenv').config();
const { Telegraf } = require('telegraf');
const com = require('./commands')

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply(`Привет, ${ctx.message.from.first_name ? ctx.message.from.first_name : 'какой-то незнакомый человек'}!`))
bot.help((ctx) => ctx.reply(com.commands))

// bot.command('course')

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
