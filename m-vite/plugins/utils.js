const { Readable } = require('stream')
exports._readSteramBodyAsstring = async (bodyStream) => { 
  if (bodyStream instanceof Readable) { 
    return new Promise((resolve, reject) => { 
      let _res = ''
        bodyStream.on('data', data => { 
          _res += data
        })
    
        bodyStream.on('end', () => { 
          resolve(_res)
        })
    })
  } else { 
    return bodyStream.toString()
  }
}