const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// تشغيل البوت والرد بأمر السلاش القديم والجديد معاً لتفادي الأخطاء
client.once('ready', async () => {
    console.log(`✅ تم تشغيل البوت بنجاح ودخل باسم: ${client.user.tag}`);
    
    // إنشاء أمر السلاش بشكل مباشر وبسيط جداً بدون تعقيد الـ REST
    try {
        await client.application?.commands.create({
            name: 'سحب',
            description: 'لسحب الكريدت وتحويله لشخص معين عبر بروبوت',
            options: [
                {
                    name: 'المبلغ',
                    type: 3, // String type
                    description: 'اكتب المبلغ المراد سحبه',
                    required: true
                },
                {
                    name: 'المستلم',
                    type: 6, // User type
                    description: 'منشن الشخص المستلم',
                    required: true
                }
            ]
        });
        console.log('✅ تم تحديث أمر السلاش بنجاح!');
    } catch (error) {
        console.error('⚠️ تعذر تسجيل السلاش تلقائياً، لكن البوت شغال!');
    }
});

// استقبال أمر السلاش (/)
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'سحب') {
        const amount = interaction.options.getString('المبلغ');
        const targetUser = interaction.options.getUser('المستلم');

        if (isNaN(amount) || parseInt(amount) <= 0) {
            return interaction.reply({ content: '❌ يرجى كتابة المبلغ بأرقام فقط.', ephemeral: true });
        }

        await interaction.reply({ content: `⏳ جاري تنفيذ أمر السحب وإرساله لبروبوت...`, ephemeral: true });
        await interaction.channel.send(`#credit ${targetUser.id} ${amount}`);
    }
});

// تشغيل البوت بالتوكن
client.login(process.env.TOKEN).catch(err => {
    console.error("❌ فشل الاتصال، تأكد من الـ TOKEN في الاستضافة:", err);
});
