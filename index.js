import { Telegraf } from "telegraf";
import axios from "axios";
import { config } from "dotenv";

config()

const bot = new Telegraf(process.env.TOKEN);

bot.start(ctx => {
    const name = ctx.message.from.first_name
    ctx.reply(`Hey ${name}, it's random Quotes and photos generator bot. For Ex: /random`)
})

const quotes = async () => {
    try {
        return await axios.get('https://zenquotes.io/api/quotes/');

    } catch (err) {
        console.log(err)
    }
}

bot.command('random', async (ctx, next) => {
    const {data} = await quotes()
    const words = data[0].q.split(' ')
    const randomWord = Math.floor(Math.random() * words.length)
    ctx.replyWithPhoto(`https://source.unsplash.com/random/?${words[randomWord]}&sig=${Math.floor(Math.random() * 999)}`, {
        caption: `${data[0].q}

Author: ${data[0].a}`
    })
})

bot.launch()