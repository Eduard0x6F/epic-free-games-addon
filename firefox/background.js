const api = 'http://localhost:7777/';
const hasDataLoaded = false;
var haveNewGames = false;

/** Dates Functions */
function diffDates(lastDate, firstDate) {
  let secondsToDay = (1000 * 60 * 60 * 24);
  
  return Math.floor( (lastDate - firstDate) / secondsToDay );
}

function getTodayDate() {
  return (new Date());
}
/** ----------------- */

console.log('INIT ADDON');

function updateIcon() {
  browser.browserAction.setIcon(
    haveNewGames ?
    {
      path: "icons/free-games-48-red.png"
    }
    :
    {
      path: "icons/free-games-48.png"
    }
  );
}

 
//Update icon, on click in addon icon
//browser.browserAction.onClicked.addListener(updateIcon);
async function notify(title, content) {
  await browser.notifications.create('newGameNotify', {
    "type": "basic",
    "iconUrl": browser.runtime.getURL("icons/free-games-64.png"),
    "title": title,
    "message": content
  });
}
async function getData() {
  const gamesData = await fetch(api, {
    method: "GET",
  })
    .then((response) => {
      return response.json();      
    })
    .then((data) => {
      return data;
    });
  
  return gamesData;
}

async function setGamesToStorage(){
  getData()
  .then((data) => {
    //console.log(data.length);
    //console.log(data)
    var storeGames = browser.storage.local.set({
      games: data,
      lastRequest: getTodayDate()
    });
    storeGames.then(() => {
      console.log('GAMES STORED!');
    }, () => console.log('ERROR ON STORE GAME DATA'))
  });
}

async function getAllGamesFromStorage() {
  let value = await browser.storage.local.get("games");

  if (Object.keys(value).length === 0) {
    return null;
  } else {
    console.log('[value.games]', value.games);
    return value.games;
  }  
}

async function getLastRequestDateFromStorage() {
  let value = await browser.storage.local.get("lastRequest");

  if (Object.keys(value).length === 0) {
    return null;
  } else {
    console.log('[value.lastRequest]', value.lastRequest);
    return value.lastRequest;
  }  
}

async function main() {
  var gamesStoraged = await getAllGamesFromStorage();
  var lastRequest = await getLastRequestDateFromStorage();
  console.log('[gamesStoraged]', gamesStoraged);
  let daysBetweenLastRequest = diffDates(lastRequest, getTodayDate());

  console.log('[daysBetweenLastRequest]',daysBetweenLastRequest);
  //console.log('[gamesStoraged.length]',gamesStoraged.length);

  if(gamesStoraged === null || daysBetweenLastRequest > 3) {
    console.log('Games not found on storage, requesting the last...');
    await setGamesToStorage();

    await notify('🔥 New games available! 🔥', `${gamesStoraged.length} new games available!\nClick the extension button and list the games. ⬆️`);
  } else {
    console.log('You already have games on storage!');
    console.log('[gamesStoraged]', gamesStoraged);
    console.log('[lastRequest]', lastRequest);
    await notify('🔥 New games available! 🔥', `${gamesStoraged.length} new games available!\nClick the extension button and list the games. ⬆️`);
  }
  return  
}

main();







