const mongodb = require('mongodb')
const mongoose = require('mongoose')
const fs = require('fs')

let bucketMap = new Map()

function getBucket (bucketName) {
  if (bucketMap.has(bucketName)) {
    return bucketMap.get(bucketName)
  }

  const db = mongoose.connection.db

  const bucket = new mongodb.GridFSBucket(db, {
    bucketName: bucketName,
  })

  bucketMap.set(bucketName, bucket)
  return bucket
}

function uploadFile (name, stream) {
  const bucket = getBucket('files')

  const uploadStream = bucket.openUploadStream(name)
  const fileId = uploadStream.id

  return new Promise(function (resolve, reject) {
    stream.pipe(uploadStream).on('error', reject).on('finish', function () {
      resolve(fileId.toString())
    })
  })
}

function promisedRemoveFile (path) {
  return new Promise((resolve, reject) => {
    fs.unlink(path, function (err) {
      if (err) return reject(err)
      resolve()
    })
  })
}

async function getFileInfo () {
  const bucket = getBucket('files')
  let cursor = bucket.find()
  return cursor.toArray()
}

async function eraseFile (id, bucketName) {
  const bucket = getBucket(bucketName)

  return new Promise((resolve, reject) => {
    bucket.delete(mongoose.Types.ObjectId(id), err => {
      if (err) return reject(err)
      resolve()
    })
  })
}

module.exports = {
  getFileInfo,
  uploadFile,
  promisedRemoveFile,
  eraseFile,
}
