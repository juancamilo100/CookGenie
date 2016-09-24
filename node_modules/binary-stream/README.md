# Progressive Stream IO

This node.js package provides a set of classes used to progressively read and write to a stream or buffer.

## Table of Contents

- [Installation](#installation)
- [API](#api)
  - [stream.BIG_ENDIAN](#streambig_endian)
  - [stream.LITTLE_ENDIAN](#streamlittle_endian)
  - [stream.Reader(data, endianess)](#streamreaderdata-endianess)
    - [reader.readBytes(count)](#readerreadbytescount)
    - [reader.readAscii(count)](#readerreadasciicount)
    - [reader.readHex(count)](#readerreadhexcount)
    - [reader.readUInt8()](#readerreaduint8)
    - [reader.readInt8()](#readerreadint8)
    - [reader.readUInt16()](#readerreaduint16)
    - [reader.readInt16()](#readerreadint16)
    - [reader.readUInt32()](#readerreaduint32)
    - [reader.readInt32()](#readerreadint32)
  - [stream.Writer(size, endianess)](#streamwritersize-endianess)
    - [writer.writeBytes(value)](#writerwritebytesvalue)
    - [writer.writeAscii(value)](#writerwriteasciivalue)
    - [writer.writeHex(value)](#writerwritehexvalue)
    - [writer.writeUInt8(value)](#writerwriteuint8)
    - [writer.writeInt8(value)](#writerwriteint8)
    - [writer.writeUInt16(value)](#writerwriteuint16)
    - [writer.writeInt16(value)](#writerwriteint16)
    - [writer.writeUInt32(value)](#writerwriteuint32)
    - [writer.writeInt32(value)](#writerwriteint32)
    - [writer.toArray()](#writertoarray)

## Installation
To install this application using the node.js package manager, issue the following commands:

```
npm install git+https://github.com/GEMakers/binary-stream.git
```

To include this package in your application, use the *require* function.

``` javascript
var stream = require("binary-stream");
```

## API
Below is the documentation for each of the functions provided by this plugin, as well as a few examples showing how to use them.

### *stream.BIG_ENDIAN*
This constant is used to denote that integers should be serialized using big endian. For example, if the 16 bit integer 0x1234 was serialized to a byte array, the resulting contents will be [0x12, 0x34].

``` javascript
var stream = require("binary-stream");

console.log(stream.BIG_ENDIAN); // "big"
```

### *stream.LITTLE_ENDIAN*
This constant is used to denote that integers should be serialized using little endian. For example, if the 16 bit integer 0x1234 was serialized to a byte array, the resulting contents will be [0x34, 0x12].

``` javascript
var stream = require("binary-stream");

console.log(stream.LITTLE_ENDIAN); // "little"
```

### *stream.Reader(data, endianess)*
The stream reader class is used to read values with the specified *endianess* from a *data* buffer. If *endianess* is undefined, it is assumed to be little endian.

``` javascript
var stream = require("binary-stream");

var reader = new stream.Reader([0x12, 0x34, 0x56, 0x78], stream.BIG_ENDIAN);
console.log(reader.readUInt16()); // 4660
console.log(reader.readUInt8());  // 86
console.log(reader.readUInt8());  // 120
delete reader;
```

### *reader.readBytes(count)*
Reads *count* bytes from the stream and returns as a byte array. If *count* is undefined, it is assumed to be the length of the stream.

``` javascript
var stream = require("binary-stream");

var reader = new stream.Reader([0x12, 0x34, 0x56, 0x78]);
console.log(reader.readBytes(2)); // [ 18, 52 ]
delete reader;
```

### *reader.readAscii(count)*
Reads *count* bytes from the stream and returns as an ASCII null terminated string. If *count* is undefined, it is assumed to be the length of the stream.

``` javascript
var stream = require("binary-stream");

var reader = new stream.Reader([0x73, 0x74, 0x72, 0x65, 0x61, 0x6d]);
console.log(reader.readAscii()); // "stream"
delete reader;
```

### *reader.readHex(count)*
Reads *count* bytes from the stream and returns as a hexadecimal string. If *count* is undefined, it is assumed to be the length of the stream.

``` javascript
var stream = require("binary-stream");

var reader = new stream.Reader([0x12, 0x34, 0x56, 0x78]);
console.log(reader.readHex()); // "12345678"
delete reader;
```

### *reader.readUInt8()*
Reads an 8-bit unsigned integer from the stream.

``` javascript
var stream = require("binary-stream");

var reader = new stream.Reader([0xfe, 0xff]);
console.log(reader.readUInt8()); // 254
console.log(reader.readUInt8()); // 255
delete reader;
```

### *reader.readInt8()*
Reads an 8-bit signed integer from the stream.

``` javascript
var stream = require("binary-stream");

var reader = new stream.Reader([0xfe, 0xff]);
console.log(reader.readInt8()); // -2
console.log(reader.readInt8()); // -1
delete reader;
```

### *reader.readUInt16()*
Reads a 16-bit unsigned integer from the stream.

``` javascript
var stream = require("binary-stream");

var reader = new stream.Reader([0xfe, 0xff]);
console.log(reader.readUInt16()); // 65534
delete reader;
```

### *reader.readInt16()*
Reads a 16-bit signed integer from the stream.

``` javascript
var stream = require("binary-stream");

var reader = new stream.Reader([0xfe, 0xff]);
console.log(reader.readInt16()); // -2
delete reader;
```

### *reader.readUInt32()*
Reads a 32-bit unsigned integer from the stream.

``` javascript
var stream = require("binary-stream");

var reader = new stream.Reader([0xff, 0xff, 0xff, 0xff]);
console.log(reader.readUInt32()); // 4294967295
delete reader;
```

### *reader.readInt32()*
Reads a 32-bit signed integer from the stream.

``` javascript
var stream = require("binary-stream");

var reader = new stream.Reader([0xff, 0xff, 0xff, 0xff]);
console.log(reader.readInt32()); // -1
delete reader;
```

### *stream.Writer(size, endianess)*
The stream writer class is used to write values with the specified *endianess* to a buffer of the defined max *size*. If *endianess* is undefined, it is assumed to be little endian.

``` javascript
var stream = require("binary-stream");

var writer = new stream.Writer(4, stream.BIG_ENDIAN);
writer.writeUInt16(0x1234);
writer.writeUInt8(0x56);
writer.writeUInt8(0x78);
console.log(writer.toArray()); // [ 18, 52, 86, 120 ]
delete writer;
```

### *writer.writeBytes(value)*
Writes the byte array *value* to the stream.

``` javascript
var stream = require("binary-stream");

var writer = new stream.Writer(2);
writer.writeBytes([0x12, 0x34]);
console.log(writer.toArray()); // [ 18, 52 ]
delete writer;
```

### *writer.writeAscii(value)*
Writes the ASCII null terminated string *value* to the stream.

``` javascript
var stream = require("binary-stream");

var writer = new stream.Writer(6);
writer.writeAscii("stream");
console.log(writer.toArray()); // [ 115, 116, 114, 101, 97, 109 ]
delete writer;
```

### *writer.writeHex(value)*
Writes the hexadecimal string *value* to the stream.

``` javascript
var stream = require("binary-stream");

var writer = new stream.Writer(6);
writer.writeHex("ab12cd34ef56");
console.log(writer.toArray()); // [ 171, 18, 205, 52, 239, 86 ]
delete writer;
```

### *writer.writeUInt8()*
Writes an 8-bit unsigned integer to the stream.

``` javascript
var stream = require("binary-stream");

var writer = new stream.Writer(2);
writer.writeUInt8(254);
writer.writeUInt8(255);
console.log(writer.toArray()); // [ 254, 255 ]
delete writer;
```

### *writer.writeInt8()*
Writes an 8-bit signed integer to the stream.

``` javascript
var stream = require("binary-stream");

var writer = new stream.Writer(2);
writer.writeInt8(-2);
writer.writeInt8(-1);
console.log(writer.toArray()); // [ 254, 255 ]
delete writer;
```

### *writer.writeUInt16()*
Writes a 16-bit unsigned integer to the stream.

``` javascript
var stream = require("binary-stream");

var writer = new stream.Writer(2);
writer.writeUInt16(65534);
console.log(writer.toArray()); // [ 254, 255 ]
delete writer;
```

### *writer.writeInt16()*
Writes a 16-bit signed integer to the stream.

``` javascript
var stream = require("binary-stream");

var writer = new stream.Writer(2);
writer.writeInt16(-2);
console.log(writer.toArray()); // [ 254, 255 ]
delete writer;
```

### *writer.writeUInt32()*
Writes a 32-bit unsigned integer to the stream.

``` javascript
var stream = require("binary-stream");

var writer = new stream.Writer(4);
writer.writeUInt32(4294967294);
console.log(writer.toArray()); // [ 254, 255, 255, 255 ]
delete writer;
```

### *writer.writeInt32()*
Writes a 32-bit signed integer to the stream.

``` javascript
var stream = require("binary-stream");

var writer = new stream.Writer(4);
writer.writeInt32(-2);
console.log(writer.toArray()); // [ 254, 255, 255, 255 ]
delete writer;
```


### *writer.toArray()*
Returns the content written to the stream as a byte array.

``` javascript
var stream = require("binary-stream");

var writer = new stream.Writer(10);
writer.writeInt32(-2);
console.log(writer.toArray()); // [ 254, 255, 255, 255 ]
delete writer;
```
