const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// رسالة التأكيد أول ما يشتغل أونلاين
client.once('ready', () => {
    console.log(`✅ تم تشغيل البوت بنجاح ودخل باسم: ${client.user.tag}`);
});

// قراءة الشات وأمر السحب
client.on('messageCreate', async (message) => {
    // إذا كان المرسل بوت يتجاهله
    if (message.author.bot) return;

    // التأكد من الكلمة الأولى
    if (message.content.startsWith('سحب')) {
        const args = message.content.trim().split(/ +/);
        const amount = args[1];
        const targetUser = message.mentions.users.first();

        if (!amount || isNaN(amount)) {
            return message.reply('❌ يرجى كتابة المبلغ بشكل صحيح. مثال: `سحب 50000 @منشن`');
        }
        if (!targetUser) {
            return message.reply('❌ يرجى منشن الشخص المستلم.');
        }

        // يرسل أمر الكريدت لبروبوت تلقائياً
        message.channel.send(`#credit ${targetUser.id} ${amount}`);
    }
});

// تشغيل البوت بالتوكن المخزن في Railway
if (!process.env.TOKEN) {
    console.error("❌ خطأ: التوكن (TOKEN) غير موجود في إعدادات Variables في موقع Railway!");
} else {
    client.login(process.env.TOKEN).catch(err => {
        console.error("❌ فشل الاتصال بالديسكورد، تأكد من صحة التوكن:", err);
    });
}
