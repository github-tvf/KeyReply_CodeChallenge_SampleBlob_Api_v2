import { Injectable } from '@nestjs/common'
import { createCipheriv } from 'crypto'

const iv = Buffer.from('VIETNAM-TECHVIFY')
const key = Buffer.concat([Buffer.from('J@$NVFRI@$88F$@$%VF%')], 32)

@Injectable()
export class CipherService {
  constructor() {}
  async cipher(password: string): Promise<string> {
    const cipher = createCipheriv('aes-256-gcm', key, iv)
    let encryptedData = cipher.update(password, 'utf-8', 'hex')
    encryptedData += cipher.final('hex')
    console.log(encryptedData)
    return encryptedData
  }

  async decipher(encryptedPassword: string): Promise<string> {
    const decipher = createCipheriv('aes-256-gcm', key, iv)
    let decryptedData = decipher.update(encryptedPassword, 'hex', 'utf-8')
    decryptedData += decipher.final('utf8')
    console.log('Decrypted message: ' + decryptedData)
    return decryptedData
  }
}
