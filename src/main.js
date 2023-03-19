require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js')

const botClient = new Client({ 
    intents : [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessageTyping
    ],
    partials: [1]
});


botClient.on('ready', () => {
    console.log(`Bot is connect. Logged in as ${botClient.user.tag}!`)
})


botClient.on('guildMemberAdd', async (member) => {
    try {
      const dmChannel = await member.createDM();
      dmChannel.send('Hola, ¿cuál es tu nombre de usuario en GitHub?');

        botClient.on('messageCreate', async (message) => { 
            if(message.guildId == null && !message.author.bot) {

                const githubUsername = getGithubName(message.content.trim());

                if (!githubUsername) {
                    message.reply(`Usuario no valido contiene caracteres invalidos`);
                    return;
                } 

                const memberNickname = `${message.author.username} @${githubUsername}`;

                member.setNickname(memberNickname).catch(err => {
                    console.log('Error al actualizar el apodo')
                })

                await message.reply(`Tu apodo ha sido actualizado a ${memberNickname}`);
            
            }
        })
    
    
    } catch (err) {
      console.error('Error al enviar mensaje directo:', err);
    }
});

/**
 * 
 * Funcion que nos comprueba si es un enlace de github o un nombre normal
 * tambien comprueba que el nombre no tenga caracteres invalidos
 * 
 * @param {*} name mensaje que lee del usuario
 * @returns username
 */
function getGithubName(name) {

    const linkGithub = /https:\/\/github.com\//;
    let username;

    if(linkGithub.test(name)) {
        const startIndex = name.indexOf("https://github.com/");
      
        username = name.substring(startIndex + 19);
    } else {
        username = name;
    }

    const regex = /^[a-zA-Z\d](?:[a-zA-Z\d]|-(?=[a-zA-Z\d])){0,38}$/;

    if (!regex.test(username)) {
        return null;
    } 
  
    return username;
}
  

botClient.login(process.env.bot_token)