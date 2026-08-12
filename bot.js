// Pak Rozgar WhatsApp Auto-Reply Bot
// Free WhatsApp bot using whatsapp-web.js (connects via your phone's WhatsApp)

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// ============================================
// EDIT YOUR FAQs / REPLIES HERE
// ============================================
const replies = {
    greeting: `Assalam-o-Alaikum! 👋
Pak Rozgar mein khush aamdeed.

Neeche diye gaye options mein se number type karein:
1️⃣ Registration kaise karein
2️⃣ Payment kaise milegi
3️⃣ Kaam kaise karte hain
4️⃣ Kisi insaan se baat karni hai`,

    "1": `📝 *Registration ka Tareeqa:*
1. Pak Rozgar app/website open karein
2. Apna naam, phone number, aur CNIC darj karein
3. OTP verify karein
4. Aapka account ready ho jayega!

Agar koi masla ho to "4" type karein.`,

    "2": `💰 *Payment Info:*
- Har ad dekhne par aapko points milte hain
- Minimum withdrawal limit: [YAHAN APNI LIMIT LIKHEIN]
- Payment JazzCash/Easypaisa mein 3-5 din mein aati hai

Agar payment nahi mili to "4" type karein.`,

    "3": `📱 *Kaam Kaise Karein:*
1. App/website login karein
2. "Watch Ads" section mein jayein
3. Har ad ko poora dekhein (skip na karein)
4. Points automatically add ho jayenge

Roz kitna kaam karna hai wo aapke plan par depend karta hai.`,

    "4": `Theek hai, hamari team jald aap se rabta karegi. 
Iss dauran aap apna sawal yahan likh dein, hum note kar lete hain. 🙏`,

    fallback: `Maazrat, mujhe samajh nahi aaya. 
Please neeche diye numbers mein se ek type karein:
1️⃣ Registration
2️⃣ Payment
3️⃣ Kaam ka tareeqa
4️⃣ Insaan se baat karein`
};
// ============================================

client.on('qr', (qr) => {
    console.log('QR code neeche hai — WhatsApp app kholein > Linked Devices > Scan QR');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ Bot chal raha hai! WhatsApp se connect ho gaya.');
});

// Track first-time senders so we send the greeting only once per session
const greeted = new Set();

client.on('message', async (msg) => {
    if (msg.from === 'status@broadcast') return; // ignore status updates

    const text = msg.body.trim();

    if (!greeted.has(msg.from)) {
        greeted.add(msg.from);
        await msg.reply(replies.greeting);
        return;
    }

    if (replies[text]) {
        await msg.reply(replies[text]);
    } else {
        await msg.reply(replies.fallback);
    }
});

client.initialize();
