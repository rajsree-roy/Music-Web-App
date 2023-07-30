const container = document.querySelector(".container"),
    musicImg = container.querySelector(".img-area img"),
    musicName = container.querySelector(".song-details .name"),
    musicArtist = container.querySelector(".song-details .artist"),
    mainAudio = container.querySelector("#main-audio"),
    playpauseBtn = container.querySelector(".play-pause"),
    nextBtn = container.querySelector("#next"),
    prevBtn = container.querySelector("#prev"),
    progressArea = container.querySelector(".progress-area"),
    progressBar = container.querySelector(".progress-bar"),
    musicList = container.querySelector(".music-list"),
    moreMusicBtn = container.querySelector("#more-music"),
    closemoreMusic = container.querySelector("#close");


let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);

window.addEventListener("load", () => {
    loadMusic(musicIndex);
    playingSong();
})

 //Load music function
function loadMusic(indexNumb) {
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `images/${allMusic[indexNumb - 1].img}.jpg`;
    mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
}


 //Play music function
function playMusic() {
    container.classList.add("paused");
    playpauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}

 //Pause music function
function pauseMusic() {
    container.classList.remove("paused");
    playpauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
}

 //Next music function
function nextMusic() {
    musicIndex++; //increment of musicIndex by 1
    //if musicIndex is greater than array length then musicIndex will be 1 so the first music play
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}

 //Prev music function
function prevMusic() {
    musicIndex--; //increment of musicIndex by 1
    //if musicIndex is less than array length then musicIndex will be 1 so the first music play
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}

 //Play or Pause button event
playpauseBtn.addEventListener("click", () => {
    const isMusicPaused = container.classList.contains("paused");

    isMusicPaused ? pauseMusic() : playMusic();

});

 //next music button event
nextBtn.addEventListener("click", () => {
    nextMusic();
});


 //prev music button event
prevBtn.addEventListener("click", () => {
    prevMusic();
});

 //update progressbar width according to music current time
mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime; //get playing song currenttime
    const duration = e.target.duration; //get playing total song duration
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;


    let musicCurrentTime = container.querySelector(".current-time"),
        musicDuration = container.querySelector(".max-duration");
    mainAudio.addEventListener("loadeddata", () => {

        //update song total duration
        let mainAdDuration = mainAudio.duration;
        let totalMin = Math.floor(mainAdDuration / 60);
        let totalSec = Math.floor(mainAdDuration % 60);
        if (totalSec < 10) { //if sec is less than 10 then add 0 before it
            totalSec = `0${totalSec}`;
        }

        musicDuration.innerText = `${totalMin}:${totalSec}`;

    });

    //update playing song current time
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if (currentSec < 10) { //if sec is less than 10 then add 0 before it
        currentSec = `0${currentSec}`;
    }

    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;

});

 //update playing song current width according to the progress bar width

progressArea.addEventListener("click", (e) => {
    let progressWidth = progressArea.clientWidth; //get width of progress bar
    let clickedOffsetX = e.offsetX; //get offset x value
    let songDuration = mainAudio.duration; //get song total duration

    mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
    playMusic();

});

 //change loop, shufle, repeat icon onclick
const repeatBtn = container.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
    let getText = repeatBtn.innerText; //get this tag innerText
    switch (getText) {
        case "repeat":
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "song looped");
            break;
        case "repeat_one":
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "playback shuffled");
            break;
        case "shuffle":
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "playlist looped");
            break;
    }

});

 //after the song ends
mainAudio.addEventListener("ended", () => {
    let getText = repeatBtn.innerText; //get this tag innerText
    switch (getText) {
        case "repeat":
            nextMusic(); //call next music function
            break;
        case "repeat_one":
            mainAudio.currentTime = 0; //set audio current time to 0
            loadMusic(musicIndex); //call load music function with argument, in the argument there is a  index of current song
            playMusic(); //call playMusic function
            break;
        case "shuffle":
            let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do {
                randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            } while (musicIndex == randIndex); //this loop runs until the next random number won't be the same of current musicIndex
            musicIndex = randIndex; //pass randomIndex to musicIndex
            loadMusic(musicIndex);
            playMusic();
            playingSong();
            break;
    }
});

 //show the music list onclick music icon

moreMusicBtn.addEventListener("click", () => {
    musicList.classList.toggle("show");
});
closemoreMusic.addEventListener("click", () => {
    moreMusicBtn.click();
});


const ulTag = container.querySelector("ul");

 //create li tags according to array length for list

for (let i = 0; i < allMusic.length; i++) {
    let liTag = `<li li-index="${i + 1}">
    <div class="row">
      <span>${allMusic[i].name}</span>
      <p>${allMusic[i].artist}</p>
    </div>
    <audio class="${allMusic[i].src} " src="songs/${allMusic[i].src}.mp3"></audio>
    <span id="${allMusic[i].src}" class="audio-duration">1:45</span>
  </li>`;
  ulTag.insertAdjacentHTML("beforeend", liTag);

  let liAudioDurationTag = ulTag.querySelector(`#${allMusic[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

  liAudioTag.addEventListener("loadeddata", () => {
    let duration = liAudioTag.duration;
    let totalMin = Math.floor(duration / 60);
    let totalSec = Math.floor(duration % 60);
    if (totalSec < 10) { //if sec is less than 10 then add 0 before it
        totalSec = `0${totalSec}`;
    }

    liAudioDurationTag.innerText = `${totalMin}:${totalSec}`;
    // add t-duration attribute with total duration value
    liAudioDurationTag.setAttribute("t-duration", `${totalMin}:${totalSec}`);
  });

}

// play particular song from the list on click of li tag
const allLiTags = ulTag.querySelectorAll("li");
function playingSong() {
    for (let j = 0; j < allLiTags.length; j++) {
   let audioTag = allLiTags[j].querySelector(".audio-duration");

        // remove playing class from all other li expect the last one which is clicked
        if(allLiTags[j].classList.contains("playing")){
            allLiTags[j].classList.remove("playing");

        // get that audio duration value and pass to .audio-duration innertext
        let adDuration = audioTag.getAttribute("t-duration");
        audioTag.innerText = adDuration;
        }

        // if there is an li tag which li index is equal to musicIndex

        if(allLiTags[j].getAttribute("li-index") == musicIndex){
            allLiTags[j].classList.add("playing");
            audioTag.innerText = "Playing";
        }

        // add on click attribute in all li tags
        allLiTags[j].setAttribute("onclick", "clicked(this)");
    }
}

// play song on click li 
function clicked(element){

    // get li index of particular clicked li tag
    let getLiIndex = element.getAttribute("li-index");
    musicIndex =  getLiIndex; //pass that li index to musicIndex
    loadMusic(musicIndex);
    playMusic(); 
    playingSong();
}

// Add a click event listener to the heart icon
const favoriteIcon = container.querySelector(".favorite-icon");
favoriteIcon.addEventListener("click", () => {

  // Toggle the 'favorite' class on heart icon to change its color
  favoriteIcon.classList.toggle("favorite-filled");

  // Get the current music index
  const musicIndex = musicIndex;

  // Check if the song is already in favorites
  if (favorites.includes(musicIndex)) {
    // Song is already in favorites, so remove it
    favorites = favorites.filter((index) => index !== musicIndex);
  } else {
    // Song is not in favorites, so add it
    favorites.push(musicIndex);
  }

  // Save the updated favorites list to local storage
  localStorage.setItem("favorites", JSON.stringify(favorites));
});