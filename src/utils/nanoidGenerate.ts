import { customAlphabet } from 'nanoid';

type nanoType = '0-9a-fA-F' | '0-9a-f' | '0-9' | 'a-f' | 'A-F';

export const generateNanoID = (type: nanoType, length: number): String => {
  let _type: any;
  switch (type) {
    case '0-9a-fA-F':
      _type = '1234567890abcdefABCDEF';
      break;
    case '0-9a-f':
      _type = '1234567890abcdef';
      break;
    case '0-9':
      _type = '1234567890';
      break;
    case 'a-f':
      _type = 'abcdef';
    case 'A-F':
      _type = 'ABCDEF';
      break;
  }
  const nanoid = customAlphabet(_type, length);
  return nanoid();
};
