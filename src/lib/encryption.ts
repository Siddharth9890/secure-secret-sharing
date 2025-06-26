export async function encryptSecret(text: string, password?: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    let keyMaterial: CryptoKey;
    let keyBytes: Uint8Array;

    if (password) {
        const passwordBytes = encoder.encode(password.padEnd(32, '0').slice(0, 32));
        keyBytes = new Uint8Array(passwordBytes.buffer.slice(passwordBytes.byteOffset, passwordBytes.byteOffset + passwordBytes.byteLength));
        keyMaterial = await crypto.subtle.importKey(
            'raw',
            keyBytes as BufferSource,
            { name: 'AES-GCM' },
            false,
            ['encrypt', 'decrypt']
          );
    } else {
        keyMaterial = await crypto.subtle.generateKey(
            { name: 'AES-GCM', length: 256 },
            true,
            ['encrypt', 'decrypt']
        );

        const exportedKeyBuffer = await crypto.subtle.exportKey('raw', keyMaterial);
        keyBytes = new Uint8Array(exportedKeyBuffer);
    }

    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        keyMaterial,
        data
    );

    const encryptedBytes = new Uint8Array(encrypted);

    const encryptedHex = Array.from(encryptedBytes).map(b => b.toString(16).padStart(2, '0')).join('');
    const ivHex = Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('');
    const keyHex = password ? '' : Array.from(keyBytes).map(b => b.toString(16).padStart(2, '0')).join('');

    return password ? `${encryptedHex}:${ivHex}` : `${encryptedHex}:${ivHex}:${keyHex}`;
}

export async function decryptSecret(encryptedData: string, password?: string): Promise<string> {
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    const parts = encryptedData.split(':');
    const encryptedHex = parts[0];
    const ivHex = parts[1];
    const keyHex = parts[2];

    const encrypted = new Uint8Array(encryptedHex.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
    const iv = new Uint8Array(ivHex.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));

    let keyMaterial: CryptoKey;

    if (password) {
        const passwordBytes = encoder.encode(password.padEnd(32, '0').slice(0, 32));
        const keyBuffer = new Uint8Array(passwordBytes.buffer.slice(passwordBytes.byteOffset, passwordBytes.byteOffset + passwordBytes.byteLength));
        keyMaterial = await crypto.subtle.importKey(
            'raw',
            keyBuffer as BufferSource,
            { name: 'AES-GCM' },
            false,
            ['decrypt']
        );
    } else if (keyHex) {
        const keyBytes = new Uint8Array(keyHex.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
        keyMaterial = await crypto.subtle.importKey(
            'raw',
            keyBytes.buffer,
            { name: 'AES-GCM' },
            false,
            ['decrypt']
        );
    } else {
        throw new Error('Either password or embedded key is required for decryption');
    }

    const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        keyMaterial,
        encrypted
    );

    return decoder.decode(decrypted);
  }