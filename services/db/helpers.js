import {customAlphabet} from 'nanoid';

// Define the character set for the IDs
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

console.log('customAlphabet: ', customAlphabet)
// Create a custom nanoid function with a specific size
export const getId = customAlphabet(alphabet, 8);

console.log('getID: ', getId)
