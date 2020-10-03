const fs = require('fs');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const puppeteer = require('puppeteer');

const port = 7777;
const URL = 'https://www.epicgames.com/store/pt-BR/free-games';


var app = express();
app.use(cors({
  origin: '*'
}));

app.get('/', async (req, res) => {

   
  
  async function openSiteAndGetGames() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(URL);

    await page.waitForSelector('.css-1442lgn-CardGrid-styles__group')
    //await page.waitFor(200);

    const result = await page.evaluate( () => {
      const BASE_URL = 'https://www.epicgames.com';
      let games = Array.from(document.querySelectorAll('.css-11syfh5-CardGrid-styles__card'));
      let links = Array.from(document.querySelectorAll('.css-11syfh5-CardGrid-styles__card a'));
      let images = Array.from(document.querySelectorAll('.css-11syfh5-CardGrid-styles__card img'));
      
      let gameCards = games.map(game => {
        return game.innerText;
      })

      let gameLinks = links.map(link => {
        return link.attributes.href.value;
      })
      
      let gameImages = images.map(img => {
        return img.attributes.src.value;
      })
      
      let gamesObj = [];
      console.log(`\n\n SIZE GAMECARDS:  ${gameCards.length}\n\n`)
      for (let i=0; i<gameCards.length; i++) {
        let status = gameCards[i].split('\n')[0];
        let gameName = gameCards[i].split('\n')[1];
        let offerDate = gameCards[i].split('\n')[2].replace('Grátis - ','Até ').replace('Free - ','Until ').replace('Grátis ','');
        let url = gameLinks[i];
        let img = gameImages[i];

        gamesObj.push({
          status: status,
          name: gameName,
          date: offerDate,
          url: `${BASE_URL}${url}`,
          image: img
        });
      }
      console.log(gamesObj);
      return gamesObj;
    });

    console.log(result)
       
    browser.close();

    return result;      
   
  }

  const gamesArray = await openSiteAndGetGames();
  if(gamesArray)
    return res.json(gamesArray);
  
  return res.json({error: 'Games not found'});
    
  });

  
  

// APP LISTEN
app.listen(port, () => console.log(`Server listening on port ${port}`));


