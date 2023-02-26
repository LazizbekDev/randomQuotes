import { Telegraf } from "telegraf";
import express from "express";
import axios from "axios";
import { config } from "dotenv";

config()
const PORT = process.env.PORT || 5000
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

setInterval(async() => {
    const res = await axios.get(process.env.URL)
    console.log(res.data)
}, "2000")

app.get('/', (req, res) => {
    res.status(200).json({
        API: "RUNNING",
        status: 200
    })
})

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

app.listen(PORT, () => {
    console.log("server running")
})

bot.launch()