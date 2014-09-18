var mire = {};

//leftpad
if (typeof String.prototype.padLeft != 'function') {
    String.prototype.padLeft = function(length, padChar) {
        if (typeof(length) == 'undefined') {
            length = 0;
        }
        if (typeof(padChar) == 'undefined') {
            padChar = ' ';
        }
        if (length + 1 >= this.length) {
            return Array(length + 1 - this.length)
                .join(padChar) + this;
        }
        return this;
    };
};

mire._getVerboseRGBRGBA = function(red, green, blue, alpha, simplifyToRGB, useExtraSpaces, usePercentage) {
    var ret;
    var delim = (useExtraSpaces == false) ? ',' : ', ';
    //format rgba uplets
    if (usePercentage == true) {
        red = (red * 100 / 255) + '%';
        green = (green * 100 / 255) + '%';
        blue = (blue * 100 / 255) + '%';
        alpha = (alpha * 100) + '%';
    }
    //use the right pattern
    if ((simplifyToRGB == true) && (alpha == 1)) {
        ret = 'rgb(' + red + delim + green + delim + blue + ')';
    } else {
        ret = 'rgba(' + red + delim + green + delim + blue + delim + alpha + ')';
    }
    return ret;
};

mire.color = function(opacity){
    this._name = undefined;
    this._lambda = undefined;
    this._pantone = undefined;
    this._rgb = undefined;
    this._hsl = undefined;
    this._cmyk = undefined;
    this._alpha = (typeof opacity == 'undefined')? 1 : opacity;
};

mire.color.prototype.getDeterminist = function(){
    if(this._rgb === undefined){
        this._toRGB();
    }
    //convert to hexadecimal representation
    var alpha = (this._alpha*100).toString(16);
    var red = this._rgb.r.toString(16);
    var green = this._rgb.g.toString(16);
    var blue = this._rgb.b.toString(16);
    //get results with 2 digits (except if allowCombine == true and result combinable on 3 digit instead of 6)
    if(alpha.length < 2){
        alpha = alpha.padLeft(2, '0');
    }    
    if(red.length < 2){
        red = red.padLeft(2, '0');
    }
    if(green.length < 2){
        green = green.padLeft(2, '0');
    }
    if(blue.length < 2){
        blue = blue.padLeft(2, '0');
    }
    return '' + alpha + red + green + blue;
};

mire.colorRGBA = function(red, green, blue, opacity) {
    mire.color.call(this, opacity);
    this._rgb = {};
    this._rgb.r = red;
    this._rgb.g = green;
    this._rgb.b = blue;
};

mire.colorRGBA.prototype = new mire.color();
mire.colorRGBA.prototype.constructor = mire.colorRGBA;

mire.colorRGBA.prototype.getVerbose = function(simplifyToRGB, useExtraSpaces, usePercentage) {
    return mire._getVerboseRGBRGBA(this._rgb.r, this._rgb.g, this._rgb.b, this._alpha, simplifyToRGB, useExtraSpaces, usePercentage);
};

mire.colorRGB = function(red, green, blue) {
    mire.color.call(this);
    this._rgb = {};
    this._rgb.r = red;
    this._rgb.g = green;
    this._rgb.b = blue;
};

mire.colorRGB.prototype = new mire.colorRGBA(0,0,0,0);
mire.colorRGB.prototype.constructor = mire.colorRGB;

mire.colorRGB.prototype.toRGBA = function(opacity) {
    return new colorRGBA(this._rgb.r, this._rgb.g, this._rgb.b, opacity);
};

mire.colorRGB.prototype.getVerbose = function(useExtraSpaces, usePercentage) {
    return mire._getVerboseRGBRGBA(this._rgb.r, this._rgb.g, this._rgb.b, this._alpha, true, useExtraSpaces, usePercentage);
};

