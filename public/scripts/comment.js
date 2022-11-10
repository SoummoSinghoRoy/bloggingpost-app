window.onload = function () {

  const commentHolder = document.getElementById('commentHolder');

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
