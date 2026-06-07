const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.MessageContent
  ],
});

// --- إعدادات البروجكتر ---
const PROBOT_ID = "282859044593598464"; // آيدي بوت بروبوت الرسمي للتحويل

client.once('ready', () => {
    console.log(`💰 [اسم سيرفرك] | بروجكتر الخزنة الرقمية جاهز ومؤمن بالكامل الآن!`);
});

client.on('messageCreate', async (message) => {
    // تجاهل رسائل البوتات
    if (message.author.bot) return;

    // --- أمر سحب الكريدت من الخزنة (حصري للمالك فقط) ---
    if (message.content.startsWith('سحب')) {
        
        // التحقق الصارم: هل الشخص اللي كتب الأمر هو صاحب ملكية السيرفر؟
        if (message.author.id !== message.guild.ownerId) {
            return message.reply("❌ **خطأ أمني:** هذا الأمر مخصص حصرياً لمالك السيرفر الأساسي فقط!").then(msg => {
                setTimeout(() => msg.delete().catch(() => {}), 5000);
            });
        }

        // تقسيم نص الرسالة للحصول على المبلغ والشخص (مثال الأمر: سحب 50000 @user)
        const args = message.content.split(' ');
        const amount = args[1]; // المبلغ
        const targetUser = message.mentions.users.first() || await client.users.fetch(args[2]).catch(() => null); // العضو المستلم

        // التأكد من كتابة الأمر بشكل صحيح
        if (!amount || isNaN(amount) || !targetUser) {
            return message.reply("⚠️ **طريقة الاستخدام الصحيحة:** `سحب [المبلغ] [منشن العضو أو الآيدي]`");
        }

        // إرسال أمر التحويل الرسمي لبوت بروبوت عشان البوت يحول من رصيده للشخص
        // الأمر يكتبه البوت في الشات علطول: #credit [آيدي الشخص] [المبلغ]
        await message.channel.send(`#credit ${targetUser.id} ${amount}`);
        
        // إرسال تأكيد بالعملية لإدارة السيرفر
        await message.channel.send(`✅ **عملية سحب ناجحة:** قام مالك السيرفر بسحب \`${amount}\` كريدت وتحويلها إلى ${targetUser}.`);
    }

    // --- ميزة اختيارية: كاشف التحويلات للبوت (اللوج) ---
    // إذا قام شخص بتحويل كريدت للبوت، البوت يقدر يرحب فيه بالروم كـ شكر وتوثيق
    if (message.author.id === PROBOT_ID && message.content.includes(client.user.id)) {
        // التحقق من رسالة بروبوت الرسمية التي تفيد بالتحويل بنجاح
        if (message.content.includes("has transferred") || message.content.includes("قام بتحويل")) {
            await message.channel.send("📥 **تم استلام الكريدت وإيداعه في الخزنة المؤمنة بنجاح!** 🔒");
        }
    }
});

client.login(process.env.TOKEN);
