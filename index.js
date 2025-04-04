const {Telegraf} = require('telegraf');
require('dotenv').config();
const { convert } = require('html-to-text');
const axios = require('axios');


const  bot = new Telegraf(process.env.TELETOKEN);



const artitle = async() =>{
const   wikibaseUrl = `https://en.wikipedia.org/w/api.php`;
const params = {
    format : 'json',
    action: 'query',
    list: 'random',
    rnnamespace : 0,
    rnlimit : 1 
}
try{
    const res = await axios.get(wikibaseUrl,{params});
     const title = res.data.query.random[0].title;
    console.log(title);
    return title;

} catch (e) {
   console.log('error',e.message);
   return null;
}
};


const summary = async(sumtitle)=>{
    const wikibaseUrl = `https://en.wikipedia.org/w/api.php`;
    const params = {
        format : 'json',
        action: 'query',
        rnnamespace : 0,
        rnlimit : 1 ,
            prop: "extracts",
            titles: sumtitle,
            formatversion: "2",
            exintro: 1
        
    }
  
    const options = {
        wordwrap: 130,
      };
    try{
        const res = await axios.get(wikibaseUrl,{params});
         const dat = res.data.query.pages[0].extract
         const text = convert(dat, options);
        console.log(text);
        return  text;
    
    } catch (e) {
       console.log('error',e.message);
       return null;
    }
}

bot.command('articles', async(ctx) => {
    const rep = await artitle();
     const txt = await summary(rep);
     const final = `Wikipedia Article` + `\n\n` + `Title : ${rep}`  + '\n\n' + txt;
    ctx.reply(final);
    
});

bot.launch();