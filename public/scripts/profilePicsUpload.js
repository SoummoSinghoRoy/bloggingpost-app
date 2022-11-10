let profilePicsFile = document.getElementById('profilePicsFile');
let uploadedPic = document.getElementById('uploadedPic');
let confirmUploading = document.getElementById('confirmUploading');
let alertBox = document.getElementById('alertBox');

profilePicsFile.addEventListener('change', function () {
  const uploadedFile = this.files[0]
  if(uploadedFile) {
    let reader = new FileReader();
    reader.addEventListener('load', function(event) {
      let image = new Image();
      image.src = event.target.result
      image.onload = function () {
        const uploadedFileSize = profilePicsFile.files[0].size / 1024
        const maxFileSize = 1024 * 2
        let height = this.height;
        let width = this.width;
        let _this = reader
        if (height > 200 || width > 200 || uploadedFileSize > maxFileSize) {
          alertBox.innerHTML = `uploaded image must be less then 200px * 200px & size must be less then 2mb`
          alertBox.style.cssText = ` 
          color: #842029;
          background-color: #f8d7da;
          font-weight: bold;`
          profilePicsFile.value = ''
          return false
        } else {
          uploadedPic.setAttribute("src", _this.result)
          alertBox.innerHTML = `Attach Successfully & Submit Now`
          alertBox.style.cssText = ` 
          color: #0f5132;
          background-color: #d1e7dd;
          font-weight: bold`
          return true
        }
      }
    })
    reader.readAsDataURL(uploadedFile)
  }
})
