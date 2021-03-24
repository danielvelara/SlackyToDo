const functions = require("firebase-functions");
const { Telegraf } = require('telegraf')
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();



const bot = new Telegraf('1051BxGex_U47z9O3IlHwo6dsa0')
bot.start((ctx) => {
    let refUsers = db.collection("users");
    let query = refUsers.where("Email", "=", ctx.chat.first_name)
    ctx.reply('Bienvenido a SlackyToDo ' + query)
});
bot.help((ctx) => ctx.reply('Mándame un Sticker'))
bot.on('sticker', (ctx) => ctx.reply('👍'))

// bot.on("message", (ctx)=> 
//     ctx.telegram.sendCopy(ctx.chat.first_name,ctx.message)
// )

bot.hears('todos', (ctx) =>{
    let refUsers = db.collection("users");
    let query = refUsers.where("Email","=",ctx.chat.first_name)
    ctx.reply("ToDo's: " + ctx.chat.username)
})

bot.hears('add', (ctx) =>
    ctx.reply("ToDo's: ")
)

bot.hears('delete', (ctx) =>
    ctx.reply("ToDo's: ")
)

bot.hears('mod', (ctx) =>
    ctx.reply("ToDo's: ")
)

bot.hears('hola', (ctx) => ctx.reply('Hola! beep-boop'))
bot.launch()

exports.helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", {structuredData: true});
    
    response.send("Hello from Firebase!");
});

exports.bot = functions.https.onRequest((req,res) => {
    bot.handleUpdate(req.body,res);
})

exports.onUserCreate = functions.auth.user().onCreate((user) => {
    bot.telegram.sendMessage(functions.config().bot.chat,"New User joined")
})
