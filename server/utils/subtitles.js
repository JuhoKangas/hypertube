// const axios = require('axios')

// // FROM HERE COPY WORKING /download/:id
// moviesRouter.get('/download/:id', async (req, res) => {
//   const movieId = req.params.id
//   console.log(`params: `, req.params)
//   let downloadingFile = null
//   let resSent = false

//   const checkFileSize = (filePath) => {
//     const checkFileSize = () => {
//       const stats = fs.statSync(`${filePath}`)
//       return stats.size
//     }

//     if (fs.existsSync(`${filePath}`)) {
//       return checkFileSize()
//     }
//     return 0
//   }

//   try {
//     const ytsData = await axios.get(
//       `https://yts.mx/api/v2/movie_details.json?movie_id=${movieId}&with_cast=true`
//     )
//     const movieData = ytsData.data.data.movie

//     let torrents
//     if (movieData.torrents.length > 0) {
//       torrents = movieData.torrents.filter((t) => t.quality === '1080p')
//       if (torrents.length > 1) {
//         torrents.sort((a, b) => {
//           b.seeds - a.seeds
//         })
//       } else if (torrents.length < 1) {
//         if (!resSent) {
//           resSent = true
//           res.status(200).json({ error: 'No torrents for 1080p quality' })
//         }
//       }
//     } else if (!resSent) {
//       resSent = true
//       res.status(200).json({ error: 'No torrents found' })
//     }

//     const imdbId = movieData.imdb_code.substring(2)
//     const subHash = torrents[0].hash

//     const longNamePlus = movieData.title_long.split(' ').join('+')
//     const magnetLink = `magnet:?xt=urn:btih:${torrents[0].hash}&dn=${longNamePlus}`

//     var engine = torrentStream(magnetLink, {
//       trackers: [
//         'udp://opentracker.i2p.rocks:6969/announce',
//         'http://opentracker.i2p.rocks:6969/announce',
//         'udp://tracker.opentrackr.org:1337/announce',
//         'http://tracker.opentrackr.org:1337/announce',
//         'udp://tracker.internetwarriors.net:1337/announce',
//         'http://tracker.internetwarriors.net:1337/announce',
//         'udp://exodus.desync.com:6969/announce',
//         'udp://tracker.cyberia.is:6969/announce',
//         'udp://3rt.tace.ru:60889/announce',
//         'http://5rt.tace.ru:60889/announce',
//         'udp://explodie.org:6969/announce',
//         'http://explodie.org:6969/announce',
//         'udp://47.ip-51-68-199.eu:6969/announce',
//         'udp://tracker.tiny-vps.com:6969/announce',
//       ],
//       path: path.resolve(__dirname, '../downloads'),
//     })

//     engine.on('ready', function () {
//       const files = engine.files.filter(
//         (file) =>
//           file.name.substring(file.name.length - 3) === 'mp4' ||
//           file.name.substring(file.name.length - 3) === 'mkv' ||
//           file.name.substring(file.name.length - 4) === 'webm'
//       )
//       if (files.length > 0) {
//         downloadingFile = files[0]
//         const subSize = downloadingFile.length
//         const subName = downloadingFile.name
//         console.log(`downloadingFile: `, downloadingFile)
//         console.log(`STARTING download of: `, downloadingFile.path)
//         console.log('That files full size is: ', downloadingFile.length)
//         console.log('That files name is: ', downloadingFile.name)
//         // subtitle download start:
//         // sublanguageid: 'eng, fin, esp, slo' ??

//         //FOR SEARCH OF SUBS
//         const subEn = getSubtitleFiles(imdbId, subHash, subName)
//         console.log(`En SUBS after getSubtitleFiles: `, subEn)

//         //FOR DOWNLOAD OF SUBs, use id from search
//         // const params = { file_id: imdbId, sub_format: 'webvtt' }
//         // const config = {
//         //   headers: {
//         //     Accept: 'application/json',
//         //     'Api-Key': process.env.OPENSUB_API_KEY,
//         //     'Content-Type': 'application/json',
//         //   },
//         // }
//         // const res = axios
//         //   .post(
//         //     `https://api.opensubtitles.com/api/v1/download`,
//         //     { ...params },
//         //     config
//         //   )
//         // .then((res) => console.log(`HEHH: `, res.data.link))

//         // subtitle download end
//         downloadingFile.select()
//       } else {
//         engine.destroy()
//         if (!resSent) {
//           resSent = true
//           res.status(200).json({ error: 'No files with that extension' })
//         }
//       }
//     })

