const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// 1. تعريف أمر السحب بنظام السلاش
const commands = [
    new SlashCommandBuilder()
        .setName('سحب')
        .setDescription('لسحب مبلغ محدد وتحويله لشخص معين عبر بروبوت')
        .addStringOption(option => 
            option.setName('المبلغ')
                .setDescription('اكتب المبلغ المراد سحبه')
                .setRequired(true))
        .addUserOption(option => 
            option.setName('المستلم')
                .setDescription('منشن الشخص المستلم للكريدت')
                .setRequired(true))
].map(command => command.toJSON());

// 2. تسجيل الأمر تلقائياً في الديسكورد أول ما يشتغل البوت
client.once('ready', async () => {
    console.log(`✅ تم تشغيل البوت بنجاح ودخل باسم: ${client.user.tag}`);
    
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
    try {
        console.log('⏳ جاري تسجيل أوامر السلاش (/) في الديسكورد...');
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands },
        );
        console.log('✅ تم تسجيل أوامر السلاش بنجاح وجاهزة للاستخدام!');
    } catch (error) {
        console.error('❌ حدث خطأ أثناء تسجيل الأوامر:', error);
    }
});

// 3. استقبال وتنفيذ أمر السلاش
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'سحب') {
        const amount = interaction.options.getString('المبلغ');
        const targetUser = interaction.options.getUser('المستلم');

        // التأكد أن المبلغ أرقام فقط
        if (isNaN(amount) || parseInt(amount) <= 0) {
            return interaction.reply({ content: '❌ يرجى كتابة المبلغ بشكل صحيح وبأرقام فقط.', ephemeral: true });
        }

        // الرد الأولي على المستخدم لإعلامه أن الأمر قيد التنفيذ
        await interaction.reply({ content: `⏳ جاري إرسال أمر التحويل للمستلم ${targetUser}...`, ephemeral: true });

        // إرسال الأمر المباشر لبروبوت في نفس الروم
        await interaction.channel.send(`#credit ${targetUser.id} ${amount}`);
    }
});

// تشغيل البوت بالتوكن
client.login(process.env.TOKEN);
