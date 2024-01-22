const crypto = require('crypto');

module.exports = {
    /**
     * @typedef {object} pef1
     * @property {string} f pef1
     * @property {string} s BASE64(salt)
     * @property {string} i BASE64(iv)
     * @property {string} t BASE64(tag)
     * @property {string} d BASE64( AES256-GCM( body, key ) )
     */
    /**
     * encrypt text
     * @param {string} plainText Test to encrypt
     * @param {string} secret secret for encrypting
     * @returns {pef1}
     */
    encrypt: (plainText, secret) => {
        let iv = crypto.randomBytes(12);
        let salt = crypto.randomBytes(16);
        let key = crypto.createHmac('sha256', secret).update(salt).digest();
        let cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
        let cipherText = cipher.update(plainText, 'utf8', 'base64') + cipher.final('base64');
        let tag = cipher.getAuthTag();
        let msg = {
            f: 'pef1',
            s: salt.toString('base64'),
            i: iv.toString('base64'),
            t: tag.toString('base64'),
            d: cipherText
        };
        return JSON.stringify(msg);
    },

    /**
     * decrypt text
     * @param {string} encryptedText encrypted text
     * @param {string} secret secret for decrypting
     * @returns {string|null} decrypted text
     */
    decrypt: (encryptedText, secret) => {
        try {
            let msg = JSON.parse(encryptedText);
            let salt = new Buffer.from(msg.s, 'base64');
            let iv = new Buffer.from(msg.i, 'base64');
            let tag = new Buffer.from(msg.t, 'base64');
            let cipherText = msg.d;
            let key = crypto.createHmac('sha256', secret).update(salt).digest();
            let decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
            decipher.setAuthTag(tag);
            return decipher.update(cipherText, 'base64', 'utf8') + decipher.final('utf8');
        } catch (e) {
            // will return null if cipherText is not in pef1 format or authentication tag validation fails
            return null;
        }
    }

};
