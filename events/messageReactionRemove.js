"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    name: 'messageReactionRemove',
    execute(reaction, user, client) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            if (reaction.message.partial)
                yield reaction.message.fetch();
            if (reaction.partial)
                yield reaction.fetch();
            if (user.bot)
                return;
            let reactionRole = yield client.rr.findOne({ messageId: reaction.message.id });
            let reactionEmojiIndex = (_a = reactionRole === null || reactionRole === void 0 ? void 0 : reactionRole.emoji) === null || _a === void 0 ? void 0 : _a.indexOf(reaction.emoji.name);
            if (!reactionEmojiIndex || reactionEmojiIndex == -1)
                return;
            try {
                (_c = (_b = reaction.message.guild) === null || _b === void 0 ? void 0 : _b.members.cache.get(user.id)) === null || _c === void 0 ? void 0 : _c.roles.remove(reactionRole.roleId[reactionEmojiIndex]);
                client.guilds.cache.get("962861680226865193").channels.cache.get("979662019202527272").send(`${user.username} un reacted with ${reaction.emoji.name} and removed their role <@&${reactionRole.roleId[reactionEmojiIndex]}>`);
            }
            catch (err) {
                switch (err.code) {
                    case 50013:
                        reaction.message.channel.send(`${user} I don't have permission to add this role!`);
                        break;
                    default:
                        console.log(err);
                        break;
                }
            }
        });
    }
};
