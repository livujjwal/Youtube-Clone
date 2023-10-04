const apiKey = "AIzaSyBXquP3mozAoCGA2MoQL332vfmYG-CeVHo";
const baseURL = `https://www.googleapis.com/youtube/v3`;
const userInput = document.getElementById("search-input");
const videoContainer = document.getElementById("video-container");
const inputBtn = document.getElementById("search-btn");
function displayVideoList(list) {
list.forEach(element => {
    const div = document.createElement('div');
    div.className = 'video';
    div.setAttribute('class','video')
    div.innerHTML = `
    <img src="${element.snippet.thumbnails.default.url}" alt="${element.snippet.title}" class="video-img" />
        <div class="video-info">
          <div class="video-info-left">
            <img src="${element.snippet.thumbnails.medium.url}" alt="${element.snippet.channelTitle}" class="video-icon" />
          </div>
          <div class="video-info-right">
            <h4 class="video-title">${element.snippet.title.substr(0,50)}</h4>
            <h5 class="video-channel">${element.snippet.channelTitle}</h5>
            <p class="video-view">${element.snippet.publishedAt}</p>
          </div>
        </div>`
        videoContainer.append(div);
});
}

//fetchUserSerach
async function fetchUserSerach(searchString) {
  const mainURL = `${baseURL}/search?key=${apiKey}&q=${searchString}&part=snippet&maxResults=20`;
  try {
    const response = await fetch(mainURL);
    const data = await response.json();
    console.log(data.items);
    displayVideoList(data.items);
  } catch (error) {
    console.log(error);
  }
}
inputBtn.addEventListener("click", () => {
  let searchString = userInput.value;
  fetchUserSerach(searchString);
});
