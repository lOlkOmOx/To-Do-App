// Importy
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Task = require('../models/Task'); // Upravte cestu podle vaší aktuální struktury
const User = require('../models/User');

// Konfigurace nodemailer pro odesílání e-mailů
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'user',
        pass: 'pass'
    }
});

// Funkce pro odeslání e-mailu s dnešními úkoly
async function sendDailyTaskEmail(userEmail, tasks) {
    try {
        const mailOptions = {
            from: 'NO REPLY - TO-DO-LIST app',
            to: userEmail,
            subject: 'Dnešní úkoly',
            text: `Seznam vašich úkolů na dnešní den:\n\n${tasks.map(task => `- ${task.name}`).join('\n')}`
        };

        await transporter.sendMail(mailOptions);
        console.log(`E-mail s dnešními úkoly byl úspěšně odeslán na ${userEmail}`);
    } catch (error) {
        console.error(`Chyba při odesílání e-mailu: ${error}`);
    }
}

// Plánování cron jobu pro každodenní odesílání e-mailů v 8:00 ráno
const today = new Date()
console.log(today)

cron.schedule('38 21 * * *', async () => {
    try {
        // Zde provedete logiku na získání dnešních úkolů pro každého uživatele
        const users = await User.find({}); // Předpokládaný model User
        for (const user of users) {
            const today = new Date();
            const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

            const tasks = await Task.find({
                owner_id: user._id,
                date: {
                    $gte: startOfDay,
                    $lt: endOfDay
                },
                solved: false,
                recycling_bin: false
            });

            if (tasks.length > 0) {
                await sendDailyTaskEmail(user.email, tasks);
            }
        }
    } catch (error) {
        console.error(`Chyba při zpracování denních úkolů: ${error}`);
    }
}, {
    timezone: 'Europe/Prague'
});