//     engine.on('download', function () {
//       const sizeDownloaded = checkFileSize(
//         `${path.resolve(__dirname, '../downloads')}/${downloadingFile.path}`
//       )
//       const soFar = (sizeDownloaded / downloadingFile.length) * 100
//       console.log('Downloaded so far: ', sizeDownloaded, ', ', soFar, '%')
//       if (soFar > 1.5 && soFar < 100 && !resSent) {
//         resSent = true
//         res.status(200).json({ msg: 'Over 1,5% downloaded, stream' })
//       }
//     })

//     engine.on('idle', function () {
//       console.log('Download compeleted, 100%, engine destroyed.')
//       if (downloadingFile === null && !resSent) {
//         resSent = true
//         res.status(200).json({ error: 'Download failed' })
//       } else if (!resSent) {
//         resSent = true
//         res.status(200).json({ msg: 'Download completed 100%' })
//       }
//       engine.destroy()
//     })
//   } catch (e) {
//     console.log('error in /download/:id: ', e)
//     if (!resSent) {
//       resSent = true
//       res.status(200)
//     }
//   }
// })
// // UNTIL HERE COPY WORKING /download/:id

// const getSubtitleFiles = async (imdbId, subHash, subName) => {
//   const config = {
//     headers: {
//       'Api-Key': process.env.OPENSUB_API_KEY,
//       'Content-Type': 'application/json',
//     },
//   }
//   const res = await axios.get(
//     `https://api.opensubtitles.com/api/v1/subtitles?imdb_id=${imdbId}&moviehash=${subHash}&query=${subName}&languages=en,fi,es`,
//     config
//   )
//   // .then((res) => {
//   //   const subsEn = filterSubtitleFilesByLanguage(res.data.data, 'en')
//   //   // const subsFi = filterSubtitleFilesByLanguage(res.data.data, 'fi')
//   //   // const subsEs = filterSubtitleFilesByLanguage(res.data.data, 'es')
//   //   // const allSubs = [subsEn, subsFi, subsEs]
//   //   // console.log(`ALLSUBS: `, allSubs)
//   //   console.log(`En SUBS in getSubtitleFiles: `, subsEn)
//   //   // console.log(`En SUBS: `, Number(subsEn.id))
//   //   return subsEn
//   //   // getSubtitleLinks(Number(subsEn))
//   // })
//   const subsEn = await filterSubtitleFilesByLanguage(res.data.data, 'en')
//   console.log(`En SUBS in getSubtitleFiles: `, subsEn)
//   return subsEn
//   // getSubtitleLinks(Number(subsEn))
// }

// //returns object if found, empty array or undefined if not
// const filterSubtitleFilesByLanguage = async (
//   unfilteredFiles,
//   desiredLanguage
// ) => {
//   let subs = undefined

//   if (!unfilteredFiles) return undefined
//   if (unfilteredFiles.length > 1) {
//     subs = unfilteredFiles.filter(
//       (f) => f.attributes.language === desiredLanguage
//     )
//     if (subs.length > 1) {
//       subs.sort(
//         (a, b) => b.attributes.download_count - a.attributes.download_count
//       )
//       subs = subs[0]
//     }
//   } else {
//     if (unfilteredFiles.attributes.language === desiredLanguage)
//       subs = unfilteredFiles
//   }
//   return subs
// }

// // const getSubtitleLinks = (subFileId) => {
// //   const params = { file_id: subFileId, sub_format: 'webvtt' }
// //   const config = {
// //     headers: {
// //       Accept: 'application/json',
// //       'Api-Key': process.env.OPENSUB_API_KEY,
// //       'Content-Type': 'application/json',
// //     },
// //   }
// //   const res = axios
// //     .post(
// //       `https://api.opensubtitles.com/api/v1/download`,
// //       { ...params },
// //       config
// //     )
// //     .then((res) => console.log(`HEHH: `, res.data.link))
// //   response.status(404).send({ error: 'unknown endpoint' })
// // }

// const getSubtitleLinks = (subFileId) => {
//   console.log(`getSubLinks1`, subFileId, typeof subFileId)
//   // const config = {
//   //   headers: {
//   //     Accept: 'application/json',
//   //     'Api-Key': process.env.OPENSUB_API_KEY,
//   //     'Content-Type': 'application/json',
//   //   },
//   // }
//   // const res = axios
//   //   .post(
//   //     `https://api.opensubtitles.com/api/v1/download?file_id=${subFileId}&sub_format=webvtt`,
//   //     config
//   //   )
//   //   .then((res) => {
//   //     console.log(`getSubLinks2`)
//   //   })
//   // .then((res) => console.log(`GET SUBS LINKS: `, res.data.link))
//   // response.status(404).send({ error: 'unknown endpoint' })
// }

// module.exports = {
//   getSubtitleFiles,
//   // getSubtitleLinks,
// }
