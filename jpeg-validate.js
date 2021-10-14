var fs = require('fs');
var data = fs.readFileSync(process.argv[2]);
data = Array.from(data);

function assert(comp, msg = 'assert failed') {
    if(!comp) {
        throw new Error(msg);
    }
}

(function validate() {
    var eq = (x, y) => x.every((e, i) => e === y[i]);
    var next = (a, b) => a.splice(0, b);

    // always ff d8
    var soi = next(data, 2);
    assert(eq(soi, [0xff, 0xd8]));

    // always ff e0
    var app0 = next(data, 2);
    assert(eq(app0, [0xff, 0xe0]));

    // store for later: length = 16 + 3 * xThumb * yThumb
    var length = next(data, 2);
    // parse 2-byte hex: 1 byte = 8 bits
    length = (length[0] << 8) + length[1];

    // "JFIF\0"
    var id = next(data, 5);
    assert(eq(id, [0x4a, 0x46, 0x49, 0x46, 0x00]));

    var version = next(data, 2);
    console.log('jfif version: %s.%s',
        version[0], version[1].toString().padStart(2, '0'));
    
    var units = next(data, 1);
    console.log('units: %s',
        ({
            2: 'dots/cm',
            1: 'dots/in.',
            0: 'none'
        })[units]);
    
    var xden = next(data, 2);
    var yden = next(data, 2);

    xden = (xden[0] << 8) + xden[1];
    yden = (yden[0] << 8) + yden[1];
    console.log('aspect ratio: %s:%s', xden, yden);

    var xthumb = next(data, 1);
    var ythumb = next(data, 1);
    assert(length === 16 + 3 * xthumb * ythumb);

    console.log('valid');
})();
