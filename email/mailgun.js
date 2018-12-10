import { createReadStream } from 'fs'
import { join } from 'path'
import { strictEqual } from 'assert'

import { config } from '../config'
import { request } from '../utils'

strictEqual(typeof config.mailgun.domainName, 'string')
strictEqual(typeof config.mailgun.apiKey, 'string')
strictEqual(typeof config.mailgun.nameFrom, 'string')

const sendMailgunEmail = (email, subject, msg, callback) => {
  const validemail = typeof email === 'string' && email.indexOf('@') > -1 ? email : false
  const validMsg = typeof msg === 'string' && msg.trim().length > 0 ? msg.trim() : false

  if (validemail && validMsg) {
    const logo = createReadStream(join(__dirname, '../../.data', 'assets', 'logo.png'))
    const htmlMsg = `<img src="cid:logo.png" width="200px"><br /><h3>${subject}</h3><p>${msg}</p>`

    const obj = {
      protocol: 'https:',
      hostname: 'api.mailgun.net',
      method: 'POST',
      path: `/v3/${config.mailgun.domainName}/messages`,
      auth: `api:${config.mailgun.apiKey}`,
      data: {
        from: `${config.mailgun.nameFrom} <mailgun@${config.mailgun.domainName}>`,
        to: email,
        subject: subject,
        text: msg,
        html: htmlMsg,
        inline: [logo]
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }

    request('https', obj, (err) => {
      if (!err) {
        callback(false)
      } else {
        callback(err)
      }
    })
  } else {
    callback({ error: 'Send email parameters missing or are invalid.' })
  }
}

export {
  sendMailgunEmail
}