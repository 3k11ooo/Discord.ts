import { Message, Client, GatewayIntentBits } from 'discord.js'
import { searchTrack, oAuth } from './service'
import dotenv from 'dotenv'

dotenv.config()
const id = process.env.CLIENT_ID!;
const secret = process.env.CLIENT_SECRET!;

const client = new Client({
    intents: [
      GatewayIntentBits.Guilds, 
      GatewayIntentBits.GuildMembers, 
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent
    ],
});

client.once('ready', () => {
  oAuth(id, secret);
  console.log('Ready!')
  console.log(client.user?.tag)
});

client.on('messageCreate', async message => {
  if (message.content.startsWith('/s')) {
    const trackName = message.content.split('').slice(2).join('');
    searchTrack(trackName)
    .then((result: any[]) => {
      const resultString = result.join('\n\n');
      message.reply(resultString);
    })
    .catch((err) => {
      console.log(err);
      // console.log(err.code);
      // console.log(err.config.url);
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
});

process.on('uncaughtException', (err) => {
  console.log(`${err.stack}`);
});

client.login(process.env.TOKEN)