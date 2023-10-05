const comments = document.getElementById("comment-container");
const apiKey = "AIzaSyBXquP3mozAoCGA2MoQL332vfmYG-CeVHo";
const baseURL = `https://www.googleapis.com/youtube/v3/commentThreads`;

window.addEventListener("load",() => {
    const videoId = document.cookie.split("=")[1];
    console.log(videoId);
    console.log(YT);
    if(YT){
    new YT.Player("play-video",{
        height:"300",
        width:"500",
        videoId,
    }
    )}
    loadComments(videoId);

})
// loadComments
async function loadComments(videoId) {
  try {
    const response = await fetch(`${baseURL}?key=${apiKey}&videoId=${videoId}&maxResults=10&part=snippet`);
    const data = await response.json();
    // console.log(data);
    // console.log(data.items);
    renderComments(data.items);
  } catch (error) {
    console.log(error);
  }
}

function renderComments(commentList) {
//   console.log(commentList);
  commentList.forEach((element) => {
    console.log(element.snippet.topLevelComment.snippet.authorDisplayName);
    const comment = document.createElement("div");
    comment.id = "comment";
    comment.innerHTML = `
    <img src="${element.snippet.topLevelComment.snippet.authorProfileImageUrl}" alt="${element.snippet.topLevelComment.snippet.authorDisplayName}" id="author-logo" />
    <div id="comment-brief">
      <h4 id="auhtor-name">
        ${element.snippet.topLevelComment.snippet.authorDisplayName}&nbsp;&nbsp; <span id="timeOfComment">${element.snippet.topLevelComment.snippet.updatedAt.substr(0,10)}</span>
      </h4>
      <p id="comment-text">&nbsp;&nbsp;${element.snippet.topLevelComment.snippet.textDisplay}</p>
      <p id="like-count">&nbsp;&nbsp;
        ${element.snippet.topLevelComment.snippet.likeCount}&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa-solid fa-thumbs-up" style="color: #AAA"></i
        ><span class="reply">&nbsp;&nbsp;&nbsp;&nbsp;${element.snippet.totalReplyCount}&nbsp;&nbsp; Replys</span>
      </p>
  </div>`;
    comments.append(comment);
  });
}
