import {TokenPayload} from '../../../backend/src/types/TokenPayload';

export function decodeTokenPayload(token: string) {
  if (!token) return null;
  const payload = token.split('.')[1];
  if (!payload) return null;
  const decodedPayload = atob(payload);
  const parsedPayload = JSON.parse(decodedPayload);

  if (!decodedPayload) throw new Error('Invalid token payload');
  if (decodedPayload === 'undefined') throw new Error('Invalid token payload');
  if (decodedPayload === 'null') throw new Error('Invalid token payload');
  if (!parsedPayload.username) throw new Error('Invalid token payload');

  return parsedPayload as TokenPayload;
}
