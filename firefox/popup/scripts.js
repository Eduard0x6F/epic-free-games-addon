
function toggleHiddenNotGame() {
  var notGameMessage = document.querySelector('.not-game-message');
  notGameMessage.classList.toggle('hidden');
}
function toggleHiddenLoading() {
  var notGameMessage = document.querySelector('.loading-message');
  notGameMessage.classList.toggle('hidden');
}
function toggleHiddenListTitle() {
  var notGameMessage = document.querySelector('.list-title');
  notGameMessage.classList.toggle('hidden');
}


function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function createCards(data){
  //toggleHiddenNotGame();
  let cardsList = document.querySelector('.cards-container');
  for(let i=0; i<data.length; i++) {

    let status = (data[i].status == "GRÁTIS" || data[i].status == "FREE") ? 'available' : '';
    cardsList.innerHTML += `<li class="card ${status}" data-link="${data[i].url}">
    <img height="80" width=""100  src="${data[i].image}" alt="Game Image Card" class="game-image">
    <div class="text-container">
      <h3 class="game-name">${data[i].name}</h3>
      <span class="game-date">${data[i].date}</span>
    </div> 
  </li>`;
  }
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

function openGameLink() {  
  let link = this.dataset.link;
  console.log('[link]', link);
  window.open(link, '_blank');
}

async function main() {

  toggleHiddenLoading();
  await timeout(1000);
  const allGames = await getAllGamesFromStorage();
  
  if (allGames === null) {
    await timeout(1000);
    toggleHiddenLoading();
    toggleHiddenNotGame();    
  } else {
    await timeout(2000);    
    createCards(allGames);   
    toggleHiddenLoading(); 
    toggleHiddenListTitle();

    var cardsDOM = document.querySelectorAll('.card');
    cardsDOM.forEach((card) => {
      card.addEventListener("click", openGameLink);
    });
  }
}

main();
 