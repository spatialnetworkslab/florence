
(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
var app = (function () {
	'use strict';

	function noop() {}

	function assign(tar, src) {
		for (const k in src) tar[k] = src[k];
		return tar;
	}

	function add_location(element, file, line, column, char) {
		element.__svelte_meta = {
			loc: { file, line, column, char }
		};
	}

	function run(fn) {
		return fn();
	}

	function blank_object() {
		return Object.create(null);
	}

	function run_all(fns) {
		fns.forEach(run);
	}

	function is_function(thing) {
		return typeof thing === 'function';
	}

	function safe_not_equal(a, b) {
		return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
	}

	function create_slot(definition, ctx, fn) {
		if (definition) {
			const slot_ctx = get_slot_context(definition, ctx, fn);
			return definition[0](slot_ctx);
		}
	}

	function get_slot_context(definition, ctx, fn) {
		return definition[1]
			? assign({}, assign(ctx.$$scope.ctx, definition[1](fn ? fn(ctx) : {})))
			: ctx.$$scope.ctx;
	}

	function get_slot_changes(definition, ctx, changed, fn) {
		return definition[1]
			? assign({}, assign(ctx.$$scope.changed || {}, definition[1](fn ? fn(changed) : {})))
			: ctx.$$scope.changed || {};
	}

	function append(target, node) {
		target.appendChild(node);
	}

	function insert(target, node, anchor) {
		target.insertBefore(node, anchor || null);
	}

	function detach(node) {
		node.parentNode.removeChild(node);
	}

	function destroy_each(iterations, detaching) {
		for (let i = 0; i < iterations.length; i += 1) {
			if (iterations[i]) iterations[i].d(detaching);
		}
	}

	function element(name) {
		return document.createElement(name);
	}

	function svg_element(name) {
		return document.createElementNS('http://www.w3.org/2000/svg', name);
	}

	function text(data) {
		return document.createTextNode(data);
	}

	function space() {
		return text(' ');
	}

	function empty() {
		return text('');
	}

	function attr(node, attribute, value) {
		if (value == null) node.removeAttribute(attribute);
		else node.setAttribute(attribute, value);
	}

	function children(element) {
		return Array.from(element.childNodes);
	}

	let current_component;

	function set_current_component(component) {
		current_component = component;
	}

	const dirty_components = [];

	const resolved_promise = Promise.resolve();
	let update_scheduled = false;
	const binding_callbacks = [];
	const render_callbacks = [];
	const flush_callbacks = [];

	function schedule_update() {
		if (!update_scheduled) {
			update_scheduled = true;
			resolved_promise.then(flush);
		}
	}

	function add_render_callback(fn) {
		render_callbacks.push(fn);
	}

	function flush() {
		const seen_callbacks = new Set();

		do {
			// first, call beforeUpdate functions
			// and update components
			while (dirty_components.length) {
				const component = dirty_components.shift();
				set_current_component(component);
				update(component.$$);
			}

			while (binding_callbacks.length) binding_callbacks.shift()();

			// then, once components are updated, call
			// afterUpdate functions. This may cause
			// subsequent updates...
			while (render_callbacks.length) {
				const callback = render_callbacks.pop();
				if (!seen_callbacks.has(callback)) {
					callback();

					// ...so guard against infinite loops
					seen_callbacks.add(callback);
				}
			}
		} while (dirty_components.length);

		while (flush_callbacks.length) {
			flush_callbacks.pop()();
		}

		update_scheduled = false;
	}

	function update($$) {
		if ($$.fragment) {
			$$.update($$.dirty);
			run_all($$.before_render);
			$$.fragment.p($$.dirty, $$.ctx);
			$$.dirty = null;

			$$.after_render.forEach(add_render_callback);
		}
	}

	let outros;

	function group_outros() {
		outros = {
			remaining: 0,
			callbacks: []
		};
	}

	function check_outros() {
		if (!outros.remaining) {
			run_all(outros.callbacks);
		}
	}

	function on_outro(callback) {
		outros.callbacks.push(callback);
	}

	function destroy_block(block, lookup) {
		block.d(1);
		lookup.delete(block.key);
	}

	function outro_and_destroy_block(block, lookup) {
		on_outro(() => {
			destroy_block(block, lookup);
		});

		block.o(1);
	}

	function update_keyed_each(old_blocks, changed, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
		let o = old_blocks.length;
		let n = list.length;

		let i = o;
		const old_indexes = {};
		while (i--) old_indexes[old_blocks[i].key] = i;

		const new_blocks = [];
		const new_lookup = new Map();
		const deltas = new Map();

		i = n;
		while (i--) {
			const child_ctx = get_context(ctx, list, i);
			const key = get_key(child_ctx);
			let block = lookup.get(key);

			if (!block) {
				block = create_each_block(key, child_ctx);
				block.c();
			} else if (dynamic) {
				block.p(changed, child_ctx);
			}

			new_lookup.set(key, new_blocks[i] = block);

			if (key in old_indexes) deltas.set(key, Math.abs(i - old_indexes[key]));
		}

		const will_move = new Set();
		const did_move = new Set();

		function insert(block) {
			if (block.i) block.i(1);
			block.m(node, next);
			lookup.set(block.key, block);
			next = block.first;
			n--;
		}

		while (o && n) {
			const new_block = new_blocks[n - 1];
			const old_block = old_blocks[o - 1];
			const new_key = new_block.key;
			const old_key = old_block.key;

			if (new_block === old_block) {
				// do nothing
				next = new_block.first;
				o--;
				n--;
			}

			else if (!new_lookup.has(old_key)) {
				// remove old block
				destroy(old_block, lookup);
				o--;
			}

			else if (!lookup.has(new_key) || will_move.has(new_key)) {
				insert(new_block);
			}

			else if (did_move.has(old_key)) {
				o--;

			} else if (deltas.get(new_key) > deltas.get(old_key)) {
				did_move.add(new_key);
				insert(new_block);

			} else {
				will_move.add(old_key);
				o--;
			}
		}

		while (o--) {
			const old_block = old_blocks[o];
			if (!new_lookup.has(old_block.key)) destroy(old_block, lookup);
		}

		while (n) insert(new_blocks[n - 1]);

		return new_blocks;
	}

	function mount_component(component, target, anchor) {
		const { fragment, on_mount, on_destroy, after_render } = component.$$;

		fragment.m(target, anchor);

		// onMount happens after the initial afterUpdate. Because
		// afterUpdate callbacks happen in reverse order (inner first)
		// we schedule onMount callbacks before afterUpdate callbacks
		add_render_callback(() => {
			const new_on_destroy = on_mount.map(run).filter(is_function);
			if (on_destroy) {
				on_destroy.push(...new_on_destroy);
			} else {
				// Edge case - component was destroyed immediately,
				// most likely as a result of a binding initialising
				run_all(new_on_destroy);
			}
			component.$$.on_mount = [];
		});

		after_render.forEach(add_render_callback);
	}

	function destroy(component, detaching) {
		if (component.$$) {
			run_all(component.$$.on_destroy);
			component.$$.fragment.d(detaching);

			// TODO null out other refs, including component.$$ (but need to
			// preserve final state?)
			component.$$.on_destroy = component.$$.fragment = null;
			component.$$.ctx = {};
		}
	}

	function make_dirty(component, key) {
		if (!component.$$.dirty) {
			dirty_components.push(component);
			schedule_update();
			component.$$.dirty = blank_object();
		}
		component.$$.dirty[key] = true;
	}

	function init(component, options, instance, create_fragment, not_equal$$1, prop_names) {
		const parent_component = current_component;
		set_current_component(component);

		const props = options.props || {};

		const $$ = component.$$ = {
			fragment: null,
			ctx: null,

			// state
			props: prop_names,
			update: noop,
			not_equal: not_equal$$1,
			bound: blank_object(),

			// lifecycle
			on_mount: [],
			on_destroy: [],
			before_render: [],
			after_render: [],
			context: new Map(parent_component ? parent_component.$$.context : []),

			// everything else
			callbacks: blank_object(),
			dirty: null
		};

		let ready = false;

		$$.ctx = instance
			? instance(component, props, (key, value) => {
				if ($$.ctx && not_equal$$1($$.ctx[key], $$.ctx[key] = value)) {
					if ($$.bound[key]) $$.bound[key](value);
					if (ready) make_dirty(component, key);
				}
			})
			: props;

		$$.update();
		ready = true;
		run_all($$.before_render);
		$$.fragment = create_fragment($$.ctx);

		if (options.target) {
			if (options.hydrate) {
				$$.fragment.l(children(options.target));
			} else {
				$$.fragment.c();
			}

			if (options.intro && component.$$.fragment.i) component.$$.fragment.i();
			mount_component(component, options.target, options.anchor);
			flush();
		}

		set_current_component(parent_component);
	}

	class SvelteComponent {
		$destroy() {
			destroy(this, true);
			this.$destroy = noop;
		}

		$on(type, callback) {
			const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
			callbacks.push(callback);

			return () => {
				const index = callbacks.indexOf(callback);
				if (index !== -1) callbacks.splice(index, 1);
			};
		}

		$set() {
			// overridden by instance, if it has props
		}
	}

	class SvelteComponentDev extends SvelteComponent {
		constructor(options) {
			if (!options || (!options.target && !options.$$inline)) {
				throw new Error(`'target' is a required option`);
			}

			super();
		}

		$destroy() {
			super.$destroy();
			this.$destroy = () => {
				console.warn(`Component was already destroyed`); // eslint-disable-line no-console
			};
		}
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
	var bisectRight = ascendingBisect.right;

	function sequence(start, stop, step) {
	  start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;

	  var i = -1,
	      n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
	      range = new Array(n);

	  while (++i < n) {
	    range[i] = start + i * step;
	  }

	  return range;
	}

	var e10 = Math.sqrt(50),
	    e5 = Math.sqrt(10),
	    e2 = Math.sqrt(2);

	function ticks(start, stop, count) {
	  var reverse,
	      i = -1,
	      n,
	      ticks,
	      step;

	  stop = +stop, start = +start, count = +count;
	  if (start === stop && count > 0) return [start];
	  if (reverse = stop < start) n = start, start = stop, stop = n;
	  if ((step = tickIncrement(start, stop, count)) === 0 || !isFinite(step)) return [];

	  if (step > 0) {
	    start = Math.ceil(start / step);
	    stop = Math.floor(stop / step);
	    ticks = new Array(n = Math.ceil(stop - start + 1));
	    while (++i < n) ticks[i] = (start + i) * step;
	  } else {
	    start = Math.floor(start * step);
	    stop = Math.ceil(stop * step);
	    ticks = new Array(n = Math.ceil(start - stop + 1));
	    while (++i < n) ticks[i] = (start - i) / step;
	  }

	  if (reverse) ticks.reverse();

	  return ticks;
	}

	function tickIncrement(start, stop, count) {
	  var step = (stop - start) / Math.max(0, count),
	      power = Math.floor(Math.log(step) / Math.LN10),
	      error = step / Math.pow(10, power);
	  return power >= 0
	      ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power)
	      : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
	}

	function tickStep(start, stop, count) {
	  var step0 = Math.abs(stop - start) / Math.max(0, count),
	      step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
	      error = step0 / step1;
	  if (error >= e10) step1 *= 10;
	  else if (error >= e5) step1 *= 5;
	  else if (error >= e2) step1 *= 2;
	  return stop < start ? -step1 : step1;
	}

	function initRange(domain, range) {
	  switch (arguments.length) {
	    case 0: break;
	    case 1: this.range(domain); break;
	    default: this.range(range).domain(domain); break;
	  }
	  return this;
	}

	const implicit = Symbol("implicit");

	function ordinal() {
	  var index = new Map(),
	      domain = [],
	      range = [],
	      unknown = implicit;

	  function scale(d) {
	    var key = d + "", i = index.get(key);
	    if (!i) {
	      if (unknown !== implicit) return unknown;
	      index.set(key, i = domain.push(d));
	    }
	    return range[(i - 1) % range.length];
	  }

	  scale.domain = function(_) {
	    if (!arguments.length) return domain.slice();
	    domain = [], index = new Map();
	    for (const value of _) {
	      const key = value + "";
	      if (index.has(key)) continue;
	      index.set(key, domain.push(value));
	    }
	    return scale;
	  };

	  scale.range = function(_) {
	    return arguments.length ? (range = Array.from(_), scale) : range.slice();
	  };

	  scale.unknown = function(_) {
	    return arguments.length ? (unknown = _, scale) : unknown;
	  };

	  scale.copy = function() {
	    return ordinal(domain, range).unknown(unknown);
	  };

	  initRange.apply(scale, arguments);

	  return scale;
	}

	function band() {
	  var scale = ordinal().unknown(undefined),
	      domain = scale.domain,
	      ordinalRange = scale.range,
	      r0 = 0,
	      r1 = 1,
	      step,
	      bandwidth,
	      round = false,
	      paddingInner = 0,
	      paddingOuter = 0,
	      align = 0.5;

	  delete scale.unknown;

	  function rescale() {
	    var n = domain().length,
	        reverse = r1 < r0,
	        start = reverse ? r1 : r0,
	        stop = reverse ? r0 : r1;
	    step = (stop - start) / Math.max(1, n - paddingInner + paddingOuter * 2);
	    if (round) step = Math.floor(step);
	    start += (stop - start - step * (n - paddingInner)) * align;
	    bandwidth = step * (1 - paddingInner);
	    if (round) start = Math.round(start), bandwidth = Math.round(bandwidth);
	    var values = sequence(n).map(function(i) { return start + step * i; });
	    return ordinalRange(reverse ? values.reverse() : values);
	  }

	  scale.domain = function(_) {
	    return arguments.length ? (domain(_), rescale()) : domain();
	  };

	  scale.range = function(_) {
	    return arguments.length ? ([r0, r1] = _, r0 = +r0, r1 = +r1, rescale()) : [r0, r1];
	  };

	  scale.rangeRound = function(_) {
	    return [r0, r1] = _, r0 = +r0, r1 = +r1, round = true, rescale();
	  };

	  scale.bandwidth = function() {
	    return bandwidth;
	  };

	  scale.step = function() {
	    return step;
	  };

	  scale.round = function(_) {
	    return arguments.length ? (round = !!_, rescale()) : round;
	  };

	  scale.padding = function(_) {
	    return arguments.length ? (paddingInner = Math.min(1, paddingOuter = +_), rescale()) : paddingInner;
	  };

	  scale.paddingInner = function(_) {
	    return arguments.length ? (paddingInner = Math.min(1, _), rescale()) : paddingInner;
	  };

	  scale.paddingOuter = function(_) {
	    return arguments.length ? (paddingOuter = +_, rescale()) : paddingOuter;
	  };

	  scale.align = function(_) {
	    return arguments.length ? (align = Math.max(0, Math.min(1, _)), rescale()) : align;
	  };

	  scale.copy = function() {
	    return band(domain(), [r0, r1])
	        .round(round)
	        .paddingInner(paddingInner)
	        .paddingOuter(paddingOuter)
	        .align(align);
	  };

	  return initRange.apply(rescale(), arguments);
	}

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
	    return (0 <= this.r && this.r <= 255)
	        && (0 <= this.g && this.g <= 255)
	        && (0 <= this.b && this.b <= 255)
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

	// https://beta.observablehq.com/@mbostock/lab-and-rgb
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
	  if (o instanceof Hcl) {
	    if (isNaN(o.h)) return new Lab(o.l, 0, 0, o.opacity);
	    var h = o.h * deg2rad;
	    return new Lab(o.l, Math.cos(h) * o.c, Math.sin(h) * o.c, o.opacity);
	  }
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
	  if (o.a === 0 && o.b === 0) return new Hcl(NaN, 0, o.l, o.opacity);
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

	define(Hcl, hcl, extend(Color, {
	  brighter: function(k) {
	    return new Hcl(this.h, this.c, this.l + K * (k == null ? 1 : k), this.opacity);
	  },
	  darker: function(k) {
	    return new Hcl(this.h, this.c, this.l - K * (k == null ? 1 : k), this.opacity);
	  },
	  rgb: function() {
	    return labConvert(this).rgb();
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

	  for (i = 0; i < na; ++i) x[i] = interpolateValue(a[i], b[i]);
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

	function interpolateNumber(a, b) {
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
	      i[k] = interpolateValue(a[k], b[k]);
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
	      q.push({i: i, x: interpolateNumber(am, bm)});
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

	function interpolateValue(a, b) {
	  var t = typeof b, c;
	  return b == null || t === "boolean" ? constant(b)
	      : (t === "number" ? interpolateNumber
	      : t === "string" ? ((c = color(b)) ? (b = c, rgb$1) : string)
	      : b instanceof color ? rgb$1
	      : b instanceof Date ? date
	      : Array.isArray(b) ? array
	      : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object
	      : interpolateNumber)(a, b);
	}

	function interpolateRound(a, b) {
	  return a = +a, b -= a, function(t) {
	    return Math.round(a + b * t);
	  };
	}

	var degrees = 180 / Math.PI;

	var rho = Math.SQRT2;

	function constant$1(x) {
	  return function() {
	    return x;
	  };
	}

	function number(x) {
	  return +x;
	}

	var unit = [0, 1];

	function identity(x) {
	  return x;
	}

	function normalize(a, b) {
	  return (b -= (a = +a))
	      ? function(x) { return (x - a) / b; }
	      : constant$1(isNaN(b) ? NaN : 0.5);
	}

	function clamper(domain) {
	  var a = domain[0], b = domain[domain.length - 1], t;
	  if (a > b) t = a, a = b, b = t;
	  return function(x) { return Math.max(a, Math.min(b, x)); };
	}

	// normalize(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
	// interpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding range value x in [a,b].
	function bimap(domain, range, interpolate) {
	  var d0 = domain[0], d1 = domain[1], r0 = range[0], r1 = range[1];
	  if (d1 < d0) d0 = normalize(d1, d0), r0 = interpolate(r1, r0);
	  else d0 = normalize(d0, d1), r0 = interpolate(r0, r1);
	  return function(x) { return r0(d0(x)); };
	}

	function polymap(domain, range, interpolate) {
	  var j = Math.min(domain.length, range.length) - 1,
	      d = new Array(j),
	      r = new Array(j),
	      i = -1;

	  // Reverse descending domains.
	  if (domain[j] < domain[0]) {
	    domain = domain.slice().reverse();
	    range = range.slice().reverse();
	  }

	  while (++i < j) {
	    d[i] = normalize(domain[i], domain[i + 1]);
	    r[i] = interpolate(range[i], range[i + 1]);
	  }

	  return function(x) {
	    var i = bisectRight(domain, x, 1, j) - 1;
	    return r[i](d[i](x));
	  };
	}

	function copy(source, target) {
	  return target
	      .domain(source.domain())
	      .range(source.range())
	      .interpolate(source.interpolate())
	      .clamp(source.clamp())
	      .unknown(source.unknown());
	}

	function transformer() {
	  var domain = unit,
	      range = unit,
	      interpolate = interpolateValue,
	      transform,
	      untransform,
	      unknown,
	      clamp = identity,
	      piecewise,
	      output,
	      input;

	  function rescale() {
	    piecewise = Math.min(domain.length, range.length) > 2 ? polymap : bimap;
	    output = input = null;
	    return scale;
	  }

	  function scale(x) {
	    return isNaN(x = +x) ? unknown : (output || (output = piecewise(domain.map(transform), range, interpolate)))(transform(clamp(x)));
	  }

	  scale.invert = function(y) {
	    return clamp(untransform((input || (input = piecewise(range, domain.map(transform), interpolateNumber)))(y)));
	  };

	  scale.domain = function(_) {
	    return arguments.length ? (domain = Array.from(_, number), clamp === identity || (clamp = clamper(domain)), rescale()) : domain.slice();
	  };

	  scale.range = function(_) {
	    return arguments.length ? (range = Array.from(_), rescale()) : range.slice();
	  };

	  scale.rangeRound = function(_) {
	    return range = Array.from(_), interpolate = interpolateRound, rescale();
	  };

	  scale.clamp = function(_) {
	    return arguments.length ? (clamp = _ ? clamper(domain) : identity, scale) : clamp !== identity;
	  };

	  scale.interpolate = function(_) {
	    return arguments.length ? (interpolate = _, rescale()) : interpolate;
	  };

	  scale.unknown = function(_) {
	    return arguments.length ? (unknown = _, scale) : unknown;
	  };

	  return function(t, u) {
	    transform = t, untransform = u;
	    return rescale();
	  };
	}

	function continuous(transform, untransform) {
	  return transformer()(transform, untransform);
	}

	// Computes the decimal coefficient and exponent of the specified number x with
	// significant digits p, where x is positive and p is in [1, 21] or undefined.
	// For example, formatDecimal(1.23) returns ["123", 0].
	function formatDecimal(x, p) {
	  if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
	  var i, coefficient = x.slice(0, i);

	  // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
	  // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
	  return [
	    coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
	    +x.slice(i + 1)
	  ];
	}

	function exponent(x) {
	  return x = formatDecimal(Math.abs(x)), x ? x[1] : NaN;
	}

	function formatGroup(grouping, thousands) {
	  return function(value, width) {
	    var i = value.length,
	        t = [],
	        j = 0,
	        g = grouping[0],
	        length = 0;

	    while (i > 0 && g > 0) {
	      if (length + g + 1 > width) g = Math.max(1, width - length);
	      t.push(value.substring(i -= g, i + g));
	      if ((length += g + 1) > width) break;
	      g = grouping[j = (j + 1) % grouping.length];
	    }

	    return t.reverse().join(thousands);
	  };
	}

	function formatNumerals(numerals) {
	  return function(value) {
	    return value.replace(/[0-9]/g, function(i) {
	      return numerals[+i];
	    });
	  };
	}

	// [[fill]align][sign][symbol][0][width][,][.precision][~][type]
	var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;

	function formatSpecifier(specifier) {
	  return new FormatSpecifier(specifier);
	}

	formatSpecifier.prototype = FormatSpecifier.prototype; // instanceof

	function FormatSpecifier(specifier) {
	  if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);
	  var match;
	  this.fill = match[1] || " ";
	  this.align = match[2] || ">";
	  this.sign = match[3] || "-";
	  this.symbol = match[4] || "";
	  this.zero = !!match[5];
	  this.width = match[6] && +match[6];
	  this.comma = !!match[7];
	  this.precision = match[8] && +match[8].slice(1);
	  this.trim = !!match[9];
	  this.type = match[10] || "";
	}

	FormatSpecifier.prototype.toString = function() {
	  return this.fill
	      + this.align
	      + this.sign
	      + this.symbol
	      + (this.zero ? "0" : "")
	      + (this.width == null ? "" : Math.max(1, this.width | 0))
	      + (this.comma ? "," : "")
	      + (this.precision == null ? "" : "." + Math.max(0, this.precision | 0))
	      + (this.trim ? "~" : "")
	      + this.type;
	};

	// Trims insignificant zeros, e.g., replaces 1.2000k with 1.2k.
	function formatTrim(s) {
	  out: for (var n = s.length, i = 1, i0 = -1, i1; i < n; ++i) {
	    switch (s[i]) {
	      case ".": i0 = i1 = i; break;
	      case "0": if (i0 === 0) i0 = i; i1 = i; break;
	      default: if (i0 > 0) { if (!+s[i]) break out; i0 = 0; } break;
	    }
	  }
	  return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
	}

	var prefixExponent;

	function formatPrefixAuto(x, p) {
	  var d = formatDecimal(x, p);
	  if (!d) return x + "";
	  var coefficient = d[0],
	      exponent = d[1],
	      i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
	      n = coefficient.length;
	  return i === n ? coefficient
	      : i > n ? coefficient + new Array(i - n + 1).join("0")
	      : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
	      : "0." + new Array(1 - i).join("0") + formatDecimal(x, Math.max(0, p + i - 1))[0]; // less than 1y!
	}

	function formatRounded(x, p) {
	  var d = formatDecimal(x, p);
	  if (!d) return x + "";
	  var coefficient = d[0],
	      exponent = d[1];
	  return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
	      : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
	      : coefficient + new Array(exponent - coefficient.length + 2).join("0");
	}

	var formatTypes = {
	  "%": function(x, p) { return (x * 100).toFixed(p); },
	  "b": function(x) { return Math.round(x).toString(2); },
	  "c": function(x) { return x + ""; },
	  "d": function(x) { return Math.round(x).toString(10); },
	  "e": function(x, p) { return x.toExponential(p); },
	  "f": function(x, p) { return x.toFixed(p); },
	  "g": function(x, p) { return x.toPrecision(p); },
	  "o": function(x) { return Math.round(x).toString(8); },
	  "p": function(x, p) { return formatRounded(x * 100, p); },
	  "r": formatRounded,
	  "s": formatPrefixAuto,
	  "X": function(x) { return Math.round(x).toString(16).toUpperCase(); },
	  "x": function(x) { return Math.round(x).toString(16); }
	};

	function identity$1(x) {
	  return x;
	}

	var prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];

	function formatLocale(locale) {
	  var group = locale.grouping && locale.thousands ? formatGroup(locale.grouping, locale.thousands) : identity$1,
	      currency = locale.currency,
	      decimal = locale.decimal,
	      numerals = locale.numerals ? formatNumerals(locale.numerals) : identity$1,
	      percent = locale.percent || "%";

	  function newFormat(specifier) {
	    specifier = formatSpecifier(specifier);

	    var fill = specifier.fill,
	        align = specifier.align,
	        sign = specifier.sign,
	        symbol = specifier.symbol,
	        zero = specifier.zero,
	        width = specifier.width,
	        comma = specifier.comma,
	        precision = specifier.precision,
	        trim = specifier.trim,
	        type = specifier.type;

	    // The "n" type is an alias for ",g".
	    if (type === "n") comma = true, type = "g";

	    // The "" type, and any invalid type, is an alias for ".12~g".
	    else if (!formatTypes[type]) precision == null && (precision = 12), trim = true, type = "g";

	    // If zero fill is specified, padding goes after sign and before digits.
	    if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";

	    // Compute the prefix and suffix.
	    // For SI-prefix, the suffix is lazily computed.
	    var prefix = symbol === "$" ? currency[0] : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
	        suffix = symbol === "$" ? currency[1] : /[%p]/.test(type) ? percent : "";

	    // What format function should we use?
	    // Is this an integer type?
	    // Can this type generate exponential notation?
	    var formatType = formatTypes[type],
	        maybeSuffix = /[defgprs%]/.test(type);

	    // Set the default precision if not specified,
	    // or clamp the specified precision to the supported range.
	    // For significant precision, it must be in [1, 21].
	    // For fixed precision, it must be in [0, 20].
	    precision = precision == null ? 6
	        : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
	        : Math.max(0, Math.min(20, precision));

	    function format(value) {
	      var valuePrefix = prefix,
	          valueSuffix = suffix,
	          i, n, c;

	      if (type === "c") {
	        valueSuffix = formatType(value) + valueSuffix;
	        value = "";
	      } else {
	        value = +value;

	        // Perform the initial formatting.
	        var valueNegative = value < 0;
	        value = formatType(Math.abs(value), precision);

	        // Trim insignificant zeros.
	        if (trim) value = formatTrim(value);

	        // If a negative value rounds to zero during formatting, treat as positive.
	        if (valueNegative && +value === 0) valueNegative = false;

	        // Compute the prefix and suffix.
	        valuePrefix = (valueNegative ? (sign === "(" ? sign : "-") : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
	        valueSuffix = (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : "");

	        // Break the formatted value into the integer “value” part that can be
	        // grouped, and fractional or exponential “suffix” part that is not.
	        if (maybeSuffix) {
	          i = -1, n = value.length;
	          while (++i < n) {
	            if (c = value.charCodeAt(i), 48 > c || c > 57) {
	              valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
	              value = value.slice(0, i);
	              break;
	            }
	          }
	        }
	      }

	      // If the fill character is not "0", grouping is applied before padding.
	      if (comma && !zero) value = group(value, Infinity);

	      // Compute the padding.
	      var length = valuePrefix.length + value.length + valueSuffix.length,
	          padding = length < width ? new Array(width - length + 1).join(fill) : "";

	      // If the fill character is "0", grouping is applied after padding.
	      if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

	      // Reconstruct the final output based on the desired alignment.
	      switch (align) {
	        case "<": value = valuePrefix + value + valueSuffix + padding; break;
	        case "=": value = valuePrefix + padding + value + valueSuffix; break;
	        case "^": value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length); break;
	        default: value = padding + valuePrefix + value + valueSuffix; break;
	      }

	      return numerals(value);
	    }

	    format.toString = function() {
	      return specifier + "";
	    };

	    return format;
	  }

	  function formatPrefix(specifier, value) {
	    var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
	        e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3,
	        k = Math.pow(10, -e),
	        prefix = prefixes[8 + e / 3];
	    return function(value) {
	      return f(k * value) + prefix;
	    };
	  }

	  return {
	    format: newFormat,
	    formatPrefix: formatPrefix
	  };
	}

	var locale;
	var format;
	var formatPrefix;

	defaultLocale({
	  decimal: ".",
	  thousands: ",",
	  grouping: [3],
	  currency: ["$", ""]
	});

	function defaultLocale(definition) {
	  locale = formatLocale(definition);
	  format = locale.format;
	  formatPrefix = locale.formatPrefix;
	  return locale;
	}

	function precisionFixed(step) {
	  return Math.max(0, -exponent(Math.abs(step)));
	}

	function precisionPrefix(step, value) {
	  return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 - exponent(Math.abs(step)));
	}

	function precisionRound(step, max) {
	  step = Math.abs(step), max = Math.abs(max) - step;
	  return Math.max(0, exponent(max) - exponent(step)) + 1;
	}

	function tickFormat(start, stop, count, specifier) {
	  var step = tickStep(start, stop, count),
	      precision;
	  specifier = formatSpecifier(specifier == null ? ",f" : specifier);
	  switch (specifier.type) {
	    case "s": {
	      var value = Math.max(Math.abs(start), Math.abs(stop));
	      if (specifier.precision == null && !isNaN(precision = precisionPrefix(step, value))) specifier.precision = precision;
	      return formatPrefix(specifier, value);
	    }
	    case "":
	    case "e":
	    case "g":
	    case "p":
	    case "r": {
	      if (specifier.precision == null && !isNaN(precision = precisionRound(step, Math.max(Math.abs(start), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
	      break;
	    }
	    case "f":
	    case "%": {
	      if (specifier.precision == null && !isNaN(precision = precisionFixed(step))) specifier.precision = precision - (specifier.type === "%") * 2;
	      break;
	    }
	  }
	  return format(specifier);
	}

	function linearish(scale) {
	  var domain = scale.domain;

	  scale.ticks = function(count) {
	    var d = domain();
	    return ticks(d[0], d[d.length - 1], count == null ? 10 : count);
	  };

	  scale.tickFormat = function(count, specifier) {
	    var d = domain();
	    return tickFormat(d[0], d[d.length - 1], count == null ? 10 : count, specifier);
	  };

	  scale.nice = function(count) {
	    if (count == null) count = 10;

	    var d = domain(),
	        i0 = 0,
	        i1 = d.length - 1,
	        start = d[i0],
	        stop = d[i1],
	        step;

	    if (stop < start) {
	      step = start, start = stop, stop = step;
	      step = i0, i0 = i1, i1 = step;
	    }

	    step = tickIncrement(start, stop, count);

	    if (step > 0) {
	      start = Math.floor(start / step) * step;
	      stop = Math.ceil(stop / step) * step;
	      step = tickIncrement(start, stop, count);
	    } else if (step < 0) {
	      start = Math.ceil(start * step) / step;
	      stop = Math.floor(stop * step) / step;
	      step = tickIncrement(start, stop, count);
	    }

	    if (step > 0) {
	      d[i0] = Math.floor(start / step) * step;
	      d[i1] = Math.ceil(stop / step) * step;
	      domain(d);
	    } else if (step < 0) {
	      d[i0] = Math.ceil(start * step) / step;
	      d[i1] = Math.floor(stop * step) / step;
	      domain(d);
	    }

	    return scale;
	  };

	  return scale;
	}

	function linear$1() {
	  var scale = continuous(identity, identity);

	  scale.copy = function() {
	    return copy(scale, linear$1());
	  };

	  initRange.apply(scale, arguments);

	  return linearish(scale);
	}

	var t0$1 = new Date,
	    t1$1 = new Date;

	function newInterval(floori, offseti, count, field) {

	  function interval(date) {
	    return floori(date = new Date(+date)), date;
	  }

	  interval.floor = interval;

	  interval.ceil = function(date) {
	    return floori(date = new Date(date - 1)), offseti(date, 1), floori(date), date;
	  };

	  interval.round = function(date) {
	    var d0 = interval(date),
	        d1 = interval.ceil(date);
	    return date - d0 < d1 - date ? d0 : d1;
	  };

	  interval.offset = function(date, step) {
	    return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
	  };

	  interval.range = function(start, stop, step) {
	    var range = [], previous;
	    start = interval.ceil(start);
	    step = step == null ? 1 : Math.floor(step);
	    if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date
	    do range.push(previous = new Date(+start)), offseti(start, step), floori(start);
	    while (previous < start && start < stop);
	    return range;
	  };

	  interval.filter = function(test) {
	    return newInterval(function(date) {
	      if (date >= date) while (floori(date), !test(date)) date.setTime(date - 1);
	    }, function(date, step) {
	      if (date >= date) {
	        if (step < 0) while (++step <= 0) {
	          while (offseti(date, -1), !test(date)) {} // eslint-disable-line no-empty
	        } else while (--step >= 0) {
	          while (offseti(date, +1), !test(date)) {} // eslint-disable-line no-empty
	        }
	      }
	    });
	  };

	  if (count) {
	    interval.count = function(start, end) {
	      t0$1.setTime(+start), t1$1.setTime(+end);
	      floori(t0$1), floori(t1$1);
	      return Math.floor(count(t0$1, t1$1));
	    };

	    interval.every = function(step) {
	      step = Math.floor(step);
	      return !isFinite(step) || !(step > 0) ? null
	          : !(step > 1) ? interval
	          : interval.filter(field
	              ? function(d) { return field(d) % step === 0; }
	              : function(d) { return interval.count(0, d) % step === 0; });
	    };
	  }

	  return interval;
	}

	var millisecond = newInterval(function() {
	  // noop
	}, function(date, step) {
	  date.setTime(+date + step);
	}, function(start, end) {
	  return end - start;
	});

	// An optimized implementation for this simple case.
	millisecond.every = function(k) {
	  k = Math.floor(k);
	  if (!isFinite(k) || !(k > 0)) return null;
	  if (!(k > 1)) return millisecond;
	  return newInterval(function(date) {
	    date.setTime(Math.floor(date / k) * k);
	  }, function(date, step) {
	    date.setTime(+date + step * k);
	  }, function(start, end) {
	    return (end - start) / k;
	  });
	};

	var durationSecond = 1e3;
	var durationMinute = 6e4;
	var durationHour = 36e5;
	var durationDay = 864e5;
	var durationWeek = 6048e5;

	var second = newInterval(function(date) {
	  date.setTime(date - date.getMilliseconds());
	}, function(date, step) {
	  date.setTime(+date + step * durationSecond);
	}, function(start, end) {
	  return (end - start) / durationSecond;
	}, function(date) {
	  return date.getUTCSeconds();
	});

	var minute = newInterval(function(date) {
	  date.setTime(date - date.getMilliseconds() - date.getSeconds() * durationSecond);
	}, function(date, step) {
	  date.setTime(+date + step * durationMinute);
	}, function(start, end) {
	  return (end - start) / durationMinute;
	}, function(date) {
	  return date.getMinutes();
	});

	var hour = newInterval(function(date) {
	  date.setTime(date - date.getMilliseconds() - date.getSeconds() * durationSecond - date.getMinutes() * durationMinute);
	}, function(date, step) {
	  date.setTime(+date + step * durationHour);
	}, function(start, end) {
	  return (end - start) / durationHour;
	}, function(date) {
	  return date.getHours();
	});

	var day = newInterval(function(date) {
	  date.setHours(0, 0, 0, 0);
	}, function(date, step) {
	  date.setDate(date.getDate() + step);
	}, function(start, end) {
	  return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationDay;
	}, function(date) {
	  return date.getDate() - 1;
	});

	function weekday(i) {
	  return newInterval(function(date) {
	    date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
	    date.setHours(0, 0, 0, 0);
	  }, function(date, step) {
	    date.setDate(date.getDate() + step * 7);
	  }, function(start, end) {
	    return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationWeek;
	  });
	}

	var sunday = weekday(0);
	var monday = weekday(1);
	var tuesday = weekday(2);
	var wednesday = weekday(3);
	var thursday = weekday(4);
	var friday = weekday(5);
	var saturday = weekday(6);

	var month = newInterval(function(date) {
	  date.setDate(1);
	  date.setHours(0, 0, 0, 0);
	}, function(date, step) {
	  date.setMonth(date.getMonth() + step);
	}, function(start, end) {
	  return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
	}, function(date) {
	  return date.getMonth();
	});

	var year = newInterval(function(date) {
	  date.setMonth(0, 1);
	  date.setHours(0, 0, 0, 0);
	}, function(date, step) {
	  date.setFullYear(date.getFullYear() + step);
	}, function(start, end) {
	  return end.getFullYear() - start.getFullYear();
	}, function(date) {
	  return date.getFullYear();
	});

	// An optimized implementation for this simple case.
	year.every = function(k) {
	  return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
	    date.setFullYear(Math.floor(date.getFullYear() / k) * k);
	    date.setMonth(0, 1);
	    date.setHours(0, 0, 0, 0);
	  }, function(date, step) {
	    date.setFullYear(date.getFullYear() + step * k);
	  });
	};

	var utcMinute = newInterval(function(date) {
	  date.setUTCSeconds(0, 0);
	}, function(date, step) {
	  date.setTime(+date + step * durationMinute);
	}, function(start, end) {
	  return (end - start) / durationMinute;
	}, function(date) {
	  return date.getUTCMinutes();
	});

	var utcHour = newInterval(function(date) {
	  date.setUTCMinutes(0, 0, 0);
	}, function(date, step) {
	  date.setTime(+date + step * durationHour);
	}, function(start, end) {
	  return (end - start) / durationHour;
	}, function(date) {
	  return date.getUTCHours();
	});

	var utcDay = newInterval(function(date) {
	  date.setUTCHours(0, 0, 0, 0);
	}, function(date, step) {
	  date.setUTCDate(date.getUTCDate() + step);
	}, function(start, end) {
	  return (end - start) / durationDay;
	}, function(date) {
	  return date.getUTCDate() - 1;
	});

	function utcWeekday(i) {
	  return newInterval(function(date) {
	    date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
	    date.setUTCHours(0, 0, 0, 0);
	  }, function(date, step) {
	    date.setUTCDate(date.getUTCDate() + step * 7);
	  }, function(start, end) {
	    return (end - start) / durationWeek;
	  });
	}

	var utcSunday = utcWeekday(0);
	var utcMonday = utcWeekday(1);
	var utcTuesday = utcWeekday(2);
	var utcWednesday = utcWeekday(3);
	var utcThursday = utcWeekday(4);
	var utcFriday = utcWeekday(5);
	var utcSaturday = utcWeekday(6);

	var utcMonth = newInterval(function(date) {
	  date.setUTCDate(1);
	  date.setUTCHours(0, 0, 0, 0);
	}, function(date, step) {
	  date.setUTCMonth(date.getUTCMonth() + step);
	}, function(start, end) {
	  return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
	}, function(date) {
	  return date.getUTCMonth();
	});

	var utcYear = newInterval(function(date) {
	  date.setUTCMonth(0, 1);
	  date.setUTCHours(0, 0, 0, 0);
	}, function(date, step) {
	  date.setUTCFullYear(date.getUTCFullYear() + step);
	}, function(start, end) {
	  return end.getUTCFullYear() - start.getUTCFullYear();
	}, function(date) {
	  return date.getUTCFullYear();
	});

	// An optimized implementation for this simple case.
	utcYear.every = function(k) {
	  return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
	    date.setUTCFullYear(Math.floor(date.getUTCFullYear() / k) * k);
	    date.setUTCMonth(0, 1);
	    date.setUTCHours(0, 0, 0, 0);
	  }, function(date, step) {
	    date.setUTCFullYear(date.getUTCFullYear() + step * k);
	  });
	};

	function localDate(d) {
	  if (0 <= d.y && d.y < 100) {
	    var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
	    date.setFullYear(d.y);
	    return date;
	  }
	  return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
	}

	function utcDate(d) {
	  if (0 <= d.y && d.y < 100) {
	    var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
	    date.setUTCFullYear(d.y);
	    return date;
	  }
	  return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
	}

	function newYear(y) {
	  return {y: y, m: 0, d: 1, H: 0, M: 0, S: 0, L: 0};
	}

	function formatLocale$1(locale) {
	  var locale_dateTime = locale.dateTime,
	      locale_date = locale.date,
	      locale_time = locale.time,
	      locale_periods = locale.periods,
	      locale_weekdays = locale.days,
	      locale_shortWeekdays = locale.shortDays,
	      locale_months = locale.months,
	      locale_shortMonths = locale.shortMonths;

	  var periodRe = formatRe(locale_periods),
	      periodLookup = formatLookup(locale_periods),
	      weekdayRe = formatRe(locale_weekdays),
	      weekdayLookup = formatLookup(locale_weekdays),
	      shortWeekdayRe = formatRe(locale_shortWeekdays),
	      shortWeekdayLookup = formatLookup(locale_shortWeekdays),
	      monthRe = formatRe(locale_months),
	      monthLookup = formatLookup(locale_months),
	      shortMonthRe = formatRe(locale_shortMonths),
	      shortMonthLookup = formatLookup(locale_shortMonths);

	  var formats = {
	    "a": formatShortWeekday,
	    "A": formatWeekday,
	    "b": formatShortMonth,
	    "B": formatMonth,
	    "c": null,
	    "d": formatDayOfMonth,
	    "e": formatDayOfMonth,
	    "f": formatMicroseconds,
	    "H": formatHour24,
	    "I": formatHour12,
	    "j": formatDayOfYear,
	    "L": formatMilliseconds,
	    "m": formatMonthNumber,
	    "M": formatMinutes,
	    "p": formatPeriod,
	    "Q": formatUnixTimestamp,
	    "s": formatUnixTimestampSeconds,
	    "S": formatSeconds,
	    "u": formatWeekdayNumberMonday,
	    "U": formatWeekNumberSunday,
	    "V": formatWeekNumberISO,
	    "w": formatWeekdayNumberSunday,
	    "W": formatWeekNumberMonday,
	    "x": null,
	    "X": null,
	    "y": formatYear,
	    "Y": formatFullYear,
	    "Z": formatZone,
	    "%": formatLiteralPercent
	  };

	  var utcFormats = {
	    "a": formatUTCShortWeekday,
	    "A": formatUTCWeekday,
	    "b": formatUTCShortMonth,
	    "B": formatUTCMonth,
	    "c": null,
	    "d": formatUTCDayOfMonth,
	    "e": formatUTCDayOfMonth,
	    "f": formatUTCMicroseconds,
	    "H": formatUTCHour24,
	    "I": formatUTCHour12,
	    "j": formatUTCDayOfYear,
	    "L": formatUTCMilliseconds,
	    "m": formatUTCMonthNumber,
	    "M": formatUTCMinutes,
	    "p": formatUTCPeriod,
	    "Q": formatUnixTimestamp,
	    "s": formatUnixTimestampSeconds,
	    "S": formatUTCSeconds,
	    "u": formatUTCWeekdayNumberMonday,
	    "U": formatUTCWeekNumberSunday,
	    "V": formatUTCWeekNumberISO,
	    "w": formatUTCWeekdayNumberSunday,
	    "W": formatUTCWeekNumberMonday,
	    "x": null,
	    "X": null,
	    "y": formatUTCYear,
	    "Y": formatUTCFullYear,
	    "Z": formatUTCZone,
	    "%": formatLiteralPercent
	  };

	  var parses = {
	    "a": parseShortWeekday,
	    "A": parseWeekday,
	    "b": parseShortMonth,
	    "B": parseMonth,
	    "c": parseLocaleDateTime,
	    "d": parseDayOfMonth,
	    "e": parseDayOfMonth,
	    "f": parseMicroseconds,
	    "H": parseHour24,
	    "I": parseHour24,
	    "j": parseDayOfYear,
	    "L": parseMilliseconds,
	    "m": parseMonthNumber,
	    "M": parseMinutes,
	    "p": parsePeriod,
	    "Q": parseUnixTimestamp,
	    "s": parseUnixTimestampSeconds,
	    "S": parseSeconds,
	    "u": parseWeekdayNumberMonday,
	    "U": parseWeekNumberSunday,
	    "V": parseWeekNumberISO,
	    "w": parseWeekdayNumberSunday,
	    "W": parseWeekNumberMonday,
	    "x": parseLocaleDate,
	    "X": parseLocaleTime,
	    "y": parseYear,
	    "Y": parseFullYear,
	    "Z": parseZone,
	    "%": parseLiteralPercent
	  };

	  // These recursive directive definitions must be deferred.
	  formats.x = newFormat(locale_date, formats);
	  formats.X = newFormat(locale_time, formats);
	  formats.c = newFormat(locale_dateTime, formats);
	  utcFormats.x = newFormat(locale_date, utcFormats);
	  utcFormats.X = newFormat(locale_time, utcFormats);
	  utcFormats.c = newFormat(locale_dateTime, utcFormats);

	  function newFormat(specifier, formats) {
	    return function(date) {
	      var string = [],
	          i = -1,
	          j = 0,
	          n = specifier.length,
	          c,
	          pad,
	          format;

	      if (!(date instanceof Date)) date = new Date(+date);

	      while (++i < n) {
	        if (specifier.charCodeAt(i) === 37) {
	          string.push(specifier.slice(j, i));
	          if ((pad = pads[c = specifier.charAt(++i)]) != null) c = specifier.charAt(++i);
	          else pad = c === "e" ? " " : "0";
	          if (format = formats[c]) c = format(date, pad);
	          string.push(c);
	          j = i + 1;
	        }
	      }

	      string.push(specifier.slice(j, i));
	      return string.join("");
	    };
	  }

	  function newParse(specifier, newDate) {
	    return function(string) {
	      var d = newYear(1900),
	          i = parseSpecifier(d, specifier, string += "", 0),
	          week, day$1;
	      if (i != string.length) return null;

	      // If a UNIX timestamp is specified, return it.
	      if ("Q" in d) return new Date(d.Q);

	      // The am-pm flag is 0 for AM, and 1 for PM.
	      if ("p" in d) d.H = d.H % 12 + d.p * 12;

	      // Convert day-of-week and week-of-year to day-of-year.
	      if ("V" in d) {
	        if (d.V < 1 || d.V > 53) return null;
	        if (!("w" in d)) d.w = 1;
	        if ("Z" in d) {
	          week = utcDate(newYear(d.y)), day$1 = week.getUTCDay();
	          week = day$1 > 4 || day$1 === 0 ? utcMonday.ceil(week) : utcMonday(week);
	          week = utcDay.offset(week, (d.V - 1) * 7);
	          d.y = week.getUTCFullYear();
	          d.m = week.getUTCMonth();
	          d.d = week.getUTCDate() + (d.w + 6) % 7;
	        } else {
	          week = newDate(newYear(d.y)), day$1 = week.getDay();
	          week = day$1 > 4 || day$1 === 0 ? monday.ceil(week) : monday(week);
	          week = day.offset(week, (d.V - 1) * 7);
	          d.y = week.getFullYear();
	          d.m = week.getMonth();
	          d.d = week.getDate() + (d.w + 6) % 7;
	        }
	      } else if ("W" in d || "U" in d) {
	        if (!("w" in d)) d.w = "u" in d ? d.u % 7 : "W" in d ? 1 : 0;
	        day$1 = "Z" in d ? utcDate(newYear(d.y)).getUTCDay() : newDate(newYear(d.y)).getDay();
	        d.m = 0;
	        d.d = "W" in d ? (d.w + 6) % 7 + d.W * 7 - (day$1 + 5) % 7 : d.w + d.U * 7 - (day$1 + 6) % 7;
	      }

	      // If a time zone is specified, all fields are interpreted as UTC and then
	      // offset according to the specified time zone.
	      if ("Z" in d) {
	        d.H += d.Z / 100 | 0;
	        d.M += d.Z % 100;
	        return utcDate(d);
	      }

	      // Otherwise, all fields are in local time.
	      return newDate(d);
	    };
	  }

	  function parseSpecifier(d, specifier, string, j) {
	    var i = 0,
	        n = specifier.length,
	        m = string.length,
	        c,
	        parse;

	    while (i < n) {
	      if (j >= m) return -1;
	      c = specifier.charCodeAt(i++);
	      if (c === 37) {
	        c = specifier.charAt(i++);
	        parse = parses[c in pads ? specifier.charAt(i++) : c];
	        if (!parse || ((j = parse(d, string, j)) < 0)) return -1;
	      } else if (c != string.charCodeAt(j++)) {
	        return -1;
	      }
	    }

	    return j;
	  }

	  function parsePeriod(d, string, i) {
	    var n = periodRe.exec(string.slice(i));
	    return n ? (d.p = periodLookup[n[0].toLowerCase()], i + n[0].length) : -1;
	  }

	  function parseShortWeekday(d, string, i) {
	    var n = shortWeekdayRe.exec(string.slice(i));
	    return n ? (d.w = shortWeekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
	  }

	  function parseWeekday(d, string, i) {
	    var n = weekdayRe.exec(string.slice(i));
	    return n ? (d.w = weekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
	  }

	  function parseShortMonth(d, string, i) {
	    var n = shortMonthRe.exec(string.slice(i));
	    return n ? (d.m = shortMonthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
	  }

	  function parseMonth(d, string, i) {
	    var n = monthRe.exec(string.slice(i));
	    return n ? (d.m = monthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
	  }

	  function parseLocaleDateTime(d, string, i) {
	    return parseSpecifier(d, locale_dateTime, string, i);
	  }

	  function parseLocaleDate(d, string, i) {
	    return parseSpecifier(d, locale_date, string, i);
	  }

	  function parseLocaleTime(d, string, i) {
	    return parseSpecifier(d, locale_time, string, i);
	  }

	  function formatShortWeekday(d) {
	    return locale_shortWeekdays[d.getDay()];
	  }

	  function formatWeekday(d) {
	    return locale_weekdays[d.getDay()];
	  }

	  function formatShortMonth(d) {
	    return locale_shortMonths[d.getMonth()];
	  }

	  function formatMonth(d) {
	    return locale_months[d.getMonth()];
	  }

	  function formatPeriod(d) {
	    return locale_periods[+(d.getHours() >= 12)];
	  }

	  function formatUTCShortWeekday(d) {
	    return locale_shortWeekdays[d.getUTCDay()];
	  }

	  function formatUTCWeekday(d) {
	    return locale_weekdays[d.getUTCDay()];
	  }

	  function formatUTCShortMonth(d) {
	    return locale_shortMonths[d.getUTCMonth()];
	  }

	  function formatUTCMonth(d) {
	    return locale_months[d.getUTCMonth()];
	  }

	  function formatUTCPeriod(d) {
	    return locale_periods[+(d.getUTCHours() >= 12)];
	  }

	  return {
	    format: function(specifier) {
	      var f = newFormat(specifier += "", formats);
	      f.toString = function() { return specifier; };
	      return f;
	    },
	    parse: function(specifier) {
	      var p = newParse(specifier += "", localDate);
	      p.toString = function() { return specifier; };
	      return p;
	    },
	    utcFormat: function(specifier) {
	      var f = newFormat(specifier += "", utcFormats);
	      f.toString = function() { return specifier; };
	      return f;
	    },
	    utcParse: function(specifier) {
	      var p = newParse(specifier, utcDate);
	      p.toString = function() { return specifier; };
	      return p;
	    }
	  };
	}

	var pads = {"-": "", "_": " ", "0": "0"},
	    numberRe = /^\s*\d+/, // note: ignores next directive
	    percentRe = /^%/,
	    requoteRe = /[\\^$*+?|[\]().{}]/g;

	function pad(value, fill, width) {
	  var sign = value < 0 ? "-" : "",
	      string = (sign ? -value : value) + "",
	      length = string.length;
	  return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
	}

	function requote(s) {
	  return s.replace(requoteRe, "\\$&");
	}

	function formatRe(names) {
	  return new RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
	}

	function formatLookup(names) {
	  var map = {}, i = -1, n = names.length;
	  while (++i < n) map[names[i].toLowerCase()] = i;
	  return map;
	}

	function parseWeekdayNumberSunday(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 1));
	  return n ? (d.w = +n[0], i + n[0].length) : -1;
	}

	function parseWeekdayNumberMonday(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 1));
	  return n ? (d.u = +n[0], i + n[0].length) : -1;
	}

	function parseWeekNumberSunday(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 2));
	  return n ? (d.U = +n[0], i + n[0].length) : -1;
	}

	function parseWeekNumberISO(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 2));
	  return n ? (d.V = +n[0], i + n[0].length) : -1;
	}

	function parseWeekNumberMonday(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 2));
	  return n ? (d.W = +n[0], i + n[0].length) : -1;
	}

	function parseFullYear(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 4));
	  return n ? (d.y = +n[0], i + n[0].length) : -1;
	}

	function parseYear(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 2));
	  return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
	}

	function parseZone(d, string, i) {
	  var n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(string.slice(i, i + 6));
	  return n ? (d.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), i + n[0].length) : -1;
	}

	function parseMonthNumber(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 2));
	  return n ? (d.m = n[0] - 1, i + n[0].length) : -1;
	}

	function parseDayOfMonth(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 2));
	  return n ? (d.d = +n[0], i + n[0].length) : -1;
	}

	function parseDayOfYear(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 3));
	  return n ? (d.m = 0, d.d = +n[0], i + n[0].length) : -1;
	}

	function parseHour24(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 2));
	  return n ? (d.H = +n[0], i + n[0].length) : -1;
	}

	function parseMinutes(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 2));
	  return n ? (d.M = +n[0], i + n[0].length) : -1;
	}

	function parseSeconds(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 2));
	  return n ? (d.S = +n[0], i + n[0].length) : -1;
	}

	function parseMilliseconds(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 3));
	  return n ? (d.L = +n[0], i + n[0].length) : -1;
	}

	function parseMicroseconds(d, string, i) {
	  var n = numberRe.exec(string.slice(i, i + 6));
	  return n ? (d.L = Math.floor(n[0] / 1000), i + n[0].length) : -1;
	}

	function parseLiteralPercent(d, string, i) {
	  var n = percentRe.exec(string.slice(i, i + 1));
	  return n ? i + n[0].length : -1;
	}

	function parseUnixTimestamp(d, string, i) {
	  var n = numberRe.exec(string.slice(i));
	  return n ? (d.Q = +n[0], i + n[0].length) : -1;
	}

	function parseUnixTimestampSeconds(d, string, i) {
	  var n = numberRe.exec(string.slice(i));
	  return n ? (d.Q = (+n[0]) * 1000, i + n[0].length) : -1;
	}

	function formatDayOfMonth(d, p) {
	  return pad(d.getDate(), p, 2);
	}

	function formatHour24(d, p) {
	  return pad(d.getHours(), p, 2);
	}

	function formatHour12(d, p) {
	  return pad(d.getHours() % 12 || 12, p, 2);
	}

	function formatDayOfYear(d, p) {
	  return pad(1 + day.count(year(d), d), p, 3);
	}

	function formatMilliseconds(d, p) {
	  return pad(d.getMilliseconds(), p, 3);
	}

	function formatMicroseconds(d, p) {
	  return formatMilliseconds(d, p) + "000";
	}

	function formatMonthNumber(d, p) {
	  return pad(d.getMonth() + 1, p, 2);
	}

	function formatMinutes(d, p) {
	  return pad(d.getMinutes(), p, 2);
	}

	function formatSeconds(d, p) {
	  return pad(d.getSeconds(), p, 2);
	}

	function formatWeekdayNumberMonday(d) {
	  var day = d.getDay();
	  return day === 0 ? 7 : day;
	}

	function formatWeekNumberSunday(d, p) {
	  return pad(sunday.count(year(d), d), p, 2);
	}

	function formatWeekNumberISO(d, p) {
	  var day = d.getDay();
	  d = (day >= 4 || day === 0) ? thursday(d) : thursday.ceil(d);
	  return pad(thursday.count(year(d), d) + (year(d).getDay() === 4), p, 2);
	}

	function formatWeekdayNumberSunday(d) {
	  return d.getDay();
	}

	function formatWeekNumberMonday(d, p) {
	  return pad(monday.count(year(d), d), p, 2);
	}

	function formatYear(d, p) {
	  return pad(d.getFullYear() % 100, p, 2);
	}

	function formatFullYear(d, p) {
	  return pad(d.getFullYear() % 10000, p, 4);
	}

	function formatZone(d) {
	  var z = d.getTimezoneOffset();
	  return (z > 0 ? "-" : (z *= -1, "+"))
	      + pad(z / 60 | 0, "0", 2)
	      + pad(z % 60, "0", 2);
	}

	function formatUTCDayOfMonth(d, p) {
	  return pad(d.getUTCDate(), p, 2);
	}

	function formatUTCHour24(d, p) {
	  return pad(d.getUTCHours(), p, 2);
	}

	function formatUTCHour12(d, p) {
	  return pad(d.getUTCHours() % 12 || 12, p, 2);
	}

	function formatUTCDayOfYear(d, p) {
	  return pad(1 + utcDay.count(utcYear(d), d), p, 3);
	}

	function formatUTCMilliseconds(d, p) {
	  return pad(d.getUTCMilliseconds(), p, 3);
	}

	function formatUTCMicroseconds(d, p) {
	  return formatUTCMilliseconds(d, p) + "000";
	}

	function formatUTCMonthNumber(d, p) {
	  return pad(d.getUTCMonth() + 1, p, 2);
	}

	function formatUTCMinutes(d, p) {
	  return pad(d.getUTCMinutes(), p, 2);
	}

	function formatUTCSeconds(d, p) {
	  return pad(d.getUTCSeconds(), p, 2);
	}

	function formatUTCWeekdayNumberMonday(d) {
	  var dow = d.getUTCDay();
	  return dow === 0 ? 7 : dow;
	}

	function formatUTCWeekNumberSunday(d, p) {
	  return pad(utcSunday.count(utcYear(d), d), p, 2);
	}

	function formatUTCWeekNumberISO(d, p) {
	  var day = d.getUTCDay();
	  d = (day >= 4 || day === 0) ? utcThursday(d) : utcThursday.ceil(d);
	  return pad(utcThursday.count(utcYear(d), d) + (utcYear(d).getUTCDay() === 4), p, 2);
	}

	function formatUTCWeekdayNumberSunday(d) {
	  return d.getUTCDay();
	}

	function formatUTCWeekNumberMonday(d, p) {
	  return pad(utcMonday.count(utcYear(d), d), p, 2);
	}

	function formatUTCYear(d, p) {
	  return pad(d.getUTCFullYear() % 100, p, 2);
	}

	function formatUTCFullYear(d, p) {
	  return pad(d.getUTCFullYear() % 10000, p, 4);
	}

	function formatUTCZone() {
	  return "+0000";
	}

	function formatLiteralPercent() {
	  return "%";
	}

	function formatUnixTimestamp(d) {
	  return +d;
	}

	function formatUnixTimestampSeconds(d) {
	  return Math.floor(+d / 1000);
	}

	var locale$1;
	var timeFormat;
	var timeParse;
	var utcFormat;
	var utcParse;

	defaultLocale$1({
	  dateTime: "%x, %X",
	  date: "%-m/%-d/%Y",
	  time: "%-I:%M:%S %p",
	  periods: ["AM", "PM"],
	  days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
	  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
	  months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
	  shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
	});

	function defaultLocale$1(definition) {
	  locale$1 = formatLocale$1(definition);
	  timeFormat = locale$1.format;
	  timeParse = locale$1.parse;
	  utcFormat = locale$1.utcFormat;
	  utcParse = locale$1.utcParse;
	  return locale$1;
	}

	var isoSpecifier = "%Y-%m-%dT%H:%M:%S.%LZ";

	function formatIsoNative(date) {
	  return date.toISOString();
	}

	var formatIso = Date.prototype.toISOString
	    ? formatIsoNative
	    : utcFormat(isoSpecifier);

	function parseIsoNative(string) {
	  var date = new Date(string);
	  return isNaN(date) ? null : date;
	}

	var parseIso = +new Date("2000-01-01T00:00:00.000Z")
	    ? parseIsoNative
	    : utcParse(isoSpecifier);

	var obj;
	var NOTHING = typeof Symbol !== "undefined" ? Symbol("immer-nothing") : ( obj = {}, obj["immer-nothing"] = true, obj );
	var DRAFTABLE = typeof Symbol !== "undefined" && Symbol.for ? Symbol.for("immer-draftable") : "__$immer_draftable";
	var DRAFT_STATE = typeof Symbol !== "undefined" && Symbol.for ? Symbol.for("immer-state") : "__$immer_state";
	function isDraft(value) {
	  return !!value && !!value[DRAFT_STATE];
	}
	function isDraftable(value) {
	  if (!value || typeof value !== "object") { return false; }
	  if (Array.isArray(value)) { return true; }
	  var proto = Object.getPrototypeOf(value);
	  if (!proto || proto === Object.prototype) { return true; }
	  return !!value[DRAFTABLE] || !!value.constructor[DRAFTABLE];
	}
	var assign$1 = Object.assign || function assign(target, value) {
	  for (var key in value) {
	    if (has(value, key)) {
	      target[key] = value[key];
	    }
	  }

	  return target;
	};
	var ownKeys = typeof Reflect !== "undefined" && Reflect.ownKeys ? Reflect.ownKeys : typeof Object.getOwnPropertySymbols !== "undefined" ? function (obj) { return Object.getOwnPropertyNames(obj).concat(Object.getOwnPropertySymbols(obj)); } : Object.getOwnPropertyNames;
	function shallowCopy(base, invokeGetters) {
	  if ( invokeGetters === void 0 ) invokeGetters = false;

	  if (Array.isArray(base)) { return base.slice(); }
	  var clone = Object.create(Object.getPrototypeOf(base));
	  ownKeys(base).forEach(function (key) {
	    if (key === DRAFT_STATE) {
	      return; // Never copy over draft state.
	    }

	    var desc = Object.getOwnPropertyDescriptor(base, key);
	    var value = desc.value;

	    if (desc.get) {
	      if (!invokeGetters) {
	        throw new Error("Immer drafts cannot have computed properties");
	      }

	      value = desc.get.call(base);
	    }

	    if (desc.enumerable) {
	      clone[key] = value;
	    } else {
	      Object.defineProperty(clone, key, {
	        value: value,
	        writable: true,
	        configurable: true
	      });
	    }
	  });
	  return clone;
	}
	function each(value, cb) {
	  if (Array.isArray(value)) {
	    for (var i = 0; i < value.length; i++) { cb(i, value[i], value); }
	  } else {
	    ownKeys(value).forEach(function (key) { return cb(key, value[key], value); });
	  }
	}
	function isEnumerable(base, prop) {
	  var desc = Object.getOwnPropertyDescriptor(base, prop);
	  return !!desc && desc.enumerable;
	}
	function has(thing, prop) {
	  return Object.prototype.hasOwnProperty.call(thing, prop);
	}
	function is(x, y) {
	  // From: https://github.com/facebook/fbjs/blob/c69904a511b900266935168223063dd8772dfc40/packages/fbjs/src/core/shallowEqual.js
	  if (x === y) {
	    return x !== 0 || 1 / x === 1 / y;
	  } else {
	    return x !== x && y !== y;
	  }
	}

	/** Each scope represents a `produce` call. */

	var ImmerScope = function ImmerScope(parent) {
	  this.drafts = [];
	  this.parent = parent; // Whenever the modified draft contains a draft from another scope, we
	  // need to prevent auto-freezing so the unowned draft can be finalized.

	  this.canAutoFreeze = true; // To avoid prototype lookups:

	  this.patches = null;
	};

	ImmerScope.prototype.usePatches = function usePatches (patchListener) {
	  if (patchListener) {
	    this.patches = [];
	    this.inversePatches = [];
	    this.patchListener = patchListener;
	  }
	};

	ImmerScope.prototype.revoke = function revoke$1 () {
	  this.leave();
	  this.drafts.forEach(revoke);
	  this.drafts = null; // Make draft-related methods throw.
	};

	ImmerScope.prototype.leave = function leave () {
	  if (this === ImmerScope.current) {
	    ImmerScope.current = this.parent;
	  }
	};
	ImmerScope.current = null;

	ImmerScope.enter = function () {
	  return this.current = new ImmerScope(this.current);
	};

	function revoke(draft) {
	  draft[DRAFT_STATE].revoke();
	}

	// but share them all instead

	var descriptors = {};
	function willFinalize(scope, result, isReplaced) {
	  scope.drafts.forEach(function (draft) {
	    draft[DRAFT_STATE].finalizing = true;
	  });

	  if (!isReplaced) {
	    if (scope.patches) {
	      markChangesRecursively(scope.drafts[0]);
	    } // This is faster when we don't care about which attributes changed.


	    markChangesSweep(scope.drafts);
	  } // When a child draft is returned, look for changes.
	  else if (isDraft(result) && result[DRAFT_STATE].scope === scope) {
	      markChangesSweep(scope.drafts);
	    }
	}
	function createProxy(base, parent) {
	  var isArray = Array.isArray(base);
	  var draft = clonePotentialDraft(base);
	  each(draft, function (prop) {
	    proxyProperty(draft, prop, isArray || isEnumerable(base, prop));
	  }); // See "proxy.js" for property documentation.

	  var scope = parent ? parent.scope : ImmerScope.current;
	  var state = {
	    scope: scope,
	    modified: false,
	    finalizing: false,
	    // es5 only
	    finalized: false,
	    assigned: {},
	    parent: parent,
	    base: base,
	    draft: draft,
	    copy: null,
	    revoke: revoke$1,
	    revoked: false // es5 only

	  };
	  createHiddenProperty(draft, DRAFT_STATE, state);
	  scope.drafts.push(draft);
	  return draft;
	}

	function revoke$1() {
	  this.revoked = true;
	}

	function source(state) {
	  return state.copy || state.base;
	} // Access a property without creating an Immer draft.


	function peek(draft, prop) {
	  var state = draft[DRAFT_STATE];

	  if (state && !state.finalizing) {
	    state.finalizing = true;
	    var value = draft[prop];
	    state.finalizing = false;
	    return value;
	  }

	  return draft[prop];
	}

	function get(state, prop) {
	  assertUnrevoked(state);
	  var value = peek(source(state), prop);
	  if (state.finalizing) { return value; } // Create a draft if the value is unmodified.

	  if (value === peek(state.base, prop) && isDraftable(value)) {
	    prepareCopy(state);
	    return state.copy[prop] = createProxy(value, state);
	  }

	  return value;
	}

	function set(state, prop, value) {
	  assertUnrevoked(state);
	  state.assigned[prop] = true;

	  if (!state.modified) {
	    if (is(value, peek(source(state), prop))) { return; }
	    markChanged(state);
	    prepareCopy(state);
	  }

	  state.copy[prop] = value;
	}

	function markChanged(state) {
	  if (!state.modified) {
	    state.modified = true;
	    if (state.parent) { markChanged(state.parent); }
	  }
	}

	function prepareCopy(state) {
	  if (!state.copy) { state.copy = clonePotentialDraft(state.base); }
	}

	function clonePotentialDraft(base) {
	  var state = base && base[DRAFT_STATE];

	  if (state) {
	    state.finalizing = true;
	    var draft = shallowCopy(state.draft, true);
	    state.finalizing = false;
	    return draft;
	  }

	  return shallowCopy(base);
	}

	function proxyProperty(draft, prop, enumerable) {
	  var desc = descriptors[prop];

	  if (desc) {
	    desc.enumerable = enumerable;
	  } else {
	    descriptors[prop] = desc = {
	      configurable: true,
	      enumerable: enumerable,

	      get: function get$1() {
	        return get(this[DRAFT_STATE], prop);
	      },

	      set: function set$1(value) {
	        set(this[DRAFT_STATE], prop, value);
	      }

	    };
	  }

	  Object.defineProperty(draft, prop, desc);
	}

	function assertUnrevoked(state) {
	  if (state.revoked === true) { throw new Error("Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? " + JSON.stringify(source(state))); }
	} // This looks expensive, but only proxies are visited, and only objects without known changes are scanned.


	function markChangesSweep(drafts) {
	  // The natural order of drafts in the `scope` array is based on when they
	  // were accessed. By processing drafts in reverse natural order, we have a
	  // better chance of processing leaf nodes first. When a leaf node is known to
	  // have changed, we can avoid any traversal of its ancestor nodes.
	  for (var i = drafts.length - 1; i >= 0; i--) {
	    var state = drafts[i][DRAFT_STATE];

	    if (!state.modified) {
	      if (Array.isArray(state.base)) {
	        if (hasArrayChanges(state)) { markChanged(state); }
	      } else if (hasObjectChanges(state)) { markChanged(state); }
	    }
	  }
	}

	function markChangesRecursively(object) {
	  if (!object || typeof object !== "object") { return; }
	  var state = object[DRAFT_STATE];
	  if (!state) { return; }
	  var base = state.base;
	  var draft = state.draft;
	  var assigned = state.assigned;

	  if (!Array.isArray(object)) {
	    // Look for added keys.
	    Object.keys(draft).forEach(function (key) {
	      // The `undefined` check is a fast path for pre-existing keys.
	      if (base[key] === undefined && !has(base, key)) {
	        assigned[key] = true;
	        markChanged(state);
	      } else if (!assigned[key]) {
	        // Only untouched properties trigger recursion.
	        markChangesRecursively(draft[key]);
	      }
	    }); // Look for removed keys.

	    Object.keys(base).forEach(function (key) {
	      // The `undefined` check is a fast path for pre-existing keys.
	      if (draft[key] === undefined && !has(draft, key)) {
	        assigned[key] = false;
	        markChanged(state);
	      }
	    });
	  } else if (hasArrayChanges(state)) {
	    markChanged(state);
	    assigned.length = true;

	    if (draft.length < base.length) {
	      for (var i = draft.length; i < base.length; i++) { assigned[i] = false; }
	    } else {
	      for (var i$1 = base.length; i$1 < draft.length; i$1++) { assigned[i$1] = true; }
	    }

	    for (var i$2 = 0; i$2 < draft.length; i$2++) {
	      // Only untouched indices trigger recursion.
	      if (assigned[i$2] === undefined) { markChangesRecursively(draft[i$2]); }
	    }
	  }
	}

	function hasObjectChanges(state) {
	  var base = state.base;
	  var draft = state.draft; // Search for added keys and changed keys. Start at the back, because
	  // non-numeric keys are ordered by time of definition on the object.

	  var keys = Object.keys(draft);

	  for (var i = keys.length - 1; i >= 0; i--) {
	    var key = keys[i];
	    var baseValue = base[key]; // The `undefined` check is a fast path for pre-existing keys.

	    if (baseValue === undefined && !has(base, key)) {
	      return true;
	    } // Once a base key is deleted, future changes go undetected, because its
	    // descriptor is erased. This branch detects any missed changes.
	    else {
	        var value = draft[key];
	        var state$1 = value && value[DRAFT_STATE];

	        if (state$1 ? state$1.base !== baseValue : !is(value, baseValue)) {
	          return true;
	        }
	      }
	  } // At this point, no keys were added or changed.
	  // Compare key count to determine if keys were deleted.


	  return keys.length !== Object.keys(base).length;
	}

	function hasArrayChanges(state) {
	  var draft = state.draft;
	  if (draft.length !== state.base.length) { return true; } // See #116
	  // If we first shorten the length, our array interceptors will be removed.
	  // If after that new items are added, result in the same original length,
	  // those last items will have no intercepting property.
	  // So if there is no own descriptor on the last position, we know that items were removed and added
	  // N.B.: splice, unshift, etc only shift values around, but not prop descriptors, so we only have to check
	  // the last one

	  var descriptor = Object.getOwnPropertyDescriptor(draft, draft.length - 1); // descriptor can be null, but only for newly created sparse arrays, eg. new Array(10)

	  if (descriptor && !descriptor.get) { return true; } // For all other cases, we don't have to compare, as they would have been picked up by the index setters

	  return false;
	}

	function createHiddenProperty(target, prop, value) {
	  Object.defineProperty(target, prop, {
	    value: value,
	    enumerable: false,
	    writable: true
	  });
	}

	var legacyProxy = /*#__PURE__*/Object.freeze({
	    willFinalize: willFinalize,
	    createProxy: createProxy
	});

	function willFinalize$1() {}
	function createProxy$1(base, parent) {
	  var scope = parent ? parent.scope : ImmerScope.current;
	  var state = {
	    // Track which produce call this is associated with.
	    scope: scope,
	    // True for both shallow and deep changes.
	    modified: false,
	    // Used during finalization.
	    finalized: false,
	    // Track which properties have been assigned (true) or deleted (false).
	    assigned: {},
	    // The parent draft state.
	    parent: parent,
	    // The base state.
	    base: base,
	    // The base proxy.
	    draft: null,
	    // Any property proxies.
	    drafts: {},
	    // The base copy with any updated values.
	    copy: null,
	    // Called by the `produce` function.
	    revoke: null
	  };
	  var ref = Array.isArray(base) ? // [state] is used for arrays, to make sure the proxy is array-ish and not violate invariants,
	  // although state itself is an object
	  Proxy.revocable([state], arrayTraps) : Proxy.revocable(state, objectTraps);
	  var revoke = ref.revoke;
	  var proxy = ref.proxy;
	  state.draft = proxy;
	  state.revoke = revoke;
	  scope.drafts.push(proxy);
	  return proxy;
	}
	var objectTraps = {
	  get: get$1,

	  has: function has(target, prop) {
	    return prop in source$1(target);
	  },

	  ownKeys: function ownKeys(target) {
	    return Reflect.ownKeys(source$1(target));
	  },

	  set: set$1,
	  deleteProperty: deleteProperty,
	  getOwnPropertyDescriptor: getOwnPropertyDescriptor,

	  defineProperty: function defineProperty() {
	    throw new Error("Object.defineProperty() cannot be used on an Immer draft"); // prettier-ignore
	  },

	  getPrototypeOf: function getPrototypeOf(target) {
	    return Object.getPrototypeOf(target.base);
	  },

	  setPrototypeOf: function setPrototypeOf() {
	    throw new Error("Object.setPrototypeOf() cannot be used on an Immer draft"); // prettier-ignore
	  }

	};
	var arrayTraps = {};
	each(objectTraps, function (key, fn) {
	  arrayTraps[key] = function () {
	    arguments[0] = arguments[0][0];
	    return fn.apply(this, arguments);
	  };
	});

	arrayTraps.deleteProperty = function (state, prop) {
	  if (isNaN(parseInt(prop))) {
	    throw new Error("Immer only supports deleting array indices"); // prettier-ignore
	  }

	  return objectTraps.deleteProperty.call(this, state[0], prop);
	};

	arrayTraps.set = function (state, prop, value) {
	  if (prop !== "length" && isNaN(parseInt(prop))) {
	    throw new Error("Immer only supports setting array indices and the 'length' property"); // prettier-ignore
	  }

	  return objectTraps.set.call(this, state[0], prop, value);
	}; // returns the object we should be reading the current value from, which is base, until some change has been made


	function source$1(state) {
	  return state.copy || state.base;
	} // Access a property without creating an Immer draft.


	function peek$1(draft, prop) {
	  var state = draft[DRAFT_STATE];
	  var desc = Reflect.getOwnPropertyDescriptor(state ? source$1(state) : draft, prop);
	  return desc && desc.value;
	}

	function get$1(state, prop) {
	  if (prop === DRAFT_STATE) { return state; }
	  var drafts = state.drafts; // Check for existing draft in unmodified state.

	  if (!state.modified && has(drafts, prop)) {
	    return drafts[prop];
	  }

	  var value = source$1(state)[prop];

	  if (state.finalized || !isDraftable(value)) {
	    return value;
	  } // Check for existing draft in modified state.


	  if (state.modified) {
	    // Assigned values are never drafted. This catches any drafts we created, too.
	    if (value !== peek$1(state.base, prop)) { return value; } // Store drafts on the copy (when one exists).

	    drafts = state.copy;
	  }

	  return drafts[prop] = createProxy$1(value, state);
	}

	function set$1(state, prop, value) {
	  if (!state.modified) {
	    var baseValue = peek$1(state.base, prop); // Optimize based on value's truthiness. Truthy values are guaranteed to
	    // never be undefined, so we can avoid the `in` operator. Lastly, truthy
	    // values may be drafts, but falsy values are never drafts.

	    var isUnchanged = value ? is(baseValue, value) || value === state.drafts[prop] : is(baseValue, value) && prop in state.base;
	    if (isUnchanged) { return true; }
	    markChanged$1(state);
	  }

	  state.assigned[prop] = true;
	  state.copy[prop] = value;
	  return true;
	}

	function deleteProperty(state, prop) {
	  // The `undefined` check is a fast path for pre-existing keys.
	  if (peek$1(state.base, prop) !== undefined || prop in state.base) {
	    state.assigned[prop] = false;
	    markChanged$1(state);
	  }

	  if (state.copy) { delete state.copy[prop]; }
	  return true;
	} // Note: We never coerce `desc.value` into an Immer draft, because we can't make
	// the same guarantee in ES5 mode.


	function getOwnPropertyDescriptor(state, prop) {
	  var owner = source$1(state);
	  var desc = Reflect.getOwnPropertyDescriptor(owner, prop);

	  if (desc) {
	    desc.writable = true;
	    desc.configurable = !Array.isArray(owner) || prop !== "length";
	  }

	  return desc;
	}

	function markChanged$1(state) {
	  if (!state.modified) {
	    state.modified = true;
	    state.copy = assign$1(shallowCopy(state.base), state.drafts);
	    state.drafts = null;
	    if (state.parent) { markChanged$1(state.parent); }
	  }
	}

	var modernProxy = /*#__PURE__*/Object.freeze({
	    willFinalize: willFinalize$1,
	    createProxy: createProxy$1
	});

	function generatePatches(state, basePath, patches, inversePatches) {
	  Array.isArray(state.base) ? generateArrayPatches(state, basePath, patches, inversePatches) : generateObjectPatches(state, basePath, patches, inversePatches);
	}

	function generateArrayPatches(state, basePath, patches, inversePatches) {
	  var assign, assign$1;

	  var base = state.base;
	  var copy = state.copy;
	  var assigned = state.assigned; // Reduce complexity by ensuring `base` is never longer.

	  if (copy.length < base.length) {
	    (assign = [copy, base], base = assign[0], copy = assign[1]);
	    (assign$1 = [inversePatches, patches], patches = assign$1[0], inversePatches = assign$1[1]);
	  }

	  var delta = copy.length - base.length; // Find the first replaced index.

	  var start = 0;

	  while (base[start] === copy[start] && start < base.length) {
	    ++start;
	  } // Find the last replaced index. Search from the end to optimize splice patches.


	  var end = base.length;

	  while (end > start && base[end - 1] === copy[end + delta - 1]) {
	    --end;
	  } // Process replaced indices.


	  for (var i = start; i < end; ++i) {
	    if (assigned[i] && copy[i] !== base[i]) {
	      var path = basePath.concat([i]);
	      patches.push({
	        op: "replace",
	        path: path,
	        value: copy[i]
	      });
	      inversePatches.push({
	        op: "replace",
	        path: path,
	        value: base[i]
	      });
	    }
	  }

	  var useRemove = end != base.length;
	  var replaceCount = patches.length; // Process added indices.

	  for (var i$1 = end + delta - 1; i$1 >= end; --i$1) {
	    var path$1 = basePath.concat([i$1]);
	    patches[replaceCount + i$1 - end] = {
	      op: "add",
	      path: path$1,
	      value: copy[i$1]
	    };

	    if (useRemove) {
	      inversePatches.push({
	        op: "remove",
	        path: path$1
	      });
	    }
	  } // One "replace" patch reverses all non-splicing "add" patches.


	  if (!useRemove) {
	    inversePatches.push({
	      op: "replace",
	      path: basePath.concat(["length"]),
	      value: base.length
	    });
	  }
	}

	function generateObjectPatches(state, basePath, patches, inversePatches) {
	  var base = state.base;
	  var copy = state.copy;
	  each(state.assigned, function (key, assignedValue) {
	    var origValue = base[key];
	    var value = copy[key];
	    var op = !assignedValue ? "remove" : key in base ? "replace" : "add";
	    if (origValue === value && op === "replace") { return; }
	    var path = basePath.concat(key);
	    patches.push(op === "remove" ? {
	      op: op,
	      path: path
	    } : {
	      op: op,
	      path: path,
	      value: value
	    });
	    inversePatches.push(op === "add" ? {
	      op: "remove",
	      path: path
	    } : op === "remove" ? {
	      op: "add",
	      path: path,
	      value: origValue
	    } : {
	      op: "replace",
	      path: path,
	      value: origValue
	    });
	  });
	}

	function applyPatches(draft, patches) {
	  for (var i = 0; i < patches.length; i++) {
	    var patch = patches[i];
	    var path = patch.path;

	    if (path.length === 0 && patch.op === "replace") {
	      draft = patch.value;
	    } else {
	      var base = draft;

	      for (var i$1 = 0; i$1 < path.length - 1; i$1++) {
	        base = base[path[i$1]];
	        if (!base || typeof base !== "object") { throw new Error("Cannot apply patch, path doesn't resolve: " + path.join("/")); } // prettier-ignore
	      }

	      var key = path[path.length - 1];

	      switch (patch.op) {
	        case "replace":
	          base[key] = patch.value;
	          break;

	        case "add":
	          if (Array.isArray(base)) {
	            // TODO: support "foo/-" paths for appending to an array
	            base.splice(key, 0, patch.value);
	          } else {
	            base[key] = patch.value;
	          }

	          break;

	        case "remove":
	          if (Array.isArray(base)) {
	            base.splice(key, 1);
	          } else {
	            delete base[key];
	          }

	          break;

	        default:
	          throw new Error("Unsupported patch operation: " + patch.op);
	      }
	    }
	  }

	  return draft;
	}

	function verifyMinified() {}

	var configDefaults = {
	  useProxies: typeof Proxy !== "undefined" && typeof Reflect !== "undefined",
	  autoFreeze: typeof process !== "undefined" ? process.env.NODE_ENV !== "production" : verifyMinified.name === "verifyMinified",
	  onAssign: null,
	  onDelete: null,
	  onCopy: null
	};
	var Immer = function Immer(config) {
	  assign$1(this, configDefaults, config);
	  this.setUseProxies(this.useProxies);
	  this.produce = this.produce.bind(this);
	};

	Immer.prototype.produce = function produce (base, recipe, patchListener) {
	    var this$1 = this;

	  // curried invocation
	  if (typeof base === "function" && typeof recipe !== "function") {
	    var defaultBase = recipe;
	    recipe = base;
	    var self = this;
	    return function curriedProduce(base) {
	        var this$1 = this;
	        if ( base === void 0 ) base = defaultBase;
	        var args = [], len = arguments.length - 1;
	        while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

	      return self.produce(base, function (draft) { return recipe.call.apply(recipe, [ this$1, draft ].concat( args )); }); // prettier-ignore
	    };
	  } // prettier-ignore


	  {
	    if (typeof recipe !== "function") {
	      throw new Error("The first or second argument to `produce` must be a function");
	    }

	    if (patchListener !== undefined && typeof patchListener !== "function") {
	      throw new Error("The third argument to `produce` must be a function or undefined");
	    }
	  }
	  var result; // Only plain objects, arrays, and "immerable classes" are drafted.

	  if (isDraftable(base)) {
	    var scope = ImmerScope.enter();
	    var proxy = this.createProxy(base);
	    var hasError = true;

	    try {
	      result = recipe(proxy);
	      hasError = false;
	    } finally {
	      // finally instead of catch + rethrow better preserves original stack
	      if (hasError) { scope.revoke(); }else { scope.leave(); }
	    }

	    if (result instanceof Promise) {
	      return result.then(function (result) {
	        scope.usePatches(patchListener);
	        return this$1.processResult(result, scope);
	      }, function (error) {
	        scope.revoke();
	        throw error;
	      });
	    }

	    scope.usePatches(patchListener);
	    return this.processResult(result, scope);
	  } else {
	    result = recipe(base);
	    if (result === undefined) { return base; }
	    return result !== NOTHING ? result : undefined;
	  }
	};

	Immer.prototype.createDraft = function createDraft (base) {
	  if (!isDraftable(base)) {
	    throw new Error("First argument to `createDraft` must be a plain object, an array, or an immerable object"); // prettier-ignore
	  }

	  var scope = ImmerScope.enter();
	  var proxy = this.createProxy(base);
	  proxy[DRAFT_STATE].isManual = true;
	  scope.leave();
	  return proxy;
	};

	Immer.prototype.finishDraft = function finishDraft (draft, patchListener) {
	  var state = draft && draft[DRAFT_STATE];

	  if (!state || !state.isManual) {
	    throw new Error("First argument to `finishDraft` must be a draft returned by `createDraft`"); // prettier-ignore
	  }

	  if (state.finalized) {
	    throw new Error("The given draft is already finalized"); // prettier-ignore
	  }

	  var scope = state.scope;
	  scope.usePatches(patchListener);
	  return this.processResult(undefined, scope);
	};

	Immer.prototype.setAutoFreeze = function setAutoFreeze (value) {
	  this.autoFreeze = value;
	};

	Immer.prototype.setUseProxies = function setUseProxies (value) {
	  this.useProxies = value;
	  assign$1(this, value ? modernProxy : legacyProxy);
	};

	Immer.prototype.applyPatches = function applyPatches$1 (base, patches) {
	  // Mutate the base state when a draft is passed.
	  if (isDraft(base)) {
	    return applyPatches(base, patches);
	  } // Otherwise, produce a copy of the base state.


	  return this.produce(base, function (draft) { return applyPatches(draft, patches); });
	};
	/** @internal */


	Immer.prototype.processResult = function processResult (result, scope) {
	  var baseDraft = scope.drafts[0];
	  var isReplaced = result !== undefined && result !== baseDraft;
	  this.willFinalize(scope, result, isReplaced);

	  if (isReplaced) {
	    if (baseDraft[DRAFT_STATE].modified) {
	      scope.revoke();
	      throw new Error("An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft."); // prettier-ignore
	    }

	    if (isDraftable(result)) {
	      // Finalize the result in case it contains (or is) a subset of the draft.
	      result = this.finalize(result, null, scope);
	    }

	    if (scope.patches) {
	      scope.patches.push({
	        op: "replace",
	        path: [],
	        value: result
	      });
	      scope.inversePatches.push({
	        op: "replace",
	        path: [],
	        value: baseDraft[DRAFT_STATE].base
	      });
	    }
	  } else {
	    // Finalize the base draft.
	    result = this.finalize(baseDraft, [], scope);
	  }

	  scope.revoke();

	  if (scope.patches) {
	    scope.patchListener(scope.patches, scope.inversePatches);
	  }

	  return result !== NOTHING ? result : undefined;
	};
	/**
	 * @internal
	 * Finalize a draft, returning either the unmodified base state or a modified
	 * copy of the base state.
	 */


	Immer.prototype.finalize = function finalize (draft, path, scope) {
	    var this$1 = this;

	  var state = draft[DRAFT_STATE];

	  if (!state) {
	    if (Object.isFrozen(draft)) { return draft; }
	    return this.finalizeTree(draft, null, scope);
	  } // Never finalize drafts owned by another scope.


	  if (state.scope !== scope) {
	    return draft;
	  }

	  if (!state.modified) {
	    return state.base;
	  }

	  if (!state.finalized) {
	    state.finalized = true;
	    this.finalizeTree(state.draft, path, scope);

	    if (this.onDelete) {
	      // The `assigned` object is unreliable with ES5 drafts.
	      if (this.useProxies) {
	        var assigned = state.assigned;

	        for (var prop in assigned) {
	          if (!assigned[prop]) { this.onDelete(state, prop); }
	        }
	      } else {
	        var base = state.base;
	          var copy = state.copy;
	        each(base, function (prop) {
	          if (!has(copy, prop)) { this$1.onDelete(state, prop); }
	        });
	      }
	    }

	    if (this.onCopy) {
	      this.onCopy(state);
	    } // At this point, all descendants of `state.copy` have been finalized,
	    // so we can be sure that `scope.canAutoFreeze` is accurate.


	    if (this.autoFreeze && scope.canAutoFreeze) {
	      Object.freeze(state.copy);
	    }

	    if (path && scope.patches) {
	      generatePatches(state, path, scope.patches, scope.inversePatches);
	    }
	  }

	  return state.copy;
	};
	/**
	 * @internal
	 * Finalize all drafts in the given state tree.
	 */


	Immer.prototype.finalizeTree = function finalizeTree (root, rootPath, scope) {
	    var this$1 = this;

	  var state = root[DRAFT_STATE];

	  if (state) {
	    if (!this.useProxies) {
	      // Create the final copy, with added keys and without deleted keys.
	      state.copy = shallowCopy(state.draft, true);
	    }

	    root = state.copy;
	  }

	  var needPatches = !!rootPath && !!scope.patches;

	  var finalizeProperty = function (prop, value, parent) {
	    if (value === parent) {
	      throw Error("Immer forbids circular references");
	    } // In the `finalizeTree` method, only the `root` object may be a draft.


	    var isDraftProp = !!state && parent === root;

	    if (isDraft(value)) {
	      var path = isDraftProp && needPatches && !state.assigned[prop] ? rootPath.concat(prop) : null; // Drafts owned by `scope` are finalized here.

	      value = this$1.finalize(value, path, scope); // Drafts from another scope must prevent auto-freezing.

	      if (isDraft(value)) {
	        scope.canAutoFreeze = false;
	      } // Preserve non-enumerable properties.


	      if (Array.isArray(parent) || isEnumerable(parent, prop)) {
	        parent[prop] = value;
	      } else {
	        Object.defineProperty(parent, prop, {
	          value: value
	        });
	      } // Unchanged drafts are never passed to the `onAssign` hook.


	      if (isDraftProp && value === state.base[prop]) { return; }
	    } // Unchanged draft properties are ignored.
	    else if (isDraftProp && is(value, state.base[prop])) {
	        return;
	      } // Search new objects for unfinalized drafts. Frozen objects should never contain drafts.
	      else if (isDraftable(value) && !Object.isFrozen(value)) {
	          each(value, finalizeProperty);
	        }

	    if (isDraftProp && this$1.onAssign) {
	      this$1.onAssign(state, prop, value);
	    }
	  };

	  each(root, finalizeProperty);
	  return root;
	};

	var immer = new Immer();
	/**
	 * The `produce` function takes a value and a "recipe function" (whose
	 * return value often depends on the base state). The recipe function is
	 * free to mutate its first argument however it wants. All mutations are
	 * only ever applied to a __copy__ of the base state.
	 *
	 * Pass only a function to create a "curried producer" which relieves you
	 * from passing the recipe function every time.
	 *
	 * Only plain objects and arrays are made mutable. All other objects are
	 * considered uncopyable.
	 *
	 * Note: This function is __bound__ to its `Immer` instance.
	 *
	 * @param {any} base - the initial state
	 * @param {Function} producer - function that receives a proxy of the base state as first argument and which can be freely modified
	 * @param {Function} patchListener - optional function that will be called with all the patches produced here
	 * @returns {any} a new state, or the initial state if nothing was modified
	 */

	var produce = immer.produce;
	/**
	 * Pass true to automatically freeze all copies created by Immer.
	 *
	 * By default, auto-freezing is disabled in production.
	 */

	var setAutoFreeze = immer.setAutoFreeze.bind(immer);
	/**
	 * Pass true to use the ES2015 `Proxy` class when creating drafts, which is
	 * always faster than using ES5 proxies.
	 *
	 * By default, feature detection is used, so calling this is rarely necessary.
	 */

	var setUseProxies = immer.setUseProxies.bind(immer);
	/**
	 * Apply an array of Immer patches to the first argument.
	 *
	 * This function is a producer, which means copy-on-write is in effect.
	 */

	var applyPatches$1 = immer.applyPatches.bind(immer);
	/**
	 * Create an Immer draft from the given base state, which may be a draft itself.
	 * The draft can be modified until you finalize it with the `finishDraft` function.
	 */

	var createDraft = immer.createDraft.bind(immer);
	/**
	 * Finalize an Immer draft from a `createDraft` call, returning the base state
	 * (if no changes were made) or a modified copy. The draft must *not* be
	 * mutated afterwards.
	 *
	 * Pass a function as the 2nd argument to generate Immer patches based on the
	 * changes that were made.
	 */

	var finishDraft = immer.finishDraft.bind(immer);

	function isColumnOriented (data) {
	  if (data.constructor === Object) {
	    let columns = Object.keys(data).map(key => data[key]);
	    return columns.every(column => column.constructor === Array)
	  }

	  return false
	}

	function isRowOriented (data) {
	  if (data.constructor === Array) {
	    return data.every(row => row.constructor === Object)
	  }

	  return false
	}

	function isGeoJSON (data) {
	  return data.hasOwnProperty('data') && data.type === 'FeatureCollection'
	}

	function checkFormatColumnDataframe (data) {
	  checkFormat(data, checkRegularColumnName);
	}

	function checkFormatInternal (data) {
	  checkFormat(data, checkInternalDataColumnName);
	}

	function checkFormat (data, columnNameChecker) {
	  let dataLength = null;

	  for (let columnName in data) {
	    columnNameChecker(columnName);
	    let column = data[columnName];

	    dataLength = dataLength || column.length;

	    if (dataLength !== column.length) {
	      throw new Error('Invalid data: columns must be of same length')
	    }
	  }
	}

	function checkRegularColumnName (columnName) {
	  if (columnName.match(forbiddenChars)) {
	    throw new Error(`Invalid column name '${columnName}': '$' and '/' are not allowed'`)
	  }
	}

	const forbiddenChars = /[/$]/;

	function checkInternalDataColumnName (columnName) {
	  if (!['$index', '$geometry', '$grouped'].includes(columnName)) {
	    checkRegularColumnName(columnName);
	  }
	}

	function getDataLength (data) {
	  let firstKey = Object.keys(data)[0];
	  let firstColumn = data[firstKey];
	  return firstColumn.length
	}

	function convertRowToColumnDataframe (data) {
	  let columnDataFrame = initColumnDataframe(data);

	  for (let row of data) {
	    for (let key in row) {
	      columnDataFrame[key].push(row[key]);
	    }
	  }

	  return columnDataFrame
	}

	function initColumnDataframe (data) {
	  let firstRow = data[0];
	  let columnKeys = Object.keys(firstRow);
	  let columnDataFrame = {};

	  for (let key of columnKeys) {
	    columnDataFrame[key] = [];
	  }

	  return columnDataFrame
	}

	function parseGeoJSON (geojsonData) {
	  let geometryData = [];
	  let data = {};

	  let features = geojsonData.features;
	  let firstFeature = features[0];

	  if (firstFeature.hasOwnProperty('properties')) {
	    for (let columnName in firstFeature.properties) {
	      data[columnName] = [];
	    }
	  }

	  features.forEach(({ geometry, properties }) => {
	    geometryData.push(geometry);

	    for (let columnName in properties) { 
	      data[columnName].push(properties[columnName]); 
	    }
	  });

	  checkFormatColumnDataframe(data);

	  data.$geometry = geometryData;

	  return data
	}

	let currentId = -1;

	function id () {
	  currentId++;
	  return currentId
	}

	const methods = {
	  _setColumnDataframe (data) {
	    checkFormatColumnDataframe(data);
	    this._storeData(data);
	  },

	  _setRowDataframe (rowData) {
	    let columnData = convertRowToColumnDataframe(rowData);
	    this._setColumnDataframe(columnData);
	  },

	  _setGeoJSON (geojsonData) {
	    let data = parseGeoJSON(geojsonData);
	    this._storeData(data);
	  },

	  _setTransformableDataContainer (transformableDataContainer) {
	    let data = transformableDataContainer._data;
	    checkFormatInternal(data);
	    this._storeData(data);
	  },

	  _setGroup (group) {
	    let data = group.data;
	    checkFormatInternal(data);
	    this._storeData(data);
	  },

	  _storeData (data) {
	    this._data = produce(data, () => {});
	    this._length = getDataLength(data);

	    this._createIndexColumn();
	    this._calculateDomainsAndTypes();
	  },

	  _createIndexColumn () {
	    if (!this._data.hasOwnProperty('$index')) {
	      let indexColumn = new Array(this._length).fill(0).map(_ => id());

	      this._data = produce(this._data, draft => {
	        draft.$index = indexColumn;
	      });
	    }

	    for (let i = 0; i < this._length; i++) {
	      let index = this._data.$index[i];
	      this._indexToRowNumber[index] = i;
	    }
	  }
	};

	function dataLoadingMixin (targetClass) {
	  Object.assign(targetClass.prototype, methods);
	}

	function getDataType (value, throwError = true) {
	  switch (value.constructor) {
	    case Number:
	      return 'quantitative'
	    case String:
	      return 'categorical'
	    case Date:
	      return 'temporal'
	    case Object:
	      if (value.hasOwnProperty('type') && value.hasOwnProperty('coordinates')) {
	        return 'geometry'
	      } else {
	        if (Object.values(value).every(val => val.constructor === Array)) {
	          return 'nested'
	        } else {
	          throwIf(throwError);
	          break
	        }
	      }
	    case Array:
	      if (value.length === 2 && value[0].constructor === value[1].constructor) {
	        if (value[0].constructor === Number) {
	          return 'interval:quantitative'
	        } else if (value[0].constructor === Date) {
	          return 'interval:temporal'
	        } else {
	          throwIf(throwError);
	          break
	        }
	      } else {
	        throwIf(throwError);
	        break
	      }
	    default:
	      throwIf(throwError);
	      break
	  }
	}

	function throwIf (throwError) {
	  if (throwError) {
	    throw new Error('Invalid data')
	  } else {
	    return undefined
	  }
	}

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var helpers = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	/**
	 * @module helpers
	 */
	/**
	 * Earth Radius used with the Harvesine formula and approximates using a spherical (non-ellipsoid) Earth.
	 *
	 * @memberof helpers
	 * @type {number}
	 */
	exports.earthRadius = 6371008.8;
	/**
	 * Unit of measurement factors using a spherical (non-ellipsoid) earth radius.
	 *
	 * @memberof helpers
	 * @type {Object}
	 */
	exports.factors = {
	    centimeters: exports.earthRadius * 100,
	    centimetres: exports.earthRadius * 100,
	    degrees: exports.earthRadius / 111325,
	    feet: exports.earthRadius * 3.28084,
	    inches: exports.earthRadius * 39.370,
	    kilometers: exports.earthRadius / 1000,
	    kilometres: exports.earthRadius / 1000,
	    meters: exports.earthRadius,
	    metres: exports.earthRadius,
	    miles: exports.earthRadius / 1609.344,
	    millimeters: exports.earthRadius * 1000,
	    millimetres: exports.earthRadius * 1000,
	    nauticalmiles: exports.earthRadius / 1852,
	    radians: 1,
	    yards: exports.earthRadius / 1.0936,
	};
	/**
	 * Units of measurement factors based on 1 meter.
	 *
	 * @memberof helpers
	 * @type {Object}
	 */
	exports.unitsFactors = {
	    centimeters: 100,
	    centimetres: 100,
	    degrees: 1 / 111325,
	    feet: 3.28084,
	    inches: 39.370,
	    kilometers: 1 / 1000,
	    kilometres: 1 / 1000,
	    meters: 1,
	    metres: 1,
	    miles: 1 / 1609.344,
	    millimeters: 1000,
	    millimetres: 1000,
	    nauticalmiles: 1 / 1852,
	    radians: 1 / exports.earthRadius,
	    yards: 1 / 1.0936,
	};
	/**
	 * Area of measurement factors based on 1 square meter.
	 *
	 * @memberof helpers
	 * @type {Object}
	 */
	exports.areaFactors = {
	    acres: 0.000247105,
	    centimeters: 10000,
	    centimetres: 10000,
	    feet: 10.763910417,
	    inches: 1550.003100006,
	    kilometers: 0.000001,
	    kilometres: 0.000001,
	    meters: 1,
	    metres: 1,
	    miles: 3.86e-7,
	    millimeters: 1000000,
	    millimetres: 1000000,
	    yards: 1.195990046,
	};
	/**
	 * Wraps a GeoJSON {@link Geometry} in a GeoJSON {@link Feature}.
	 *
	 * @name feature
	 * @param {Geometry} geometry input geometry
	 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
	 * @param {Object} [options={}] Optional Parameters
	 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
	 * @param {string|number} [options.id] Identifier associated with the Feature
	 * @returns {Feature} a GeoJSON Feature
	 * @example
	 * var geometry = {
	 *   "type": "Point",
	 *   "coordinates": [110, 50]
	 * };
	 *
	 * var feature = turf.feature(geometry);
	 *
	 * //=feature
	 */
	function feature(geom, properties, options) {
	    if (options === void 0) { options = {}; }
	    var feat = { type: "Feature" };
	    if (options.id === 0 || options.id) {
	        feat.id = options.id;
	    }
	    if (options.bbox) {
	        feat.bbox = options.bbox;
	    }
	    feat.properties = properties || {};
	    feat.geometry = geom;
	    return feat;
	}
	exports.feature = feature;
	/**
	 * Creates a GeoJSON {@link Geometry} from a Geometry string type & coordinates.
	 * For GeometryCollection type use `helpers.geometryCollection`
	 *
	 * @name geometry
	 * @param {string} type Geometry Type
	 * @param {Array<any>} coordinates Coordinates
	 * @param {Object} [options={}] Optional Parameters
	 * @returns {Geometry} a GeoJSON Geometry
	 * @example
	 * var type = "Point";
	 * var coordinates = [110, 50];
	 * var geometry = turf.geometry(type, coordinates);
	 * // => geometry
	 */
	function geometry(type, coordinates, options) {
	    if (options === void 0) { options = {}; }
	    switch (type) {
	        case "Point": return point(coordinates).geometry;
	        case "LineString": return lineString(coordinates).geometry;
	        case "Polygon": return polygon(coordinates).geometry;
	        case "MultiPoint": return multiPoint(coordinates).geometry;
	        case "MultiLineString": return multiLineString(coordinates).geometry;
	        case "MultiPolygon": return multiPolygon(coordinates).geometry;
	        default: throw new Error(type + " is invalid");
	    }
	}
	exports.geometry = geometry;
	/**
	 * Creates a {@link Point} {@link Feature} from a Position.
	 *
	 * @name point
	 * @param {Array<number>} coordinates longitude, latitude position (each in decimal degrees)
	 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
	 * @param {Object} [options={}] Optional Parameters
	 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
	 * @param {string|number} [options.id] Identifier associated with the Feature
	 * @returns {Feature<Point>} a Point feature
	 * @example
	 * var point = turf.point([-75.343, 39.984]);
	 *
	 * //=point
	 */
	function point(coordinates, properties, options) {
	    if (options === void 0) { options = {}; }
	    var geom = {
	        type: "Point",
	        coordinates: coordinates,
	    };
	    return feature(geom, properties, options);
	}
	exports.point = point;
	/**
	 * Creates a {@link Point} {@link FeatureCollection} from an Array of Point coordinates.
	 *
	 * @name points
	 * @param {Array<Array<number>>} coordinates an array of Points
	 * @param {Object} [properties={}] Translate these properties to each Feature
	 * @param {Object} [options={}] Optional Parameters
	 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north]
	 * associated with the FeatureCollection
	 * @param {string|number} [options.id] Identifier associated with the FeatureCollection
	 * @returns {FeatureCollection<Point>} Point Feature
	 * @example
	 * var points = turf.points([
	 *   [-75, 39],
	 *   [-80, 45],
	 *   [-78, 50]
	 * ]);
	 *
	 * //=points
	 */
	function points(coordinates, properties, options) {
	    if (options === void 0) { options = {}; }
	    return featureCollection(coordinates.map(function (coords) {
	        return point(coords, properties);
	    }), options);
	}
	exports.points = points;
	/**
	 * Creates a {@link Polygon} {@link Feature} from an Array of LinearRings.
	 *
	 * @name polygon
	 * @param {Array<Array<Array<number>>>} coordinates an array of LinearRings
	 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
	 * @param {Object} [options={}] Optional Parameters
	 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
	 * @param {string|number} [options.id] Identifier associated with the Feature
	 * @returns {Feature<Polygon>} Polygon Feature
	 * @example
	 * var polygon = turf.polygon([[[-5, 52], [-4, 56], [-2, 51], [-7, 54], [-5, 52]]], { name: 'poly1' });
	 *
	 * //=polygon
	 */
	function polygon(coordinates, properties, options) {
	    if (options === void 0) { options = {}; }
	    for (var _i = 0, coordinates_1 = coordinates; _i < coordinates_1.length; _i++) {
	        var ring = coordinates_1[_i];
	        if (ring.length < 4) {
	            throw new Error("Each LinearRing of a Polygon must have 4 or more Positions.");
	        }
	        for (var j = 0; j < ring[ring.length - 1].length; j++) {
	            // Check if first point of Polygon contains two numbers
	            if (ring[ring.length - 1][j] !== ring[0][j]) {
	                throw new Error("First and last Position are not equivalent.");
	            }
	        }
	    }
	    var geom = {
	        type: "Polygon",
	        coordinates: coordinates,
	    };
	    return feature(geom, properties, options);
	}
	exports.polygon = polygon;
	/**
	 * Creates a {@link Polygon} {@link FeatureCollection} from an Array of Polygon coordinates.
	 *
	 * @name polygons
	 * @param {Array<Array<Array<Array<number>>>>} coordinates an array of Polygon coordinates
	 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
	 * @param {Object} [options={}] Optional Parameters
	 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
	 * @param {string|number} [options.id] Identifier associated with the FeatureCollection
	 * @returns {FeatureCollection<Polygon>} Polygon FeatureCollection
	 * @example
	 * var polygons = turf.polygons([
	 *   [[[-5, 52], [-4, 56], [-2, 51], [-7, 54], [-5, 52]]],
	 *   [[[-15, 42], [-14, 46], [-12, 41], [-17, 44], [-15, 42]]],
	 * ]);
	 *
	 * //=polygons
	 */
	function polygons(coordinates, properties, options) {
	    if (options === void 0) { options = {}; }
	    return featureCollection(coordinates.map(function (coords) {
	        return polygon(coords, properties);
	    }), options);
	}
	exports.polygons = polygons;
	/**
	 * Creates a {@link LineString} {@link Feature} from an Array of Positions.
	 *
	 * @name lineString
	 * @param {Array<Array<number>>} coordinates an array of Positions
	 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
	 * @param {Object} [options={}] Optional Parameters
	 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
	 * @param {string|number} [options.id] Identifier associated with the Feature
	 * @returns {Feature<LineString>} LineString Feature
	 * @example
	 * var linestring1 = turf.lineString([[-24, 63], [-23, 60], [-25, 65], [-20, 69]], {name: 'line 1'});
	 * var linestring2 = turf.lineString([[-14, 43], [-13, 40], [-15, 45], [-10, 49]], {name: 'line 2'});
	 *
	 * //=linestring1
	 * //=linestring2
	 */
	function lineString(coordinates, properties, options) {
	    if (options === void 0) { options = {}; }
	    if (coordinates.length < 2) {
	        throw new Error("coordinates must be an array of two or more positions");
	    }
	    var geom = {
	        type: "LineString",
	        coordinates: coordinates,
	    };
	    return feature(geom, properties, options);
	}
	exports.lineString = lineString;
	/**
	 * Creates a {@link LineString} {@link FeatureCollection} from an Array of LineString coordinates.
	 *
	 * @name lineStrings
	 * @param {Array<Array<Array<number>>>} coordinates an array of LinearRings
	 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
	 * @param {Object} [options={}] Optional Parameters
	 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north]
	 * associated with the FeatureCollection
	 * @param {string|number} [options.id] Identifier associated with the FeatureCollection
	 * @returns {FeatureCollection<LineString>} LineString FeatureCollection
	 * @example
	 * var linestrings = turf.lineStrings([
	 *   [[-24, 63], [-23, 60], [-25, 65], [-20, 69]],
	 *   [[-14, 43], [-13, 40], [-15, 45], [-10, 49]]
	 * ]);
	 *
	 * //=linestrings
	 */
	function lineStrings(coordinates, properties, options) {
	    if (options === void 0) { options = {}; }
	    return featureCollection(coordinates.map(function (coords) {
	        return lineString(coords, properties);
	    }), options);
	}
	exports.lineStrings = lineStrings;
	/**
	 * Takes one or more {@link Feature|Features} and creates a {@link FeatureCollection}.
	 *
	 * @name featureCollection
	 * @param {Feature[]} features input features
	 * @param {Object} [options={}] Optional Parameters
	 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
	 * @param {string|number} [options.id] Identifier associated with the Feature
	 * @returns {FeatureCollection} FeatureCollection of Features
	 * @example
	 * var locationA = turf.point([-75.343, 39.984], {name: 'Location A'});
	 * var locationB = turf.point([-75.833, 39.284], {name: 'Location B'});
	 * var locationC = turf.point([-75.534, 39.123], {name: 'Location C'});
	 *
	 * var collection = turf.featureCollection([
	 *   locationA,
	 *   locationB,
	 *   locationC
	 * ]);
	 *
	 * //=collection
	 */
	function featureCollection(features, options) {
	    if (options === void 0) { options = {}; }
	    var fc = { type: "FeatureCollection" };
	    if (options.id) {
	        fc.id = options.id;
	    }
	    if (options.bbox) {
	        fc.bbox = options.bbox;
	    }
	    fc.features = features;
	    return fc;
	}
	exports.featureCollection = featureCollection;
	/**
	 * Creates a {@link Feature<MultiLineString>} based on a
	 * coordinate array. Properties can be added optionally.
	 *
	 * @name multiLineString
	 * @param {Array<Array<Array<number>>>} coordinates an array of LineStrings
	 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
	 * @param {Object} [options={}] Optional Parameters
	 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
	 * @param {string|number} [options.id] Identifier associated with the Feature
	 * @returns {Feature<MultiLineString>} a MultiLineString feature
	 * @throws {Error} if no coordinates are passed
	 * @example
	 * var multiLine = turf.multiLineString([[[0,0],[10,10]]]);
	 *
	 * //=multiLine
	 */
	function multiLineString(coordinates, properties, options) {
	    if (options === void 0) { options = {}; }
	    var geom = {
	        type: "MultiLineString",
	        coordinates: coordinates,
	    };
	    return feature(geom, properties, options);
	}
	exports.multiLineString = multiLineString;
	/**
	 * Creates a {@link Feature<MultiPoint>} based on a
	 * coordinate array. Properties can be added optionally.
	 *
	 * @name multiPoint
	 * @param {Array<Array<number>>} coordinates an array of Positions
	 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
	 * @param {Object} [options={}] Optional Parameters
	 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
	 * @param {string|number} [options.id] Identifier associated with the Feature
	 * @returns {Feature<MultiPoint>} a MultiPoint feature
	 * @throws {Error} if no coordinates are passed
	 * @example
	 * var multiPt = turf.multiPoint([[0,0],[10,10]]);
	 *
	 * //=multiPt
	 */
	function multiPoint(coordinates, properties, options) {
	    if (options === void 0) { options = {}; }
	    var geom = {
	        type: "MultiPoint",
	        coordinates: coordinates,
	    };
	    return feature(geom, properties, options);
	}
	exports.multiPoint = multiPoint;
	/**
	 * Creates a {@link Feature<MultiPolygon>} based on a
	 * coordinate array. Properties can be added optionally.
	 *
	 * @name multiPolygon
	 * @param {Array<Array<Array<Array<number>>>>} coordinates an array of Polygons
	 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
	 * @param {Object} [options={}] Optional Parameters
	 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
	 * @param {string|number} [options.id] Identifier associated with the Feature
	 * @returns {Feature<MultiPolygon>} a multipolygon feature
	 * @throws {Error} if no coordinates are passed
	 * @example
	 * var multiPoly = turf.multiPolygon([[[[0,0],[0,10],[10,10],[10,0],[0,0]]]]);
	 *
	 * //=multiPoly
	 *
	 */
	function multiPolygon(coordinates, properties, options) {
	    if (options === void 0) { options = {}; }
	    var geom = {
	        type: "MultiPolygon",
	        coordinates: coordinates,
	    };
	    return feature(geom, properties, options);
	}
	exports.multiPolygon = multiPolygon;
	/**
	 * Creates a {@link Feature<GeometryCollection>} based on a
	 * coordinate array. Properties can be added optionally.
	 *
	 * @name geometryCollection
	 * @param {Array<Geometry>} geometries an array of GeoJSON Geometries
	 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
	 * @param {Object} [options={}] Optional Parameters
	 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
	 * @param {string|number} [options.id] Identifier associated with the Feature
	 * @returns {Feature<GeometryCollection>} a GeoJSON GeometryCollection Feature
	 * @example
	 * var pt = turf.geometry("Point", [100, 0]);
	 * var line = turf.geometry("LineString", [[101, 0], [102, 1]]);
	 * var collection = turf.geometryCollection([pt, line]);
	 *
	 * // => collection
	 */
	function geometryCollection(geometries, properties, options) {
	    if (options === void 0) { options = {}; }
	    var geom = {
	        type: "GeometryCollection",
	        geometries: geometries,
	    };
	    return feature(geom, properties, options);
	}
	exports.geometryCollection = geometryCollection;
	/**
	 * Round number to precision
	 *
	 * @param {number} num Number
	 * @param {number} [precision=0] Precision
	 * @returns {number} rounded number
	 * @example
	 * turf.round(120.4321)
	 * //=120
	 *
	 * turf.round(120.4321, 2)
	 * //=120.43
	 */
	function round(num, precision) {
	    if (precision === void 0) { precision = 0; }
	    if (precision && !(precision >= 0)) {
	        throw new Error("precision must be a positive number");
	    }
	    var multiplier = Math.pow(10, precision || 0);
	    return Math.round(num * multiplier) / multiplier;
	}
	exports.round = round;
	/**
	 * Convert a distance measurement (assuming a spherical Earth) from radians to a more friendly unit.
	 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
	 *
	 * @name radiansToLength
	 * @param {number} radians in radians across the sphere
	 * @param {string} [units="kilometers"] can be degrees, radians, miles, or kilometers inches, yards, metres,
	 * meters, kilometres, kilometers.
	 * @returns {number} distance
	 */
	function radiansToLength(radians, units) {
	    if (units === void 0) { units = "kilometers"; }
	    var factor = exports.factors[units];
	    if (!factor) {
	        throw new Error(units + " units is invalid");
	    }
	    return radians * factor;
	}
	exports.radiansToLength = radiansToLength;
	/**
	 * Convert a distance measurement (assuming a spherical Earth) from a real-world unit into radians
	 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
	 *
	 * @name lengthToRadians
	 * @param {number} distance in real units
	 * @param {string} [units="kilometers"] can be degrees, radians, miles, or kilometers inches, yards, metres,
	 * meters, kilometres, kilometers.
	 * @returns {number} radians
	 */
	function lengthToRadians(distance, units) {
	    if (units === void 0) { units = "kilometers"; }
	    var factor = exports.factors[units];
	    if (!factor) {
	        throw new Error(units + " units is invalid");
	    }
	    return distance / factor;
	}
	exports.lengthToRadians = lengthToRadians;
	/**
	 * Convert a distance measurement (assuming a spherical Earth) from a real-world unit into degrees
	 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, centimeters, kilometres, feet
	 *
	 * @name lengthToDegrees
	 * @param {number} distance in real units
	 * @param {string} [units="kilometers"] can be degrees, radians, miles, or kilometers inches, yards, metres,
	 * meters, kilometres, kilometers.
	 * @returns {number} degrees
	 */
	function lengthToDegrees(distance, units) {
	    return radiansToDegrees(lengthToRadians(distance, units));
	}
	exports.lengthToDegrees = lengthToDegrees;
	/**
	 * Converts any bearing angle from the north line direction (positive clockwise)
	 * and returns an angle between 0-360 degrees (positive clockwise), 0 being the north line
	 *
	 * @name bearingToAzimuth
	 * @param {number} bearing angle, between -180 and +180 degrees
	 * @returns {number} angle between 0 and 360 degrees
	 */
	function bearingToAzimuth(bearing) {
	    var angle = bearing % 360;
	    if (angle < 0) {
	        angle += 360;
	    }
	    return angle;
	}
	exports.bearingToAzimuth = bearingToAzimuth;
	/**
	 * Converts an angle in radians to degrees
	 *
	 * @name radiansToDegrees
	 * @param {number} radians angle in radians
	 * @returns {number} degrees between 0 and 360 degrees
	 */
	function radiansToDegrees(radians) {
	    var degrees = radians % (2 * Math.PI);
	    return degrees * 180 / Math.PI;
	}
	exports.radiansToDegrees = radiansToDegrees;
	/**
	 * Converts an angle in degrees to radians
	 *
	 * @name degreesToRadians
	 * @param {number} degrees angle between 0 and 360 degrees
	 * @returns {number} angle in radians
	 */
	function degreesToRadians(degrees) {
	    var radians = degrees % 360;
	    return radians * Math.PI / 180;
	}
	exports.degreesToRadians = degreesToRadians;
	/**
	 * Converts a length to the requested unit.
	 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
	 *
	 * @param {number} length to be converted
	 * @param {Units} [originalUnit="kilometers"] of the length
	 * @param {Units} [finalUnit="kilometers"] returned unit
	 * @returns {number} the converted length
	 */
	function convertLength(length, originalUnit, finalUnit) {
	    if (originalUnit === void 0) { originalUnit = "kilometers"; }
	    if (finalUnit === void 0) { finalUnit = "kilometers"; }
	    if (!(length >= 0)) {
	        throw new Error("length must be a positive number");
	    }
	    return radiansToLength(lengthToRadians(length, originalUnit), finalUnit);
	}
	exports.convertLength = convertLength;
	/**
	 * Converts a area to the requested unit.
	 * Valid units: kilometers, kilometres, meters, metres, centimetres, millimeters, acres, miles, yards, feet, inches
	 * @param {number} area to be converted
	 * @param {Units} [originalUnit="meters"] of the distance
	 * @param {Units} [finalUnit="kilometers"] returned unit
	 * @returns {number} the converted distance
	 */
	function convertArea(area, originalUnit, finalUnit) {
	    if (originalUnit === void 0) { originalUnit = "meters"; }
	    if (finalUnit === void 0) { finalUnit = "kilometers"; }
	    if (!(area >= 0)) {
	        throw new Error("area must be a positive number");
	    }
	    var startFactor = exports.areaFactors[originalUnit];
	    if (!startFactor) {
	        throw new Error("invalid original units");
	    }
	    var finalFactor = exports.areaFactors[finalUnit];
	    if (!finalFactor) {
	        throw new Error("invalid final units");
	    }
	    return (area / startFactor) * finalFactor;
	}
	exports.convertArea = convertArea;
	/**
	 * isNumber
	 *
	 * @param {*} num Number to validate
	 * @returns {boolean} true/false
	 * @example
	 * turf.isNumber(123)
	 * //=true
	 * turf.isNumber('foo')
	 * //=false
	 */
	function isNumber(num) {
	    return !isNaN(num) && num !== null && !Array.isArray(num) && !/^\s*$/.test(num);
	}
	exports.isNumber = isNumber;
	/**
	 * isObject
	 *
	 * @param {*} input variable to validate
	 * @returns {boolean} true/false
	 * @example
	 * turf.isObject({elevation: 10})
	 * //=true
	 * turf.isObject('foo')
	 * //=false
	 */
	function isObject(input) {
	    return (!!input) && (input.constructor === Object);
	}
	exports.isObject = isObject;
	/**
	 * Validate BBox
	 *
	 * @private
	 * @param {Array<number>} bbox BBox to validate
	 * @returns {void}
	 * @throws Error if BBox is not valid
	 * @example
	 * validateBBox([-180, -40, 110, 50])
	 * //=OK
	 * validateBBox([-180, -40])
	 * //=Error
	 * validateBBox('Foo')
	 * //=Error
	 * validateBBox(5)
	 * //=Error
	 * validateBBox(null)
	 * //=Error
	 * validateBBox(undefined)
	 * //=Error
	 */
	function validateBBox(bbox) {
	    if (!bbox) {
	        throw new Error("bbox is required");
	    }
	    if (!Array.isArray(bbox)) {
	        throw new Error("bbox must be an Array");
	    }
	    if (bbox.length !== 4 && bbox.length !== 6) {
	        throw new Error("bbox must be an Array of 4 or 6 numbers");
	    }
	    bbox.forEach(function (num) {
	        if (!isNumber(num)) {
	            throw new Error("bbox must only contain numbers");
	        }
	    });
	}
	exports.validateBBox = validateBBox;
	/**
	 * Validate Id
	 *
	 * @private
	 * @param {string|number} id Id to validate
	 * @returns {void}
	 * @throws Error if Id is not valid
	 * @example
	 * validateId([-180, -40, 110, 50])
	 * //=Error
	 * validateId([-180, -40])
	 * //=Error
	 * validateId('Foo')
	 * //=OK
	 * validateId(5)
	 * //=OK
	 * validateId(null)
	 * //=Error
	 * validateId(undefined)
	 * //=Error
	 */
	function validateId(id) {
	    if (!id) {
	        throw new Error("id is required");
	    }
	    if (["string", "number"].indexOf(typeof id) === -1) {
	        throw new Error("id must be a number or a string");
	    }
	}
	exports.validateId = validateId;
	// Deprecated methods
	function radians2degrees() {
	    throw new Error("method has been renamed to `radiansToDegrees`");
	}
	exports.radians2degrees = radians2degrees;
	function degrees2radians() {
	    throw new Error("method has been renamed to `degreesToRadians`");
	}
	exports.degrees2radians = degrees2radians;
	function distanceToDegrees() {
	    throw new Error("method has been renamed to `lengthToDegrees`");
	}
	exports.distanceToDegrees = distanceToDegrees;
	function distanceToRadians() {
	    throw new Error("method has been renamed to `lengthToRadians`");
	}
	exports.distanceToRadians = distanceToRadians;
	function radiansToDistance() {
	    throw new Error("method has been renamed to `radiansToLength`");
	}
	exports.radiansToDistance = radiansToDistance;
	function bearingToAngle() {
	    throw new Error("method has been renamed to `bearingToAzimuth`");
	}
	exports.bearingToAngle = bearingToAngle;
	function convertDistance() {
	    throw new Error("method has been renamed to `convertLength`");
	}
	exports.convertDistance = convertDistance;
	});

	unwrapExports(helpers);
	var helpers_1 = helpers.earthRadius;
	var helpers_2 = helpers.factors;
	var helpers_3 = helpers.unitsFactors;
	var helpers_4 = helpers.areaFactors;
	var helpers_5 = helpers.feature;
	var helpers_6 = helpers.geometry;
	var helpers_7 = helpers.point;
	var helpers_8 = helpers.points;
	var helpers_9 = helpers.polygon;
	var helpers_10 = helpers.polygons;
	var helpers_11 = helpers.lineString;
	var helpers_12 = helpers.lineStrings;
	var helpers_13 = helpers.featureCollection;
	var helpers_14 = helpers.multiLineString;
	var helpers_15 = helpers.multiPoint;
	var helpers_16 = helpers.multiPolygon;
	var helpers_17 = helpers.geometryCollection;
	var helpers_18 = helpers.round;
	var helpers_19 = helpers.radiansToLength;
	var helpers_20 = helpers.lengthToRadians;
	var helpers_21 = helpers.lengthToDegrees;
	var helpers_22 = helpers.bearingToAzimuth;
	var helpers_23 = helpers.radiansToDegrees;
	var helpers_24 = helpers.degreesToRadians;
	var helpers_25 = helpers.convertLength;
	var helpers_26 = helpers.convertArea;
	var helpers_27 = helpers.isNumber;
	var helpers_28 = helpers.isObject;
	var helpers_29 = helpers.validateBBox;
	var helpers_30 = helpers.validateId;
	var helpers_31 = helpers.radians2degrees;
	var helpers_32 = helpers.degrees2radians;
	var helpers_33 = helpers.distanceToDegrees;
	var helpers_34 = helpers.distanceToRadians;
	var helpers_35 = helpers.radiansToDistance;
	var helpers_36 = helpers.bearingToAngle;
	var helpers_37 = helpers.convertDistance;

	var meta = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, '__esModule', { value: true });



	/**
	 * Callback for coordEach
	 *
	 * @callback coordEachCallback
	 * @param {Array<number>} currentCoord The current coordinate being processed.
	 * @param {number} coordIndex The current index of the coordinate being processed.
	 * @param {number} featureIndex The current index of the Feature being processed.
	 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed.
	 * @param {number} geometryIndex The current index of the Geometry being processed.
	 */

	/**
	 * Iterate over coordinates in any GeoJSON object, similar to Array.forEach()
	 *
	 * @name coordEach
	 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
	 * @param {Function} callback a method that takes (currentCoord, coordIndex, featureIndex, multiFeatureIndex)
	 * @param {boolean} [excludeWrapCoord=false] whether or not to include the final coordinate of LinearRings that wraps the ring in its iteration.
	 * @returns {void}
	 * @example
	 * var features = turf.featureCollection([
	 *   turf.point([26, 37], {"foo": "bar"}),
	 *   turf.point([36, 53], {"hello": "world"})
	 * ]);
	 *
	 * turf.coordEach(features, function (currentCoord, coordIndex, featureIndex, multiFeatureIndex, geometryIndex) {
	 *   //=currentCoord
	 *   //=coordIndex
	 *   //=featureIndex
	 *   //=multiFeatureIndex
	 *   //=geometryIndex
	 * });
	 */
	function coordEach(geojson, callback, excludeWrapCoord) {
	    // Handles null Geometry -- Skips this GeoJSON
	    if (geojson === null) return;
	    var j, k, l, geometry, stopG, coords,
	        geometryMaybeCollection,
	        wrapShrink = 0,
	        coordIndex = 0,
	        isGeometryCollection,
	        type = geojson.type,
	        isFeatureCollection = type === 'FeatureCollection',
	        isFeature = type === 'Feature',
	        stop = isFeatureCollection ? geojson.features.length : 1;

	    // This logic may look a little weird. The reason why it is that way
	    // is because it's trying to be fast. GeoJSON supports multiple kinds
	    // of objects at its root: FeatureCollection, Features, Geometries.
	    // This function has the responsibility of handling all of them, and that
	    // means that some of the `for` loops you see below actually just don't apply
	    // to certain inputs. For instance, if you give this just a
	    // Point geometry, then both loops are short-circuited and all we do
	    // is gradually rename the input until it's called 'geometry'.
	    //
	    // This also aims to allocate as few resources as possible: just a
	    // few numbers and booleans, rather than any temporary arrays as would
	    // be required with the normalization approach.
	    for (var featureIndex = 0; featureIndex < stop; featureIndex++) {
	        geometryMaybeCollection = (isFeatureCollection ? geojson.features[featureIndex].geometry :
	            (isFeature ? geojson.geometry : geojson));
	        isGeometryCollection = (geometryMaybeCollection) ? geometryMaybeCollection.type === 'GeometryCollection' : false;
	        stopG = isGeometryCollection ? geometryMaybeCollection.geometries.length : 1;

	        for (var geomIndex = 0; geomIndex < stopG; geomIndex++) {
	            var multiFeatureIndex = 0;
	            var geometryIndex = 0;
	            geometry = isGeometryCollection ?
	                geometryMaybeCollection.geometries[geomIndex] : geometryMaybeCollection;

	            // Handles null Geometry -- Skips this geometry
	            if (geometry === null) continue;
	            coords = geometry.coordinates;
	            var geomType = geometry.type;

	            wrapShrink = (excludeWrapCoord && (geomType === 'Polygon' || geomType === 'MultiPolygon')) ? 1 : 0;

	            switch (geomType) {
	            case null:
	                break;
	            case 'Point':
	                if (callback(coords, coordIndex, featureIndex, multiFeatureIndex, geometryIndex) === false) return false;
	                coordIndex++;
	                multiFeatureIndex++;
	                break;
	            case 'LineString':
	            case 'MultiPoint':
	                for (j = 0; j < coords.length; j++) {
	                    if (callback(coords[j], coordIndex, featureIndex, multiFeatureIndex, geometryIndex) === false) return false;
	                    coordIndex++;
	                    if (geomType === 'MultiPoint') multiFeatureIndex++;
	                }
	                if (geomType === 'LineString') multiFeatureIndex++;
	                break;
	            case 'Polygon':
	            case 'MultiLineString':
	                for (j = 0; j < coords.length; j++) {
	                    for (k = 0; k < coords[j].length - wrapShrink; k++) {
	                        if (callback(coords[j][k], coordIndex, featureIndex, multiFeatureIndex, geometryIndex) === false) return false;
	                        coordIndex++;
	                    }
	                    if (geomType === 'MultiLineString') multiFeatureIndex++;
	                    if (geomType === 'Polygon') geometryIndex++;
	                }
	                if (geomType === 'Polygon') multiFeatureIndex++;
	                break;
	            case 'MultiPolygon':
	                for (j = 0; j < coords.length; j++) {
	                    geometryIndex = 0;
	                    for (k = 0; k < coords[j].length; k++) {
	                        for (l = 0; l < coords[j][k].length - wrapShrink; l++) {
	                            if (callback(coords[j][k][l], coordIndex, featureIndex, multiFeatureIndex, geometryIndex) === false) return false;
	                            coordIndex++;
	                        }
	                        geometryIndex++;
	                    }
	                    multiFeatureIndex++;
	                }
	                break;
	            case 'GeometryCollection':
	                for (j = 0; j < geometry.geometries.length; j++)
	                    if (coordEach(geometry.geometries[j], callback, excludeWrapCoord) === false) return false;
	                break;
	            default:
	                throw new Error('Unknown Geometry Type');
	            }
	        }
	    }
	}

	/**
	 * Callback for coordReduce
	 *
	 * The first time the callback function is called, the values provided as arguments depend
	 * on whether the reduce method has an initialValue argument.
	 *
	 * If an initialValue is provided to the reduce method:
	 *  - The previousValue argument is initialValue.
	 *  - The currentValue argument is the value of the first element present in the array.
	 *
	 * If an initialValue is not provided:
	 *  - The previousValue argument is the value of the first element present in the array.
	 *  - The currentValue argument is the value of the second element present in the array.
	 *
	 * @callback coordReduceCallback
	 * @param {*} previousValue The accumulated value previously returned in the last invocation
	 * of the callback, or initialValue, if supplied.
	 * @param {Array<number>} currentCoord The current coordinate being processed.
	 * @param {number} coordIndex The current index of the coordinate being processed.
	 * Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
	 * @param {number} featureIndex The current index of the Feature being processed.
	 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed.
	 * @param {number} geometryIndex The current index of the Geometry being processed.
	 */

	/**
	 * Reduce coordinates in any GeoJSON object, similar to Array.reduce()
	 *
	 * @name coordReduce
	 * @param {FeatureCollection|Geometry|Feature} geojson any GeoJSON object
	 * @param {Function} callback a method that takes (previousValue, currentCoord, coordIndex)
	 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
	 * @param {boolean} [excludeWrapCoord=false] whether or not to include the final coordinate of LinearRings that wraps the ring in its iteration.
	 * @returns {*} The value that results from the reduction.
	 * @example
	 * var features = turf.featureCollection([
	 *   turf.point([26, 37], {"foo": "bar"}),
	 *   turf.point([36, 53], {"hello": "world"})
	 * ]);
	 *
	 * turf.coordReduce(features, function (previousValue, currentCoord, coordIndex, featureIndex, multiFeatureIndex, geometryIndex) {
	 *   //=previousValue
	 *   //=currentCoord
	 *   //=coordIndex
	 *   //=featureIndex
	 *   //=multiFeatureIndex
	 *   //=geometryIndex
	 *   return currentCoord;
	 * });
	 */
	function coordReduce(geojson, callback, initialValue, excludeWrapCoord) {
	    var previousValue = initialValue;
	    coordEach(geojson, function (currentCoord, coordIndex, featureIndex, multiFeatureIndex, geometryIndex) {
	        if (coordIndex === 0 && initialValue === undefined) previousValue = currentCoord;
	        else previousValue = callback(previousValue, currentCoord, coordIndex, featureIndex, multiFeatureIndex, geometryIndex);
	    }, excludeWrapCoord);
	    return previousValue;
	}

	/**
	 * Callback for propEach
	 *
	 * @callback propEachCallback
	 * @param {Object} currentProperties The current Properties being processed.
	 * @param {number} featureIndex The current index of the Feature being processed.
	 */

	/**
	 * Iterate over properties in any GeoJSON object, similar to Array.forEach()
	 *
	 * @name propEach
	 * @param {FeatureCollection|Feature} geojson any GeoJSON object
	 * @param {Function} callback a method that takes (currentProperties, featureIndex)
	 * @returns {void}
	 * @example
	 * var features = turf.featureCollection([
	 *     turf.point([26, 37], {foo: 'bar'}),
	 *     turf.point([36, 53], {hello: 'world'})
	 * ]);
	 *
	 * turf.propEach(features, function (currentProperties, featureIndex) {
	 *   //=currentProperties
	 *   //=featureIndex
	 * });
	 */
	function propEach(geojson, callback) {
	    var i;
	    switch (geojson.type) {
	    case 'FeatureCollection':
	        for (i = 0; i < geojson.features.length; i++) {
	            if (callback(geojson.features[i].properties, i) === false) break;
	        }
	        break;
	    case 'Feature':
	        callback(geojson.properties, 0);
	        break;
	    }
	}


	/**
	 * Callback for propReduce
	 *
	 * The first time the callback function is called, the values provided as arguments depend
	 * on whether the reduce method has an initialValue argument.
	 *
	 * If an initialValue is provided to the reduce method:
	 *  - The previousValue argument is initialValue.
	 *  - The currentValue argument is the value of the first element present in the array.
	 *
	 * If an initialValue is not provided:
	 *  - The previousValue argument is the value of the first element present in the array.
	 *  - The currentValue argument is the value of the second element present in the array.
	 *
	 * @callback propReduceCallback
	 * @param {*} previousValue The accumulated value previously returned in the last invocation
	 * of the callback, or initialValue, if supplied.
	 * @param {*} currentProperties The current Properties being processed.
	 * @param {number} featureIndex The current index of the Feature being processed.
	 */

	/**
	 * Reduce properties in any GeoJSON object into a single value,
	 * similar to how Array.reduce works. However, in this case we lazily run
	 * the reduction, so an array of all properties is unnecessary.
	 *
	 * @name propReduce
	 * @param {FeatureCollection|Feature} geojson any GeoJSON object
	 * @param {Function} callback a method that takes (previousValue, currentProperties, featureIndex)
	 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
	 * @returns {*} The value that results from the reduction.
	 * @example
	 * var features = turf.featureCollection([
	 *     turf.point([26, 37], {foo: 'bar'}),
	 *     turf.point([36, 53], {hello: 'world'})
	 * ]);
	 *
	 * turf.propReduce(features, function (previousValue, currentProperties, featureIndex) {
	 *   //=previousValue
	 *   //=currentProperties
	 *   //=featureIndex
	 *   return currentProperties
	 * });
	 */
	function propReduce(geojson, callback, initialValue) {
	    var previousValue = initialValue;
	    propEach(geojson, function (currentProperties, featureIndex) {
	        if (featureIndex === 0 && initialValue === undefined) previousValue = currentProperties;
	        else previousValue = callback(previousValue, currentProperties, featureIndex);
	    });
	    return previousValue;
	}

	/**
	 * Callback for featureEach
	 *
	 * @callback featureEachCallback
	 * @param {Feature<any>} currentFeature The current Feature being processed.
	 * @param {number} featureIndex The current index of the Feature being processed.
	 */

	/**
	 * Iterate over features in any GeoJSON object, similar to
	 * Array.forEach.
	 *
	 * @name featureEach
	 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
	 * @param {Function} callback a method that takes (currentFeature, featureIndex)
	 * @returns {void}
	 * @example
	 * var features = turf.featureCollection([
	 *   turf.point([26, 37], {foo: 'bar'}),
	 *   turf.point([36, 53], {hello: 'world'})
	 * ]);
	 *
	 * turf.featureEach(features, function (currentFeature, featureIndex) {
	 *   //=currentFeature
	 *   //=featureIndex
	 * });
	 */
	function featureEach(geojson, callback) {
	    if (geojson.type === 'Feature') {
	        callback(geojson, 0);
	    } else if (geojson.type === 'FeatureCollection') {
	        for (var i = 0; i < geojson.features.length; i++) {
	            if (callback(geojson.features[i], i) === false) break;
	        }
	    }
	}

	/**
	 * Callback for featureReduce
	 *
	 * The first time the callback function is called, the values provided as arguments depend
	 * on whether the reduce method has an initialValue argument.
	 *
	 * If an initialValue is provided to the reduce method:
	 *  - The previousValue argument is initialValue.
	 *  - The currentValue argument is the value of the first element present in the array.
	 *
	 * If an initialValue is not provided:
	 *  - The previousValue argument is the value of the first element present in the array.
	 *  - The currentValue argument is the value of the second element present in the array.
	 *
	 * @callback featureReduceCallback
	 * @param {*} previousValue The accumulated value previously returned in the last invocation
	 * of the callback, or initialValue, if supplied.
	 * @param {Feature} currentFeature The current Feature being processed.
	 * @param {number} featureIndex The current index of the Feature being processed.
	 */

	/**
	 * Reduce features in any GeoJSON object, similar to Array.reduce().
	 *
	 * @name featureReduce
	 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
	 * @param {Function} callback a method that takes (previousValue, currentFeature, featureIndex)
	 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
	 * @returns {*} The value that results from the reduction.
	 * @example
	 * var features = turf.featureCollection([
	 *   turf.point([26, 37], {"foo": "bar"}),
	 *   turf.point([36, 53], {"hello": "world"})
	 * ]);
	 *
	 * turf.featureReduce(features, function (previousValue, currentFeature, featureIndex) {
	 *   //=previousValue
	 *   //=currentFeature
	 *   //=featureIndex
	 *   return currentFeature
	 * });
	 */
	function featureReduce(geojson, callback, initialValue) {
	    var previousValue = initialValue;
	    featureEach(geojson, function (currentFeature, featureIndex) {
	        if (featureIndex === 0 && initialValue === undefined) previousValue = currentFeature;
	        else previousValue = callback(previousValue, currentFeature, featureIndex);
	    });
	    return previousValue;
	}

	/**
	 * Get all coordinates from any GeoJSON object.
	 *
	 * @name coordAll
	 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
	 * @returns {Array<Array<number>>} coordinate position array
	 * @example
	 * var features = turf.featureCollection([
	 *   turf.point([26, 37], {foo: 'bar'}),
	 *   turf.point([36, 53], {hello: 'world'})
	 * ]);
	 *
	 * var coords = turf.coordAll(features);
	 * //= [[26, 37], [36, 53]]
	 */
	function coordAll(geojson) {
	    var coords = [];
	    coordEach(geojson, function (coord) {
	        coords.push(coord);
	    });
	    return coords;
	}

	/**
	 * Callback for geomEach
	 *
	 * @callback geomEachCallback
	 * @param {Geometry} currentGeometry The current Geometry being processed.
	 * @param {number} featureIndex The current index of the Feature being processed.
	 * @param {Object} featureProperties The current Feature Properties being processed.
	 * @param {Array<number>} featureBBox The current Feature BBox being processed.
	 * @param {number|string} featureId The current Feature Id being processed.
	 */

	/**
	 * Iterate over each geometry in any GeoJSON object, similar to Array.forEach()
	 *
	 * @name geomEach
	 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
	 * @param {Function} callback a method that takes (currentGeometry, featureIndex, featureProperties, featureBBox, featureId)
	 * @returns {void}
	 * @example
	 * var features = turf.featureCollection([
	 *     turf.point([26, 37], {foo: 'bar'}),
	 *     turf.point([36, 53], {hello: 'world'})
	 * ]);
	 *
	 * turf.geomEach(features, function (currentGeometry, featureIndex, featureProperties, featureBBox, featureId) {
	 *   //=currentGeometry
	 *   //=featureIndex
	 *   //=featureProperties
	 *   //=featureBBox
	 *   //=featureId
	 * });
	 */
	function geomEach(geojson, callback) {
	    var i, j, g, geometry, stopG,
	        geometryMaybeCollection,
	        isGeometryCollection,
	        featureProperties,
	        featureBBox,
	        featureId,
	        featureIndex = 0,
	        isFeatureCollection = geojson.type === 'FeatureCollection',
	        isFeature = geojson.type === 'Feature',
	        stop = isFeatureCollection ? geojson.features.length : 1;

	    // This logic may look a little weird. The reason why it is that way
	    // is because it's trying to be fast. GeoJSON supports multiple kinds
	    // of objects at its root: FeatureCollection, Features, Geometries.
	    // This function has the responsibility of handling all of them, and that
	    // means that some of the `for` loops you see below actually just don't apply
	    // to certain inputs. For instance, if you give this just a
	    // Point geometry, then both loops are short-circuited and all we do
	    // is gradually rename the input until it's called 'geometry'.
	    //
	    // This also aims to allocate as few resources as possible: just a
	    // few numbers and booleans, rather than any temporary arrays as would
	    // be required with the normalization approach.
	    for (i = 0; i < stop; i++) {

	        geometryMaybeCollection = (isFeatureCollection ? geojson.features[i].geometry :
	            (isFeature ? geojson.geometry : geojson));
	        featureProperties = (isFeatureCollection ? geojson.features[i].properties :
	            (isFeature ? geojson.properties : {}));
	        featureBBox = (isFeatureCollection ? geojson.features[i].bbox :
	            (isFeature ? geojson.bbox : undefined));
	        featureId = (isFeatureCollection ? geojson.features[i].id :
	            (isFeature ? geojson.id : undefined));
	        isGeometryCollection = (geometryMaybeCollection) ? geometryMaybeCollection.type === 'GeometryCollection' : false;
	        stopG = isGeometryCollection ? geometryMaybeCollection.geometries.length : 1;

	        for (g = 0; g < stopG; g++) {
	            geometry = isGeometryCollection ?
	                geometryMaybeCollection.geometries[g] : geometryMaybeCollection;

	            // Handle null Geometry
	            if (geometry === null) {
	                if (callback(null, featureIndex, featureProperties, featureBBox, featureId) === false) return false;
	                continue;
	            }
	            switch (geometry.type) {
	            case 'Point':
	            case 'LineString':
	            case 'MultiPoint':
	            case 'Polygon':
	            case 'MultiLineString':
	            case 'MultiPolygon': {
	                if (callback(geometry, featureIndex, featureProperties, featureBBox, featureId) === false) return false;
	                break;
	            }
	            case 'GeometryCollection': {
	                for (j = 0; j < geometry.geometries.length; j++) {
	                    if (callback(geometry.geometries[j], featureIndex, featureProperties, featureBBox, featureId) === false) return false;
	                }
	                break;
	            }
	            default:
	                throw new Error('Unknown Geometry Type');
	            }
	        }
	        // Only increase `featureIndex` per each feature
	        featureIndex++;
	    }
	}

	/**
	 * Callback for geomReduce
	 *
	 * The first time the callback function is called, the values provided as arguments depend
	 * on whether the reduce method has an initialValue argument.
	 *
	 * If an initialValue is provided to the reduce method:
	 *  - The previousValue argument is initialValue.
	 *  - The currentValue argument is the value of the first element present in the array.
	 *
	 * If an initialValue is not provided:
	 *  - The previousValue argument is the value of the first element present in the array.
	 *  - The currentValue argument is the value of the second element present in the array.
	 *
	 * @callback geomReduceCallback
	 * @param {*} previousValue The accumulated value previously returned in the last invocation
	 * of the callback, or initialValue, if supplied.
	 * @param {Geometry} currentGeometry The current Geometry being processed.
	 * @param {number} featureIndex The current index of the Feature being processed.
	 * @param {Object} featureProperties The current Feature Properties being processed.
	 * @param {Array<number>} featureBBox The current Feature BBox being processed.
	 * @param {number|string} featureId The current Feature Id being processed.
	 */

	/**
	 * Reduce geometry in any GeoJSON object, similar to Array.reduce().
	 *
	 * @name geomReduce
	 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
	 * @param {Function} callback a method that takes (previousValue, currentGeometry, featureIndex, featureProperties, featureBBox, featureId)
	 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
	 * @returns {*} The value that results from the reduction.
	 * @example
	 * var features = turf.featureCollection([
	 *     turf.point([26, 37], {foo: 'bar'}),
	 *     turf.point([36, 53], {hello: 'world'})
	 * ]);
	 *
	 * turf.geomReduce(features, function (previousValue, currentGeometry, featureIndex, featureProperties, featureBBox, featureId) {
	 *   //=previousValue
	 *   //=currentGeometry
	 *   //=featureIndex
	 *   //=featureProperties
	 *   //=featureBBox
	 *   //=featureId
	 *   return currentGeometry
	 * });
	 */
	function geomReduce(geojson, callback, initialValue) {
	    var previousValue = initialValue;
	    geomEach(geojson, function (currentGeometry, featureIndex, featureProperties, featureBBox, featureId) {
	        if (featureIndex === 0 && initialValue === undefined) previousValue = currentGeometry;
	        else previousValue = callback(previousValue, currentGeometry, featureIndex, featureProperties, featureBBox, featureId);
	    });
	    return previousValue;
	}

	/**
	 * Callback for flattenEach
	 *
	 * @callback flattenEachCallback
	 * @param {Feature} currentFeature The current flattened feature being processed.
	 * @param {number} featureIndex The current index of the Feature being processed.
	 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed.
	 */

	/**
	 * Iterate over flattened features in any GeoJSON object, similar to
	 * Array.forEach.
	 *
	 * @name flattenEach
	 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
	 * @param {Function} callback a method that takes (currentFeature, featureIndex, multiFeatureIndex)
	 * @example
	 * var features = turf.featureCollection([
	 *     turf.point([26, 37], {foo: 'bar'}),
	 *     turf.multiPoint([[40, 30], [36, 53]], {hello: 'world'})
	 * ]);
	 *
	 * turf.flattenEach(features, function (currentFeature, featureIndex, multiFeatureIndex) {
	 *   //=currentFeature
	 *   //=featureIndex
	 *   //=multiFeatureIndex
	 * });
	 */
	function flattenEach(geojson, callback) {
	    geomEach(geojson, function (geometry, featureIndex, properties, bbox, id) {
	        // Callback for single geometry
	        var type = (geometry === null) ? null : geometry.type;
	        switch (type) {
	        case null:
	        case 'Point':
	        case 'LineString':
	        case 'Polygon':
	            if (callback(helpers.feature(geometry, properties, {bbox: bbox, id: id}), featureIndex, 0) === false) return false;
	            return;
	        }

	        var geomType;

	        // Callback for multi-geometry
	        switch (type) {
	        case 'MultiPoint':
	            geomType = 'Point';
	            break;
	        case 'MultiLineString':
	            geomType = 'LineString';
	            break;
	        case 'MultiPolygon':
	            geomType = 'Polygon';
	            break;
	        }

	        for (var multiFeatureIndex = 0; multiFeatureIndex < geometry.coordinates.length; multiFeatureIndex++) {
	            var coordinate = geometry.coordinates[multiFeatureIndex];
	            var geom = {
	                type: geomType,
	                coordinates: coordinate
	            };
	            if (callback(helpers.feature(geom, properties), featureIndex, multiFeatureIndex) === false) return false;
	        }
	    });
	}

	/**
	 * Callback for flattenReduce
	 *
	 * The first time the callback function is called, the values provided as arguments depend
	 * on whether the reduce method has an initialValue argument.
	 *
	 * If an initialValue is provided to the reduce method:
	 *  - The previousValue argument is initialValue.
	 *  - The currentValue argument is the value of the first element present in the array.
	 *
	 * If an initialValue is not provided:
	 *  - The previousValue argument is the value of the first element present in the array.
	 *  - The currentValue argument is the value of the second element present in the array.
	 *
	 * @callback flattenReduceCallback
	 * @param {*} previousValue The accumulated value previously returned in the last invocation
	 * of the callback, or initialValue, if supplied.
	 * @param {Feature} currentFeature The current Feature being processed.
	 * @param {number} featureIndex The current index of the Feature being processed.
	 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed.
	 */

	/**
	 * Reduce flattened features in any GeoJSON object, similar to Array.reduce().
	 *
	 * @name flattenReduce
	 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
	 * @param {Function} callback a method that takes (previousValue, currentFeature, featureIndex, multiFeatureIndex)
	 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
	 * @returns {*} The value that results from the reduction.
	 * @example
	 * var features = turf.featureCollection([
	 *     turf.point([26, 37], {foo: 'bar'}),
	 *     turf.multiPoint([[40, 30], [36, 53]], {hello: 'world'})
	 * ]);
	 *
	 * turf.flattenReduce(features, function (previousValue, currentFeature, featureIndex, multiFeatureIndex) {
	 *   //=previousValue
	 *   //=currentFeature
	 *   //=featureIndex
	 *   //=multiFeatureIndex
	 *   return currentFeature
	 * });
	 */
	function flattenReduce(geojson, callback, initialValue) {
	    var previousValue = initialValue;
	    flattenEach(geojson, function (currentFeature, featureIndex, multiFeatureIndex) {
	        if (featureIndex === 0 && multiFeatureIndex === 0 && initialValue === undefined) previousValue = currentFeature;
	        else previousValue = callback(previousValue, currentFeature, featureIndex, multiFeatureIndex);
	    });
	    return previousValue;
	}

	/**
	 * Callback for segmentEach
	 *
	 * @callback segmentEachCallback
	 * @param {Feature<LineString>} currentSegment The current Segment being processed.
	 * @param {number} featureIndex The current index of the Feature being processed.
	 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed.
	 * @param {number} geometryIndex The current index of the Geometry being processed.
	 * @param {number} segmentIndex The current index of the Segment being processed.
	 * @returns {void}
	 */

	/**
	 * Iterate over 2-vertex line segment in any GeoJSON object, similar to Array.forEach()
	 * (Multi)Point geometries do not contain segments therefore they are ignored during this operation.
	 *
	 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON
	 * @param {Function} callback a method that takes (currentSegment, featureIndex, multiFeatureIndex, geometryIndex, segmentIndex)
	 * @returns {void}
	 * @example
	 * var polygon = turf.polygon([[[-50, 5], [-40, -10], [-50, -10], [-40, 5], [-50, 5]]]);
	 *
	 * // Iterate over GeoJSON by 2-vertex segments
	 * turf.segmentEach(polygon, function (currentSegment, featureIndex, multiFeatureIndex, geometryIndex, segmentIndex) {
	 *   //=currentSegment
	 *   //=featureIndex
	 *   //=multiFeatureIndex
	 *   //=geometryIndex
	 *   //=segmentIndex
	 * });
	 *
	 * // Calculate the total number of segments
	 * var total = 0;
	 * turf.segmentEach(polygon, function () {
	 *     total++;
	 * });
	 */
	function segmentEach(geojson, callback) {
	    flattenEach(geojson, function (feature, featureIndex, multiFeatureIndex) {
	        var segmentIndex = 0;

	        // Exclude null Geometries
	        if (!feature.geometry) return;
	        // (Multi)Point geometries do not contain segments therefore they are ignored during this operation.
	        var type = feature.geometry.type;
	        if (type === 'Point' || type === 'MultiPoint') return;

	        // Generate 2-vertex line segments
	        var previousCoords;
	        var previousFeatureIndex = 0;
	        var previousMultiIndex = 0;
	        var prevGeomIndex = 0;
	        if (coordEach(feature, function (currentCoord, coordIndex, featureIndexCoord, multiPartIndexCoord, geometryIndex) {
	            // Simulating a meta.coordReduce() since `reduce` operations cannot be stopped by returning `false`
	            if (previousCoords === undefined || featureIndex > previousFeatureIndex || multiPartIndexCoord > previousMultiIndex || geometryIndex > prevGeomIndex) {
	                previousCoords = currentCoord;
	                previousFeatureIndex = featureIndex;
	                previousMultiIndex = multiPartIndexCoord;
	                prevGeomIndex = geometryIndex;
	                segmentIndex = 0;
	                return;
	            }
	            var currentSegment = helpers.lineString([previousCoords, currentCoord], feature.properties);
	            if (callback(currentSegment, featureIndex, multiFeatureIndex, geometryIndex, segmentIndex) === false) return false;
	            segmentIndex++;
	            previousCoords = currentCoord;
	        }) === false) return false;
	    });
	}

	/**
	 * Callback for segmentReduce
	 *
	 * The first time the callback function is called, the values provided as arguments depend
	 * on whether the reduce method has an initialValue argument.
	 *
	 * If an initialValue is provided to the reduce method:
	 *  - The previousValue argument is initialValue.
	 *  - The currentValue argument is the value of the first element present in the array.
	 *
	 * If an initialValue is not provided:
	 *  - The previousValue argument is the value of the first element present in the array.
	 *  - The currentValue argument is the value of the second element present in the array.
	 *
	 * @callback segmentReduceCallback
	 * @param {*} previousValue The accumulated value previously returned in the last invocation
	 * of the callback, or initialValue, if supplied.
	 * @param {Feature<LineString>} currentSegment The current Segment being processed.
	 * @param {number} featureIndex The current index of the Feature being processed.
	 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed.
	 * @param {number} geometryIndex The current index of the Geometry being processed.
	 * @param {number} segmentIndex The current index of the Segment being processed.
	 */

	/**
	 * Reduce 2-vertex line segment in any GeoJSON object, similar to Array.reduce()
	 * (Multi)Point geometries do not contain segments therefore they are ignored during this operation.
	 *
	 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON
	 * @param {Function} callback a method that takes (previousValue, currentSegment, currentIndex)
	 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
	 * @returns {void}
	 * @example
	 * var polygon = turf.polygon([[[-50, 5], [-40, -10], [-50, -10], [-40, 5], [-50, 5]]]);
	 *
	 * // Iterate over GeoJSON by 2-vertex segments
	 * turf.segmentReduce(polygon, function (previousSegment, currentSegment, featureIndex, multiFeatureIndex, geometryIndex, segmentIndex) {
	 *   //= previousSegment
	 *   //= currentSegment
	 *   //= featureIndex
	 *   //= multiFeatureIndex
	 *   //= geometryIndex
	 *   //= segmentInex
	 *   return currentSegment
	 * });
	 *
	 * // Calculate the total number of segments
	 * var initialValue = 0
	 * var total = turf.segmentReduce(polygon, function (previousValue) {
	 *     previousValue++;
	 *     return previousValue;
	 * }, initialValue);
	 */
	function segmentReduce(geojson, callback, initialValue) {
	    var previousValue = initialValue;
	    var started = false;
	    segmentEach(geojson, function (currentSegment, featureIndex, multiFeatureIndex, geometryIndex, segmentIndex) {
	        if (started === false && initialValue === undefined) previousValue = currentSegment;
	        else previousValue = callback(previousValue, currentSegment, featureIndex, multiFeatureIndex, geometryIndex, segmentIndex);
	        started = true;
	    });
	    return previousValue;
	}

	/**
	 * Callback for lineEach
	 *
	 * @callback lineEachCallback
	 * @param {Feature<LineString>} currentLine The current LineString|LinearRing being processed
	 * @param {number} featureIndex The current index of the Feature being processed
	 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed
	 * @param {number} geometryIndex The current index of the Geometry being processed
	 */

	/**
	 * Iterate over line or ring coordinates in LineString, Polygon, MultiLineString, MultiPolygon Features or Geometries,
	 * similar to Array.forEach.
	 *
	 * @name lineEach
	 * @param {Geometry|Feature<LineString|Polygon|MultiLineString|MultiPolygon>} geojson object
	 * @param {Function} callback a method that takes (currentLine, featureIndex, multiFeatureIndex, geometryIndex)
	 * @example
	 * var multiLine = turf.multiLineString([
	 *   [[26, 37], [35, 45]],
	 *   [[36, 53], [38, 50], [41, 55]]
	 * ]);
	 *
	 * turf.lineEach(multiLine, function (currentLine, featureIndex, multiFeatureIndex, geometryIndex) {
	 *   //=currentLine
	 *   //=featureIndex
	 *   //=multiFeatureIndex
	 *   //=geometryIndex
	 * });
	 */
	function lineEach(geojson, callback) {
	    // validation
	    if (!geojson) throw new Error('geojson is required');

	    flattenEach(geojson, function (feature, featureIndex, multiFeatureIndex) {
	        if (feature.geometry === null) return;
	        var type = feature.geometry.type;
	        var coords = feature.geometry.coordinates;
	        switch (type) {
	        case 'LineString':
	            if (callback(feature, featureIndex, multiFeatureIndex, 0, 0) === false) return false;
	            break;
	        case 'Polygon':
	            for (var geometryIndex = 0; geometryIndex < coords.length; geometryIndex++) {
	                if (callback(helpers.lineString(coords[geometryIndex], feature.properties), featureIndex, multiFeatureIndex, geometryIndex) === false) return false;
	            }
	            break;
	        }
	    });
	}

	/**
	 * Callback for lineReduce
	 *
	 * The first time the callback function is called, the values provided as arguments depend
	 * on whether the reduce method has an initialValue argument.
	 *
	 * If an initialValue is provided to the reduce method:
	 *  - The previousValue argument is initialValue.
	 *  - The currentValue argument is the value of the first element present in the array.
	 *
	 * If an initialValue is not provided:
	 *  - The previousValue argument is the value of the first element present in the array.
	 *  - The currentValue argument is the value of the second element present in the array.
	 *
	 * @callback lineReduceCallback
	 * @param {*} previousValue The accumulated value previously returned in the last invocation
	 * of the callback, or initialValue, if supplied.
	 * @param {Feature<LineString>} currentLine The current LineString|LinearRing being processed.
	 * @param {number} featureIndex The current index of the Feature being processed
	 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed
	 * @param {number} geometryIndex The current index of the Geometry being processed
	 */

	/**
	 * Reduce features in any GeoJSON object, similar to Array.reduce().
	 *
	 * @name lineReduce
	 * @param {Geometry|Feature<LineString|Polygon|MultiLineString|MultiPolygon>} geojson object
	 * @param {Function} callback a method that takes (previousValue, currentLine, featureIndex, multiFeatureIndex, geometryIndex)
	 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
	 * @returns {*} The value that results from the reduction.
	 * @example
	 * var multiPoly = turf.multiPolygon([
	 *   turf.polygon([[[12,48],[2,41],[24,38],[12,48]], [[9,44],[13,41],[13,45],[9,44]]]),
	 *   turf.polygon([[[5, 5], [0, 0], [2, 2], [4, 4], [5, 5]]])
	 * ]);
	 *
	 * turf.lineReduce(multiPoly, function (previousValue, currentLine, featureIndex, multiFeatureIndex, geometryIndex) {
	 *   //=previousValue
	 *   //=currentLine
	 *   //=featureIndex
	 *   //=multiFeatureIndex
	 *   //=geometryIndex
	 *   return currentLine
	 * });
	 */
	function lineReduce(geojson, callback, initialValue) {
	    var previousValue = initialValue;
	    lineEach(geojson, function (currentLine, featureIndex, multiFeatureIndex, geometryIndex) {
	        if (featureIndex === 0 && initialValue === undefined) previousValue = currentLine;
	        else previousValue = callback(previousValue, currentLine, featureIndex, multiFeatureIndex, geometryIndex);
	    });
	    return previousValue;
	}

	/**
	 * Finds a particular 2-vertex LineString Segment from a GeoJSON using `@turf/meta` indexes.
	 *
	 * Negative indexes are permitted.
	 * Point & MultiPoint will always return null.
	 *
	 * @param {FeatureCollection|Feature|Geometry} geojson Any GeoJSON Feature or Geometry
	 * @param {Object} [options={}] Optional parameters
	 * @param {number} [options.featureIndex=0] Feature Index
	 * @param {number} [options.multiFeatureIndex=0] Multi-Feature Index
	 * @param {number} [options.geometryIndex=0] Geometry Index
	 * @param {number} [options.segmentIndex=0] Segment Index
	 * @param {Object} [options.properties={}] Translate Properties to output LineString
	 * @param {BBox} [options.bbox={}] Translate BBox to output LineString
	 * @param {number|string} [options.id={}] Translate Id to output LineString
	 * @returns {Feature<LineString>} 2-vertex GeoJSON Feature LineString
	 * @example
	 * var multiLine = turf.multiLineString([
	 *     [[10, 10], [50, 30], [30, 40]],
	 *     [[-10, -10], [-50, -30], [-30, -40]]
	 * ]);
	 *
	 * // First Segment (defaults are 0)
	 * turf.findSegment(multiLine);
	 * // => Feature<LineString<[[10, 10], [50, 30]]>>
	 *
	 * // First Segment of 2nd Multi Feature
	 * turf.findSegment(multiLine, {multiFeatureIndex: 1});
	 * // => Feature<LineString<[[-10, -10], [-50, -30]]>>
	 *
	 * // Last Segment of Last Multi Feature
	 * turf.findSegment(multiLine, {multiFeatureIndex: -1, segmentIndex: -1});
	 * // => Feature<LineString<[[-50, -30], [-30, -40]]>>
	 */
	function findSegment(geojson, options) {
	    // Optional Parameters
	    options = options || {};
	    if (!helpers.isObject(options)) throw new Error('options is invalid');
	    var featureIndex = options.featureIndex || 0;
	    var multiFeatureIndex = options.multiFeatureIndex || 0;
	    var geometryIndex = options.geometryIndex || 0;
	    var segmentIndex = options.segmentIndex || 0;

	    // Find FeatureIndex
	    var properties = options.properties;
	    var geometry;

	    switch (geojson.type) {
	    case 'FeatureCollection':
	        if (featureIndex < 0) featureIndex = geojson.features.length + featureIndex;
	        properties = properties || geojson.features[featureIndex].properties;
	        geometry = geojson.features[featureIndex].geometry;
	        break;
	    case 'Feature':
	        properties = properties || geojson.properties;
	        geometry = geojson.geometry;
	        break;
	    case 'Point':
	    case 'MultiPoint':
	        return null;
	    case 'LineString':
	    case 'Polygon':
	    case 'MultiLineString':
	    case 'MultiPolygon':
	        geometry = geojson;
	        break;
	    default:
	        throw new Error('geojson is invalid');
	    }

	    // Find SegmentIndex
	    if (geometry === null) return null;
	    var coords = geometry.coordinates;
	    switch (geometry.type) {
	    case 'Point':
	    case 'MultiPoint':
	        return null;
	    case 'LineString':
	        if (segmentIndex < 0) segmentIndex = coords.length + segmentIndex - 1;
	        return helpers.lineString([coords[segmentIndex], coords[segmentIndex + 1]], properties, options);
	    case 'Polygon':
	        if (geometryIndex < 0) geometryIndex = coords.length + geometryIndex;
	        if (segmentIndex < 0) segmentIndex = coords[geometryIndex].length + segmentIndex - 1;
	        return helpers.lineString([coords[geometryIndex][segmentIndex], coords[geometryIndex][segmentIndex + 1]], properties, options);
	    case 'MultiLineString':
	        if (multiFeatureIndex < 0) multiFeatureIndex = coords.length + multiFeatureIndex;
	        if (segmentIndex < 0) segmentIndex = coords[multiFeatureIndex].length + segmentIndex - 1;
	        return helpers.lineString([coords[multiFeatureIndex][segmentIndex], coords[multiFeatureIndex][segmentIndex + 1]], properties, options);
	    case 'MultiPolygon':
	        if (multiFeatureIndex < 0) multiFeatureIndex = coords.length + multiFeatureIndex;
	        if (geometryIndex < 0) geometryIndex = coords[multiFeatureIndex].length + geometryIndex;
	        if (segmentIndex < 0) segmentIndex = coords[multiFeatureIndex][geometryIndex].length - segmentIndex - 1;
	        return helpers.lineString([coords[multiFeatureIndex][geometryIndex][segmentIndex], coords[multiFeatureIndex][geometryIndex][segmentIndex + 1]], properties, options);
	    }
	    throw new Error('geojson is invalid');
	}

	/**
	 * Finds a particular Point from a GeoJSON using `@turf/meta` indexes.
	 *
	 * Negative indexes are permitted.
	 *
	 * @param {FeatureCollection|Feature|Geometry} geojson Any GeoJSON Feature or Geometry
	 * @param {Object} [options={}] Optional parameters
	 * @param {number} [options.featureIndex=0] Feature Index
	 * @param {number} [options.multiFeatureIndex=0] Multi-Feature Index
	 * @param {number} [options.geometryIndex=0] Geometry Index
	 * @param {number} [options.coordIndex=0] Coord Index
	 * @param {Object} [options.properties={}] Translate Properties to output Point
	 * @param {BBox} [options.bbox={}] Translate BBox to output Point
	 * @param {number|string} [options.id={}] Translate Id to output Point
	 * @returns {Feature<Point>} 2-vertex GeoJSON Feature Point
	 * @example
	 * var multiLine = turf.multiLineString([
	 *     [[10, 10], [50, 30], [30, 40]],
	 *     [[-10, -10], [-50, -30], [-30, -40]]
	 * ]);
	 *
	 * // First Segment (defaults are 0)
	 * turf.findPoint(multiLine);
	 * // => Feature<Point<[10, 10]>>
	 *
	 * // First Segment of the 2nd Multi-Feature
	 * turf.findPoint(multiLine, {multiFeatureIndex: 1});
	 * // => Feature<Point<[-10, -10]>>
	 *
	 * // Last Segment of last Multi-Feature
	 * turf.findPoint(multiLine, {multiFeatureIndex: -1, coordIndex: -1});
	 * // => Feature<Point<[-30, -40]>>
	 */
	function findPoint(geojson, options) {
	    // Optional Parameters
	    options = options || {};
	    if (!helpers.isObject(options)) throw new Error('options is invalid');
	    var featureIndex = options.featureIndex || 0;
	    var multiFeatureIndex = options.multiFeatureIndex || 0;
	    var geometryIndex = options.geometryIndex || 0;
	    var coordIndex = options.coordIndex || 0;

	    // Find FeatureIndex
	    var properties = options.properties;
	    var geometry;

	    switch (geojson.type) {
	    case 'FeatureCollection':
	        if (featureIndex < 0) featureIndex = geojson.features.length + featureIndex;
	        properties = properties || geojson.features[featureIndex].properties;
	        geometry = geojson.features[featureIndex].geometry;
	        break;
	    case 'Feature':
	        properties = properties || geojson.properties;
	        geometry = geojson.geometry;
	        break;
	    case 'Point':
	    case 'MultiPoint':
	        return null;
	    case 'LineString':
	    case 'Polygon':
	    case 'MultiLineString':
	    case 'MultiPolygon':
	        geometry = geojson;
	        break;
	    default:
	        throw new Error('geojson is invalid');
	    }

	    // Find Coord Index
	    if (geometry === null) return null;
	    var coords = geometry.coordinates;
	    switch (geometry.type) {
	    case 'Point':
	        return helpers.point(coords, properties, options);
	    case 'MultiPoint':
	        if (multiFeatureIndex < 0) multiFeatureIndex = coords.length + multiFeatureIndex;
	        return helpers.point(coords[multiFeatureIndex], properties, options);
	    case 'LineString':
	        if (coordIndex < 0) coordIndex = coords.length + coordIndex;
	        return helpers.point(coords[coordIndex], properties, options);
	    case 'Polygon':
	        if (geometryIndex < 0) geometryIndex = coords.length + geometryIndex;
	        if (coordIndex < 0) coordIndex = coords[geometryIndex].length + coordIndex;
	        return helpers.point(coords[geometryIndex][coordIndex], properties, options);
	    case 'MultiLineString':
	        if (multiFeatureIndex < 0) multiFeatureIndex = coords.length + multiFeatureIndex;
	        if (coordIndex < 0) coordIndex = coords[multiFeatureIndex].length + coordIndex;
	        return helpers.point(coords[multiFeatureIndex][coordIndex], properties, options);
	    case 'MultiPolygon':
	        if (multiFeatureIndex < 0) multiFeatureIndex = coords.length + multiFeatureIndex;
	        if (geometryIndex < 0) geometryIndex = coords[multiFeatureIndex].length + geometryIndex;
	        if (coordIndex < 0) coordIndex = coords[multiFeatureIndex][geometryIndex].length - coordIndex;
	        return helpers.point(coords[multiFeatureIndex][geometryIndex][coordIndex], properties, options);
	    }
	    throw new Error('geojson is invalid');
	}

	exports.coordEach = coordEach;
	exports.coordReduce = coordReduce;
	exports.propEach = propEach;
	exports.propReduce = propReduce;
	exports.featureEach = featureEach;
	exports.featureReduce = featureReduce;
	exports.coordAll = coordAll;
	exports.geomEach = geomEach;
	exports.geomReduce = geomReduce;
	exports.flattenEach = flattenEach;
	exports.flattenReduce = flattenReduce;
	exports.segmentEach = segmentEach;
	exports.segmentReduce = segmentReduce;
	exports.lineEach = lineEach;
	exports.lineReduce = lineReduce;
	exports.findSegment = findSegment;
	exports.findPoint = findPoint;
	});

	unwrapExports(meta);
	var meta_1 = meta.coordEach;
	var meta_2 = meta.coordReduce;
	var meta_3 = meta.propEach;
	var meta_4 = meta.propReduce;
	var meta_5 = meta.featureEach;
	var meta_6 = meta.featureReduce;
	var meta_7 = meta.coordAll;
	var meta_8 = meta.geomEach;
	var meta_9 = meta.geomReduce;
	var meta_10 = meta.flattenEach;
	var meta_11 = meta.flattenReduce;
	var meta_12 = meta.segmentEach;
	var meta_13 = meta.segmentReduce;
	var meta_14 = meta.lineEach;
	var meta_15 = meta.lineReduce;
	var meta_16 = meta.findSegment;
	var meta_17 = meta.findPoint;

	// Adds floating point numbers with twice the normal precision.
	// Reference: J. R. Shewchuk, Adaptive Precision Floating-Point Arithmetic and
	// Fast Robust Geometric Predicates, Discrete & Computational Geometry 18(3)
	// 305–363 (1997).
	// Code adapted from GeographicLib by Charles F. F. Karney,
	// http://geographiclib.sourceforge.net/

	function adder() {
	  return new Adder;
	}

	function Adder() {
	  this.reset();
	}

	Adder.prototype = {
	  constructor: Adder,
	  reset: function() {
	    this.s = // rounded value
	    this.t = 0; // exact error
	  },
	  add: function(y) {
	    add(temp, y, this.t);
	    add(this, temp.s, this.s);
	    if (this.s) this.t += temp.t;
	    else this.s = temp.t;
	  },
	  valueOf: function() {
	    return this.s;
	  }
	};

	var temp = new Adder;

	function add(adder, a, b) {
	  var x = adder.s = a + b,
	      bv = x - a,
	      av = x - bv;
	  adder.t = (a - av) + (b - bv);
	}

	var pi = Math.PI;
	var tau = pi * 2;

	var abs = Math.abs;
	var sqrt = Math.sqrt;

	function noop$1() {}

	function streamGeometry(geometry, stream) {
	  if (geometry && streamGeometryType.hasOwnProperty(geometry.type)) {
	    streamGeometryType[geometry.type](geometry, stream);
	  }
	}

	var streamObjectType = {
	  Feature: function(object, stream) {
	    streamGeometry(object.geometry, stream);
	  },
	  FeatureCollection: function(object, stream) {
	    var features = object.features, i = -1, n = features.length;
	    while (++i < n) streamGeometry(features[i].geometry, stream);
	  }
	};

	var streamGeometryType = {
	  Sphere: function(object, stream) {
	    stream.sphere();
	  },
	  Point: function(object, stream) {
	    object = object.coordinates;
	    stream.point(object[0], object[1], object[2]);
	  },
	  MultiPoint: function(object, stream) {
	    var coordinates = object.coordinates, i = -1, n = coordinates.length;
	    while (++i < n) object = coordinates[i], stream.point(object[0], object[1], object[2]);
	  },
	  LineString: function(object, stream) {
	    streamLine(object.coordinates, stream, 0);
	  },
	  MultiLineString: function(object, stream) {
	    var coordinates = object.coordinates, i = -1, n = coordinates.length;
	    while (++i < n) streamLine(coordinates[i], stream, 0);
	  },
	  Polygon: function(object, stream) {
	    streamPolygon(object.coordinates, stream);
	  },
	  MultiPolygon: function(object, stream) {
	    var coordinates = object.coordinates, i = -1, n = coordinates.length;
	    while (++i < n) streamPolygon(coordinates[i], stream);
	  },
	  GeometryCollection: function(object, stream) {
	    var geometries = object.geometries, i = -1, n = geometries.length;
	    while (++i < n) streamGeometry(geometries[i], stream);
	  }
	};

	function streamLine(coordinates, stream, closed) {
	  var i = -1, n = coordinates.length - closed, coordinate;
	  stream.lineStart();
	  while (++i < n) coordinate = coordinates[i], stream.point(coordinate[0], coordinate[1], coordinate[2]);
	  stream.lineEnd();
	}

	function streamPolygon(coordinates, stream) {
	  var i = -1, n = coordinates.length;
	  stream.polygonStart();
	  while (++i < n) streamLine(coordinates[i], stream, 1);
	  stream.polygonEnd();
	}

	function geoStream(object, stream) {
	  if (object && streamObjectType.hasOwnProperty(object.type)) {
	    streamObjectType[object.type](object, stream);
	  } else {
	    streamGeometry(object, stream);
	  }
	}

	var areaRingSum = adder();

	var areaSum = adder();

	var deltaSum = adder();

	var sum = adder();

	function ascending$1(a, b) {
	  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
	}

	function bisector$1(compare) {
	  if (compare.length === 1) compare = ascendingComparator$1(compare);
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

	function ascendingComparator$1(f) {
	  return function(d, x) {
	    return ascending$1(f(d), x);
	  };
	}

	var ascendingBisect$1 = bisector$1(ascending$1);

	var lengthSum = adder();

	function identity$2(x) {
	  return x;
	}

	var areaSum$1 = adder(),
	    areaRingSum$1 = adder(),
	    x00,
	    y00,
	    x0,
	    y0;

	var areaStream = {
	  point: noop$1,
	  lineStart: noop$1,
	  lineEnd: noop$1,
	  polygonStart: function() {
	    areaStream.lineStart = areaRingStart;
	    areaStream.lineEnd = areaRingEnd;
	  },
	  polygonEnd: function() {
	    areaStream.lineStart = areaStream.lineEnd = areaStream.point = noop$1;
	    areaSum$1.add(abs(areaRingSum$1));
	    areaRingSum$1.reset();
	  },
	  result: function() {
	    var area = areaSum$1 / 2;
	    areaSum$1.reset();
	    return area;
	  }
	};

	function areaRingStart() {
	  areaStream.point = areaPointFirst;
	}

	function areaPointFirst(x, y) {
	  areaStream.point = areaPoint;
	  x00 = x0 = x, y00 = y0 = y;
	}

	function areaPoint(x, y) {
	  areaRingSum$1.add(y0 * x - x0 * y);
	  x0 = x, y0 = y;
	}

	function areaRingEnd() {
	  areaPoint(x00, y00);
	}

	var x0$1 = Infinity,
	    y0$1 = x0$1,
	    x1 = -x0$1,
	    y1 = x1;

	var boundsStream = {
	  point: boundsPoint,
	  lineStart: noop$1,
	  lineEnd: noop$1,
	  polygonStart: noop$1,
	  polygonEnd: noop$1,
	  result: function() {
	    var bounds = [[x0$1, y0$1], [x1, y1]];
	    x1 = y1 = -(y0$1 = x0$1 = Infinity);
	    return bounds;
	  }
	};

	function boundsPoint(x, y) {
	  if (x < x0$1) x0$1 = x;
	  if (x > x1) x1 = x;
	  if (y < y0$1) y0$1 = y;
	  if (y > y1) y1 = y;
	}

	// TODO Enforce positive area for exterior, negative area for interior?

	var X0 = 0,
	    Y0 = 0,
	    Z0 = 0,
	    X1 = 0,
	    Y1 = 0,
	    Z1 = 0,
	    X2 = 0,
	    Y2 = 0,
	    Z2 = 0,
	    x00$1,
	    y00$1,
	    x0$2,
	    y0$2;

	var centroidStream = {
	  point: centroidPoint,
	  lineStart: centroidLineStart,
	  lineEnd: centroidLineEnd,
	  polygonStart: function() {
	    centroidStream.lineStart = centroidRingStart;
	    centroidStream.lineEnd = centroidRingEnd;
	  },
	  polygonEnd: function() {
	    centroidStream.point = centroidPoint;
	    centroidStream.lineStart = centroidLineStart;
	    centroidStream.lineEnd = centroidLineEnd;
	  },
	  result: function() {
	    var centroid = Z2 ? [X2 / Z2, Y2 / Z2]
	        : Z1 ? [X1 / Z1, Y1 / Z1]
	        : Z0 ? [X0 / Z0, Y0 / Z0]
	        : [NaN, NaN];
	    X0 = Y0 = Z0 =
	    X1 = Y1 = Z1 =
	    X2 = Y2 = Z2 = 0;
	    return centroid;
	  }
	};

	function centroidPoint(x, y) {
	  X0 += x;
	  Y0 += y;
	  ++Z0;
	}

	function centroidLineStart() {
	  centroidStream.point = centroidPointFirstLine;
	}

	function centroidPointFirstLine(x, y) {
	  centroidStream.point = centroidPointLine;
	  centroidPoint(x0$2 = x, y0$2 = y);
	}

	function centroidPointLine(x, y) {
	  var dx = x - x0$2, dy = y - y0$2, z = sqrt(dx * dx + dy * dy);
	  X1 += z * (x0$2 + x) / 2;
	  Y1 += z * (y0$2 + y) / 2;
	  Z1 += z;
	  centroidPoint(x0$2 = x, y0$2 = y);
	}

	function centroidLineEnd() {
	  centroidStream.point = centroidPoint;
	}

	function centroidRingStart() {
	  centroidStream.point = centroidPointFirstRing;
	}

	function centroidRingEnd() {
	  centroidPointRing(x00$1, y00$1);
	}

	function centroidPointFirstRing(x, y) {
	  centroidStream.point = centroidPointRing;
	  centroidPoint(x00$1 = x0$2 = x, y00$1 = y0$2 = y);
	}

	function centroidPointRing(x, y) {
	  var dx = x - x0$2,
	      dy = y - y0$2,
	      z = sqrt(dx * dx + dy * dy);

	  X1 += z * (x0$2 + x) / 2;
	  Y1 += z * (y0$2 + y) / 2;
	  Z1 += z;

	  z = y0$2 * x - x0$2 * y;
	  X2 += z * (x0$2 + x);
	  Y2 += z * (y0$2 + y);
	  Z2 += z * 3;
	  centroidPoint(x0$2 = x, y0$2 = y);
	}

	function PathContext(context) {
	  this._context = context;
	}

	PathContext.prototype = {
	  _radius: 4.5,
	  pointRadius: function(_) {
	    return this._radius = _, this;
	  },
	  polygonStart: function() {
	    this._line = 0;
	  },
	  polygonEnd: function() {
	    this._line = NaN;
	  },
	  lineStart: function() {
	    this._point = 0;
	  },
	  lineEnd: function() {
	    if (this._line === 0) this._context.closePath();
	    this._point = NaN;
	  },
	  point: function(x, y) {
	    switch (this._point) {
	      case 0: {
	        this._context.moveTo(x, y);
	        this._point = 1;
	        break;
	      }
	      case 1: {
	        this._context.lineTo(x, y);
	        break;
	      }
	      default: {
	        this._context.moveTo(x + this._radius, y);
	        this._context.arc(x, y, this._radius, 0, tau);
	        break;
	      }
	    }
	  },
	  result: noop$1
	};

	var lengthSum$1 = adder(),
	    lengthRing,
	    x00$2,
	    y00$2,
	    x0$3,
	    y0$3;

	var lengthStream = {
	  point: noop$1,
	  lineStart: function() {
	    lengthStream.point = lengthPointFirst;
	  },
	  lineEnd: function() {
	    if (lengthRing) lengthPoint(x00$2, y00$2);
	    lengthStream.point = noop$1;
	  },
	  polygonStart: function() {
	    lengthRing = true;
	  },
	  polygonEnd: function() {
	    lengthRing = null;
	  },
	  result: function() {
	    var length = +lengthSum$1;
	    lengthSum$1.reset();
	    return length;
	  }
	};

	function lengthPointFirst(x, y) {
	  lengthStream.point = lengthPoint;
	  x00$2 = x0$3 = x, y00$2 = y0$3 = y;
	}

	function lengthPoint(x, y) {
	  x0$3 -= x, y0$3 -= y;
	  lengthSum$1.add(sqrt(x0$3 * x0$3 + y0$3 * y0$3));
	  x0$3 = x, y0$3 = y;
	}

	function PathString() {
	  this._string = [];
	}

	PathString.prototype = {
	  _radius: 4.5,
	  _circle: circle(4.5),
	  pointRadius: function(_) {
	    if ((_ = +_) !== this._radius) this._radius = _, this._circle = null;
	    return this;
	  },
	  polygonStart: function() {
	    this._line = 0;
	  },
	  polygonEnd: function() {
	    this._line = NaN;
	  },
	  lineStart: function() {
	    this._point = 0;
	  },
	  lineEnd: function() {
	    if (this._line === 0) this._string.push("Z");
	    this._point = NaN;
	  },
	  point: function(x, y) {
	    switch (this._point) {
	      case 0: {
	        this._string.push("M", x, ",", y);
	        this._point = 1;
	        break;
	      }
	      case 1: {
	        this._string.push("L", x, ",", y);
	        break;
	      }
	      default: {
	        if (this._circle == null) this._circle = circle(this._radius);
	        this._string.push("M", x, ",", y, this._circle);
	        break;
	      }
	    }
	  },
	  result: function() {
	    if (this._string.length) {
	      var result = this._string.join("");
	      this._string = [];
	      return result;
	    } else {
	      return null;
	    }
	  }
	};

	function circle(radius) {
	  return "m0," + radius
	      + "a" + radius + "," + radius + " 0 1,1 0," + -2 * radius
	      + "a" + radius + "," + radius + " 0 1,1 0," + 2 * radius
	      + "z";
	}

	function geoPath(projection, context) {
	  var pointRadius = 4.5,
	      projectionStream,
	      contextStream;

	  function path(object) {
	    if (object) {
	      if (typeof pointRadius === "function") contextStream.pointRadius(+pointRadius.apply(this, arguments));
	      geoStream(object, projectionStream(contextStream));
	    }
	    return contextStream.result();
	  }

	  path.area = function(object) {
	    geoStream(object, projectionStream(areaStream));
	    return areaStream.result();
	  };

	  path.measure = function(object) {
	    geoStream(object, projectionStream(lengthStream));
	    return lengthStream.result();
	  };

	  path.bounds = function(object) {
	    geoStream(object, projectionStream(boundsStream));
	    return boundsStream.result();
	  };

	  path.centroid = function(object) {
	    geoStream(object, projectionStream(centroidStream));
	    return centroidStream.result();
	  };

	  path.projection = function(_) {
	    return arguments.length ? (projectionStream = _ == null ? (projection = null, identity$2) : (projection = _).stream, path) : projection;
	  };

	  path.context = function(_) {
	    if (!arguments.length) return context;
	    contextStream = _ == null ? (context = null, new PathString) : new PathContext(context = _);
	    if (typeof pointRadius !== "function") contextStream.pointRadius(pointRadius);
	    return path;
	  };

	  path.pointRadius = function(_) {
	    if (!arguments.length) return pointRadius;
	    pointRadius = typeof _ === "function" ? _ : (contextStream.pointRadius(+_), +_);
	    return path;
	  };

	  return path.projection(projection).context(context);
	}

	function isInvalid (value) {
	  if (value === undefined || value === null) { return true }

	  if (value.constructor === Number) {
	    return !isFinite(value)
	  }

	  return false
	}

	function calculateBbox (features) {
	  let bbox = [[Infinity, Infinity], [-Infinity, -Infinity]];

	  features.forEach(feature => {
	    if (!isInvalid(feature)) {
	      bbox = updateBBox(bbox, feature);
	    }
	  });

	  let bboxObj = {
	    x: [bbox[0][0], bbox[1][0]],
	    y: [bbox[0][1], bbox[1][1]]
	  };

	  return bboxObj
	}

	const path = geoPath();

	function updateBBox (bbox, geometry) {
	  let newBBox = path.bounds(geometry);

	  bbox[0][0] = bbox[0][0] < newBBox[0][0] ? bbox[0][0] : newBBox[0][0];
	  bbox[0][1] = bbox[0][1] < newBBox[0][1] ? bbox[0][1] : newBBox[0][1];
	  bbox[1][0] = bbox[1][0] > newBBox[1][0] ? bbox[1][0] : newBBox[1][0];
	  bbox[1][1] = bbox[1][1] > newBBox[1][1] ? bbox[1][1] : newBBox[1][1];

	  return bbox
	}

	function calculateDomainsAndGetTypes (data) {
	  let domains = {};
	  let types = {};

	  for (let columnName in data) {
	    let column = data[columnName];

	    let { domain, type } = calculateColumnDomainAndGetType(column, columnName);

	    domains[columnName] = domain;
	    types[columnName] = type;
	  }

	  return { domains, types }
	}

	function calculateColumnDomainAndGetType (column, columnName) {
	  let { firstValidValue, nValidValues } = findFirstValidValue(column);

	  if (nValidValues === 0) {
	    return createDummyDomainAndType(columnName)
	  }

	  if (nValidValues > 0) {
	    let type = getDataType(firstValidValue);
	    let domain;

	    if (columnName === '$geometry') {
	      domain = calculateBbox(column);
	    }

	    if (columnName !== '$geometry') {
	      domain = calculateColumnDomain(column, columnName, nValidValues, firstValidValue, type);
	    }

	    return { domain, type }
	  }
	}

	function findFirstValidValue (column) {
	  let firstValidValue;
	  let nValidValues = 0;

	  for (let i = 0; i < column.length; i++) {
	    if (!isInvalid(column[i])) {
	      nValidValues++;
	      firstValidValue = firstValidValue || column[i];
	    }

	    if (nValidValues > 1) break
	  }

	  return { firstValidValue, nValidValues }
	}

	function createDummyDomainAndType (columnName) {
	  let domain = [0, 1];
	  let type = 'quantitative';

	  console.warn(`Column '${columnName}' contains no valid values.`);
	  console.warn('Using domain [0, 1] as placeholder.');

	  return { domain, type }
	}

	function calculateColumnDomain (column, columnName, nValidValues, firstValidValue, type) {
	  let domain;
	  let nUniqueValues = calculateNumberOfUniqueValues(column);

	  if (isIrregularColumn(nValidValues, nUniqueValues)) {
	    domain = calculateDomainForIrregularColumn(nValidValues, nUniqueValues, type, firstValidValue, columnName);
	  } else {
	    domain = calculateDomainForRegularColumn(type, column, columnName);
	  }

	  return domain
	}

	function calculateNumberOfUniqueValues (col) {
	  let uniqueVals = {};
	  for (let val of col) {
	    let str = JSON.stringify(val);
	    uniqueVals[str] = 0;
	  }

	  return Object.keys(uniqueVals).length
	}

	function isIrregularColumn (nValidValues, nUniqueValues) {
	  return nValidValues === 1 || nUniqueValues === 1
	}

	function calculateDomainForIrregularColumn (nValidValues, nUniqueValues, type, firstValidValue, columnName) {
	  let domain;

	  if (nValidValues === 1) {
	    domain = createDomainForSingleValue(type, firstValidValue);

	    if (type !== 'categorical') {
	      console.warn(`Column '${columnName}' contains only 1 valid value: ${firstValidValue}.`);
	      console.warn(`Using domain ${JSON.stringify(domain)}`);
	    }
	  } else if (nUniqueValues === 1) {
	    domain = createDomainForSingleValue(type, firstValidValue);

	    if (type !== 'categorical') {
	      console.warn(`Column '${columnName}' contains only 1 unique value: ${firstValidValue}.`);
	      console.warn(`Using domain ${JSON.stringify(domain)}`);
	    }
	  }

	  return domain
	}

	function calculateDomainForRegularColumn (type, column, columnName) {
	  let domain = initDomain(type);

	  for (let i = 0; i < column.length; i++) {
	    let value = column[i];

	    if (!isInvalid(value)) {
	      if (getDataType(value) !== type) {
	        throw new Error(`Invalid column ${columnName}: column contains multiple data types`)
	      }

	      domain = updateDomain(domain, value, type);
	    }
	  }

	  return domain
	}

	const minUnixTime = new Date(0);
	const maxUnixTime = new Date('19 January 2038');

	function initDomain (type) {
	  let domain;
	  switch (type) {
	    case 'quantitative': {
	      domain = [Infinity, -Infinity];
	      break
	    }
	    case 'categorical': {
	      domain = [];
	      break
	    }
	    case 'temporal': {
	      domain = [maxUnixTime, minUnixTime];
	      break
	    }
	    case 'interval:quantitative': {
	      domain = [Infinity, -Infinity];
	      break
	    }
	    case 'interval:temporal': {
	      domain = [maxUnixTime, minUnixTime];
	      break
	    }
	  }

	  return domain
	}

	function updateDomain (domain, value, type) {
	  if (type === 'quantitative') {
	    if (domain[0] >= value) { domain[0] = value; }
	    if (domain[1] <= value) { domain[1] = value; }
	  }

	  if (type === 'categorical') {
	    if (!domain.includes(value)) { domain.push(value); }
	  }

	  if (type === 'temporal') {
	    let epoch = value.getTime();

	    if (domain[0].getTime() >= epoch) { domain[0] = value; }
	    if (domain[1].getTime() <= epoch) { domain[1] = value; }
	  }

	  if (type.startsWith('interval')) {
	    let intervalType = type.split(':')[1];
	    domain = updateDomain(domain, value[0], intervalType);
	    domain = updateDomain(domain, value[1], intervalType);
	  }

	  return domain
	}

	function createDomainForSingleValue (type, value) {
	  let domain;

	  if (type === 'quantitative') {
	    domain = [value - 1, value + 1];
	  }

	  if (type === 'categorical') {
	    domain = [value];
	  }

	  if (type === 'temporal') {
	    domain = [getDay(value, -1), getDay(value, 1)];
	  }

	  if (type.startsWith('interval')) {
	    domain = value;
	  }

	  return domain
	}

	function getDay (date, days) {
	  return new Date(new Date().setDate(date.getDate() + days))
	}

	function columnPathIsValid (columnPath, dataContainer) {
	  try {
	    checkColumnPath(columnPath, dataContainer);
	    return true
	  } catch (e) {
	    return false
	  }
	}

	function checkColumnPath (columnPath, dataContainer) {
	  let columnPathArray = columnPath.split('/');
	  parseColumnPath(columnPathArray, dataContainer, columnPath);
	}

	function checkIfColumnExists (columnName, dataContainer) {
	  if (!dataContainer.data().hasOwnProperty(columnName)) {
	    throw new Error(`Invalid column name: '${columnName}'`)
	  }
	}

	function getColumn (columnPath, dataContainer) {
	  let columnPathArray = columnPath.split('/');
	  return traverseColumnPath(columnPathArray, dataContainer)
	}

	function mapColumn (columnPath, dataContainer, mapFunction) {
	  let column = getColumn(columnPath, dataContainer);
	  let levels = columnPath.split('/').length;
	  return mapRecursive(levels, column, mapFunction)
	}

	function parseColumnPath (columnPathArray, dataContainer, originalPath) {
	  let data = dataContainer.data();
	  let ownColumnName = columnPathArray[0];
	  ensureDataHasColumn(data, ownColumnName, originalPath);

	  if (columnPathArray.length > 1) {
	    ensureColumnIsGrouped(ownColumnName, originalPath);

	    let nestedColumnPathArray = removeFirstElement(columnPathArray);
	    let groupedColumn = data.$grouped;

	    parseColumnPath(nestedColumnPathArray, groupedColumn[0], originalPath);
	  }
	}

	function ensureDataHasColumn (data, columnName, originalPath) {
	  if (!data.hasOwnProperty(columnName)) throw columnNotFoundError(columnName, originalPath)
	}

	function ensureColumnIsGrouped (columnName, originalPath) {
	  if (columnName !== '$grouped') throw invalidColumnPathError(originalPath)
	}

	function removeFirstElement (array) {
	  return array.splice(1, array.length - 1)
	}

	function traverseColumnPath (columnPathArray, dataContainer) {
	  let newColumn = [];
	  let ownColumnName = columnPathArray[0];
	  let data = dataContainer.data();

	  if (columnPathArray.length === 1) {
	    newColumn = data[ownColumnName];
	  }

	  if (columnPathArray.length > 1) {
	    let groupedColumn = data[ownColumnName];
	    let nestedColumnPathArray = removeFirstElement(columnPathArray);

	    groupedColumn.forEach(groupedContainer => {
	      newColumn.push(
	        traverseColumnPath(nestedColumnPathArray, groupedContainer)
	      );
	    });
	  }

	  return newColumn
	}

	function mapRecursive (levels, column, mapFunction) {
	  if (levels === 1) {
	    return column.map(mapFunction)
	  } else {
	    levels--;
	    return column.map(nestedColumn => mapRecursive(levels, nestedColumn, mapFunction))
	  }
	}

	const columnNotFoundError = (columnName, originalPath) => {
	  return new Error(`Could not find column '${columnName}' while traversing column path '${originalPath}'`)
	};
	const invalidColumnPathError = columnPath => new Error(`Invalid column path: '${columnPath}`);

	const methods$1 = {
	  domain (columnName) {
	    checkIfColumnExists(columnName, this);
	    return this._domains[columnName]
	  },

	  type (columnName) {
	    checkIfColumnExists(columnName, this);
	    return this._types[columnName]
	  },

	  _calculateDomainsAndTypes () {
	    let { domains, types } = calculateDomainsAndGetTypes(this._data);
	    this._domains = domains;
	    this._types = types;
	  }
	};

	function domainsAndTypesMixin (targetClass) {
	  Object.assign(targetClass.prototype, methods$1);
	}

	function filter (data, filterFunction) {
	  let length = getDataLength(data);

	  let i = length;

	  while (i--) {
	    let row = {};
	    for (let colName in data) { row[colName] = data[colName][i]; }

	    if (!filterFunction(row, i)) {
	      for (let colName in data) {
	        data[colName].splice(i, 1);
	      }
	    }
	  }
	}

	function select (data, selection) {
	  if (selection.constructor === String) {
	    selection = [selection];
	  } 
	  
	  if (selection.constructor === Array) {
	    for (let key in data) {
	      if (!selection.includes(key)) {
	        delete data[key];
	      }
	    }
	  } else {
	    throw new Error('select can only be used with a string or array of strings')
	  }
	}

	function arrange (data, sortInstructions) {
	  if (sortInstructions.constructor === Object) {
	    sort(data, sortInstructions);
	  } else if (sortInstructions.constructor === Array) {
	    for (let i = sortInstructions.length - 1; i >= 0; i--) {
	      let instruction = sortInstructions[i];
	      sort(data, instruction);
	    }
	  } else {
	    throw new Error('arrange requires a key-value object or array of key-value objects')
	  }
	}

	const sortFuncs = {
	  quantitative: {
	    // https://beta.observablehq.com/@mbostock/manipulating-flat-arrays
	    ascending: (a, b) => a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN,
	    descending: (a, b) => b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN
	  },
	  categorical: {
	    ascending: (a, b) => {
	      let sorted = [a, b].sort();
	      return sorted[0] === a ? -1 : 1
	    },
	    descending: (a, b) => {
	      let sorted = [a, b].sort();
	      return sorted[0] === a ? 1 : -1
	    }
	  },
	  temporal: {
	    ascending: (c, d) => {
	      let a = c.getTime();
	      let b = c.getTime();
	      return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN
	    },
	    descending: (c, d) => {
	      let a = c.getTime();
	      let b = c.getTime();
	      return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN
	    }
	  }
	};

	function sort (data, sortInstructions) {
	  if (Object.keys(sortInstructions).length !== 1) {
	    throw new Error('Only one key-value pair allowed')
	  }

	  let variable = Object.keys(sortInstructions)[0];
	  let sortMethod = sortInstructions[variable];

	  let dataType = getDataType(data[variable][0]);

	  let sortFunc;
	  if (sortMethod.constructor === String) {
	    sortFunc = sortFuncs[dataType][sortMethod];
	  }
	  if (sortMethod.constructor === Function) {
	    sortFunc = sortMethod;
	  }

	  let column = data[variable];

	  let indices = column.map((v, i) => i);
	  let sortedIndices = indices.sort((a, b) => sortFunc(column[a], column[b]));

	  for (let colName in data) {
	    data[colName] = reorder(data[colName], sortedIndices);
	  }
	}

	function reorder (column, indices) {
	  return indices.map(i => column[i])
	}

	function rename (data, renameInstructions) {
	  if (renameInstructions.constructor !== Object) {
	    throw new Error('Rename only accepts an object')
	  }

	  for (let oldName in renameInstructions) {
	    if (data.hasOwnProperty(oldName)) {
	      let newName = renameInstructions[oldName];
	      checkRegularColumnName(newName);
	      data[newName] = data[oldName];
	      delete data[oldName];
	    } else {
	      console.warn(`Rename: column '${oldName}' not found`);
	    }
	  }
	}

	function mutate (data, mutateInstructions) {
	  let length = getDataLength(data);

	  for (let key in mutateInstructions) {
	    data[key] = new Array(length);
	  }

	  for (let i = 0; i < length; i++) {
	    let row = {};
	    let prevRow = {};
	    let nextRow = {};

	    for (let colName in data) {
	      row[colName] = data[colName][i];
	      prevRow[colName] = data[colName][i - 1];
	      nextRow[colName] = data[colName][i + 1];
	    }

	    if (i === 0) { prevRow = undefined; }
	    if (i === length - 1) { nextRow = undefined; }

	    for (let key in mutateInstructions) {
	      let mutateFunction = mutateInstructions[key];
	      data[key][i] = mutateFunction(row, i, prevRow, nextRow);
	    }
	  }
	}

	function transmute (data, mutateObj) {
	  data = mutate(data, mutateObj);

	  for (let key in data) {
	    if (!mutateObj.hasOwnProperty(key)) {
	      delete data[key];
	    }
	  }
	}

	var aggregations = {
	  count,
	  sum: sum$1,
	  mean,
	  median,
	  mode,
	  min,
	  max
	};

	function count (column) {
	  return column.length
	}

	function sum$1 (column) {
	  let total = 0;
	  for (let value of column) {
	    total += value;
	  }

	  return total
	}

	function mean (column) {
	  return sum$1(column) / count(column)
	}

	function median (column) {
	  let asc = column.sort((a, b) => a > b);
	  let len = count(column);

	  if (len % 2 === 1) {
	    // Odd
	    return asc[Math.floor(len / 2)]
	  } else {
	    // Even
	    let lower = asc[(len / 2) - 1];
	    let upper = asc[(len / 2)];
	    return (lower + upper) / 2
	  }
	}

	function mode (column) {
	  let counts = {};

	  for (let value of column) {
	    if (counts.hasOwnProperty(value)) {
	      counts[value]++;
	    } else {
	      counts[value] = 1;
	    }
	  }

	  let winner;
	  let winningVal = 0;

	  for (let value in counts) {
	    if (counts[value] > winningVal) {
	      winningVal = counts[value];
	      winner = value;
	    }
	  }

	  return winner
	}

	function min (column) {
	  let winner = Infinity;
	  for (let value of column) {
	    if (value < winner) { winner = value; }
	  }
	  return winner
	}

	function max (column) {
	  let winner = -Infinity;
	  for (let value of column) {
	    if (value > winner) { winner = value; }
	  }
	  return winner
	}

	function checkKeyValuePair (obj, allowedKeys) {
	  let keys = Object.keys(obj);
	  if (keys.length !== 1) {
	    throw new Error('Invalid transformation syntax')
	  }

	  let key = keys[0];

	  if (!allowedKeys.includes(key)) {
	    throw new Error(`Unknown transformation ${key}`)
	  }

	  return key
	}

	function summarise (data, summariseInstructions) {
	  if (summariseInstructions.constructor !== Object) {
	    throw new Error('summarise must be an object')
	  }

	  let newData = initNewData(summariseInstructions, data);

	  if (data.hasOwnProperty('$grouped')) {
	    checkSummariseInstructions(summariseInstructions, data);

	    for (let columnName in data) {
	      if (columnName !== '$grouped') {
	        newData[columnName] = data[columnName];
	      }
	    }

	    for (let group of data.$grouped) {
	      let data = group.data();
	      newData = summariseGroup(data, summariseInstructions, newData);
	    }
	  } else {
	    newData = summariseGroup(data, summariseInstructions, newData);
	  }
	  return newData
	}

	function initNewData (summariseInstructions, data) {
	  let newData = {};
	  for (let newCol in summariseInstructions) { newData[newCol] = []; }
	  if (data && data.hasOwnProperty('$grouped')) {
	    for (let col in data) {
	      if (col !== '$grouped') {
	        newData[col] = [];
	      }
	    }
	  }
	  return newData
	}

	function summariseGroup (data, summariseInstructions, newData) {
	  for (let newColName in summariseInstructions) {
	    let instruction = summariseInstructions[newColName];

	    // If the aggregation instructions are an Object, only one column will be
	    // used as summary: the column that is used as key in the Object
	    if (instruction.constructor === Object) {
	      let column = checkKeyValuePair(instruction, Object.keys(data));
	      let aggregation = instruction[column];

	      if (aggregation.constructor === String) {
	        newData[newColName].push(aggregations[aggregation](data[column]));
	      } else if (aggregation.constructor === Function) {
	        newData[newColName].push(aggregation(data[column]));
	      } else {
	        throw new Error(`Invalid aggregation instruction: ${aggregation}. Must be String or Function`)
	      }
	    }

	    // If the instruction is a Function, it will be passed the entire group,
	    // and is expected to return a completely new dataframe.
	    if (instruction.constructor === Function) {
	      newData[newColName].push(instruction(data));
	    }
	  }

	  return newData
	}

	function checkSummariseInstructions (summariseInstructions, data) {
	  for (let newColName in summariseInstructions) {
	    let instruction = summariseInstructions[newColName];
	    let name = Object.keys(instruction)[0];

	    checkRegularColumnName(name);

	    if (data.hasOwnProperty(name)) {
	      throw new Error(`Cannot summarise the column '${name}': used for grouping`)
	    }
	  }
	}

	function mutarise (data, mutariseInstructions) {
	  if (mutariseInstructions.constructor !== Object) {
	    throw new Error('mutarise must be an object')
	  }

	  let newCols = initNewData(mutariseInstructions);

	  if (data.hasOwnProperty('$grouped')) {
	    checkSummariseInstructions(mutariseInstructions, data);

	    for (let group of data.$grouped) {
	      let summarizedData = initNewData(mutariseInstructions);
	      let dataInGroup = group.data();
	      summarizedData = summariseGroup(dataInGroup, mutariseInstructions, summarizedData);

	      let length = getDataLength(dataInGroup);
	      newCols = addGroupSummaries(newCols, summarizedData, length);
	    }

	    data = ungroup(data);
	  } else {
	    let summarizedData = initNewData(mutariseInstructions);
	    summarizedData = summariseGroup(data, mutariseInstructions, summarizedData);

	    let length = getDataLength(data);
	    newCols = addGroupSummaries(newCols, summarizedData, length);
	  }

	  return join(data, newCols)
	}

	function addGroupSummaries (newCols, summarizedData, length) {
	  for (let i = 0; i < length; i++) {
	    for (let key in summarizedData) {
	      newCols[key].push(summarizedData[key][0]);
	    }
	  }

	  return newCols
	}

	function ungroup (data) {
	  let newData = initNewData(data.$grouped[0].data());

	  for (let group of data.$grouped) {
	    let groupData = group.data();
	    for (let col in newData) {
	      newData[col].push(...groupData[col]);
	    }
	  }

	  return newData
	}

	function join (data, newCols) {
	  for (let col in newCols) {
	    data[col] = newCols[col];
	  }

	  return data
	}

	function groupBy (data, groupByInstructions) {
	  let groupedData = {};

	  let groupedColumns = getGroupedColumns(data, groupByInstructions);
	  let groups = groupBy$1(data, groupedColumns);

	  groupedData.$grouped = groups.map(group => new DataContainer(group));
	  for (let col of groupedColumns) {
	    groupedData[col] = [];
	  }

	  for (let i = 0; i < groupedColumns.length; i++) {
	    let col = groupedColumns[i];

	    for (let group of groups) {
	      groupedData[col].push(group.groupedValues[i]);
	    }
	  }

	  return groupedData
	}

	function getGroupedColumns (data, groupByInstructions) {
	  let con = groupByInstructions.constructor;
	  if (![String, Array].includes(con)) {
	    throw new Error('groupBy can only be used with a string or array of strings')
	  }

	  let groupedColumns = con === String ? [groupByInstructions] : groupByInstructions;

	  for (let col of groupedColumns) {
	    if (!data.hasOwnProperty(col)) {
	      throw new Error(`Column '${col}' not found`)
	    }
	  }

	  if (groupedColumns.length === Object.keys(data).length) {
	    throw new Error('Cannot group by all columns')
	  }

	  return groupedColumns
	}

	function getGroupedValues (data, i, columns) {
	  let groupedValues = [];
	  for (let col of columns) {
	    groupedValues.push(data[col][i]);
	  }

	  return groupedValues
	}

	function groupBy$1 (data, groupedColumns) {
	  let groups = {};

	  let i = 0;

	  let length = getDataLength(data);

	  while (i < length) {
	    // Ge grouped values
	    let groupedValues = getGroupedValues(data, i, groupedColumns);

	    // Get unique identifier for group
	    let groupID = JSON.stringify(groupedValues);

	    // If groups object has no entry for this group yet: create new group object
	    groups[groupID] = groups[groupID] || new Group(data, groupedValues);

	    // Add row to group
	    groups[groupID].addRow(data, i);
	    i++;
	  }

	  // Convert groups object to array
	  return Object.keys(groups).map(group => {
	    return groups[group]
	  })
	}

	class Group {
	  constructor (data, groupedValues) {
	    this.data = {};
	    this.groupedValues = groupedValues;

	    for (let col in data) {
	      this.data[col] = [];
	    }
	  }

	  addRow (data, i) {
	    for (let col in data) {
	      this.data[col].push(data[col][i]);
	    }
	  }
	}

	/**
	* geostats() is a tiny and standalone javascript library for classification
	* Project page - https://github.com/simogeo/geostats
	* Copyright (c) 2011 Simon Georget, http://www.intermezzo-coop.eu
	* Licensed under the MIT license
	*/

	var _t = function (str) {
	  return str
	};

	// taking from http://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric
	var isNumber = function (n) {
	  return !isNaN(parseFloat(n)) && isFinite(n)
	};

	function Geostats (a) {
	  this.objectID = '';
	  this.separator = ' - ';
	  this.legendSeparator = this.separator;
	  this.method = '';
	  this.precision = 0;
	  this.precisionflag = 'auto';
	  this.roundlength = 2; // Number of decimals, round values
	  this.is_uniqueValues = false;
	  this.debug = false;
	  this.silent = false;

	  this.bounds = [];
	  this.ranges = [];
	  this.inner_ranges = null;
	  this.colors = [];
	  this.counter = [];

	  // statistics information
	  this.stat_sorted = null;
	  this.stat_mean = null;
	  this.stat_median = null;
	  this.stat_sum = null;
	  this.stat_max = null;
	  this.stat_min = null;
	  this.stat_pop = null;
	  this.stat_variance = null;
	  this.stat_stddev = null;
	  this.stat_cov = null;

	  /**
	 * logging method
	 */
	  this.log = function (msg, force) {
	    if (this.debug === true || force != null) {
	      console.log(this.objectID + '(object id) :: ' + msg);
	    }
	  };

	  /**
	 * Set bounds
	 */
	  this.setBounds = function (a) {
	    this.log('Setting bounds (' + a.length + ') : ' + a.join());

	    this.bounds = []; // init empty array to prevent bug when calling classification after another with less items (sample getQuantile(6) and getQuantile(4))

	    this.bounds = a;
	    // this.bounds = this.decimalFormat(a);
	  };

	  /**
	 * Set a new serie
	 */
	  this.setSerie = function (a) {
	    this.log('Setting serie (' + a.length + ') : ' + a.join());

	    this.serie = []; // init empty array to prevent bug when calling classification after another with less items (sample getQuantile(6) and getQuantile(4))
	    this.serie = a;

	    // reset statistics after changing serie
	    this.resetStatistics();

	    this.setPrecision();
	  };

	  /**
	 * Set colors
	 */
	  this.setColors = function (colors) {
	    this.log('Setting color ramp (' + colors.length + ') : ' + colors.join());

	    this.colors = colors;
	  };

	  /**
	   * Get feature count
	   * With bounds array(0, 0.75, 1.5, 2.25, 3);
	   * should populate this.counter with 5 keys
	   * and increment counters for each key
	   */
	  this.doCount = function () {
	    if (this._nodata()) { return }

	    var tmp = this.sorted();

	    this.counter = [];

	    // we init counter with 0 value
	    for (let i = 0; i < this.bounds.length - 1; i++) {
	      this.counter[i] = 0;
	    }

	    for (let j = 0; j < tmp.length; j++) {
	      // get current class for value to increment the counter
	      var cclass = this.getClass(tmp[j]);
	      this.counter[cclass]++;
	    }
	  };

	  /**
	   * Set decimal precision according to user input
	   * or automatcally determined according
	   * to the given serie.
	   */
	  this.setPrecision = function (decimals) {
	    // only when called from user
	    if (typeof decimals !== 'undefined') {
	      this.precisionflag = 'manual';
	      this.precision = decimals;
	    }

	    // we calculate the maximal decimal length on given serie
	    if (this.precisionflag === 'auto') {
	      for (var i = 0; i < this.serie.length; i++) {
	        // check if the given value is a number and a float
	        var precision;
	        if (!isNaN((this.serie[i] + '')) && (this.serie[i] + '').toString().indexOf('.') !== -1) {
	          precision = (this.serie[i] + '').split('.')[1].length;
	        } else {
	          precision = 0;
	        }

	        if (precision > this.precision) {
	          this.precision = precision;
	        }
	      }
	    }
	    if (this.precision > 20) {
	      // prevent "Uncaught RangeError: toFixed() digits argument must be between 0 and 20" bug. See https://github.com/simogeo/geostats/issues/34
	      this.log('this.precision value (' + this.precision + ') is greater than max value. Automatic set-up to 20 to prevent "Uncaught RangeError: toFixed()" when calling decimalFormat() method.');
	      this.precision = 20;
	    }

	    this.log('Calling setPrecision(). Mode : ' + this.precisionflag + ' - Decimals : ' + this.precision);

	    this.serie = this.decimalFormat(this.serie);
	  };

	  /**
	   * Format array numbers regarding to precision
	   */
	  this.decimalFormat = function (a) {
	    var b = [];

	    for (var i = 0; i < a.length; i++) {
	      // check if the given value is a number
	      if (isNumber(a[i])) {
	        b[i] = parseFloat(parseFloat(a[i]).toFixed(this.precision));
	      } else {
	        b[i] = a[i];
	      }
	    }

	    return b
	  };

	  /**
	   * Transform a bounds array to a range array the following array : array(0,
	   * 0.75, 1.5, 2.25, 3); becomes : array('0-0.75', '0.75-1.5', '1.5-2.25',
	   * '2.25-3');
	   */
	  this.setRanges = function () {
	    this.ranges = []; // init empty array to prevent bug when calling classification after another with less items (sample getQuantile(6) and getQuantile(4))

	    for (let i = 0; i < (this.bounds.length - 1); i++) {
	      this.ranges[i] = this.bounds[i] + this.separator + this.bounds[i + 1];
	    }
	  };

	  /** return min value */
	  this.min = function () {
	    if (this._nodata()) { return }

	    this.stat_min = this.serie[0];

	    for (let i = 0; i < this.pop(); i++) {
	      if (this.serie[i] < this.stat_min) {
	        this.stat_min = this.serie[i];
	      }
	    }

	    return this.stat_min
	  };

	  /** return max value */
	  this.max = function () {
	    if (this._nodata()) { return }

	    this.stat_max = this.serie[0];
	    for (let i = 0; i < this.pop(); i++) {
	      if (this.serie[i] > this.stat_max) {
	        this.stat_max = this.serie[i];
	      }
	    }

	    return this.stat_max
	  };

	  /** return sum value */
	  this.sum = function () {
	    if (this._nodata()) { return }

	    if (this.stat_sum === null) {
	      this.stat_sum = 0;
	      for (let i = 0; i < this.pop(); i++) {
	        this.stat_sum += parseFloat(this.serie[i]);
	      }
	    }

	    return this.stat_sum
	  };

	  /** return population number */
	  this.pop = function () {
	    if (this._nodata()) { return }

	    if (this.stat_pop === null) {
	      this.stat_pop = this.serie.length;
	    }

	    return this.stat_pop
	  };

	  /** return mean value */
	  this.mean = function () {
	    if (this._nodata()) { return }

	    if (this.stat_mean === null) {
	      this.stat_mean = parseFloat(this.sum() / this.pop());
	    }

	    return this.stat_mean
	  };

	  /** return median value */
	  this.median = function () {
	    if (this._nodata()) { return }

	    if (this.stat_median === null) {
	      this.stat_median = 0;
	      var tmp = this.sorted();

	      // serie pop is odd
	      if (tmp.length % 2) {
	        this.stat_median = parseFloat(tmp[(Math.ceil(tmp.length / 2) - 1)]);

	      // serie pop is even
	      } else {
	        this.stat_median = (parseFloat(tmp[((tmp.length / 2) - 1)]) + parseFloat(tmp[(tmp.length / 2)])) / 2;
	      }
	    }

	    return this.stat_median
	  };

	  /** return variance value */
	  this.variance = function (round) {
	    round = (typeof round === 'undefined');

	    if (this._nodata()) { return }

	    if (this.stat_variance === null) {
	      var tmp = 0;
	      var serieMean = this.mean();
	      for (var i = 0; i < this.pop(); i++) {
	        tmp += Math.pow((this.serie[i] - serieMean), 2);
	      }

	      this.stat_variance = tmp / this.pop();

	      if (round === true) {
	        this.stat_variance = Math.round(this.stat_variance * Math.pow(10, this.roundlength)) / Math.pow(10, this.roundlength);
	      }
	    }

	    return this.stat_variance
	  };

	  /** return standard deviation value */
	  this.stddev = function (round) {
	    round = (typeof round === 'undefined');

	    if (this._nodata()) { return }

	    if (this.stat_stddev === null) {
	      this.stat_stddev = Math.sqrt(this.variance());

	      if (round === true) {
	        this.stat_stddev = Math.round(this.stat_stddev * Math.pow(10, this.roundlength)) / Math.pow(10, this.roundlength);
	      }
	    }

	    return this.stat_stddev
	  };

	  /** coefficient of variation - measure of dispersion */
	  this.cov = function (round) {
	    round = (typeof round === 'undefined');

	    if (this._nodata()) { return }

	    if (this.stat_cov === null) {
	      this.stat_cov = this.stddev() / this.mean();

	      if (round === true) {
	        this.stat_cov = Math.round(this.stat_cov * Math.pow(10, this.roundlength)) / Math.pow(10, this.roundlength);
	      }
	    }

	    return this.stat_cov
	  };

	  /** reset all attributes after setting a new serie */
	  this.resetStatistics = function () {
	    this.stat_sorted = null;
	    this.stat_mean = null;
	    this.stat_median = null;
	    this.stat_sum = null;
	    this.stat_max = null;
	    this.stat_min = null;
	    this.stat_pop = null;
	    this.stat_variance = null;
	    this.stat_stddev = null;
	    this.stat_cov = null;
	  };

	  /** data test */
	  this._nodata = function () {
	    if (this.serie.length === 0) {
	      if (this.silent) this.log('[silent mode] Error. You should first enter a serie!', true);
	      else throw new TypeError('Error. You should first enter a serie!')
	      return 1
	    } else { return 0 }
	  };

	  /** ensure nbClass is an integer */
	  this._nbClassInt = function (nbClass) {
	    var nbclassTmp = parseInt(nbClass, 10);
	    if (isNaN(nbclassTmp)) {
	      if (this.silent) this.log("[silent mode] '" + nbclassTmp + "' is not a valid integer. Enable to set class number.", true);
	      else throw new TypeError("'" + nbclassTmp + "' is not a valid integer. Enable to set class number.")
	    } else {
	      return nbclassTmp
	    }
	  };

	  /** check if the serie contains negative value */
	  this._hasNegativeValue = function () {
	    for (let i = 0; i < this.serie.length; i++) {
	      if (this.serie[i] < 0) { return true }
	    }
	    return false
	  };

	  /** check if the serie contains zero value */
	  this._hasZeroValue = function () {
	    for (let i = 0; i < this.serie.length; i++) {
	      if (parseFloat(this.serie[i]) === 0) { return true }
	    }
	    return false
	  };

	  /** return sorted values (as array) */
	  this.sorted = function () {
	    if (this.stat_sorted === null) {
	      if (this.is_uniqueValues === false) {
	        this.stat_sorted = this.serie.sort(function (a, b) {
	          return a - b
	        });
	      } else {
	        this.stat_sorted = this.serie.sort(function (a, b) {
	          var nameA = a.toString().toLowerCase(); var nameB = b.toString().toLowerCase();
	          if (nameA < nameB) return -1
	          if (nameA > nameB) return 1
	          return 0
	        });
	      }
	    }

	    return this.stat_sorted
	  };

	  /**
	 * Set Manual classification Return an array with bounds : ie array(0,
	 * 0.75, 1.5, 2.25, 3);
	 * Set ranges and prepare data for displaying legend
	 *
	 */
	  this.setClassManually = function (array) {
	    if (this._nodata()) { return }

	    if (array[0] !== this.min() || array[array.length - 1] !== this.max()) {
	      if (this.silent) this.log('[silent mode] ' + _t('Given bounds may not be correct! please check your input.\nMin value : ' + this.min() + ' / Max value : ' + this.max()), true);
	      else throw new TypeError(_t('Given bounds may not be correct! please check your input.\nMin value : ' + this.min() + ' / Max value : ' + this.max()))
	      return
	    }

	    this.setBounds(array);
	    this.setRanges();

	    // we specify the classification method
	    this.method = _t('manual classification') + ' (' + (array.length - 1) + ' ' + _t('classes') + ')';

	    return this.bounds
	  };

	  /**
	 * Equal intervals classification Return an array with bounds : ie array(0,
	 * 0.75, 1.5, 2.25, 3);
	 */
	  this.getClassEqInterval = function (nbClass, forceMin, forceMax) {
	    nbClass = this._nbClassInt(nbClass); // ensure nbClass is an integer

	    if (this._nodata()) { return }

	    var tmpMin = (typeof forceMin === 'undefined') ? this.min() : forceMin;
	    var tmpMax = (typeof forceMax === 'undefined') ? this.max() : forceMax;

	    var a = [];
	    var val = tmpMin;
	    var interval = (tmpMax - tmpMin) / nbClass;

	    for (let i = 0; i <= nbClass; i++) {
	      a[i] = val;
	      val += interval;
	    }

	    // -> Fix last bound to Max of values
	    a[nbClass] = tmpMax;

	    this.setBounds(a);
	    this.setRanges();

	    // we specify the classification method
	    this.method = _t('eq. intervals') + ' (' + nbClass + ' ' + _t('classes') + ')';

	    return this.bounds
	  };

	  this.getQuantiles = function (nbClass) {
	    nbClass = this._nbClassInt(nbClass); // ensure nbClass is an integer

	    var tmp = this.sorted();
	    var quantiles = [];

	    var step = this.pop() / nbClass;
	    for (var i = 1; i < nbClass; i++) {
	      var qidx = Math.round(i * step + 0.49);
	      quantiles.push(tmp[qidx - 1]); // zero-based
	    }

	    return quantiles
	  };

	  /**
	 * Quantile classification Return an array with bounds : ie array(0, 0.75,
	 * 1.5, 2.25, 3);
	 */
	  this.getClassQuantile = function (nbClass) {
	    nbClass = this._nbClassInt(nbClass); // ensure nbClass is an integer

	    if (this._nodata()) { return }

	    var tmp = this.sorted();
	    var bounds = this.getQuantiles(nbClass);
	    bounds.unshift(tmp[0]);

	    if (bounds[tmp.length - 1] !== tmp[tmp.length - 1]) { bounds.push(tmp[tmp.length - 1]); }

	    this.setBounds(bounds);
	    this.setRanges();

	    // we specify the classification method
	    this.method = _t('quantile') + ' (' + nbClass + ' ' + _t('classes') + ')';

	    return this.bounds
	  };

	  /**
	 * Standard Deviation classification
	 * Return an array with bounds : ie array(0,
	 * 0.75, 1.5, 2.25, 3);
	 */
	  this.getClassStdDeviation = function (nbClass, matchBounds) {
	    nbClass = this._nbClassInt(nbClass); // ensure nbClass is an integer

	    if (this._nodata()) { return }

	    var tmpMax = this.max();
	    var tmpMin = this.min();
	    var tmpStdDev = this.stddev();
	    var tmpMean = this.mean();

	    var a = [];

	    // number of classes is odd
	    if (nbClass % 2 === 1) {
	      // Euclidean division to get the inferior bound
	      var infBound = Math.floor(nbClass / 2);

	      var supBound = infBound + 1;

	      // we set the central bounds
	      a[infBound] = tmpMean - (tmpStdDev / 2);
	      a[supBound] = tmpMean + (tmpStdDev / 2);

	      // Values < to infBound, except first one
	      for (let i = infBound - 1; i > 0; i--) {
	        let val = a[i + 1] - tmpStdDev;
	        a[i] = val;
	      }

	      // Values > to supBound, except last one
	      for (let i = supBound + 1; i < nbClass; i++) {
	        let val = a[i - 1] + tmpStdDev;
	        a[i] = val;
	      }

	      // number of classes is even
	    } else {
	      var meanBound = nbClass / 2;

	      // we get the mean value
	      a[meanBound] = tmpMean;

	      // Values < to the mean, except first one
	      for (let i = meanBound - 1; i > 0; i--) {
	        let val = a[i + 1] - tmpStdDev;
	        a[i] = val;
	      }

	      // Values > to the mean, except last one
	      for (let i = meanBound + 1; i < nbClass; i++) {
	        let val = a[i - 1] + tmpStdDev;
	        a[i] = val;
	      }
	    }

	    // we finally set the first value
	    // do we excatly match min value or not ?
	    a[0] = (typeof matchBounds === 'undefined') ? a[1] - tmpStdDev : tmpMin;

	    // we finally set the last value
	    // do we excatly match max value or not ?
	    a[nbClass] = (typeof matchBounds === 'undefined') ? a[nbClass - 1] + tmpStdDev : tmpMax;

	    this.setBounds(a);
	    this.setRanges();

	    // we specify the classification method
	    this.method = _t('std deviation') + ' (' + nbClass + ' ' + _t('classes') + ')';

	    return this.bounds
	  };

	  /**
	 * Geometric Progression classification
	 * http://en.wikipedia.org/wiki/Geometric_progression
	 * Return an array with bounds : ie array(0,
	 * 0.75, 1.5, 2.25, 3);
	 */
	  this.getClassGeometricProgression = function (nbClass) {
	    nbClass = this._nbClassInt(nbClass); // ensure nbClass is an integer

	    if (this._nodata()) { return }

	    if (this._hasNegativeValue() || this._hasZeroValue()) {
	      if (this.silent) this.log('[silent mode] ' + _t('geometric progression can\'t be applied with a serie containing negative or zero values.'), true);
	      else throw new TypeError(_t('geometric progression can\'t be applied with a serie containing negative or zero values.'))
	      return
	    }

	    var a = [];
	    var tmpMin = this.min();
	    var tmpMax = this.max();

	    var logMax = Math.log(tmpMax) / Math.LN10; // max decimal logarithm (or base 10)
	    var logMin = Math.log(tmpMin) / Math.LN10; // min decimal logarithm (or base 10)

	    var interval = (logMax - logMin) / nbClass;

	    // we compute log bounds
	    for (let i = 0; i < nbClass; i++) {
	      if (i === 0) {
	        a[i] = logMin;
	      } else {
	        a[i] = a[i - 1] + interval;
	      }
	    }

	    // we compute antilog
	    a = a.map(function (x) { return Math.pow(10, x) });

	    // and we finally add max value
	    a.push(this.max());

	    this.setBounds(a);
	    this.setRanges();

	    // we specify the classification method
	    this.method = _t('geometric progression') + ' (' + nbClass + ' ' + _t('classes') + ')';

	    return this.bounds
	  };

	  /**
	 * Arithmetic Progression classification
	 * http://en.wikipedia.org/wiki/Arithmetic_progression
	 * Return an array with bounds : ie array(0,
	 * 0.75, 1.5, 2.25, 3);
	 */
	  this.getClassArithmeticProgression = function (nbClass) {
	    nbClass = this._nbClassInt(nbClass); // ensure nbClass is an integer

	    if (this._nodata()) { return }

	    var denominator = 0;

	    // we compute the (french) "Raison"
	    for (let i = 1; i <= nbClass; i++) {
	      denominator += i;
	    }

	    var a = [];
	    var tmpMin = this.min();
	    var tmpMax = this.max();

	    var interval = (tmpMax - tmpMin) / denominator;

	    for (let i = 0; i <= nbClass; i++) {
	      if (i === 0) {
	        a[i] = tmpMin;
	      } else {
	        a[i] = a[i - 1] + (i * interval);
	      }
	    }

	    this.setBounds(a);
	    this.setRanges();

	    // we specify the classification method
	    this.method = _t('arithmetic progression') + ' (' + nbClass + ' ' + _t('classes') + ')';

	    return this.bounds
	  };

	  /**
	 * Credits : Doug Curl (javascript) and Daniel J Lewis (python implementation)
	 * http://www.arcgis.com/home/item.html?id=0b633ff2f40d412995b8be377211c47b
	 * http://danieljlewis.org/2010/06/07/jenks-natural-breaks-algorithm-in-python/
	 */
	  this.getClassJenks = function (nbClass) {
	    nbClass = this._nbClassInt(nbClass); // ensure nbClass is an integer

	    if (this._nodata()) { return }

	    let dataList = this.sorted();

	    // now iterate through the datalist:
	    // determine mat1 and mat2
	    // really not sure how these 2 different arrays are set - the code for
	    // each seems the same!
	    // but the effect are 2 different arrays: mat1 and mat2
	    var mat1 = [];
	    // for (var x = 0, xl = dataList.length + 1; x < xl; x++) {
	    for (var x = 0; x < dataList.length + 1; x++) {
	      var temp = [];
	      for (var j = 0, jl = nbClass + 1; j < jl; j++) {
	        temp.push(0);
	      }
	      mat1.push(temp);
	    }

	    var mat2 = [];
	    // for (var i = 0, il = dataList.length + 1; i < il; i++) {
	    for (var i = 0; i < dataList.length + 1; i++) {
	      var temp2 = [];
	      for (var c = 0, cl = nbClass + 1; c < cl; c++) {
	        temp2.push(0);
	      }
	      mat2.push(temp2);
	    }

	    // absolutely no idea what this does - best I can tell, it sets the 1st
	    // group in the
	    // mat1 and mat2 arrays to 1 and 0 respectively
	    for (var y = 1, yl = nbClass + 1; y < yl; y++) {
	      mat1[0][y] = 1;
	      mat2[0][y] = 0;
	      for (var t = 1, tl = dataList.length + 1; t < tl; t++) {
	        mat2[t][y] = Infinity;
	      }
	      var v = 0.0;
	    }

	    // and this part - I'm a little clueless on - but it works
	    // pretty sure it iterates across the entire dataset and compares each
	    // value to
	    // one another to and adjust the indices until you meet the rules:
	    // minimum deviation
	    // within a class and maximum separation between classes
	    for (var l = 2, ll = dataList.length + 1; l < ll; l++) {
	      var s1 = 0.0;
	      var s2 = 0.0;
	      var w = 0.0;
	      for (var m = 1, ml = l + 1; m < ml; m++) {
	        var i3 = l - m + 1;
	        var val = parseFloat(dataList[i3 - 1]);
	        s2 += val * val;
	        s1 += val;
	        w += 1;
	        v = s2 - (s1 * s1) / w;
	        var i4 = i3 - 1;
	        if (i4 !== 0) {
	          for (var p = 2, pl = nbClass + 1; p < pl; p++) {
	            if (mat2[l][p] >= (v + mat2[i4][p - 1])) {
	              mat1[l][p] = i3;
	              mat2[l][p] = v + mat2[i4][p - 1];
	            }
	          }
	        }
	      }
	      mat1[l][1] = 1;
	      mat2[l][1] = v;
	    }

	    var k = dataList.length;
	    var kclass = [];

	    // fill the kclass (classification) array with zeros:
	    for (i = 0; i <= nbClass; i++) {
	      kclass.push(0);
	    }

	    // this is the last number in the array:
	    kclass[nbClass] = parseFloat(dataList[dataList.length - 1]);
	    // this is the first number - can set to zero, but want to set to lowest
	    // to use for legend:
	    kclass[0] = parseFloat(dataList[0]);
	    var countNum = nbClass;
	    while (countNum >= 2) {
	      var id = parseInt((mat1[k][countNum]) - 2);
	      kclass[countNum - 1] = dataList[id];
	      k = parseInt((mat1[k][countNum] - 1));
	      // spits out the rank and value of the break values:
	      // console.log("id="+id,"rank = " + String(mat1[k][countNum]),"val =
	      // " + String(dataList[id]))
	      // count down:
	      countNum -= 1;
	    }
	    // check to see if the 0 and 1 in the array are the same - if so, set 0
	    // to 0:
	    if (kclass[0] === kclass[1]) {
	      kclass[0] = 0;
	    }

	    this.setBounds(kclass);
	    this.setRanges();

	    this.method = _t('Jenks') + ' (' + nbClass + ' ' + _t('classes') + ')';

	    return this.bounds // array of breaks
	  };

	  /**
	 * Quantile classification Return an array with bounds : ie array(0, 0.75,
	 * 1.5, 2.25, 3);
	 */
	  this.getClassUniqueValues = function () {
	    if (this._nodata()) { return }

	    this.is_uniqueValues = true;
	    var tmp = this.sorted(); // display in alphabetical order

	    var a = [];

	    for (let i = 0; i < this.pop(); i++) {
	      if (a.indexOf(tmp[i]) === -1) {
	        a.push(tmp[i]);
	      }
	    }

	    this.bounds = a;

	    // we specify the classification method
	    this.method = _t('unique values');

	    return a
	  };

	  /**
	 * Return the class of a given value.
	 * For example value : 6
	 * and bounds array = (0, 4, 8, 12);
	 * Return 2
	 */
	  this.getClass = function (value) {
	    for (let i = 0; i < this.bounds.length; i++) {
	      if (this.is_uniqueValues === true) {
	        if (value === this.bounds[i]) { return i }
	      } else {
	      // parseFloat() is necessary
	        if (parseFloat(value) <= this.bounds[i + 1]) {
	          return i
	        }
	      }
	    }

	    return _t("Unable to get value's class.")
	  };

	  /**
	 * Return the ranges array : array('0-0.75', '0.75-1.5', '1.5-2.25',
	 * '2.25-3');
	 */
	  this.getRanges = function () {
	    return this.ranges
	  };

	  /**
	 * Returns the number/index of this.ranges that value falls into
	 */
	  this.getRangeNum = function (value) {
	    var bounds, i;

	    for (i = 0; i < this.ranges.length; i++) {
	      bounds = this.ranges[i].split(/ - /);
	      if (value <= parseFloat(bounds[1])) {
	        return i
	      }
	    }
	  };

	  /*
	 * Compute inner ranges based on serie.
	 * Produce discontinous ranges used for legend - return an array similar to :
	 * array('0.00-0.74', '0.98-1.52', '1.78-2.25', '2.99-3.14');
	 * If inner ranges already computed, return array values.
	 */
	  this.getInnerRanges = function () {
	    // if already computed, we return the result
	    if (this.inner_ranges != null) {
	      return this.inner_ranges
	    }

	    var a = [];
	    var tmp = this.sorted();
	    var cnt = 1; // bounds array counter

	    for (let i = 0; i < tmp.length; i++) {
	      let rangeFirstValue;
	      if (i === 0) {
	        rangeFirstValue = tmp[i]; // we init first range value
	      }

	      if (parseFloat(tmp[i]) > parseFloat(this.bounds[cnt])) {
	        a[cnt - 1] = '' + rangeFirstValue + this.separator + tmp[i - 1];

	        rangeFirstValue = tmp[i];

	        cnt++;
	      }

	      // we reach the last range, we finally complete manually
	      // and return the array
	      if (cnt === (this.bounds.length - 1)) {
	      // we set the last value
	        a[cnt - 1] = '' + rangeFirstValue + this.separator + tmp[tmp.length - 1];

	        this.inner_ranges = a;
	        return this.inner_ranges
	      }
	    }
	  };

	  this.getSortedlist = function () {
	    return this.sorted().join(', ')
	  };

	  // object constructor
	  // At the end of script. If not setPrecision() method is not known

	  // we create an object identifier for debugging
	  this.objectID = new Date().getUTCMilliseconds();
	  this.log('Creating new geostats object');

	  if (typeof a !== 'undefined' && a.length > 0) {
	    this.serie = a;
	    this.setPrecision();
	    this.log('Setting serie (' + a.length + ') : ' + a.join());
	  } else {
	    this.serie = [];
	  }

	  // creating aliases on classification function for backward compatibility
	  this.getJenks = this.getClassJenks;
	  this.getGeometricProgression = this.getClassGeometricProgression;
	  this.getEqInterval = this.getClassEqInterval;
	  this.getQuantile = this.getClassQuantile;
	  this.getStdDeviation = this.getClassStdDeviation;
	  this.getUniqueValues = this.getClassUniqueValues;
	  this.getArithmeticProgression = this.getClassArithmeticProgression;
	}

	function bin (data, binInstructions) {
	  let intervalBounds = getIntervalBounds(data, binInstructions);
	  let ranges = pairRange(intervalBounds);

	  let newData = bin$1(data, binInstructions.groupBy, ranges);
	  return newData
	}

	function getIntervalBounds (data, binInstructions) {
	  if (binInstructions.constructor !== Object) {
	    throw new Error('Bin only accepts an Object')
	  }

	  let key = binInstructions.groupBy;
	  if (key.constructor !== String) {
	    throw new Error('groupBy only accepts a String variable name')
	  }

	  let method = binInstructions.method;
	  if (!method) {
	    console.warn('No binning method specified, defaulting to EqualInterval');
	    method = 'EqualInterval';
	  }
	  if (method.constructor !== String) {
	    console.warn('Binning method not recognized, defaulting to EqualInterval');
	    method = 'EqualInterval';
	  }

	  let numClasses = binInstructions.numClasses;
	  if (!numClasses) {
	    console.warn('numClasses not specified, defaulting to 5');
	    numClasses = 5;
	  }

	  let variableData = data[key];
	  if (!variableData) {
	    throw new Error(`groupBy variable ${key} does not exist`)
	  }
	  let geoStat = new Geostats(variableData);

	  let ranges;

	  // Calculate ranges to obtain bins of a specified size
	  if (method === 'IntervalSize') {
	    let binSize = binInstructions.binSize;

	    let domain = variableDomain(variableData);
	    if (!binSize) {
	      console.warn(`binSize not specified for IntervalSize binning, defaulting to ${(domain[1] - domain[0])}`);
	      binSize = domain[1] - domain[0];
	    }
	    let binCount = Math.floor((domain[1] - domain[0]) / binSize);

	    ranges = rangeFromInterval(domain, binSize, binCount);
	    let newData = bin$1(data, key, ranges);
	    return newData
	  } else if (method === 'EqualInterval') {
	    ranges = geoStat.getClassEqInterval(numClasses);
	  } else if (method === 'StandardDeviation') {
	    ranges = geoStat.getClassStdDeviation(numClasses);
	  } else if (method === 'ArithmeticProgression') {
	    ranges = geoStat.getClassArithmeticProgression(numClasses);
	  } else if (method === 'GeometricProgression') {
	    ranges = geoStat.getClassGeometricProgression(numClasses);
	  } else if (method === 'Quantile') {
	    ranges = geoStat.getClassQuantile(numClasses);
	  } else if (method === 'Jenks') {
	    ranges = geoStat.getClassJenks(numClasses);
	  } else if (method === 'Manual') {
	    ranges = binInstructions.manualClasses;
	  }

	  return ranges
	}

	// Extract domain of variable of interest
	function variableDomain (column) {
	  let asc = column.sort((a, b) => a - b);

	  let domain = [];
	  domain.push(asc[0]);
	  domain.push(asc[asc.length - 1]);

	  return domain
	}

	function rangeFromInterval (domain, interval, binCount) {
	  let ranges = [];

	  // Ranges should start at the minimum value of variable of interest
	  let lowerBound = domain[0];

	  for (let i = 0; i < binCount; i++) {
	    let upperBound = lowerBound + interval;

	    ranges.push([lowerBound, upperBound]);

	    lowerBound = upperBound;
	  }
	  if (lowerBound < domain[1]) {
	    ranges.push([lowerBound, domain[1]]);
	  }
	  return ranges
	}

	function pairRange (ranges) {
	  let l = ranges.length;
	  let newRange = [];

	  for (let i = 0; i < l - 1; i++) {
	    newRange.push([ranges[i], ranges[i + 1]]);
	  }

	  return newRange
	}

	function bin$1 (data, variable, ranges) {
	  let newData = { bins: ranges };

	  let ix = 0;

	  // Create an empty array to store new dataFrames divided by range
	  let bins = Array(ranges.length);

	  for (let b = 0; b < bins.length; b++) {
	    bins[b] = {};

	    for (let col in data) {
	      // If data key does not exist, create it
	      bins[b][col] = [];
	    }
	  }

	  let length = getDataLength(data);

	  // Loop through data
	  while (ix < length) {
	    let instance = data[variable][ix];

	    // Find index of bin in which the instance belongs
	    let binIndex = ranges.findIndex(function (el, i) {
	      if (i === ranges.length - 1) {
	        return instance >= el[0] && instance <= el[1]
	      } else {
	        return instance >= el[0] && instance < el[1]
	      }
	    });

	    let newRow = bins[binIndex];

	    for (let col in data) {
	      newRow[col].push(data[col][ix]);
	    }

	    // Update the bins column with new dataFrame
	    bins[binIndex] = newRow;

	    ix++;
	  }

	  // Add new dataFrame column to newData
	  newData.$grouped = bins;
	  return newData
	}

	function dropNA (data, dropInstructions) {
	  let filterFunc;

	  if (dropInstructions === undefined) {
	    // If the instructions are undefined, we will check all columns for invalid values
	    filterFunc = row => {
	      let keep = true;

	      for (let key in row) {
	        let val = row[key];
	        if (isInvalid(val)) {
	          keep = false;
	          break
	        }
	      }

	      return keep
	    };
	  } else if (dropInstructions.constructor === String) {
	    // If the instructions are a string, we check only one column for invalid values
	    checkIfColumnsExist(data, [dropInstructions]);
	    filterFunc = row => !isInvalid(row[dropInstructions]);
	  } else if (dropInstructions.constructor === Array) {
	    // if the instructions are an array, we check the columns named in the array
	    checkIfColumnsExist(data, dropInstructions);
	    filterFunc = row => {
	      let keep = true;
	      for (let col of dropInstructions) {
	        if (isInvalid(row[col])) {
	          keep = false;
	          break
	        }
	      }

	      return keep
	    };
	  } else {
	    throw new Error('dropNA can only be passed undefined, a String or an Array of Strings')
	  }

	  filter(data, filterFunc);
	}

	function checkIfColumnsExist (data, columns) {
	  for (let col of columns) {
	    if (!data.hasOwnProperty(col)) {
	      throw new Error(`Column '${col}' not found`)
	    }
	  }
	}

	function transform (data, transformFunction) {
	  if (transformFunction.constructor !== Function) {
	    throw new Error(`Invalid 'transform' transformation: must be a Function`)
	  }

	  return transformFunction(data)
	}

	const transformations = {
	  filter: produce(filter),
	  select: produce(select),
	  arrange: produce(arrange),
	  rename: produce(rename),
	  mutate: produce(mutate),
	  transmute: produce(transmute),
	  summarise,
	  mutarise,
	  groupBy,
	  bin,
	  dropNA: produce(dropNA),
	  // reproject,
	  transform
	};

	class TransformableDataContainer {
	  constructor (data) {
	    this._data = data;
	  }

	  done () {
	    return new DataContainer(this)
	  }

	  arrange (sortInstructions) {
	    this._data = transformations.arrange(this._data, sortInstructions);
	    return this
	  }

	  bin (binInstructions) {
	    this._data = transformations.bin(this._data, binInstructions);
	    return this
	  }

	  dropNA (dropInstructions) {
	    this._data = transformations.dropNA(this._data, dropInstructions);
	    return this
	  }

	  filter (filterFunction) {
	    this._data = transformations.filter(this._data, filterFunction);
	    return this
	  }

	  groupBy (groupByInstructions) {
	    this._data = transformations.groupBy(this._data, groupByInstructions);
	    return this
	  }

	  mutarise (mutariseInstructions) {
	    this._data = transformations.mutarise(this._data, mutariseInstructions);
	    return this
	  }

	  mutarize (mutariseInstructions) {
	    this._data = transformations.mutarise(this._data, mutariseInstructions);
	    return this
	  }

	  mutate (mutateInstructions) {
	    this._data = transformations.mutate(this._data, mutateInstructions);
	    return this
	  }

	  transmute (transmuteInstructions) {
	    this._data = transformations.transmute(this._data, transmuteInstructions);
	    return this
	  }

	  rename (renameInstructions) {
	    this._data = transformations.rename(this._data, renameInstructions);
	    return this
	  }

	  // reproject (reprojectInstructions) {
	  //   this._data = transformations.reproject(this._data, reprojectInstructions)
	  //   return this
	  // }

	  select (selection) {
	    this._data = transformations.select(this._data, selection);
	    return this
	  }

	  summarise (summariseInstructions) {
	    this._data = transformations.summarise(this._data, summariseInstructions);
	    return this
	  }

	  summarize (summariseInstructions) {
	    this._data = transformations.summarise(this._data, summariseInstructions);
	    return this
	  }

	  transform (transformFunction) {
	    this._data = transformations.transform(this._data, transformFunction);
	    return this
	  }
	}

	function proxyTransformationCall (data, transformation, options) {
	  let transformableDataContainer = new TransformableDataContainer(data);
	  transformableDataContainer = transformableDataContainer[transformation](options);
	  return transformableDataContainer
	}

	const methods$2 = {
	  arrange (sortInstructions) {
	    return proxyTransformationCall(this._data, 'arrange', sortInstructions)
	  },

	  bin (binInstructions) {
	    return proxyTransformationCall(this._data, 'bin', binInstructions)
	  },

	  dropNA (dropInstructions) {
	    return proxyTransformationCall(this._data, 'dropNA', dropInstructions)
	  },

	  filter (filterFunction) {
	    return proxyTransformationCall(this._data, 'filter', filterFunction)
	  },

	  groupBy (groupByInstructions) {
	    return proxyTransformationCall(this._data, 'groupBy', groupByInstructions)
	  },

	  mutarise (mutariseInstructions) {
	    return proxyTransformationCall(this._data, 'mutarise', mutariseInstructions)
	  },

	  mutarize (mutariseInstructions) {
	    return proxyTransformationCall(this._data, 'mutarize', mutariseInstructions)
	  },

	  mutate (mutateInstructions) {
	    return proxyTransformationCall(this._data, 'mutate', mutateInstructions)
	  },

	  transmute (transmuteInstructions) {
	    return proxyTransformationCall(this._data, 'transmute', transmuteInstructions)
	  },

	  rename (renameInstructions) {
	    return proxyTransformationCall(this._data, 'rename', renameInstructions)
	  },

	  // reproject (reprojectInstructions) {
	  //   return proxyTransformationCall(this._data, 'reproject', reprojectInstructions)
	  // },

	  select (selection) {
	    return proxyTransformationCall(this._data, 'select', selection)
	  },

	  summarise (summariseInstructions) {
	    return proxyTransformationCall(this._data, 'summarise', summariseInstructions)
	  },

	  summarize (summariseInstructions) {
	    return proxyTransformationCall(this._data, 'summarize', summariseInstructions)
	  },

	  transform (transformFunction) {
	    return proxyTransformationCall(this._data, 'transform', transformFunction)
	  }
	};

	function transformMixin (targetClass) {
	  Object.assign(targetClass.prototype, methods$2);
	}

	class DataContainer {
	  constructor (data) {
	    this._data = {};
	    this._length = undefined;
	    this._indexToRowNumber = {};

	    this._domainsAndTypesCalculated = false;

	    this._domains = {};
	    this._types = {};

	    if (isColumnOriented(data)) {
	      this._setColumnDataframe(data);
	      return
	    }

	    if (isRowOriented(data)) {
	      this._setRowDataframe(data);
	      return
	    }

	    if (isGeoJSON(data)) {
	      this._setGeoJSON(data);
	      return
	    }

	    if (data instanceof TransformableDataContainer) {
	      this._setTransformableDataContainer(data);
	      return
	    }

	    if (data instanceof Group) {
	      this._setGroup(data);
	      return
	    }

	    throw invalidDataError
	  }

	  data () {
	    return this._data
	  }

	  row (index) {
	    let rowNumber = this._indexToRowNumber[index];
	    return this._row(rowNumber)
	  }

	  rows () {
	    let rows = [];

	    for (let i = 0; i < this._length; i++) {
	      rows.push(this._row(i));
	    }

	    return rows
	  }

	  hasColumn (columnPath) {
	    return columnPathIsValid(columnPath, this)
	  }

	  column (columnPath) {
	    checkColumnPath(columnPath, this);
	    return getColumn(columnPath, this)
	  }

	  mapColumn (columnPath, mapFunction) {
	    checkColumnPath(columnPath, this);
	    return mapColumn(columnPath, this, mapFunction)
	  }

	  updateRow (index, row) {
	    let rowNumber = this._indexToRowNumber[index];

	    for (let key in row) {
	      checkIfColumnExists(key, this);

	      if (key === '$index') {
	        console.warn(`Cannot update '$index' of row`);
	        continue
	      }

	      let value = row[key];
	      this._data[key][rowNumber] = value;
	    }
	  }

	  _row (rowNumber) {
	    let row = {};

	    for (let columnName in this._data) {
	      let value = this._data[columnName][rowNumber];
	      row[columnName] = value;
	    }

	    return row
	  }
	}

	dataLoadingMixin(DataContainer);
	domainsAndTypesMixin(DataContainer);
	transformMixin(DataContainer);

	const invalidDataError = new Error('Data passed to DataContainer is of unknown format');

	/* src/components/Core/Graphic.svelte generated by Svelte v3.2.2 */

	const file = "src/components/Core/Graphic.svelte";

	function create_fragment(ctx) {
		var svg, current;

		const default_slot_1 = ctx.$$slots.default;
		const default_slot = create_slot(default_slot_1, ctx, null);

		return {
			c: function create() {
				svg = svg_element("svg");

				if (default_slot) default_slot.c();

				attr(svg, "width", ctx.width);
				attr(svg, "height", ctx.height);
				add_location(svg, file, 5, 0, 63);
			},

			l: function claim(nodes) {
				if (default_slot) default_slot.l(svg_nodes);
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, svg, anchor);

				if (default_slot) {
					default_slot.m(svg, null);
				}

				current = true;
			},

			p: function update(changed, ctx) {
				if (default_slot && default_slot.p && changed.$$scope) {
					default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
				}

				if (!current || changed.width) {
					attr(svg, "width", ctx.width);
				}

				if (!current || changed.height) {
					attr(svg, "height", ctx.height);
				}
			},

			i: function intro(local) {
				if (current) return;
				if (default_slot && default_slot.i) default_slot.i(local);
				current = true;
			},

			o: function outro(local) {
				if (default_slot && default_slot.o) default_slot.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(svg);
				}

				if (default_slot) default_slot.d(detaching);
			}
		};
	}

	function instance($$self, $$props, $$invalidate) {
		let { width, height } = $$props;

		let { $$slots = {}, $$scope } = $$props;

		$$self.$set = $$props => {
			if ('width' in $$props) $$invalidate('width', width = $$props.width);
			if ('height' in $$props) $$invalidate('height', height = $$props.height);
			if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
		};

		return { width, height, $$slots, $$scope };
	}

	class Graphic extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance, create_fragment, safe_not_equal, ["width", "height"]);

			const { ctx } = this.$$;
			const props = options.props || {};
			if (ctx.width === undefined && !('width' in props)) {
				console.warn("<Graphic> was created without expected prop 'width'");
			}
			if (ctx.height === undefined && !('height' in props)) {
				console.warn("<Graphic> was created without expected prop 'height'");
			}
		}

		get width() {
			throw new Error("<Graphic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set width(value) {
			throw new Error("<Graphic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get height() {
			throw new Error("<Graphic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set height(value) {
			throw new Error("<Graphic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src/components/Core/Section.svelte generated by Svelte v3.2.2 */

	const file$1 = "src/components/Core/Section.svelte";

	const get_default_slot_changes = ({ scales }) => ({ scaleX: scales, scaleY: scales });
	const get_default_slot_context = ({ scales }) => ({ scaleX: scales.x, scaleY: scales.y });

	function create_fragment$1(ctx) {
		var g, current;

		const default_slot_1 = ctx.$$slots.default;
		const default_slot = create_slot(default_slot_1, ctx, get_default_slot_context);

		return {
			c: function create() {
				g = svg_element("g");

				if (default_slot) default_slot.c();

				add_location(g, file$1, 24, 0, 493);
			},

			l: function claim(nodes) {
				if (default_slot) default_slot.l(g_nodes);
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, g, anchor);

				if (default_slot) {
					default_slot.m(g, null);
				}

				current = true;
			},

			p: function update(changed, ctx) {
				if (default_slot && default_slot.p && (changed.$$scope || changed.scales)) {
					default_slot.p(get_slot_changes(default_slot_1, ctx, changed, get_default_slot_changes), get_slot_context(default_slot_1, ctx, get_default_slot_context));
				}
			},

			i: function intro(local) {
				if (current) return;
				if (default_slot && default_slot.i) default_slot.i(local);
				current = true;
			},

			o: function outro(local) {
				if (default_slot && default_slot.o) default_slot.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(g);
				}

				if (default_slot) default_slot.d(detaching);
			}
		};
	}

	function instance$1($$self, $$props, $$invalidate) {
		let { x1, x2, y1, y2, scaleX = undefined, scaleY = undefined } = $$props;
	   
	  function parseScales (scaleX, scaleY, rangeX, rangeY) {
	    return {
	      x: scaleX ? scaleX.copy().range(rangeX) : undefined,
	      y: scaleY ? scaleY.copy().range(rangeY) : undefined
	    }
	  }

		let { $$slots = {}, $$scope } = $$props;

		$$self.$set = $$props => {
			if ('x1' in $$props) $$invalidate('x1', x1 = $$props.x1);
			if ('x2' in $$props) $$invalidate('x2', x2 = $$props.x2);
			if ('y1' in $$props) $$invalidate('y1', y1 = $$props.y1);
			if ('y2' in $$props) $$invalidate('y2', y2 = $$props.y2);
			if ('scaleX' in $$props) $$invalidate('scaleX', scaleX = $$props.scaleX);
			if ('scaleY' in $$props) $$invalidate('scaleY', scaleY = $$props.scaleY);
			if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
		};

		let rangeX, rangeY, scales;

		$$self.$$.update = ($$dirty = { x1: 1, x2: 1, y1: 1, y2: 1, scaleX: 1, scaleY: 1, rangeX: 1, rangeY: 1 }) => {
			if ($$dirty.x1 || $$dirty.x2) { $$invalidate('rangeX', rangeX = [x1, x2]); }
			if ($$dirty.y1 || $$dirty.y2) { $$invalidate('rangeY', rangeY = [y1, y2]); }
			if ($$dirty.scaleX || $$dirty.scaleY || $$dirty.rangeX || $$dirty.rangeY) { $$invalidate('scales', scales = parseScales(scaleX, scaleY, rangeX, rangeY)); }
		};

		return {
			x1,
			x2,
			y1,
			y2,
			scaleX,
			scaleY,
			scales,
			$$slots,
			$$scope
		};
	}

	class Section extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$1, create_fragment$1, safe_not_equal, ["x1", "x2", "y1", "y2", "scaleX", "scaleY"]);

			const { ctx } = this.$$;
			const props = options.props || {};
			if (ctx.x1 === undefined && !('x1' in props)) {
				console.warn("<Section> was created without expected prop 'x1'");
			}
			if (ctx.x2 === undefined && !('x2' in props)) {
				console.warn("<Section> was created without expected prop 'x2'");
			}
			if (ctx.y1 === undefined && !('y1' in props)) {
				console.warn("<Section> was created without expected prop 'y1'");
			}
			if (ctx.y2 === undefined && !('y2' in props)) {
				console.warn("<Section> was created without expected prop 'y2'");
			}
		}

		get x1() {
			throw new Error("<Section>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set x1(value) {
			throw new Error("<Section>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get x2() {
			throw new Error("<Section>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set x2(value) {
			throw new Error("<Section>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get y1() {
			throw new Error("<Section>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set y1(value) {
			throw new Error("<Section>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get y2() {
			throw new Error("<Section>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set y2(value) {
			throw new Error("<Section>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get scaleX() {
			throw new Error("<Section>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set scaleX(value) {
			throw new Error("<Section>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get scaleY() {
			throw new Error("<Section>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set scaleY(value) {
			throw new Error("<Section>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src/components/Marks/Point.svelte generated by Svelte v3.2.2 */

	const file$2 = "src/components/Marks/Point.svelte";

	function create_fragment$2(ctx) {
		var circle;

		return {
			c: function create() {
				circle = svg_element("circle");
				attr(circle, "cx", ctx.x);
				attr(circle, "cy", ctx.y);
				attr(circle, "r", ctx.radius);
				attr(circle, "fill", ctx.fill);
				add_location(circle, file$2, 8, 0, 111);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, circle, anchor);
			},

			p: function update(changed, ctx) {
				if (changed.x) {
					attr(circle, "cx", ctx.x);
				}

				if (changed.y) {
					attr(circle, "cy", ctx.y);
				}

				if (changed.radius) {
					attr(circle, "r", ctx.radius);
				}

				if (changed.fill) {
					attr(circle, "fill", ctx.fill);
				}
			},

			i: noop,
			o: noop,

			d: function destroy(detaching) {
				if (detaching) {
					detach(circle);
				}
			}
		};
	}

	function instance$2($$self, $$props, $$invalidate) {
		let { x, y, radius = 3, fill = 'black' } = $$props;

		$$self.$set = $$props => {
			if ('x' in $$props) $$invalidate('x', x = $$props.x);
			if ('y' in $$props) $$invalidate('y', y = $$props.y);
			if ('radius' in $$props) $$invalidate('radius', radius = $$props.radius);
			if ('fill' in $$props) $$invalidate('fill', fill = $$props.fill);
		};

		return { x, y, radius, fill };
	}

	class Point extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$2, create_fragment$2, safe_not_equal, ["x", "y", "radius", "fill"]);

			const { ctx } = this.$$;
			const props = options.props || {};
			if (ctx.x === undefined && !('x' in props)) {
				console.warn("<Point> was created without expected prop 'x'");
			}
			if (ctx.y === undefined && !('y' in props)) {
				console.warn("<Point> was created without expected prop 'y'");
			}
		}

		get x() {
			throw new Error("<Point>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set x(value) {
			throw new Error("<Point>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get y() {
			throw new Error("<Point>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set y(value) {
			throw new Error("<Point>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get radius() {
			throw new Error("<Point>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set radius(value) {
			throw new Error("<Point>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get fill() {
			throw new Error("<Point>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set fill(value) {
			throw new Error("<Point>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	var pi$1 = Math.PI,
	    tau$1 = 2 * pi$1,
	    epsilon = 1e-6,
	    tauEpsilon = tau$1 - epsilon;

	function Path() {
	  this._x0 = this._y0 = // start of current subpath
	  this._x1 = this._y1 = null; // end of current subpath
	  this._ = "";
	}

	function path$1() {
	  return new Path;
	}

	Path.prototype = path$1.prototype = {
	  constructor: Path,
	  moveTo: function(x, y) {
	    this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y);
	  },
	  closePath: function() {
	    if (this._x1 !== null) {
	      this._x1 = this._x0, this._y1 = this._y0;
	      this._ += "Z";
	    }
	  },
	  lineTo: function(x, y) {
	    this._ += "L" + (this._x1 = +x) + "," + (this._y1 = +y);
	  },
	  quadraticCurveTo: function(x1, y1, x, y) {
	    this._ += "Q" + (+x1) + "," + (+y1) + "," + (this._x1 = +x) + "," + (this._y1 = +y);
	  },
	  bezierCurveTo: function(x1, y1, x2, y2, x, y) {
	    this._ += "C" + (+x1) + "," + (+y1) + "," + (+x2) + "," + (+y2) + "," + (this._x1 = +x) + "," + (this._y1 = +y);
	  },
	  arcTo: function(x1, y1, x2, y2, r) {
	    x1 = +x1, y1 = +y1, x2 = +x2, y2 = +y2, r = +r;
	    var x0 = this._x1,
	        y0 = this._y1,
	        x21 = x2 - x1,
	        y21 = y2 - y1,
	        x01 = x0 - x1,
	        y01 = y0 - y1,
	        l01_2 = x01 * x01 + y01 * y01;

	    // Is the radius negative? Error.
	    if (r < 0) throw new Error("negative radius: " + r);

	    // Is this path empty? Move to (x1,y1).
	    if (this._x1 === null) {
	      this._ += "M" + (this._x1 = x1) + "," + (this._y1 = y1);
	    }

	    // Or, is (x1,y1) coincident with (x0,y0)? Do nothing.
	    else if (!(l01_2 > epsilon));

	    // Or, are (x0,y0), (x1,y1) and (x2,y2) collinear?
	    // Equivalently, is (x1,y1) coincident with (x2,y2)?
	    // Or, is the radius zero? Line to (x1,y1).
	    else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon) || !r) {
	      this._ += "L" + (this._x1 = x1) + "," + (this._y1 = y1);
	    }

	    // Otherwise, draw an arc!
	    else {
	      var x20 = x2 - x0,
	          y20 = y2 - y0,
	          l21_2 = x21 * x21 + y21 * y21,
	          l20_2 = x20 * x20 + y20 * y20,
	          l21 = Math.sqrt(l21_2),
	          l01 = Math.sqrt(l01_2),
	          l = r * Math.tan((pi$1 - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2),
	          t01 = l / l01,
	          t21 = l / l21;

	      // If the start tangent is not coincident with (x0,y0), line to.
	      if (Math.abs(t01 - 1) > epsilon) {
	        this._ += "L" + (x1 + t01 * x01) + "," + (y1 + t01 * y01);
	      }

	      this._ += "A" + r + "," + r + ",0,0," + (+(y01 * x20 > x01 * y20)) + "," + (this._x1 = x1 + t21 * x21) + "," + (this._y1 = y1 + t21 * y21);
	    }
	  },
	  arc: function(x, y, r, a0, a1, ccw) {
	    x = +x, y = +y, r = +r;
	    var dx = r * Math.cos(a0),
	        dy = r * Math.sin(a0),
	        x0 = x + dx,
	        y0 = y + dy,
	        cw = 1 ^ ccw,
	        da = ccw ? a0 - a1 : a1 - a0;

	    // Is the radius negative? Error.
	    if (r < 0) throw new Error("negative radius: " + r);

	    // Is this path empty? Move to (x0,y0).
	    if (this._x1 === null) {
	      this._ += "M" + x0 + "," + y0;
	    }

	    // Or, is (x0,y0) not coincident with the previous point? Line to (x0,y0).
	    else if (Math.abs(this._x1 - x0) > epsilon || Math.abs(this._y1 - y0) > epsilon) {
	      this._ += "L" + x0 + "," + y0;
	    }

	    // Is this arc empty? We’re done.
	    if (!r) return;

	    // Does the angle go the wrong way? Flip the direction.
	    if (da < 0) da = da % tau$1 + tau$1;

	    // Is this a complete circle? Draw two arcs to complete the circle.
	    if (da > tauEpsilon) {
	      this._ += "A" + r + "," + r + ",0,1," + cw + "," + (x - dx) + "," + (y - dy) + "A" + r + "," + r + ",0,1," + cw + "," + (this._x1 = x0) + "," + (this._y1 = y0);
	    }

	    // Is this arc non-empty? Draw an arc!
	    else if (da > epsilon) {
	      this._ += "A" + r + "," + r + ",0," + (+(da >= pi$1)) + "," + cw + "," + (this._x1 = x + r * Math.cos(a1)) + "," + (this._y1 = y + r * Math.sin(a1));
	    }
	  },
	  rect: function(x, y, w, h) {
	    this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y) + "h" + (+w) + "v" + (+h) + "h" + (-w) + "Z";
	  },
	  toString: function() {
	    return this._;
	  }
	};

	function constant$2(x) {
	  return function constant() {
	    return x;
	  };
	}

	var pi$2 = Math.PI;

	function Linear(context) {
	  this._context = context;
	}

	Linear.prototype = {
	  areaStart: function() {
	    this._line = 0;
	  },
	  areaEnd: function() {
	    this._line = NaN;
	  },
	  lineStart: function() {
	    this._point = 0;
	  },
	  lineEnd: function() {
	    if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
	    this._line = 1 - this._line;
	  },
	  point: function(x, y) {
	    x = +x, y = +y;
	    switch (this._point) {
	      case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
	      case 1: this._point = 2; // proceed
	      default: this._context.lineTo(x, y); break;
	    }
	  }
	};

	function curveLinear(context) {
	  return new Linear(context);
	}

	function x(p) {
	  return p[0];
	}

	function y(p) {
	  return p[1];
	}

	function line() {
	  var x$1 = x,
	      y$1 = y,
	      defined = constant$2(true),
	      context = null,
	      curve = curveLinear,
	      output = null;

	  function line(data) {
	    var i,
	        n = data.length,
	        d,
	        defined0 = false,
	        buffer;

	    if (context == null) output = curve(buffer = path$1());

	    for (i = 0; i <= n; ++i) {
	      if (!(i < n && defined(d = data[i], i, data)) === defined0) {
	        if (defined0 = !defined0) output.lineStart();
	        else output.lineEnd();
	      }
	      if (defined0) output.point(+x$1(d, i, data), +y$1(d, i, data));
	    }

	    if (buffer) return output = null, buffer + "" || null;
	  }

	  line.x = function(_) {
	    return arguments.length ? (x$1 = typeof _ === "function" ? _ : constant$2(+_), line) : x$1;
	  };

	  line.y = function(_) {
	    return arguments.length ? (y$1 = typeof _ === "function" ? _ : constant$2(+_), line) : y$1;
	  };

	  line.defined = function(_) {
	    return arguments.length ? (defined = typeof _ === "function" ? _ : constant$2(!!_), line) : defined;
	  };

	  line.curve = function(_) {
	    return arguments.length ? (curve = _, context != null && (output = curve(context)), line) : curve;
	  };

	  line.context = function(_) {
	    return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), line) : context;
	  };

	  return line;
	}

	function sign(x) {
	  return x < 0 ? -1 : 1;
	}

	// Calculate the slopes of the tangents (Hermite-type interpolation) based on
	// the following paper: Steffen, M. 1990. A Simple Method for Monotonic
	// Interpolation in One Dimension. Astronomy and Astrophysics, Vol. 239, NO.
	// NOV(II), P. 443, 1990.
	function slope3(that, x2, y2) {
	  var h0 = that._x1 - that._x0,
	      h1 = x2 - that._x1,
	      s0 = (that._y1 - that._y0) / (h0 || h1 < 0 && -0),
	      s1 = (y2 - that._y1) / (h1 || h0 < 0 && -0),
	      p = (s0 * h1 + s1 * h0) / (h0 + h1);
	  return (sign(s0) + sign(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0;
	}

	// Calculate a one-sided slope.
	function slope2(that, t) {
	  var h = that._x1 - that._x0;
	  return h ? (3 * (that._y1 - that._y0) / h - t) / 2 : t;
	}

	// According to https://en.wikipedia.org/wiki/Cubic_Hermite_spline#Representations
	// "you can express cubic Hermite interpolation in terms of cubic Bézier curves
	// with respect to the four values p0, p0 + m0 / 3, p1 - m1 / 3, p1".
	function point(that, t0, t1) {
	  var x0 = that._x0,
	      y0 = that._y0,
	      x1 = that._x1,
	      y1 = that._y1,
	      dx = (x1 - x0) / 3;
	  that._context.bezierCurveTo(x0 + dx, y0 + dx * t0, x1 - dx, y1 - dx * t1, x1, y1);
	}

	function MonotoneX(context) {
	  this._context = context;
	}

	MonotoneX.prototype = {
	  areaStart: function() {
	    this._line = 0;
	  },
	  areaEnd: function() {
	    this._line = NaN;
	  },
	  lineStart: function() {
	    this._x0 = this._x1 =
	    this._y0 = this._y1 =
	    this._t0 = NaN;
	    this._point = 0;
	  },
	  lineEnd: function() {
	    switch (this._point) {
	      case 2: this._context.lineTo(this._x1, this._y1); break;
	      case 3: point(this, this._t0, slope2(this, this._t0)); break;
	    }
	    if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
	    this._line = 1 - this._line;
	  },
	  point: function(x, y) {
	    var t1 = NaN;

	    x = +x, y = +y;
	    if (x === this._x1 && y === this._y1) return; // Ignore coincident points.
	    switch (this._point) {
	      case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
	      case 1: this._point = 2; break;
	      case 2: this._point = 3; point(this, slope2(this, t1 = slope3(this, x, y)), t1); break;
	      default: point(this, this._t0, t1 = slope3(this, x, y)); break;
	    }

	    this._x0 = this._x1, this._x1 = x;
	    this._y0 = this._y1, this._y1 = y;
	    this._t0 = t1;
	  }
	};

	function MonotoneY(context) {
	  this._context = new ReflectContext(context);
	}

	(MonotoneY.prototype = Object.create(MonotoneX.prototype)).point = function(x, y) {
	  MonotoneX.prototype.point.call(this, y, x);
	};

	function ReflectContext(context) {
	  this._context = context;
	}

	ReflectContext.prototype = {
	  moveTo: function(x, y) { this._context.moveTo(y, x); },
	  closePath: function() { this._context.closePath(); },
	  lineTo: function(x, y) { this._context.lineTo(y, x); },
	  bezierCurveTo: function(x1, y1, x2, y2, x, y) { this._context.bezierCurveTo(y1, x1, y2, x2, y, x); }
	};

	/* src/components/Marks/Rectangle.svelte generated by Svelte v3.2.2 */

	const file$3 = "src/components/Marks/Rectangle.svelte";

	function create_fragment$3(ctx) {
		var path_1;

		return {
			c: function create() {
				path_1 = svg_element("path");
				attr(path_1, "d", ctx.path);
				add_location(path_1, file$3, 23, 0, 353);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, path_1, anchor);
			},

			p: function update(changed, ctx) {
				if (changed.path) {
					attr(path_1, "d", ctx.path);
				}
			},

			i: noop,
			o: noop,

			d: function destroy(detaching) {
				if (detaching) {
					detach(path_1);
				}
			}
		};
	}

	function generatePoints (x1, x2, y1, y2) {
	  return [
	      [x1, y1],
	      [x1, y2],
	      [x2, y2],
	      [x2, y1],
	      [x1, y1]
	    ]
	}

	function instance$3($$self, $$props, $$invalidate) {
		let { x1, x2, y1, y2 } = $$props;

		$$self.$set = $$props => {
			if ('x1' in $$props) $$invalidate('x1', x1 = $$props.x1);
			if ('x2' in $$props) $$invalidate('x2', x2 = $$props.x2);
			if ('y1' in $$props) $$invalidate('y1', y1 = $$props.y1);
			if ('y2' in $$props) $$invalidate('y2', y2 = $$props.y2);
		};

		let points, path;

		$$self.$$.update = ($$dirty = { x1: 1, x2: 1, y1: 1, y2: 1, points: 1 }) => {
			if ($$dirty.x1 || $$dirty.x2 || $$dirty.y1 || $$dirty.y2) { $$invalidate('points', points = generatePoints(x1, x2, y1, y2)); }
			if ($$dirty.points) { $$invalidate('path', path = line()(points)); }
		};

		return { x1, x2, y1, y2, path };
	}

	class Rectangle extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$3, create_fragment$3, safe_not_equal, ["x1", "x2", "y1", "y2"]);

			const { ctx } = this.$$;
			const props = options.props || {};
			if (ctx.x1 === undefined && !('x1' in props)) {
				console.warn("<Rectangle> was created without expected prop 'x1'");
			}
			if (ctx.x2 === undefined && !('x2' in props)) {
				console.warn("<Rectangle> was created without expected prop 'x2'");
			}
			if (ctx.y1 === undefined && !('y1' in props)) {
				console.warn("<Rectangle> was created without expected prop 'y1'");
			}
			if (ctx.y2 === undefined && !('y2' in props)) {
				console.warn("<Rectangle> was created without expected prop 'y2'");
			}
		}

		get x1() {
			throw new Error("<Rectangle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set x1(value) {
			throw new Error("<Rectangle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get x2() {
			throw new Error("<Rectangle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set x2(value) {
			throw new Error("<Rectangle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get y1() {
			throw new Error("<Rectangle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set y1(value) {
			throw new Error("<Rectangle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get y2() {
			throw new Error("<Rectangle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set y2(value) {
			throw new Error("<Rectangle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src/examples/BarChart.svelte generated by Svelte v3.2.2 */

	function get_each_context(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.row = list[i];
		return child_ctx;
	}

	// (34:4) {#each data.rows() as row}
	function create_each_block(ctx) {
		var current;

		var rectangle = new Rectangle({
			props: {
			x1: ctx.scaleX(ctx.row.fruit),
			x2: ctx.scaleX(ctx.row.fruit) + ctx.scaleX.bandwidth(),
			y1: ctx.scaleY(0),
			y2: ctx.scaleY(ctx.row.meanQuantity)
		},
			$$inline: true
		});

		return {
			c: function create() {
				rectangle.$$.fragment.c();
			},

			m: function mount(target, anchor) {
				mount_component(rectangle, target, anchor);
				current = true;
			},

			p: function update(changed, ctx) {
				var rectangle_changes = {};
				if (changed.scaleX || changed.data) rectangle_changes.x1 = ctx.scaleX(ctx.row.fruit);
				if (changed.scaleX || changed.data) rectangle_changes.x2 = ctx.scaleX(ctx.row.fruit) + ctx.scaleX.bandwidth();
				if (changed.scaleY) rectangle_changes.y1 = ctx.scaleY(0);
				if (changed.scaleY || changed.data) rectangle_changes.y2 = ctx.scaleY(ctx.row.meanQuantity);
				rectangle.$set(rectangle_changes);
			},

			i: function intro(local) {
				if (current) return;
				rectangle.$$.fragment.i(local);

				current = true;
			},

			o: function outro(local) {
				rectangle.$$.fragment.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				rectangle.$destroy(detaching);
			}
		};
	}

	// (26:2) <Section     x1={50} x2={450}     y1={50} y2={450}     scaleX={scaleFruit}    scaleY={scaleMeanQuantity}     let:scaleX let:scaleY   >
	function create_default_slot_1(ctx) {
		var each_1_anchor, current;

		var each_value = ctx.data.rows();

		var each_blocks = [];

		for (var i = 0; i < each_value.length; i += 1) {
			each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
		}

		function outro_block(i, detaching, local) {
			if (each_blocks[i]) {
				if (detaching) {
					on_outro(() => {
						each_blocks[i].d(detaching);
						each_blocks[i] = null;
					});
				}

				each_blocks[i].o(local);
			}
		}

		return {
			c: function create() {
				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].c();
				}

				each_1_anchor = empty();
			},

			m: function mount(target, anchor) {
				for (var i = 0; i < each_blocks.length; i += 1) {
					each_blocks[i].m(target, anchor);
				}

				insert(target, each_1_anchor, anchor);
				current = true;
			},

			p: function update(changed, ctx) {
				if (changed.scaleX || changed.data || changed.scaleY) {
					each_value = ctx.data.rows();

					for (var i = 0; i < each_value.length; i += 1) {
						const child_ctx = get_each_context(ctx, each_value, i);

						if (each_blocks[i]) {
							each_blocks[i].p(changed, child_ctx);
							each_blocks[i].i(1);
						} else {
							each_blocks[i] = create_each_block(child_ctx);
							each_blocks[i].c();
							each_blocks[i].i(1);
							each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
						}
					}

					group_outros();
					for (; i < each_blocks.length; i += 1) outro_block(i, 1, 1);
					check_outros();
				}
			},

			i: function intro(local) {
				if (current) return;
				for (var i = 0; i < each_value.length; i += 1) each_blocks[i].i();

				current = true;
			},

			o: function outro(local) {
				each_blocks = each_blocks.filter(Boolean);
				for (let i = 0; i < each_blocks.length; i += 1) outro_block(i, 0);

				current = false;
			},

			d: function destroy(detaching) {
				destroy_each(each_blocks, detaching);

				if (detaching) {
					detach(each_1_anchor);
				}
			}
		};
	}

	// (24:0) <Graphic width={500} height={500}>
	function create_default_slot(ctx) {
		var current;

		var section = new Section({
			props: {
			x1: 50,
			x2: 450,
			y1: 50,
			y2: 450,
			scaleX: ctx.scaleFruit,
			scaleY: ctx.scaleMeanQuantity,
			$$slots: {
			default: [create_default_slot_1, ({ scaleX, scaleY }) => ({ scaleX, scaleY })]
		},
			$$scope: { ctx }
		},
			$$inline: true
		});

		return {
			c: function create() {
				section.$$.fragment.c();
			},

			m: function mount(target, anchor) {
				mount_component(section, target, anchor);
				current = true;
			},

			p: function update(changed, ctx) {
				var section_changes = {};
				if (changed.scaleFruit) section_changes.scaleX = ctx.scaleFruit;
				if (changed.scaleMeanQuantity) section_changes.scaleY = ctx.scaleMeanQuantity;
				if (changed.$$scope || changed.data) section_changes.$$scope = { changed, ctx };
				section.$set(section_changes);
			},

			i: function intro(local) {
				if (current) return;
				section.$$.fragment.i(local);

				current = true;
			},

			o: function outro(local) {
				section.$$.fragment.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				section.$destroy(detaching);
			}
		};
	}

	function create_fragment$4(ctx) {
		var current;

		var graphic = new Graphic({
			props: {
			width: 500,
			height: 500,
			$$slots: { default: [create_default_slot] },
			$$scope: { ctx }
		},
			$$inline: true
		});

		return {
			c: function create() {
				graphic.$$.fragment.c();
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				mount_component(graphic, target, anchor);
				current = true;
			},

			p: function update(changed, ctx) {
				var graphic_changes = {};
				if (changed.$$scope || changed.data) graphic_changes.$$scope = { changed, ctx };
				graphic.$set(graphic_changes);
			},

			i: function intro(local) {
				if (current) return;
				graphic.$$.fragment.i(local);

				current = true;
			},

			o: function outro(local) {
				graphic.$$.fragment.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				graphic.$destroy(detaching);
			}
		};
	}

	function instance$4($$self, $$props, $$invalidate) {
		
	  
	  let data = new DataContainer({ 
	    quantity: [1, 4, 2, 3, 3, 5, 6, 9], 
	    fruit: [NaN, 'anchovies', 'banana', 'banana', 'coconut', 'coconut', 'durian', 'durian']
	  });

	  $$invalidate('data', data = data
	    .dropNA()
	    .filter(row => row.fruit !== 'anchovies')
	    .groupBy('fruit')
	    .summarise({ meanQuantity: { quantity: 'mean' } })
	    .arrange({ meanQuantity: 'descending' })
	    .done());

	  const scaleFruit = band().domain(data.domain('fruit'));
		let meanQuantityDomain = [0, data.domain('meanQuantity')[1]];
	  const scaleMeanQuantity = linear$1().domain(meanQuantityDomain);

		return { data, scaleFruit, scaleMeanQuantity };
	}

	class BarChart extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$4, create_fragment$4, safe_not_equal, []);
		}
	}

	/* src/examples/Scatterplot.svelte generated by Svelte v3.2.2 */

	const file$4 = "src/examples/Scatterplot.svelte";

	function get_each_context$1(ctx, list, i) {
		const child_ctx = Object.create(ctx);
		child_ctx.row = list[i];
		return child_ctx;
	}

	// (37:3) {#each data.rows() as row (row.$index)}
	function create_each_block$1(key_1, ctx) {
		var first, current;

		var point = new Point({
			props: { x: ctx.scaleX(ctx.row.a), y: ctx.scaleY(ctx.row.b) },
			$$inline: true
		});

		return {
			key: key_1,

			first: null,

			c: function create() {
				first = empty();
				point.$$.fragment.c();
				this.first = first;
			},

			m: function mount(target, anchor) {
				insert(target, first, anchor);
				mount_component(point, target, anchor);
				current = true;
			},

			p: function update(changed, ctx) {
				var point_changes = {};
				if (changed.scaleX || changed.data) point_changes.x = ctx.scaleX(ctx.row.a);
				if (changed.scaleY || changed.data) point_changes.y = ctx.scaleY(ctx.row.b);
				point.$set(point_changes);
			},

			i: function intro(local) {
				if (current) return;
				point.$$.fragment.i(local);

				current = true;
			},

			o: function outro(local) {
				point.$$.fragment.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(first);
				}

				point.$destroy(detaching);
			}
		};
	}

	// (29:2) <Section    x1={50} x2={450}    y1={50} y2={450}    scaleX={scaleA}    scaleY={scaleB}    let:scaleX let:scaleY   >
	function create_default_slot_1$1(ctx) {
		var each_blocks = [], each_1_lookup = new Map(), each_1_anchor, current;

		var each_value = ctx.data.rows();

		const get_key = ctx => ctx.row.$index;

		for (var i = 0; i < each_value.length; i += 1) {
			let child_ctx = get_each_context$1(ctx, each_value, i);
			let key = get_key(child_ctx);
			each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
		}

		return {
			c: function create() {
				for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].c();

				each_1_anchor = empty();
			},

			m: function mount(target, anchor) {
				for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].m(target, anchor);

				insert(target, each_1_anchor, anchor);
				current = true;
			},

			p: function update(changed, ctx) {
				const each_value = ctx.data.rows();

				group_outros();
				each_blocks = update_keyed_each(each_blocks, changed, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block$1, each_1_anchor, get_each_context$1);
				check_outros();
			},

			i: function intro(local) {
				if (current) return;
				for (var i = 0; i < each_value.length; i += 1) each_blocks[i].i();

				current = true;
			},

			o: function outro(local) {
				for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].o();

				current = false;
			},

			d: function destroy(detaching) {
				for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].d(detaching);

				if (detaching) {
					detach(each_1_anchor);
				}
			}
		};
	}

	// (27:1) <Graphic width={500} height={500}>
	function create_default_slot$1(ctx) {
		var current;

		var section = new Section({
			props: {
			x1: 50,
			x2: 450,
			y1: 50,
			y2: 450,
			scaleX: ctx.scaleA,
			scaleY: ctx.scaleB,
			$$slots: {
			default: [create_default_slot_1$1, ({ scaleX, scaleY }) => ({ scaleX, scaleY })]
		},
			$$scope: { ctx }
		},
			$$inline: true
		});

		return {
			c: function create() {
				section.$$.fragment.c();
			},

			m: function mount(target, anchor) {
				mount_component(section, target, anchor);
				current = true;
			},

			p: function update(changed, ctx) {
				var section_changes = {};
				if (changed.scaleA) section_changes.scaleX = ctx.scaleA;
				if (changed.scaleB) section_changes.scaleY = ctx.scaleB;
				if (changed.$$scope) section_changes.$$scope = { changed, ctx };
				section.$set(section_changes);
			},

			i: function intro(local) {
				if (current) return;
				section.$$.fragment.i(local);

				current = true;
			},

			o: function outro(local) {
				section.$$.fragment.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				section.$destroy(detaching);
			}
		};
	}

	function create_fragment$5(ctx) {
		var div, current;

		var graphic = new Graphic({
			props: {
			width: 500,
			height: 500,
			$$slots: { default: [create_default_slot$1] },
			$$scope: { ctx }
		},
			$$inline: true
		});

		return {
			c: function create() {
				div = element("div");
				graphic.$$.fragment.c();
				add_location(div, file$4, 25, 0, 611);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				mount_component(graphic, div, null);
				current = true;
			},

			p: function update(changed, ctx) {
				var graphic_changes = {};
				if (changed.$$scope) graphic_changes.$$scope = { changed, ctx };
				graphic.$set(graphic_changes);
			},

			i: function intro(local) {
				if (current) return;
				graphic.$$.fragment.i(local);

				current = true;
			},

			o: function outro(local) {
				graphic.$$.fragment.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(div);
				}

				graphic.$destroy();
			}
		};
	}

	function generateData (N, error) {
		const getError = () => -error + (Math.random() * (2 * error)) * N;

		let data = { a: [], b: [] };
		for (let i = 0; i < N; i++) {
			data.a.push(i + getError());
			data.b.push(i + getError());
		}

		return data
	}

	function instance$5($$self, $$props, $$invalidate) {
		

		let { N = 100 } = $$props;

		const data = new DataContainer(generateData(N, 0.25));

		const scaleA = linear$1().domain(data.domain('a'));
		const scaleB = linear$1().domain(data.domain('b'));

		$$self.$set = $$props => {
			if ('N' in $$props) $$invalidate('N', N = $$props.N);
		};

		return { N, data, scaleA, scaleB };
	}

	class Scatterplot extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$5, create_fragment$5, safe_not_equal, ["N"]);
		}

		get N() {
			throw new Error("<Scatterplot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set N(value) {
			throw new Error("<Scatterplot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src/App.svelte generated by Svelte v3.2.2 */

	const file$5 = "src/App.svelte";

	function create_fragment$6(ctx) {
		var div2, div0, h10, t1, t2, div1, h11, t4, current;

		var barchart = new BarChart({ $$inline: true });

		var scatterplot = new Scatterplot({ $$inline: true });

		return {
			c: function create() {
				div2 = element("div");
				div0 = element("div");
				h10 = element("h1");
				h10.textContent = "Bar chart";
				t1 = space();
				barchart.$$.fragment.c();
				t2 = space();
				div1 = element("div");
				h11 = element("h1");
				h11.textContent = "Scatterplot";
				t4 = space();
				scatterplot.$$.fragment.c();
				add_location(h10, file$5, 22, 4, 394);
				div0.className = "graphic-holder svelte-ryv7ci";
				add_location(div0, file$5, 21, 2, 361);
				add_location(h11, file$5, 27, 4, 475);
				div1.className = "graphic-holder svelte-ryv7ci";
				add_location(div1, file$5, 26, 2, 442);
				div2.className = "container svelte-ryv7ci";
				add_location(div2, file$5, 19, 0, 334);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, div2, anchor);
				append(div2, div0);
				append(div0, h10);
				append(div0, t1);
				mount_component(barchart, div0, null);
				append(div2, t2);
				append(div2, div1);
				append(div1, h11);
				append(div1, t4);
				mount_component(scatterplot, div1, null);
				current = true;
			},

			p: noop,

			i: function intro(local) {
				if (current) return;
				barchart.$$.fragment.i(local);

				scatterplot.$$.fragment.i(local);

				current = true;
			},

			o: function outro(local) {
				barchart.$$.fragment.o(local);
				scatterplot.$$.fragment.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(div2);
				}

				barchart.$destroy();

				scatterplot.$destroy();
			}
		};
	}

	class App extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, null, create_fragment$6, safe_not_equal, []);
		}
	}

	const app = new App({
	  target: document.body
	});

	return app;

}());
//# sourceMappingURL=bundle.js.map
