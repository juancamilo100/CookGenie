/*
 * Copyright (c) 2014 General Electric
 *  
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.
 * 
 */

exports.BIG_ENDIAN = "big";
exports.LITTLE_ENDIAN = "little";

exports.Reader = function (data, endianess) {
    var buffer = new Buffer(data);
    var endian = endianess || exports.LITTLE_ENDIAN;
    var index = 0;

    function terminate(ascii) {		
		var index = ascii.indexOf("\0");

		if (index < 0) {
			return ascii;
		}

		return ascii.substr(0, index);
	}
    
    this.readBytes = function(count) {
        var bytes = [];
        
        if (count == undefined) {
            count = buffer.length - index;
        }
        
        for (var i = 0; i < count; i++) {
            bytes.push(buffer[index++]);
        }
        
        return bytes;
    };
    
    this.readAscii = function(count) {
        var buffer = new Buffer(this.readBytes(count));
        var result = terminate(buffer.toString("ascii"));
        delete buffer;
        
        return result;
    };
    
    this.readHex = function(count) {
        var buffer = new Buffer(this.readBytes(count));
        var result = buffer.toString("hex");
        delete buffer;
        
        return result;
    };
    
    this.readUInt8 = function() {
        return buffer.readUInt8(index++);
    };
    
    this.readInt8 = function() {
        return buffer.readInt8(index++);
    };
    
    this.readUInt16 = function() {
        var value = (endian == exports.BIG_ENDIAN)
            ? buffer.readUInt16BE(index)
            : buffer.readUInt16LE(index);
            
        index += 2;
        return value;
    };
    
    this.readInt16 = function() {    
        var value = (endian == exports.BIG_ENDIAN)
            ? buffer.readInt16BE(index)
            : buffer.readInt16LE(index);
            
        index += 2;
        return value;
    };
    
    this.readUInt32 = function() {
        var value = (endian == exports.BIG_ENDIAN)
            ? buffer.readUInt32BE(index)
            : buffer.readUInt32LE(index);
            
        index += 4;
        return value;
    };
    
    this.readInt32 = function() {
        var value = (endian == exports.BIG_ENDIAN)
            ? buffer.readInt32BE(index)
            : buffer.readInt32LE(index);
            
        index += 4;
        return value;
    };
};

exports.Writer = function(size, endianess) {
    var buffer = new Buffer(size);
    var endian = endianess || exports.LITTLE_ENDIAN;
    var index = 0;
    
    this.toArray = function() {
        var array = [];
        
        for (var i = 0; i < index; i++) {
            array.push(buffer[i]);
        }
        
        return array;
    };
    
    this.writeBytes = function(value) {        
        for (var i = 0; i < value.length; i++) {
            buffer[index++] = value[i];
        }
    };
    
    this.writeAscii = function(value) {
        var buffer = new Buffer(value, "ascii");
        this.writeBytes(buffer);
        delete buffer;
    };
    
    this.writeHex = function(value) {
        var buffer = new Buffer(value, "hex");
        this.writeBytes(buffer);
        delete buffer;
    };
    
    this.writeUInt8 = function(value) {
        buffer.writeUInt8(value, index++);
    };
    
    this.writeInt8 = function(value) {
        buffer.writeInt8(value, index++);
    };
    
    this.writeUInt16 = function(value) {
        var value = (endian == exports.BIG_ENDIAN)
            ? buffer.writeUInt16BE(value, index)
            : buffer.writeUInt16LE(value, index);
            
        index += 2;
    };
    
    this.writeInt16 = function(value) {
        var value = (endian == exports.BIG_ENDIAN)
            ? buffer.writeInt16BE(value, index)
            : buffer.writeInt16LE(value, index);
            
        index += 2;
    };
    
    this.writeUInt32 = function(value) {
        var value = (endian == exports.BIG_ENDIAN)
            ? buffer.writeUInt32BE(value, index)
            : buffer.writeUInt32LE(value, index);
            
        index += 4;
    };
    
    this.writeInt32 = function(value) {
        var value = (endian == exports.BIG_ENDIAN)
            ? buffer.writeInt32BE(value, index)
            : buffer.writeInt32LE(value, index);
            
        index += 4;
    };
};

