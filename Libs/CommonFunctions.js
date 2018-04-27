const TelegramBot = require("node-telegram-bot-api");

class CommonFunctions {
    /**
     * 
     * @param {TelegramBot} bot 
     */
    constructor(bot) {
        this.bot = bot;
    }

    /**
     * @param {TelegramBot.Message} msg
     */
    async removeMessage(msg) {
        console.log("Deleting message: " + msg.text);
        if (this.messageFromSupergroup(msg))
        {
            await this.bot.deleteMessage(msg.chat.id, msg.message_id);
        }            
    }

    /**
     * 
     * @param {TelegramBot.chat} chat 
     * @returns {Array<TelegramBot.ChatMember>}
     */
    async getChatAdmins(chat) {
        return await this.bot.getChatAdministrators(chat.id);
    }

    /**
     * 
     * @param {TelegramBot.Message} msg 
     * @returns {Boolean}
     */
    async messageSenderIsAdmin(msg) {
        let admins = await this.getChatAdmins(msg.chat);
        return admins.filter(i => i.user.id == msg.from.id).length > 0;
    }

    /**
     * 
     * @param {TelegramBot.Message} msg 
     */
    async messageFromSupergroup(msg) {
        return msg.chat.type == 'supergroup'
    }
}

module.exports = CommonFunctions;
