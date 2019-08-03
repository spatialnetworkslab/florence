(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.transshape = {}));
}(this, function (exports) { 'use strict';

  function define(constructor, factory, prototype) {
    constructor.prototype = factory.prototype = prototype;
    prototype.constructor = constructor;
  }

  function extend(parent, definition) {
    var prototype = Object.create(parent.prototype);
    for (var key in definition) prototype[key] = definition[key];
    return prototype;
  }

  function Color() {}

  var darker = 0.7;
  var brighter = 1 / darker;

  var reI = "\\s*([+-]?\\d+)\\s*",
      reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",
      reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
      reHex3 = /^#([0-9a-f]{3})$/,
      reHex6 = /^#([0-9a-f]{6})$/,
      reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$"),
      reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$"),
      reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$"),
      reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$"),
      reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$"),
      reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");

  var named = {
    aliceblue: 0xf0f8ff,
    antiquewhite: 0xfaebd7,
    aqua: 0x00ffff,
    aquamarine: 0x7fffd4,
    azure: 0xf0ffff,
    beige: 0xf5f5dc,
    bisque: 0xffe4c4,
    black: 0x000000,
    blanchedalmond: 0xffebcd,
    blue: 0x0000ff,
    blueviolet: 0x8a2be2,
    brown: 0xa52a2a,
    burlywood: 0xdeb887,
    cadetblue: 0x5f9ea0,
    chartreuse: 0x7fff00,
    chocolate: 0xd2691e,
    coral: 0xff7f50,
    cornflowerblue: 0x6495ed,
    cornsilk: 0xfff8dc,
    crimson: 0xdc143c,
    cyan: 0x00ffff,
    darkblue: 0x00008b,
    darkcyan: 0x008b8b,
    darkgoldenrod: 0xb8860b,
    darkgray: 0xa9a9a9,
    darkgreen: 0x006400,
    darkgrey: 0xa9a9a9,
    darkkhaki: 0xbdb76b,
    darkmagenta: 0x8b008b,
    darkolivegreen: 0x556b2f,
    darkorange: 0xff8c00,
    darkorchid: 0x9932cc,
    darkred: 0x8b0000,
    darksalmon: 0xe9967a,
    darkseagreen: 0x8fbc8f,
    darkslateblue: 0x483d8b,
    darkslategray: 0x2f4f4f,
    darkslategrey: 0x2f4f4f,
    darkturquoise: 0x00ced1,
    darkviolet: 0x9400d3,
    deeppink: 0xff1493,
    deepskyblue: 0x00bfff,
    dimgray: 0x696969,
    dimgrey: 0x696969,
    dodgerblue: 0x1e90ff,
    firebrick: 0xb22222,
    floralwhite: 0xfffaf0,
    forestgreen: 0x228b22,
    fuchsia: 0xff00ff,
    gainsboro: 0xdcdcdc,
    ghostwhite: 0xf8f8ff,
    gold: 0xffd700,
    goldenrod: 0xdaa520,
    gray: 0x808080,
    green: 0x008000,
    greenyellow: 0xadff2f,
    grey: 0x808080,
    honeydew: 0xf0fff0,
    hotpink: 0xff69b4,
    indianred: 0xcd5c5c,
    indigo: 0x4b0082,
    ivory: 0xfffff0,
    khaki: 0xf0e68c,
    lavender: 0xe6e6fa,
    lavenderblush: 0xfff0f5,
    lawngreen: 0x7cfc00,
    lemonchiffon: 0xfffacd,
    lightblue: 0xadd8e6,
    lightcoral: 0xf08080,
    lightcyan: 0xe0ffff,
    lightgoldenrodyellow: 0xfafad2,
    lightgray: 0xd3d3d3,
    lightgreen: 0x90ee90,
    lightgrey: 0xd3d3d3,
    lightpink: 0xffb6c1,
    lightsalmon: 0xffa07a,
    lightseagreen: 0x20b2aa,
    lightskyblue: 0x87cefa,
    lightslategray: 0x778899,
    lightslategrey: 0x778899,
    lightsteelblue: 0xb0c4de,
    lightyellow: 0xffffe0,
    lime: 0x00ff00,
    limegreen: 0x32cd32,
    linen: 0xfaf0e6,
    magenta: 0xff00ff,
    maroon: 0x800000,
    mediumaquamarine: 0x66cdaa,
    mediumblue: 0x0000cd,
    mediumorchid: 0xba55d3,
    mediumpurple: 0x9370db,
    mediumseagreen: 0x3cb371,
    mediumslateblue: 0x7b68ee,
    mediumspringgreen: 0x00fa9a,
    mediumturquoise: 0x48d1cc,
    mediumvioletred: 0xc71585,
    midnightblue: 0x191970,
    mintcream: 0xf5fffa,
    mistyrose: 0xffe4e1,
    moccasin: 0xffe4b5,
    navajowhite: 0xffdead,
    navy: 0x000080,
    oldlace: 0xfdf5e6,
    olive: 0x808000,
    olivedrab: 0x6b8e23,
    orange: 0xffa500,
    orangered: 0xff4500,
    orchid: 0xda70d6,
    palegoldenrod: 0xeee8aa,
    palegreen: 0x98fb98,
    paleturquoise: 0xafeeee,
    palevioletred: 0xdb7093,
    papayawhip: 0xffefd5,
    peachpuff: 0xffdab9,
    peru: 0xcd853f,
    pink: 0xffc0cb,
    plum: 0xdda0dd,
    powderblue: 0xb0e0e6,
    purple: 0x800080,
    rebeccapurple: 0x663399,
    red: 0xff0000,
    rosybrown: 0xbc8f8f,
    royalblue: 0x4169e1,
    saddlebrown: 0x8b4513,
    salmon: 0xfa8072,
    sandybrown: 0xf4a460,
    seagreen: 0x2e8b57,
    seashell: 0xfff5ee,
    sienna: 0xa0522d,
    silver: 0xc0c0c0,
    skyblue: 0x87ceeb,
    slateblue: 0x6a5acd,
    slategray: 0x708090,
    slategrey: 0x708090,
    snow: 0xfffafa,
    springgreen: 0x00ff7f,
    steelblue: 0x4682b4,
    tan: 0xd2b48c,
    teal: 0x008080,
    thistle: 0xd8bfd8,
    tomato: 0xff6347,
    turquoise: 0x40e0d0,
    violet: 0xee82ee,
    wheat: 0xf5deb3,
    white: 0xffffff,
    whitesmoke: 0xf5f5f5,
    yellow: 0xffff00,
    yellowgreen: 0x9acd32
  };

  define(Color, color, {
    displayable: function() {
      return this.rgb().displayable();
    },
    hex: function() {
      return this.rgb().hex();
    },
    toString: function() {
      return this.rgb() + "";
    }
  });

  function color(format) {
    var m;
    format = (format + "").trim().toLowerCase();
    return (m = reHex3.exec(format)) ? (m = parseInt(m[1], 16), new Rgb((m >> 8 & 0xf) | (m >> 4 & 0x0f0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1)) // #f00
        : (m = reHex6.exec(format)) ? rgbn(parseInt(m[1], 16)) // #ff0000
        : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
        : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
        : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
        : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
        : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
        : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
        : named.hasOwnProperty(format) ? rgbn(named[format])
        : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
        : null;
  }

  function rgbn(n) {
    return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
  }

  function rgba(r, g, b, a) {
    if (a <= 0) r = g = b = NaN;
    return new Rgb(r, g, b, a);
  }

  function rgbConvert(o) {
    if (!(o instanceof Color)) o = color(o);
    if (!o) return new Rgb;
    o = o.rgb();
    return new Rgb(o.r, o.g, o.b, o.opacity);
  }

  function rgb(r, g, b, opacity) {
    return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
  }

  function Rgb(r, g, b, opacity) {
    this.r = +r;
    this.g = +g;
    this.b = +b;
    this.opacity = +opacity;
  }

  define(Rgb, rgb, extend(Color, {
    brighter: function(k) {
      k = k == null ? brighter : Math.pow(brighter, k);
      return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    darker: function(k) {
      k = k == null ? darker : Math.pow(darker, k);
      return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
    },
    rgb: function() {
      return this;
    },
    displayable: function() {
      return (-0.5 <= this.r && this.r < 255.5)
          && (-0.5 <= this.g && this.g < 255.5)
          && (-0.5 <= this.b && this.b < 255.5)
          && (0 <= this.opacity && this.opacity <= 1);
    },
    hex: function() {
      return "#" + hex(this.r) + hex(this.g) + hex(this.b);
    },
    toString: function() {
      var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
      return (a === 1 ? "rgb(" : "rgba(")
          + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", "
          + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", "
          + Math.max(0, Math.min(255, Math.round(this.b) || 0))
          + (a === 1 ? ")" : ", " + a + ")");
    }
  }));

  function hex(value) {
    value = Math.max(0, Math.min(255, Math.round(value) || 0));
    return (value < 16 ? "0" : "") + value.toString(16);
  }

  function hsla(h, s, l, a) {
    if (a <= 0) h = s = l = NaN;
    else if (l <= 0 || l >= 1) h = s = NaN;
    else if (s <= 0) h = NaN;
    return new Hsl(h, s, l, a);
  }

  function hslConvert(o) {
    if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
    if (!(o instanceof Color)) o = color(o);
    if (!o) return new Hsl;
    if (o instanceof Hsl) return o;
    o = o.rgb();
    var r = o.r / 255,
        g = o.g / 255,
        b = o.b / 255,
        min = Math.min(r, g, b),
        max = Math.max(r, g, b),
        h = NaN,
        s = max - min,
        l = (max + min) / 2;
    if (s) {
      if (r === max) h = (g - b) / s + (g < b) * 6;
      else if (g === max) h = (b - r) / s + 2;
      else h = (r - g) / s + 4;
      s /= l < 0.5 ? max + min : 2 - max - min;
      h *= 60;
    } else {
      s = l > 0 && l < 1 ? 0 : h;
    }
    return new Hsl(h, s, l, o.opacity);
  }

  function hsl(h, s, l, opacity) {
    return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
  }

  function Hsl(h, s, l, opacity) {
    this.h = +h;
    this.s = +s;
    this.l = +l;
    this.opacity = +opacity;
  }

  define(Hsl, hsl, extend(Color, {
    brighter: function(k) {
      k = k == null ? brighter : Math.pow(brighter, k);
      return new Hsl(this.h, this.s, this.l * k, this.opacity);
    },
    darker: function(k) {
      k = k == null ? darker : Math.pow(darker, k);
      return new Hsl(this.h, this.s, this.l * k, this.opacity);
    },
    rgb: function() {
      var h = this.h % 360 + (this.h < 0) * 360,
          s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
          l = this.l,
          m2 = l + (l < 0.5 ? l : 1 - l) * s,
          m1 = 2 * l - m2;
      return new Rgb(
        hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
        hsl2rgb(h, m1, m2),
        hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
        this.opacity
      );
    },
    displayable: function() {
      return (0 <= this.s && this.s <= 1 || isNaN(this.s))
          && (0 <= this.l && this.l <= 1)
          && (0 <= this.opacity && this.opacity <= 1);
    }
  }));

  /* From FvD 13.37, CSS Color Module Level 3 */
  function hsl2rgb(h, m1, m2) {
    return (h < 60 ? m1 + (m2 - m1) * h / 60
        : h < 180 ? m2
        : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
        : m1) * 255;
  }

  var deg2rad = Math.PI / 180;
  var rad2deg = 180 / Math.PI;

  // https://observablehq.com/@mbostock/lab-and-rgb
  var K = 18,
      Xn = 0.96422,
      Yn = 1,
      Zn = 0.82521,
      t0 = 4 / 29,
      t1 = 6 / 29,
      t2 = 3 * t1 * t1,
      t3 = t1 * t1 * t1;

  function labConvert(o) {
    if (o instanceof Lab) return new Lab(o.l, o.a, o.b, o.opacity);
    if (o instanceof Hcl) return hcl2lab(o);
    if (!(o instanceof Rgb)) o = rgbConvert(o);
    var r = rgb2lrgb(o.r),
        g = rgb2lrgb(o.g),
        b = rgb2lrgb(o.b),
        y = xyz2lab((0.2225045 * r + 0.7168786 * g + 0.0606169 * b) / Yn), x, z;
    if (r === g && g === b) x = z = y; else {
      x = xyz2lab((0.4360747 * r + 0.3850649 * g + 0.1430804 * b) / Xn);
      z = xyz2lab((0.0139322 * r + 0.0971045 * g + 0.7141733 * b) / Zn);
    }
    return new Lab(116 * y - 16, 500 * (x - y), 200 * (y - z), o.opacity);
  }

  function lab(l, a, b, opacity) {
    return arguments.length === 1 ? labConvert(l) : new Lab(l, a, b, opacity == null ? 1 : opacity);
  }

  function Lab(l, a, b, opacity) {
    this.l = +l;
    this.a = +a;
    this.b = +b;
    this.opacity = +opacity;
  }

  define(Lab, lab, extend(Color, {
    brighter: function(k) {
      return new Lab(this.l + K * (k == null ? 1 : k), this.a, this.b, this.opacity);
    },
    darker: function(k) {
      return new Lab(this.l - K * (k == null ? 1 : k), this.a, this.b, this.opacity);
    },
    rgb: function() {
      var y = (this.l + 16) / 116,
          x = isNaN(this.a) ? y : y + this.a / 500,
          z = isNaN(this.b) ? y : y - this.b / 200;
      x = Xn * lab2xyz(x);
      y = Yn * lab2xyz(y);
      z = Zn * lab2xyz(z);
      return new Rgb(
        lrgb2rgb( 3.1338561 * x - 1.6168667 * y - 0.4906146 * z),
        lrgb2rgb(-0.9787684 * x + 1.9161415 * y + 0.0334540 * z),
        lrgb2rgb( 0.0719453 * x - 0.2289914 * y + 1.4052427 * z),
        this.opacity
      );
    }
  }));

  function xyz2lab(t) {
    return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
  }

  function lab2xyz(t) {
    return t > t1 ? t * t * t : t2 * (t - t0);
  }

  function lrgb2rgb(x) {
    return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
  }

  function rgb2lrgb(x) {
    return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  }

  function hclConvert(o) {
    if (o instanceof Hcl) return new Hcl(o.h, o.c, o.l, o.opacity);
    if (!(o instanceof Lab)) o = labConvert(o);
    if (o.a === 0 && o.b === 0) return new Hcl(NaN, 0 < o.l && o.l < 100 ? 0 : NaN, o.l, o.opacity);
    var h = Math.atan2(o.b, o.a) * rad2deg;
    return new Hcl(h < 0 ? h + 360 : h, Math.sqrt(o.a * o.a + o.b * o.b), o.l, o.opacity);
  }

  function hcl(h, c, l, opacity) {
    return arguments.length === 1 ? hclConvert(h) : new Hcl(h, c, l, opacity == null ? 1 : opacity);
  }

  function Hcl(h, c, l, opacity) {
    this.h = +h;
    this.c = +c;
    this.l = +l;
    this.opacity = +opacity;
  }

  function hcl2lab(o) {
    if (isNaN(o.h)) return new Lab(o.l, 0, 0, o.opacity);
    var h = o.h * deg2rad;
    return new Lab(o.l, Math.cos(h) * o.c, Math.sin(h) * o.c, o.opacity);
  }

  define(Hcl, hcl, extend(Color, {
    brighter: function(k) {
      return new Hcl(this.h, this.c, this.l + K * (k == null ? 1 : k), this.opacity);
    },
    darker: function(k) {
      return new Hcl(this.h, this.c, this.l - K * (k == null ? 1 : k), this.opacity);
    },
    rgb: function() {
      return hcl2lab(this).rgb();
    }
  }));

  var A = -0.14861,
      B = +1.78277,
      C = -0.29227,
      D = -0.90649,
      E = +1.97294,
      ED = E * D,
      EB = E * B,
      BC_DA = B * C - D * A;

  function cubehelixConvert(o) {
    if (o instanceof Cubehelix) return new Cubehelix(o.h, o.s, o.l, o.opacity);
    if (!(o instanceof Rgb)) o = rgbConvert(o);
    var r = o.r / 255,
        g = o.g / 255,
        b = o.b / 255,
        l = (BC_DA * b + ED * r - EB * g) / (BC_DA + ED - EB),
        bl = b - l,
        k = (E * (g - l) - C * bl) / D,
        s = Math.sqrt(k * k + bl * bl) / (E * l * (1 - l)), // NaN if l=0 or l=1
        h = s ? Math.atan2(k, bl) * rad2deg - 120 : NaN;
    return new Cubehelix(h < 0 ? h + 360 : h, s, l, o.opacity);
  }

  function cubehelix(h, s, l, opacity) {
    return arguments.length === 1 ? cubehelixConvert(h) : new Cubehelix(h, s, l, opacity == null ? 1 : opacity);
  }

  function Cubehelix(h, s, l, opacity) {
    this.h = +h;
    this.s = +s;
    this.l = +l;
    this.opacity = +opacity;
  }

  define(Cubehelix, cubehelix, extend(Color, {
    brighter: function(k) {
      k = k == null ? brighter : Math.pow(brighter, k);
      return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
    },
    darker: function(k) {
      k = k == null ? darker : Math.pow(darker, k);
      return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
    },
    rgb: function() {
      var h = isNaN(this.h) ? 0 : (this.h + 120) * deg2rad,
          l = +this.l,
          a = isNaN(this.s) ? 0 : this.s * l * (1 - l),
          cosh = Math.cos(h),
          sinh = Math.sin(h);
      return new Rgb(
        255 * (l + a * (A * cosh + B * sinh)),
        255 * (l + a * (C * cosh + D * sinh)),
        255 * (l + a * (E * cosh)),
        this.opacity
      );
    }
  }));

  function constant(x) {
    return function() {
      return x;
    };
  }

  function linear(a, d) {
    return function(t) {
      return a + t * d;
    };
  }

  function exponential(a, b, y) {
    return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
      return Math.pow(a + t * b, y);
    };
  }

  function gamma(y) {
    return (y = +y) === 1 ? nogamma : function(a, b) {
      return b - a ? exponential(a, b, y) : constant(isNaN(a) ? b : a);
    };
  }

  function nogamma(a, b) {
    var d = b - a;
    return d ? linear(a, d) : constant(isNaN(a) ? b : a);
  }

  var rgb$1 = (function rgbGamma(y) {
    var color = gamma(y);

    function rgb$1(start, end) {
      var r = color((start = rgb(start)).r, (end = rgb(end)).r),
          g = color(start.g, end.g),
          b = color(start.b, end.b),
          opacity = nogamma(start.opacity, end.opacity);
      return function(t) {
        start.r = r(t);
        start.g = g(t);
        start.b = b(t);
        start.opacity = opacity(t);
        return start + "";
      };
    }

    rgb$1.gamma = rgbGamma;

    return rgb$1;
  })(1);

  function array(a, b) {
    var nb = b ? b.length : 0,
        na = a ? Math.min(nb, a.length) : 0,
        x = new Array(na),
        c = new Array(nb),
        i;

    for (i = 0; i < na; ++i) x[i] = interpolate(a[i], b[i]);
    for (; i < nb; ++i) c[i] = b[i];

    return function(t) {
      for (i = 0; i < na; ++i) c[i] = x[i](t);
      return c;
    };
  }

  function date(a, b) {
    var d = new Date;
    return a = +a, b -= a, function(t) {
      return d.setTime(a + b * t), d;
    };
  }

  function number(a, b) {
    return a = +a, b -= a, function(t) {
      return a + b * t;
    };
  }

  function object(a, b) {
    var i = {},
        c = {},
        k;

    if (a === null || typeof a !== "object") a = {};
    if (b === null || typeof b !== "object") b = {};

    for (k in b) {
      if (k in a) {
        i[k] = interpolate(a[k], b[k]);
      } else {
        c[k] = b[k];
      }
    }

    return function(t) {
      for (k in i) c[k] = i[k](t);
      return c;
    };
  }

  var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
      reB = new RegExp(reA.source, "g");

  function zero(b) {
    return function() {
      return b;
    };
  }

  function one(b) {
    return function(t) {
      return b(t) + "";
    };
  }

  function string(a, b) {
    var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
        am, // current match in a
        bm, // current match in b
        bs, // string preceding current number in b, if any
        i = -1, // index in s
        s = [], // string constants and placeholders
        q = []; // number interpolators

    // Coerce inputs to strings.
    a = a + "", b = b + "";

    // Interpolate pairs of numbers in a & b.
    while ((am = reA.exec(a))
        && (bm = reB.exec(b))) {
      if ((bs = bm.index) > bi) { // a string precedes the next number in b
        bs = b.slice(bi, bs);
        if (s[i]) s[i] += bs; // coalesce with previous string
        else s[++i] = bs;
      }
      if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
        if (s[i]) s[i] += bm; // coalesce with previous string
        else s[++i] = bm;
      } else { // interpolate non-matching numbers
        s[++i] = null;
        q.push({i: i, x: number(am, bm)});
      }
      bi = reB.lastIndex;
    }

    // Add remains of b.
    if (bi < b.length) {
      bs = b.slice(bi);
      if (s[i]) s[i] += bs; // coalesce with previous string
      else s[++i] = bs;
    }

    // Special optimization for only a single match.
    // Otherwise, interpolate each of the numbers and rejoin the string.
    return s.length < 2 ? (q[0]
        ? one(q[0].x)
        : zero(b))
        : (b = q.length, function(t) {
            for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
            return s.join("");
          });
  }

  function interpolate(a, b) {
    var t = typeof b, c;
    return b == null || t === "boolean" ? constant(b)
        : (t === "number" ? number
        : t === "string" ? ((c = color(b)) ? (b = c, rgb$1) : string)
        : b instanceof color ? rgb$1
        : b instanceof Date ? date
        : Array.isArray(b) ? array
        : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object
        : number)(a, b);
  }

  var degrees = 180 / Math.PI;

  var rho = Math.SQRT2;

  function pointDistance (point1, point2) {
    return Math.sqrt(
      (point1[0] - point2[0]) ** 2 +
      (point1[1] - point2[1]) ** 2
    )
  }

  function linearRingLength (linearRing) {
    let totalLength = 0;

    for (let i = 0; i < linearRing.length - 1; i++) {
      const from = linearRing[i];
      const to = linearRing[i + 1];

      totalLength += pointDistance(from, to);
    }

    return totalLength
  }

  /*
    Why this weird map function when there is Array.map?
    Well, usually premature optimization is the root of all evil,
    but Array.map is just really really slow.

    See, for example,  https://jsperf.com/map-reduce-named-functions/2
    Array.map is more than 6x slower than a classical for loop,
    and almost 4x slower than a custom implementation like this one.
  */
  function map (array, callback) {
    const result = [];

    for (let i = 0; i < array.length; i++) {
      result.push(callback(array[i], i));
    }

    return result
  }

  function every (array, condition) {
    for (let i = 0; i < array.length; i++) {
      if (condition(array[i], i)) return false
    }

    return true
  }

  function getOrderDescending (array) {
    const indexArray = map(array, (_, i) => i);
    indexArray.sort((a, b) => array[b] - array[a]);

    return indexArray
  }

  function sortIntoOrder (array, order) {
    return map(order, i => array[i])
  }

  function getInsertionIndexDescending (arraySortedDescending, value) {
    if (arraySortedDescending.length === 0) return 0

    for (let i = arraySortedDescending.length - 1; i >= 0; i--) {
      const arrayValue = arraySortedDescending[i];

      if (value <= arrayValue) return i
    }

    return 0
  }

  function removeClosingPoint (linearRing) {
    linearRing.pop();

    return linearRing
  }

  function closeRing (linearRing) {
    let firstPoint = linearRing[0];
    linearRing.push(firstPoint);

    return linearRing
  }

  function insertPointsLinearRing (inputLinearRing, numberOfAdditionalPoints) {
    let linearRing = cloneLinearRing(inputLinearRing);
    linearRing = removeClosingPoint(linearRing);
    linearRing = insertPoints(linearRing, numberOfAdditionalPoints, { ring: true });
    linearRing = closeRing(linearRing);

    return linearRing
  }

  function insertPointsLineString (inputLineString, numberOfAdditionalPoints) {
    const lineString = cloneLinearRing(inputLineString);
    return insertPoints(lineString, numberOfAdditionalPoints, { ring: false })
  }

  function insertPoints (lineString, numberOfAdditionalPoints, { ring }) {
    const edgeLengths = getEdgeLengths(lineString, ring);
    let orderedEdgeIds = getOrderDescending(edgeLengths);

    for (let i = 0; i < numberOfAdditionalPoints; i++) {
      const longestEdgeId = orderedEdgeIds[0];

      const edge = getEdge(lineString, longestEdgeId);

      const edgeLength = edgeLengths[longestEdgeId];

      const newEdges = splitEdge(edge);
      const newEdgesLength = edgeLength / 2;

      // Remove old edge
      orderedEdgeIds.shift();
      lineString[longestEdgeId] = null;
      edgeLengths[longestEdgeId] = null;

      // Insert new edges
      orderedEdgeIds = insertOrderedId(orderedEdgeIds, edgeLengths, longestEdgeId, newEdgesLength);

      lineString[longestEdgeId] = newEdges[0][0];
      lineString.splice(longestEdgeId + 1, 0, newEdges[1][0]);

      edgeLengths[longestEdgeId] = newEdgesLength;
      edgeLengths.splice(longestEdgeId + 1, 0, newEdgesLength);
    }

    return lineString
  }

  function cloneLinearRing (linearRing) {
    const clonedLinearRing = [];

    for (let i = 0; i < linearRing.length; i++) {
      clonedLinearRing.push(linearRing[i].slice(0));
    }

    return clonedLinearRing
  }

  function getEdgeLengths (linearRing, ring) {
    const edgeLengths = [];
    const edges = ring ? linearRing.length : linearRing.length - 1;

    for (let i = 0; i < edges; i++) {
      const edge = getEdge(linearRing, i);

      edgeLengths.push(pointDistance(edge[0], edge[1]));
    }

    return edgeLengths
  }

  function getEdge (linearRing, index) {
    return [
      linearRing[index], linearRing[(index + 1) % linearRing.length]
    ]
  }

  function splitEdge (edge) {
    const pointInBetween = interpolate(edge[0], edge[1])(0.5);

    return [
      [edge[0], pointInBetween],
      [pointInBetween, edge[1]]
    ]
  }

  function insertOrderedId (orderedIds, edgeLengths, valueIndex, newValue) {
    // Insert new Ids right place
    let idsWereInserted = false;

    for (let i = 0; i < orderedIds.length; i++) {
      const index = orderedIds[i];

      // Increase all indices after the valueIndex with 1
      if (index > valueIndex) orderedIds[i] = orderedIds[i] + 1;

      const currentArrayValue = edgeLengths[index];
      if (currentArrayValue === null) continue

      if (newValue >= currentArrayValue) {
        orderedIds.splice(i, 0, valueIndex);
        orderedIds.splice(i + 1, 0, valueIndex + 1);

        idsWereInserted = true;
        break
      }
    }

    if (!idsWereInserted) {
      orderedIds.push(valueIndex);
      orderedIds.push(valueIndex + 1);
    }

    return orderedIds
  }

  /*
    Taken from flubber:
    https://github.com/veltman/flubber
  */

  function rotatePointsLinearRing (inputLinearRing, toLinearRing) {
    let fromLinearRing = cloneLinearRing(inputLinearRing);
    fromLinearRing = removeClosingPoint(fromLinearRing);

    const fromLength = fromLinearRing.length;
    let min = Infinity;
    let bestOffset;
    let sumOfSquares;
    let spliced;

    for (let offset = 0; offset < fromLength; offset++) {
      sumOfSquares = 0;

      toLinearRing.forEach((point, i) => {
        const distance = pointDistance(fromLinearRing[(offset + i) % fromLength], point);
        sumOfSquares += distance * distance;
      });

      if (sumOfSquares < min) {
        min = sumOfSquares;
        bestOffset = offset;
      }
    }

    if (bestOffset) {
      spliced = fromLinearRing.splice(0, bestOffset);
      fromLinearRing.splice(fromLinearRing.length, 0, ...spliced);
    }

    fromLinearRing = closeRing(fromLinearRing);

    return fromLinearRing
  }

  function isLinearRing (ring) {
    return ring.constructor === Array
  }

  function isPolygon (geometry) {
    return geometry.constructor === Object && geometry.type === 'Polygon'
  }

  function isMultiPolygon (geometry) {
    return geometry.constructor === Object && geometry.type === 'MultiPolygon'
  }

  function isPolygonOrMultiPolygon (geometry) {
    return isPolygon(geometry) || isMultiPolygon(geometry)
  }

  function isLineString (geometry) {
    return geometry.constructor === Object && geometry.type === 'LineString'
  }

  function isMultiLineString (geometry) {
    return geometry.constructor === Object && geometry.type === 'MultiLineString'
  }

  function isLineStringOrMultiLineString (geometry) {
    return isLineString(geometry) || isMultiLineString(geometry)
  }

  function polygonArea (polygon) {
    if (isLinearRing(polygon)) {
      return getRingArea(polygon)
    }

    if (isPolygon(polygon)) {
      return getPolygonArea(polygon)
    }

    if (isMultiPolygon(polygon)) {
      return getMultiPolygonArea(polygon)
    }

    throw new Error('Invalid input')
  }

  function linearRingIsClockwise (ring) {
    return getSignedRingArea(ring) < 0
  }

  function getRingArea (ring) {
    return Math.abs(getSignedRingArea(ring))
  }

  // Taken from: https://stackoverflow.com/a/33670691/7237112
  function getSignedRingArea (ring) {
    let total = 0;

    for (let i = 0, l = ring.length; i < l; i++) {
      const addX = ring[i][0];
      const addY = ring[i === ring.length - 1 ? 0 : i + 1][1];
      const subX = ring[i === ring.length - 1 ? 0 : i + 1][0];
      const subY = ring[i][1];

      total += (addX * addY * 0.5);
      total -= (subX * subY * 0.5);
    }

    return total
  }

  function getPolygonArea (polygon) {
    let totalArea = getRingArea(polygon.coordinates[0]);

    for (let i = 1; i < polygon.coordinates.length; i++) {
      const holeArea = getRingArea(polygon.coordinates[i]);
      totalArea -= holeArea;
    }

    return totalArea
  }

  function getMultiPolygonArea (multiPolygon) {
    let totalArea = 0;

    for (let i = 0; i < multiPolygon.coordinates.length; i++) {
      totalArea += getPolygonArea(multiPolygon.coordinates[i]);
    }

    return totalArea
  }

  function matchLinearRings (fromRings, toRings) {
    if (tooManyRings(fromRings)) {
      return map(fromRings, (_, i) => i)
    }

    return bestOrder(fromRings, toRings)
  }

  function tooManyRings (rings) {
    // with more than 9 rings, everything will be too chaotic to notice this stuff anyway.
    return rings.length > 9
  }

  function bestOrder (fromRings, toRings) {
    const fromAreas = map(fromRings, polygonArea);
    const toAreas = map(toRings, polygonArea);

    const fromAreasOrderDescending = getOrderDescending(fromAreas);
    const toAreasOrderDescending = getOrderDescending(toAreas);

    const pairs = {};

    for (let i = 0; i < toAreasOrderDescending.length; i++) {
      const fromIndex = fromAreasOrderDescending[i];
      const toIndex = toAreasOrderDescending[i];

      pairs[toIndex] = fromIndex;
    }

    const fromOrder = [];

    for (let i = 0; i < toRings.length; i++) {
      fromOrder.push(pairs[i]);
    }

    return fromOrder
  }

  function calculateCentroid (geometry) {
    if (isLinearRing(geometry)) {
      return calculateLinearRingCentroid(geometry)
    }

    if (isPolygon(geometry)) {
      return calculatePolygonCentroid(geometry)
    }

    if (isMultiPolygon(geometry)) {
      return calculateMultiPolygonCentroid(geometry)
    }
  }

  // https://stackoverflow.com/a/33852627/7237112
  function calculateLinearRingCentroid (ring) {
    const nPts = ring.length;
    const off = ring[0];
    let twicearea = 0;
    let x = 0;
    let y = 0;
    let p1;
    let p2;
    let f;

    for (let i = 0, j = nPts - 1; i < nPts; j = i++) {
      p1 = ring[i];
      p2 = ring[j];
      f = (p1[0] - off[0]) * (p2[1] - off[1]) - (p2[0] - off[0]) * (p1[1] - off[1]);
      twicearea += f;
      x += (p1[0] + p2[0] - 2 * off[0]) * f;
      y += (p1[1] + p2[1] - 2 * off[1]) * f;
    }

    f = twicearea * 3;

    return [x / f + off[0], y / f + off[1]]
  }

  function calculatePolygonCentroid (polygon) {
    // We will ignore holes and just take the outer ring
    return calculateLinearRingCentroid(polygon.coordinates[0])
  }

  function calculateMultiPolygonCentroid (multiPolygon) {
    // We will take the centroid of each polygon (ignoring holes)
    // and take the weighted (by area) center of these.
    let x = 0;
    let y = 0;
    let totalArea = 0;

    for (let i = 0; i < multiPolygon.coordinates.length; i++) {
      const polygon = multiPolygon.coordinates[i];
      const polygonCentroid = calculateLinearRingCentroid(polygon[0]);
      const area = polygonArea(polygon[0]);

      x += polygonCentroid[0] * area;
      y += polygonCentroid[1] * area;
      totalArea += area;
    }

    return [x / totalArea, y / totalArea]
  }

  function polygonToPolygon (from, to) {
    const fromOuterRing = from.coordinates[0];
    const toOuterRing = to.coordinates[0];

    const [fromOuterRingPrepared, toOuterRingPrepared] = prepareLinearRings(fromOuterRing, toOuterRing);

    if (neitherHasHoles(from, to)) {
      return createInterpolatorNoHoles(from, to, fromOuterRingPrepared, toOuterRingPrepared)
    }

    const holeInterpolators = createHoleInterpolators(from, to);

    return createInterpolatorWithHoles(
      from, to, fromOuterRingPrepared, toOuterRingPrepared, holeInterpolators
    )
  }

  function prepareLinearRings (fromRing, toRing) {
    const lengthDifference = fromRing.length - toRing.length;

    if (lengthDifference > 0) {
      toRing = insertPointsLinearRing(toRing, lengthDifference);
    }

    if (lengthDifference < 0) {
      fromRing = insertPointsLinearRing(fromRing, -lengthDifference);
    }

    const rotatedFromRing = rotatePointsLinearRing(fromRing, toRing);

    return [rotatedFromRing, toRing]
  }

  function createInterpolatorNoHoles (from, to, fromOuterRingPrepared, toOuterRingPrepared) {
    const outerRingInterpolator = interpolate(fromOuterRingPrepared, toOuterRingPrepared);

    return function interpolator (t) {
      if (t === 0) return from
      if (t === 1) return to

      const interpolatedLinearRing = outerRingInterpolator(t);

      return {
        type: 'Polygon',
        coordinates: [interpolatedLinearRing]
      }
    }
  }

  function neitherHasHoles (from, to) {
    return from.coordinates.length === 1 && to.coordinates.length === 1
  }

  function getHoles (polygon, numberOfHoles) {
    const holes = [];

    for (let i = 1; i <= numberOfHoles; i++) {
      holes.push(polygon.coordinates[i]);
    }

    return holes
  }

  function createHoleInterpolators (from, to) {
    let holeInterpolators = [];

    const numberOfMatchableHoles = Math.min(from.coordinates.length, to.coordinates.length) - 1;

    if (numberOfMatchableHoles > 0) {
      holeInterpolators = holeInterpolators.concat(
        createMatchableHoleInterpolators(from, to, numberOfMatchableHoles)
      );
    }

    const differenceBetweenNumberOfHoles = from.coordinates.length - to.coordinates.length;

    if (differenceBetweenNumberOfHoles > 0) {
      holeInterpolators = holeInterpolators.concat(
        createHoleImploders(from, differenceBetweenNumberOfHoles)
      );
    }

    if (differenceBetweenNumberOfHoles < 0) {
      holeInterpolators = holeInterpolators.concat(
        createHoleExploders(to, -differenceBetweenNumberOfHoles)
      );
    }

    return holeInterpolators
  }

  function createMatchableHoleInterpolators (from, to, numberOfMatchableHoles) {
    const holeInterpolators = [];

    const fromHoles = getHoles(from, numberOfMatchableHoles);
    const toHoles = getHoles(to, numberOfMatchableHoles);

    const fromOrder = matchLinearRings(fromHoles, toHoles);
    const fromHolesSorted = map(fromOrder, i => fromHoles[i]);

    for (let i = 0; i < numberOfMatchableHoles; i++) {
      const fromHole = fromHolesSorted[i];
      const toHole = toHoles[i];

      const [fromHolePrepared, toHolePrepared] = prepareLinearRings(fromHole, toHole);

      const holeInterpolator = interpolate(fromHolePrepared, toHolePrepared);

      holeInterpolators.push(holeInterpolator);
    }

    return holeInterpolators
  }

  function createHoleImploders (polygon, differenceBetweenNumberOfHoles) {
    const interpolators = [];

    const firstHoleThatNeedsImplodingIndex = polygon.coordinates.length - differenceBetweenNumberOfHoles;

    for (let i = firstHoleThatNeedsImplodingIndex; i < polygon.coordinates.length; i++) {
      const hole = polygon.coordinates[i];
      const holeCentroid = calculateCentroid(hole);
      const smallRectangleAroundCentroid = makeSmallRectangleAroundPoint(holeCentroid);

      const [preparedPolygon, preparedImplodePoint] = prepareLinearRings(hole, smallRectangleAroundCentroid);

      interpolators.push(interpolate(preparedPolygon, preparedImplodePoint));
    }

    return interpolators
  }

  function createHoleExploders (polygon, differenceBetweenNumberOfHoles) {
    return map(createHoleImploders(polygon, differenceBetweenNumberOfHoles), holeInterpolator => {
      return t => holeInterpolator(1 - t)
    })
  }

  function makeSmallRectangleAroundPoint ([x, y]) {
    const epsilon = 1e-6;

    const x1 = x - epsilon;
    const x2 = x + epsilon;
    const y1 = y - epsilon;
    const y2 = y + epsilon;

    return [[x1, y1], [x1, y2], [x2, y2], [x2, y1], [x1, y1]]
  }

  function createInterpolatorWithHoles (
    from, to, fromOuterRingPrepared, toOuterRingPrepared, holeInterpolators
  ) {
    const outerRingInterpolator = interpolate(fromOuterRingPrepared, toOuterRingPrepared);

    return function interpolator (t) {
      if (t === 0) return from
      if (t === 1) return to

      const interpolatedLinearRing = outerRingInterpolator(t);

      return {
        type: 'Polygon',
        coordinates: [
          interpolatedLinearRing,
          ...map(holeInterpolators, holeInterpolator => holeInterpolator(t))
        ]
      }
    }
  }

  var earcut_1 = earcut;
  var default_1 = earcut;

  function earcut(data, holeIndices, dim) {

      dim = dim || 2;

      var hasHoles = holeIndices && holeIndices.length,
          outerLen = hasHoles ? holeIndices[0] * dim : data.length,
          outerNode = linkedList(data, 0, outerLen, dim, true),
          triangles = [];

      if (!outerNode || outerNode.next === outerNode.prev) return triangles;

      var minX, minY, maxX, maxY, x, y, invSize;

      if (hasHoles) outerNode = eliminateHoles(data, holeIndices, outerNode, dim);

      // if the shape is not too simple, we'll use z-order curve hash later; calculate polygon bbox
      if (data.length > 80 * dim) {
          minX = maxX = data[0];
          minY = maxY = data[1];

          for (var i = dim; i < outerLen; i += dim) {
              x = data[i];
              y = data[i + 1];
              if (x < minX) minX = x;
              if (y < minY) minY = y;
              if (x > maxX) maxX = x;
              if (y > maxY) maxY = y;
          }

          // minX, minY and invSize are later used to transform coords into integers for z-order calculation
          invSize = Math.max(maxX - minX, maxY - minY);
          invSize = invSize !== 0 ? 1 / invSize : 0;
      }

      earcutLinked(outerNode, triangles, dim, minX, minY, invSize);

      return triangles;
  }

  // create a circular doubly linked list from polygon points in the specified winding order
  function linkedList(data, start, end, dim, clockwise) {
      var i, last;

      if (clockwise === (signedArea(data, start, end, dim) > 0)) {
          for (i = start; i < end; i += dim) last = insertNode(i, data[i], data[i + 1], last);
      } else {
          for (i = end - dim; i >= start; i -= dim) last = insertNode(i, data[i], data[i + 1], last);
      }

      if (last && equals(last, last.next)) {
          removeNode(last);
          last = last.next;
      }

      return last;
  }

  // eliminate colinear or duplicate points
  function filterPoints(start, end) {
      if (!start) return start;
      if (!end) end = start;

      var p = start,
          again;
      do {
          again = false;

          if (!p.steiner && (equals(p, p.next) || area(p.prev, p, p.next) === 0)) {
              removeNode(p);
              p = end = p.prev;
              if (p === p.next) break;
              again = true;

          } else {
              p = p.next;
          }
      } while (again || p !== end);

      return end;
  }

  // main ear slicing loop which triangulates a polygon (given as a linked list)
  function earcutLinked(ear, triangles, dim, minX, minY, invSize, pass) {
      if (!ear) return;

      // interlink polygon nodes in z-order
      if (!pass && invSize) indexCurve(ear, minX, minY, invSize);

      var stop = ear,
          prev, next;

      // iterate through ears, slicing them one by one
      while (ear.prev !== ear.next) {
          prev = ear.prev;
          next = ear.next;

          if (invSize ? isEarHashed(ear, minX, minY, invSize) : isEar(ear)) {
              // cut off the triangle
              triangles.push(prev.i / dim);
              triangles.push(ear.i / dim);
              triangles.push(next.i / dim);

              removeNode(ear);

              // skipping the next vertex leads to less sliver triangles
              ear = next.next;
              stop = next.next;

              continue;
          }

          ear = next;

          // if we looped through the whole remaining polygon and can't find any more ears
          if (ear === stop) {
              // try filtering points and slicing again
              if (!pass) {
                  earcutLinked(filterPoints(ear), triangles, dim, minX, minY, invSize, 1);

              // if this didn't work, try curing all small self-intersections locally
              } else if (pass === 1) {
                  ear = cureLocalIntersections(ear, triangles, dim);
                  earcutLinked(ear, triangles, dim, minX, minY, invSize, 2);

              // as a last resort, try splitting the remaining polygon into two
              } else if (pass === 2) {
                  splitEarcut(ear, triangles, dim, minX, minY, invSize);
              }

              break;
          }
      }
  }

  // check whether a polygon node forms a valid ear with adjacent nodes
  function isEar(ear) {
      var a = ear.prev,
          b = ear,
          c = ear.next;

      if (area(a, b, c) >= 0) return false; // reflex, can't be an ear

      // now make sure we don't have other points inside the potential ear
      var p = ear.next.next;

      while (p !== ear.prev) {
          if (pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
              area(p.prev, p, p.next) >= 0) return false;
          p = p.next;
      }

      return true;
  }

  function isEarHashed(ear, minX, minY, invSize) {
      var a = ear.prev,
          b = ear,
          c = ear.next;

      if (area(a, b, c) >= 0) return false; // reflex, can't be an ear

      // triangle bbox; min & max are calculated like this for speed
      var minTX = a.x < b.x ? (a.x < c.x ? a.x : c.x) : (b.x < c.x ? b.x : c.x),
          minTY = a.y < b.y ? (a.y < c.y ? a.y : c.y) : (b.y < c.y ? b.y : c.y),
          maxTX = a.x > b.x ? (a.x > c.x ? a.x : c.x) : (b.x > c.x ? b.x : c.x),
          maxTY = a.y > b.y ? (a.y > c.y ? a.y : c.y) : (b.y > c.y ? b.y : c.y);

      // z-order range for the current triangle bbox;
      var minZ = zOrder(minTX, minTY, minX, minY, invSize),
          maxZ = zOrder(maxTX, maxTY, minX, minY, invSize);

      var p = ear.prevZ,
          n = ear.nextZ;

      // look for points inside the triangle in both directions
      while (p && p.z >= minZ && n && n.z <= maxZ) {
          if (p !== ear.prev && p !== ear.next &&
              pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
              area(p.prev, p, p.next) >= 0) return false;
          p = p.prevZ;

          if (n !== ear.prev && n !== ear.next &&
              pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, n.x, n.y) &&
              area(n.prev, n, n.next) >= 0) return false;
          n = n.nextZ;
      }

      // look for remaining points in decreasing z-order
      while (p && p.z >= minZ) {
          if (p !== ear.prev && p !== ear.next &&
              pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
              area(p.prev, p, p.next) >= 0) return false;
          p = p.prevZ;
      }

      // look for remaining points in increasing z-order
      while (n && n.z <= maxZ) {
          if (n !== ear.prev && n !== ear.next &&
              pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, n.x, n.y) &&
              area(n.prev, n, n.next) >= 0) return false;
          n = n.nextZ;
      }

      return true;
  }

  // go through all polygon nodes and cure small local self-intersections
  function cureLocalIntersections(start, triangles, dim) {
      var p = start;
      do {
          var a = p.prev,
              b = p.next.next;

          if (!equals(a, b) && intersects(a, p, p.next, b) && locallyInside(a, b) && locallyInside(b, a)) {

              triangles.push(a.i / dim);
              triangles.push(p.i / dim);
              triangles.push(b.i / dim);

              // remove two nodes involved
              removeNode(p);
              removeNode(p.next);

              p = start = b;
          }
          p = p.next;
      } while (p !== start);

      return p;
  }

  // try splitting polygon into two and triangulate them independently
  function splitEarcut(start, triangles, dim, minX, minY, invSize) {
      // look for a valid diagonal that divides the polygon into two
      var a = start;
      do {
          var b = a.next.next;
          while (b !== a.prev) {
              if (a.i !== b.i && isValidDiagonal(a, b)) {
                  // split the polygon in two by the diagonal
                  var c = splitPolygon(a, b);

                  // filter colinear points around the cuts
                  a = filterPoints(a, a.next);
                  c = filterPoints(c, c.next);

                  // run earcut on each half
                  earcutLinked(a, triangles, dim, minX, minY, invSize);
                  earcutLinked(c, triangles, dim, minX, minY, invSize);
                  return;
              }
              b = b.next;
          }
          a = a.next;
      } while (a !== start);
  }

  // link every hole into the outer loop, producing a single-ring polygon without holes
  function eliminateHoles(data, holeIndices, outerNode, dim) {
      var queue = [],
          i, len, start, end, list;

      for (i = 0, len = holeIndices.length; i < len; i++) {
          start = holeIndices[i] * dim;
          end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
          list = linkedList(data, start, end, dim, false);
          if (list === list.next) list.steiner = true;
          queue.push(getLeftmost(list));
      }

      queue.sort(compareX);

      // process holes from left to right
      for (i = 0; i < queue.length; i++) {
          eliminateHole(queue[i], outerNode);
          outerNode = filterPoints(outerNode, outerNode.next);
      }

      return outerNode;
  }

  function compareX(a, b) {
      return a.x - b.x;
  }

  // find a bridge between vertices that connects hole with an outer ring and and link it
  function eliminateHole(hole, outerNode) {
      outerNode = findHoleBridge(hole, outerNode);
      if (outerNode) {
          var b = splitPolygon(outerNode, hole);
          filterPoints(b, b.next);
      }
  }

  // David Eberly's algorithm for finding a bridge between hole and outer polygon
  function findHoleBridge(hole, outerNode) {
      var p = outerNode,
          hx = hole.x,
          hy = hole.y,
          qx = -Infinity,
          m;

      // find a segment intersected by a ray from the hole's leftmost point to the left;
      // segment's endpoint with lesser x will be potential connection point
      do {
          if (hy <= p.y && hy >= p.next.y && p.next.y !== p.y) {
              var x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);
              if (x <= hx && x > qx) {
                  qx = x;
                  if (x === hx) {
                      if (hy === p.y) return p;
                      if (hy === p.next.y) return p.next;
                  }
                  m = p.x < p.next.x ? p : p.next;
              }
          }
          p = p.next;
      } while (p !== outerNode);

      if (!m) return null;

      if (hx === qx) return m.prev; // hole touches outer segment; pick lower endpoint

      // look for points inside the triangle of hole point, segment intersection and endpoint;
      // if there are no points found, we have a valid connection;
      // otherwise choose the point of the minimum angle with the ray as connection point

      var stop = m,
          mx = m.x,
          my = m.y,
          tanMin = Infinity,
          tan;

      p = m.next;

      while (p !== stop) {
          if (hx >= p.x && p.x >= mx && hx !== p.x &&
                  pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {

              tan = Math.abs(hy - p.y) / (hx - p.x); // tangential

              if ((tan < tanMin || (tan === tanMin && p.x > m.x)) && locallyInside(p, hole)) {
                  m = p;
                  tanMin = tan;
              }
          }

          p = p.next;
      }

      return m;
  }

  // interlink polygon nodes in z-order
  function indexCurve(start, minX, minY, invSize) {
      var p = start;
      do {
          if (p.z === null) p.z = zOrder(p.x, p.y, minX, minY, invSize);
          p.prevZ = p.prev;
          p.nextZ = p.next;
          p = p.next;
      } while (p !== start);

      p.prevZ.nextZ = null;
      p.prevZ = null;

      sortLinked(p);
  }

  // Simon Tatham's linked list merge sort algorithm
  // http://www.chiark.greenend.org.uk/~sgtatham/algorithms/listsort.html
  function sortLinked(list) {
      var i, p, q, e, tail, numMerges, pSize, qSize,
          inSize = 1;

      do {
          p = list;
          list = null;
          tail = null;
          numMerges = 0;

          while (p) {
              numMerges++;
              q = p;
              pSize = 0;
              for (i = 0; i < inSize; i++) {
                  pSize++;
                  q = q.nextZ;
                  if (!q) break;
              }
              qSize = inSize;

              while (pSize > 0 || (qSize > 0 && q)) {

                  if (pSize !== 0 && (qSize === 0 || !q || p.z <= q.z)) {
                      e = p;
                      p = p.nextZ;
                      pSize--;
                  } else {
                      e = q;
                      q = q.nextZ;
                      qSize--;
                  }

                  if (tail) tail.nextZ = e;
                  else list = e;

                  e.prevZ = tail;
                  tail = e;
              }

              p = q;
          }

          tail.nextZ = null;
          inSize *= 2;

      } while (numMerges > 1);

      return list;
  }

  // z-order of a point given coords and inverse of the longer side of data bbox
  function zOrder(x, y, minX, minY, invSize) {
      // coords are transformed into non-negative 15-bit integer range
      x = 32767 * (x - minX) * invSize;
      y = 32767 * (y - minY) * invSize;

      x = (x | (x << 8)) & 0x00FF00FF;
      x = (x | (x << 4)) & 0x0F0F0F0F;
      x = (x | (x << 2)) & 0x33333333;
      x = (x | (x << 1)) & 0x55555555;

      y = (y | (y << 8)) & 0x00FF00FF;
      y = (y | (y << 4)) & 0x0F0F0F0F;
      y = (y | (y << 2)) & 0x33333333;
      y = (y | (y << 1)) & 0x55555555;

      return x | (y << 1);
  }

  // find the leftmost node of a polygon ring
  function getLeftmost(start) {
      var p = start,
          leftmost = start;
      do {
          if (p.x < leftmost.x || (p.x === leftmost.x && p.y < leftmost.y)) leftmost = p;
          p = p.next;
      } while (p !== start);

      return leftmost;
  }

  // check if a point lies within a convex triangle
  function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
      return (cx - px) * (ay - py) - (ax - px) * (cy - py) >= 0 &&
             (ax - px) * (by - py) - (bx - px) * (ay - py) >= 0 &&
             (bx - px) * (cy - py) - (cx - px) * (by - py) >= 0;
  }

  // check if a diagonal between two polygon nodes is valid (lies in polygon interior)
  function isValidDiagonal(a, b) {
      return a.next.i !== b.i && a.prev.i !== b.i && !intersectsPolygon(a, b) &&
             locallyInside(a, b) && locallyInside(b, a) && middleInside(a, b);
  }

  // signed area of a triangle
  function area(p, q, r) {
      return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
  }

  // check if two points are equal
  function equals(p1, p2) {
      return p1.x === p2.x && p1.y === p2.y;
  }

  // check if two segments intersect
  function intersects(p1, q1, p2, q2) {
      if ((equals(p1, q1) && equals(p2, q2)) ||
          (equals(p1, q2) && equals(p2, q1))) return true;
      return area(p1, q1, p2) > 0 !== area(p1, q1, q2) > 0 &&
             area(p2, q2, p1) > 0 !== area(p2, q2, q1) > 0;
  }

  // check if a polygon diagonal intersects any polygon segments
  function intersectsPolygon(a, b) {
      var p = a;
      do {
          if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i &&
                  intersects(p, p.next, a, b)) return true;
          p = p.next;
      } while (p !== a);

      return false;
  }

  // check if a polygon diagonal is locally inside the polygon
  function locallyInside(a, b) {
      return area(a.prev, a, a.next) < 0 ?
          area(a, b, a.next) >= 0 && area(a, a.prev, b) >= 0 :
          area(a, b, a.prev) < 0 || area(a, a.next, b) < 0;
  }

  // check if the middle point of a polygon diagonal is inside the polygon
  function middleInside(a, b) {
      var p = a,
          inside = false,
          px = (a.x + b.x) / 2,
          py = (a.y + b.y) / 2;
      do {
          if (((p.y > py) !== (p.next.y > py)) && p.next.y !== p.y &&
                  (px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x))
              inside = !inside;
          p = p.next;
      } while (p !== a);

      return inside;
  }

  // link two polygon vertices with a bridge; if the vertices belong to the same ring, it splits polygon into two;
  // if one belongs to the outer ring and another to a hole, it merges it into a single ring
  function splitPolygon(a, b) {
      var a2 = new Node(a.i, a.x, a.y),
          b2 = new Node(b.i, b.x, b.y),
          an = a.next,
          bp = b.prev;

      a.next = b;
      b.prev = a;

      a2.next = an;
      an.prev = a2;

      b2.next = a2;
      a2.prev = b2;

      bp.next = b2;
      b2.prev = bp;

      return b2;
  }

  // create a node and optionally link it with previous one (in a circular doubly linked list)
  function insertNode(i, x, y, last) {
      var p = new Node(i, x, y);

      if (!last) {
          p.prev = p;
          p.next = p;

      } else {
          p.next = last.next;
          p.prev = last;
          last.next.prev = p;
          last.next = p;
      }
      return p;
  }

  function removeNode(p) {
      p.next.prev = p.prev;
      p.prev.next = p.next;

      if (p.prevZ) p.prevZ.nextZ = p.nextZ;
      if (p.nextZ) p.nextZ.prevZ = p.prevZ;
  }

  function Node(i, x, y) {
      // vertex index in coordinates array
      this.i = i;

      // vertex coordinates
      this.x = x;
      this.y = y;

      // previous and next vertex nodes in a polygon ring
      this.prev = null;
      this.next = null;

      // z-order curve value
      this.z = null;

      // previous and next nodes in z-order
      this.prevZ = null;
      this.nextZ = null;

      // indicates whether this is a steiner point
      this.steiner = false;
  }

  // return a percentage difference between the polygon area and its triangulation area;
  // used to verify correctness of triangulation
  earcut.deviation = function (data, holeIndices, dim, triangles) {
      var hasHoles = holeIndices && holeIndices.length;
      var outerLen = hasHoles ? holeIndices[0] * dim : data.length;

      var polygonArea = Math.abs(signedArea(data, 0, outerLen, dim));
      if (hasHoles) {
          for (var i = 0, len = holeIndices.length; i < len; i++) {
              var start = holeIndices[i] * dim;
              var end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
              polygonArea -= Math.abs(signedArea(data, start, end, dim));
          }
      }

      var trianglesArea = 0;
      for (i = 0; i < triangles.length; i += 3) {
          var a = triangles[i] * dim;
          var b = triangles[i + 1] * dim;
          var c = triangles[i + 2] * dim;
          trianglesArea += Math.abs(
              (data[a] - data[c]) * (data[b + 1] - data[a + 1]) -
              (data[a] - data[b]) * (data[c + 1] - data[a + 1]));
      }

      return polygonArea === 0 && trianglesArea === 0 ? 0 :
          Math.abs((trianglesArea - polygonArea) / polygonArea);
  };

  function signedArea(data, start, end, dim) {
      var sum = 0;
      for (var i = start, j = end - dim; i < end; i += dim) {
          sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
          j = i;
      }
      return sum;
  }

  // turn a polygon in a multi-dimensional array form (e.g. as in GeoJSON) into a form Earcut accepts
  earcut.flatten = function (data) {
      var dim = data[0][0].length,
          result = {vertices: [], holes: [], dimensions: dim},
          holeIndex = 0;

      for (var i = 0; i < data.length; i++) {
          for (var j = 0; j < data[i].length; j++) {
              for (var d = 0; d < dim; d++) result.vertices.push(data[i][j][d]);
          }
          if (i > 0) {
              holeIndex += data[i - 1].length;
              result.holes.push(holeIndex);
          }
      }
      return result;
  };
  earcut_1.default = default_1;

  /*
    Taken from flubber:
    https://github.com/veltman/flubber
  */

  function createTopology (vertices, triangleIndices) {
    const arcIndices = {};
    const topology = createEmptyTopology();

    for (let i = 0; i < triangleIndices.length; i += 3) {
      const geometry = [];

      const triangleIndexArcs = createTriangleIndexArcs(triangleIndices, i);

      triangleIndexArcs.forEach(arc => {
        const slug = createArcSlug(arc);

        const coordinates = map(arc, pointIndex => getPoint(vertices, pointIndex));

        if (slug in arcIndices) {
          geometry.push(~arcIndices[slug]); // Not sure what this is doing
        } else {
          geometry.push((arcIndices[slug] = topology.arcs.length));
          topology.arcs.push(coordinates);
        }
      });

      const area = getTriangleArea(vertices, triangleIndexArcs);
      const polygon = createTopoPolygon(area, geometry);

      topology.objects.triangles.geometries.push(polygon);
    }

    // Sort smallest first
    // TODO sorted insertion?
    topology.objects.triangles.geometries.sort((a, b) => a.area - b.area);

    return topology
  }

  function createEmptyTopology () {
    return {
      type: 'Topology',
      objects: {
        triangles: {
          type: 'GeometryCollection',
          geometries: []
        }
      },
      arcs: []
    }
  }

  function createTriangleIndexArcs (triangleIndices, i) {
    const a = triangleIndices[i];
    const b = triangleIndices[i + 1];
    const c = triangleIndices[i + 2];

    return [[a, b], [b, c], [c, a]]
  }

  function createArcSlug (arc) {
    return arc[0] < arc[1] ? arc.join(',') : arc[1] + ',' + arc[0]
  }

  function getPoint (vertices, i) {
    return [vertices[i * 2], vertices[(i * 2) + 1]]
  }

  function createTopoPolygon (area, geometry) {
    return {
      type: 'Polygon',
      area,
      arcs: [geometry]
    }
  }

  function getTriangleArea (vertices, triangleIndexArcs) {
    return Math.abs(
      polygonArea(map(triangleIndexArcs, arc => getPoint(vertices, arc[0])))
    )
  }

  function identity(x) {
    return x;
  }

  function transform(transform) {
    if (transform == null) return identity;
    var x0,
        y0,
        kx = transform.scale[0],
        ky = transform.scale[1],
        dx = transform.translate[0],
        dy = transform.translate[1];
    return function(input, i) {
      if (!i) x0 = y0 = 0;
      var j = 2, n = input.length, output = new Array(n);
      output[0] = (x0 += input[0]) * kx + dx;
      output[1] = (y0 += input[1]) * ky + dy;
      while (j < n) output[j] = input[j], ++j;
      return output;
    };
  }

  function reverse(array, n) {
    var t, j = array.length, i = j - n;
    while (i < --j) t = array[i], array[i++] = array[j], array[j] = t;
  }

  function feature(topology, o) {
    return o.type === "GeometryCollection"
        ? {type: "FeatureCollection", features: o.geometries.map(function(o) { return feature$1(topology, o); })}
        : feature$1(topology, o);
  }

  function feature$1(topology, o) {
    var id = o.id,
        bbox = o.bbox,
        properties = o.properties == null ? {} : o.properties,
        geometry = object$1(topology, o);
    return id == null && bbox == null ? {type: "Feature", properties: properties, geometry: geometry}
        : bbox == null ? {type: "Feature", id: id, properties: properties, geometry: geometry}
        : {type: "Feature", id: id, bbox: bbox, properties: properties, geometry: geometry};
  }

  function object$1(topology, o) {
    var transformPoint = transform(topology.transform),
        arcs = topology.arcs;

    function arc(i, points) {
      if (points.length) points.pop();
      for (var a = arcs[i < 0 ? ~i : i], k = 0, n = a.length; k < n; ++k) {
        points.push(transformPoint(a[k], k));
      }
      if (i < 0) reverse(points, n);
    }

    function point(p) {
      return transformPoint(p);
    }

    function line(arcs) {
      var points = [];
      for (var i = 0, n = arcs.length; i < n; ++i) arc(arcs[i], points);
      if (points.length < 2) points.push(points[0]); // This should never happen per the specification.
      return points;
    }

    function ring(arcs) {
      var points = line(arcs);
      while (points.length < 4) points.push(points[0]); // This may happen if an arc has only two points.
      return points;
    }

    function polygon(arcs) {
      return arcs.map(ring);
    }

    function geometry(o) {
      var type = o.type, coordinates;
      switch (type) {
        case "GeometryCollection": return {type: type, geometries: o.geometries.map(geometry)};
        case "Point": coordinates = point(o.coordinates); break;
        case "MultiPoint": coordinates = o.coordinates.map(point); break;
        case "LineString": coordinates = line(o.arcs); break;
        case "MultiLineString": coordinates = o.arcs.map(line); break;
        case "Polygon": coordinates = polygon(o.arcs); break;
        case "MultiPolygon": coordinates = o.arcs.map(polygon); break;
        default: return null;
      }
      return {type: type, coordinates: coordinates};
    }

    return geometry(o);
  }

  function stitch(topology, arcs) {
    var stitchedArcs = {},
        fragmentByStart = {},
        fragmentByEnd = {},
        fragments = [],
        emptyIndex = -1;

    // Stitch empty arcs first, since they may be subsumed by other arcs.
    arcs.forEach(function(i, j) {
      var arc = topology.arcs[i < 0 ? ~i : i], t;
      if (arc.length < 3 && !arc[1][0] && !arc[1][1]) {
        t = arcs[++emptyIndex], arcs[emptyIndex] = i, arcs[j] = t;
      }
    });

    arcs.forEach(function(i) {
      var e = ends(i),
          start = e[0],
          end = e[1],
          f, g;

      if (f = fragmentByEnd[start]) {
        delete fragmentByEnd[f.end];
        f.push(i);
        f.end = end;
        if (g = fragmentByStart[end]) {
          delete fragmentByStart[g.start];
          var fg = g === f ? f : f.concat(g);
          fragmentByStart[fg.start = f.start] = fragmentByEnd[fg.end = g.end] = fg;
        } else {
          fragmentByStart[f.start] = fragmentByEnd[f.end] = f;
        }
      } else if (f = fragmentByStart[end]) {
        delete fragmentByStart[f.start];
        f.unshift(i);
        f.start = start;
        if (g = fragmentByEnd[start]) {
          delete fragmentByEnd[g.end];
          var gf = g === f ? f : g.concat(f);
          fragmentByStart[gf.start = g.start] = fragmentByEnd[gf.end = f.end] = gf;
        } else {
          fragmentByStart[f.start] = fragmentByEnd[f.end] = f;
        }
      } else {
        f = [i];
        fragmentByStart[f.start = start] = fragmentByEnd[f.end = end] = f;
      }
    });

    function ends(i) {
      var arc = topology.arcs[i < 0 ? ~i : i], p0 = arc[0], p1;
      if (topology.transform) p1 = [0, 0], arc.forEach(function(dp) { p1[0] += dp[0], p1[1] += dp[1]; });
      else p1 = arc[arc.length - 1];
      return i < 0 ? [p1, p0] : [p0, p1];
    }

    function flush(fragmentByEnd, fragmentByStart) {
      for (var k in fragmentByEnd) {
        var f = fragmentByEnd[k];
        delete fragmentByStart[f.start];
        delete f.start;
        delete f.end;
        f.forEach(function(i) { stitchedArcs[i < 0 ? ~i : i] = 1; });
        fragments.push(f);
      }
    }

    flush(fragmentByEnd, fragmentByStart);
    flush(fragmentByStart, fragmentByEnd);
    arcs.forEach(function(i) { if (!stitchedArcs[i < 0 ? ~i : i]) fragments.push([i]); });

    return fragments;
  }

  function planarRingArea(ring) {
    var i = -1, n = ring.length, a, b = ring[n - 1], area = 0;
    while (++i < n) a = b, b = ring[i], area += a[0] * b[1] - a[1] * b[0];
    return Math.abs(area); // Note: doubled area!
  }

  function mergeArcs(topology, objects) {
    var polygonsByArc = {},
        polygons = [],
        groups = [];

    objects.forEach(geometry);

    function geometry(o) {
      switch (o.type) {
        case "GeometryCollection": o.geometries.forEach(geometry); break;
        case "Polygon": extract(o.arcs); break;
        case "MultiPolygon": o.arcs.forEach(extract); break;
      }
    }

    function extract(polygon) {
      polygon.forEach(function(ring) {
        ring.forEach(function(arc) {
          (polygonsByArc[arc = arc < 0 ? ~arc : arc] || (polygonsByArc[arc] = [])).push(polygon);
        });
      });
      polygons.push(polygon);
    }

    function area(ring) {
      return planarRingArea(object$1(topology, {type: "Polygon", arcs: [ring]}).coordinates[0]);
    }

    polygons.forEach(function(polygon) {
      if (!polygon._) {
        var group = [],
            neighbors = [polygon];
        polygon._ = 1;
        groups.push(group);
        while (polygon = neighbors.pop()) {
          group.push(polygon);
          polygon.forEach(function(ring) {
            ring.forEach(function(arc) {
              polygonsByArc[arc < 0 ? ~arc : arc].forEach(function(polygon) {
                if (!polygon._) {
                  polygon._ = 1;
                  neighbors.push(polygon);
                }
              });
            });
          });
        }
      }
    });

    polygons.forEach(function(polygon) {
      delete polygon._;
    });

    return {
      type: "MultiPolygon",
      arcs: groups.map(function(polygons) {
        var arcs = [], n;

        // Extract the exterior (unique) arcs.
        polygons.forEach(function(polygon) {
          polygon.forEach(function(ring) {
            ring.forEach(function(arc) {
              if (polygonsByArc[arc < 0 ? ~arc : arc].length < 2) {
                arcs.push(arc);
              }
            });
          });
        });

        // Stitch the arcs into one or more rings.
        arcs = stitch(topology, arcs);

        // If more than one ring is returned,
        // at most one of these rings can be the exterior;
        // choose the one with the greatest absolute area.
        if ((n = arcs.length) > 1) {
          for (var i = 1, k = area(arcs[0]), ki, t; i < n; ++i) {
            if ((ki = area(arcs[i])) > k) {
              t = arcs[0], arcs[0] = arcs[i], arcs[i] = t, k = ki;
            }
          }
        }

        return arcs;
      })
    };
  }

  function ascending(a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
  }

  function bisector(compare) {
    if (compare.length === 1) compare = ascendingComparator(compare);
    return {
      left: function(a, x, lo, hi) {
        if (lo == null) lo = 0;
        if (hi == null) hi = a.length;
        while (lo < hi) {
          var mid = lo + hi >>> 1;
          if (compare(a[mid], x) < 0) lo = mid + 1;
          else hi = mid;
        }
        return lo;
      },
      right: function(a, x, lo, hi) {
        if (lo == null) lo = 0;
        if (hi == null) hi = a.length;
        while (lo < hi) {
          var mid = lo + hi >>> 1;
          if (compare(a[mid], x) > 0) hi = mid;
          else lo = mid + 1;
        }
        return lo;
      }
    };
  }

  function ascendingComparator(f) {
    return function(d, x) {
      return ascending(f(d), x);
    };
  }

  var ascendingBisect = bisector(ascending);

  /*
    Taken from flubber:
    https://github.com/veltman/flubber
  */

  const bisect = bisector(d => d.area).left;

  function findNeighbor (geoms) {
    // we assume the first geom is the candidate for which
    // we want to find a neighbor
    const sourceArcs = geoms[0].arcs[0].map(arc => arc < 0 ? ~arc : arc);

    let neighbor;

    // start loop at index 1, first possible neighbor
    for (let index = 1; index < geoms.length; index++) {
      const targetArcs = geoms[index].arcs[0].map(arc => arc < 0 ? ~arc : arc);
      if (sourceArcs.some(arc => targetArcs.includes(arc))) {
        neighbor = index;
        break
      }
    }
    return neighbor
  }

  function collapseTopology (topology, numberOfPieces) {
    const triangleGeometries = topology.objects.triangles.geometries;

    while (triangleGeometries.length > numberOfPieces) {
      mergeSmallestFeature();
    }

    if (numberOfPieces > triangleGeometries.length) {
      throw new RangeError('Can\'t collapse topology into ' + numberOfPieces + ' pieces.')
    }

    const geojson = feature(topology, topology.objects.triangles);
    const geojsonTriangleGeometries = map(geojson.features, feature => feature.geometry);

    return geojsonTriangleGeometries

    function mergeSmallestFeature () {
      const smallest = triangleGeometries[0];
      const neighborIndex = findNeighbor(triangleGeometries);
      const neighbor = triangleGeometries[neighborIndex];
      const merged = mergeArcs(topology, [smallest, neighbor]);

      // MultiPolygon -> Polygon
      merged.area = smallest.area + neighbor.area;
      merged.type = 'Polygon';
      merged.arcs = merged.arcs[0];

      // Delete smallest and its chosen neighbor
      triangleGeometries.splice(neighborIndex, 1);
      triangleGeometries.shift();

      // Add new merged shape in sorted order
      triangleGeometries.splice(bisect(triangleGeometries, merged.area), 0, merged);
    }
  }

  function createGeometries (vertices, triangleIndices) {
    const geometries = [];

    for (let i = 0; i < triangleIndices.length; i += 3) {
      const triangleIndexArcs = createTriangleIndexArcs(triangleIndices, i);

      let outerRing = map(triangleIndexArcs, arc => getPoint(vertices, arc[0]));
      outerRing.push(getPoint(vertices, triangleIndexArcs[0][0])); // close ring

      // earcut doesn't always give counterclockwise rings back
      if (linearRingIsClockwise(outerRing)) {
        outerRing = outerRing.reverse();
      }

      geometries.push({
        type: 'Polygon',
        coordinates: [outerRing]
      });
    }

    return geometries
  }

  function sliceUpTriangles (geometries, numberOfPieces) {
    const areas = map(geometries, polygonArea);

    const order = getOrderDescending(areas);

    const areasSorted = sortIntoOrder(areas, order);
    const geometriesSorted = sortIntoOrder(geometries, order);

    while (geometriesSorted.length < numberOfPieces) {
      areasSorted.shift();
      const biggestTriangle = geometriesSorted.shift();

      const cutTriangles = cutTriangleInTwo(biggestTriangle);

      const areaCutTriangles = map(cutTriangles, polygonArea);

      for (let i = 0; i < cutTriangles.length; i++) {
        const areaCutTriangle = areaCutTriangles[i];
        const cutTriangle = cutTriangles[i];

        const insertionIndex = getInsertionIndexDescending(areasSorted, areaCutTriangle);

        areasSorted.splice(insertionIndex, 0, areaCutTriangle);
        geometriesSorted.splice(insertionIndex, 0, cutTriangle);
      }
    }

    return geometriesSorted
  }

  function cutTriangleInTwo (triangle) {
    const a = triangle.coordinates[0][0];
    const b = triangle.coordinates[0][1];
    const c = triangle.coordinates[0][2];

    const pointBetweenAB = interpolate(a, b)(0.5);

    const firstTriangle = createTriangleGeometry([a, pointBetweenAB, c, a]);
    const secondTriangle = createTriangleGeometry([b, c, pointBetweenAB, b]);

    return [firstTriangle, secondTriangle]
  }

  function createTriangleGeometry (points) {
    return {
      type: 'Polygon',
      coordinates: [points]
    }
  }

  /*
    Inspired by flubber:
    https://github.com/veltman/flubber
  */

  const dimensions = 2;

  function cutPolygon (polygon, numberOfPieces) {
    if (numberOfPieces < 2) throw new Error('Cannot cut polygon in less than 2 pieces')

    const flattenedPolygon = earcut_1.flatten(polygon.coordinates);
    const triangleIndices = earcut_1(flattenedPolygon.vertices, flattenedPolygon.holes, dimensions);

    const numberOfTriangles = getNumberOfTriangles(triangleIndices);

    if (numberOfTriangles >= numberOfPieces) {
      const topology = createTopology(flattenedPolygon.vertices, triangleIndices);
      return collapseTopology(topology, numberOfPieces)
    }

    if (numberOfTriangles < numberOfPieces) {
      const triangleGeometries = createGeometries(flattenedPolygon.vertices, triangleIndices);
      return sliceUpTriangles(triangleGeometries, numberOfPieces)
    }
  }

  function getNumberOfTriangles (triangleIndices) {
    return triangleIndices.length / 3
  }

  function cutPolygons (polygons, numberOfDesiredAdditionalPolygons) {
    if (numberOfDesiredAdditionalPolygons < 1) throw wrongNumberOfPolygonsError

    const polygonAreas = map(polygons, polygonArea);
    const numberOfCutsPerPolygon = assignCuts(polygonAreas, numberOfDesiredAdditionalPolygons);

    let resultingPolygons = [];

    for (let i = 0; i < polygons.length; i++) {
      const polygon = polygons[i];
      const numberOfCuts = numberOfCutsPerPolygon[i];

      if (numberOfCuts === 0) {
        resultingPolygons.push(polygon);
      }

      if (numberOfCuts > 0) {
        const numberOfDesiredPolygons = numberOfCuts + 1;
        resultingPolygons = resultingPolygons.concat(cutPolygon(polygon, numberOfDesiredPolygons));
      }
    }

    return resultingPolygons
  }

  const wrongNumberOfPolygonsError = new Error('Number of desired additional polygons must be larger than 0');

  // https://stackoverflow.com/a/38905829/7237112
  function assignCuts (polygonAreas, numberOfPieces) {
    const numberOfCutsPerPolygon = [];
    let totalArea = sum(polygonAreas);

    for (let i = 0; i < polygonAreas.length; i++) {
      const area = polygonAreas[i];
      const numberOfCuts = Math.round(area / totalArea * numberOfPieces);

      numberOfCutsPerPolygon.push(numberOfCuts);
      totalArea -= area;
      numberOfPieces -= numberOfCuts;
    }

    return numberOfCutsPerPolygon
  }

  function sum (array) {
    let sum = 0;

    for (let i = 0; i < array.length; i++) {
      sum += array[i];
    }

    return sum
  }

  function combineIntoMultiPolygon (inputGeometries) {
    const multiPolygon = createEmptyMultiPolygon();

    for (const inputGeometry of inputGeometries) {
      if (inputGeometry.type === 'Polygon') {
        multiPolygon.coordinates.push(inputGeometry.coordinates);
      }

      if (inputGeometry.type === 'MultiPolygon') {
        for (const polygon of inputGeometry.coordinates) {
          multiPolygon.coordinates.push(polygon);
        }
      }
    }

    return multiPolygon
  }

  function splitMultiPolygon (multiPolygon) {
    const polygons = [];

    for (const polygonCoordinates of multiPolygon.coordinates) {
      const polygon = createEmptyPolygon();
      polygon.coordinates = polygonCoordinates;

      polygons.push(polygon);
    }

    return polygons
  }

  function createEmptyMultiPolygon () {
    return { type: 'MultiPolygon', coordinates: [] }
  }

  function createEmptyPolygon () {
    return { type: 'Polygon', coordinates: undefined }
  }

  function multiPolygonToMultiPolygon (from, to) {
    let fromPolygons = splitMultiPolygon(from);
    let toPolygons = splitMultiPolygon(to);

    const lengthDifference = fromPolygons.length - toPolygons.length;

    if (lengthDifference > 0) {
      toPolygons = cutPolygons(toPolygons, lengthDifference);
    }

    if (lengthDifference < 0) {
      fromPolygons = cutPolygons(fromPolygons, -lengthDifference);
    }

    return createInterpolatorPolygons(from, to, fromPolygons, toPolygons)
  }

  function createInterpolatorPolygons (from, to, fromPolygons, toPolygons) {
    const fromOuterRings = map(fromPolygons, polygon => polygon.coordinates[0]);
    const toOuterRings = map(toPolygons, polygon => polygon.coordinates[0]);

    const fromOrder = matchLinearRings(fromOuterRings, toOuterRings);
    fromPolygons = map(fromOrder, i => fromPolygons[i]);

    const polygonInterpolators = [];

    for (let i = 0; i < fromPolygons.length; i++) {
      const fromPolygon = fromPolygons[i];
      const toPolygon = toPolygons[i];

      polygonInterpolators.push(polygonToPolygon(fromPolygon, toPolygon));
    }

    return function interpolator (t) {
      if (t === 0) return from
      if (t === 1) return to

      return combineIntoMultiPolygon(
        map(polygonInterpolators, polygonInterpolator => polygonInterpolator(t))
      )
    }
  }

  function multiPolygonToPolygon (from, to) {
    const fromPolygons = splitMultiPolygon(from);
    let toPolygons = [to];

    const numberOfFromPolygons = fromPolygons.length;
    const numberOfAdditionalToPolygonsRequried = numberOfFromPolygons - 1;

    if (numberOfAdditionalToPolygonsRequried > 0) {
      toPolygons = cutPolygon(to, numberOfFromPolygons);
    }

    return createInterpolatorPolygons(from, to, fromPolygons, toPolygons)
  }

  function polygonToMultiPolygon (from, to) {
    const reverseInterpolator = multiPolygonToPolygon(to, from);

    return function interpolator (t) {
      return reverseInterpolator(1 - t)
    }
  }

  function lineStringtoLineString (from, to) {
    const [preparedFromCoordinates, preparedToCoordinates] = prepareCoordinates(
      from.coordinates, to.coordinates
    );

    return createInterpolator(from, to, preparedFromCoordinates, preparedToCoordinates)
  }

  function prepareCoordinates (fromCoordinates, toCoordinates) {
    const lengthDifference = fromCoordinates.length - toCoordinates.length;

    let preparedFromCoordinates = fromCoordinates;
    let preparedToCoordinates = toCoordinates;

    if (lengthDifference > 0) {
      preparedToCoordinates = insertPointsLineString(fromCoordinates, lengthDifference);
    }

    if (lengthDifference < 0) {
      preparedFromCoordinates = insertPointsLineString(fromCoordinates, -lengthDifference);
    }

    preparedFromCoordinates = reverseIfBetterMatching(preparedFromCoordinates, preparedToCoordinates);

    return [preparedFromCoordinates, preparedToCoordinates]
  }

  function createInterpolator (from, to, preparedFromCoordinates, preparedToCoordinates) {
    const coordinateInterpolator = interpolate(preparedFromCoordinates, preparedToCoordinates);

    return function interpolator (t) {
      if (t === 0) return from
      if (t === 1) return to

      return {
        type: 'LineString',
        coordinates: coordinateInterpolator(t)
      }
    }
  }

  function reverseIfBetterMatching (from, to) {
    const normalTotalSquareDistance = getTotalSquaredDistancePositions(from, to);
    const fromReversed = cloneLinearRing(from).reverse();
    const reversedTotalSquareDistance = getTotalSquaredDistancePositions(fromReversed, to);

    if (normalTotalSquareDistance <= reversedTotalSquareDistance) {
      return from
    } else {
      return fromReversed
    }
  }

  function getTotalSquaredDistancePositions (from, to) {
    let totalSquaredDistance = 0;

    for (let i = 0; i < from.length; i++) {
      totalSquaredDistance += pointDistance(from[i], to[i]);
    }

    return totalSquaredDistance
  }

  function movePointAlongLine (a, b, distance) {
    const unitVector = getUnitVector(a, b);
    return movePoint(a, unitVector, distance)
  }

  function getUnitVector (a, b) {
    const magnitude = pointDistance(a, b);
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];

    return [dx / magnitude, dy / magnitude]
  }

  function movePoint (point, unitVector, distance) {
    return [
      point[0] + unitVector[0] * distance,
      point[1] + unitVector[1] * distance
    ]
  }

  function multiLineStringToLineString (from, to) {
    const numberOfFromLineStrings = from.coordinates.length;
    const preparedToCoordinates = cutLineString(to.coordinates, numberOfFromLineStrings);
    const lineStringInterpolators = createLineStringInterpolators(from.coordinates, preparedToCoordinates);

    return createMultiLineStringInterpolator(from, to, lineStringInterpolators)
  }

  function lineStringToMultiLineString (from, to) {
    const reverseInterpolator = multiLineStringToLineString(to, from);

    return function interpolator (t) {
      return reverseInterpolator(1 - t)
    }
  }

  function cutLineString (toCoordinates, numberOfLineStrings) {
    const multiLineStringCoordinates = [];

    const totalLengthTo = linearRingLength(toCoordinates);
    const desiredSegmentSize = totalLengthTo / numberOfLineStrings;

    const lastPointIndex = toCoordinates.length - 1;

    let currentSegment = [];
    let elapsedDistanceSinceLastCut = 0;

    for (let i = 0; i < lastPointIndex; i++) {
      const a = toCoordinates[i];
      currentSegment.push(a);
      const b = toCoordinates[i + 1];

      const distanceAB = pointDistance(a, b);
      const distanceIncludingCurrentSegment = elapsedDistanceSinceLastCut + distanceAB;

      if (distanceIncludingCurrentSegment < desiredSegmentSize) {
        elapsedDistanceSinceLastCut += distanceAB;
      }

      if (distanceIncludingCurrentSegment >= desiredSegmentSize) {
        const numberOfCuts = Math.floor(distanceIncludingCurrentSegment / desiredSegmentSize);

        const cutCoordinates = calculateCutCoordinates(
          a, b, elapsedDistanceSinceLastCut, desiredSegmentSize, numberOfCuts
        );

        currentSegment = currentSegment.concat(cutCoordinates);
        multiLineStringCoordinates.push(currentSegment);

        const lastCut = cutCoordinates[cutCoordinates.length - 1];

        if (pointsEqual(lastCut, b)) {
          currentSegment = [];
        } else {
          currentSegment = [lastCut];
        }

        elapsedDistanceSinceLastCut = pointDistance(lastCut, b);
      }
    }

    return multiLineStringCoordinates
  }

  function calculateCutCoordinates (a, b, offset, size, numberOfCuts) {
    const cuts = [];

    for (let i = 1; i <= numberOfCuts; i++) {
      cuts.push(movePointAlongLine(a, b, ((size * i) - offset)));
    }

    return cuts
  }

  function pointsEqual (a, b) {
    return a[0] === b[0] && a[1] === b[1]
  }

  function createLineStringInterpolators (fromCoordinates, toCoordinates) {
    const interpolators = [];

    for (let i = 0; i < fromCoordinates.length; i++) {
      const fromLineString = fromCoordinates[i];
      const toLineString = toCoordinates[i];

      const [preparedFromLineString, preparedToLineString] = prepareCoordinates(fromLineString, toLineString);
      const interpolator = interpolate(preparedFromLineString, preparedToLineString);
      interpolators.push(interpolator);
    }

    return interpolators
  }

  function createMultiLineStringInterpolator (from, to, lineStringInterpolators) {
    return function interpolator (t) {
      if (t === 0) return from
      if (t === 1) return to

      return {
        type: 'MultiLineString',
        coordinates: map(
          lineStringInterpolators,
          lineStringInterpolator => lineStringInterpolator(t)
        )
      }
    }
  }

  function matchLineStrings (input, target) {
    const inputOrder = getInputOrder(input, target);
    return inputOrder.map(i => input[i])
  }

  function getInputOrder (input, target) {
    const inputLengths = map(input, linearRingLength);
    const targetLengths = map(target, linearRingLength);

    const inputLengthOrderDescending = getOrderDescending(inputLengths);
    const targetLengthOrderDescending = getOrderDescending(targetLengths);

    const pairs = {};

    for (let i = 0; i < targetLengthOrderDescending.length; i++) {
      const inputIndex = inputLengthOrderDescending[i];
      const targetIndex = targetLengthOrderDescending[i];

      pairs[inputIndex] = targetIndex;
    }

    const inputOrder = [];

    for (let i = 0; i < target.length; i++) {
      inputOrder.push(pairs[i]);
    }

    return inputOrder
  }

  function multiLineStringToMultiLineString (from, to) {
    let fromLineStrings = from.coordinates;
    let toLineStrings = to.coordinates;

    const lengthDifference = fromLineStrings.length - toLineStrings.length;

    if (lengthDifference > 0) {
      toLineStrings = splitLineStrings(toLineStrings, lengthDifference);
    }

    if (lengthDifference < 0) {
      fromLineStrings = splitLineStrings(fromLineStrings, -lengthDifference);
    }

    fromLineStrings = matchLineStrings(fromLineStrings, toLineStrings);

    const lineStringInterpolators = createLineStringInterpolators(fromLineStrings, toLineStrings);

    return createMultiLineStringInterpolator(from, to, lineStringInterpolators)
  }

  function splitLineStrings (lineStrings, numberOfDesiredLineStrings) {
    const lineStringLengths = getLengths(lineStrings);
    const numberOfCutsPerLineString = assignCuts(lineStringLengths, numberOfDesiredLineStrings);

    let resultingLineStrings = [];

    for (let i = 0; i < numberOfCutsPerLineString.length; i++) {
      const lineString = lineStrings[i];
      const numberOfCuts = numberOfCutsPerLineString[i];

      if (numberOfCuts === 0) {
        resultingLineStrings.push(lineString);
      }

      if (numberOfCuts > 0) {
        const numberOfDesiredPieces = numberOfCuts + 1;

        resultingLineStrings = resultingLineStrings.concat(
          cutLineString(lineString, numberOfDesiredPieces)
        );
      }
    }

    return resultingLineStrings
  }

  function getLengths (lineStrings) {
    const lengths = [];

    for (let i = 0; i < lineStrings.length; i++) {
      lengths.push(
        linearRingLength(lineStrings[i])
      );
    }

    return lengths
  }

  function transshape (from, to) {
    ensureValidInput(from, to);

    // Polygon transitions
    if (from.type === 'Polygon' && to.type === 'Polygon') {
      return polygonToPolygon(from, to)
    }

    if (from.type === 'MultiPolygon' && to.type === 'Polygon') {
      return multiPolygonToPolygon(from, to)
    }

    if (from.type === 'Polygon' && to.type === 'MultiPolygon') {
      return polygonToMultiPolygon(from, to)
    }

    if (from.type === 'MultiPolygon' && to.type === 'MultiPolygon') {
      return multiPolygonToMultiPolygon(from, to)
    }

    // LineString transitions
    if (from.type === 'LineString' && to.type === 'LineString') {
      return lineStringtoLineString(from, to)
    }

    if (from.type === 'MultiLineString' && to.type === 'LineString') {
      return multiLineStringToLineString(from, to)
    }

    if (from.type === 'LineString' && to.type === 'MultiLineString') {
      return lineStringToMultiLineString(from, to)
    }

    if (from.type === 'MultiLineString' && to.type === 'MultiLineString') {
      return multiLineStringToMultiLineString(from, to)
    }
  }

  function ensureValidInput (from, to) {
    if (bothPolygons(from, to) || bothLines(from, to)) {
      return
    }

    throw new Error('Invalid input')
  }

  function bothPolygons (from, to) {
    return isPolygonOrMultiPolygon(from) && isPolygonOrMultiPolygon(to)
  }

  function bothLines (from, to) {
    return isLineStringOrMultiLineString(from) && isLineStringOrMultiLineString(to)
  }

  function implode (geometry) {
    ensureValidInput$1(geometry);

    const centroid = calculateCentroid(geometry);
    const implosionPoint = createSmallPolygonAroundPoint(centroid);

    return transshape(geometry, implosionPoint)
  }

  function explode (geometry) {
    ensureValidInput$1(geometry);

    const centroid = calculateCentroid(geometry);
    const explosionPoint = createSmallPolygonAroundPoint(centroid);

    return transshape(explosionPoint, geometry)
  }

  function ensureValidInput$1 (geometry) {
    if (!isPolygonOrMultiPolygon(geometry)) {
      throw new Error('Invalid input')
    }
  }

  function createSmallPolygonAroundPoint (point) {
    const linearRingAroundPoint = makeSmallRectangleAroundPoint(point);
    return {
      type: 'Polygon',
      coordinates: [linearRingAroundPoint]
    }
  }

  function transshapeLayer (fromLayer, toLayer) {
    ensureValidInput$2(fromLayer);

    const keyOverlap = getKeyOverlap(fromLayer, toLayer);
    const interpolatorObject = constructInterpolatorObject(fromLayer, toLayer, keyOverlap);

    return createLayerInterpolator(fromLayer, toLayer, interpolatorObject)
  }

  function ensureValidInput$2 (fromLayer, toLayer) {
    return every(Object.values(fromLayer), isPolygonOrMultiPolygon) &&
      every(Object.values(fromLayer), isPolygonOrMultiPolygon)
  }

  function getKeyOverlap (fromLayer, toLayer) {
    const keyOverlap = {};

    for (const key in fromLayer) {
      keyOverlap[key] = 'from';
    }

    for (const key in toLayer) {
      if (keyOverlap[key]) {
        keyOverlap[key] = 'both';
      } else {
        keyOverlap[key] = 'to';
      }
    }

    return keyOverlap
  }

  function constructInterpolatorObject (fromLayer, toLayer, keyOverlap) {
    const interpolatorObject = {};

    for (const key in keyOverlap) {
      const overlap = keyOverlap[key];

      if (overlap === 'both') {
        interpolatorObject[key] = transshape(fromLayer[key], toLayer[key]);
      }

      if (overlap === 'from') {
        interpolatorObject[key] = implode(fromLayer[key]);
      }

      if (overlap === 'to') {
        interpolatorObject[key] = explode(toLayer[key]);
      }
    }

    return interpolatorObject
  }

  function createLayerInterpolator (fromLayer, toLayer, interpolatorObject) {
    return function interpolator (t) {
      if (t === 0) return fromLayer
      if (t === 1) return toLayer

      const layerObject = {};

      for (const key in interpolatorObject) {
        layerObject[key] = interpolatorObject[key](t);
      }

      return layerObject
    }
  }

  exports.cutPolygon = cutPolygon;
  exports.cutPolygons = cutPolygons;
  exports.explode = explode;
  exports.implode = implode;
  exports.insertPointsLinearRing = insertPointsLinearRing;
  exports.matchLinearRings = matchLinearRings;
  exports.rotatePointsLinearRing = rotatePointsLinearRing;
  exports.transshape = transshape;
  exports.transshapeLayer = transshapeLayer;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
