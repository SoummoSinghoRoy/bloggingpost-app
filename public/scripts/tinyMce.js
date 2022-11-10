window.onload = function () {
  tinymce.init({
    selector: "#tiny-mce-post-body",
    plugins: ['advlist', 'lists', 'link', 'autolink', 'autosave', 'code', 'preview', 'searchreplace', 'wordcount', 'media', 'table', 'emoticons', 'image', 'imagetools'],
    toolbar: 'bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media | forecolor backcolor emoticons | code preview',
    height: 400,
    automatic_uploads: true,
    relative_urls: false,
    images_upload_url: '/uploads/postimage',
    images_upload_handler: example_image_upload_handler
  })
}
const example_image_upload_handler = (blobInfo, progress) => new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest();
  xhr.withCredentials = false;
  xhr.open('POST', '/uploads/postimage');

  xhr.upload.onprogress = (e) => {
    progress(e.loaded / e.total * 100);
  };

  xhr.onload = () => {
    if (xhr.status === 403) {
      reject({ message: 'HTTP Error: ' + xhr.status, remove: true });
      return;
    }

    if (xhr.status < 200 || xhr.status >= 300) {
      reject('HTTP Error: ' + xhr.status);
      return;
    }

    const json = JSON.parse(xhr.responseText);

    if (!json || typeof json.imgUrl != 'string') {
      reject('Invalid JSON: ' + xhr.responseText);
      return;
    }

    resolve(json.imgUrl);
  };

  xhr.onerror = () => {
    reject('Image upload failed due to a XHR Transport error. Code: ' + xhr.status);
  };

  const formData = new FormData();
  formData.append('post-img', blobInfo.blob(), blobInfo.filename());
  xhr.send(formData);
});