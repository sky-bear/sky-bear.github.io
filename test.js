/**
 * @param {string} text
 * @param {string} brokenLetters
 * @return {number}
 */
var canBeTypedWords = function (text, brokenLetters) {
    let num = 0;
    const textArray = text.split(" ");
    const brokenLettersMap = {};
    for (let i = 0;i < brokenLetters.length;i++) {
        console.log(1)
        brokenLettersMap[brokenLetters[i]] = true
    }
    for (let i = 0;  i < textArray.length;i++) {
        const curText = textArray[i];
        let flag = false;
        for (let j = 0;  j < curText.length;j++) {
            if (brokenLettersMap[curText[j]]) {
                flag = true;
                break;
            }
        }
        if (!flag) {
            num += 1;
        }
    }
    return num;
};

canBeTypedWords("hello world", "ad")