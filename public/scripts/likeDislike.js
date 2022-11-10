window.onload = function () {
  const likeBtn = document.getElementById('likeBtn');
  const disLikeBtn = document.getElementById('disLikeBtn');
  
  likeBtn.addEventListener('click', function(){
    let postId = likeBtn.dataset.post

    reqLikeDislike('likes', postId)
                  .then(response => response.json())
                  .then(data => {
                    let likeText = data.liked ? 'Liked' : 'Like'
                    likeText += `(${data.totalLikes})`
                    let dislikeText = `Dislike (${data.totalDisLikes})`

                    likeBtn.innerHTML = likeText
                    disLikeBtn.innerHTML = dislikeText
                  })
                  .catch(err => {
                    console.log(err.message);
                    alert(err.message)
                  })
  })

  disLikeBtn.addEventListener('click', function(){
    let postId = disLikeBtn.dataset.post

    reqLikeDislike('disLikes', postId)
                  .then(response => response.json())
                  .then(data => {
                    let disLikeText = data.disLiked ? 'Disiked' : 'Dislike'
                    disLikeText += `(${data.totalDisLikes})`
                    let likeText = `Likes (${data.totalLikes})`

                    disLikeBtn.innerHTML = disLikeText
                    likeBtn.innerHTML = likeText
                  })
                  .catch(err => {
                    console.log(err.message);
                    alert(err.message)
                  })
  })
}

function reqLikeDislike(reactType, postId) {
  let headers = new Headers()
  headers.append('Accept', 'Application/JSON')
  headers.append('Content-Type', 'Application/JSON')

  let req = new Request(`/api/${reactType}/${postId}`, {
    method: 'GET',
    headers,
    mode: 'cors'
  })

  return fetch(req)
}
