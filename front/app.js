const dropFileForm = document.getElementById('dropFileForm')
const fileLabelText = document.getElementById('fileLabelText')
const uploadStatus = document.getElementById('uploadStatus')
// const fileInput = document.getElementById('fileInput')
let droppedFiles

window.onload = getFiles()

function overrideDefault (event) {
  event.preventDefault()
  event.stopPropagation()
}

function fileHover () {
  dropFileForm.classList.add('fileHover')

}

function fileHoverEnd () {
  dropFileForm.classList.remove('fileHover')

}

function addFiles (event) {
  droppedFiles = event.target.files || event.dataTransfer.files
  showFiles(droppedFiles)

}

function showFiles (files) {
  console.log(files)

  Array.from(files).forEach(function (file) {
    const fileTypesArray = file.name.split('.')
    const fileTypes = fileTypesArray[fileTypesArray.length - 1]
    switch (fileTypes) {
      case 'jpg':
        break
      case 'jpeg':
        break
      case 'png':
        break
      case 'gif':
        break
      case 'pdf':
        break
      default:
        window.alert('u cant upload [ .' + fileTypes + ' ] type file')
        files = []
        document.getElementById('button').disabled = true
        fileLabelText.innerText = 'Choose a file or drag it here'
    }
  })
  if (files && files.length) {
    if (files.length > 1) {
      fileLabelText.innerText = files.length + ' files selected'
    } else {
      fileLabelText.innerText = files[0].name
    }
    document.getElementById('button').disabled = false
  }
}

async function uploadFiles (event) {
  event.preventDefault()
  addStatus('Uploading...')
  var formData = new FormData()

  for (var i = 0, file; (file = droppedFiles[i]); i++) {
    formData.append('drag', file, file.name)
  }

  const xhr = new XMLHttpRequest()

  xhr.open(dropFileForm.method, dropFileForm.action, true)
  xhr.send(formData)

  xhr.onreadystatechange = function (data) {
    if (xhr.status === 200) {
      setTimeout(function () {
        getFiles()
        deleteStatus('')
      }, 1000)
    }
  }
}

function addStatus (text) {
  uploadStatus.innerText = text

}

function deleteStatus (text) {
  uploadStatus.innerText = text
  fileLabelText.innerText = 'Choose a file or drag it here'
  document.getElementById('button').disabled = true
}

function deleteFile (id) {
  var http = new XMLHttpRequest()
  var url = 'http://localhost:3000/api/' + id
  http.open('DELETE', url, true)
  http.send()

  setTimeout(function () {
    getFiles()

  }, 100)
}

function getFiles () {
  var oReq = new XMLHttpRequest()

  oReq.open('GET', 'http://localhost:3000/api')
  oReq.onreadystatechange = function () {
    if (oReq.readyState === 4) {
      const files = JSON.parse(oReq.response)
      // callback(oReq.response);
      let cards = ''
      files.forEach(function (file) {
        console.log(file)
        const id = file._id
        cards += '<div class="card">' +
          '<div class="container">' +
          `<img src="${file}"/> `+
          '<h4 class="cardName"><b>' + file.filename + '</b></h4>' +
          '<h6 class="cardId" onclick="deleteFile(\'' + id +
          '\')">&#10005;</h6>' +
          '<p class="time">' + new Date(file.uploadDate) + '</p>' +
          '</div>' +
          '</div>'
      })
      document.getElementById('filesDiv').innerHTML = cards.toString()

    }
  }
  oReq.send()
}
