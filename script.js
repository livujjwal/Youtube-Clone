const apiKey = "AIzaSyBXquP3mozAoCGA2MoQL332vfmYG-CeVHo";
const baseURL = `https://www.googleapis.com/youtube/v3`;
const userInput = document.getElementById("search-input");
const videoContainer = document.getElementById("video-container");
const inputBtn = document.getElementById("search-btn");

//getTimeGap
function getTimeGap(publishTime) {
  let today = new Date();
  let publishDate = new Date(publishTime);
  let timeGap = (today.getTime() - publishDate.getTime()) / 1000;
  const secondInDay = 24 * 60 * 60;
  const secondInWeek = 7 * secondInDay;
  const secondInMonth = 30 * secondInDay;
  const secondInYear = 12 * secondInMonth;
  if (timeGap < secondInDay) {
    return `${Math.ceil(timeGap / 3600)} hrs ago`;
  }
  if (timeGap < secondInWeek) {
    return `${Math.ceil(timeGap / secondInDay)} days ago`;
  }
  if (timeGap < secondInMonth) {
    return `${Math.ceil(timeGap / secondInWeek)} weeks ago`;
  }
  if (timeGap < secondInYear) {
    return `${Math.ceil(timeGap / secondInMonth)} months ago`;
  }
  return `${Math.ceil(timeGap / secondInYear)} years ago`;
}
function getVideoView(viewCount) {
  if (viewCount<1000) {
    return `${Math.floor(viewCount)} views`
  }
  if (viewCount < 100000) {
    return `${Math.floor(viewCount/1000)}k views`
  }
  if (viewCount< 10000000) {
    return `${Math.floor(viewCount/100000)}lakhs views`;
  }
  
    return `${Math.floor(viewCount/10000000)}Cr views`;
  
  
}

//updateVideoId
function updateVideoId(videoId){
  document.cookie = `id=${videoId}; path=/videoDetail.html`
    window.location.href = "http://127.0.0.1:5500/videoDetail.html";
// console.log(videoId);
}

//displayVideoList
function displayVideoList(list) {
  videoContainer.innerHTML = "";
  list.forEach((element) => {
    const videoDiv = document.createElement("div");
    videoDiv.className = "video";
    // div.setAttribute('class','video')
    videoDiv.innerHTML = `
    <img src="${element.snippet.thumbnails.high.url}" alt="${
      element.snippet.title
    }" class="video-img" />
        <div class="video-info">
          <div class="video-info-left">
            <img src="${element.channelLogo}" alt="${
      element.snippet.channelTitle
    }" class="video-icon" />
          </div>
          <div class="video-info-right">
            <h4 class="video-title">${element.snippet.title.substr(0, 50)}</h4>
            <h5 class="video-channel">${element.snippet.channelTitle}</h5>
            <p class="video-view">${getVideoView(element.statistics.viewCount)}  ${getTimeGap(element.snippet.publishTime)}</p>
          </div>
        </div>`;
        videoDiv.addEventListener("click", () => {
          updateVideoId(element.id.videoId)
        })
    videoContainer.append(videoDiv);
  });
}

async function fetchChannelLogo(channelID){
 const mainURL = `${baseURL}/channels?key=${apiKey}&id=${channelID}&part=snippet`;
 try {
  const response = await fetch(mainURL);
  const data =await response.json();
  // console.log(data.items[0].snippet.thumbnails.high.url);
  return data.items[0].snippet.thumbnails.high.url;
 } catch (error) {
  alert(`Failed to fetch channel logo for ${channelID}`)
 }
}
//fetchVideoStatistics
async function fetchVideoStatistics(videoID) {
  const mainURL = `${baseURL}/videos?key=${apiKey}&part=statistics&id=${videoID}`
  try {
    const response = await fetch(mainURL);
    const data = await response.json();
    // console.log(data.items[0].statistics);
    return data.items[0].statistics;
  } catch (error) {
    alert(`Failed to fetch statistics for ${videoID}`)
  }
}

//fetchUserSerach
async function fetchUserSerach(searchString) {
  const mainURL = `${baseURL}/search?key=${apiKey}&q=${searchString}&part=snippet&maxResults=5`;
  try {
    const response = await fetch(mainURL);
    const data = await response.json();
    for (let i = 0; i < data.items.length; i++) {
      let currentVideoID = data.items[i].id.videoId;
      const currentVideoStatistics = await fetchVideoStatistics(currentVideoID);
      data.items[i].statistics = currentVideoStatistics;
      let currentChannelID = data.items[i].snippet.channelId;
      const currentChannelLogo = await fetchChannelLogo(currentChannelID);
      data.items[i].channelLogo = currentChannelLogo;

    };
      // console.log(data.items);
    displayVideoList(data.items);
  } catch (error) {
    console.log(error);
  }
}
inputBtn.addEventListener("click", () => {
  let searchString = userInput.value;
  fetchUserSerach(searchString);
});

