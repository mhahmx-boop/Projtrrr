const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// هنا البوت بيعلمك في الـ Logs أول ما يدخل أونلاين
client.once('ready', () => {
    console.log(`✅ تم تشغيل البوت بنجاح ودخل باسم: ${client.user.tag}`);
});

// أمر السحب
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // تحويل النص إلى كلمات للتأكد
    const args = message.content.trim().split(/ +/);
    const command = args[0];

    if (command === 'سحب') {
        const amount = args[1];
        const targetUser = message.mentions.users.first() || client.users.cache.get(args[2]);

        if (!amount || isNaN(amount)) {
            return message.reply('❌ يرجى كتابة المبلغ بشكل صحيح. مثال: `سحب 50000 @منشن`');
        }
        if (!targetUser) {
            return message.reply('❌ يرجى منشن الشخص المستلم أو كتابة الآيدي الخاص به.');
        }

        // البوت يقوم بكتابة أمر بروبوت تلقائياً في الشات
        message.channel.send(`#credit ${targetUser.id} ${amount}`);
    }
});

// تشغيل البوت عبر التوكن المخزن في الاستضافة
client.login(process.env.TOKEN);