mire.colorHEX = function(hex) {
    mire.color.call(this);
    var red = undefined;
    var green = undefined;
    var blue = undefined;
    //convert the value to rgb uplets (0-255)
    if (typeof hex == 'string') {
        var hexSize = hex.length;
        //remove the eventual first hashtag
        if (hex[0] == '#') {
            hex = hex.substring(1);
            hexSize = hex.length;
        }
        //get the uplets (normal or reducted form)
        if (hexSize == 3) {
            red = parseInt('' + hex[0] + hex[0], 16);
            green = parseInt('' + hex[1] + hex[1], 16);
            blue = parseInt('' + hex[2] + hex[2], 16);
        } else if (hexSize == 6) {
            red = parseInt('' + hex[0] + hex[1], 16);
            green = parseInt('' + hex[2] + hex[3], 16);
            blue = parseInt('' + hex[4] + hex[5], 16);
        }
        hex = '' + parseInt(hex, 16);
    } else {
        red = (hex >> 16) & 0xff;
        green = (hex >> 8) & 0xff;
        blue = hex & 0xff;
    }
    //if the value was not convertible to rgb uplets, throw an exception
    if (red === undefined || green === undefined || blue === undefined) {
        throw 'Impossible to convert the hex value to r, g & b values.';
    }
    this._rgb = {};
    this._rgb.r = red;
    this._rgb.g = green;
    this._rgb.b = blue;
};

mire.colorHEX.prototype = new mire.color();
mire.colorHEX.prototype.constructor = mire.colorHEX;

mire.colorHEX.prototype.getVerbose = function(upperCase, allowCombine) {
    //convert to hexadecimal representation
    var red = '' + this._rgb.r.toString(16);
    var green = '' + this._rgb.g.toString(16);
    var blue = '' + this._rgb.b.toString(16);
    //get results with 2 digits (except if allowCombine == true and result combinable on 3 digit instead of 6)
    if ((allowCombine != true) || (red.length > 1) || (green.length > 1) || (blue.length > 1)) {
        red = red.padLeft(2, '0');
        green = green.padLeft(2, '0');
        blue = blue.padLeft(2, '0');
    }
    //use uppercase if 
    if (upperCase) {
        red = red.toUpperCase();
        green = green.toUpperCase();
        blue = blue.toUpperCase();
    }
    //concat result uplets by uplets
    return '#' + red + green + blue;
};

mire.colorName = function(name) {
    if (mire.colors[name] === undefined) {
        throw 'Unknown color ' + name + '.';
    }
    var color = mire.colors[name];
    this._rgb = {};
    this._rgb.r = color.r;
    this._rgb.g = color.g;
    this._rgb.b = color.b;
};

mire.colorName.prototype = new mire.colorHEX(0);
mire.colorName.prototype.constructor = mire.colorName;

mire.colorHSL = function(hue, saturation, lightness) {
    mire.color.call(this);
    this._hsl = {};
    this._hsl.h = hue;
    this._hsl.s = saturation;
    this._hsl.l = lightness;
};

mire.colorHSL.prototype = new mire.color();
mire.colorHSL.prototype.constructor = mire.colorHSL;

mire.colorHSLA = function(hue, saturation, lightness, opacity) {
    mire.color.call(this, opacity);
    this._hsl = {};
    this._hsl.h = hue;
    this._hsl.s = saturation;
    this._hsl.l = lightness;
};

mire.colorHSLA.prototype = new mire.color();
mire.colorHSLA.prototype.constructor = mire.colorHSLA;

// mire.colorHSV = function(hue, saturation, value) {
//     this.hue = hue;
//     this.saturation = saturation;
//     this.value = value;
// };

/**
 * [colorCMYK description]
 *
 * @param {[type]} cyan    [description]
 * @param {[type]} magenta [description]
 * @param {[type]} yellow  [description]
 * @param {[type]} key     =black
 * @return {[type]} [description]
 */
mire.colorCMYK = function(cyan, magenta, yellow, key) {
    mire.color.call(this);
    this._cmyk.c = 100;
    this._cmyk.m = 100;
    this._cmyk.y = 100;
    this._cmyk.k = 100;
};

mire.colorCMYK.prototype = new mire.color();
mire.colorCMYK.prototype.constructor = mire.colorCMYK;


// mire.colorLambda = function(lambda) {
//     this.lambda = lambda;
// };

// mire.colorCIEXYZ = function(xyz) {};

// mire.colorCIELAB = function(lab) {};

mire.gradient = function() {};

mire.filterTruc = function() {};

mire.colors = {
    'red': {
        r: 255,
        g: 0,
        b: 0
    },
    'blue': {
        r: 0,
        g: 0,
        b: 255
    }
};