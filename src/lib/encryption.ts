import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';

export interface EncryptedData {
    encrypted: string;
    iv: string;
    tag: string;
    key: string;
}

export function encryptSecret(text: string): string {
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipher(ALGORITHM, key);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const tag = cipher.getAuthTag();

    return `${encrypted}:${iv.toString('hex')}:${tag.toString('hex')}:${key.toString('hex')}`;
}

export function decryptSecret(combined: string): string {
    const [encrypted, iv, tag, key] = combined.split(':');

    if (!encrypted || !iv || !tag || !key) {
        throw new Error('Invalid encrypted data format');
    }

    const decipher = crypto.createDecipher(ALGORITHM, Buffer.from(key, 'hex'));
    decipher.setAuthTag(Buffer.from(tag, 'hex'));

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}