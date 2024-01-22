const forge = require('node-forge');

const AES_STANDARD = 'AES-CBC';
const RSA_STANDARD = 'RSA-OAEP';
const DEFAULT_MESSAGE_DIGEST = 'sha256';
const DEFAULT_AES_KEY_SIZE = 256;
const DEFAULT_AES_IV_SIZE = 32;

const pki = forge.pki;

function getFingerprint(publicKey) {
    return pki.getPublicKeyFingerprint(publicKey, {
        encoding: 'hex',
        delimiter: ':'
    });
}

function toArray(obj) {
    return Array.isArray(obj) ? obj : [obj];
}

function _validate(encrypted) {
    let p = JSON.parse(encrypted);
    if ( // Check required properties
        !(p.hasOwnProperty('iv') && p.hasOwnProperty('keys') && p.hasOwnProperty('cipher'))) throw 'Encrypted message is not valid';
}

module.exports = {

    /**
     * Encrypts a message using public RSA key and optional signature
     *
     * @param {String[]} publicKeys Public keys in PEM format
     * @param {String} message Message to encrypt
     *
     * @return {String} Encrypted message and metadata as a JSON formatted string
     * @method
     */
    encrypt: function (publicKeys, message) {

        // Generate flat array of keys
        publicKeys = toArray(publicKeys); // Map PEM keys to forge public key objects

        publicKeys = publicKeys.map(function (key) {
            return typeof key === 'string' ? pki.publicKeyFromPem(key) : key;
        }); // Generate random keys

        let iv = forge.random.getBytesSync(DEFAULT_AES_IV_SIZE);
        let key = forge.random.getBytesSync(DEFAULT_AES_KEY_SIZE / 8); // Encrypt random key with all of the public keys

        let encryptedKeys = {};
        publicKeys.forEach(function (publicKey) {
            let encryptedKey = publicKey.encrypt(key, RSA_STANDARD);
            let fingerprint = getFingerprint(publicKey);
            encryptedKeys[fingerprint] = forge.util.encode64(encryptedKey);
        }); // Create buffer and cipher

        let buffer = forge.util.createBuffer(message, 'utf8');
        let cipher = forge.cipher.createCipher(AES_STANDARD, key); // Actual encryption

        cipher.start({
            iv: iv
        });
        cipher.update(buffer);
        cipher.finish(); // Attach encrypted message int payload

        let payload = {};
        payload.v = 'pef2';
        payload.iv = forge.util.encode64(iv);
        payload.keys = encryptedKeys;
        payload.cipher = forge.util.encode64(cipher.output.data);
        payload.tag = cipher.mode.tag && forge.util.encode64(cipher.mode.tag.getBytes()); // Return encrypted message
        return JSON.stringify(payload);
    },

    /**
     * Decrypts a message using private RSA key
     *
     * @param {String} privateKey Private key in PEM format
     * @param {String} encrypted Message to decrypt
     *
     * @return {Object} Decrypted message and metadata as a JSON object
     * @method
     */
    decrypt: function (privateKey, encrypted) {
        // Validate encrypted message
        _validate(encrypted); // Parse encrypted string to JSON

        let payload = JSON.parse(encrypted); // Accept both PEMs and forge private key objects
        // Cast PEM to forge private key object

        if (typeof privateKey === 'string') privateKey = pki.privateKeyFromPem(privateKey); // Get key fingerprint
        let fingerprint = getFingerprint(privateKey); // Get encrypted keys and encrypted message from the payload
        let encryptedKey = payload.keys[fingerprint]; // Log error if key wasn't found
        if (!encryptedKey) throw new Error("RSA fingerprint doesn't match with any of the encrypted message's fingerprints"); // Get bytes of encrypted AES key, initialization vector and cipher

        let keyBytes = forge.util.decode64(encryptedKey);
        let iv = forge.util.decode64(payload.iv);
        let cipher = forge.util.decode64(payload.cipher);
        let tag = payload.tag && forge.util.decode64(payload.tag); // Use RSA to decrypt AES key

        let key = privateKey.decrypt(keyBytes, RSA_STANDARD); // Create buffer and decipher

        let buffer = forge.util.createBuffer(cipher);
        let decipher = forge.cipher.createDecipher(AES_STANDARD, key); // Actual decryption

        decipher.start({
            iv: iv,
            tag: tag
        });
        decipher.update(buffer);
        decipher.finish(); // Return utf-8 encoded bytes

        let bytes = decipher.output.getBytes();
        let decrypted = forge.util.decodeUtf8(bytes);
        let output = {};
        output.message = decrypted;
        output.signature = payload.signature;
        return output;
    }
}
