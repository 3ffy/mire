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

mire._HUEToRGB = function(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
};

mire.color = function(opacity) {
    this._hex = undefined;
    this._name = undefined;
    this._lambda = undefined;
    this._pantone = undefined;
    this._rgb = undefined;
    this._hsl = undefined;
    this._hsb = undefined;
    this._cmyk = undefined;
    this._alpha = (typeof opacity == 'undefined') ? 1 : opacity;
};

mire.color.prototype.getHEX = function() {
    if (this._hex === undefined) {
        this._toHEX();
    }
    return new mire.colorHEX(this._hex);
};

mire.color.prototype.getRGB = function() {
    if (this._rgb === undefined) {
        this._toRGB();
    }
    return new mire.colorRGB(this._rgb.r, this._rgb.g, this._rgb.g);
};

mire.color.prototype.getRGBA = function(opacity) {
    if (this._rgb === undefined) {
        this._toRGB();
    }
    if (typeof opacity != number) {
        opacity = (this._alpha === undefined) ? 1 : this._alpha;
    }
    return new mire.colorRGB(this._rgb.r, this._rgb.g, this._rgb.b, opacity);
};

mire.color.prototype.getHSL = function() {
    if (this._hsl === undefined) {
        this._toHSL();
    }
    return new mire.colorHSL(this._hsl.h, this._hsl.s, this._hsl.l);
};

mire.color.prototype.getHSLA = function(opacity) {
    if (this._hsl === undefined) {
        this._toHSL();
    }
    if (typeof opacity != number) {
        opacity = (this._alpha === undefined) ? 1 : this._alpha;
    }
    return new mire.colorHSLA(this._hsl.h, this._hsl.s, this._hsl.l, opacity);
};

mire.color.prototype.getHSB = function() {
    if (this._hsb === undefined) {
        this._toHSB();
    }
    return new mire.colorHSB(this._hsb.h, this._hsb.s, this._hsb.b);
};

mire.colorRGBA.prototype.toHEX = function() {
    if (this._rgb === undefined) {
        this._toRGB();
    }
    //convert to hexadecimal representation
    var red = '' + this._rgb.r.toString(16);
    var green = '' + this._rgb.g.toString(16);
    var blue = '' + this._rgb.b.toString(16);
    //get results with 2 digits (except if allowCombine == true and result combinable on 3 digit instead of 6)
    red = red.padLeft(2, '0');
    green = green.padLeft(2, '0');
    blue = blue.padLeft(2, '0');
    this._hex = '' + red + green + blue;
};

