class I2D {
    // NOTE: this is the first development
    //   version and doesn't make full
    //   use of the extra 6 bits.
    static VERSION = '1.0-proto';
    static getData(data, { x, y }) {
        var offset = 3;
        var output = new Uint8Array(3 + x * y);

        /** full 8 bits */
        var BYTE_MAX = 0b11111111;
        /** 8-bit MSB */
        var SB_MSB = 0b10000000;

        // compute x/y + add ';'
        // add MSB to avoid sending
        //  unsendable characters, such
        //  as chars from 0-32
        output[0] = x & BYTE_MAX | SB_MSB;
        output[1] = y & BYTE_MAX | SB_MSB;
        output[2] = ';'.charCodeAt();

        // @todo: implement run-length encoding
        for(var index = 0; index < data.length; index += 4) {
            var [r, g, b] = [
                data[index + 0],
                data[index + 1],
                data[index + 2],
            ];
            
            // get grayscale equiv.
            var grayscale =
                0.299 * r + 0.587 * g + 0.114 * b;
            
            // determine if value is 0 or 1
            var color = 1 * (grayscale > 127);

            // set MSB to 1
            color |= SB_MSB;
            //         calculate output index based on input index
            output[offset + (index >>> 2)] = color;
        }

        return output;
    }
}

// usage:
var data = I2D.getData([
    255, 255, 255, 255, // 2x2 image of a   w b   grid
      0,   0,   0,   0, //////////////////  b w  /////
      0,   0,   0,   0,
    255, 255, 255, 255,
], { x: 2, y: 2 });

console.log(data); // raw data

console.log( // binary representation
    Array.from(data)
    .map(x => x.toString(2))
    .join(' '))

console.log( // ASCII / UTF-8
    Array.from(data)
    .map(String.fromCharCode)
    .join(''));
