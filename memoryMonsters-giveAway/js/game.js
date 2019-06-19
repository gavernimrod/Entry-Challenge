// Those are global variables, they stay alive and reflect the state of the game
var elPreviousCard = null;
var flippedCouplesCount = 0;

// This is a constant that we dont change during the game (we mark those with CAPITAL letters)
var TOTAL_COUPLES_COUNT = 3;

// Load an audio file
var audioWin = new Audio("sound/win.mp3");
var audioWrong = new Audio("sound/wrong.mp3");
var audioRight = new Audio("sound/right.mp3");
var elPreviousCard = null;
var flippedCouplesCount = 0;
localStorage.setItem("bestTime", null);
localStorage.setItem("bestPlayer", null);
var gameTime = null;
var clicks = 0;
var moves = 0;
var isProcessing = false;
var allFlipped = false;
var userName = null;

function getUserName() {
  var userName = prompt("Hey, so..what's your name?", "");
  if (userName === "") {
    userName = "Noobmaster69";
    localStorage.setItem("userName", userName);
  } else {
    localStorage.setItem("userName", userName);
  }
  document.querySelector(".player").style.display = "inline-block";
  document.getElementById("player").innerHTML = "Player : " + userName;
}
shuffle();
hideRePlay();
var userName = localStorage.getItem("userName");
if (userName === null) {
  getUserName();
} else {
  document.getElementById("player").innerHTML = "Player : " + userName;
}
function changeUser() {
  var userName = prompt("Hey, so..what's your name?", "");
  localStorage.setItem("userName", userName);
  document.querySelector(".player").style.display = "inline-block";
  document.getElementById("player").innerHTML = "Player : " + userName;
}
//Shuffle all cards. Keeps flipped cards visible
function shuffle() {
  //var board = document.getElementsByClassName('card');
  var board = document.querySelector(".board");
  var i;
  for (i = board.children.length; i >= 0; i--) {
    board.appendChild(board.children[(Math.random() * i) | 0]);
  }
}
function endGame() {
  var a = localStorage.getItem("startTime");
  var endTime = Date.now();
  var gameTime = Math.round((endTime - a) / 1000);
  localStorage.setItem("gameTime", gameTime);
  alert(
    "Total time: " + gameTime + " seconds, and " + moves + " steps. Good job!"
  );
}
function hideRePlay() {
  var e = document.getElementById("reset");
  e.style.display = "none";
}
function showPlay() {
  var e = document.getElementById("reset");
  e.style.display = "block";
}
function recordTime() {
  var b = localStorage.getItem("bestTime");
  var g = localStorage.getItem("gameTime");
  b = Number(b);
  g = Number(g);

  if (g < b || Number.isNaN(b)) {
    b = g;
    u = localStorage.getItem("userName");
    localStorage.setItem("bestTime", b);
    localStorage.setItem("bestPlayer", u);
    alert(
      "Wha...what..! " +
        u +
        ", " +
        b +
        " seconds. This is a new World Record!\nYou are amazing!"
    );
    document.getElementById("time").innerHTML =
      "New Record : " + b + " seconds";
    document.querySelector(".bestTime").style.display = "block";
    alert("Don't belive me?\n\nlook on your right side, your time. INSANE!");
    document.getElementById("bestPlayer").innerHTML = "Best player : " + u;
    document.querySelector("#bestPlayer").style.display = "block";
  }
}

function resetGame() {
  var divs = document.getElementsByClassName("card");
  var i;
  for (i = 0; i < divs.length; ++i) {
    divs[i].classList.remove("flipped");
  }
  //Reseting game parameters
  elPreviousCard = null;
  flippedCouplesCount = 0;
  gameTime = null;
  clicks = 0;
  moves = 0;
  isProcessing = false;
  localStorage.setItem("startTime", null);
  hideRePlay();
  shuffle();
}
// This function is called whenever the user click a card
function cardClicked(elCard) {
  clicks = clicks + 1;
  // If the user clicked an already flipped card - do nothing and return from the function
  if (elCard.classList.contains("flipped")) {
    return;
  }
  if (clicks === 1) {
    var startTime = Date.now();
    localStorage.setItem("startTime", startTime);
  }
  // Flip it
  if (isProcessing === false) {
    elCard.classList.add("flipped");
  } else {
    return;
  }

  // This is a first card, only keep it in the global variable
  if (elPreviousCard === null) {
    elPreviousCard = elCard;
  } else {
    // get the data-card attribute's value from both cards
    isProcessing = true;
    var card1 = elPreviousCard.getAttribute("data-card");
    var card2 = elCard.getAttribute("data-card");

    // No match, schedule to flip them back in 1 second
    if (card1 !== card2) {
      setTimeout(function() {
        elCard.classList.remove("flipped");
        elPreviousCard.classList.remove("flipped");
        elPreviousCard = null;
        moves = moves + 1;
        isProcessing = false;
      }, 1000);
      audioWrong.play();
    } else {
      // Yes! a match!
      flippedCouplesCount++;
      elPreviousCard = null;
      audioRight.play();
      moves = moves + 1;
      isProcessing = false;

      // All cards flipped!
      if (TOTAL_COUPLES_COUNT === flippedCouplesCount) {
        audioWin.play();
        endGame();
        showPlay();
        recordTime();
      }
    }
  }
}
