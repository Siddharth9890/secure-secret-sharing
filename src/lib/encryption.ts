// Web Crypto API - Works in Edge Runtime
export async function encryptSecret(text: string, password?: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    // Use password or generate a random key
    const keyMaterial = password
        ? await crypto.subtle.importKey(
            'raw',
            encoder.encode(password.padEnd(32, '0').slice(0, 32)),
            { name: 'AES-GCM' },
            false,
            ['encrypt']
        )
        : await crypto.subtle.generateKey(
            { name: 'AES-GCM', length: 256 },
            true,
            ['encrypt', 'decrypt']
        );

    // Generate a random IV
    const iv = crypto.getRandomValues(new Uint8Array(12));

    // Encrypt the data
    const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        keyMaterial,
        data
    );

    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);

    // Return as base64
    return btoa(String.fromCharCode(...combined));
}

export async function decryptSecret(encryptedData: string, password?: string): Promise<string> {
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    // Decode from base64
    const combined = new Uint8Array(
        atob(encryptedData)
            .split('')
            .map(char => char.charCodeAt(0))
    );

    // Extract IV and encrypted data
    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);

    // Import the key
    const keyMaterial = password
        ? await crypto.subtle.importKey(
            'raw',
            encoder.encode(password.padEnd(32, '0').slice(0, 32)),
            { name: 'AES-GCM' },
            false,
            ['decrypt']
        )
        : await crypto.subtle.generateKey(
            { name: 'AES-GCM', length: 256 },
            true,
            ['encrypt', 'decrypt']
        );

    // Decrypt the data
    const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        keyMaterial,
        encrypted
    );

    return decoder.decode(decrypted);
}

// Simple hash function for passwords
export async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(hash)));
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    const passwordHash = await hashPassword(password);
    return passwordHash === hash;
}