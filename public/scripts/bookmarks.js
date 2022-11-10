window.onload = function () {
  const bookmarks = document.getElementsByClassName('bookmarks');

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
}
