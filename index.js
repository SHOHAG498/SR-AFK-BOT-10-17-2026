const mineflier = require('mineflier');
const express = require('express');

// Render-এ পোর্ট সচল রাখার জন্য একটি ছোট HTTP সার্ভার (Web Service / Cron Job-এর জন্য)
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Minecraft AFK Bot চালু আছে!');
});

app.listen(PORT, () => {
  console.log(`ওয়েব সার্ভার পোর্ট ${PORT}-এ চলছে`);
});

// সার্ভারের তথ্য (আপনার প্রয়োজন অনুযায়ী পরিবর্তন করুন)
const BOT_CONFIG = {
  host: 'SRSHOHAG27.aternos.me', // আপনার Aternos সার্ভারের IP
  port: 25007,                             // সার্ভারের পোর্ট (Aternos-এর ক্ষেত্রে সাধারণত পরিবর্তন হয়)
  username: 'OPERATOR',                  // বটের ইউজারনেম
  version: '1.20.4'                        // মাইনক্রাফট ভার্সন
};

function createBot() {
  const bot = mineflier.createBot(BOT_CONFIG);

  // সার্ভারে যুক্ত হলে
  bot.on('spawn', () => {
    console.log(`${bot.username} সফলভাবে সার্ভারে প্রবেশ করেছে!`);

    // AFK হওয়া থেকে বাঁচতে প্রতি ৩০ সেকেন্ড পরপর লাফানো ও অ্যান্টি-কিক মোশন
    setInterval(() => {
      if (bot.entity) {
        bot.setControlState('jump', true);
        setTimeout(() => bot.setControlState('jump', false), 500);
        
        // সামান্য দৃষ্টি ঘুরানো যাতে AFK সনাক্ত না হয়
        bot.look(bot.entity.yaw + 0.5, bot.entity.pitch, true);
      }
    }, 30000);
  });

  // সার্ভারে চ্যাট মেসেজ আসলে
  bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    
    // হাই বা হ্যালো বললে উত্তর দেওয়া (ঐচ্ছিক)
    if (message.toLowerCase().includes('hi') || message.toLowerCase().includes('hello')) {
      bot.chat(`হ্যালো ${username}! আমি একটি AFK বট।`);
    }
  });

  // কোনো ত্রুটি হলে
  bot.on('error', (err) => {
    console.log('ত্রুটি দেখা দিয়েছে:', err);
  });

  // ডিসকানেক্ট হলে নিজে থেকেই পুনরায় কানেক্ট হবে
  bot.on('end', () => {
    console.log('সার্ভার থেকে সংযোগ বিচ্ছিন্ন হয়েছে। ১৫ সেকেন্ড পর পুনরায় চেষ্টা করা হচ্ছে...');
    setTimeout(createBot, 15000);
  });
}

// বট চালু করা
createBot();
