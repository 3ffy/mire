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

mire.colorRGBA = function(red, green, blue, opacity) {
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.alpha = opacity;
};

mire.colorRGBA.prototype.getVerbose = function(simplifyToRGB, useExtraSpaces, usePercentage) {
    return mire._getVerboseRGBRGBA(this.red, this.green, this.blue, this.alpha, simplifyToRGB, useExtraSpaces, usePercentage);
};

mire.colorRGB = function(red, green, blue) {
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.alpha = 1;
};

mire.colorRGB.prototype = new mire.colorRGBA(0, 0, 0, 0);
mire.colorRGB.prototype.constructor = mire.colorRGB;

mire.colorRGB.prototype.toRGBA = function(opacity) {
    return new colorRGBA(this.red, this.green, this.blue, opacity);
};

mire.colorRGB.prototype.getVerbose = function(useExtraSpaces, usePercentage) {
    return mire._getVerboseRGBRGBA(this.red, this.green, this.blue, this.alpha, true, useExtraSpaces, usePercentage);
};

mire.colorHEX = function(hex) {
    this.red = undefined;
    this.green = undefined;
    this.blue = undefined;
    this.alpha = 1;
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
            this.red = parseInt('' + hex[0] + hex[0], 16);
            this.green = parseInt('' + hex[1] + hex[1], 16);
            this.blue = parseInt('' + hex[2] + hex[2], 16);
        } else if (hexSize == 6) {
            this.red = parseInt('' + hex[0] + hex[1], 16);
            this.green = parseInt('' + hex[2] + hex[3], 16);
            this.blue = parseInt('' + hex[4] + hex[5], 16);
        }
        hex = '' + parseInt(hex, 16);
    } else {
        this.red = (hex >> 16) & 0xff;
        this.green = (hex >> 8) & 0xff;
        this.blue = hex & 0xff;
    }
    //if the value was not convertible to rgb uplets, throw an exception
    if (this.red === undefined || this.green === undefined || this.blue === undefined) {
        throw 'Impossible to convert the hex value to r, g & b values.';
    }
};

mire.colorHEX.prototype = new mire.colorRGB(0, 0, 0);
mire.colorHEX.prototype.constructor = mire.colorHEX;

mire.colorHEX.prototype.getVerbose = function(upperCase, allowCombine) {
    //convert to hexadecimal representation
    var red = '' + this.red.toString(16);
    var green = '' + this.green.toString(16);
    var blue = '' + this.blue.toString(16);
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
    console.log('color', name, color);
    this.red = color.r;
    this.green = color.g;
    this.blue = color.b;
    this.alpha = 1;
};

mire.colorName.prototype = new mire.colorHEX(0);
mire.colorName.prototype.constructor = mire.colorName;

mire.colorHSL = function(hue, saturation, lightness) {
    this.hue = hue;
    this.saturation = saturation;
    this.lightness = lightness;
};

mire.colorHSV = function(hue, saturation, value) {
    this.hue = hue;
    this.saturation = saturation;
    this.value = value;
};

mire.colorHSLA = function(hue, saturation, lightness, opacity) {
    this.hue = hue;
    this.saturation = saturation;
    this.lightness = lightness;
    this.opacity = opacity;
};

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
    this.cyan = cyan;
    this.magenta = magenta;
    this.yellow = yellow;
    this.key = key;
};

mire.colorLambda = function(lambda) {
    this.lambda = lambda;
};

mire.colorCIEXYZ = function(xyz) {};

mire.colorCIELAB = function(lab) {};

mire.gradient = function() {};

mire.filterTruc = function() {};

mire.colors = {
    'red': {
        r: 0,
        g: 255,
        b: 0
    },
    'blue': {
        r: 0,
        g: 0,
        b: 255
    }
};