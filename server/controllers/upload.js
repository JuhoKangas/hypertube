const uploadRouter = require('express').Router()
const { upload } = require('../utils/uploadPhoto')

uploadRouter.post('/', upload.single('profile'), async (req, res) => {
  try {
    if (!req.file) {
      res.status(200).json({ error: 'Wrong filetype' })
    } else {
      res.status(200).json({ filename: req.file.filename })
    }
  } catch (e) {
    console.log(e)
  }
})

module.exports = uploadRouter
