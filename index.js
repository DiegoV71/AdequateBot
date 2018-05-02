process.env["NTBA_FIX_319"] = 1;

const botToken = process.env.BOT_TOKEN || require("./config").bot_token;
const url = process.env.APP_URL;
const port = process.env.PORT || 8443;
const TelegramBot = require("node-telegram-bot-api");

const CommonFunctions = require("./Libs/CommonFunctions");
let options = {};

if (url) {
    options = {
        webHook: {
            port: port
        }
    };

    console.log(`Server will be started on ${url}:${port} with usage webHook`)
} else {
    options = {
        polling: {
            autoStart: false
        }
    };

    console.log(`Server will be started on localhost with longpooling`)
}

const bot = new TelegramBot(botToken, options);

const common = new CommonFunctions(bot);

bot.onText(/^\//, common.removeMessage);

const badPhraseRegex =  /(\S*(?:кек|рофл|лол|мем)\S*)/ig;
const meRegex = /\/me (.+)/ig;

bot.onText(badPhraseRegex, onBadPhrase)
bot.onText(meRegex, onMe);
bot.onText(/\/ping/, processPing);


/**
 * 
 * @param {TelegramBot.Message} msg 
 */
async function processPing(msg) {
    console.log('I replyed to ' + msg.from.username + ` (${msg.text})`);
    await bot.sendMessage(msg.chat.id, "Я всё еще адекватен.", { reply_to_message_id: msg.message_id });
}

/**
 * @param {TelegramBot.Message} msg 
 */
async function onBadPhrase(msg) {
    var text = msg.text;
    console.log("Bad phrase:" + text);
    console.log(`${msg.from.first_name} ${msg.from.last_name} ${msg.from.username} ${msg.from.id}`);
    var newText = `${msg.from.first_name} ${msg.from.last_name} говорит:\n` +  text.replace(badPhraseRegex, '***');
    console.log(`Original text: ${text}`);
    console.log(`Formatted text: ${newText}`);   
    // common.removeMessage(msg);    
    // await bot.sendMessage(msg.chat.id, newText);
}


/**
 * @param {TelegramBot.Message} msg 
 */
async function onMe(msg)
{
    let text = msg.text;
    let newMsg = `${msg.from.first_name} ${msg.last_name} ${text.replace(meRegex, '$1')}`;
    common.removeMessage(msg);
    await bot.sendMessage(msg.chat.id, newMsg);
}

if (url) {
    bot.setWebHook(`${url}/bot${botToken}`);
} else {
    bot.startPolling();
}
console.log("Started!");
