const express = require('express')
const multer = require('multer')
const filesJs = require('./files')
const path = require('path')
const fs = require('fs')
const router = express.Router()

const upload = multer({
  dest: path.join(__dirname, './files'),
})

router.get('/', async (req, res, next) => {
  let files = await filesJs.getFileInfo()
  files.forEach(file => {
    delete file.length
    delete file.chunkSize
    delete file.md5
  })
  res.send(files)
})

router.post('/', upload.array('drag'), async (req, res, next) => {

  let xFiles = req.files.map(file => {
    let me = fs.createReadStream(file.path)
    return filesJs.uploadFile(file.originalname, me)
  })

  await Promise.all(xFiles)

  if (req.files.length === 1) {

    await filesJs.promisedRemoveFile(req.files[0].path)
  } else {
    req.files.forEach(file => {
      filesJs.promisedRemoveFile(file.path)
    })
  }
  res.send(200)
})

router.delete('/:id', async (req, res, next) => {
  await filesJs.eraseFile(req.params.id, 'files').then(r => {
    res.send(200)
  }).catch(e => console.error(e))
})

module.exports = router
