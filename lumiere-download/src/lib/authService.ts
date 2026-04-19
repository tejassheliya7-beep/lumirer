const SECRET_KEY = "LumiereOfflineSecretKeyForAdminJWT_2026!";
const encoder = new TextEncoder();

// Base64Url Utilities
function base64UrlEncode(arrayBuffer: ArrayBuffer | Uint8Array) {
  let base64;
  if (arrayBuffer instanceof ArrayBuffer) {
    base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
  } else {
    base64 = btoa(String.fromCharCode(...arrayBuffer));
  }
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(base64Url: string) {
  const padding = '='.repeat((4 - base64Url.length % 4) % 4);
  const base64 = (base64Url + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Crypto Key Manager
async function getCryptoKey() {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(SECRET_KEY),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

// Generate an authentic JWT using Web Crypto API
export async function generateAdminToken(): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  
  // Expiration set to 2 hours from now
  const payload = {
    role: 'admin',
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 2) 
  };

  const encodedHeader = base64UrlEncode(encoder.encode(JSON.stringify(header)));
  const encodedPayload = base64UrlEncode(encoder.encode(JSON.stringify(payload)));
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  const key = await getCryptoKey();
  
  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(dataToSign)
  );
  
  const signature = base64UrlEncode(signatureBuffer);

  return `${dataToSign}.${signature}`;
}

// Verify a given JWT token securely
export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    const [encodedHeader, encodedPayload, signature] = parts;
    const dataToVerify = `${encodedHeader}.${encodedPayload}`;

    const key = await getCryptoKey();
    const sigArray = base64UrlDecode(signature);

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigArray,
      encoder.encode(dataToVerify)
    );

    if (!isValid) return false;

    const payloadArray = base64UrlDecode(encodedPayload);
    const payloadStr = new TextDecoder().decode(payloadArray);
    const payload = JSON.parse(payloadStr);

    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        return false;
    }

    return payload.role === 'admin';
  } catch (error) {
    console.error('JWT Verification Failed:', error);
    return false;
  }
}
