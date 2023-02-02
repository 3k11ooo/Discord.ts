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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMembers,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent
    ],
});
client.once('ready', () => {
    var _a;
    console.log('Ready!');
    console.log((_a = client.user) === null || _a === void 0 ? void 0 : _a.tag);
});
client.on('messageCreate', (message) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('内容 =>', message.content);
    if (message.content.startsWith('/s')) {
        const trackName = message.content.split('').slice(2).join('');
        console.log(trackName);
        searchTrack(trackName)
            .then((result) => {
            console.log(result);
            // message.reply(result);
        })
            .catch((err) => {
            console.log(err.code);
            console.log(err.config.url);
            // message.reply('エラーです！私にはできません！');
        });
    }
    // let mention: boolean = false;
    // if (message.author.bot) return
    // if (message.content.includes('<@1070400376970428588>')){
    //   mention = true;
    // }
    // if (message.content === '!ping' && mention === true) {
    //   message.reply('pong!');
    // }
    // else if(message.content === 'hello'){
    //   message.channel.send('World');
    // }
    // else if (message.content.startsWith('<@')) {
    //   message.channel.send('yes');
    // }
}));
process.on('uncaughtException', (err) => {
    console.log(`${err.stack}`);
});
const searchTrack = (trackName) => __awaiter(void 0, void 0, void 0, function* () {
    const responese = yield axios_1.default.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(trackName)}&type=track&limit=10`);
    let trackArray = [];
    for (let i = 0; i < responese.data.track.limit; i++) {
        let artistsArray = [];
        for (let j = 0; j < responese.data.track.items[i].artists.length; j++) {
            artistsArray.push(responese.data.track.items[i].artists[j].name);
        }
        const trackData = {
            name: responese.data.track.items[i].name,
            artist: String(artistsArray),
            url: responese.data.track.items[i].external_urls.spotify,
        };
        trackArray.push(trackData);
    }
    return trackArray;
});
client.login(process.env.TOKEN);
