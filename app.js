require('dotenv').config();
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const xhr = new XMLHttpRequest();
const { Telegraf, Markup } = require('telegraf');
//const Markup = require('telegraf/markup');
const helpBot = require('./commands')
const { Advice } = require('random-advice');
const translate = require('translate-google')
const axios = require('axios');
//const { Markup } = require('telegraf/typings/markup');

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply(`Привет, ${ctx.message.from.first_name ? ctx.message.from.first_name : 'какой-то незнакомый человек'}!
Здесь ты можешь узнать рандомный совет, который поможет отвлечься от серых будней 🙃
Начнем?)`))

bot.help((ctx) => ctx.reply(helpBot.commands))

let _data

bot.command('advice', async (ctx) => {
  try {
    _data = await Advice.getAdvice();

    const formatData = `
Advice: ${_data}
`
    ctx.replyWithHTML(formatData, Markup.inlineKeyboard(
      [
        [Markup.button.callback('перевести на русский', 'translate1'), Markup.button.callback('traducir al español', 'translate2'), Markup.button.callback('翻譯成中文', 'translate3')
          // [Markup.button.callback('получить веселую картинку', 'btn_2')]
        ]
      ]
    ));
  } catch {
    ctx.reply('Что-то не то, сейчас пофиксим')
  }
})

bot.action('translate1', async (ctx) => {
  translate(_data, { from: 'en', to: 'ru' }).then(res => {
    ctx.replyWithHTML(`Совет: ${res}`)
  }).catch(err => {
    console.error(err)
  })
})

bot.action('translate2', async (ctx) => {
  translate(_data, { from: 'en', to: 'es' }).then(res => {
    ctx.replyWithHTML(`Consejo: ${res}`)
  }).catch(err => {
    console.error(err)
  })
})

bot.action('translate3', async (ctx) => {
  translate(_data, { from: 'en', to: 'zh-tw' }).then(res => {
    ctx.replyWithHTML(`建議: ${res}`)
  }).catch(err => {
    console.error(err)
  })
})


bot.command('search', (ctx) => {
  const text = ctx.message.text

  const [, query] = text.split(' ')

  axios.get(`https://api.adviceslip.com/advice/search/${query}`)
    .then(response => {
      console.log('OK', response.data)

      ctx.replyWithHTML(`results: ${response.data.slips.map(slip => slip.advice).join('\n')}`)
    })
    .catch(error => console.log('KO', error))
})

bot.command('todo', (ctx) => {
  try {
    axios.get(`http://www.boredapi.com/api/activity/`)
      .then(response => {
        _data = response.data.activity

        ctx.replyWithHTML(`toDo: ${_data}`, Markup.inlineKeyboard(
          [
            [Markup.button.callback('перевести на русский', 'translate4'), Markup.button.callback('traducir al español', 'translate5'), Markup.button.callback('翻譯成中文', 'translate6')
              // [Markup.button.callback('получить веселую картинку', 'btn_2')]
            ]
          ]
        ));
      })
  } catch {
    ctx.reply('Что-то не то, сейчас пофиксим')
  }
})

bot.action('translate4', async (ctx) => {
  translate(_data, { from: 'en', to: 'ru' }).then(res => {
    ctx.replyWithHTML(`Что мне поделать: ${res}`)
  }).catch(err => {
    console.error(err)
  })
})

bot.action('translate5', async (ctx) => {
  translate(_data, { from: 'en', to: 'es' }).then(res => {
    ctx.replyWithHTML(`Consejo: ${res}`)
  }).catch(err => {
    console.error(err)
  })
})

bot.action('translate6', async (ctx) => {
  translate(_data, { from: 'en', to: 'zh-tw' }).then(res => {
    ctx.replyWithHTML(`建議: ${res}`)
  }).catch(err => {
    console.error(err)
  })
})

bot.command('findcat', async (ctx) => {
 const res = await axios.get('https://aws.random.cat/meow')
 //console.log(res.data.file);
 ctx.replyWithPhoto(res.data.file)
})

bot.launch()

console.log('Бот запущен');

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