mire.color.prototype.getDeterminist = function() {
    if (this._hex === undefined) {
        this._toHEX();
    }
    //convert to hexadecimal representation (with 2 digits)
    var alpha = (this._alpha * 100)
        .toString(16);
    if (alpha.length < 2) {
        alpha = alpha.padLeft(2, '0');
    }
    return '' + alpha + this._hex;
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

mire.colorRGBA.prototype.toHSL = function() {
    //normalize the values
    var r = this._rgb.r / 255;
    var g = this._rgb.g / 255;
    var b = this._rgb.b / 255;
    //get m & M a initial values
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    //detect if achromatic
    if (max == min) {
        h = s = 0;
    } else {
        var d = max - min;
        s = (l > 0.5 ? ) d / (2 - max - min): d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    this._hsl = {};
    this._hsl.h = h;
    this._hsl.s = s;
    this._hsl.l = l;
};

mire.colorRGBA.prototype.toHSB = function() {
    //normalize the values
    var r = this._rgb.r / 255;
    var g = this._rgb.g / 255;
    var b = this._rgb.b / 255;
    //get m & M a initial values
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h, s, v = max;
    var d = max - min;
    s = max == 0 ? 0 : d / max;
    //detect if achromatic
    if (max == min) {
        h = 0;
    } else {
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    this._hsb = {};
    this._hsb.h = h;
    this._hsb.s = s;
    this._hsb.b = v;
};

mire.colorRGB = function(red, green, blue) {
    mire.color.call(this);
    this._rgb = {};
    this._rgb.r = red;
    this._rgb.g = green;
    this._rgb.b = blue;
};

mire.colorRGB.prototype = new mire.colorRGBA(0, 0, 0, 0);
mire.colorRGB.prototype.constructor = mire.colorRGB;

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
            this._hex = '' + hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        } else if (hexSize == 6) {
            red = parseInt('' + hex[0] + hex[1], 16);
            green = parseInt('' + hex[2] + hex[3], 16);
            blue = parseInt('' + hex[4] + hex[5], 16);
            this._hex = '' + hex[0] + hex[1] + hex[2] + hex[3] + hex[4] + hex[5];
        }
        hex = '' + parseInt(hex, 16);
    } else {
        red = (hex >> 16) & 0xff;
        green = (hex >> 8) & 0xff;
        blue = hex & 0xff;
        this._hex = '' + hex.toString(16);
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

mire.colorHEX.prototype = new mire.colorRGB();
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

mire.colorHSLA = function(hue, saturation, lightness, opacity) {
    mire.color.call(this, opacity);
    this._hsl = {};
    this._hsl.h = hue;
    this._hsl.s = saturation;
    this._hsl.l = lightness;
};

mire.colorHSLA.prototype = new mire.color();
mire.colorHSLA.prototype.constructor = mire.colorHSLA;

mire.colorHSLA.prototype._toRGB = function() {
    var r, g, b;
    //detect if achromatic
    if (this._hsl.s == 0) {
        r = g = b = this._hsl.l;
    } else {
        var q = (this._hsl.l < 0.5) ? this._hsl.l * (1 + this._hsl.s) : this._hsl.l + this._hsl.s - this._hsl.l * this._hsl.s;
        var p = 2 * this._hsl.l - q;
        r = mire._HUEToRGB(p, q, this._hsl.h + 1 / 3);
        g = mire._HUEToRGB(p, q, this._hsl.h);
        b = mire._HUEToRGB(p, q, this._hsl.h - 1 / 3);
    }
    this._rgb = {};
    this._rgb.r = Math.round(r * 255);
    this._rgb.g = Math.round(g * 255);
    this._rgb.b = Math.round(b * 255);
};

mire.colorHSL.prototype.toHSB = function(){
    //TODO
};

mire.colorHSL = function(hue, saturation, lightness) {
    mire.color.call(this);
    this._hsl = {};
    this._hsl.h = hue;
    this._hsl.s = saturation;
    this._hsl.l = lightness;
};

mire.colorHSL.prototype = new mire.colorHSLA();
mire.colorHSL.prototype.constructor = mire.colorHSL;

mire.colorHSL.prototype.getVerbose = function() {
    //TODO passer la valeur en angles + pourcentages pour sortir la notation css != des calculs
};

// = HSV
mire.colorHSB = function(hue, saturation, brightness) {
    mire.color.call(this);
    this._hsl = {};
    this._hsl.h = hue;
    this._hsl.s = saturation;
    this._hsl.l = lightness;
};

mire.colorHSB.prototype._toRGB = function() {
    var r, g, b;
    var i = Math.floor(this._hsb.h * 6);
    var f = this._hsb.h * 6 - i;
    var p = this._hsb.h.b * (1 - this._hsb.s);
    var q = this._hsb.b * (1 - f * this._hsb.s);
    var t = this._hsb.b * (1 - (1 - f) * this._hsb.s);
    switch (i % 6) {
        case 0:
            r = this._hsb.b;
            g = t;
             b = p;
            break;
        case 1:
            r = q; g = this._hsb.b; b = p;
            break;
        case 2:
            r = p; g = this._hsb.b; b = t;
            break;
        case 3:
            r = p; g = q; b = this._hsb.b;
            break;
        case 4:
            r = t; g = p; b = this._hsb.b;
            break;
        case 5:
            r = this._hsb.b; g = p; b = q;
            break;
    }
    this._rgb = {};
    this._rgb.r = r;
    this._rgb.g = g;
    this._rgb.b = b;
};

mire.colorHSB.prototype._toHSL = function() {
    //TOOD
};

mire.colorHSB.prototype = new mire.color();
mire.colorHSB.prototype.constructor = mire.colorHSB;

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