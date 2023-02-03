import { Message, Client, GatewayIntentBits, EmbedBuilder } from 'discord.js'
import { searchTrack, oAuth } from './spotify-service'
import dotenv from 'dotenv'

dotenv.config()
const id = process.env.CLIENT_ID!;
const secret = process.env.CLIENT_SECRET!;

const client = new Client({
    intents: [
      GatewayIntentBits.Guilds, 
      GatewayIntentBits.GuildMembers, 
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
});

client.once('ready', async () => {
  const data = [{
    name: 'search',
    description: 'Search tracks from some words',
  }];
  await client.application?.commands.set(data, '993724370105139280');
  const auth = await oAuth(id, secret);
  if(!auth){
    console.log('Spotify api not accept');
  }
  else{
    console.log('Ready!');
    console.log(client.user?.tag); 
  }
});

client.on('messageCreate', async message => {
  if (message.content.startsWith('!search')) {
    const trackName = message.content.split('').slice(7).join('');
    searchTrack(trackName)
    .then((result: EmbedBuilder[]) => {
      // const resultString = result.join('\n\n');
      message.reply({ embeds : result});
    })
    .catch((err) => {
      console.log(err);
      // console.log(err.code);
      // console.log(err.config.url);
      message.reply('エラーです！私にはできません！');
    });
  }
});

client.on('interactionCreate', async (interaction) => {
  if(!interaction.isCommand()){
    return;
  };
  if (interaction.commandName === 'search') {
    // const message = await interaction.fetchReply();
    // console.log(message);
  }
})

process.on('uncaughtException', (err) => {
  console.log(`${err.stack}`);
});

client.login(process.env.TOKEN)