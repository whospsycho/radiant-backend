var randomstring = require("randomstring");

function makeString(length: number) {
    return randomstring.generate({
        length: length,
        charset: 'alphabetic'
    });
}

export default function makeInvite() {
    const string1 = makeString(8);
    const string2 = makeString(8);

    const invite = 'radiant-' + string1 + '-' + string2;

    return invite;
}