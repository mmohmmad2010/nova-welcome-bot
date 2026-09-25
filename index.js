const { Client, GatewayIntentBits, AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('@napi-rs/canvas');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

const TOKEN = process.env.TOKEN;
const CHANNEL_ID = '1550063896952311919';

client.once('clientReady', () => {
    console.log('✅ البوت شغال');
});

client.on('guildMemberAdd', async member => {
    try {
        const channel = await client.channels.fetch(CHANNEL_ID);

        const bg = await loadImage('./NOVA.png');
        const canvas = createCanvas(500, 500);
        const ctx = canvas.getContext('2d');

        // صورة NOVA
        ctx.drawImage(bg, 0, 0, 500, 500);

        // صورة العضو
        const avatar = await loadImage(
            member.user.displayAvatarURL({
                extension: 'png',
                size: 256
            })
        );

        // دائرة صورة العضو
        ctx.save();
        ctx.beginPath();
        ctx.arc(250, 125, 60, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(avatar, 190, 65, 120, 120);
        ctx.restore();

        // مستطيل الاسم
        ctx.fillStyle = '#4b9ccc';
        ctx.fillRect(165, 190, 170, 45);

        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.fillText(member.user.username, 250, 220);

        const file = new AttachmentBuilder(
            canvas.toBuffer('image/png'),
            { name: 'welcome.png' }
        );

        // الصورة + الكلام خارج الصورة
        await channel.send({
            content:
                `Welcome To NOVA RP\n` +
                `Member Name: ${member}`,
            files: [file]
        });

        console.log('✅ ترحيب انرسل');
    } catch (err) {
        console.log('❌', err.message);
    }
});

client.login(TOKEN);