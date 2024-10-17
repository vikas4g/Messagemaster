document.addEventListener('DOMContentLoaded', () => {
    const encryptBtn = document.getElementById('encryptBtn');
    const decryptBtn = document.getElementById('decryptBtn');
    const conversionType = document.getElementById('conversionType');
    const convertBtn = document.getElementById('convertBtn');
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const keyInput = document.getElementById('keyInput');
    const aesKey = document.getElementById('aesKey');
    const switchBackground = document.querySelector('.switch-background');

    let isEncryptMode = true;

    // Mode switch
    function setMode(encrypt) {
        isEncryptMode = encrypt;
        encryptBtn.classList.toggle('active', encrypt);
        decryptBtn.classList.toggle('active', !encrypt);
        
        if (encrypt) {
            switchBackground.style.transform = 'translateX(0)';
        } else {
            switchBackground.style.transform = 'translateX(100%)';
        }
    }

    encryptBtn.addEventListener('click', () => setMode(true));
    decryptBtn.addEventListener('click', () => setMode(false));

    // Initial setup
    setMode(true);

    // Show/hide key input for AES
    conversionType.addEventListener('change', () => {
        keyInput.style.display = conversionType.value === 'aes' ? 'block' : 'none';
    });

    // Convert button click
    
    convertBtn.addEventListener('click', () => {
        const input = inputText.value;
        const type = conversionType.value;
        let result;

        if (isEncryptMode) {
            result = encrypt(input, type);
        } else {
            result = decrypt(input, type);
        }

        outputText.value = result;
    });

    // Encryption functions
    function encrypt(input, type) {
        switch (type) {
            case 'binary':
                return textToBinary(input);
            case 'base64':
                return btoa(input);
            case 'morse':
                return textToMorse(input);
            case 'aes':
                return aesEncrypt(input);
            default:
                return 'Invalid conversion type';
        }
    }

    // Decryption functions
    function decrypt(input, type) {
        switch (type) {
            case 'binary':
                return binaryToText(input);
            case 'base64':
                return atob(input);
            case 'morse':
                return morseToText(input);
            case 'aes':
                return aesDecrypt(input);
            default:
                return 'Invalid conversion type';
        }
    }

    // Binary conversion
    function textToBinary(text) {
        return text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
    }

    function binaryToText(binary) {
        return binary.split(' ').map(bin => String.fromCharCode(parseInt(bin, 2))).join('');
    }

    // Morse code conversion
    const morseCode = {
        'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
        'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
        'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
        'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
        'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
        '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
        '8': '---..', '9': '----.'
    };

    function textToMorse(text) {
        return text.toUpperCase().split('').map(char => morseCode[char] || char).join(' ');
    }

    function morseToText(morse) {
        const reverseMorse = Object.fromEntries(Object.entries(morseCode).map(([key, value]) => [value, key]));
        return morse.split(' ').map(code => reverseMorse[code] || code).join('');
    }

    // AES encryption
    function aesEncrypt(text) {
        const key = aesKey.value;
        return CryptoJS.AES.encrypt(text, key).toString();
    }

    function aesDecrypt(ciphertext) {
        const key = aesKey.value;
        const bytes = CryptoJS.AES.decrypt(ciphertext, key);
        return bytes.toString(CryptoJS.enc.Utf8);
    }

    // Clear button
    clearBtn.addEventListener('click', () => {
        inputText.value = '';
        outputText.value = '';
        aesKey.value = '';
    });

    // Copy button
    copyBtn.addEventListener('click', () => {
        outputText.select();
        document.execCommand('copy');
        alert('Copied to clipboard!');
    });

    // User icon dropdown
    const userIcon = document.querySelector('.user-icon');
    const dropdownContent = document.querySelector('.dropdown-content');

    userIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        dropdownContent.style.display = 'none';
    });

    // Prevent dropdown from closing when clicking inside it
    dropdownContent.addEventListener('click', (e) => {
        e.stopPropagation();
    });
});

