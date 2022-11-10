window.onload = function () {
  const bookmarks = document.getElementsByClassName('bookmarks');

  // bookmark 
  [...bookmarks].forEach(bookmark => {
    bookmark.style.cursor = 'pointer'
    bookmark.addEventListener('click', function(e) {
      let target = e.target.parentElement;

      let headers = new Headers()
      headers.append('Accept', 'Application/JSON')

      let request = new Request(`/api/bookmarks/${target.dataset.post}`, {
        method: 'GET',
        headers,
        mode: 'cors'
      })

      fetch(request)
            .then(response => response.json())
            .then(data => {
              if(data.bookmark) {
                target.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-square-fill" viewBox="0 0 16 16">
                <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/>
              </svg>`
              } else {
                target.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="35" height="25" fill="currentColor" class="bi bi-bookmark-plus-fill" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5zm6.5-11a.5.5 0 0 0-1 0V6H6a.5.5 0 0 0 0 1h1.5v1.5a.5.5 0 0 0 1 0V7H10a.5.5 0 0 0 0-1H8.5V4.5z"/>
              </svg>`
              }
            })
            .catch(err => {
              console.error(err.message);
              alert(err.message)
            })
    })
  })

  // like dislike
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

  const comment = document.getElementById('comment');
  const commentHolder = document.getElementById('commentHolder');

  // comment
  comment.addEventListener('keypress', function(event) {
    if(event.key === 'Enter') {
      if(event.target.value) {
        let postId = comment.dataset.post
        let commentBody = {
          body: event.target.value
        }
        let req = generateReq(`/api/comments/${postId}`, 'POST', commentBody)

        fetch(req)
             .then(response => response.json())
             .then(data => {
              let commentElement = createComment(data)
              commentHolder.insertAdjacentElement('beforebegin', commentElement)
              
              event.target.value = ''
             })
             .catch(err => {
              console.log(err.message);
              alert(err.message)
            })
      }else{
        alert('please enter a valid comment')
      }
    }
  })
  commentHolder.addEventListener('keypress', function(event) {
    if(commentHolder.hasChildNodes(event.target)) {
      if(event.key === 'Enter') {
        let commentId = event.target.dataset.comment
        let replyValue = event.target.value
        if(replyValue) {
          let data = {
            body: replyValue
          }
          let req = generateReq(`/api/comments/replies/${commentId}`, 'POST', data)

          fetch(req)
              .then(response => response.json())
              .then(replydata => {
                let replyElement = createReplyElement(replydata)
                let parent = event.target.parentElement
                parent.previousElementSibling.appendChild(replyElement)
                event.target.value = ''
              })
              .catch(err => {
                console.log(err.message);
                alert(err.message)
              })
        }else{
          alert('submit a valid comment as a reply')
        }
      }
    }
  })
  
  function createComment(comment) {
    let innerHTML = `
      <img src="${comment.user.profilePics}" class="rounded-circle mx-3 my-3" style="width: 40px">
      <div class="media-body my-3">
        <p>${comment.body}</p>
        <div class="my-3">
          <input type="text" class="form-control" name="reply" placeholder="press enter to reply" data-comment=${comment._id}>
        </div> 
      </div>
    `
    let div = document.createElement('div')
    div.className = 'media border'
    div.innerHTML = innerHTML
    return div
  }
  
  function generateReq (url, method, body) {
    let headers = new Headers()
    headers.append('Accept', 'Application/JSON')
    headers.append('Content-Type', 'Application/JSON')
  
    let req = new Request(url, {
      method,
      headers,
      body: JSON.stringify(body),
      mode: 'cors'
    })
    return req
  }
  
  function createReplyElement (reply) {
    let innerHTML = `
    <img src="${reply.profilePics}" class="align-self-start me-3 rounded-circle" style="width: 40px;">
    <div class="media-body">
      <p>${reply.body}</p>
    </div>
    `
    let div = document.createElement('div')
    div.className = 'media mt-3'
    div.innerHTML = innerHTML
    return div
  }
}

