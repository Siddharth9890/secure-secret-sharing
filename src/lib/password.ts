export async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();

    const salt = crypto.getRandomValues(new Uint8Array(16));

    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveBits']
    );

    const derivedKey = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        256 // 32 bytes
    );

    const combined = new Uint8Array(salt.length + derivedKey.byteLength);
    combined.set(salt);
    combined.set(new Uint8Array(derivedKey), salt.length);

    return btoa(String.fromCharCode(...combined));
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
        const encoder = new TextEncoder();

        const combined = new Uint8Array(
            atob(hashedPassword)
                .split('')
                .map(char => char.charCodeAt(0))
        );

        const salt = combined.slice(0, 16);
        const storedHash = combined.slice(16);

        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            encoder.encode(password),
            { name: 'PBKDF2' },
            false,
            ['deriveBits']
        );

        const derivedKey = await crypto.subtle.deriveBits(
            {
                name: 'PBKDF2',
                salt: salt,
                iterations: 100000,
                hash: 'SHA-256'
            },
            keyMaterial,
            256
        );

        const derivedArray = new Uint8Array(derivedKey);
        if (derivedArray.length !== storedHash.length) return false;

        let result = 0;
        for (let i = 0; i < derivedArray.length; i++) {
            result |= derivedArray[i] ^ storedHash[i];
        }

        return result === 0;
    } catch {
        return false;
    }
}