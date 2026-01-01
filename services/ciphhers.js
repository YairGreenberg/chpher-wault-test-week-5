export function reverseString(message) {
    let res = [];
  
    for (let i = message.length - 1; i >= 0; i--) {
        res.push(message[i].toUpperCase());
    }
    return res.join('');
}
let lookup_table = {
'A': 'Z', 'B': 'Y', 'C': 'X', 'D': 'W', 'E': 'V',
'F': 'U', 'G': 'T', 'H': 'S', 'I': 'R', 'J': 'Q',
'K': 'P', 'L': 'O', 'M': 'N', 'N': 'M', 'O': 'L',
'P': 'K', 'Q': 'J', 'R': 'I', 'S': 'H', 'T': 'G',
'U': 'F', 'V': 'E', 'W': 'D', 'X': 'C', 'Y': 'B', 'Z': 'A'
};

export function atbash(message) {
  let cipher = '';
  for (let letter of message) {
    if (letter !== ' ') {
      cipher += lookup_table[letter];
    } else {
        cipher += ' ';
    }
  }
  return cipher;
}

