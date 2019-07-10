
(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
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
    function validate_store(store, name) {
        if (!store || typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(component, store, callback) {
        const unsub = store.subscribe(callback);
        component.$$.on_destroy.push(unsub.unsubscribe
            ? () => unsub.unsubscribe()
            : unsub);
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

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = cb => requestAnimationFrame(cb);

    const tasks = new Set();
    let running = false;
    function run_tasks() {
        tasks.forEach(task => {
            if (!task[0](now())) {
                tasks.delete(task);
                task[1]();
            }
        });
        running = tasks.size > 0;
        if (running)
            raf(run_tasks);
    }
    function loop(fn) {
        let task;
        if (!running) {
            running = true;
            raf(run_tasks);
        }
        return {
            promise: new Promise(fulfil => {
                tasks.add(task = [fn, fulfil]);
            }),
            abort() {
                tasks.delete(task);
            }
        };
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
            if (iterations[i])
                iterations[i].d(detaching);
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
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
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
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment) {
            $$.update($$.dirty);
            run_all($$.before_update);
            $$.fragment.p($$.dirty, $$.ctx);
            $$.dirty = null;
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
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
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.callbacks.push(() => {
                outroing.delete(block);
                if (callback) {
                    block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined' ? window : global);

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function update_keyed_each(old_blocks, changed, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
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
            }
            else if (dynamic) {
                block.p(changed, child_ctx);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
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
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        if (component.$$.fragment) {
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
    function init(component, options, instance, create_fragment, not_equal, prop_names) {
        const parent_component = current_component;
        set_current_component(component);
        const props = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props: prop_names,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty: null
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, props, (key, value) => {
                if ($$.ctx && not_equal($$.ctx[key], $$.ctx[key] = value)) {
                    if ($$.bound[key])
                        $$.bound[key](value);
                    if (ready)
                        make_dirty(component, key);
                }
            })
            : props;
        $$.update();
        ready = true;
        run_all($$.before_update);
        $$.fragment = create_fragment($$.ctx);
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
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

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function unwrapExports (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var cjs = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, '__esModule', { value: true });

    var makeOptions = function (opts) {
        if (opts === void 0) { opts = {}; }
        return ({
            arrayFormat: opts.arrayFormat || 'none',
            booleanFormat: opts.booleanFormat || 'none',
            nullFormat: opts.nullFormat || 'default'
        });
    };
    var encodeValue = function (value) { return encodeURIComponent(value); };
    var decodeValue = function (value) { return decodeURIComponent(value); };
    var encodeBoolean = function (name, value, opts) {
        if (opts.booleanFormat === 'empty-true' && value) {
            return name;
        }
        var encodedValue;
        if (opts.booleanFormat === 'unicode') {
            encodedValue = value ? '✓' : '✗';
        }
        else {
            encodedValue = value.toString();
        }
        return name + "=" + encodedValue;
    };
    var encodeNull = function (name, opts) {
        if (opts.nullFormat === 'hidden') {
            return '';
        }
        if (opts.nullFormat === 'string') {
            return name + "=null";
        }
        return name;
    };
    var getNameEncoder = function (opts) {
        if (opts.arrayFormat === 'index') {
            return function (name, index) { return name + "[" + index + "]"; };
        }
        if (opts.arrayFormat === 'brackets') {
            return function (name) { return name + "[]"; };
        }
        return function (name) { return name; };
    };
    var encodeArray = function (name, arr, opts) {
        var encodeName = getNameEncoder(opts);
        return arr
            .map(function (val, index) { return encodeName(name, index) + "=" + encodeValue(val); })
            .join('&');
    };
    var encode = function (name, value, opts) {
        if (value === null) {
            return encodeNull(name, opts);
        }
        if (typeof value === 'boolean') {
            return encodeBoolean(name, value, opts);
        }
        if (Array.isArray(value)) {
            return encodeArray(name, value, opts);
        }
        return name + "=" + encodeValue(value);
    };
    var decode = function (value, opts) {
        if (value === undefined) {
            return opts.booleanFormat === 'empty-true' ? true : null;
        }
        if (opts.booleanFormat === 'string') {
            if (value === 'true') {
                return true;
            }
            if (value === 'false') {
                return false;
            }
        }
        else if (opts.booleanFormat === 'unicode') {
            if (decodeValue(value) === '✓') {
                return true;
            }
            if (decodeValue(value) === '✗') {
                return false;
            }
        }
        else if (opts.nullFormat === 'string') {
            if (value === 'null') {
                return null;
            }
        }
        return decodeValue(value);
    };

    var getSearch = function (path) {
        var pos = path.indexOf('?');
        if (pos === -1) {
            return path;
        }
        return path.slice(pos + 1);
    };
    var isSerialisable = function (val) { return val !== undefined; };
    var parseName = function (name) {
        var bracketPosition = name.indexOf('[');
        var hasBrackets = bracketPosition !== -1;
        return {
            hasBrackets: hasBrackets,
            name: hasBrackets ? name.slice(0, bracketPosition) : name
        };
    };

    /**
     * Parse a querystring and return an object of parameters
     */
    var parse = function (path, opts) {
        var options = makeOptions(opts);
        return getSearch(path)
            .split('&')
            .reduce(function (params, param) {
            var _a = param.split('='), rawName = _a[0], value = _a[1];
            var _b = parseName(rawName), hasBrackets = _b.hasBrackets, name = _b.name;
            var currentValue = params[name];
            var decodedValue = decode(value, options);
            if (currentValue === undefined) {
                params[name] = hasBrackets ? [decodedValue] : decodedValue;
            }
            else {
                params[name] = [].concat(currentValue, decodedValue);
            }
            return params;
        }, {});
    };
    /**
     * Build a querystring from an object of parameters
     */
    var build = function (params, opts) {
        var options = makeOptions(opts);
        return Object.keys(params)
            .filter(function (paramName) { return isSerialisable(params[paramName]); })
            .map(function (paramName) { return encode(paramName, params[paramName], options); })
            .filter(Boolean)
            .join('&');
    };
    /**
     * Remove a list of parameters from a querystring
     */
    var omit = function (path, paramsToOmit, opts) {
        var options = makeOptions(opts);
        var searchPart = getSearch(path);
        if (searchPart === '') {
            return {
                querystring: '',
                removedParams: {}
            };
        }
        var _a = path.split('&').reduce(function (_a, chunk) {
            var left = _a[0], right = _a[1];
            var rawName = chunk.split('=')[0];
            var name = parseName(rawName).name;
            return paramsToOmit.indexOf(name) === -1
                ? [left.concat(chunk), right]
                : [left, right.concat(chunk)];
        }, [[], []]), kept = _a[0], removed = _a[1];
        return {
            querystring: kept.join('&'),
            removedParams: parse(removed.join('&'), options)
        };
    };
    /**
     * Remove a list of parameters from a querystring
     */
    var keep = function (path, paramsToKeep, opts) {
        var options = makeOptions(opts);
        var searchPart = getSearch(path);
        if (searchPart === '') {
            return {
                keptParams: {},
                querystring: ''
            };
        }
        var _a = path.split('&').reduce(function (_a, chunk) {
            var left = _a[0], right = _a[1];
            var rawName = chunk.split('=')[0];
            var name = parseName(rawName).name;
            return paramsToKeep.indexOf(name) >= 0
                ? [left.concat(chunk), right]
                : [left, right.concat(chunk)];
        }, [[], []]), kept = _a[0], removed = _a[1];
        return {
            keptParams: parse(kept.join('&'), options),
            querystring: kept.join('&')
        };
    };

    exports.parse = parse;
    exports.build = build;
    exports.omit = omit;
    exports.keep = keep;
    });

    unwrapExports(cjs);
    var cjs_1 = cjs.parse;
    var cjs_2 = cjs.build;
    var cjs_3 = cjs.omit;
    var cjs_4 = cjs.keep;

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    var __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };

    var defaultOrConstrained = function (match) {
        return '(' +
            (match ? match.replace(/(^<|>$)/g, '') : "[a-zA-Z0-9-_.~%':|=+\\*@]+") +
            ')';
    };
    var rules = [
        {
            name: 'url-parameter',
            pattern: /^:([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})(<(.+?)>)?/,
            regex: function (match) {
                return new RegExp(defaultOrConstrained(match[2]));
            }
        },
        {
            name: 'url-parameter-splat',
            pattern: /^\*([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})/,
            regex: /([^?]*)/
        },
        {
            name: 'url-parameter-matrix',
            pattern: /^;([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})(<(.+?)>)?/,
            regex: function (match) {
                return new RegExp(';' + match[1] + '=' + defaultOrConstrained(match[2]));
            }
        },
        {
            name: 'query-parameter',
            pattern: /^(?:\?|&)(?::)?([a-zA-Z0-9-_]*[a-zA-Z0-9]{1})/
        },
        {
            name: 'delimiter',
            pattern: /^(\/|\?)/,
            regex: function (match) { return new RegExp('\\' + match[0]); }
        },
        {
            name: 'sub-delimiter',
            pattern: /^(!|&|-|_|\.|;)/,
            regex: function (match) { return new RegExp(match[0]); }
        },
        {
            name: 'fragment',
            pattern: /^([0-9a-zA-Z]+)/,
            regex: function (match) { return new RegExp(match[0]); }
        }
    ];

    var tokenise = function (str, tokens) {
        if (tokens === void 0) { tokens = []; }
        // Look for a matching rule
        var matched = rules.some(function (rule) {
            var match = str.match(rule.pattern);
            if (!match) {
                return false;
            }
            tokens.push({
                type: rule.name,
                match: match[0],
                val: match.slice(1, 2),
                otherVal: match.slice(2),
                regex: rule.regex instanceof Function ? rule.regex(match) : rule.regex
            });
            if (match[0].length < str.length) {
                tokens = tokenise(str.substr(match[0].length), tokens);
            }
            return true;
        });
        // If no rules matched, throw an error (possible malformed path)
        if (!matched) {
            throw new Error("Could not parse path '" + str + "'");
        }
        return tokens;
    };

    var identity$1 = function (_) { return _; };
    var exists = function (val) { return val !== undefined && val !== null; };
    var optTrailingSlash = function (source, strictTrailingSlash) {
        if (strictTrailingSlash) {
            return source;
        }
        if (source === '\\/') {
            return source;
        }
        return source.replace(/\\\/$/, '') + '(?:\\/)?';
    };
    var upToDelimiter = function (source, delimiter) {
        if (!delimiter) {
            return source;
        }
        return /(\/)$/.test(source) ? source : source + '(\\/|\\?|\\.|;|$)';
    };
    var appendQueryParam = function (params, param, val) {
        if (val === void 0) { val = ''; }
        var existingVal = params[param];
        if (existingVal === undefined) {
            params[param] = val;
        }
        else {
            params[param] = Array.isArray(existingVal)
                ? existingVal.concat(val)
                : [existingVal, val];
        }
        return params;
    };
    var Path = /** @class */ (function () {
        function Path(path) {
            if (!path) {
                throw new Error('Missing path in Path constructor');
            }
            this.path = path;
            this.tokens = tokenise(path);
            this.hasUrlParams =
                this.tokens.filter(function (t) { return /^url-parameter/.test(t.type); }).length > 0;
            this.hasSpatParam =
                this.tokens.filter(function (t) { return /splat$/.test(t.type); }).length > 0;
            this.hasMatrixParams =
                this.tokens.filter(function (t) { return /matrix$/.test(t.type); }).length > 0;
            this.hasQueryParams =
                this.tokens.filter(function (t) { return /^query-parameter/.test(t.type); }).length > 0;
            // Extract named parameters from tokens
            this.spatParams = this.getParams('url-parameter-splat');
            this.urlParams = this.getParams(/^url-parameter/);
            // Query params
            this.queryParams = this.getParams('query-parameter');
            // All params
            this.params = this.urlParams.concat(this.queryParams);
            // Check if hasQueryParams
            // Regular expressions for url part only (full and partial match)
            this.source = this.tokens
                .filter(function (t) { return t.regex !== undefined; })
                .map(function (r) { return r.regex.source; })
                .join('');
        }
        Path.createPath = function (path) {
            return new Path(path);
        };
        Path.prototype.isQueryParam = function (name) {
            return this.queryParams.indexOf(name) !== -1;
        };
        Path.prototype.test = function (path, opts) {
            var _this = this;
            var options = __assign({ strictTrailingSlash: false, queryParams: {} }, opts);
            // trailingSlash: falsy => non optional, truthy => optional
            var source = optTrailingSlash(this.source, options.strictTrailingSlash);
            // Check if exact match
            var match = this.urlTest(path, source + (this.hasQueryParams ? '(\\?.*$|$)' : '$'), opts);
            // If no match, or no query params, no need to go further
            if (!match || !this.hasQueryParams) {
                return match;
            }
            // Extract query params
            var queryParams = cjs_1(path, options.queryParams);
            var unexpectedQueryParams = Object.keys(queryParams).filter(function (p) { return !_this.isQueryParam(p); });
            if (unexpectedQueryParams.length === 0) {
                // Extend url match
                Object.keys(queryParams).forEach(function (p) { return (match[p] = queryParams[p]); });
                return match;
            }
            return null;
        };
        Path.prototype.partialTest = function (path, opts) {
            var _this = this;
            var options = __assign({ delimited: true, queryParams: {} }, opts);
            // Check if partial match (start of given path matches regex)
            // trailingSlash: falsy => non optional, truthy => optional
            var source = upToDelimiter(this.source, options.delimited);
            var match = this.urlTest(path, source, options);
            if (!match) {
                return match;
            }
            if (!this.hasQueryParams) {
                return match;
            }
            var queryParams = cjs_1(path, options.queryParams);
            Object.keys(queryParams)
                .filter(function (p) { return _this.isQueryParam(p); })
                .forEach(function (p) { return appendQueryParam(match, p, queryParams[p]); });
            return match;
        };
        Path.prototype.build = function (params, opts) {
            var _this = this;
            if (params === void 0) { params = {}; }
            var options = __assign({ ignoreConstraints: false, ignoreSearch: false, queryParams: {} }, opts);
            var encodedUrlParams = Object.keys(params)
                .filter(function (p) { return !_this.isQueryParam(p); })
                .reduce(function (acc, key) {
                if (!exists(params[key])) {
                    return acc;
                }
                var val = params[key];
                var encode = _this.isQueryParam(key) ? identity$1 : encodeURI;
                if (typeof val === 'boolean') {
                    acc[key] = val;
                }
                else if (Array.isArray(val)) {
                    acc[key] = val.map(encode);
                }
                else {
                    acc[key] = encode(val);
                }
                return acc;
            }, {});
            // Check all params are provided (not search parameters which are optional)
            if (this.urlParams.some(function (p) { return !exists(params[p]); })) {
                var missingParameters = this.urlParams.filter(function (p) { return !exists(params[p]); });
                throw new Error("Cannot build path: '" +
                    this.path +
                    "' requires missing parameters { " +
                    missingParameters.join(', ') +
                    ' }');
            }
            // Check constraints
            if (!options.ignoreConstraints) {
                var constraintsPassed = this.tokens
                    .filter(function (t) {
                    return /^url-parameter/.test(t.type) && !/-splat$/.test(t.type);
                })
                    .every(function (t) {
                    return new RegExp('^' + defaultOrConstrained(t.otherVal[0]) + '$').test(encodedUrlParams[t.val]);
                });
                if (!constraintsPassed) {
                    throw new Error("Some parameters of '" + this.path + "' are of invalid format");
                }
            }
            var base = this.tokens
                .filter(function (t) { return /^query-parameter/.test(t.type) === false; })
                .map(function (t) {
                if (t.type === 'url-parameter-matrix') {
                    return ";" + t.val + "=" + encodedUrlParams[t.val[0]];
                }
                return /^url-parameter/.test(t.type)
                    ? encodedUrlParams[t.val[0]]
                    : t.match;
            })
                .join('');
            if (options.ignoreSearch) {
                return base;
            }
            var searchParams = this.queryParams
                .filter(function (p) { return Object.keys(params).indexOf(p) !== -1; })
                .reduce(function (sparams, paramName) {
                sparams[paramName] = params[paramName];
                return sparams;
            }, {});
            var searchPart = cjs_2(searchParams, options.queryParams);
            return searchPart ? base + '?' + searchPart : base;
        };
        Path.prototype.getParams = function (type) {
            var predicate = type instanceof RegExp
                ? function (t) { return type.test(t.type); }
                : function (t) { return t.type === type; };
            return this.tokens.filter(predicate).map(function (t) { return t.val[0]; });
        };
        Path.prototype.urlTest = function (path, source, _a) {
            var _this = this;
            var _b = (_a === void 0 ? {} : _a).caseSensitive, caseSensitive = _b === void 0 ? false : _b;
            var regex = new RegExp('^' + source, caseSensitive ? '' : 'i');
            var match = path.match(regex);
            if (!match) {
                return null;
            }
            else if (!this.urlParams.length) {
                return {};
            }
            // Reduce named params to key-value pairs
            return match
                .slice(1, this.urlParams.length + 1)
                .reduce(function (params, m, i) {
                params[_this.urlParams[i]] = decodeURIComponent(m);
                return params;
            }, {});
        };
        return Path;
    }());

    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (!stop) {
                    return; // not ready
                }
                subscribers.forEach((s) => s[1]());
                subscribers.forEach((s) => s[0](value));
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    /* node_modules/svero/src/Router.svelte generated by Svelte v3.6.5 */
    const { window: window_1 } = globals;

    const file = "node_modules/svero/src/Router.svelte";

    // (140:0) {#if !ctxLoaded}
    function create_if_block(ctx) {
    	var div;

    	return {
    		c: function create() {
    			div = element("div");
    			attr(div, "class", "ctx svelte-h7mijx");
    			div.dataset.svero = "ctx";
    			add_location(div, file, 140, 2, 3215);
    		},

    		m: function mount(target, anchor) {
    			insert(target, div, anchor);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div);
    			}
    		}
    	};
    }

    function create_fragment(ctx) {
    	var t_1, current, dispose;

    	var if_block = (!ctx.ctxLoaded) && create_if_block();

    	const default_slot_1 = ctx.$$slots.default;
    	const default_slot = create_slot(default_slot_1, ctx, null);

    	return {
    		c: function create() {
    			if (if_block) if_block.c();
    			t_1 = space();

    			if (default_slot) default_slot.c();

    			dispose = listen(window_1, "popstate", ctx.handlePopState);
    		},

    		l: function claim(nodes) {
    			if (default_slot) default_slot.l(nodes);
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert(target, t_1, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (!ctx.ctxLoaded) {
    				if (!if_block) {
    					if_block = create_if_block();
    					if_block.c();
    					if_block.m(t_1.parentNode, t_1);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (default_slot && default_slot.p && changed.$$scope) {
    				default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);

    			if (detaching) {
    				detach(t_1);
    			}

    			if (default_slot) default_slot.d(detaching);
    			dispose();
    		}
    	};
    }

    function gotoRoute(route) {
      history.pushState({}, '', route);

      const popEvent = new Event('popstate');
      window.dispatchEvent(popEvent);
    }

    function instance($$self, $$props, $$invalidate) {
    	let $activePath;

    	

      let t;
      let ctx;
      let ctxLoaded = false;
      let currentComponent = null;

      const paths = [];
      const activePath = writable(null); validate_store(activePath, 'activePath'); subscribe($$self, activePath, $$value => { $activePath = $$value; $$invalidate('$activePath', $activePath); });

      function updateComponent(route, params = {}) {
        if (currentComponent && currentComponent.$destroy) {
          currentComponent.$destroy();
          currentComponent = null;
        }

        $activePath = route.path; activePath.set($activePath);

        if (!route.component) return;

        currentComponent = new route.component({
          target: ctx,
          props: {
            router: {
              route,
              params
            }
          }
        });
      }

      function handleRoute(route, result) {
        // If there is no condition, but there is a redirect, simply redirect
        if (!route.condition && route.redirect) {
          gotoRoute(route.redirect);
          return true;
        }

        // If there is condition, handle it
        if (route.condition && (typeof route.condition === 'boolean' || typeof route.condition === 'function')) {
          if (typeof route.condition === 'boolean' && route.condition) {
            updateComponent(route, result);
            return true;
          }

          if (typeof route.condition === 'function' && route.condition()) {
            updateComponent(route, result);
            return true;
          }

          gotoRoute(route.redirect);
          return true;
        }

        updateComponent(route, result);
        return true;
      }

      function handlePopState() {
        paths.some((route) => {
          const browserPath = window.location.pathname;

          // If route matches exactly the url path, load the component
          // and stop the route checking
          if (route.path === browserPath) {
            return handleRoute(route);
          }

          // If route includes params, check if it matches with the URL
          // and stop the route checking
          if (route.path.includes(':')) {
            const path = new Path(route.path);
            const result = path.test(browserPath);

            if (result) {
              return handleRoute(route, result);
            }
          }

          // If route is wildcard (*), fallbacks to the component
          // and stop the route checking
          if (route.path === '*') {
            return handleRoute(route);
          }
        });
      }

      function debouncedHandlePopState() {
        clearTimeout(t);
        t = setTimeout(handlePopState, 100);
      }

      function assignRoute(route) {
        paths.push(route);
        debouncedHandlePopState();
      }

      onMount(() => {
        ctx = document.querySelector('[data-svero="ctx"]').parentElement;
        $$invalidate('ctxLoaded', ctxLoaded = true);
        debouncedHandlePopState();
      });

      setContext('__svero__', {
        activePath,
        paths,
        gotoRoute,
        assignRoute,
        updateComponent
      });

    	let { $$slots = {}, $$scope } = $$props;

    	$$self.$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
    	};

    	return {
    		ctxLoaded,
    		activePath,
    		handlePopState,
    		$$slots,
    		$$scope
    	};
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, []);
    	}
    }

    /* node_modules/svero/src/Route.svelte generated by Svelte v3.6.5 */

    // (20:0) {#if $activePath === path && !component}
    function create_if_block$1(ctx) {
    	var current;

    	const default_slot_1 = ctx.$$slots.default;
    	const default_slot = create_slot(default_slot_1, ctx, null);

    	return {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},

    		l: function claim(nodes) {
    			if (default_slot) default_slot.l(nodes);
    		},

    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (default_slot && default_slot.p && changed.$$scope) {
    				default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    function create_fragment$1(ctx) {
    	var if_block_anchor, current;

    	var if_block = (ctx.$activePath === ctx.path && !ctx.component) && create_if_block$1(ctx);

    	return {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (ctx.$activePath === ctx.path && !ctx.component) {
    				if (if_block) {
    					if_block.p(changed, ctx);
    					transition_in(if_block, 1);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();
    				transition_out(if_block, 1, () => {
    					if_block = null;
    				});
    				check_outros();
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);

    			if (detaching) {
    				detach(if_block_anchor);
    			}
    		}
    	};
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $activePath;

    	const { assignRoute, unassignRoute, activePath } = getContext('__svero__'); validate_store(activePath, 'activePath'); subscribe($$self, activePath, $$value => { $activePath = $$value; $$invalidate('$activePath', $activePath); });

      let { path = '/', component = undefined, condition = undefined, redirect = undefined } = $$props;

      onMount(() => {
        assignRoute({ path, component, condition, redirect });
      });

      onDestroy(() => {
        unassignRoute(path);
      });

    	const writable_props = ['path', 'component', 'condition', 'redirect'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Route> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;

    	$$self.$set = $$props => {
    		if ('path' in $$props) $$invalidate('path', path = $$props.path);
    		if ('component' in $$props) $$invalidate('component', component = $$props.component);
    		if ('condition' in $$props) $$invalidate('condition', condition = $$props.condition);
    		if ('redirect' in $$props) $$invalidate('redirect', redirect = $$props.redirect);
    		if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
    	};

    	return {
    		activePath,
    		path,
    		component,
    		condition,
    		redirect,
    		$activePath,
    		$$slots,
    		$$scope
    	};
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, ["path", "component", "condition", "redirect"]);
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get condition() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set condition(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get redirect() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set redirect(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function navigateTo(path) {
      // If path empty or no string, throws error
      if (!path || typeof path !== 'string') {
        throw Error(`svero expects navigateTo() to have a string parameter. The parameter provided was: ${path} of type ${typeof path} instead.`);
      }

      if (path[0] !== '/') {
        throw Error(`svero expects navigateTo() param to start with slash, e.g. "/${path}" instead of "${path}".`);
      }

      // If no History API support, fallbacks to URL redirect
      if (!history.pushState || !window.dispatchEvent) {
        window.location.href = path;
        return;
      }

      // If has History API support, uses it
      history.pushState({}, '', path);
      window.dispatchEvent(new Event('popstate'));
    }

    /* node_modules/svero/src/Link.svelte generated by Svelte v3.6.5 */

    const file$1 = "node_modules/svero/src/Link.svelte";

    function create_fragment$2(ctx) {
    	var a, current, dispose;

    	const default_slot_1 = ctx.$$slots.default;
    	const default_slot = create_slot(default_slot_1, ctx, null);

    	return {
    		c: function create() {
    			a = element("a");

    			if (default_slot) default_slot.c();

    			attr(a, "href", ctx.href);
    			attr(a, "class", ctx.className);
    			add_location(a, file$1, 13, 0, 267);
    			dispose = listen(a, "click", prevent_default(ctx.click_handler));
    		},

    		l: function claim(nodes) {
    			if (default_slot) default_slot.l(a_nodes);
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (default_slot && default_slot.p && changed.$$scope) {
    				default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
    			}

    			if (!current || changed.href) {
    				attr(a, "href", ctx.href);
    			}

    			if (!current || changed.className) {
    				attr(a, "class", ctx.className);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(a);
    			}

    			if (default_slot) default_slot.d(detaching);
    			dispose();
    		}
    	};
    }

    function instance$2($$self, $$props, $$invalidate) {
    	
      let { class: cssClass = '', href = '/', className = '' } = $$props;

      onMount(() => {
        $$invalidate('className', className = className || cssClass);
      });

    	const writable_props = ['class', 'href', 'className'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Link> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;

    	function click_handler() {
    		return navigateTo(href);
    	}

    	$$self.$set = $$props => {
    		if ('class' in $$props) $$invalidate('cssClass', cssClass = $$props.class);
    		if ('href' in $$props) $$invalidate('href', href = $$props.href);
    		if ('className' in $$props) $$invalidate('className', className = $$props.className);
    		if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
    	};

    	return {
    		cssClass,
    		href,
    		className,
    		click_handler,
    		$$slots,
    		$$scope
    	};
    }

    class Link extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, ["class", "href", "className"]);
    	}

    	get class() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get className() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set className(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
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

    function interpolateArray(a, b) {
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

    function interpolate(a, b) {
      var t = typeof b, c;
      return b == null || t === "boolean" ? constant(b)
          : (t === "number" ? interpolateNumber
          : t === "string" ? ((c = color(b)) ? (b = c, rgb$1) : string)
          : b instanceof color ? rgb$1
          : b instanceof Date ? date
          : Array.isArray(b) ? interpolateArray
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

    function identity$2(x) {
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
          interpolate$1 = interpolate,
          transform,
          untransform,
          unknown,
          clamp = identity$2,
          piecewise,
          output,
          input;

      function rescale() {
        piecewise = Math.min(domain.length, range.length) > 2 ? polymap : bimap;
        output = input = null;
        return scale;
      }

      function scale(x) {
        return isNaN(x = +x) ? unknown : (output || (output = piecewise(domain.map(transform), range, interpolate$1)))(transform(clamp(x)));
      }

      scale.invert = function(y) {
        return clamp(untransform((input || (input = piecewise(range, domain.map(transform), interpolateNumber)))(y)));
      };

      scale.domain = function(_) {
        return arguments.length ? (domain = Array.from(_, number), clamp === identity$2 || (clamp = clamper(domain)), rescale()) : domain.slice();
      };

      scale.range = function(_) {
        return arguments.length ? (range = Array.from(_), rescale()) : range.slice();
      };

      scale.rangeRound = function(_) {
        return range = Array.from(_), interpolate$1 = interpolateRound, rescale();
      };

      scale.clamp = function(_) {
        return arguments.length ? (clamp = _ ? clamper(domain) : identity$2, scale) : clamp !== identity$2;
      };

      scale.interpolate = function(_) {
        return arguments.length ? (interpolate$1 = _, rescale()) : interpolate$1;
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

    function identity$3(x) {
      return x;
    }

    var prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];

    function formatLocale(locale) {
      var group = locale.grouping && locale.thousands ? formatGroup(locale.grouping, locale.thousands) : identity$3,
          currency = locale.currency,
          decimal = locale.decimal,
          numerals = locale.numerals ? formatNumerals(locale.numerals) : identity$3,
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
      var scale = continuous(identity$2, identity$2);

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

    class GraphicContext {
      constructor ({ renderer }) {
        if (!renderer) {
          this._rendererOptions = { output: 'svg' };
        }

        if (renderer) {
          validateRendererOptions(renderer);
          this._rendererOptions = renderer;
        }
      }

      output () {
        return this._rendererOptions.output
      }
    }

    function validateRendererOptions (options) {
      if (!(
        options.constructor === Object &&
        options.hasOwnProperty('output') &&
        ['svg'].includes(options.output)
      )) {
        throw new Error(`Invalid renderer options: ${JSON.stringify(options)}`)
      }
    }

    const key = {};

    function subscribe$1 () {
      return getContext(key)
    }

    function init$1 () {
      let graphicContext = writable();
      setContext(key, graphicContext);

      return graphicContext
    }

    function update$1 (graphicContext, options) {
      graphicContext.set(new GraphicContext(options));
    }

    class SectionContext {
      constructor ({ sectionId, rangeX, rangeY, scaleX, scaleY }) {
        this._sectionId = sectionId;

        this._rangeX = undefined;
        this._rangeY = undefined;
        this._scaleX = undefined;
        this._scaleY = undefined;

        this._handleRanges(rangeX, rangeY);
        this._handleScales(scaleX, scaleY);
      }

      rangeX () {
        return this._rangeX
      }

      rangeY () {
        return this._rangeY
      }

      x1 () {
        return this._rangeX[0]
      }

      x2 () {
        return this._rangeX[1]
      }

      y1 () {
        return this._rangeY[0]
      }

      y2 () {
        return this._rangeY[1]
      }

      scales () {
        let scaleX = this._scaleX;
        let scaleY = this._scaleY;
        return { scaleX, scaleY }
      }

      interactionManager () {
        return this._interactionManager
      }

      _handleRanges (rangeX, rangeY) {
        this._rangeX = rangeX;
        this._rangeY = rangeY;
      }

      _handleScales (scaleX, scaleY) {
        if (scaleX) {
          this._scaleX = scaleX.copy().range(this._rangeX);
        }

        if (!scaleX) {
          this._scaleX = x => x;
        }

        if (scaleY) {
          this._scaleY = scaleY.copy().range(this._rangeY);
        }

        if (!scaleY) {
          this._scaleY = y => y;
        }
      }
    }

    const key$1 = {};

    function subscribe$2 () {
      return getContext(key$1)
    }

    function init$2 () {
      let sectionContext = writable();
      setContext(key$1, sectionContext);

      return sectionContext
    }

    function update$2 (sectionContext, options) {
      sectionContext.set(new SectionContext(options));
    }

    const key$2 = {};

    function subscribe$3 () {
      return getContext(key$2)
    }

    function init$3 () {
      let eventManagerContext = writable();
      setContext(key$2, eventManagerContext);

      return eventManagerContext
    }

    function update$3 (eventManagerContext, eventManager) {
      eventManagerContext.set(eventManager);
    }

    const key$3 = {};

    function subscribe$4 () {
      return getContext(key$3)
    }

    function init$4 () {
      let interactionManagerContext = writable();
      setContext(key$3, interactionManagerContext);

      return interactionManagerContext
    }

    function update$4 (interactionManagerContext, interactionManager) {
      interactionManagerContext.set(interactionManager);
    }

    let handler;

    class EventManager {
      constructor () {
        this._mounted = false;
        this._clickTracker = new EventTracker(this, 'click');
        this._mousemoveTracker = new EventTracker(this, 'mousemove');
        this._mousedownTracker = new EventTracker(this, 'mousedown');
        this._mouseupTracker = new EventTracker(this, 'mouseup');
        this._listeners = {};
      }

      addRootNode (domNode) {
        this._domNode = domNode;
        this._svgPoint = this._domNode.createSVGPoint();
        this._mounted = true;
      }

      attachEventListeners () {
        if (this._mounted) {
          for (let listenerId in this._listeners) {
            let { eventName, callback } = this._listeners[listenerId];
            let tracker = this[getTrackerName(eventName)];
            tracker.addEventListener(listenerId, callback);
          }
        }
      }

      addEventListener (eventName, listenerId, callback) {
        this._listeners[listenerId] = Object.assign({}, { eventName, callback });
        if (this._mounted) {
          let tracker = this[getTrackerName(eventName)];
          tracker.addEventListener(listenerId, callback);
        }
      }

      removeEventListener (eventName, listenerId) {
        delete this._listeners[listenerId];
        let tracker = this[getTrackerName(eventName)];
        tracker.removeEventListener(listenerId);
      }

      _getMouseCoordinates (mouseEvent) {
        this._svgPoint.x = mouseEvent.clientX;
        this._svgPoint.y = mouseEvent.clientY;

        return this._svgPoint.matrixTransform(this._domNode.getScreenCTM().inverse())
      }
    }

    class EventTracker {
      constructor (eventManager, eventName) {
        this._eventManager = eventManager;
        this._eventName = eventName;

        this._numberOfListeners = 0;
        this._callbacks = {};
      }

      addEventListener (listenerId, callback) {
        if (this._numberOfListeners === 0) {
          handler = this._handleEvent.bind(this);
          this._eventManager._domNode.addEventListener(this._eventName, handler);
        }

        this._numberOfListeners++;
        this._callbacks[listenerId] = callback;
      }

      removeEventListener (listenerId) {
        this._numberOfListeners--;
        delete this._callbacks[listenerId];

        if (this._numberOfListeners === 0) {
          this._eventManager._domNode.removeEventListener(this._eventName, handler);
        }
      }

      _handleEvent (mouseEvent) {
        let coordinates = this._eventManager._getMouseCoordinates(mouseEvent);

        for (let listenerId in this._callbacks) {
          this._callbacks[listenerId](coordinates, mouseEvent);
        }
      }
    }

    function getTrackerName (eventName) {
      let trackerName = eventNameToTrackerNameMap[eventName];

      if (trackerName) return trackerName
      throw new Error(`Invalid event name: '${eventName}`)
    }

    const eventNameToTrackerNameMap = {
      click: '_clickTracker',
      mousemove: '_mousemoveTracker',
      mousedown: '_mousedownTracker',
      mouseup: '_mouseupTracker'
    };

    var rbush_min = createCommonjsModule(function (module, exports) {
    !function(t,i){module.exports=i();}(commonjsGlobal,function(){function t(t,r,e,a,h){!function t(n,r,e,a,h){for(;a>e;){if(a-e>600){var o=a-e+1,s=r-e+1,l=Math.log(o),f=.5*Math.exp(2*l/3),u=.5*Math.sqrt(l*f*(o-f)/o)*(s-o/2<0?-1:1),m=Math.max(e,Math.floor(r-s*f/o+u)),c=Math.min(a,Math.floor(r+(o-s)*f/o+u));t(n,r,m,c,h);}var p=n[r],d=e,x=a;for(i(n,e,r),h(n[a],p)>0&&i(n,e,a);d<x;){for(i(n,d,x),d++,x--;h(n[d],p)<0;)d++;for(;h(n[x],p)>0;)x--;}0===h(n[e],p)?i(n,e,x):i(n,++x,a),x<=r&&(e=x+1),r<=x&&(a=x-1);}}(t,r,e||0,a||t.length-1,h||n);}function i(t,i,n){var r=t[i];t[i]=t[n],t[n]=r;}function n(t,i){return t<i?-1:t>i?1:0}var r=function(t){void 0===t&&(t=9),this._maxEntries=Math.max(4,t),this._minEntries=Math.max(2,Math.ceil(.4*this._maxEntries)),this.clear();};function e(t,i,n){if(!n)return i.indexOf(t);for(var r=0;r<i.length;r++)if(n(t,i[r]))return r;return -1}function a(t,i){h(t,0,t.children.length,i,t);}function h(t,i,n,r,e){e||(e=p(null)),e.minX=1/0,e.minY=1/0,e.maxX=-1/0,e.maxY=-1/0;for(var a=i;a<n;a++){var h=t.children[a];o(e,t.leaf?r(h):h);}return e}function o(t,i){return t.minX=Math.min(t.minX,i.minX),t.minY=Math.min(t.minY,i.minY),t.maxX=Math.max(t.maxX,i.maxX),t.maxY=Math.max(t.maxY,i.maxY),t}function s(t,i){return t.minX-i.minX}function l(t,i){return t.minY-i.minY}function f(t){return (t.maxX-t.minX)*(t.maxY-t.minY)}function u(t){return t.maxX-t.minX+(t.maxY-t.minY)}function m(t,i){return t.minX<=i.minX&&t.minY<=i.minY&&i.maxX<=t.maxX&&i.maxY<=t.maxY}function c(t,i){return i.minX<=t.maxX&&i.minY<=t.maxY&&i.maxX>=t.minX&&i.maxY>=t.minY}function p(t){return {children:t,height:1,leaf:!0,minX:1/0,minY:1/0,maxX:-1/0,maxY:-1/0}}function d(i,n,r,e,a){for(var h=[n,r];h.length;)if(!((r=h.pop())-(n=h.pop())<=e)){var o=n+Math.ceil((r-n)/e/2)*e;t(i,o,n,r,a),h.push(n,o,o,r);}}return r.prototype.all=function(){return this._all(this.data,[])},r.prototype.search=function(t){var i=this.data,n=[];if(!c(t,i))return n;for(var r=this.toBBox,e=[];i;){for(var a=0;a<i.children.length;a++){var h=i.children[a],o=i.leaf?r(h):h;c(t,o)&&(i.leaf?n.push(h):m(t,o)?this._all(h,n):e.push(h));}i=e.pop();}return n},r.prototype.collides=function(t){var i=this.data;if(!c(t,i))return !1;for(var n=[];i;){for(var r=0;r<i.children.length;r++){var e=i.children[r],a=i.leaf?this.toBBox(e):e;if(c(t,a)){if(i.leaf||m(t,a))return !0;n.push(e);}}i=n.pop();}return !1},r.prototype.load=function(t){if(!t||!t.length)return this;if(t.length<this._minEntries){for(var i=0;i<t.length;i++)this.insert(t[i]);return this}var n=this._build(t.slice(),0,t.length-1,0);if(this.data.children.length)if(this.data.height===n.height)this._splitRoot(this.data,n);else{if(this.data.height<n.height){var r=this.data;this.data=n,n=r;}this._insert(n,this.data.height-n.height-1,!0);}else this.data=n;return this},r.prototype.insert=function(t){return t&&this._insert(t,this.data.height-1),this},r.prototype.clear=function(){return this.data=p([]),this},r.prototype.remove=function(t,i){if(!t)return this;for(var n,r,a,h=this.data,o=this.toBBox(t),s=[],l=[];h||s.length;){if(h||(h=s.pop(),r=s[s.length-1],n=l.pop(),a=!0),h.leaf){var f=e(t,h.children,i);if(-1!==f)return h.children.splice(f,1),s.push(h),this._condense(s),this}a||h.leaf||!m(h,o)?r?(n++,h=r.children[n],a=!1):h=null:(s.push(h),l.push(n),n=0,r=h,h=h.children[0]);}return this},r.prototype.toBBox=function(t){return t},r.prototype.compareMinX=function(t,i){return t.minX-i.minX},r.prototype.compareMinY=function(t,i){return t.minY-i.minY},r.prototype.toJSON=function(){return this.data},r.prototype.fromJSON=function(t){return this.data=t,this},r.prototype._all=function(t,i){for(var n=[];t;)t.leaf?i.push.apply(i,t.children):n.push.apply(n,t.children),t=n.pop();return i},r.prototype._build=function(t,i,n,r){var e,h=n-i+1,o=this._maxEntries;if(h<=o)return a(e=p(t.slice(i,n+1)),this.toBBox),e;r||(r=Math.ceil(Math.log(h)/Math.log(o)),o=Math.ceil(h/Math.pow(o,r-1))),(e=p([])).leaf=!1,e.height=r;var s=Math.ceil(h/o),l=s*Math.ceil(Math.sqrt(o));d(t,i,n,l,this.compareMinX);for(var f=i;f<=n;f+=l){var u=Math.min(f+l-1,n);d(t,f,u,s,this.compareMinY);for(var m=f;m<=u;m+=s){var c=Math.min(m+s-1,u);e.children.push(this._build(t,m,c,r-1));}}return a(e,this.toBBox),e},r.prototype._chooseSubtree=function(t,i,n,r){for(;r.push(i),!i.leaf&&r.length-1!==n;){for(var e=1/0,a=1/0,h=void 0,o=0;o<i.children.length;o++){var s=i.children[o],l=f(s),u=(m=t,c=s,(Math.max(c.maxX,m.maxX)-Math.min(c.minX,m.minX))*(Math.max(c.maxY,m.maxY)-Math.min(c.minY,m.minY))-l);u<a?(a=u,e=l<e?l:e,h=s):u===a&&l<e&&(e=l,h=s);}i=h||i.children[0];}var m,c;return i},r.prototype._insert=function(t,i,n){var r=n?t:this.toBBox(t),e=[],a=this._chooseSubtree(r,this.data,i,e);for(a.children.push(t),o(a,r);i>=0&&e[i].children.length>this._maxEntries;)this._split(e,i),i--;this._adjustParentBBoxes(r,e,i);},r.prototype._split=function(t,i){var n=t[i],r=n.children.length,e=this._minEntries;this._chooseSplitAxis(n,e,r);var h=this._chooseSplitIndex(n,e,r),o=p(n.children.splice(h,n.children.length-h));o.height=n.height,o.leaf=n.leaf,a(n,this.toBBox),a(o,this.toBBox),i?t[i-1].children.push(o):this._splitRoot(n,o);},r.prototype._splitRoot=function(t,i){this.data=p([t,i]),this.data.height=t.height+1,this.data.leaf=!1,a(this.data,this.toBBox);},r.prototype._chooseSplitIndex=function(t,i,n){for(var r,e,a,o,s,l,u,m=1/0,c=1/0,p=i;p<=n-i;p++){var d=h(t,0,p,this.toBBox),x=h(t,p,n,this.toBBox),v=(e=d,a=x,o=void 0,s=void 0,l=void 0,u=void 0,o=Math.max(e.minX,a.minX),s=Math.max(e.minY,a.minY),l=Math.min(e.maxX,a.maxX),u=Math.min(e.maxY,a.maxY),Math.max(0,l-o)*Math.max(0,u-s)),M=f(d)+f(x);v<m?(m=v,r=p,c=M<c?M:c):v===m&&M<c&&(c=M,r=p);}return r},r.prototype._chooseSplitAxis=function(t,i,n){var r=t.leaf?this.compareMinX:s,e=t.leaf?this.compareMinY:l;this._allDistMargin(t,i,n,r)<this._allDistMargin(t,i,n,e)&&t.children.sort(r);},r.prototype._allDistMargin=function(t,i,n,r){t.children.sort(r);for(var e=this.toBBox,a=h(t,0,i,e),s=h(t,n-i,n,e),l=u(a)+u(s),f=i;f<n-i;f++){var m=t.children[f];o(a,t.leaf?e(m):m),l+=u(a);}for(var c=n-i-1;c>=i;c--){var p=t.children[c];o(s,t.leaf?e(p):p),l+=u(s);}return l},r.prototype._adjustParentBBoxes=function(t,i,n){for(var r=n;r>=0;r--)o(i[r],t);},r.prototype._condense=function(t){for(var i=t.length-1,n=void 0;i>=0;i--)0===t[i].children.length?i>0?(n=t[i-1].children).splice(n.indexOf(t[i]),1):this.clear():a(t[i],this.toBBox);},r});
    });

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

    function identity$4(x) {
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
        return arguments.length ? (projectionStream = _ == null ? (projection = null, identity$4) : (projection = _).stream, path) : projection;
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

    function isDefined (value) {
      return value !== undefined
    }

    function isUndefined (value) {
      return value === undefined
    }

    function calculateBBoxGeometries (geometries) {
      let bbox = [[Infinity, Infinity], [-Infinity, -Infinity]];

      for (let i = 0; i < geometries.length; i++) {
        let geometry = geometries[i];

        if (!isInvalid(geometry)) {
          bbox = updateBBox(bbox, geometry);
        }
      }

      let bboxObj = {
        x: [bbox[0][0], bbox[1][0]],
        y: [bbox[0][1], bbox[1][1]]
      };

      return bboxObj
    }

    function calculateBBoxGeometry (geometry) {
      let bbox = path.bounds(geometry);

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

    function pointDistance (point1, point2) {
      return Math.sqrt(
        (point1[0] - point2[0]) ** 2 +
        (point1[1] - point2[1]) ** 2
      )
    }

    function pointIntersectsLineSegment (point, lineSegment, lineWidth) {
      let distance = distanceClosestPointOnLineSegment(point, lineSegment);

      return distance < (lineWidth / 2)
    }

    function distanceClosestPointOnLineSegment (point, lineSegment) {
      let closestPoint = closestPointOnLineSegment(point, lineSegment);
      return pointDistance(point, closestPoint)
    }

    // https://stackoverflow.com/a/6853926/7237112
    function closestPointOnLineSegment (point, lineSegment) {
      // Point coordinates
      let x = point[0];
      let y = point[1];

      // Line segment coordinates
      let x1 = lineSegment[0][0];
      let y1 = lineSegment[0][1];
      let x2 = lineSegment[1][0];
      let y2 = lineSegment[1][1];

      let A = x - x1;
      let B = y - y1;
      let C = x2 - x1;
      let D = y2 - y1;

      let dot = A * C + B * D;
      let lengthSquared = C * C + D * D;
      let param = -1;
      if (lengthSquared !== 0) { // in case of 0 length line
        param = dot / lengthSquared;
      }

      let xx, yy;

      if (param < 0) {
        xx = x1;
        yy = y1;
      } else if (param > 1) {
        xx = x2;
        yy = y2;
      } else {
        xx = x1 + param * C;
        yy = y1 + param * D;
      }

      return [xx, yy]
    }

    var twoProduct_1 = twoProduct;

    var SPLITTER = +(Math.pow(2, 27) + 1.0);

    function twoProduct(a, b, result) {
      var x = a * b;

      var c = SPLITTER * a;
      var abig = c - a;
      var ahi = c - abig;
      var alo = a - ahi;

      var d = SPLITTER * b;
      var bbig = d - b;
      var bhi = d - bbig;
      var blo = b - bhi;

      var err1 = x - (ahi * bhi);
      var err2 = err1 - (alo * bhi);
      var err3 = err2 - (ahi * blo);

      var y = alo * blo - err3;

      if(result) {
        result[0] = y;
        result[1] = x;
        return result
      }

      return [ y, x ]
    }

    var robustSum = linearExpansionSum;

    //Easy case: Add two scalars
    function scalarScalar(a, b) {
      var x = a + b;
      var bv = x - a;
      var av = x - bv;
      var br = b - bv;
      var ar = a - av;
      var y = ar + br;
      if(y) {
        return [y, x]
      }
      return [x]
    }

    function linearExpansionSum(e, f) {
      var ne = e.length|0;
      var nf = f.length|0;
      if(ne === 1 && nf === 1) {
        return scalarScalar(e[0], f[0])
      }
      var n = ne + nf;
      var g = new Array(n);
      var count = 0;
      var eptr = 0;
      var fptr = 0;
      var abs = Math.abs;
      var ei = e[eptr];
      var ea = abs(ei);
      var fi = f[fptr];
      var fa = abs(fi);
      var a, b;
      if(ea < fa) {
        b = ei;
        eptr += 1;
        if(eptr < ne) {
          ei = e[eptr];
          ea = abs(ei);
        }
      } else {
        b = fi;
        fptr += 1;
        if(fptr < nf) {
          fi = f[fptr];
          fa = abs(fi);
        }
      }
      if((eptr < ne && ea < fa) || (fptr >= nf)) {
        a = ei;
        eptr += 1;
        if(eptr < ne) {
          ei = e[eptr];
          ea = abs(ei);
        }
      } else {
        a = fi;
        fptr += 1;
        if(fptr < nf) {
          fi = f[fptr];
          fa = abs(fi);
        }
      }
      var x = a + b;
      var bv = x - a;
      var y = b - bv;
      var q0 = y;
      var q1 = x;
      var _x, _bv, _av, _br, _ar;
      while(eptr < ne && fptr < nf) {
        if(ea < fa) {
          a = ei;
          eptr += 1;
          if(eptr < ne) {
            ei = e[eptr];
            ea = abs(ei);
          }
        } else {
          a = fi;
          fptr += 1;
          if(fptr < nf) {
            fi = f[fptr];
            fa = abs(fi);
          }
        }
        b = q0;
        x = a + b;
        bv = x - a;
        y = b - bv;
        if(y) {
          g[count++] = y;
        }
        _x = q1 + x;
        _bv = _x - q1;
        _av = _x - _bv;
        _br = x - _bv;
        _ar = q1 - _av;
        q0 = _ar + _br;
        q1 = _x;
      }
      while(eptr < ne) {
        a = ei;
        b = q0;
        x = a + b;
        bv = x - a;
        y = b - bv;
        if(y) {
          g[count++] = y;
        }
        _x = q1 + x;
        _bv = _x - q1;
        _av = _x - _bv;
        _br = x - _bv;
        _ar = q1 - _av;
        q0 = _ar + _br;
        q1 = _x;
        eptr += 1;
        if(eptr < ne) {
          ei = e[eptr];
        }
      }
      while(fptr < nf) {
        a = fi;
        b = q0;
        x = a + b;
        bv = x - a;
        y = b - bv;
        if(y) {
          g[count++] = y;
        } 
        _x = q1 + x;
        _bv = _x - q1;
        _av = _x - _bv;
        _br = x - _bv;
        _ar = q1 - _av;
        q0 = _ar + _br;
        q1 = _x;
        fptr += 1;
        if(fptr < nf) {
          fi = f[fptr];
        }
      }
      if(q0) {
        g[count++] = q0;
      }
      if(q1) {
        g[count++] = q1;
      }
      if(!count) {
        g[count++] = 0.0;  
      }
      g.length = count;
      return g
    }

    var twoSum = fastTwoSum;

    function fastTwoSum(a, b, result) {
    	var x = a + b;
    	var bv = x - a;
    	var av = x - bv;
    	var br = b - bv;
    	var ar = a - av;
    	if(result) {
    		result[0] = ar + br;
    		result[1] = x;
    		return result
    	}
    	return [ar+br, x]
    }

    var robustScale = scaleLinearExpansion;

    function scaleLinearExpansion(e, scale) {
      var n = e.length;
      if(n === 1) {
        var ts = twoProduct_1(e[0], scale);
        if(ts[0]) {
          return ts
        }
        return [ ts[1] ]
      }
      var g = new Array(2 * n);
      var q = [0.1, 0.1];
      var t = [0.1, 0.1];
      var count = 0;
      twoProduct_1(e[0], scale, q);
      if(q[0]) {
        g[count++] = q[0];
      }
      for(var i=1; i<n; ++i) {
        twoProduct_1(e[i], scale, t);
        var pq = q[1];
        twoSum(pq, t[0], q);
        if(q[0]) {
          g[count++] = q[0];
        }
        var a = t[1];
        var b = q[1];
        var x = a + b;
        var bv = x - a;
        var y = b - bv;
        q[1] = x;
        if(y) {
          g[count++] = y;
        }
      }
      if(q[1]) {
        g[count++] = q[1];
      }
      if(count === 0) {
        g[count++] = 0.0;
      }
      g.length = count;
      return g
    }

    var robustDiff = robustSubtract;

    //Easy case: Add two scalars
    function scalarScalar$1(a, b) {
      var x = a + b;
      var bv = x - a;
      var av = x - bv;
      var br = b - bv;
      var ar = a - av;
      var y = ar + br;
      if(y) {
        return [y, x]
      }
      return [x]
    }

    function robustSubtract(e, f) {
      var ne = e.length|0;
      var nf = f.length|0;
      if(ne === 1 && nf === 1) {
        return scalarScalar$1(e[0], -f[0])
      }
      var n = ne + nf;
      var g = new Array(n);
      var count = 0;
      var eptr = 0;
      var fptr = 0;
      var abs = Math.abs;
      var ei = e[eptr];
      var ea = abs(ei);
      var fi = -f[fptr];
      var fa = abs(fi);
      var a, b;
      if(ea < fa) {
        b = ei;
        eptr += 1;
        if(eptr < ne) {
          ei = e[eptr];
          ea = abs(ei);
        }
      } else {
        b = fi;
        fptr += 1;
        if(fptr < nf) {
          fi = -f[fptr];
          fa = abs(fi);
        }
      }
      if((eptr < ne && ea < fa) || (fptr >= nf)) {
        a = ei;
        eptr += 1;
        if(eptr < ne) {
          ei = e[eptr];
          ea = abs(ei);
        }
      } else {
        a = fi;
        fptr += 1;
        if(fptr < nf) {
          fi = -f[fptr];
          fa = abs(fi);
        }
      }
      var x = a + b;
      var bv = x - a;
      var y = b - bv;
      var q0 = y;
      var q1 = x;
      var _x, _bv, _av, _br, _ar;
      while(eptr < ne && fptr < nf) {
        if(ea < fa) {
          a = ei;
          eptr += 1;
          if(eptr < ne) {
            ei = e[eptr];
            ea = abs(ei);
          }
        } else {
          a = fi;
          fptr += 1;
          if(fptr < nf) {
            fi = -f[fptr];
            fa = abs(fi);
          }
        }
        b = q0;
        x = a + b;
        bv = x - a;
        y = b - bv;
        if(y) {
          g[count++] = y;
        }
        _x = q1 + x;
        _bv = _x - q1;
        _av = _x - _bv;
        _br = x - _bv;
        _ar = q1 - _av;
        q0 = _ar + _br;
        q1 = _x;
      }
      while(eptr < ne) {
        a = ei;
        b = q0;
        x = a + b;
        bv = x - a;
        y = b - bv;
        if(y) {
          g[count++] = y;
        }
        _x = q1 + x;
        _bv = _x - q1;
        _av = _x - _bv;
        _br = x - _bv;
        _ar = q1 - _av;
        q0 = _ar + _br;
        q1 = _x;
        eptr += 1;
        if(eptr < ne) {
          ei = e[eptr];
        }
      }
      while(fptr < nf) {
        a = fi;
        b = q0;
        x = a + b;
        bv = x - a;
        y = b - bv;
        if(y) {
          g[count++] = y;
        } 
        _x = q1 + x;
        _bv = _x - q1;
        _av = _x - _bv;
        _br = x - _bv;
        _ar = q1 - _av;
        q0 = _ar + _br;
        q1 = _x;
        fptr += 1;
        if(fptr < nf) {
          fi = -f[fptr];
        }
      }
      if(q0) {
        g[count++] = q0;
      }
      if(q1) {
        g[count++] = q1;
      }
      if(!count) {
        g[count++] = 0.0;  
      }
      g.length = count;
      return g
    }

    var orientation_1 = createCommonjsModule(function (module) {






    var NUM_EXPAND = 5;

    var EPSILON     = 1.1102230246251565e-16;
    var ERRBOUND3   = (3.0 + 16.0 * EPSILON) * EPSILON;
    var ERRBOUND4   = (7.0 + 56.0 * EPSILON) * EPSILON;

    function cofactor(m, c) {
      var result = new Array(m.length-1);
      for(var i=1; i<m.length; ++i) {
        var r = result[i-1] = new Array(m.length-1);
        for(var j=0,k=0; j<m.length; ++j) {
          if(j === c) {
            continue
          }
          r[k++] = m[i][j];
        }
      }
      return result
    }

    function matrix(n) {
      var result = new Array(n);
      for(var i=0; i<n; ++i) {
        result[i] = new Array(n);
        for(var j=0; j<n; ++j) {
          result[i][j] = ["m", j, "[", (n-i-1), "]"].join("");
        }
      }
      return result
    }

    function sign(n) {
      if(n & 1) {
        return "-"
      }
      return ""
    }

    function generateSum(expr) {
      if(expr.length === 1) {
        return expr[0]
      } else if(expr.length === 2) {
        return ["sum(", expr[0], ",", expr[1], ")"].join("")
      } else {
        var m = expr.length>>1;
        return ["sum(", generateSum(expr.slice(0, m)), ",", generateSum(expr.slice(m)), ")"].join("")
      }
    }

    function determinant(m) {
      if(m.length === 2) {
        return [["sum(prod(", m[0][0], ",", m[1][1], "),prod(-", m[0][1], ",", m[1][0], "))"].join("")]
      } else {
        var expr = [];
        for(var i=0; i<m.length; ++i) {
          expr.push(["scale(", generateSum(determinant(cofactor(m, i))), ",", sign(i), m[0][i], ")"].join(""));
        }
        return expr
      }
    }

    function orientation(n) {
      var pos = [];
      var neg = [];
      var m = matrix(n);
      var args = [];
      for(var i=0; i<n; ++i) {
        if((i&1)===0) {
          pos.push.apply(pos, determinant(cofactor(m, i)));
        } else {
          neg.push.apply(neg, determinant(cofactor(m, i)));
        }
        args.push("m" + i);
      }
      var posExpr = generateSum(pos);
      var negExpr = generateSum(neg);
      var funcName = "orientation" + n + "Exact";
      var code = ["function ", funcName, "(", args.join(), "){var p=", posExpr, ",n=", negExpr, ",d=sub(p,n);\
return d[d.length-1];};return ", funcName].join("");
      var proc = new Function("sum", "prod", "scale", "sub", code);
      return proc(robustSum, twoProduct_1, robustScale, robustDiff)
    }

    var orientation3Exact = orientation(3);
    var orientation4Exact = orientation(4);

    var CACHED = [
      function orientation0() { return 0 },
      function orientation1() { return 0 },
      function orientation2(a, b) { 
        return b[0] - a[0]
      },
      function orientation3(a, b, c) {
        var l = (a[1] - c[1]) * (b[0] - c[0]);
        var r = (a[0] - c[0]) * (b[1] - c[1]);
        var det = l - r;
        var s;
        if(l > 0) {
          if(r <= 0) {
            return det
          } else {
            s = l + r;
          }
        } else if(l < 0) {
          if(r >= 0) {
            return det
          } else {
            s = -(l + r);
          }
        } else {
          return det
        }
        var tol = ERRBOUND3 * s;
        if(det >= tol || det <= -tol) {
          return det
        }
        return orientation3Exact(a, b, c)
      },
      function orientation4(a,b,c,d) {
        var adx = a[0] - d[0];
        var bdx = b[0] - d[0];
        var cdx = c[0] - d[0];
        var ady = a[1] - d[1];
        var bdy = b[1] - d[1];
        var cdy = c[1] - d[1];
        var adz = a[2] - d[2];
        var bdz = b[2] - d[2];
        var cdz = c[2] - d[2];
        var bdxcdy = bdx * cdy;
        var cdxbdy = cdx * bdy;
        var cdxady = cdx * ady;
        var adxcdy = adx * cdy;
        var adxbdy = adx * bdy;
        var bdxady = bdx * ady;
        var det = adz * (bdxcdy - cdxbdy) 
                + bdz * (cdxady - adxcdy)
                + cdz * (adxbdy - bdxady);
        var permanent = (Math.abs(bdxcdy) + Math.abs(cdxbdy)) * Math.abs(adz)
                      + (Math.abs(cdxady) + Math.abs(adxcdy)) * Math.abs(bdz)
                      + (Math.abs(adxbdy) + Math.abs(bdxady)) * Math.abs(cdz);
        var tol = ERRBOUND4 * permanent;
        if ((det > tol) || (-det > tol)) {
          return det
        }
        return orientation4Exact(a,b,c,d)
      }
    ];

    function slowOrient(args) {
      var proc = CACHED[args.length];
      if(!proc) {
        proc = CACHED[args.length] = orientation(args.length);
      }
      return proc.apply(undefined, args)
    }

    function generateOrientationProc() {
      while(CACHED.length <= NUM_EXPAND) {
        CACHED.push(orientation(CACHED.length));
      }
      var args = [];
      var procArgs = ["slow"];
      for(var i=0; i<=NUM_EXPAND; ++i) {
        args.push("a" + i);
        procArgs.push("o" + i);
      }
      var code = [
        "function getOrientation(", args.join(), "){switch(arguments.length){case 0:case 1:return 0;"
      ];
      for(var i=2; i<=NUM_EXPAND; ++i) {
        code.push("case ", i, ":return o", i, "(", args.slice(0, i).join(), ");");
      }
      code.push("}var s=new Array(arguments.length);for(var i=0;i<arguments.length;++i){s[i]=arguments[i]};return slow(s);}return getOrientation");
      procArgs.push(code.join(""));

      var proc = Function.apply(undefined, procArgs);
      module.exports = proc.apply(undefined, [slowOrient].concat(CACHED));
      for(var i=0; i<=NUM_EXPAND; ++i) {
        module.exports[i] = CACHED[i];
      }
    }

    generateOrientationProc();
    });

    var robustPnp = robustPointInPolygon;



    function robustPointInPolygon(vs, point) {
      var x = point[0];
      var y = point[1];
      var n = vs.length;
      var inside = 1;
      var lim = n;
      for(var i = 0, j = n-1; i<lim; j=i++) {
        var a = vs[i];
        var b = vs[j];
        var yi = a[1];
        var yj = b[1];
        if(yj < yi) {
          if(yj < y && y < yi) {
            var s = orientation_1(a, b, point);
            if(s === 0) {
              return 0
            } else {
              inside ^= (0 < s)|0;
            }
          } else if(y === yi) {
            var c = vs[(i+1)%n];
            var yk = c[1];
            if(yi < yk) {
              var s = orientation_1(a, b, point);
              if(s === 0) {
                return 0
              } else {
                inside ^= (0 < s)|0;
              }
            }
          }
        } else if(yi < yj) {
          if(yi < y && y < yj) {
            var s = orientation_1(a, b, point);
            if(s === 0) {
              return 0
            } else {
              inside ^= (s < 0)|0;
            }
          } else if(y === yi) {
            var c = vs[(i+1)%n];
            var yk = c[1];
            if(yk < yi) {
              var s = orientation_1(a, b, point);
              if(s === 0) {
                return 0
              } else {
                inside ^= (s < 0)|0;
              }
            }
          }
        } else if(y === yi) {
          var x0 = Math.min(a[0], b[0]);
          var x1 = Math.max(a[0], b[0]);
          if(i === 0) {
            while(j>0) {
              var k = (j+n-1)%n;
              var p = vs[k];
              if(p[1] !== y) {
                break
              }
              var px = p[0];
              x0 = Math.min(x0, px);
              x1 = Math.max(x1, px);
              j = k;
            }
            if(j === 0) {
              if(x0 <= x && x <= x1) {
                return 0
              }
              return 1 
            }
            lim = j+1;
          }
          var y0 = vs[(j+n-1)%n][1];
          while(i+1<lim) {
            var p = vs[i+1];
            if(p[1] !== y) {
              break
            }
            var px = p[0];
            x0 = Math.min(x0, px);
            x1 = Math.max(x1, px);
            i += 1;
          }
          if(x0 <= x && x <= x1) {
            return 0
          }
          var y1 = vs[(i+1)%n][1];
          if(x < x0 && (y0 < y !== y1 < y)) {
            inside ^= 1;
          }
        }
      }
      return 2 * inside - 1
    }

    function pointInPolygon (point, geometry) {
      switch (geometry.type) {
        case 'Polygon': return pointInPolygon$1(point, geometry)
        case 'MultiPolygon': return pointInMultiPolygon(point, geometry)
      }
    }

    function pointInPolygon$1 (point, geometry) {
      let coordinates = geometry.coordinates;
      let outerRing = coordinates[0];

      if (!pointInRing(point, outerRing)) return false

      for (let i = 1; i < coordinates.length; i++) {
        let hole = coordinates[i];

        if (pointInRing(point, hole)) return false
      }

      return true
    }

    function pointInMultiPolygon (point, geometry) {
      let coordinates = geometry.coordinates;

      for (let i = 0; i < coordinates.length; i++) {
        let polygon = coordinates[i];

        if (pointInPolygon$1(point, polygon)) return true
      }

      return false
    }

    function pointInRing (point, coordinates) {
      return robustPnp(coordinates, point) !== 1
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

    function transformGeometries (geometries, transformFunc) {
      let geometriesClone = JSON.parse(JSON.stringify(geometries));

      if (geometriesClone.constructor === Array) {
        for (let i = 0; i < geometriesClone.length; i++) {
          transformGeometryInplace(geometriesClone[i], transformFunc);
        }
      }

      if (geometriesClone.constructor === Object) {
        for (let key in geometriesClone) {
          transformGeometryInplace(geometriesClone[key], transformFunc);
        }
      }

      return geometriesClone
    }

    function transformGeometry (geometry, transformFunc) {
      let geometryClone = JSON.parse(JSON.stringify(geometry));
      transformGeometryInplace(geometryClone, transformFunc);

      return geometryClone
    }

    function transformGeometryInplace (geometry, transformFunc) {
      meta_1(geometry, coord => {
        let transformedPosition = transformFunc(coord);
        coord[0] = transformedPosition[0];
        coord[1] = transformedPosition[1];
      });
    }

    function interpolateRing (points, transformFunc, visibilityTreshold) {
      let interpolatedPoints = [];

      let from;
      let to;

      for (let i = 0; i < points.length - 1; i++) {
        let j = i + 1;

        from = points[i];
        to = points[j];

        interpolatePointPair(from, to, transformFunc, visibilityTreshold, interpolatedPoints);
      }

      interpolatedPoints.push(transformFunc(to));

      return interpolatedPoints
    }

    function interpolatePointPair (from, to, transformFunc, treshold, resampledPoints) {
      if (interpolationBetweenPointsNecessary(from, to, transformFunc, treshold)) {
        let midPoint = interpolateNPoints(from, to, 1)[0];

        interpolatePointPair(from, midPoint, transformFunc, treshold, resampledPoints);
        interpolatePointPair(midPoint, to, transformFunc, treshold, resampledPoints);
      } else {
        let transformedFrom = transformFunc(from);
        resampledPoints.push(transformedFrom);
      }
    }

    function interpolateNPoints (from, to, numberOfPoints) {
      const interpolator = interpolateArray(from, to);
      const points = [];

      for (let i = 1; i < numberOfPoints + 1; i++) {
        let fraction = 1 / (numberOfPoints + 1) * i;
        points.push(interpolator(fraction));
      }

      return points
    }

    function interpolationBetweenPointsNecessary (from, to, transformFunc, treshold) {
      // We will sample two points between 'from' and' to' and put all 4 points in an Array.
      let pointsInBetween = interpolateNPoints(from, to, 2);
      let pointsPlusPointsInBetween = [from, ...pointsInBetween, to];
      let transformedPoints = pointsPlusPointsInBetween.map(transformFunc);

      // If the transformed points are really close together, we can skip the interpolation
      if (pointsCloseTogether(transformedPoints, treshold)) return false

      // If all the points are on the same line, we will also skip the interpolation
      if (pointsOnOneLine(transformedPoints, treshold)) return false

      return true
    }

    function pointsCloseTogether (points, treshold) {
      let firstPoint = points[0];
      let secondPoint = points[1];
      let lastPoint = points[points.length - 1];

      return pointDistance(firstPoint, lastPoint) < treshold &&
        pointDistance(secondPoint, lastPoint < treshold)
    }

    function pointsOnOneLine (points, treshold) {
      let firstPoint = points[0];
      let secondPoint = points[1];
      let thirdPoint = points[2];
      let lastPoint = points[points.length - 1];

      let lineSegment = [firstPoint, lastPoint];

      return pointIntersectsLineSegment(secondPoint, lineSegment, treshold) &&
        pointIntersectsLineSegment(thirdPoint, lineSegment, treshold)
    }

    function interpolateGeometry (geometry, transformFunc, visibilityTreshold = 1) {
      switch (geometry.type) {
        case 'LineString': return interpolateLineString(geometry, transformFunc, visibilityTreshold)
        case 'Polygon': return interpolatePolygon(geometry, transformFunc, visibilityTreshold)
        case 'MultiPolygon': return interpolateMultiPolygon(geometry, transformFunc, visibilityTreshold)
      }
    }

    function interpolateLineString (geometry, transformFunc, visibilityTreshold) {
      let coordinates = geometry.coordinates;
      let interpolatedCoordinates = interpolateRing(coordinates, transformFunc, visibilityTreshold);

      return {
        type: 'LineString',
        coordinates: interpolatedCoordinates
      }
    }

    function interpolatePolygon (geometry, transformFunc, visibilityTreshold) {
      let coordinates = geometry.coordinates;
      let interpolatedCoordinates = [];

      for (let i = 0; i < coordinates.length; i++) {
        let ring = coordinates[i];
        let interpolatedRing = interpolateRing(ring, transformFunc, visibilityTreshold);
        interpolatedCoordinates.push(interpolatedRing);
      }

      return {
        type: 'Polygon',
        coordinates: interpolatedCoordinates
      }
    }

    function interpolateMultiPolygon (geometry, transformFunc, visibilityTreshold) {
      let coordinates = geometry.coordinates;
      let interpolatedCoordinates = [];

      for (let i = 0; i < coordinates.length; i++) {
        let polygon = coordinates[i];
        let interpolatedPolygon = [];

        for (let j = 0; j < polygon.length; j++) {
          let ring = polygon[j];
          let interpolatedRing = interpolateRing(ring, transformFunc, visibilityTreshold);
          interpolatedPolygon.push(interpolatedRing);
        }

        interpolatedCoordinates.push(interpolatedPolygon);
      }

      return {
        type: 'MultiPolygon',
        coordinates: interpolatedCoordinates
      }
    }

    function Point (fromPoint, toPoint) {
      return interpolate(fromPoint, toPoint)
    }

    var fromPoint = /*#__PURE__*/Object.freeze({
        Point: Point
    });

    function LineString (fromPolygon, toLineString) {
      // TODO
    }

    var fromLineString = /*#__PURE__*/Object.freeze({
        LineString: LineString
    });

    function Polygon (fromPolygon, toPolygon) {
      // TODO
    }

    function MultiPolygon (fromPolygon, toMultiPolygon) {
      // TODO
    }



    var fromPolygon = /*#__PURE__*/Object.freeze({
        Polygon: Polygon,
        MultiPolygon: MultiPolygon
    });

    function Polygon$1 (fromMultiPolygon, toPolygon) {
      // TODO
    }

    function MultiPolygon$1 (fromPolygon, toMultiPolygon) {
      // TODO
    }

    var fromMultiPolygon = /*#__PURE__*/Object.freeze({
        Polygon: Polygon$1,
        MultiPolygon: MultiPolygon$1
    });

    function transitionGeometries (fromLayer, toLayer) {
      ensureValidTypes(fromLayer, toLayer);

      if (fromLayer.constructor === Array) ;

      if (fromLayer.constructor === Object) {
        let transitionObject = {};

        for (let key in fromLayer) {
          if (toLayer.hasOwnProperty(key)) {
            let fromGeometry = fromLayer[key];
            let toGeometry = toLayer[key];

            transitionObject[key] = transitionGeometry(fromGeometry, toGeometry);
          }
        }

        return function (time) {
          let transitioningLayer = {};

          for (let key in transitionObject) {
            transitioningLayer[key] = transitionObject[key](time);
          }

          return transitioningLayer
        }
      }
    }

    function transitionGeometry (fromGeometry, toGeometry) {
      let interpolateTransition = transitionMatrix[fromGeometry.type][toGeometry.type];

      return interpolateTransition(fromGeometry, toGeometry)
    }

    const transitionMatrix = {
      Point: fromPoint,
      LineString: fromLineString,
      Polygon: fromPolygon,
      MultiPolygon: fromMultiPolygon
    };

    function ensureValidTypes (fromLayer, toLayer) {
      if (fromLayer.constructor === Array && toLayer.constructor === Array) {
        return
      }

      if (fromLayer.constructor === Object && toLayer.constructor === Object) {
        return
      }

      throw new Error(`Geometries must both be an Array, or both be an Object`)
    }

    function pointCollision (coordinates, pointAttributes) {
      let distance = pointDistance(
        [coordinates.x, coordinates.y],
        pointAttributes.screenGeometry.coordinates
      );

      return distance < pointAttributes.radius
    }

    function rectangleCollision (coordinates, rectangleAttributes) {
      let point = [coordinates.x, coordinates.y];
      return pointInPolygon(point, rectangleAttributes.screenGeometry)
    }

    function polygonCollision (coordinates, polygonAttributes) {
      let point = [coordinates.x, coordinates.y];
      return pointInPolygon(point, polygonAttributes.screenGeometry)
    }

    var collisionTests = {
      'Point': pointCollision,
      'Rectangle': rectangleCollision,
      'Polygon': polygonCollision
    };

    class SpatialIndex {
      constructor (interactionHandler) {
        this._rbush = new rbush_min();
        this._interactionHandler = interactionHandler;
      }

      // Layer indexing and unindexing
      indexLayer (layerId) {
        let indexableData = this._interactionHandler._layers[layerId];
        this._rbush.load(indexableData);
      }

      unindexLayer (layerId) {
        let layer = this._interactionHandler._layers[layerId];

        for (let i = 0; i < layer.length; i++) {
          let item = layer[i];
          this._rbush.remove(item);
        }
      }

      // Mark loading and removing
      indexMark (markId) {
        let indexableItem = this._interactionHandler._marks[markId];
        this._rbush.insert(indexableItem);
      }

      unindexMark (markId) {
        let indexableItem = this._interactionHandler._marks[markId];
        this._rbush.remove(indexableItem);
      }

      // Query functions
      queryMouseCoordinates (mouseCoordinates, radius) {
        let searchArea = searchAreaFromCoordinates(mouseCoordinates, radius);
        let indexQueryResults = this._rbush.search(searchArea);
        return this._getHits(mouseCoordinates, indexQueryResults)
      }

      _getHits (coordinates, indexQueryResults) {
        let hits = [];

        for (let i = 0; i < indexQueryResults.length; i++) {
          let indexQueryResult = indexQueryResults[i];
          let collisionTest = collisionTests[indexQueryResult.markType];

          if (collisionTest(coordinates, indexQueryResult.attributes)) {
            hits.push(indexQueryResult);
          }
        }

        return hits
      }
    }

    function searchAreaFromCoordinates (coordinates, radius = 3) {
      return {
        minX: coordinates.x - radius,
        maxX: coordinates.x + radius,
        minY: coordinates.y - radius,
        maxY: coordinates.y + radius
      }
    }

    class InteractionHandler {
      constructor (interactionManager) {
        this._spatialIndex = new SpatialIndex(interactionManager);

        this._interactionManager = interactionManager;
        this._numberOfInteractions = 0;

        this._layerCallbacks = {};
        this._markCallbacks = {};
      }

      // Add/remove layer interactions
      addLayerInteraction (layerId, callback) {
        if (!this._layerCallbacks.hasOwnProperty(layerId)) {
          this._addEventListenerIfNecessary();
          this._numberOfInteractions++;
          this._layerCallbacks[layerId] = callback;

          this._spatialIndex.indexLayer(layerId);
        }
      }

      removeLayerInteraction (layerId) {
        if (this._layerCallbacks.hasOwnProperty(layerId)) {
          this._numberOfInteractions--;
          delete this._layerCallbacks[layerId];
          this._removeEventListenerIfNecessary();

          this._spatialIndex.unindexLayer(layerId);
        }
      }

      // Add/remove mark interactions
      addMarkInteraction (markId, callback) {
        this._addEventListenerIfNecessary();
        this._numberOfInteractions++;
        this._markCallbacks[markId] = callback;

        this._spatialIndex.indexMark(markId);
      }

      removeMarkInteraction (markId) {
        this._removeEventListenerIfNecessary();
        delete this._markCallbacks[markId];
        this._numberOfInteractions--;

        this._spatialIndex.unindexMark(markId);
      }

      _isInLayer (hit) {
        return hit.hasOwnProperty('layerId')
      }

      _isMark (hit) {
        return hit.hasOwnProperty('markId')
      }
    }

    class ClickHandler extends InteractionHandler {
      _addEventListenerIfNecessary () {
        if (this._numberOfInteractions === 0) {
          let handler = this._handleEvent.bind(this);
          let interactionManager = this._interactionManager;
          let eventManager = interactionManager._eventManager;
          let listenerId = interactionManager._id + '-click';

          eventManager.addEventListener('click', listenerId, handler);
        }
      }

      _removeEventListenerIfNecessary () {
        if (this._numberOfInteractions === 0) {
          let interactionManager = this._interactionManager;
          let eventManager = interactionManager._eventManager;
          let listenerId = interactionManager._id + '-click';

          eventManager.removeEventListener('click', listenerId);
        }
      }

      _handleEvent (coordinates, mouseEvent) {
        let spatialIndex = this._spatialIndex;

        let hits = spatialIndex.queryMouseCoordinates(coordinates);

        for (let i = 0; i < hits.length; i++) {
          let hit = hits[i];

          if (this._isInLayer(hit)) {
            this._layerCallbacks[hit.layerId](hit.$index, mouseEvent);
          }

          if (this._isMark(hit)) {
            this._markCallbacks[hit.markId](mouseEvent);
          }
        }
      }
    }

    class MouseoverHandler extends InteractionHandler {
      constructor (interactionManager) {
        super(interactionManager);

        this._previousMouseoverIds = {};
        this._currentMouseoverIds = {};
      }

      _addEventListenerIfNecessary () {
        if (this._numberOfInteractions === 0) {
          let handler = this._handleEvent.bind(this);
          let interactionManager = this._interactionManager;
          let eventManager = interactionManager._eventManager;
          let listenerId = interactionManager._id + '-mouseover';

          eventManager.addEventListener('mousemove', listenerId, handler);
        }
      }

      _removeEventListenerIfNecessary () {
        if (this._numberOfInteractions === 0) {
          let interactionManager = this._interactionManager;
          let eventManager = interactionManager._eventManager;
          let listenerId = interactionManager._id + '-mouseover';

          eventManager.removeEventListener('mousemove', listenerId);
        }
      }

      _handleEvent (coordinates, mouseEvent) {
        this._currentMouseoverIds = {};

        let spatialIndex = this._spatialIndex;
        let hits = spatialIndex.queryMouseCoordinates(coordinates);
        this._handleHits(hits, mouseEvent);
        this._cleanupPreviousHits();
      }

      _handleHits (hits, mouseEvent) {
        for (let i = 0; i < hits.length; i++) {
          let hit = hits[i];
          let hitId = this._getHitId(hit);

          if (!this._mouseAlreadyOver(hitId)) {
            this._previousMouseoverIds[hitId] = true;

            if (this._isInLayer(hit)) {
              this._layerCallbacks[hit.layerId](hit.$index, mouseEvent);
            }

            if (this._isMark(hit)) {
              this._markCallbacks[hit.markId](mouseEvent);
            }
          }

          this._currentMouseoverIds[hitId] = true;
        }
      }

      _cleanupPreviousHits () {
        for (let hitId in this._previousMouseoverIds) {
          if (!this._currentMouseoverIds.hasOwnProperty(hitId)) {
            delete this._previousMouseoverIds[hitId];
          }
        }
      }

      _getHitId (hit) {
        let id;
        if (this._isInLayer(hit)) id = hit.layerId + '-' + hit.$index;
        if (this._isMark(hit)) id = hit.markId;

        return id
      }

      _mouseAlreadyOver (hitId) {
        return this._previousMouseoverIds.hasOwnProperty(hitId)
      }
    }

    class MouseoutHandler extends InteractionHandler {
      constructor (interactionManager) {
        super(interactionManager);

        this._previousHits = {};
        this._currentMouseoverIds = {};
      }

      _addEventListenerIfNecessary () {
        if (this._numberOfInteractions === 0) {
          let handler = this._handleEvent.bind(this);
          let interactionManager = this._interactionManager;
          let eventManager = interactionManager._eventManager;
          let listenerId = interactionManager._id + '-mouseout';

          eventManager.addEventListener('mousemove', listenerId, handler);
        }
      }

      _removeEventListenerIfNecessary () {
        if (this._numberOfInteractions === 0) {
          let interactionManager = this._interactionManager;
          let eventManager = interactionManager._eventManager;
          let listenerId = interactionManager._id + '-mouseout';

          eventManager.removeEventListener('mousemove', listenerId);
        }
      }

      _handleEvent (coordinates, mouseEvent) {
        this._currentMouseoverIds = {};

        let spatialIndex = this._spatialIndex;
        let hits = spatialIndex.queryMouseCoordinates(coordinates);
        this._storeHits(hits);
        this._fireForMouseOutHits(mouseEvent);
      }

      _storeHits (hits) {
        for (let i = 0; i < hits.length; i++) {
          let hit = hits[i];
          let hitId = this._getHitId(hit);

          if (!this._mouseAlreadyOver(hitId)) {
            this._previousHits[hitId] = hit;
          }

          this._currentMouseoverIds[hitId] = true;
        }
      }

      _fireForMouseOutHits (mouseEvent) {
        for (let hitId in this._previousHits) {
          if (!this._currentMouseoverIds.hasOwnProperty(hitId)) {
            let hit = this._previousHits[hitId];

            if (this._isInLayer(hit)) {
              this._layerCallbacks[hit.layerId](hit.$index, mouseEvent);
            }

            if (this._isMark(hit)) {
              this._markCallbacks[hit.markId](mouseEvent);
            }

            delete this._previousHits[hitId];
          }
        }
      }

      _getHitId (hit) {
        let id;
        if (this._isInLayer(hit)) id = hit.layerId + '-' + hit.$index;
        if (this._isMark(hit)) id = hit.markId;

        return id
      }

      _mouseAlreadyOver (hitId) {
        return this._previousHits.hasOwnProperty(hitId)
      }
    }

    function indexPoint (markData) {
      let pointAttributes = markData.attributes;

      let item = calculateBBoxPoint(pointAttributes);

      item.attributes = pointAttributes;
      item.markType = 'Point';
      item.markId = markData.markId;

      return item
    }

    function indexPointLayer ({ layerAttributes, indexArray, layerId }) {
      let items = [];

      for (let i = 0; i < indexArray.length; i++) {
        let $index = indexArray[i];

        let pointAttributes = getPointAttributes(layerAttributes, $index);
        let item = calculateBBoxPoint(pointAttributes);

        item.$index = $index;
        item.attributes = pointAttributes;
        item.markType = 'Point';
        item.layerId = layerId;

        items.push(item);
      }

      return items
    }

    function calculateBBoxPoint (pointAttributes) {
      let x = pointAttributes.screenGeometry.coordinates[0];
      let y = pointAttributes.screenGeometry.coordinates[1];

      return {
        minX: x - pointAttributes.radius,
        maxX: x + pointAttributes.radius,
        minY: y - pointAttributes.radius,
        maxY: y + pointAttributes.radius
      }
    }

    function getPointAttributes (layerAttributes, $index) {
      return {
        screenGeometry: layerAttributes.screenGeometryObject[$index],
        radius: layerAttributes.radiusObject[$index]
      }
    }

    function createItemFromBBox (bbox) {
      return {
        minX: bbox.x[0],
        maxX: bbox.x[1],
        minY: bbox.y[0],
        maxY: bbox.y[1]
      }
    }

    function indexRectangle (markData) {
      let rectangleAttributes = markData.attributes;

      let bbox = calculateBBoxGeometry(rectangleAttributes.screenGeometry);
      let item = createItemFromBBox(bbox);

      item.attributes = rectangleAttributes;
      item.markType = 'Rectangle';
      item.markId = markData.markId;

      return item
    }

    function indexRectangleLayer ({ layerAttributes, indexArray, layerId }) {
      let items = [];

      for (let i = 0; i < indexArray.length; i++) {
        let $index = indexArray[i];

        let rectangleAttributes = getRectangleAttributes(layerAttributes, $index);
        let bbox = calculateBBoxGeometry(rectangleAttributes.screenGeometry);
        let item = createItemFromBBox(bbox);

        item.$index = $index;
        item.attributes = rectangleAttributes;
        item.markType = 'Rectangle';
        item.layerId = layerId;

        items.push(item);
      }

      return items
    }

    function getRectangleAttributes (layerAttributes, $index) {
      return { screenGeometry: layerAttributes.screenGeometryObject[$index] }
    }

    function indexPolygon (markData) {
      let polygonAttributes = markData.attributes;

      let bbox = calculateBBoxGeometry(polygonAttributes.screenGeometry);
      let item = createItemFromBBox(bbox);

      item.attributes = polygonAttributes;
      item.markType = 'Polygon';
      item.markId = markData.markId;

      return item
    }

    function indexPolygonLayer () {}

    const markIndexing = {
      'Point': indexPoint,
      'Rectangle': indexRectangle,
      'Polygon': indexPolygon
    };

    const layerIndexing = {
      'Point': indexPointLayer,
      'Rectangle': indexRectangleLayer,
      'Polygon': indexPolygonLayer
    };

    class InteractionManager {
      constructor () {
        this._layers = {};
        this._marks = {};

        this._id = undefined;
        this._eventManager = undefined;

        this._clickHandler = new ClickHandler(this);
        this._mouseoverHandler = new MouseoverHandler(this);
        this._mouseoutHandler = new MouseoutHandler(this);
      }

      // Initialization
      setId (sectionId) {
        this._id = sectionId;
      }

      linkEventManager (eventManager) {
        this._eventManager = eventManager;
      }

      // Layer loading and removing
      loadLayer (layerType, layerData) {
        let indexingFunction = layerIndexing[layerType];
        let indexableData = indexingFunction(layerData);

        let layerId = layerData.layerId;
        this._layers[layerId] = indexableData;
      }

      layerIsLoaded (layerId) {
        return this._layers.hasOwnProperty(layerId)
      }

      removeLayer (layerId) {
        delete this._layers[layerId];
      }

      // Mark loading and removing
      loadMark (markType, markData) {
        let indexingFunction = markIndexing[markType];
        let indexableItem = indexingFunction(markData);

        let markId = markData.markId;
        this._marks[markId] = indexableItem;
      }

      markIsLoaded (markId) {
        return this._marks.hasOwnProperty(markId)
      }

      removeMark (markId) {
        delete this._marks[markId];
      }

      // Add/remove layer interactions
      addLayerInteraction (interactionName, layerId, callback) {
        if (interactionName === 'click') this._clickHandler.addLayerInteraction(layerId, callback);
        if (interactionName === 'mouseover') this._mouseoverHandler.addLayerInteraction(layerId, callback);
        if (interactionName === 'mouseout') this._mouseoutHandler.addLayerInteraction(layerId, callback);
      }

      removeAllLayerInteractions (layerId) {
        this._clickHandler.removeLayerInteraction(layerId);
        this._mouseoverHandler.removeLayerInteraction(layerId);
        this._mouseoutHandler.removeLayerInteraction(layerId);
      }

      // Add/remove mark interactions
      addMarkInteraction (interactionName, markId, callback) {
        if (interactionName === 'click') this._clickHandler.addMarkInteraction(markId, callback);
        if (interactionName === 'mouseover') this._mouseoverHandler.addMarkInteraction(markId, callback);
        if (interactionName === 'mouseout') this._mouseoutHandler.addMarkInteraction(markId, callback);
      }

      removeAllMarkInteractions (markId) {
        this._clickHandler.removeMarkInteraction(markId);
        this._mouseoverHandler.removeMarkInteraction(markId);
        this._mouseoutHandler.removeMarkInteraction(markId);
      }
    }

    /* src/components/Core/Graphic/Graphic.svelte generated by Svelte v3.6.5 */

    const file$2 = "src/components/Core/Graphic/Graphic.svelte";

    function create_fragment$3(ctx) {
    	var svg, current;

    	const default_slot_1 = ctx.$$slots.default;
    	const default_slot = create_slot(default_slot_1, ctx, null);

    	return {
    		c: function create() {
    			svg = svg_element("svg");

    			if (default_slot) default_slot.c();

    			attr(svg, "width", ctx.width);
    			attr(svg, "height", ctx.height);
    			add_location(svg, file$2, 51, 0, 1601);
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

    			ctx.svg_binding(svg);
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
    			transition_in(default_slot, local);
    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(svg);
    			}

    			if (default_slot) default_slot.d(detaching);
    			ctx.svg_binding(null);
    		}
    	};
    }

    function instance$3($$self, $$props, $$invalidate) {
    	

      let { width, height, scaleX = undefined, scaleY = undefined, renderer = undefined } = $$props;

      const graphicContext = init$1();
      const sectionContext = init$2();
      const eventManagerContext = init$3();
      const interactionManagerContext = init$4();

      let rootNode;
     
      // set up event and interaction manager
      let eventManager = new EventManager();
      update$3(eventManagerContext, eventManager);

      let interactionManager = new InteractionManager();
      interactionManager.setId('graphic');
      interactionManager.linkEventManager(eventManager);

      update$4(interactionManagerContext, interactionManager);

      onMount(() => {
        // only on mount can we bind the svg root node and attach actual event listeners
        eventManager.addRootNode(rootNode);
        eventManager.attachEventListeners();
      });

    	const writable_props = ['width', 'height', 'scaleX', 'scaleY', 'renderer'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Graphic> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;

    	function svg_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			$$invalidate('rootNode', rootNode = $$value);
    		});
    	}

    	$$self.$set = $$props => {
    		if ('width' in $$props) $$invalidate('width', width = $$props.width);
    		if ('height' in $$props) $$invalidate('height', height = $$props.height);
    		if ('scaleX' in $$props) $$invalidate('scaleX', scaleX = $$props.scaleX);
    		if ('scaleY' in $$props) $$invalidate('scaleY', scaleY = $$props.scaleY);
    		if ('renderer' in $$props) $$invalidate('renderer', renderer = $$props.renderer);
    		if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
    	};

    	$$self.$$.update = ($$dirty = { renderer: 1, width: 1, height: 1, scaleX: 1, scaleY: 1 }) => {
    		if ($$dirty.renderer) { {
            update$1(graphicContext, { renderer });
          } }
    		if ($$dirty.width || $$dirty.height || $$dirty.scaleX || $$dirty.scaleY) { {
            let rangeX = [0, width];
            let rangeY = [0, height];
            update$2(sectionContext, { rangeX, rangeY, scaleX, scaleY });
          } }
    	};

    	return {
    		width,
    		height,
    		scaleX,
    		scaleY,
    		renderer,
    		rootNode,
    		svg_binding,
    		$$slots,
    		$$scope
    	};
    }

    class Graphic extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, ["width", "height", "scaleX", "scaleY", "renderer"]);

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

    	get scaleX() {
    		throw new Error("<Graphic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scaleX(value) {
    		throw new Error("<Graphic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scaleY() {
    		throw new Error("<Graphic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scaleY(value) {
    		throw new Error("<Graphic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get renderer() {
    		throw new Error("<Graphic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set renderer(value) {
    		throw new Error("<Graphic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const key$4 = {};

    function subscribe$5 () {
      // silly hack for when there is no CoordinateTransformation context
      return getContext(key$4) ? getContext(key$4) : writable()
    }

    function ensureNotParent () {
      if (getContext(key$4)) {
        throw new Error('CoordinateTransformation components cannot contain anything other than Marks or Layers')
      }
    }

    function createScreenGeometry (
      geometry, coordinateTransformationContext, interpolate, visibilityTreshold = 1
    ) {
      if (transformationNecessary(coordinateTransformationContext)) {
        let transformFunc = coordinateTransformationContext.transform.bind(coordinateTransformationContext);

        if (interpolate) {
          return interpolateGeometry(geometry, transformFunc, visibilityTreshold)
        }

        if (!interpolate) {
          return transformGeometry(geometry, transformFunc)
        }
      }

      if (!transformationNecessary(coordinateTransformationContext)) {
        return geometry
      }
    }

    function transformationNecessary (coordinateTransformationContext) {
      return coordinateTransformationContext &&
      coordinateTransformationContext.type() !== 'identity'
    }

    function createScreenGeometryObject (
      scaledGeometryArray, coordinateTransformationContext, indexArray, interpolate, visibilityTreshold = 1
    ) {
      let screenGeometryObject = {};

      for (let i = 0; i < scaledGeometryArray.length; i++) {
        let scaledGeometry = scaledGeometryArray[i];
        let screenGeometry = createScreenGeometry(
          scaledGeometry, coordinateTransformationContext, interpolate, visibilityTreshold
        );

        let index = indexArray[i];

        screenGeometryObject[index] = screenGeometry;
      }

      return screenGeometryObject
    }

    function scaleCoordinates (coordinateProps, sectionContext) {
      ensureValidCombination(coordinateProps);
      validateTypes(coordinateProps);

      const { x1, x2, y1, y2 } = coordinateProps;

      const scaledCoordinates = {};

      if (wereSpecified(x1, x2)) {
        scaledCoordinates.x1 = scaleCoordinate(x1, 'x1', sectionContext);
        scaledCoordinates.x2 = scaleCoordinate(x2, 'x2', sectionContext);
      } else {
        scaledCoordinates.x1 = sectionContext.x1();
        scaledCoordinates.x2 = sectionContext.x2();
      }

      if (wereSpecified(y1, y2)) {
        scaledCoordinates.y1 = scaleCoordinate(y1, 'y1', sectionContext);
        scaledCoordinates.y2 = scaleCoordinate(y2, 'y2', sectionContext);
      } else {
        scaledCoordinates.y1 = sectionContext.y1();
        scaledCoordinates.y2 = sectionContext.y2();
      }

      return scaledCoordinates
    }

    const s = JSON.stringify;

    function ensureValidCombination (c) {
      if (onlyOne(c.x1, c.x2)) {
        throw new Error(`Rectangle: invalid combination of 'x1' and 'x2': ${s(c.x1)}, ${s(c.x2)}. Either provide both or none.`)
      }

      if (onlyOne(c.y1, c.y2)) {
        throw new Error(`Rectangle: invalid combination of 'y1' and 'y2': ${s(c.y1)}, ${s(c.y2)}. Either provide both or none.`)
      }
    }

    function onlyOne (a, b) {
      return isUndefined(a) ? isDefined(b) : isUndefined(b)
    }

    const invalidCoordinateValueError = (value, name) => new Error(`Rectangle: invalid coordinate value for '${name}': ${s(value)}`);

    function validateTypes (coordinates) {
      for (let coordinateName in coordinates) {
        let coordinate = coordinates[coordinateName];

        if (isDefined(coordinate)) {
          if (isInvalid(coordinate)) throw invalidCoordinateValueError(coordinate, coordinateName)

          if (![Number, String, Date, Function].includes(coordinate.constructor)) {
            throw invalidCoordinateValueError(coordinate, coordinateName)
          }
        }
      }
    }

    function wereSpecified (a, b) {
      return isDefined(a) && isDefined(b)
    }

    function scaleCoordinate (coordinate, coordinateName, sectionContext) {
      const scales = sectionContext.scales();

      if (coordinate.constructor === Function) {
        return coordinate(scales)
      } else {
        const scale = ['x1', 'x2'].includes(coordinateName) ? scales.scaleX : scales.scaleY;
        const scaledCoordinate = scale(coordinate);
        throwErrorIfInvalidScaledCoordinate(coordinate, scaledCoordinate, coordinateName);

        return scaledCoordinate
      }
    }

    function throwErrorIfInvalidScaledCoordinate (input, output, coordinateName) {
      const parentScale = ['x1', 'x2'].includes(coordinateName) ? 'scaleX' : 'scaleY';
      if (isInvalid(output)) throw new Error(`Scale '${parentScale}' received '${s(input)}' and returned '${s(output)}`)
    }

    function createScaledGeometry (c) {
      return {
        type: 'Polygon',
        coordinates: [
          [
            [c.x1, c.y1],
            [c.x1, c.y2],
            [c.x2, c.y2],
            [c.x2, c.y1],
            [c.x1, c.y1]
          ]
        ]
      }
    }

    /* src/components/Core/Section/Section.svelte generated by Svelte v3.6.5 */

    const file$3 = "src/components/Core/Section/Section.svelte";

    function create_fragment$4(ctx) {
    	var g, current;

    	const default_slot_1 = ctx.$$slots.default;
    	const default_slot = create_slot(default_slot_1, ctx, null);

    	return {
    		c: function create() {
    			g = svg_element("g");

    			if (default_slot) default_slot.c();

    			attr(g, "class", "section");
    			add_location(g, file$3, 54, 0, 1824);
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
    			if (default_slot && default_slot.p && changed.$$scope) {
    				default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(default_slot, local);
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

    let idCounter = 0;
    function getId () {
      return 'sc' + idCounter++
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $sectionContext, $eventManagerContext;

    	

      let sectionId = getId();

      // Props
      let { x1 = undefined, x2 = undefined, y1 = undefined, y2 = undefined, scaleX = undefined, scaleY = undefined } = $$props;

      // Contexts
      const graphicContext = subscribe$1();
      const sectionContext = subscribe$2(); validate_store(sectionContext, 'sectionContext'); subscribe($$self, sectionContext, $$value => { $sectionContext = $$value; $$invalidate('$sectionContext', $sectionContext); });
      const newSectionContext = init$2();
      ensureNotParent();
      const eventManagerContext = subscribe$3(); validate_store(eventManagerContext, 'eventManagerContext'); subscribe($$self, eventManagerContext, $$value => { $eventManagerContext = $$value; $$invalidate('$eventManagerContext', $eventManagerContext); });
      const interactionManagerContext = init$4();
      
      // set up interaction manager
      let interactionManager = new InteractionManager();
      interactionManager.setId(sectionId);
      interactionManager.linkEventManager($eventManagerContext);
      update$4(interactionManagerContext, interactionManager);

    	const writable_props = ['x1', 'x2', 'y1', 'y2', 'scaleX', 'scaleY'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Section> was created with unknown prop '${key}'`);
    	});

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

    	$$self.$$.update = ($$dirty = { x1: 1, x2: 1, y1: 1, y2: 1, $sectionContext: 1, sectionId: 1, scaleX: 1, scaleY: 1 }) => {
    		if ($$dirty.x1 || $$dirty.x2 || $$dirty.y1 || $$dirty.y2 || $$dirty.$sectionContext || $$dirty.sectionId || $$dirty.scaleX || $$dirty.scaleY) { {
            let scaledCoordinates = scaleCoordinates({ x1, x2, y1, y2 }, $sectionContext);
            let rangeX = [scaledCoordinates.x1, scaledCoordinates.x2];
            let rangeY = [scaledCoordinates.y1, scaledCoordinates.y2];
        
            update$2(
              newSectionContext, { sectionId, rangeX, rangeY, scaleX, scaleY }
            );
          } }
    	};

    	return {
    		x1,
    		x2,
    		y1,
    		y2,
    		scaleX,
    		scaleY,
    		sectionContext,
    		eventManagerContext,
    		$$slots,
    		$$scope
    	};
    }

    class Section extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, ["x1", "x2", "y1", "y2", "scaleX", "scaleY"]);
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

    var global$1 = (typeof global !== "undefined" ? global :
                typeof self !== "undefined" ? self :
                typeof window !== "undefined" ? window : {});

    // shim for using process in browser
    // based off https://github.com/defunctzombie/node-process/blob/master/browser.js

    function defaultSetTimout() {
        throw new Error('setTimeout has not been defined');
    }
    function defaultClearTimeout () {
        throw new Error('clearTimeout has not been defined');
    }
    var cachedSetTimeout = defaultSetTimout;
    var cachedClearTimeout = defaultClearTimeout;
    if (typeof global$1.setTimeout === 'function') {
        cachedSetTimeout = setTimeout;
    }
    if (typeof global$1.clearTimeout === 'function') {
        cachedClearTimeout = clearTimeout;
    }

    function runTimeout(fun) {
        if (cachedSetTimeout === setTimeout) {
            //normal enviroments in sane situations
            return setTimeout(fun, 0);
        }
        // if setTimeout wasn't available but was latter defined
        if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
            cachedSetTimeout = setTimeout;
            return setTimeout(fun, 0);
        }
        try {
            // when when somebody has screwed with setTimeout but no I.E. maddness
            return cachedSetTimeout(fun, 0);
        } catch(e){
            try {
                // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
                return cachedSetTimeout.call(null, fun, 0);
            } catch(e){
                // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
                return cachedSetTimeout.call(this, fun, 0);
            }
        }


    }
    function runClearTimeout(marker) {
        if (cachedClearTimeout === clearTimeout) {
            //normal enviroments in sane situations
            return clearTimeout(marker);
        }
        // if clearTimeout wasn't available but was latter defined
        if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
            cachedClearTimeout = clearTimeout;
            return clearTimeout(marker);
        }
        try {
            // when when somebody has screwed with setTimeout but no I.E. maddness
            return cachedClearTimeout(marker);
        } catch (e){
            try {
                // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
                return cachedClearTimeout.call(null, marker);
            } catch (e){
                // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
                // Some versions of I.E. have different rules for clearTimeout vs setTimeout
                return cachedClearTimeout.call(this, marker);
            }
        }



    }
    var queue = [];
    var draining = false;
    var currentQueue;
    var queueIndex = -1;

    function cleanUpNextTick() {
        if (!draining || !currentQueue) {
            return;
        }
        draining = false;
        if (currentQueue.length) {
            queue = currentQueue.concat(queue);
        } else {
            queueIndex = -1;
        }
        if (queue.length) {
            drainQueue();
        }
    }

    function drainQueue() {
        if (draining) {
            return;
        }
        var timeout = runTimeout(cleanUpNextTick);
        draining = true;

        var len = queue.length;
        while(len) {
            currentQueue = queue;
            queue = [];
            while (++queueIndex < len) {
                if (currentQueue) {
                    currentQueue[queueIndex].run();
                }
            }
            queueIndex = -1;
            len = queue.length;
        }
        currentQueue = null;
        draining = false;
        runClearTimeout(timeout);
    }
    function nextTick(fun) {
        var args = new Array(arguments.length - 1);
        if (arguments.length > 1) {
            for (var i = 1; i < arguments.length; i++) {
                args[i - 1] = arguments[i];
            }
        }
        queue.push(new Item(fun, args));
        if (queue.length === 1 && !draining) {
            runTimeout(drainQueue);
        }
    }
    // v8 likes predictible objects
    function Item(fun, array) {
        this.fun = fun;
        this.array = array;
    }
    Item.prototype.run = function () {
        this.fun.apply(null, this.array);
    };
    var title = 'browser';
    var platform = 'browser';
    var browser = true;
    var env = {};
    var argv = [];
    var version = ''; // empty string to avoid regexp issues
    var versions = {};
    var release = {};
    var config = {};

    function noop$2() {}

    var on = noop$2;
    var addListener = noop$2;
    var once = noop$2;
    var off = noop$2;
    var removeListener = noop$2;
    var removeAllListeners = noop$2;
    var emit = noop$2;

    function binding(name) {
        throw new Error('process.binding is not supported');
    }

    function cwd () { return '/' }
    function chdir (dir) {
        throw new Error('process.chdir is not supported');
    }function umask() { return 0; }

    // from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
    var performance = global$1.performance || {};
    var performanceNow =
      performance.now        ||
      performance.mozNow     ||
      performance.msNow      ||
      performance.oNow       ||
      performance.webkitNow  ||
      function(){ return (new Date()).getTime() };

    // generate timestamp or delta
    // see http://nodejs.org/api/process.html#process_process_hrtime
    function hrtime(previousTimestamp){
      var clocktime = performanceNow.call(performance)*1e-3;
      var seconds = Math.floor(clocktime);
      var nanoseconds = Math.floor((clocktime%1)*1e9);
      if (previousTimestamp) {
        seconds = seconds - previousTimestamp[0];
        nanoseconds = nanoseconds - previousTimestamp[1];
        if (nanoseconds<0) {
          seconds--;
          nanoseconds += 1e9;
        }
      }
      return [seconds,nanoseconds]
    }

    var startTime = new Date();
    function uptime() {
      var currentTime = new Date();
      var dif = currentTime - startTime;
      return dif / 1000;
    }

    var process = {
      nextTick: nextTick,
      title: title,
      browser: browser,
      env: env,
      argv: argv,
      version: version,
      versions: versions,
      on: on,
      addListener: addListener,
      once: once,
      off: off,
      removeListener: removeListener,
      removeAllListeners: removeAllListeners,
      emit: emit,
      binding: binding,
      cwd: cwd,
      chdir: chdir,
      umask: umask,
      hrtime: hrtime,
      platform: platform,
      release: release,
      config: config,
      uptime: uptime
    };

    function warn (message) {
      if (!process) console.warn(message);

      if (process && process.env.NODE_ENV !== 'test') {
        console.warn(message);
      }
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function is_date(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    function get_interpolator(a, b) {
        if (a === b || a !== a)
            return () => a;
        const type = typeof a;
        if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
            throw new Error('Cannot interpolate values of different type');
        }
        if (Array.isArray(a)) {
            const arr = b.map((bi, i) => {
                return get_interpolator(a[i], bi);
            });
            return t => arr.map(fn => fn(t));
        }
        if (type === 'object') {
            if (!a || !b)
                throw new Error('Object cannot be null');
            if (is_date(a) && is_date(b)) {
                a = a.getTime();
                b = b.getTime();
                const delta = b - a;
                return t => new Date(a + t * delta);
            }
            const keys = Object.keys(b);
            const interpolators = {};
            keys.forEach(key => {
                interpolators[key] = get_interpolator(a[key], b[key]);
            });
            return t => {
                const result = {};
                keys.forEach(key => {
                    result[key] = interpolators[key](t);
                });
                return result;
            };
        }
        if (type === 'number') {
            const delta = b - a;
            return t => a + t * delta;
        }
        throw new Error(`Cannot interpolate ${type} values`);
    }
    function tweened(value, defaults = {}) {
        const store = writable(value);
        let task;
        let target_value = value;
        function set(new_value, opts) {
            target_value = new_value;
            let previous_task = task;
            let started = false;
            let { delay = 0, duration = 400, easing = identity, interpolate = get_interpolator } = assign(assign({}, defaults), opts);
            const start = now() + delay;
            let fn;
            task = loop(now => {
                if (now < start)
                    return true;
                if (!started) {
                    fn = interpolate(value, new_value);
                    if (typeof duration === 'function')
                        duration = duration(value, new_value);
                    started = true;
                }
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                const elapsed = now - start;
                if (elapsed > duration) {
                    store.set(value = new_value);
                    return false;
                }
                // @ts-ignore
                store.set(value = fn(easing(elapsed / duration)));
                return true;
            });
            return task.promise;
        }
        return {
            set,
            update: (fn, opts) => set(fn(target_value, value), opts),
            subscribe: store.subscribe
        };
    }

    function transitionsEqual (a, b) {
      if (a === undefined || b === undefined) return a === b

      if (a.constructor !== Object) return a === b

      return transitionObjectsEqual(a, b)
    }

    function transitionObjectsEqual (a, b) {
      if (b.constructor !== Object) return false

      if (numberOfKeys(a) !== numberOfKeys(b)) return false

      for (let aesthetic in a) {
        let aestheticA = a[aesthetic];
        let aestheticB = b[aesthetic];
        if (aestheticA.constructor !== Object) return aestheticA === aestheticB
        if (!aestheticTransitionObjectsEqual(aestheticA, aestheticB)) return false
      }

      return true
    }

    function aestheticTransitionObjectsEqual (a, b) {
      if (b.constructor !== Object) return false

      if (numberOfKeys(a) !== numberOfKeys(b)) return false

      for (let key in a) {
        if (a[key] !== b[key]) return false
      }

      return true
    }

    function numberOfKeys (obj) {
      return Object.keys(obj).length
    }

    /**
     * Like createTransitionable, returns either a Svelte store, or a Svelte 'tweened' store,
     * depending on whether the user specified transition options.
     * But instead of for a single Mark, the store is created for an entire layer.
     *
     * @param {String} aestheticName The name of the aesthetic a store is created for.
     * @param {*} aestheticValue The initial value of the store.
     * @param {Number|Object} transitionOptions A number indicating the transtion duration, or an Object
     * with aesthetic names as keys, and Numbers OR Objects as values.
     * @returns {writable|tweened}
     */
    function createTransitionableLayer (aestheticName, aestheticValue, transitionOptions) {
      if (transitionOptions === undefined) {
        return writable(aestheticValue)
      }

      if (transitionOptions.constructor === Number) {
        let options = createOptionsFromDuration(aestheticName, transitionOptions);
        return tweened(aestheticValue, options)
      }

      if (transitionOptions.constructor === Object) {
        if (!transitionOptions.hasOwnProperty(aestheticName)) return writable(aestheticValue)

        let aestheticTransition = transitionOptions[aestheticName];

        if (aestheticTransition && aestheticTransition.constructor === Number) {
          let options = createOptionsFromDuration(aestheticName, aestheticTransition);
          return tweened(aestheticValue, options)
        }

        if (aestheticTransition && aestheticTransition.constructor === Object) {
          let options = createOptionsFromOptions(aestheticName, aestheticTransition);
          return tweened(aestheticValue, options)
        }
      }

      throw new Error(`Invalid transition for ${aestheticName}`)
    }

    function createOptionsFromDuration (aestheticName, duration) {
      switch (aestheticName) {
        case 'geometry':
          return { duration, easing: cubicOut, interpolate: transitionGeometries }

        default:
          return { duration, easing: cubicOut, interpolate: interpolateLayer }
      }
    }

    function createOptionsFromOptions (aestheticName, transitionOptions) {
      switch (aestheticName) {
        case 'geometry':
          return Object.assign({ interpolate: transitionGeometries }, transitionOptions)

        default:
          return Object.assign({ interpolate: interpolateLayer }, transitionOptions)
      }
    }

    function interpolateLayer (a, b) {
      let aWithoutObsoleteIndices = {};

      for (let index in a) {
        if (b.hasOwnProperty(index)) {
          aWithoutObsoleteIndices[index] = a[index];
        }
      }

      return interpolate(aWithoutObsoleteIndices, b)
    }

    const geoPathGenerator = geoPath();

    function generatePath (geometry) {
      return geoPathGenerator(geometry)
    }

    function generateArrayOfLength (value, length) {
      return new Array(length).fill(value)
    }

    function getIndexArray (indexProp, length) {
      if (indexProp) {
        if (indexProp.constructor !== Array) throw new Error('index must be Array')
        if (indexProp.length !== length) throw new Error('index must be of same length as coordinates')

        return indexProp
      } else {
        return new Array(length).fill(0).map((_, i) => i)
      }
    }

    /**
     * This function is only used when dealing with layers.
     * For layers, most 'aesthetic' props can be specified in two ways:
     *  - An Array of values is passed to the prop
     *  - A single value is passed to the prop
     * In both cases, we need to convert whatever was passed to an Object.
     * The keys will be whatever the user used as 'index' Array, and the values
     * are whatever the user used passed to the prop in question.
     * If the user passed an Array, the values of the Object correspond to the values in the Array.
     * If the user passed a single value, every value in the Object will be that value.
     * The object structure is necessary to do transitions later.
     *
     * @param {*} propValue Whatever was passed to the prop
     * @param {*} indexArray The array of indices to be used as keys
     * @returns {Object.<Number, *>} The 'prop Object'
     */
    function generatePropObject (propValue, indexArray) {
      let propObj = {};

      if (propValue.constructor === Array) {
        for (let i = 0; i < indexArray.length; i++) {
          let index = indexArray[i];
          propObj[index] = propValue[i];
        }
      }

      if (propValue.constructor !== Array) {
        for (let i = 0; i < indexArray.length; i++) {
          let index = indexArray[i];
          propObj[index] = propValue;
        }
      }

      return propObj
    }

    function generateScreenGeometryObject (
      coordinateProps, sectionContext, coordinateTransformationContext, interpolate, indexProp
    ) {
      let { scaledCoordinates, length } = scaleCoordinates$1(coordinateProps, sectionContext);
      let indexArray = getIndexArray(indexProp, length);
      let scaledGeometryArray = createScaledGeometryArray(scaledCoordinates, length);
      let screenGeometryObject = createScreenGeometryObject(
        scaledGeometryArray, coordinateTransformationContext, indexArray, interpolate
      );

      return { screenGeometryObject, indexArray }
    }

    function scaleCoordinates$1 (coordinateProps, sectionContext) {
      ensureValidCombination(coordinateProps);

      let coordinatesThatNeedScaling = whichCoordinatesNeedScaling(coordinateProps);

      let nonMissingCoordinates = getMissingCoordinatesFromContext(coordinateProps, sectionContext);
      let coordinateValues = getCoordinateValues(nonMissingCoordinates, sectionContext);

      let length = getNRectangles(coordinateValues);

      let coordinatesThatArePrimitive = whichCoordinatesArePrimitive(coordinateValues);

      let scaledCoordinates = _scaleCoordinates(
        coordinateValues,
        sectionContext.scales(),
        coordinatesThatNeedScaling,
        coordinatesThatArePrimitive,
        length
      );

      return { scaledCoordinates, length }
    }

    function whichCoordinatesNeedScaling (coordinates) {
      let coordinatesThatNeedScaling = {};

      for (let coordinateName in coordinates) {
        let coordinateValue = coordinates[coordinateName];
        coordinatesThatNeedScaling[coordinateName] = coordinateValue && coordinateValue.constructor !== Function;
      }

      return coordinatesThatNeedScaling
    }

    function getMissingCoordinatesFromContext (coordinates, sectionContext) {
      let nonMissingCoordinates = {};

      for (let coordinateName in coordinates) {
        let coordinateValue = coordinates[coordinateName];
        nonMissingCoordinates[coordinateName] = coordinateValue || sectionContext[coordinateName]();
      }

      return nonMissingCoordinates
    }

    function getCoordinateValues (nonMissingCoordinates, sectionContext) {
      let scales = sectionContext.scales();
      let coordinateValues = {};

      for (let coordinateName in nonMissingCoordinates) {
        let coordinateValue = nonMissingCoordinates[coordinateName];
        if (coordinateValue.constructor === Function) {
          coordinateValues[coordinateName] = coordinateValue(scales);
        } else {
          coordinateValues[coordinateName] = coordinateValue;
        }
      }

      return coordinateValues
    }

    const invalidCoordinateError = new Error('RectangleLayer: invalid coordinate specification');

    function getNRectangles (coordinateValues) {
      let atLeastOneArray = false;
      let length;

      for (let coordinateName in coordinateValues) {
        let coordinateValue = coordinateValues[coordinateName];

        if (coordinateValue.constructor === Array) {
          atLeastOneArray = true;
          length = length || coordinateValue.length;

          if (length !== coordinateValue.length) throw invalidCoordinateError
        }
      }

      if (!atLeastOneArray) throw invalidCoordinateError

      return length
    }

    function whichCoordinatesArePrimitive (coordinateValues) {
      let coordinatesThatArePrimitive = {};

      for (let coordinateName in coordinateValues) {
        let coordinateValue = coordinateValues[coordinateName];

        coordinatesThatArePrimitive[coordinateName] = coordinateValue.constructor !== Array;
      }

      return coordinatesThatArePrimitive
    }

    function _scaleCoordinates (
      coordinateValues, scales, coordinatesThatNeedScaling, coordinatesThatArePrimitive, length
    ) {
      let scaledCoordinates = {};

      for (let coordinateName in coordinateValues) {
        let coordinateValue = coordinateValues[coordinateName];
        let array;
        let scale = coordinateName.startsWith('x') ? scales.scaleX : scales.scaleY;

        if (coordinatesThatArePrimitive[coordinateName]) array = generateArrayOfLength(coordinateValue, length);
        if (!coordinatesThatArePrimitive[coordinateName]) array = coordinateValue;

        scaledCoordinates[coordinateName] = coordinatesThatNeedScaling[coordinateName]
          ? array.map(scale)
          : array;
      }

      return scaledCoordinates
    }

    function createScaledGeometryArray (scaledCoordinates, length) {
      let scaledGeometryArray = [];

      for (let i = 0; i < length; i++) {
        scaledGeometryArray.push(
          createScaledGeometry({
            x1: scaledCoordinates.x1[i],
            x2: scaledCoordinates.x2[i],
            y1: scaledCoordinates.y1[i],
            y2: scaledCoordinates.y2[i]
          })
        );
      }

      return scaledGeometryArray
    }

    /* src/components/Marks/Rectangle/RectangleLayer.svelte generated by Svelte v3.6.5 */

    const file$4 = "src/components/Marks/Rectangle/RectangleLayer.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.$index = list[i];
    	return child_ctx;
    }

    // (145:0) {#if $graphicContext.output() === 'svg'}
    function create_if_block$2(ctx) {
    	var each_blocks = [], each_1_lookup = new Map(), each_1_anchor;

    	var each_value = ctx.indexArray;

    	const get_key = ctx => ctx.$index;

    	for (var i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	return {
    		c: function create() {
    			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].c();

    			each_1_anchor = empty();
    		},

    		m: function mount(target, anchor) {
    			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].m(target, anchor);

    			insert(target, each_1_anchor, anchor);
    		},

    		p: function update(changed, ctx) {
    			const each_value = ctx.indexArray;
    			each_blocks = update_keyed_each(each_blocks, changed, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, destroy_block, create_each_block, each_1_anchor, get_each_context);
    		},

    		d: function destroy(detaching) {
    			for (i = 0; i < each_blocks.length; i += 1) each_blocks[i].d(detaching);

    			if (detaching) {
    				detach(each_1_anchor);
    			}
    		}
    	};
    }

    // (147:2) {#each indexArray as $index ($index)}
    function create_each_block(key_1, ctx) {
    	var path, path_d_value, path_fill_value, path_style_value;

    	return {
    		key: key_1,

    		first: null,

    		c: function create() {
    			path = svg_element("path");
    			attr(path, "class", "rectangle");
    			attr(path, "d", path_d_value = generatePath(ctx.$tr_screenGeometryObject[ctx.$index]));
    			attr(path, "fill", path_fill_value = ctx.$tr_fillObject[ctx.$index]);
    			attr(path, "style", path_style_value = `opacity: ${ctx.$tr_opacityObject[ctx.$index]}`);
    			add_location(path, file$4, 148, 4, 4740);
    			this.first = path;
    		},

    		m: function mount(target, anchor) {
    			insert(target, path, anchor);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.$tr_screenGeometryObject || changed.indexArray) && path_d_value !== (path_d_value = generatePath(ctx.$tr_screenGeometryObject[ctx.$index]))) {
    				attr(path, "d", path_d_value);
    			}

    			if ((changed.$tr_fillObject || changed.indexArray) && path_fill_value !== (path_fill_value = ctx.$tr_fillObject[ctx.$index])) {
    				attr(path, "fill", path_fill_value);
    			}

    			if ((changed.$tr_opacityObject || changed.indexArray) && path_style_value !== (path_style_value = `opacity: ${ctx.$tr_opacityObject[ctx.$index]}`)) {
    				attr(path, "style", path_style_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(path);
    			}
    		}
    	};
    }

    function create_fragment$5(ctx) {
    	var if_block_anchor;

    	var if_block = (ctx.$graphicContext.output() === 'svg') && create_if_block$2(ctx);

    	return {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    		},

    		p: function update(changed, ctx) {
    			if (ctx.$graphicContext.output() === 'svg') {
    				if (if_block) {
    					if_block.p(changed, ctx);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);

    			if (detaching) {
    				detach(if_block_anchor);
    			}
    		}
    	};
    }

    let idCounter$1 = 0;
    function getId$1 () {
      return 'rtl' + idCounter$1++
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let $sectionContext, $coordinateTransformationContext, $tr_screenGeometryObject, $$unsubscribe_tr_screenGeometryObject = noop, $$subscribe_tr_screenGeometryObject = () => { $$unsubscribe_tr_screenGeometryObject(); $$unsubscribe_tr_screenGeometryObject = tr_screenGeometryObject.subscribe($$value => { $tr_screenGeometryObject = $$value; $$invalidate('$tr_screenGeometryObject', $tr_screenGeometryObject); }); }, $tr_fillObject, $$unsubscribe_tr_fillObject = noop, $$subscribe_tr_fillObject = () => { $$unsubscribe_tr_fillObject(); $$unsubscribe_tr_fillObject = tr_fillObject.subscribe($$value => { $tr_fillObject = $$value; $$invalidate('$tr_fillObject', $tr_fillObject); }); }, $tr_opacityObject, $$unsubscribe_tr_opacityObject = noop, $$subscribe_tr_opacityObject = () => { $$unsubscribe_tr_opacityObject(); $$unsubscribe_tr_opacityObject = tr_opacityObject.subscribe($$value => { $tr_opacityObject = $$value; $$invalidate('$tr_opacityObject', $tr_opacityObject); }); }, $interactionManagerContext, $graphicContext;

    	$$self.$$.on_destroy.push(() => $$unsubscribe_tr_screenGeometryObject());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_tr_fillObject());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_tr_opacityObject());

    	

      let layerId = getId$1();

      let initPhase = true;
      const initDone = () => !initPhase;

      // Props
      let { x1 = undefined, x2 = undefined, y1 = undefined, y2 = undefined, fill = 'black', opacity = 1, transition = undefined, interpolate = true, index = undefined, onClick = undefined, onMouseover = undefined, onMouseout = undefined } = $$props;

      // Contexts
      const graphicContext = subscribe$1(); validate_store(graphicContext, 'graphicContext'); subscribe($$self, graphicContext, $$value => { $graphicContext = $$value; $$invalidate('$graphicContext', $graphicContext); });
      const sectionContext = subscribe$2(); validate_store(sectionContext, 'sectionContext'); subscribe($$self, sectionContext, $$value => { $sectionContext = $$value; $$invalidate('$sectionContext', $sectionContext); });
      const coordinateTransformationContext = subscribe$5(); validate_store(coordinateTransformationContext, 'coordinateTransformationContext'); subscribe($$self, coordinateTransformationContext, $$value => { $coordinateTransformationContext = $$value; $$invalidate('$coordinateTransformationContext', $coordinateTransformationContext); });
      const interactionManagerContext = subscribe$4(); validate_store(interactionManagerContext, 'interactionManagerContext'); subscribe($$self, interactionManagerContext, $$value => { $interactionManagerContext = $$value; $$invalidate('$interactionManagerContext', $interactionManagerContext); });

      // Generate screenGeometryObject and index array
      let { screenGeometryObject, indexArray } = generateScreenGeometryObject(
        { x1, x2, y1, y2 },
        $sectionContext,
        $coordinateTransformationContext,
        interpolate,
        index
      );

      // Generate other prop arrays
      let fillObject = generatePropObject(fill, indexArray);
      let opacityObject = generatePropObject(opacity, indexArray);

      // Initiate transitionables
      let tr_screenGeometryObject = createTransitionableLayer('geometry', screenGeometryObject, transition); $$subscribe_tr_screenGeometryObject();
      let tr_fillObject = createTransitionableLayer('fill', fillObject, transition); $$subscribe_tr_fillObject();
      let tr_opacityObject = createTransitionableLayer('opacity', opacityObject, transition); $$subscribe_tr_opacityObject();

      let previousTransition;

      // Update transition parameters
      beforeUpdate(() => {
        if (!transitionsEqual(previousTransition, transition)) {
          previousTransition = transition;

          tr_screenGeometryObject = createTransitionableLayer('geometry', $tr_screenGeometryObject, transition); $$subscribe_tr_screenGeometryObject(), $$invalidate('tr_screenGeometryObject', tr_screenGeometryObject);
          tr_fillObject = createTransitionableLayer('fill', $tr_fillObject, transition); $$subscribe_tr_fillObject(), $$invalidate('tr_fillObject', tr_fillObject);
          tr_opacityObject = createTransitionableLayer('opacity', $tr_opacityObject, transition); $$subscribe_tr_opacityObject(), $$invalidate('tr_opacityObject', tr_opacityObject);
        }
      });

      afterUpdate(() => {
        initPhase = false;
      });

      onMount(() => {
        updateInteractionManagerIfNecessary();
      });

      onDestroy(() => {
        removeLayerFromSpatialIndexIfNecessary();
      });

      // Helpers
      function updateInteractionManagerIfNecessary () {
        removeLayerFromSpatialIndexIfNecessary();

        if (isInteractive) {
          $interactionManagerContext.loadLayer('Rectangle', createLayerData());

          if (onClick) $interactionManagerContext.addLayerInteraction('click', layerId, onClick);
          if (onMouseover) $interactionManagerContext.addLayerInteraction('mouseover', layerId, onMouseover);
          if (onMouseout) $interactionManagerContext.addLayerInteraction('mouseout', layerId, onMouseout);
        }
      }

      function removeLayerFromSpatialIndexIfNecessary () {
        if ($interactionManagerContext.layerIsLoaded(layerId)) {
          $interactionManagerContext.removeAllLayerInteractions(layerId);
          $interactionManagerContext.removeLayer(layerId);
        }
      }

      function createLayerData () {
        return {
          layerAttributes: { screenGeometryObject },
          layerId,
          indexArray
        }
      }

    	const writable_props = ['x1', 'x2', 'y1', 'y2', 'fill', 'opacity', 'transition', 'interpolate', 'index', 'onClick', 'onMouseover', 'onMouseout'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<RectangleLayer> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('x1' in $$props) $$invalidate('x1', x1 = $$props.x1);
    		if ('x2' in $$props) $$invalidate('x2', x2 = $$props.x2);
    		if ('y1' in $$props) $$invalidate('y1', y1 = $$props.y1);
    		if ('y2' in $$props) $$invalidate('y2', y2 = $$props.y2);
    		if ('fill' in $$props) $$invalidate('fill', fill = $$props.fill);
    		if ('opacity' in $$props) $$invalidate('opacity', opacity = $$props.opacity);
    		if ('transition' in $$props) $$invalidate('transition', transition = $$props.transition);
    		if ('interpolate' in $$props) $$invalidate('interpolate', interpolate = $$props.interpolate);
    		if ('index' in $$props) $$invalidate('index', index = $$props.index);
    		if ('onClick' in $$props) $$invalidate('onClick', onClick = $$props.onClick);
    		if ('onMouseover' in $$props) $$invalidate('onMouseover', onMouseover = $$props.onMouseover);
    		if ('onMouseout' in $$props) $$invalidate('onMouseout', onMouseout = $$props.onMouseout);
    	};

    	let isInteractive;

    	$$self.$$.update = ($$dirty = { x1: 1, x2: 1, y1: 1, y2: 1, $sectionContext: 1, $coordinateTransformationContext: 1, interpolate: 1, index: 1, tr_screenGeometryObject: 1, screenGeometryObject: 1, tr_fillObject: 1, fill: 1, indexArray: 1, tr_opacityObject: 1, opacity: 1, onClick: 1, onMouseover: 1, onMouseout: 1 }) => {
    		if ($$dirty.x1 || $$dirty.x2 || $$dirty.y1 || $$dirty.y2 || $$dirty.$sectionContext || $$dirty.$coordinateTransformationContext || $$dirty.interpolate || $$dirty.index || $$dirty.tr_screenGeometryObject || $$dirty.screenGeometryObject) { {
            if (initDone()) {
              let _ = generateScreenGeometryObject(
                { x1, x2, y1, y2 },
                $sectionContext,
                $coordinateTransformationContext,
                interpolate,
                index
              );
        
              $$invalidate('indexArray', indexArray = _.indexArray);
              $$invalidate('screenGeometryObject', screenGeometryObject = _.screenGeometryObject);
        
              tr_screenGeometryObject.set(screenGeometryObject);
        
              updateInteractionManagerIfNecessary();
            }
          } }
    		if ($$dirty.tr_fillObject || $$dirty.fill || $$dirty.indexArray) { { if (initDone()) tr_fillObject.set(generatePropObject(fill, indexArray)); } }
    		if ($$dirty.tr_opacityObject || $$dirty.opacity || $$dirty.indexArray) { { if (initDone()) tr_opacityObject.set(generatePropObject(opacity, indexArray)); } }
    		if ($$dirty.onClick || $$dirty.onMouseover || $$dirty.onMouseout) { isInteractive = onClick !== undefined || onMouseover !== undefined || onMouseout !== undefined; }
    	};

    	return {
    		x1,
    		x2,
    		y1,
    		y2,
    		fill,
    		opacity,
    		transition,
    		interpolate,
    		index,
    		onClick,
    		onMouseover,
    		onMouseout,
    		graphicContext,
    		sectionContext,
    		coordinateTransformationContext,
    		interactionManagerContext,
    		indexArray,
    		tr_screenGeometryObject,
    		tr_fillObject,
    		tr_opacityObject,
    		$tr_screenGeometryObject,
    		$tr_fillObject,
    		$tr_opacityObject,
    		$graphicContext
    	};
    }

    class RectangleLayer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, ["x1", "x2", "y1", "y2", "fill", "opacity", "transition", "interpolate", "index", "onClick", "onMouseover", "onMouseout"]);
    	}

    	get x1() {
    		throw new Error("<RectangleLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x1(value) {
    		throw new Error("<RectangleLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get x2() {
    		throw new Error("<RectangleLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x2(value) {
    		throw new Error("<RectangleLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y1() {
    		throw new Error("<RectangleLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y1(value) {
    		throw new Error("<RectangleLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y2() {
    		throw new Error("<RectangleLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y2(value) {
    		throw new Error("<RectangleLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fill() {
    		throw new Error("<RectangleLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fill(value) {
    		throw new Error("<RectangleLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get opacity() {
    		throw new Error("<RectangleLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set opacity(value) {
    		throw new Error("<RectangleLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transition() {
    		throw new Error("<RectangleLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transition(value) {
    		throw new Error("<RectangleLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get interpolate() {
    		throw new Error("<RectangleLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set interpolate(value) {
    		throw new Error("<RectangleLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get index() {
    		throw new Error("<RectangleLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set index(value) {
    		throw new Error("<RectangleLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onClick() {
    		throw new Error("<RectangleLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onClick(value) {
    		throw new Error("<RectangleLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onMouseover() {
    		throw new Error("<RectangleLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onMouseover(value) {
    		throw new Error("<RectangleLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onMouseout() {
    		throw new Error("<RectangleLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onMouseout(value) {
    		throw new Error("<RectangleLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

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
      let hasCorrectType = data.type === 'FeatureCollection';
      let hasCorrectFeatures = data.features && data.features.length > 0;

      return hasCorrectType && hasCorrectFeatures
    }

    function checkFormatColumnData (data) {
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

        if (dataLength === 0) {
          throw new Error('Invalid data: columns cannot be empty')
        }

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

    function convertRowToColumnData (data) {
      checkIfDataIsEmpty(data);
      let columnData = initColumnData(data);

      for (let row of data) {
        for (let key in row) {
          columnData[key].push(row[key]);
        }
      }

      return columnData
    }

    function initColumnData (data) {
      let firstRow = data[0];
      let columnKeys = Object.keys(firstRow);
      let columnData = {};

      for (let key of columnKeys) {
        columnData[key] = [];
      }

      return columnData
    }

    function checkIfDataIsEmpty (data) {
      if (data.length === 0) {
        throw new Error('Received empty Array while trying to load row-oriented data. This is not allowed.')
      }
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

      for (let i = 0; i < features.length; i++) {
        let { geometry, properties } = features[i];
        geometryData.push(geometry);

        for (let columnName in properties) {
          data[columnName].push(properties[columnName]);
        }
      }

      checkFormatColumnData(data);

      data.$geometry = geometryData;

      return data
    }

    let currentId = -1;

    function id () {
      currentId++;
      return currentId
    }

    const methods = {
      _setColumnData (data) {
        checkFormatColumnData(data);
        this._storeData(data);
      },

      _setRowData (rowData) {
        let columnData = convertRowToColumnData(rowData);
        this._setColumnData(columnData);
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
        this._data = data;
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
      if (value.constructor === Number) return 'quantitative'
      if (value.constructor === String) return 'categorical'
      if (value.constructor === Date) return 'temporal'
      if (isInterval(value)) return 'interval'
      if (isGeometry(value)) return 'geometry'
      if (value.constructor === DataContainer) return 'nested'

      throwIf(throwError);
    }

    function isGeometry (value) {
      return value.constructor === Object && value.hasOwnProperty('type') && value.hasOwnProperty('coordinates')
    }

    function isInterval (value) {
      return value.constructor === Array && value.length === 2 && value.every(entry => entry.constructor === Number)
    }

    function throwIf (throwError) {
      if (throwError) {
        throw new Error('Invalid data')
      } else {
        return undefined
      }
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
        throw new Error(`Column '${column}' contains only missing values. This is not allowed.`)
      }

      if (nValidValues > 0) {
        let type = getDataType(firstValidValue);
        let domain;

        if (columnName === '$geometry') {
          domain = calculateBBoxGeometries(column);
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
          warn(
            `Column '${columnName}' contains only 1 valid value: ${firstValidValue}.\n` +
            `Using domain ${JSON.stringify(domain)}`
          );
        }
      } else if (nUniqueValues === 1) {
        domain = createDomainForSingleValue(type, firstValidValue);

        if (type !== 'categorical') {
          warn(
            `Column '${columnName}' contains only 1 unique value: ${firstValidValue}.\n` +
            `Using domain ${JSON.stringify(domain)}`
          );
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
        case 'interval': {
          domain = [Infinity, -Infinity];
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

      if (type === 'interval') {
        domain = updateDomain(domain, value[0], 'quantitative');
        domain = updateDomain(domain, value[1], 'quantitative');
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

      if (type === 'interval') {
        domain = value.sort((a, b) => a > b);
      }

      return domain
    }

    function getDay (date, days) {
      let dateCopy = new Date(date.getTime());
      return new Date(dateCopy.setDate(dateCopy.getDate() + days))
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
          warn(`Rename: column '${oldName}' not found`);
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

      let length = getDataLength(data);

      for (let i = 0; i < length; i++) {
        // Ge grouped values
        let groupedValues = getGroupedValues(data, i, groupedColumns);

        // Get unique identifier for group
        let groupID = JSON.stringify(groupedValues);

        // If groups object has no entry for this group yet: create new group object
        groups[groupID] = groups[groupID] || new Group(data, groupedValues);

        // Add row to group
        groups[groupID].addRow(data, i);
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
        warn('No binning method specified, defaulting to EqualInterval');
        method = 'EqualInterval';
      }
      if (method.constructor !== String) {
        warn('Binning method not recognized, defaulting to EqualInterval');
        method = 'EqualInterval';
      }

      let numClasses = binInstructions.numClasses;
      if (!numClasses) {
        warn('numClasses not specified, defaulting to 5');
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
          warn(`binSize not specified for IntervalSize binning, defaulting to ${(domain[1] - domain[0])}`);
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

      // Create an empty array to store new DataContainers divided by range
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
      for (let ix = 0; ix < length; ix++) {
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

        // Update the bins column with new DataContainer
        let dataContainer = new DataContainer(newRow);
        bins[binIndex] = dataContainer;
      }

      // Add new grouped column to newData
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

    function globals$1(defs) {
      defs('EPSG:4326', "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees");
      defs('EPSG:4269', "+title=NAD83 (long/lat) +proj=longlat +a=6378137.0 +b=6356752.31414036 +ellps=GRS80 +datum=NAD83 +units=degrees");
      defs('EPSG:3857', "+title=WGS 84 / Pseudo-Mercator +proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs");

      defs.WGS84 = defs['EPSG:4326'];
      defs['EPSG:3785'] = defs['EPSG:3857']; // maintain backward compat, official code is 3857
      defs.GOOGLE = defs['EPSG:3857'];
      defs['EPSG:900913'] = defs['EPSG:3857'];
      defs['EPSG:102113'] = defs['EPSG:3857'];
    }

    var PJD_3PARAM = 1;
    var PJD_7PARAM = 2;
    var PJD_WGS84 = 4; // WGS84 or equivalent
    var PJD_NODATUM = 5; // WGS84 or equivalent
    var SEC_TO_RAD = 4.84813681109535993589914102357e-6;
    var HALF_PI = Math.PI/2;
    // ellipoid pj_set_ell.c
    var SIXTH = 0.1666666666666666667;
    /* 1/6 */
    var RA4 = 0.04722222222222222222;
    /* 17/360 */
    var RA6 = 0.02215608465608465608;
    var EPSLN = 1.0e-10;
    // you'd think you could use Number.EPSILON above but that makes
    // Mollweide get into an infinate loop.

    var D2R = 0.01745329251994329577;
    var R2D = 57.29577951308232088;
    var FORTPI = Math.PI/4;
    var TWO_PI = Math.PI * 2;
    // SPI is slightly greater than Math.PI, so values that exceed the -180..180
    // degree range by a tiny amount don't get wrapped. This prevents points that
    // have drifted from their original location along the 180th meridian (due to
    // floating point error) from changing their sign.
    var SPI = 3.14159265359;

    var exports$1 = {};

    exports$1.greenwich = 0.0; //"0dE",
    exports$1.lisbon = -9.131906111111; //"9d07'54.862\"W",
    exports$1.paris = 2.337229166667; //"2d20'14.025\"E",
    exports$1.bogota = -74.080916666667; //"74d04'51.3\"W",
    exports$1.madrid = -3.687938888889; //"3d41'16.58\"W",
    exports$1.rome = 12.452333333333; //"12d27'8.4\"E",
    exports$1.bern = 7.439583333333; //"7d26'22.5\"E",
    exports$1.jakarta = 106.807719444444; //"106d48'27.79\"E",
    exports$1.ferro = -17.666666666667; //"17d40'W",
    exports$1.brussels = 4.367975; //"4d22'4.71\"E",
    exports$1.stockholm = 18.058277777778; //"18d3'29.8\"E",
    exports$1.athens = 23.7163375; //"23d42'58.815\"E",
    exports$1.oslo = 10.722916666667; //"10d43'22.5\"E"

    var units = {
      ft: {to_meter: 0.3048},
      'us-ft': {to_meter: 1200 / 3937}
    };

    var ignoredChar = /[\s_\-\/\(\)]/g;
    function match(obj, key) {
      if (obj[key]) {
        return obj[key];
      }
      var keys = Object.keys(obj);
      var lkey = key.toLowerCase().replace(ignoredChar, '');
      var i = -1;
      var testkey, processedKey;
      while (++i < keys.length) {
        testkey = keys[i];
        processedKey = testkey.toLowerCase().replace(ignoredChar, '');
        if (processedKey === lkey) {
          return obj[testkey];
        }
      }
    }

    function projStr(defData) {
      var self = {};
      var paramObj = defData.split('+').map(function(v) {
        return v.trim();
      }).filter(function(a) {
        return a;
      }).reduce(function(p, a) {
        var split = a.split('=');
        split.push(true);
        p[split[0].toLowerCase()] = split[1];
        return p;
      }, {});
      var paramName, paramVal, paramOutname;
      var params = {
        proj: 'projName',
        datum: 'datumCode',
        rf: function(v) {
          self.rf = parseFloat(v);
        },
        lat_0: function(v) {
          self.lat0 = v * D2R;
        },
        lat_1: function(v) {
          self.lat1 = v * D2R;
        },
        lat_2: function(v) {
          self.lat2 = v * D2R;
        },
        lat_ts: function(v) {
          self.lat_ts = v * D2R;
        },
        lon_0: function(v) {
          self.long0 = v * D2R;
        },
        lon_1: function(v) {
          self.long1 = v * D2R;
        },
        lon_2: function(v) {
          self.long2 = v * D2R;
        },
        alpha: function(v) {
          self.alpha = parseFloat(v) * D2R;
        },
        lonc: function(v) {
          self.longc = v * D2R;
        },
        x_0: function(v) {
          self.x0 = parseFloat(v);
        },
        y_0: function(v) {
          self.y0 = parseFloat(v);
        },
        k_0: function(v) {
          self.k0 = parseFloat(v);
        },
        k: function(v) {
          self.k0 = parseFloat(v);
        },
        a: function(v) {
          self.a = parseFloat(v);
        },
        b: function(v) {
          self.b = parseFloat(v);
        },
        r_a: function() {
          self.R_A = true;
        },
        zone: function(v) {
          self.zone = parseInt(v, 10);
        },
        south: function() {
          self.utmSouth = true;
        },
        towgs84: function(v) {
          self.datum_params = v.split(",").map(function(a) {
            return parseFloat(a);
          });
        },
        to_meter: function(v) {
          self.to_meter = parseFloat(v);
        },
        units: function(v) {
          self.units = v;
          var unit = match(units, v);
          if (unit) {
            self.to_meter = unit.to_meter;
          }
        },
        from_greenwich: function(v) {
          self.from_greenwich = v * D2R;
        },
        pm: function(v) {
          var pm = match(exports$1, v);
          self.from_greenwich = (pm ? pm : parseFloat(v)) * D2R;
        },
        nadgrids: function(v) {
          if (v === '@null') {
            self.datumCode = 'none';
          }
          else {
            self.nadgrids = v;
          }
        },
        axis: function(v) {
          var legalAxis = "ewnsud";
          if (v.length === 3 && legalAxis.indexOf(v.substr(0, 1)) !== -1 && legalAxis.indexOf(v.substr(1, 1)) !== -1 && legalAxis.indexOf(v.substr(2, 1)) !== -1) {
            self.axis = v;
          }
        }
      };
      for (paramName in paramObj) {
        paramVal = paramObj[paramName];
        if (paramName in params) {
          paramOutname = params[paramName];
          if (typeof paramOutname === 'function') {
            paramOutname(paramVal);
          }
          else {
            self[paramOutname] = paramVal;
          }
        }
        else {
          self[paramName] = paramVal;
        }
      }
      if(typeof self.datumCode === 'string' && self.datumCode !== "WGS84"){
        self.datumCode = self.datumCode.toLowerCase();
      }
      return self;
    }

    var NEUTRAL = 1;
    var KEYWORD = 2;
    var NUMBER = 3;
    var QUOTED = 4;
    var AFTERQUOTE = 5;
    var ENDED = -1;
    var whitespace = /\s/;
    var latin = /[A-Za-z]/;
    var keyword = /[A-Za-z84]/;
    var endThings = /[,\]]/;
    var digets = /[\d\.E\-\+]/;
    // const ignoredChar = /[\s_\-\/\(\)]/g;
    function Parser(text) {
      if (typeof text !== 'string') {
        throw new Error('not a string');
      }
      this.text = text.trim();
      this.level = 0;
      this.place = 0;
      this.root = null;
      this.stack = [];
      this.currentObject = null;
      this.state = NEUTRAL;
    }
    Parser.prototype.readCharicter = function() {
      var char = this.text[this.place++];
      if (this.state !== QUOTED) {
        while (whitespace.test(char)) {
          if (this.place >= this.text.length) {
            return;
          }
          char = this.text[this.place++];
        }
      }
      switch (this.state) {
        case NEUTRAL:
          return this.neutral(char);
        case KEYWORD:
          return this.keyword(char)
        case QUOTED:
          return this.quoted(char);
        case AFTERQUOTE:
          return this.afterquote(char);
        case NUMBER:
          return this.number(char);
        case ENDED:
          return;
      }
    };
    Parser.prototype.afterquote = function(char) {
      if (char === '"') {
        this.word += '"';
        this.state = QUOTED;
        return;
      }
      if (endThings.test(char)) {
        this.word = this.word.trim();
        this.afterItem(char);
        return;
      }
      throw new Error('havn\'t handled "' +char + '" in afterquote yet, index ' + this.place);
    };
    Parser.prototype.afterItem = function(char) {
      if (char === ',') {
        if (this.word !== null) {
          this.currentObject.push(this.word);
        }
        this.word = null;
        this.state = NEUTRAL;
        return;
      }
      if (char === ']') {
        this.level--;
        if (this.word !== null) {
          this.currentObject.push(this.word);
          this.word = null;
        }
        this.state = NEUTRAL;
        this.currentObject = this.stack.pop();
        if (!this.currentObject) {
          this.state = ENDED;
        }

        return;
      }
    };
    Parser.prototype.number = function(char) {
      if (digets.test(char)) {
        this.word += char;
        return;
      }
      if (endThings.test(char)) {
        this.word = parseFloat(this.word);
        this.afterItem(char);
        return;
      }
      throw new Error('havn\'t handled "' +char + '" in number yet, index ' + this.place);
    };
    Parser.prototype.quoted = function(char) {
      if (char === '"') {
        this.state = AFTERQUOTE;
        return;
      }
      this.word += char;
      return;
    };
    Parser.prototype.keyword = function(char) {
      if (keyword.test(char)) {
        this.word += char;
        return;
      }
      if (char === '[') {
        var newObjects = [];
        newObjects.push(this.word);
        this.level++;
        if (this.root === null) {
          this.root = newObjects;
        } else {
          this.currentObject.push(newObjects);
        }
        this.stack.push(this.currentObject);
        this.currentObject = newObjects;
        this.state = NEUTRAL;
        return;
      }
      if (endThings.test(char)) {
        this.afterItem(char);
        return;
      }
      throw new Error('havn\'t handled "' +char + '" in keyword yet, index ' + this.place);
    };
    Parser.prototype.neutral = function(char) {
      if (latin.test(char)) {
        this.word = char;
        this.state = KEYWORD;
        return;
      }
      if (char === '"') {
        this.word = '';
        this.state = QUOTED;
        return;
      }
      if (digets.test(char)) {
        this.word = char;
        this.state = NUMBER;
        return;
      }
      if (endThings.test(char)) {
        this.afterItem(char);
        return;
      }
      throw new Error('havn\'t handled "' +char + '" in neutral yet, index ' + this.place);
    };
    Parser.prototype.output = function() {
      while (this.place < this.text.length) {
        this.readCharicter();
      }
      if (this.state === ENDED) {
        return this.root;
      }
      throw new Error('unable to parse string "' +this.text + '". State is ' + this.state);
    };

    function parseString(txt) {
      var parser = new Parser(txt);
      return parser.output();
    }

    function mapit(obj, key, value) {
      if (Array.isArray(key)) {
        value.unshift(key);
        key = null;
      }
      var thing = key ? {} : obj;

      var out = value.reduce(function(newObj, item) {
        sExpr(item, newObj);
        return newObj
      }, thing);
      if (key) {
        obj[key] = out;
      }
    }

    function sExpr(v, obj) {
      if (!Array.isArray(v)) {
        obj[v] = true;
        return;
      }
      var key = v.shift();
      if (key === 'PARAMETER') {
        key = v.shift();
      }
      if (v.length === 1) {
        if (Array.isArray(v[0])) {
          obj[key] = {};
          sExpr(v[0], obj[key]);
          return;
        }
        obj[key] = v[0];
        return;
      }
      if (!v.length) {
        obj[key] = true;
        return;
      }
      if (key === 'TOWGS84') {
        obj[key] = v;
        return;
      }
      if (!Array.isArray(key)) {
        obj[key] = {};
      }

      var i;
      switch (key) {
        case 'UNIT':
        case 'PRIMEM':
        case 'VERT_DATUM':
          obj[key] = {
            name: v[0].toLowerCase(),
            convert: v[1]
          };
          if (v.length === 3) {
            sExpr(v[2], obj[key]);
          }
          return;
        case 'SPHEROID':
        case 'ELLIPSOID':
          obj[key] = {
            name: v[0],
            a: v[1],
            rf: v[2]
          };
          if (v.length === 4) {
            sExpr(v[3], obj[key]);
          }
          return;
        case 'PROJECTEDCRS':
        case 'PROJCRS':
        case 'GEOGCS':
        case 'GEOCCS':
        case 'PROJCS':
        case 'LOCAL_CS':
        case 'GEODCRS':
        case 'GEODETICCRS':
        case 'GEODETICDATUM':
        case 'EDATUM':
        case 'ENGINEERINGDATUM':
        case 'VERT_CS':
        case 'VERTCRS':
        case 'VERTICALCRS':
        case 'COMPD_CS':
        case 'COMPOUNDCRS':
        case 'ENGINEERINGCRS':
        case 'ENGCRS':
        case 'FITTED_CS':
        case 'LOCAL_DATUM':
        case 'DATUM':
          v[0] = ['name', v[0]];
          mapit(obj, key, v);
          return;
        default:
          i = -1;
          while (++i < v.length) {
            if (!Array.isArray(v[i])) {
              return sExpr(v, obj[key]);
            }
          }
          return mapit(obj, key, v);
      }
    }

    var D2R$1 = 0.01745329251994329577;



    function rename$1(obj, params) {
      var outName = params[0];
      var inName = params[1];
      if (!(outName in obj) && (inName in obj)) {
        obj[outName] = obj[inName];
        if (params.length === 3) {
          obj[outName] = params[2](obj[outName]);
        }
      }
    }

    function d2r(input) {
      return input * D2R$1;
    }

    function cleanWKT(wkt) {
      if (wkt.type === 'GEOGCS') {
        wkt.projName = 'longlat';
      } else if (wkt.type === 'LOCAL_CS') {
        wkt.projName = 'identity';
        wkt.local = true;
      } else {
        if (typeof wkt.PROJECTION === 'object') {
          wkt.projName = Object.keys(wkt.PROJECTION)[0];
        } else {
          wkt.projName = wkt.PROJECTION;
        }
      }
      if (wkt.UNIT) {
        wkt.units = wkt.UNIT.name.toLowerCase();
        if (wkt.units === 'metre') {
          wkt.units = 'meter';
        }
        if (wkt.UNIT.convert) {
          if (wkt.type === 'GEOGCS') {
            if (wkt.DATUM && wkt.DATUM.SPHEROID) {
              wkt.to_meter = wkt.UNIT.convert*wkt.DATUM.SPHEROID.a;
            }
          } else {
            wkt.to_meter = wkt.UNIT.convert;
          }
        }
      }
      var geogcs = wkt.GEOGCS;
      if (wkt.type === 'GEOGCS') {
        geogcs = wkt;
      }
      if (geogcs) {
        //if(wkt.GEOGCS.PRIMEM&&wkt.GEOGCS.PRIMEM.convert){
        //  wkt.from_greenwich=wkt.GEOGCS.PRIMEM.convert*D2R;
        //}
        if (geogcs.DATUM) {
          wkt.datumCode = geogcs.DATUM.name.toLowerCase();
        } else {
          wkt.datumCode = geogcs.name.toLowerCase();
        }
        if (wkt.datumCode.slice(0, 2) === 'd_') {
          wkt.datumCode = wkt.datumCode.slice(2);
        }
        if (wkt.datumCode === 'new_zealand_geodetic_datum_1949' || wkt.datumCode === 'new_zealand_1949') {
          wkt.datumCode = 'nzgd49';
        }
        if (wkt.datumCode === 'wgs_1984') {
          if (wkt.PROJECTION === 'Mercator_Auxiliary_Sphere') {
            wkt.sphere = true;
          }
          wkt.datumCode = 'wgs84';
        }
        if (wkt.datumCode.slice(-6) === '_ferro') {
          wkt.datumCode = wkt.datumCode.slice(0, - 6);
        }
        if (wkt.datumCode.slice(-8) === '_jakarta') {
          wkt.datumCode = wkt.datumCode.slice(0, - 8);
        }
        if (~wkt.datumCode.indexOf('belge')) {
          wkt.datumCode = 'rnb72';
        }
        if (geogcs.DATUM && geogcs.DATUM.SPHEROID) {
          wkt.ellps = geogcs.DATUM.SPHEROID.name.replace('_19', '').replace(/[Cc]larke\_18/, 'clrk');
          if (wkt.ellps.toLowerCase().slice(0, 13) === 'international') {
            wkt.ellps = 'intl';
          }

          wkt.a = geogcs.DATUM.SPHEROID.a;
          wkt.rf = parseFloat(geogcs.DATUM.SPHEROID.rf, 10);
        }

        if (geogcs.DATUM && geogcs.DATUM.TOWGS84) {
          wkt.datum_params = geogcs.DATUM.TOWGS84;
        }
        if (~wkt.datumCode.indexOf('osgb_1936')) {
          wkt.datumCode = 'osgb36';
        }
        if (~wkt.datumCode.indexOf('osni_1952')) {
          wkt.datumCode = 'osni52';
        }
        if (~wkt.datumCode.indexOf('tm65')
          || ~wkt.datumCode.indexOf('geodetic_datum_of_1965')) {
          wkt.datumCode = 'ire65';
        }
        if (wkt.datumCode === 'ch1903+') {
          wkt.datumCode = 'ch1903';
        }
        if (~wkt.datumCode.indexOf('israel')) {
          wkt.datumCode = 'isr93';
        }
      }
      if (wkt.b && !isFinite(wkt.b)) {
        wkt.b = wkt.a;
      }

      function toMeter(input) {
        var ratio = wkt.to_meter || 1;
        return input * ratio;
      }
      var renamer = function(a) {
        return rename$1(wkt, a);
      };
      var list = [
        ['standard_parallel_1', 'Standard_Parallel_1'],
        ['standard_parallel_2', 'Standard_Parallel_2'],
        ['false_easting', 'False_Easting'],
        ['false_northing', 'False_Northing'],
        ['central_meridian', 'Central_Meridian'],
        ['latitude_of_origin', 'Latitude_Of_Origin'],
        ['latitude_of_origin', 'Central_Parallel'],
        ['scale_factor', 'Scale_Factor'],
        ['k0', 'scale_factor'],
        ['latitude_of_center', 'Latitude_Of_Center'],
        ['latitude_of_center', 'Latitude_of_center'],
        ['lat0', 'latitude_of_center', d2r],
        ['longitude_of_center', 'Longitude_Of_Center'],
        ['longitude_of_center', 'Longitude_of_center'],
        ['longc', 'longitude_of_center', d2r],
        ['x0', 'false_easting', toMeter],
        ['y0', 'false_northing', toMeter],
        ['long0', 'central_meridian', d2r],
        ['lat0', 'latitude_of_origin', d2r],
        ['lat0', 'standard_parallel_1', d2r],
        ['lat1', 'standard_parallel_1', d2r],
        ['lat2', 'standard_parallel_2', d2r],
        ['azimuth', 'Azimuth'],
        ['alpha', 'azimuth', d2r],
        ['srsCode', 'name']
      ];
      list.forEach(renamer);
      if (!wkt.long0 && wkt.longc && (wkt.projName === 'Albers_Conic_Equal_Area' || wkt.projName === 'Lambert_Azimuthal_Equal_Area')) {
        wkt.long0 = wkt.longc;
      }
      if (!wkt.lat_ts && wkt.lat1 && (wkt.projName === 'Stereographic_South_Pole' || wkt.projName === 'Polar Stereographic (variant B)')) {
        wkt.lat0 = d2r(wkt.lat1 > 0 ? 90 : -90);
        wkt.lat_ts = wkt.lat1;
      }
    }
    function wkt(wkt) {
      var lisp = parseString(wkt);
      var type = lisp.shift();
      var name = lisp.shift();
      lisp.unshift(['name', name]);
      lisp.unshift(['type', type]);
      var obj = {};
      sExpr(lisp, obj);
      cleanWKT(obj);
      return obj;
    }

    function defs(name) {
      /*global console*/
      var that = this;
      if (arguments.length === 2) {
        var def = arguments[1];
        if (typeof def === 'string') {
          if (def.charAt(0) === '+') {
            defs[name] = projStr(arguments[1]);
          }
          else {
            defs[name] = wkt(arguments[1]);
          }
        } else {
          defs[name] = def;
        }
      }
      else if (arguments.length === 1) {
        if (Array.isArray(name)) {
          return name.map(function(v) {
            if (Array.isArray(v)) {
              defs.apply(that, v);
            }
            else {
              defs(v);
            }
          });
        }
        else if (typeof name === 'string') {
          if (name in defs) {
            return defs[name];
          }
        }
        else if ('EPSG' in name) {
          defs['EPSG:' + name.EPSG] = name;
        }
        else if ('ESRI' in name) {
          defs['ESRI:' + name.ESRI] = name;
        }
        else if ('IAU2000' in name) {
          defs['IAU2000:' + name.IAU2000] = name;
        }
        else {
          console.log(name);
        }
        return;
      }


    }
    globals$1(defs);

    function testObj(code){
      return typeof code === 'string';
    }
    function testDef(code){
      return code in defs;
    }
     var codeWords = ['PROJECTEDCRS', 'PROJCRS', 'GEOGCS','GEOCCS','PROJCS','LOCAL_CS', 'GEODCRS', 'GEODETICCRS', 'GEODETICDATUM', 'ENGCRS', 'ENGINEERINGCRS'];
    function testWKT(code){
      return codeWords.some(function (word) {
        return code.indexOf(word) > -1;
      });
    }
    var codes = ['3857', '900913', '3785', '102113'];
    function checkMercator(item) {
      var auth = match(item, 'authority');
      if (!auth) {
        return;
      }
      var code = match(auth, 'epsg');
      return code && codes.indexOf(code) > -1;
    }
    function checkProjStr(item) {
      var ext = match(item, 'extension');
      if (!ext) {
        return;
      }
      return match(ext, 'proj4');
    }
    function testProj(code){
      return code[0] === '+';
    }
    function parse(code){
      if (testObj(code)) {
        //check to see if this is a WKT string
        if (testDef(code)) {
          return defs[code];
        }
        if (testWKT(code)) {
          var out = wkt(code);
          // test of spetial case, due to this being a very common and often malformed
          if (checkMercator(out)) {
            return defs['EPSG:3857'];
          }
          var maybeProjStr = checkProjStr(out);
          if (maybeProjStr) {
            return projStr(maybeProjStr);
          }
          return out;
        }
        if (testProj(code)) {
          return projStr(code);
        }
      }else{
        return code;
      }
    }

    function extend$1(destination, source) {
      destination = destination || {};
      var value, property;
      if (!source) {
        return destination;
      }
      for (property in source) {
        value = source[property];
        if (value !== undefined) {
          destination[property] = value;
        }
      }
      return destination;
    }

    function msfnz(eccent, sinphi, cosphi) {
      var con = eccent * sinphi;
      return cosphi / (Math.sqrt(1 - con * con));
    }

    function sign(x) {
      return x<0 ? -1 : 1;
    }

    function adjust_lon(x) {
      return (Math.abs(x) <= SPI) ? x : (x - (sign(x) * TWO_PI));
    }

    function tsfnz(eccent, phi, sinphi) {
      var con = eccent * sinphi;
      var com = 0.5 * eccent;
      con = Math.pow(((1 - con) / (1 + con)), com);
      return (Math.tan(0.5 * (HALF_PI - phi)) / con);
    }

    function phi2z(eccent, ts) {
      var eccnth = 0.5 * eccent;
      var con, dphi;
      var phi = HALF_PI - 2 * Math.atan(ts);
      for (var i = 0; i <= 15; i++) {
        con = eccent * Math.sin(phi);
        dphi = HALF_PI - 2 * Math.atan(ts * (Math.pow(((1 - con) / (1 + con)), eccnth))) - phi;
        phi += dphi;
        if (Math.abs(dphi) <= 0.0000000001) {
          return phi;
        }
      }
      //console.log("phi2z has NoConvergence");
      return -9999;
    }

    function init$5() {
      var con = this.b / this.a;
      this.es = 1 - con * con;
      if(!('x0' in this)){
        this.x0 = 0;
      }
      if(!('y0' in this)){
        this.y0 = 0;
      }
      this.e = Math.sqrt(this.es);
      if (this.lat_ts) {
        if (this.sphere) {
          this.k0 = Math.cos(this.lat_ts);
        }
        else {
          this.k0 = msfnz(this.e, Math.sin(this.lat_ts), Math.cos(this.lat_ts));
        }
      }
      else {
        if (!this.k0) {
          if (this.k) {
            this.k0 = this.k;
          }
          else {
            this.k0 = 1;
          }
        }
      }
    }

    /* Mercator forward equations--mapping lat,long to x,y
      --------------------------------------------------*/

    function forward(p) {
      var lon = p.x;
      var lat = p.y;
      // convert to radians
      if (lat * R2D > 90 && lat * R2D < -90 && lon * R2D > 180 && lon * R2D < -180) {
        return null;
      }

      var x, y;
      if (Math.abs(Math.abs(lat) - HALF_PI) <= EPSLN) {
        return null;
      }
      else {
        if (this.sphere) {
          x = this.x0 + this.a * this.k0 * adjust_lon(lon - this.long0);
          y = this.y0 + this.a * this.k0 * Math.log(Math.tan(FORTPI + 0.5 * lat));
        }
        else {
          var sinphi = Math.sin(lat);
          var ts = tsfnz(this.e, lat, sinphi);
          x = this.x0 + this.a * this.k0 * adjust_lon(lon - this.long0);
          y = this.y0 - this.a * this.k0 * Math.log(ts);
        }
        p.x = x;
        p.y = y;
        return p;
      }
    }

    /* Mercator inverse equations--mapping x,y to lat/long
      --------------------------------------------------*/
    function inverse(p) {

      var x = p.x - this.x0;
      var y = p.y - this.y0;
      var lon, lat;

      if (this.sphere) {
        lat = HALF_PI - 2 * Math.atan(Math.exp(-y / (this.a * this.k0)));
      }
      else {
        var ts = Math.exp(-y / (this.a * this.k0));
        lat = phi2z(this.e, ts);
        if (lat === -9999) {
          return null;
        }
      }
      lon = adjust_lon(this.long0 + x / (this.a * this.k0));

      p.x = lon;
      p.y = lat;
      return p;
    }

    var names = ["Mercator", "Popular Visualisation Pseudo Mercator", "Mercator_1SP", "Mercator_Auxiliary_Sphere", "merc"];
    var merc = {
      init: init$5,
      forward: forward,
      inverse: inverse,
      names: names
    };

    function init$6() {
      //no-op for longlat
    }

    function identity$5(pt) {
      return pt;
    }
    var names$1 = ["longlat", "identity"];
    var longlat = {
      init: init$6,
      forward: identity$5,
      inverse: identity$5,
      names: names$1
    };

    var projs = [merc, longlat];
    var names$2 = {};
    var projStore = [];

    function add$1(proj, i) {
      var len = projStore.length;
      if (!proj.names) {
        console.log(i);
        return true;
      }
      projStore[len] = proj;
      proj.names.forEach(function(n) {
        names$2[n.toLowerCase()] = len;
      });
      return this;
    }

    function get$2(name) {
      if (!name) {
        return false;
      }
      var n = name.toLowerCase();
      if (typeof names$2[n] !== 'undefined' && projStore[names$2[n]]) {
        return projStore[names$2[n]];
      }
    }

    function start() {
      projs.forEach(add$1);
    }
    var projections = {
      start: start,
      add: add$1,
      get: get$2
    };

    var exports$2 = {};
    exports$2.MERIT = {
      a: 6378137.0,
      rf: 298.257,
      ellipseName: "MERIT 1983"
    };

    exports$2.SGS85 = {
      a: 6378136.0,
      rf: 298.257,
      ellipseName: "Soviet Geodetic System 85"
    };

    exports$2.GRS80 = {
      a: 6378137.0,
      rf: 298.257222101,
      ellipseName: "GRS 1980(IUGG, 1980)"
    };

    exports$2.IAU76 = {
      a: 6378140.0,
      rf: 298.257,
      ellipseName: "IAU 1976"
    };

    exports$2.airy = {
      a: 6377563.396,
      b: 6356256.910,
      ellipseName: "Airy 1830"
    };

    exports$2.APL4 = {
      a: 6378137,
      rf: 298.25,
      ellipseName: "Appl. Physics. 1965"
    };

    exports$2.NWL9D = {
      a: 6378145.0,
      rf: 298.25,
      ellipseName: "Naval Weapons Lab., 1965"
    };

    exports$2.mod_airy = {
      a: 6377340.189,
      b: 6356034.446,
      ellipseName: "Modified Airy"
    };

    exports$2.andrae = {
      a: 6377104.43,
      rf: 300.0,
      ellipseName: "Andrae 1876 (Den., Iclnd.)"
    };

    exports$2.aust_SA = {
      a: 6378160.0,
      rf: 298.25,
      ellipseName: "Australian Natl & S. Amer. 1969"
    };

    exports$2.GRS67 = {
      a: 6378160.0,
      rf: 298.2471674270,
      ellipseName: "GRS 67(IUGG 1967)"
    };

    exports$2.bessel = {
      a: 6377397.155,
      rf: 299.1528128,
      ellipseName: "Bessel 1841"
    };

    exports$2.bess_nam = {
      a: 6377483.865,
      rf: 299.1528128,
      ellipseName: "Bessel 1841 (Namibia)"
    };

    exports$2.clrk66 = {
      a: 6378206.4,
      b: 6356583.8,
      ellipseName: "Clarke 1866"
    };

    exports$2.clrk80 = {
      a: 6378249.145,
      rf: 293.4663,
      ellipseName: "Clarke 1880 mod."
    };

    exports$2.clrk58 = {
      a: 6378293.645208759,
      rf: 294.2606763692654,
      ellipseName: "Clarke 1858"
    };

    exports$2.CPM = {
      a: 6375738.7,
      rf: 334.29,
      ellipseName: "Comm. des Poids et Mesures 1799"
    };

    exports$2.delmbr = {
      a: 6376428.0,
      rf: 311.5,
      ellipseName: "Delambre 1810 (Belgium)"
    };

    exports$2.engelis = {
      a: 6378136.05,
      rf: 298.2566,
      ellipseName: "Engelis 1985"
    };

    exports$2.evrst30 = {
      a: 6377276.345,
      rf: 300.8017,
      ellipseName: "Everest 1830"
    };

    exports$2.evrst48 = {
      a: 6377304.063,
      rf: 300.8017,
      ellipseName: "Everest 1948"
    };

    exports$2.evrst56 = {
      a: 6377301.243,
      rf: 300.8017,
      ellipseName: "Everest 1956"
    };

    exports$2.evrst69 = {
      a: 6377295.664,
      rf: 300.8017,
      ellipseName: "Everest 1969"
    };

    exports$2.evrstSS = {
      a: 6377298.556,
      rf: 300.8017,
      ellipseName: "Everest (Sabah & Sarawak)"
    };

    exports$2.fschr60 = {
      a: 6378166.0,
      rf: 298.3,
      ellipseName: "Fischer (Mercury Datum) 1960"
    };

    exports$2.fschr60m = {
      a: 6378155.0,
      rf: 298.3,
      ellipseName: "Fischer 1960"
    };

    exports$2.fschr68 = {
      a: 6378150.0,
      rf: 298.3,
      ellipseName: "Fischer 1968"
    };

    exports$2.helmert = {
      a: 6378200.0,
      rf: 298.3,
      ellipseName: "Helmert 1906"
    };

    exports$2.hough = {
      a: 6378270.0,
      rf: 297.0,
      ellipseName: "Hough"
    };

    exports$2.intl = {
      a: 6378388.0,
      rf: 297.0,
      ellipseName: "International 1909 (Hayford)"
    };

    exports$2.kaula = {
      a: 6378163.0,
      rf: 298.24,
      ellipseName: "Kaula 1961"
    };

    exports$2.lerch = {
      a: 6378139.0,
      rf: 298.257,
      ellipseName: "Lerch 1979"
    };

    exports$2.mprts = {
      a: 6397300.0,
      rf: 191.0,
      ellipseName: "Maupertius 1738"
    };

    exports$2.new_intl = {
      a: 6378157.5,
      b: 6356772.2,
      ellipseName: "New International 1967"
    };

    exports$2.plessis = {
      a: 6376523.0,
      rf: 6355863.0,
      ellipseName: "Plessis 1817 (France)"
    };

    exports$2.krass = {
      a: 6378245.0,
      rf: 298.3,
      ellipseName: "Krassovsky, 1942"
    };

    exports$2.SEasia = {
      a: 6378155.0,
      b: 6356773.3205,
      ellipseName: "Southeast Asia"
    };

    exports$2.walbeck = {
      a: 6376896.0,
      b: 6355834.8467,
      ellipseName: "Walbeck"
    };

    exports$2.WGS60 = {
      a: 6378165.0,
      rf: 298.3,
      ellipseName: "WGS 60"
    };

    exports$2.WGS66 = {
      a: 6378145.0,
      rf: 298.25,
      ellipseName: "WGS 66"
    };

    exports$2.WGS7 = {
      a: 6378135.0,
      rf: 298.26,
      ellipseName: "WGS 72"
    };

    var WGS84 = exports$2.WGS84 = {
      a: 6378137.0,
      rf: 298.257223563,
      ellipseName: "WGS 84"
    };

    exports$2.sphere = {
      a: 6370997.0,
      b: 6370997.0,
      ellipseName: "Normal Sphere (r=6370997)"
    };

    function eccentricity(a, b, rf, R_A) {
      var a2 = a * a; // used in geocentric
      var b2 = b * b; // used in geocentric
      var es = (a2 - b2) / a2; // e ^ 2
      var e = 0;
      if (R_A) {
        a *= 1 - es * (SIXTH + es * (RA4 + es * RA6));
        a2 = a * a;
        es = 0;
      } else {
        e = Math.sqrt(es); // eccentricity
      }
      var ep2 = (a2 - b2) / b2; // used in geocentric
      return {
        es: es,
        e: e,
        ep2: ep2
      };
    }
    function sphere(a, b, rf, ellps, sphere) {
      if (!a) { // do we have an ellipsoid?
        var ellipse = match(exports$2, ellps);
        if (!ellipse) {
          ellipse = WGS84;
        }
        a = ellipse.a;
        b = ellipse.b;
        rf = ellipse.rf;
      }

      if (rf && !b) {
        b = (1.0 - 1.0 / rf) * a;
      }
      if (rf === 0 || Math.abs(a - b) < EPSLN) {
        sphere = true;
        b = a;
      }
      return {
        a: a,
        b: b,
        rf: rf,
        sphere: sphere
      };
    }

    var exports$3 = {};
    exports$3.wgs84 = {
      towgs84: "0,0,0",
      ellipse: "WGS84",
      datumName: "WGS84"
    };

    exports$3.ch1903 = {
      towgs84: "674.374,15.056,405.346",
      ellipse: "bessel",
      datumName: "swiss"
    };

    exports$3.ggrs87 = {
      towgs84: "-199.87,74.79,246.62",
      ellipse: "GRS80",
      datumName: "Greek_Geodetic_Reference_System_1987"
    };

    exports$3.nad83 = {
      towgs84: "0,0,0",
      ellipse: "GRS80",
      datumName: "North_American_Datum_1983"
    };

    exports$3.nad27 = {
      nadgrids: "@conus,@alaska,@ntv2_0.gsb,@ntv1_can.dat",
      ellipse: "clrk66",
      datumName: "North_American_Datum_1927"
    };

    exports$3.potsdam = {
      towgs84: "606.0,23.0,413.0",
      ellipse: "bessel",
      datumName: "Potsdam Rauenberg 1950 DHDN"
    };

    exports$3.carthage = {
      towgs84: "-263.0,6.0,431.0",
      ellipse: "clark80",
      datumName: "Carthage 1934 Tunisia"
    };

    exports$3.hermannskogel = {
      towgs84: "653.0,-212.0,449.0",
      ellipse: "bessel",
      datumName: "Hermannskogel"
    };

    exports$3.osni52 = {
      towgs84: "482.530,-130.596,564.557,-1.042,-0.214,-0.631,8.15",
      ellipse: "airy",
      datumName: "Irish National"
    };

    exports$3.ire65 = {
      towgs84: "482.530,-130.596,564.557,-1.042,-0.214,-0.631,8.15",
      ellipse: "mod_airy",
      datumName: "Ireland 1965"
    };

    exports$3.rassadiran = {
      towgs84: "-133.63,-157.5,-158.62",
      ellipse: "intl",
      datumName: "Rassadiran"
    };

    exports$3.nzgd49 = {
      towgs84: "59.47,-5.04,187.44,0.47,-0.1,1.024,-4.5993",
      ellipse: "intl",
      datumName: "New Zealand Geodetic Datum 1949"
    };

    exports$3.osgb36 = {
      towgs84: "446.448,-125.157,542.060,0.1502,0.2470,0.8421,-20.4894",
      ellipse: "airy",
      datumName: "Airy 1830"
    };

    exports$3.s_jtsk = {
      towgs84: "589,76,480",
      ellipse: 'bessel',
      datumName: 'S-JTSK (Ferro)'
    };

    exports$3.beduaram = {
      towgs84: '-106,-87,188',
      ellipse: 'clrk80',
      datumName: 'Beduaram'
    };

    exports$3.gunung_segara = {
      towgs84: '-403,684,41',
      ellipse: 'bessel',
      datumName: 'Gunung Segara Jakarta'
    };

    exports$3.rnb72 = {
      towgs84: "106.869,-52.2978,103.724,-0.33657,0.456955,-1.84218,1",
      ellipse: "intl",
      datumName: "Reseau National Belge 1972"
    };

    function datum(datumCode, datum_params, a, b, es, ep2) {
      var out = {};

      if (datumCode === undefined || datumCode === 'none') {
        out.datum_type = PJD_NODATUM;
      } else {
        out.datum_type = PJD_WGS84;
      }

      if (datum_params) {
        out.datum_params = datum_params.map(parseFloat);
        if (out.datum_params[0] !== 0 || out.datum_params[1] !== 0 || out.datum_params[2] !== 0) {
          out.datum_type = PJD_3PARAM;
        }
        if (out.datum_params.length > 3) {
          if (out.datum_params[3] !== 0 || out.datum_params[4] !== 0 || out.datum_params[5] !== 0 || out.datum_params[6] !== 0) {
            out.datum_type = PJD_7PARAM;
            out.datum_params[3] *= SEC_TO_RAD;
            out.datum_params[4] *= SEC_TO_RAD;
            out.datum_params[5] *= SEC_TO_RAD;
            out.datum_params[6] = (out.datum_params[6] / 1000000.0) + 1.0;
          }
        }
      }

      out.a = a; //datum object also uses these values
      out.b = b;
      out.es = es;
      out.ep2 = ep2;
      return out;
    }

    function Projection(srsCode,callback) {
      if (!(this instanceof Projection)) {
        return new Projection(srsCode);
      }
      callback = callback || function(error){
        if(error){
          throw error;
        }
      };
      var json = parse(srsCode);
      if(typeof json !== 'object'){
        callback(srsCode);
        return;
      }
      var ourProj = Projection.projections.get(json.projName);
      if(!ourProj){
        callback(srsCode);
        return;
      }
      if (json.datumCode && json.datumCode !== 'none') {
        var datumDef = match(exports$3, json.datumCode);
        if (datumDef) {
          json.datum_params = datumDef.towgs84 ? datumDef.towgs84.split(',') : null;
          json.ellps = datumDef.ellipse;
          json.datumName = datumDef.datumName ? datumDef.datumName : json.datumCode;
        }
      }
      json.k0 = json.k0 || 1.0;
      json.axis = json.axis || 'enu';
      json.ellps = json.ellps || 'wgs84';
      var sphere_ = sphere(json.a, json.b, json.rf, json.ellps, json.sphere);
      var ecc = eccentricity(sphere_.a, sphere_.b, sphere_.rf, json.R_A);
      var datumObj = json.datum || datum(json.datumCode, json.datum_params, sphere_.a, sphere_.b, ecc.es, ecc.ep2);

      extend$1(this, json); // transfer everything over from the projection because we don't know what we'll need
      extend$1(this, ourProj); // transfer all the methods from the projection

      // copy the 4 things over we calulated in deriveConstants.sphere
      this.a = sphere_.a;
      this.b = sphere_.b;
      this.rf = sphere_.rf;
      this.sphere = sphere_.sphere;

      // copy the 3 things we calculated in deriveConstants.eccentricity
      this.es = ecc.es;
      this.e = ecc.e;
      this.ep2 = ecc.ep2;

      // add in the datum object
      this.datum = datumObj;

      // init the projection
      this.init();

      // legecy callback from back in the day when it went to spatialreference.org
      callback(null, this);

    }
    Projection.projections = projections;
    Projection.projections.start();

    function compareDatums(source, dest) {
      if (source.datum_type !== dest.datum_type) {
        return false; // false, datums are not equal
      } else if (source.a !== dest.a || Math.abs(source.es - dest.es) > 0.000000000050) {
        // the tolerance for es is to ensure that GRS80 and WGS84
        // are considered identical
        return false;
      } else if (source.datum_type === PJD_3PARAM) {
        return (source.datum_params[0] === dest.datum_params[0] && source.datum_params[1] === dest.datum_params[1] && source.datum_params[2] === dest.datum_params[2]);
      } else if (source.datum_type === PJD_7PARAM) {
        return (source.datum_params[0] === dest.datum_params[0] && source.datum_params[1] === dest.datum_params[1] && source.datum_params[2] === dest.datum_params[2] && source.datum_params[3] === dest.datum_params[3] && source.datum_params[4] === dest.datum_params[4] && source.datum_params[5] === dest.datum_params[5] && source.datum_params[6] === dest.datum_params[6]);
      } else {
        return true; // datums are equal
      }
    } // cs_compare_datums()

    /*
     * The function Convert_Geodetic_To_Geocentric converts geodetic coordinates
     * (latitude, longitude, and height) to geocentric coordinates (X, Y, Z),
     * according to the current ellipsoid parameters.
     *
     *    Latitude  : Geodetic latitude in radians                     (input)
     *    Longitude : Geodetic longitude in radians                    (input)
     *    Height    : Geodetic height, in meters                       (input)
     *    X         : Calculated Geocentric X coordinate, in meters    (output)
     *    Y         : Calculated Geocentric Y coordinate, in meters    (output)
     *    Z         : Calculated Geocentric Z coordinate, in meters    (output)
     *
     */
    function geodeticToGeocentric(p, es, a) {
      var Longitude = p.x;
      var Latitude = p.y;
      var Height = p.z ? p.z : 0; //Z value not always supplied

      var Rn; /*  Earth radius at location  */
      var Sin_Lat; /*  Math.sin(Latitude)  */
      var Sin2_Lat; /*  Square of Math.sin(Latitude)  */
      var Cos_Lat; /*  Math.cos(Latitude)  */

      /*
       ** Don't blow up if Latitude is just a little out of the value
       ** range as it may just be a rounding issue.  Also removed longitude
       ** test, it should be wrapped by Math.cos() and Math.sin().  NFW for PROJ.4, Sep/2001.
       */
      if (Latitude < -HALF_PI && Latitude > -1.001 * HALF_PI) {
        Latitude = -HALF_PI;
      } else if (Latitude > HALF_PI && Latitude < 1.001 * HALF_PI) {
        Latitude = HALF_PI;
      } else if (Latitude < -HALF_PI) {
        /* Latitude out of range */
        //..reportError('geocent:lat out of range:' + Latitude);
        return { x: -Infinity, y: -Infinity, z: p.z };
      } else if (Latitude > HALF_PI) {
        /* Latitude out of range */
        return { x: Infinity, y: Infinity, z: p.z };
      }

      if (Longitude > Math.PI) {
        Longitude -= (2 * Math.PI);
      }
      Sin_Lat = Math.sin(Latitude);
      Cos_Lat = Math.cos(Latitude);
      Sin2_Lat = Sin_Lat * Sin_Lat;
      Rn = a / (Math.sqrt(1.0e0 - es * Sin2_Lat));
      return {
        x: (Rn + Height) * Cos_Lat * Math.cos(Longitude),
        y: (Rn + Height) * Cos_Lat * Math.sin(Longitude),
        z: ((Rn * (1 - es)) + Height) * Sin_Lat
      };
    } // cs_geodetic_to_geocentric()

    function geocentricToGeodetic(p, es, a, b) {
      /* local defintions and variables */
      /* end-criterium of loop, accuracy of sin(Latitude) */
      var genau = 1e-12;
      var genau2 = (genau * genau);
      var maxiter = 30;

      var P; /* distance between semi-minor axis and location */
      var RR; /* distance between center and location */
      var CT; /* sin of geocentric latitude */
      var ST; /* cos of geocentric latitude */
      var RX;
      var RK;
      var RN; /* Earth radius at location */
      var CPHI0; /* cos of start or old geodetic latitude in iterations */
      var SPHI0; /* sin of start or old geodetic latitude in iterations */
      var CPHI; /* cos of searched geodetic latitude */
      var SPHI; /* sin of searched geodetic latitude */
      var SDPHI; /* end-criterium: addition-theorem of sin(Latitude(iter)-Latitude(iter-1)) */
      var iter; /* # of continous iteration, max. 30 is always enough (s.a.) */

      var X = p.x;
      var Y = p.y;
      var Z = p.z ? p.z : 0.0; //Z value not always supplied
      var Longitude;
      var Latitude;
      var Height;

      P = Math.sqrt(X * X + Y * Y);
      RR = Math.sqrt(X * X + Y * Y + Z * Z);

      /*      special cases for latitude and longitude */
      if (P / a < genau) {

        /*  special case, if P=0. (X=0., Y=0.) */
        Longitude = 0.0;

        /*  if (X,Y,Z)=(0.,0.,0.) then Height becomes semi-minor axis
         *  of ellipsoid (=center of mass), Latitude becomes PI/2 */
        if (RR / a < genau) {
          Latitude = HALF_PI;
          Height = -b;
          return {
            x: p.x,
            y: p.y,
            z: p.z
          };
        }
      } else {
        /*  ellipsoidal (geodetic) longitude
         *  interval: -PI < Longitude <= +PI */
        Longitude = Math.atan2(Y, X);
      }

      /* --------------------------------------------------------------
       * Following iterative algorithm was developped by
       * "Institut for Erdmessung", University of Hannover, July 1988.
       * Internet: www.ife.uni-hannover.de
       * Iterative computation of CPHI,SPHI and Height.
       * Iteration of CPHI and SPHI to 10**-12 radian resp.
       * 2*10**-7 arcsec.
       * --------------------------------------------------------------
       */
      CT = Z / RR;
      ST = P / RR;
      RX = 1.0 / Math.sqrt(1.0 - es * (2.0 - es) * ST * ST);
      CPHI0 = ST * (1.0 - es) * RX;
      SPHI0 = CT * RX;
      iter = 0;

      /* loop to find sin(Latitude) resp. Latitude
       * until |sin(Latitude(iter)-Latitude(iter-1))| < genau */
      do {
        iter++;
        RN = a / Math.sqrt(1.0 - es * SPHI0 * SPHI0);

        /*  ellipsoidal (geodetic) height */
        Height = P * CPHI0 + Z * SPHI0 - RN * (1.0 - es * SPHI0 * SPHI0);

        RK = es * RN / (RN + Height);
        RX = 1.0 / Math.sqrt(1.0 - RK * (2.0 - RK) * ST * ST);
        CPHI = ST * (1.0 - RK) * RX;
        SPHI = CT * RX;
        SDPHI = SPHI * CPHI0 - CPHI * SPHI0;
        CPHI0 = CPHI;
        SPHI0 = SPHI;
      }
      while (SDPHI * SDPHI > genau2 && iter < maxiter);

      /*      ellipsoidal (geodetic) latitude */
      Latitude = Math.atan(SPHI / Math.abs(CPHI));
      return {
        x: Longitude,
        y: Latitude,
        z: Height
      };
    } // cs_geocentric_to_geodetic()

    /****************************************************************/
    // pj_geocentic_to_wgs84( p )
    //  p = point to transform in geocentric coordinates (x,y,z)


    /** point object, nothing fancy, just allows values to be
        passed back and forth by reference rather than by value.
        Other point classes may be used as long as they have
        x and y properties, which will get modified in the transform method.
    */
    function geocentricToWgs84(p, datum_type, datum_params) {

      if (datum_type === PJD_3PARAM) {
        // if( x[io] === HUGE_VAL )
        //    continue;
        return {
          x: p.x + datum_params[0],
          y: p.y + datum_params[1],
          z: p.z + datum_params[2],
        };
      } else if (datum_type === PJD_7PARAM) {
        var Dx_BF = datum_params[0];
        var Dy_BF = datum_params[1];
        var Dz_BF = datum_params[2];
        var Rx_BF = datum_params[3];
        var Ry_BF = datum_params[4];
        var Rz_BF = datum_params[5];
        var M_BF = datum_params[6];
        // if( x[io] === HUGE_VAL )
        //    continue;
        return {
          x: M_BF * (p.x - Rz_BF * p.y + Ry_BF * p.z) + Dx_BF,
          y: M_BF * (Rz_BF * p.x + p.y - Rx_BF * p.z) + Dy_BF,
          z: M_BF * (-Ry_BF * p.x + Rx_BF * p.y + p.z) + Dz_BF
        };
      }
    } // cs_geocentric_to_wgs84

    /****************************************************************/
    // pj_geocentic_from_wgs84()
    //  coordinate system definition,
    //  point to transform in geocentric coordinates (x,y,z)
    function geocentricFromWgs84(p, datum_type, datum_params) {

      if (datum_type === PJD_3PARAM) {
        //if( x[io] === HUGE_VAL )
        //    continue;
        return {
          x: p.x - datum_params[0],
          y: p.y - datum_params[1],
          z: p.z - datum_params[2],
        };

      } else if (datum_type === PJD_7PARAM) {
        var Dx_BF = datum_params[0];
        var Dy_BF = datum_params[1];
        var Dz_BF = datum_params[2];
        var Rx_BF = datum_params[3];
        var Ry_BF = datum_params[4];
        var Rz_BF = datum_params[5];
        var M_BF = datum_params[6];
        var x_tmp = (p.x - Dx_BF) / M_BF;
        var y_tmp = (p.y - Dy_BF) / M_BF;
        var z_tmp = (p.z - Dz_BF) / M_BF;
        //if( x[io] === HUGE_VAL )
        //    continue;

        return {
          x: x_tmp + Rz_BF * y_tmp - Ry_BF * z_tmp,
          y: -Rz_BF * x_tmp + y_tmp + Rx_BF * z_tmp,
          z: Ry_BF * x_tmp - Rx_BF * y_tmp + z_tmp
        };
      } //cs_geocentric_from_wgs84()
    }

    function checkParams(type) {
      return (type === PJD_3PARAM || type === PJD_7PARAM);
    }

    function datum_transform(source, dest, point) {
      // Short cut if the datums are identical.
      if (compareDatums(source, dest)) {
        return point; // in this case, zero is sucess,
        // whereas cs_compare_datums returns 1 to indicate TRUE
        // confusing, should fix this
      }

      // Explicitly skip datum transform by setting 'datum=none' as parameter for either source or dest
      if (source.datum_type === PJD_NODATUM || dest.datum_type === PJD_NODATUM) {
        return point;
      }

      // If this datum requires grid shifts, then apply it to geodetic coordinates.

      // Do we need to go through geocentric coordinates?
      if (source.es === dest.es && source.a === dest.a && !checkParams(source.datum_type) &&  !checkParams(dest.datum_type)) {
        return point;
      }

      // Convert to geocentric coordinates.
      point = geodeticToGeocentric(point, source.es, source.a);
      // Convert between datums
      if (checkParams(source.datum_type)) {
        point = geocentricToWgs84(point, source.datum_type, source.datum_params);
      }
      if (checkParams(dest.datum_type)) {
        point = geocentricFromWgs84(point, dest.datum_type, dest.datum_params);
      }
      return geocentricToGeodetic(point, dest.es, dest.a, dest.b);

    }

    function adjust_axis(crs, denorm, point) {
      var xin = point.x,
        yin = point.y,
        zin = point.z || 0.0;
      var v, t, i;
      var out = {};
      for (i = 0; i < 3; i++) {
        if (denorm && i === 2 && point.z === undefined) {
          continue;
        }
        if (i === 0) {
          v = xin;
          t = 'x';
        }
        else if (i === 1) {
          v = yin;
          t = 'y';
        }
        else {
          v = zin;
          t = 'z';
        }
        switch (crs.axis[i]) {
        case 'e':
          out[t] = v;
          break;
        case 'w':
          out[t] = -v;
          break;
        case 'n':
          out[t] = v;
          break;
        case 's':
          out[t] = -v;
          break;
        case 'u':
          if (point[t] !== undefined) {
            out.z = v;
          }
          break;
        case 'd':
          if (point[t] !== undefined) {
            out.z = -v;
          }
          break;
        default:
          //console.log("ERROR: unknow axis ("+crs.axis[i]+") - check definition of "+crs.projName);
          return null;
        }
      }
      return out;
    }

    function common (array){
      var out = {
        x: array[0],
        y: array[1]
      };
      if (array.length>2) {
        out.z = array[2];
      }
      if (array.length>3) {
        out.m = array[3];
      }
      return out;
    }

    function checkSanity (point) {
      checkCoord(point.x);
      checkCoord(point.y);
    }
    function checkCoord(num) {
      if (typeof Number.isFinite === 'function') {
        if (Number.isFinite(num)) {
          return;
        }
        throw new TypeError('coordinates must be finite numbers');
      }
      if (typeof num !== 'number' || num !== num || !isFinite(num)) {
        throw new TypeError('coordinates must be finite numbers');
      }
    }

    function checkNotWGS(source, dest) {
      return ((source.datum.datum_type === PJD_3PARAM || source.datum.datum_type === PJD_7PARAM) && dest.datumCode !== 'WGS84') || ((dest.datum.datum_type === PJD_3PARAM || dest.datum.datum_type === PJD_7PARAM) && source.datumCode !== 'WGS84');
    }

    function transform(source, dest, point) {
      var wgs84;
      if (Array.isArray(point)) {
        point = common(point);
      }
      checkSanity(point);
      // Workaround for datum shifts towgs84, if either source or destination projection is not wgs84
      if (source.datum && dest.datum && checkNotWGS(source, dest)) {
        wgs84 = new Projection('WGS84');
        point = transform(source, wgs84, point);
        source = wgs84;
      }
      // DGR, 2010/11/12
      if (source.axis !== 'enu') {
        point = adjust_axis(source, false, point);
      }
      // Transform source points to long/lat, if they aren't already.
      if (source.projName === 'longlat') {
        point = {
          x: point.x * D2R,
          y: point.y * D2R
        };
      }
      else {
        if (source.to_meter) {
          point = {
            x: point.x * source.to_meter,
            y: point.y * source.to_meter
          };
        }
        point = source.inverse(point); // Convert Cartesian to longlat
      }
      // Adjust for the prime meridian if necessary
      if (source.from_greenwich) {
        point.x += source.from_greenwich;
      }

      // Convert datums if needed, and if possible.
      point = datum_transform(source.datum, dest.datum, point);

      // Adjust for the prime meridian if necessary
      if (dest.from_greenwich) {
        point = {
          x: point.x - dest.from_greenwich,
          y: point.y
        };
      }

      if (dest.projName === 'longlat') {
        // convert radians to decimal degrees
        point = {
          x: point.x * R2D,
          y: point.y * R2D
        };
      } else { // else project
        point = dest.forward(point);
        if (dest.to_meter) {
          point = {
            x: point.x / dest.to_meter,
            y: point.y / dest.to_meter
          };
        }
      }

      // DGR, 2010/11/12
      if (dest.axis !== 'enu') {
        return adjust_axis(dest, true, point);
      }

      return point;
    }

    var wgs84 = Projection('WGS84');

    function transformer$1(from, to, coords) {
      var transformedArray, out, keys;
      if (Array.isArray(coords)) {
        transformedArray = transform(from, to, coords);
        if (coords.length === 3) {
          return [transformedArray.x, transformedArray.y, transformedArray.z];
        }
        else {
          return [transformedArray.x, transformedArray.y];
        }
      }
      else {
        out = transform(from, to, coords);
        keys = Object.keys(coords);
        if (keys.length === 2) {
          return out;
        }
        keys.forEach(function (key) {
          if (key === 'x' || key === 'y') {
            return;
          }
          out[key] = coords[key];
        });
        return out;
      }
    }

    function checkProj(item) {
      if (item instanceof Projection) {
        return item;
      }
      if (item.oProj) {
        return item.oProj;
      }
      return Projection(item);
    }
    function proj4(fromProj, toProj, coord) {
      fromProj = checkProj(fromProj);
      var single = false;
      var obj;
      if (typeof toProj === 'undefined') {
        toProj = fromProj;
        fromProj = wgs84;
        single = true;
      }
      else if (typeof toProj.x !== 'undefined' || Array.isArray(toProj)) {
        coord = toProj;
        toProj = fromProj;
        fromProj = wgs84;
        single = true;
      }
      toProj = checkProj(toProj);
      if (coord) {
        return transformer$1(fromProj, toProj, coord);
      }
      else {
        obj = {
          forward: function(coords) {
            return transformer$1(fromProj, toProj, coords);
          },
          inverse: function(coords) {
            return transformer$1(toProj, fromProj, coords);
          }
        };
        if (single) {
          obj.oProj = toProj;
        }
        return obj;
      }
    }

    /**
     * UTM zones are grouped, and assigned to one of a group of 6
     * sets.
     *
     * {int} @private
     */
    var NUM_100K_SETS = 6;

    /**
     * The column letters (for easting) of the lower left value, per
     * set.
     *
     * {string} @private
     */
    var SET_ORIGIN_COLUMN_LETTERS = 'AJSAJS';

    /**
     * The row letters (for northing) of the lower left value, per
     * set.
     *
     * {string} @private
     */
    var SET_ORIGIN_ROW_LETTERS = 'AFAFAF';

    var A$1 = 65; // A
    var I = 73; // I
    var O = 79; // O
    var V = 86; // V
    var Z = 90; // Z
    var mgrs = {
      forward: forward$1,
      inverse: inverse$1,
      toPoint: toPoint
    };
    /**
     * Conversion of lat/lon to MGRS.
     *
     * @param {object} ll Object literal with lat and lon properties on a
     *     WGS84 ellipsoid.
     * @param {int} accuracy Accuracy in digits (5 for 1 m, 4 for 10 m, 3 for
     *      100 m, 2 for 1000 m or 1 for 10000 m). Optional, default is 5.
     * @return {string} the MGRS string for the given location and accuracy.
     */
    function forward$1(ll, accuracy) {
      accuracy = accuracy || 5; // default accuracy 1m
      return encode(LLtoUTM({
        lat: ll[1],
        lon: ll[0]
      }), accuracy);
    }
    /**
     * Conversion of MGRS to lat/lon.
     *
     * @param {string} mgrs MGRS string.
     * @return {array} An array with left (longitude), bottom (latitude), right
     *     (longitude) and top (latitude) values in WGS84, representing the
     *     bounding box for the provided MGRS reference.
     */
    function inverse$1(mgrs) {
      var bbox = UTMtoLL(decode(mgrs.toUpperCase()));
      if (bbox.lat && bbox.lon) {
        return [bbox.lon, bbox.lat, bbox.lon, bbox.lat];
      }
      return [bbox.left, bbox.bottom, bbox.right, bbox.top];
    }
    function toPoint(mgrs) {
      var bbox = UTMtoLL(decode(mgrs.toUpperCase()));
      if (bbox.lat && bbox.lon) {
        return [bbox.lon, bbox.lat];
      }
      return [(bbox.left + bbox.right) / 2, (bbox.top + bbox.bottom) / 2];
    }/**
     * Conversion from degrees to radians.
     *
     * @private
     * @param {number} deg the angle in degrees.
     * @return {number} the angle in radians.
     */
    function degToRad(deg) {
      return (deg * (Math.PI / 180.0));
    }

    /**
     * Conversion from radians to degrees.
     *
     * @private
     * @param {number} rad the angle in radians.
     * @return {number} the angle in degrees.
     */
    function radToDeg(rad) {
      return (180.0 * (rad / Math.PI));
    }

    /**
     * Converts a set of Longitude and Latitude co-ordinates to UTM
     * using the WGS84 ellipsoid.
     *
     * @private
     * @param {object} ll Object literal with lat and lon properties
     *     representing the WGS84 coordinate to be converted.
     * @return {object} Object literal containing the UTM value with easting,
     *     northing, zoneNumber and zoneLetter properties, and an optional
     *     accuracy property in digits. Returns null if the conversion failed.
     */
    function LLtoUTM(ll) {
      var Lat = ll.lat;
      var Long = ll.lon;
      var a = 6378137.0; //ellip.radius;
      var eccSquared = 0.00669438; //ellip.eccsq;
      var k0 = 0.9996;
      var LongOrigin;
      var eccPrimeSquared;
      var N, T, C, A, M;
      var LatRad = degToRad(Lat);
      var LongRad = degToRad(Long);
      var LongOriginRad;
      var ZoneNumber;
      // (int)
      ZoneNumber = Math.floor((Long + 180) / 6) + 1;

      //Make sure the longitude 180.00 is in Zone 60
      if (Long === 180) {
        ZoneNumber = 60;
      }

      // Special zone for Norway
      if (Lat >= 56.0 && Lat < 64.0 && Long >= 3.0 && Long < 12.0) {
        ZoneNumber = 32;
      }

      // Special zones for Svalbard
      if (Lat >= 72.0 && Lat < 84.0) {
        if (Long >= 0.0 && Long < 9.0) {
          ZoneNumber = 31;
        }
        else if (Long >= 9.0 && Long < 21.0) {
          ZoneNumber = 33;
        }
        else if (Long >= 21.0 && Long < 33.0) {
          ZoneNumber = 35;
        }
        else if (Long >= 33.0 && Long < 42.0) {
          ZoneNumber = 37;
        }
      }

      LongOrigin = (ZoneNumber - 1) * 6 - 180 + 3; //+3 puts origin
      // in middle of
      // zone
      LongOriginRad = degToRad(LongOrigin);

      eccPrimeSquared = (eccSquared) / (1 - eccSquared);

      N = a / Math.sqrt(1 - eccSquared * Math.sin(LatRad) * Math.sin(LatRad));
      T = Math.tan(LatRad) * Math.tan(LatRad);
      C = eccPrimeSquared * Math.cos(LatRad) * Math.cos(LatRad);
      A = Math.cos(LatRad) * (LongRad - LongOriginRad);

      M = a * ((1 - eccSquared / 4 - 3 * eccSquared * eccSquared / 64 - 5 * eccSquared * eccSquared * eccSquared / 256) * LatRad - (3 * eccSquared / 8 + 3 * eccSquared * eccSquared / 32 + 45 * eccSquared * eccSquared * eccSquared / 1024) * Math.sin(2 * LatRad) + (15 * eccSquared * eccSquared / 256 + 45 * eccSquared * eccSquared * eccSquared / 1024) * Math.sin(4 * LatRad) - (35 * eccSquared * eccSquared * eccSquared / 3072) * Math.sin(6 * LatRad));

      var UTMEasting = (k0 * N * (A + (1 - T + C) * A * A * A / 6.0 + (5 - 18 * T + T * T + 72 * C - 58 * eccPrimeSquared) * A * A * A * A * A / 120.0) + 500000.0);

      var UTMNorthing = (k0 * (M + N * Math.tan(LatRad) * (A * A / 2 + (5 - T + 9 * C + 4 * C * C) * A * A * A * A / 24.0 + (61 - 58 * T + T * T + 600 * C - 330 * eccPrimeSquared) * A * A * A * A * A * A / 720.0)));
      if (Lat < 0.0) {
        UTMNorthing += 10000000.0; //10000000 meter offset for
        // southern hemisphere
      }

      return {
        northing: Math.round(UTMNorthing),
        easting: Math.round(UTMEasting),
        zoneNumber: ZoneNumber,
        zoneLetter: getLetterDesignator(Lat)
      };
    }

    /**
     * Converts UTM coords to lat/long, using the WGS84 ellipsoid. This is a convenience
     * class where the Zone can be specified as a single string eg."60N" which
     * is then broken down into the ZoneNumber and ZoneLetter.
     *
     * @private
     * @param {object} utm An object literal with northing, easting, zoneNumber
     *     and zoneLetter properties. If an optional accuracy property is
     *     provided (in meters), a bounding box will be returned instead of
     *     latitude and longitude.
     * @return {object} An object literal containing either lat and lon values
     *     (if no accuracy was provided), or top, right, bottom and left values
     *     for the bounding box calculated according to the provided accuracy.
     *     Returns null if the conversion failed.
     */
    function UTMtoLL(utm) {

      var UTMNorthing = utm.northing;
      var UTMEasting = utm.easting;
      var zoneLetter = utm.zoneLetter;
      var zoneNumber = utm.zoneNumber;
      // check the ZoneNummber is valid
      if (zoneNumber < 0 || zoneNumber > 60) {
        return null;
      }

      var k0 = 0.9996;
      var a = 6378137.0; //ellip.radius;
      var eccSquared = 0.00669438; //ellip.eccsq;
      var eccPrimeSquared;
      var e1 = (1 - Math.sqrt(1 - eccSquared)) / (1 + Math.sqrt(1 - eccSquared));
      var N1, T1, C1, R1, D, M;
      var LongOrigin;
      var mu, phi1Rad;

      // remove 500,000 meter offset for longitude
      var x = UTMEasting - 500000.0;
      var y = UTMNorthing;

      // We must know somehow if we are in the Northern or Southern
      // hemisphere, this is the only time we use the letter So even
      // if the Zone letter isn't exactly correct it should indicate
      // the hemisphere correctly
      if (zoneLetter < 'N') {
        y -= 10000000.0; // remove 10,000,000 meter offset used
        // for southern hemisphere
      }

      // There are 60 zones with zone 1 being at West -180 to -174
      LongOrigin = (zoneNumber - 1) * 6 - 180 + 3; // +3 puts origin
      // in middle of
      // zone

      eccPrimeSquared = (eccSquared) / (1 - eccSquared);

      M = y / k0;
      mu = M / (a * (1 - eccSquared / 4 - 3 * eccSquared * eccSquared / 64 - 5 * eccSquared * eccSquared * eccSquared / 256));

      phi1Rad = mu + (3 * e1 / 2 - 27 * e1 * e1 * e1 / 32) * Math.sin(2 * mu) + (21 * e1 * e1 / 16 - 55 * e1 * e1 * e1 * e1 / 32) * Math.sin(4 * mu) + (151 * e1 * e1 * e1 / 96) * Math.sin(6 * mu);
      // double phi1 = ProjMath.radToDeg(phi1Rad);

      N1 = a / Math.sqrt(1 - eccSquared * Math.sin(phi1Rad) * Math.sin(phi1Rad));
      T1 = Math.tan(phi1Rad) * Math.tan(phi1Rad);
      C1 = eccPrimeSquared * Math.cos(phi1Rad) * Math.cos(phi1Rad);
      R1 = a * (1 - eccSquared) / Math.pow(1 - eccSquared * Math.sin(phi1Rad) * Math.sin(phi1Rad), 1.5);
      D = x / (N1 * k0);

      var lat = phi1Rad - (N1 * Math.tan(phi1Rad) / R1) * (D * D / 2 - (5 + 3 * T1 + 10 * C1 - 4 * C1 * C1 - 9 * eccPrimeSquared) * D * D * D * D / 24 + (61 + 90 * T1 + 298 * C1 + 45 * T1 * T1 - 252 * eccPrimeSquared - 3 * C1 * C1) * D * D * D * D * D * D / 720);
      lat = radToDeg(lat);

      var lon = (D - (1 + 2 * T1 + C1) * D * D * D / 6 + (5 - 2 * C1 + 28 * T1 - 3 * C1 * C1 + 8 * eccPrimeSquared + 24 * T1 * T1) * D * D * D * D * D / 120) / Math.cos(phi1Rad);
      lon = LongOrigin + radToDeg(lon);

      var result;
      if (utm.accuracy) {
        var topRight = UTMtoLL({
          northing: utm.northing + utm.accuracy,
          easting: utm.easting + utm.accuracy,
          zoneLetter: utm.zoneLetter,
          zoneNumber: utm.zoneNumber
        });
        result = {
          top: topRight.lat,
          right: topRight.lon,
          bottom: lat,
          left: lon
        };
      }
      else {
        result = {
          lat: lat,
          lon: lon
        };
      }
      return result;
    }

    /**
     * Calculates the MGRS letter designator for the given latitude.
     *
     * @private
     * @param {number} lat The latitude in WGS84 to get the letter designator
     *     for.
     * @return {char} The letter designator.
     */
    function getLetterDesignator(lat) {
      //This is here as an error flag to show that the Latitude is
      //outside MGRS limits
      var LetterDesignator = 'Z';

      if ((84 >= lat) && (lat >= 72)) {
        LetterDesignator = 'X';
      }
      else if ((72 > lat) && (lat >= 64)) {
        LetterDesignator = 'W';
      }
      else if ((64 > lat) && (lat >= 56)) {
        LetterDesignator = 'V';
      }
      else if ((56 > lat) && (lat >= 48)) {
        LetterDesignator = 'U';
      }
      else if ((48 > lat) && (lat >= 40)) {
        LetterDesignator = 'T';
      }
      else if ((40 > lat) && (lat >= 32)) {
        LetterDesignator = 'S';
      }
      else if ((32 > lat) && (lat >= 24)) {
        LetterDesignator = 'R';
      }
      else if ((24 > lat) && (lat >= 16)) {
        LetterDesignator = 'Q';
      }
      else if ((16 > lat) && (lat >= 8)) {
        LetterDesignator = 'P';
      }
      else if ((8 > lat) && (lat >= 0)) {
        LetterDesignator = 'N';
      }
      else if ((0 > lat) && (lat >= -8)) {
        LetterDesignator = 'M';
      }
      else if ((-8 > lat) && (lat >= -16)) {
        LetterDesignator = 'L';
      }
      else if ((-16 > lat) && (lat >= -24)) {
        LetterDesignator = 'K';
      }
      else if ((-24 > lat) && (lat >= -32)) {
        LetterDesignator = 'J';
      }
      else if ((-32 > lat) && (lat >= -40)) {
        LetterDesignator = 'H';
      }
      else if ((-40 > lat) && (lat >= -48)) {
        LetterDesignator = 'G';
      }
      else if ((-48 > lat) && (lat >= -56)) {
        LetterDesignator = 'F';
      }
      else if ((-56 > lat) && (lat >= -64)) {
        LetterDesignator = 'E';
      }
      else if ((-64 > lat) && (lat >= -72)) {
        LetterDesignator = 'D';
      }
      else if ((-72 > lat) && (lat >= -80)) {
        LetterDesignator = 'C';
      }
      return LetterDesignator;
    }

    /**
     * Encodes a UTM location as MGRS string.
     *
     * @private
     * @param {object} utm An object literal with easting, northing,
     *     zoneLetter, zoneNumber
     * @param {number} accuracy Accuracy in digits (1-5).
     * @return {string} MGRS string for the given UTM location.
     */
    function encode(utm, accuracy) {
      // prepend with leading zeroes
      var seasting = "00000" + utm.easting,
        snorthing = "00000" + utm.northing;

      return utm.zoneNumber + utm.zoneLetter + get100kID(utm.easting, utm.northing, utm.zoneNumber) + seasting.substr(seasting.length - 5, accuracy) + snorthing.substr(snorthing.length - 5, accuracy);
    }

    /**
     * Get the two letter 100k designator for a given UTM easting,
     * northing and zone number value.
     *
     * @private
     * @param {number} easting
     * @param {number} northing
     * @param {number} zoneNumber
     * @return the two letter 100k designator for the given UTM location.
     */
    function get100kID(easting, northing, zoneNumber) {
      var setParm = get100kSetForZone(zoneNumber);
      var setColumn = Math.floor(easting / 100000);
      var setRow = Math.floor(northing / 100000) % 20;
      return getLetter100kID(setColumn, setRow, setParm);
    }

    /**
     * Given a UTM zone number, figure out the MGRS 100K set it is in.
     *
     * @private
     * @param {number} i An UTM zone number.
     * @return {number} the 100k set the UTM zone is in.
     */
    function get100kSetForZone(i) {
      var setParm = i % NUM_100K_SETS;
      if (setParm === 0) {
        setParm = NUM_100K_SETS;
      }

      return setParm;
    }

    /**
     * Get the two-letter MGRS 100k designator given information
     * translated from the UTM northing, easting and zone number.
     *
     * @private
     * @param {number} column the column index as it relates to the MGRS
     *        100k set spreadsheet, created from the UTM easting.
     *        Values are 1-8.
     * @param {number} row the row index as it relates to the MGRS 100k set
     *        spreadsheet, created from the UTM northing value. Values
     *        are from 0-19.
     * @param {number} parm the set block, as it relates to the MGRS 100k set
     *        spreadsheet, created from the UTM zone. Values are from
     *        1-60.
     * @return two letter MGRS 100k code.
     */
    function getLetter100kID(column, row, parm) {
      // colOrigin and rowOrigin are the letters at the origin of the set
      var index = parm - 1;
      var colOrigin = SET_ORIGIN_COLUMN_LETTERS.charCodeAt(index);
      var rowOrigin = SET_ORIGIN_ROW_LETTERS.charCodeAt(index);

      // colInt and rowInt are the letters to build to return
      var colInt = colOrigin + column - 1;
      var rowInt = rowOrigin + row;
      var rollover = false;

      if (colInt > Z) {
        colInt = colInt - Z + A$1 - 1;
        rollover = true;
      }

      if (colInt === I || (colOrigin < I && colInt > I) || ((colInt > I || colOrigin < I) && rollover)) {
        colInt++;
      }

      if (colInt === O || (colOrigin < O && colInt > O) || ((colInt > O || colOrigin < O) && rollover)) {
        colInt++;

        if (colInt === I) {
          colInt++;
        }
      }

      if (colInt > Z) {
        colInt = colInt - Z + A$1 - 1;
      }

      if (rowInt > V) {
        rowInt = rowInt - V + A$1 - 1;
        rollover = true;
      }
      else {
        rollover = false;
      }

      if (((rowInt === I) || ((rowOrigin < I) && (rowInt > I))) || (((rowInt > I) || (rowOrigin < I)) && rollover)) {
        rowInt++;
      }

      if (((rowInt === O) || ((rowOrigin < O) && (rowInt > O))) || (((rowInt > O) || (rowOrigin < O)) && rollover)) {
        rowInt++;

        if (rowInt === I) {
          rowInt++;
        }
      }

      if (rowInt > V) {
        rowInt = rowInt - V + A$1 - 1;
      }

      var twoLetter = String.fromCharCode(colInt) + String.fromCharCode(rowInt);
      return twoLetter;
    }

    /**
     * Decode the UTM parameters from a MGRS string.
     *
     * @private
     * @param {string} mgrsString an UPPERCASE coordinate string is expected.
     * @return {object} An object literal with easting, northing, zoneLetter,
     *     zoneNumber and accuracy (in meters) properties.
     */
    function decode(mgrsString) {

      if (mgrsString && mgrsString.length === 0) {
        throw ("MGRSPoint coverting from nothing");
      }

      var length = mgrsString.length;

      var hunK = null;
      var sb = "";
      var testChar;
      var i = 0;

      // get Zone number
      while (!(/[A-Z]/).test(testChar = mgrsString.charAt(i))) {
        if (i >= 2) {
          throw ("MGRSPoint bad conversion from: " + mgrsString);
        }
        sb += testChar;
        i++;
      }

      var zoneNumber = parseInt(sb, 10);

      if (i === 0 || i + 3 > length) {
        // A good MGRS string has to be 4-5 digits long,
        // ##AAA/#AAA at least.
        throw ("MGRSPoint bad conversion from: " + mgrsString);
      }

      var zoneLetter = mgrsString.charAt(i++);

      // Should we check the zone letter here? Why not.
      if (zoneLetter <= 'A' || zoneLetter === 'B' || zoneLetter === 'Y' || zoneLetter >= 'Z' || zoneLetter === 'I' || zoneLetter === 'O') {
        throw ("MGRSPoint zone letter " + zoneLetter + " not handled: " + mgrsString);
      }

      hunK = mgrsString.substring(i, i += 2);

      var set = get100kSetForZone(zoneNumber);

      var east100k = getEastingFromChar(hunK.charAt(0), set);
      var north100k = getNorthingFromChar(hunK.charAt(1), set);

      // We have a bug where the northing may be 2000000 too low.
      // How
      // do we know when to roll over?

      while (north100k < getMinNorthing(zoneLetter)) {
        north100k += 2000000;
      }

      // calculate the char index for easting/northing separator
      var remainder = length - i;

      if (remainder % 2 !== 0) {
        throw ("MGRSPoint has to have an even number \nof digits after the zone letter and two 100km letters - front \nhalf for easting meters, second half for \nnorthing meters" + mgrsString);
      }

      var sep = remainder / 2;

      var sepEasting = 0.0;
      var sepNorthing = 0.0;
      var accuracyBonus, sepEastingString, sepNorthingString, easting, northing;
      if (sep > 0) {
        accuracyBonus = 100000.0 / Math.pow(10, sep);
        sepEastingString = mgrsString.substring(i, i + sep);
        sepEasting = parseFloat(sepEastingString) * accuracyBonus;
        sepNorthingString = mgrsString.substring(i + sep);
        sepNorthing = parseFloat(sepNorthingString) * accuracyBonus;
      }

      easting = sepEasting + east100k;
      northing = sepNorthing + north100k;

      return {
        easting: easting,
        northing: northing,
        zoneLetter: zoneLetter,
        zoneNumber: zoneNumber,
        accuracy: accuracyBonus
      };
    }

    /**
     * Given the first letter from a two-letter MGRS 100k zone, and given the
     * MGRS table set for the zone number, figure out the easting value that
     * should be added to the other, secondary easting value.
     *
     * @private
     * @param {char} e The first letter from a two-letter MGRS 100´k zone.
     * @param {number} set The MGRS table set for the zone number.
     * @return {number} The easting value for the given letter and set.
     */
    function getEastingFromChar(e, set) {
      // colOrigin is the letter at the origin of the set for the
      // column
      var curCol = SET_ORIGIN_COLUMN_LETTERS.charCodeAt(set - 1);
      var eastingValue = 100000.0;
      var rewindMarker = false;

      while (curCol !== e.charCodeAt(0)) {
        curCol++;
        if (curCol === I) {
          curCol++;
        }
        if (curCol === O) {
          curCol++;
        }
        if (curCol > Z) {
          if (rewindMarker) {
            throw ("Bad character: " + e);
          }
          curCol = A$1;
          rewindMarker = true;
        }
        eastingValue += 100000.0;
      }

      return eastingValue;
    }

    /**
     * Given the second letter from a two-letter MGRS 100k zone, and given the
     * MGRS table set for the zone number, figure out the northing value that
     * should be added to the other, secondary northing value. You have to
     * remember that Northings are determined from the equator, and the vertical
     * cycle of letters mean a 2000000 additional northing meters. This happens
     * approx. every 18 degrees of latitude. This method does *NOT* count any
     * additional northings. You have to figure out how many 2000000 meters need
     * to be added for the zone letter of the MGRS coordinate.
     *
     * @private
     * @param {char} n Second letter of the MGRS 100k zone
     * @param {number} set The MGRS table set number, which is dependent on the
     *     UTM zone number.
     * @return {number} The northing value for the given letter and set.
     */
    function getNorthingFromChar(n, set) {

      if (n > 'V') {
        throw ("MGRSPoint given invalid Northing " + n);
      }

      // rowOrigin is the letter at the origin of the set for the
      // column
      var curRow = SET_ORIGIN_ROW_LETTERS.charCodeAt(set - 1);
      var northingValue = 0.0;
      var rewindMarker = false;

      while (curRow !== n.charCodeAt(0)) {
        curRow++;
        if (curRow === I) {
          curRow++;
        }
        if (curRow === O) {
          curRow++;
        }
        // fixing a bug making whole application hang in this loop
        // when 'n' is a wrong character
        if (curRow > V) {
          if (rewindMarker) { // making sure that this loop ends
            throw ("Bad character: " + n);
          }
          curRow = A$1;
          rewindMarker = true;
        }
        northingValue += 100000.0;
      }

      return northingValue;
    }

    /**
     * The function getMinNorthing returns the minimum northing value of a MGRS
     * zone.
     *
     * Ported from Geotrans' c Lattitude_Band_Value structure table.
     *
     * @private
     * @param {char} zoneLetter The MGRS zone to get the min northing for.
     * @return {number}
     */
    function getMinNorthing(zoneLetter) {
      var northing;
      switch (zoneLetter) {
      case 'C':
        northing = 1100000.0;
        break;
      case 'D':
        northing = 2000000.0;
        break;
      case 'E':
        northing = 2800000.0;
        break;
      case 'F':
        northing = 3700000.0;
        break;
      case 'G':
        northing = 4600000.0;
        break;
      case 'H':
        northing = 5500000.0;
        break;
      case 'J':
        northing = 6400000.0;
        break;
      case 'K':
        northing = 7300000.0;
        break;
      case 'L':
        northing = 8200000.0;
        break;
      case 'M':
        northing = 9100000.0;
        break;
      case 'N':
        northing = 0.0;
        break;
      case 'P':
        northing = 800000.0;
        break;
      case 'Q':
        northing = 1700000.0;
        break;
      case 'R':
        northing = 2600000.0;
        break;
      case 'S':
        northing = 3500000.0;
        break;
      case 'T':
        northing = 4400000.0;
        break;
      case 'U':
        northing = 5300000.0;
        break;
      case 'V':
        northing = 6200000.0;
        break;
      case 'W':
        northing = 7000000.0;
        break;
      case 'X':
        northing = 7900000.0;
        break;
      default:
        northing = -1.0;
      }
      if (northing >= 0.0) {
        return northing;
      }
      else {
        throw ("Invalid zone letter: " + zoneLetter);
      }

    }

    function Point$1(x, y, z) {
      if (!(this instanceof Point$1)) {
        return new Point$1(x, y, z);
      }
      if (Array.isArray(x)) {
        this.x = x[0];
        this.y = x[1];
        this.z = x[2] || 0.0;
      } else if(typeof x === 'object') {
        this.x = x.x;
        this.y = x.y;
        this.z = x.z || 0.0;
      } else if (typeof x === 'string' && typeof y === 'undefined') {
        var coords = x.split(',');
        this.x = parseFloat(coords[0], 10);
        this.y = parseFloat(coords[1], 10);
        this.z = parseFloat(coords[2], 10) || 0.0;
      } else {
        this.x = x;
        this.y = y;
        this.z = z || 0.0;
      }
      console.warn('proj4.Point will be removed in version 3, use proj4.toPoint');
    }

    Point$1.fromMGRS = function(mgrsStr) {
      return new Point$1(toPoint(mgrsStr));
    };
    Point$1.prototype.toMGRS = function(accuracy) {
      return forward$1([this.x, this.y], accuracy);
    };

    var version$1="2.5.0";

    var C00 = 1;
    var C02 = 0.25;
    var C04 = 0.046875;
    var C06 = 0.01953125;
    var C08 = 0.01068115234375;
    var C22 = 0.75;
    var C44 = 0.46875;
    var C46 = 0.01302083333333333333;
    var C48 = 0.00712076822916666666;
    var C66 = 0.36458333333333333333;
    var C68 = 0.00569661458333333333;
    var C88 = 0.3076171875;

    function pj_enfn(es) {
      var en = [];
      en[0] = C00 - es * (C02 + es * (C04 + es * (C06 + es * C08)));
      en[1] = es * (C22 - es * (C04 + es * (C06 + es * C08)));
      var t = es * es;
      en[2] = t * (C44 - es * (C46 + es * C48));
      t *= es;
      en[3] = t * (C66 - es * C68);
      en[4] = t * es * C88;
      return en;
    }

    function pj_mlfn(phi, sphi, cphi, en) {
      cphi *= sphi;
      sphi *= sphi;
      return (en[0] * phi - cphi * (en[1] + sphi * (en[2] + sphi * (en[3] + sphi * en[4]))));
    }

    var MAX_ITER = 20;

    function pj_inv_mlfn(arg, es, en) {
      var k = 1 / (1 - es);
      var phi = arg;
      for (var i = MAX_ITER; i; --i) { /* rarely goes over 2 iterations */
        var s = Math.sin(phi);
        var t = 1 - es * s * s;
        //t = this.pj_mlfn(phi, s, Math.cos(phi), en) - arg;
        //phi -= t * (t * Math.sqrt(t)) * k;
        t = (pj_mlfn(phi, s, Math.cos(phi), en) - arg) * (t * Math.sqrt(t)) * k;
        phi -= t;
        if (Math.abs(t) < EPSLN) {
          return phi;
        }
      }
      //..reportError("cass:pj_inv_mlfn: Convergence error");
      return phi;
    }

    // Heavily based on this tmerc projection implementation

    function init$7() {
      this.x0 = this.x0 !== undefined ? this.x0 : 0;
      this.y0 = this.y0 !== undefined ? this.y0 : 0;
      this.long0 = this.long0 !== undefined ? this.long0 : 0;
      this.lat0 = this.lat0 !== undefined ? this.lat0 : 0;

      if (this.es) {
        this.en = pj_enfn(this.es);
        this.ml0 = pj_mlfn(this.lat0, Math.sin(this.lat0), Math.cos(this.lat0), this.en);
      }
    }

    /**
        Transverse Mercator Forward  - long/lat to x/y
        long/lat in radians
      */
    function forward$2(p) {
      var lon = p.x;
      var lat = p.y;

      var delta_lon = adjust_lon(lon - this.long0);
      var con;
      var x, y;
      var sin_phi = Math.sin(lat);
      var cos_phi = Math.cos(lat);

      if (!this.es) {
        var b = cos_phi * Math.sin(delta_lon);

        if ((Math.abs(Math.abs(b) - 1)) < EPSLN) {
          return (93);
        }
        else {
          x = 0.5 * this.a * this.k0 * Math.log((1 + b) / (1 - b)) + this.x0;
          y = cos_phi * Math.cos(delta_lon) / Math.sqrt(1 - Math.pow(b, 2));
          b = Math.abs(y);

          if (b >= 1) {
            if ((b - 1) > EPSLN) {
              return (93);
            }
            else {
              y = 0;
            }
          }
          else {
            y = Math.acos(y);
          }

          if (lat < 0) {
            y = -y;
          }

          y = this.a * this.k0 * (y - this.lat0) + this.y0;
        }
      }
      else {
        var al = cos_phi * delta_lon;
        var als = Math.pow(al, 2);
        var c = this.ep2 * Math.pow(cos_phi, 2);
        var cs = Math.pow(c, 2);
        var tq = Math.abs(cos_phi) > EPSLN ? Math.tan(lat) : 0;
        var t = Math.pow(tq, 2);
        var ts = Math.pow(t, 2);
        con = 1 - this.es * Math.pow(sin_phi, 2);
        al = al / Math.sqrt(con);
        var ml = pj_mlfn(lat, sin_phi, cos_phi, this.en);

        x = this.a * (this.k0 * al * (1 +
          als / 6 * (1 - t + c +
          als / 20 * (5 - 18 * t + ts + 14 * c - 58 * t * c +
          als / 42 * (61 + 179 * ts - ts * t - 479 * t))))) +
          this.x0;

        y = this.a * (this.k0 * (ml - this.ml0 +
          sin_phi * delta_lon * al / 2 * (1 +
          als / 12 * (5 - t + 9 * c + 4 * cs +
          als / 30 * (61 + ts - 58 * t + 270 * c - 330 * t * c +
          als / 56 * (1385 + 543 * ts - ts * t - 3111 * t)))))) +
          this.y0;
      }

      p.x = x;
      p.y = y;

      return p;
    }

    /**
        Transverse Mercator Inverse  -  x/y to long/lat
      */
    function inverse$2(p) {
      var con, phi;
      var lat, lon;
      var x = (p.x - this.x0) * (1 / this.a);
      var y = (p.y - this.y0) * (1 / this.a);

      if (!this.es) {
        var f = Math.exp(x / this.k0);
        var g = 0.5 * (f - 1 / f);
        var temp = this.lat0 + y / this.k0;
        var h = Math.cos(temp);
        con = Math.sqrt((1 - Math.pow(h, 2)) / (1 + Math.pow(g, 2)));
        lat = Math.asin(con);

        if (y < 0) {
          lat = -lat;
        }

        if ((g === 0) && (h === 0)) {
          lon = 0;
        }
        else {
          lon = adjust_lon(Math.atan2(g, h) + this.long0);
        }
      }
      else { // ellipsoidal form
        con = this.ml0 + y / this.k0;
        phi = pj_inv_mlfn(con, this.es, this.en);

        if (Math.abs(phi) < HALF_PI) {
          var sin_phi = Math.sin(phi);
          var cos_phi = Math.cos(phi);
          var tan_phi = Math.abs(cos_phi) > EPSLN ? Math.tan(phi) : 0;
          var c = this.ep2 * Math.pow(cos_phi, 2);
          var cs = Math.pow(c, 2);
          var t = Math.pow(tan_phi, 2);
          var ts = Math.pow(t, 2);
          con = 1 - this.es * Math.pow(sin_phi, 2);
          var d = x * Math.sqrt(con) / this.k0;
          var ds = Math.pow(d, 2);
          con = con * tan_phi;

          lat = phi - (con * ds / (1 - this.es)) * 0.5 * (1 -
            ds / 12 * (5 + 3 * t - 9 * c * t + c - 4 * cs -
            ds / 30 * (61 + 90 * t - 252 * c * t + 45 * ts + 46 * c -
            ds / 56 * (1385 + 3633 * t + 4095 * ts + 1574 * ts * t))));

          lon = adjust_lon(this.long0 + (d * (1 -
            ds / 6 * (1 + 2 * t + c -
            ds / 20 * (5 + 28 * t + 24 * ts + 8 * c * t + 6 * c -
            ds / 42 * (61 + 662 * t + 1320 * ts + 720 * ts * t)))) / cos_phi));
        }
        else {
          lat = HALF_PI * sign(y);
          lon = 0;
        }
      }

      p.x = lon;
      p.y = lat;

      return p;
    }

    var names$3 = ["Transverse_Mercator", "Transverse Mercator", "tmerc"];
    var tmerc = {
      init: init$7,
      forward: forward$2,
      inverse: inverse$2,
      names: names$3
    };

    function sinh(x) {
      var r = Math.exp(x);
      r = (r - 1 / r) / 2;
      return r;
    }

    function hypot(x, y) {
      x = Math.abs(x);
      y = Math.abs(y);
      var a = Math.max(x, y);
      var b = Math.min(x, y) / (a ? a : 1);

      return a * Math.sqrt(1 + Math.pow(b, 2));
    }

    function log1py(x) {
      var y = 1 + x;
      var z = y - 1;

      return z === 0 ? x : x * Math.log(y) / z;
    }

    function asinhy(x) {
      var y = Math.abs(x);
      y = log1py(y * (1 + y / (hypot(1, y) + 1)));

      return x < 0 ? -y : y;
    }

    function gatg(pp, B) {
      var cos_2B = 2 * Math.cos(2 * B);
      var i = pp.length - 1;
      var h1 = pp[i];
      var h2 = 0;
      var h;

      while (--i >= 0) {
        h = -h2 + cos_2B * h1 + pp[i];
        h2 = h1;
        h1 = h;
      }

      return (B + h * Math.sin(2 * B));
    }

    function clens(pp, arg_r) {
      var r = 2 * Math.cos(arg_r);
      var i = pp.length - 1;
      var hr1 = pp[i];
      var hr2 = 0;
      var hr;

      while (--i >= 0) {
        hr = -hr2 + r * hr1 + pp[i];
        hr2 = hr1;
        hr1 = hr;
      }

      return Math.sin(arg_r) * hr;
    }

    function cosh(x) {
      var r = Math.exp(x);
      r = (r + 1 / r) / 2;
      return r;
    }

    function clens_cmplx(pp, arg_r, arg_i) {
      var sin_arg_r = Math.sin(arg_r);
      var cos_arg_r = Math.cos(arg_r);
      var sinh_arg_i = sinh(arg_i);
      var cosh_arg_i = cosh(arg_i);
      var r = 2 * cos_arg_r * cosh_arg_i;
      var i = -2 * sin_arg_r * sinh_arg_i;
      var j = pp.length - 1;
      var hr = pp[j];
      var hi1 = 0;
      var hr1 = 0;
      var hi = 0;
      var hr2;
      var hi2;

      while (--j >= 0) {
        hr2 = hr1;
        hi2 = hi1;
        hr1 = hr;
        hi1 = hi;
        hr = -hr2 + r * hr1 - i * hi1 + pp[j];
        hi = -hi2 + i * hr1 + r * hi1;
      }

      r = sin_arg_r * cosh_arg_i;
      i = cos_arg_r * sinh_arg_i;

      return [r * hr - i * hi, r * hi + i * hr];
    }

    // Heavily based on this etmerc projection implementation

    function init$8() {
      if (this.es === undefined || this.es <= 0) {
        throw new Error('incorrect elliptical usage');
      }

      this.x0 = this.x0 !== undefined ? this.x0 : 0;
      this.y0 = this.y0 !== undefined ? this.y0 : 0;
      this.long0 = this.long0 !== undefined ? this.long0 : 0;
      this.lat0 = this.lat0 !== undefined ? this.lat0 : 0;

      this.cgb = [];
      this.cbg = [];
      this.utg = [];
      this.gtu = [];

      var f = this.es / (1 + Math.sqrt(1 - this.es));
      var n = f / (2 - f);
      var np = n;

      this.cgb[0] = n * (2 + n * (-2 / 3 + n * (-2 + n * (116 / 45 + n * (26 / 45 + n * (-2854 / 675 ))))));
      this.cbg[0] = n * (-2 + n * ( 2 / 3 + n * ( 4 / 3 + n * (-82 / 45 + n * (32 / 45 + n * (4642 / 4725))))));

      np = np * n;
      this.cgb[1] = np * (7 / 3 + n * (-8 / 5 + n * (-227 / 45 + n * (2704 / 315 + n * (2323 / 945)))));
      this.cbg[1] = np * (5 / 3 + n * (-16 / 15 + n * ( -13 / 9 + n * (904 / 315 + n * (-1522 / 945)))));

      np = np * n;
      this.cgb[2] = np * (56 / 15 + n * (-136 / 35 + n * (-1262 / 105 + n * (73814 / 2835))));
      this.cbg[2] = np * (-26 / 15 + n * (34 / 21 + n * (8 / 5 + n * (-12686 / 2835))));

      np = np * n;
      this.cgb[3] = np * (4279 / 630 + n * (-332 / 35 + n * (-399572 / 14175)));
      this.cbg[3] = np * (1237 / 630 + n * (-12 / 5 + n * ( -24832 / 14175)));

      np = np * n;
      this.cgb[4] = np * (4174 / 315 + n * (-144838 / 6237));
      this.cbg[4] = np * (-734 / 315 + n * (109598 / 31185));

      np = np * n;
      this.cgb[5] = np * (601676 / 22275);
      this.cbg[5] = np * (444337 / 155925);

      np = Math.pow(n, 2);
      this.Qn = this.k0 / (1 + n) * (1 + np * (1 / 4 + np * (1 / 64 + np / 256)));

      this.utg[0] = n * (-0.5 + n * ( 2 / 3 + n * (-37 / 96 + n * ( 1 / 360 + n * (81 / 512 + n * (-96199 / 604800))))));
      this.gtu[0] = n * (0.5 + n * (-2 / 3 + n * (5 / 16 + n * (41 / 180 + n * (-127 / 288 + n * (7891 / 37800))))));

      this.utg[1] = np * (-1 / 48 + n * (-1 / 15 + n * (437 / 1440 + n * (-46 / 105 + n * (1118711 / 3870720)))));
      this.gtu[1] = np * (13 / 48 + n * (-3 / 5 + n * (557 / 1440 + n * (281 / 630 + n * (-1983433 / 1935360)))));

      np = np * n;
      this.utg[2] = np * (-17 / 480 + n * (37 / 840 + n * (209 / 4480 + n * (-5569 / 90720 ))));
      this.gtu[2] = np * (61 / 240 + n * (-103 / 140 + n * (15061 / 26880 + n * (167603 / 181440))));

      np = np * n;
      this.utg[3] = np * (-4397 / 161280 + n * (11 / 504 + n * (830251 / 7257600)));
      this.gtu[3] = np * (49561 / 161280 + n * (-179 / 168 + n * (6601661 / 7257600)));

      np = np * n;
      this.utg[4] = np * (-4583 / 161280 + n * (108847 / 3991680));
      this.gtu[4] = np * (34729 / 80640 + n * (-3418889 / 1995840));

      np = np * n;
      this.utg[5] = np * (-20648693 / 638668800);
      this.gtu[5] = np * (212378941 / 319334400);

      var Z = gatg(this.cbg, this.lat0);
      this.Zb = -this.Qn * (Z + clens(this.gtu, 2 * Z));
    }

    function forward$3(p) {
      var Ce = adjust_lon(p.x - this.long0);
      var Cn = p.y;

      Cn = gatg(this.cbg, Cn);
      var sin_Cn = Math.sin(Cn);
      var cos_Cn = Math.cos(Cn);
      var sin_Ce = Math.sin(Ce);
      var cos_Ce = Math.cos(Ce);

      Cn = Math.atan2(sin_Cn, cos_Ce * cos_Cn);
      Ce = Math.atan2(sin_Ce * cos_Cn, hypot(sin_Cn, cos_Cn * cos_Ce));
      Ce = asinhy(Math.tan(Ce));

      var tmp = clens_cmplx(this.gtu, 2 * Cn, 2 * Ce);

      Cn = Cn + tmp[0];
      Ce = Ce + tmp[1];

      var x;
      var y;

      if (Math.abs(Ce) <= 2.623395162778) {
        x = this.a * (this.Qn * Ce) + this.x0;
        y = this.a * (this.Qn * Cn + this.Zb) + this.y0;
      }
      else {
        x = Infinity;
        y = Infinity;
      }

      p.x = x;
      p.y = y;

      return p;
    }

    function inverse$3(p) {
      var Ce = (p.x - this.x0) * (1 / this.a);
      var Cn = (p.y - this.y0) * (1 / this.a);

      Cn = (Cn - this.Zb) / this.Qn;
      Ce = Ce / this.Qn;

      var lon;
      var lat;

      if (Math.abs(Ce) <= 2.623395162778) {
        var tmp = clens_cmplx(this.utg, 2 * Cn, 2 * Ce);

        Cn = Cn + tmp[0];
        Ce = Ce + tmp[1];
        Ce = Math.atan(sinh(Ce));

        var sin_Cn = Math.sin(Cn);
        var cos_Cn = Math.cos(Cn);
        var sin_Ce = Math.sin(Ce);
        var cos_Ce = Math.cos(Ce);

        Cn = Math.atan2(sin_Cn * cos_Ce, hypot(sin_Ce, cos_Ce * cos_Cn));
        Ce = Math.atan2(sin_Ce, cos_Ce * cos_Cn);

        lon = adjust_lon(Ce + this.long0);
        lat = gatg(this.cgb, Cn);
      }
      else {
        lon = Infinity;
        lat = Infinity;
      }

      p.x = lon;
      p.y = lat;

      return p;
    }

    var names$4 = ["Extended_Transverse_Mercator", "Extended Transverse Mercator", "etmerc"];
    var etmerc = {
      init: init$8,
      forward: forward$3,
      inverse: inverse$3,
      names: names$4
    };

    function adjust_zone(zone, lon) {
      if (zone === undefined) {
        zone = Math.floor((adjust_lon(lon) + Math.PI) * 30 / Math.PI) + 1;

        if (zone < 0) {
          return 0;
        } else if (zone > 60) {
          return 60;
        }
      }
      return zone;
    }

    var dependsOn = 'etmerc';


    function init$9() {
      var zone = adjust_zone(this.zone, this.long0);
      if (zone === undefined) {
        throw new Error('unknown utm zone');
      }
      this.lat0 = 0;
      this.long0 =  ((6 * Math.abs(zone)) - 183) * D2R;
      this.x0 = 500000;
      this.y0 = this.utmSouth ? 10000000 : 0;
      this.k0 = 0.9996;

      etmerc.init.apply(this);
      this.forward = etmerc.forward;
      this.inverse = etmerc.inverse;
    }

    var names$5 = ["Universal Transverse Mercator System", "utm"];
    var utm = {
      init: init$9,
      names: names$5,
      dependsOn: dependsOn
    };

    function srat(esinp, exp) {
      return (Math.pow((1 - esinp) / (1 + esinp), exp));
    }

    var MAX_ITER$1 = 20;

    function init$a() {
      var sphi = Math.sin(this.lat0);
      var cphi = Math.cos(this.lat0);
      cphi *= cphi;
      this.rc = Math.sqrt(1 - this.es) / (1 - this.es * sphi * sphi);
      this.C = Math.sqrt(1 + this.es * cphi * cphi / (1 - this.es));
      this.phic0 = Math.asin(sphi / this.C);
      this.ratexp = 0.5 * this.C * this.e;
      this.K = Math.tan(0.5 * this.phic0 + FORTPI) / (Math.pow(Math.tan(0.5 * this.lat0 + FORTPI), this.C) * srat(this.e * sphi, this.ratexp));
    }

    function forward$4(p) {
      var lon = p.x;
      var lat = p.y;

      p.y = 2 * Math.atan(this.K * Math.pow(Math.tan(0.5 * lat + FORTPI), this.C) * srat(this.e * Math.sin(lat), this.ratexp)) - HALF_PI;
      p.x = this.C * lon;
      return p;
    }

    function inverse$4(p) {
      var DEL_TOL = 1e-14;
      var lon = p.x / this.C;
      var lat = p.y;
      var num = Math.pow(Math.tan(0.5 * lat + FORTPI) / this.K, 1 / this.C);
      for (var i = MAX_ITER$1; i > 0; --i) {
        lat = 2 * Math.atan(num * srat(this.e * Math.sin(p.y), - 0.5 * this.e)) - HALF_PI;
        if (Math.abs(lat - p.y) < DEL_TOL) {
          break;
        }
        p.y = lat;
      }
      /* convergence failed */
      if (!i) {
        return null;
      }
      p.x = lon;
      p.y = lat;
      return p;
    }

    var names$6 = ["gauss"];
    var gauss = {
      init: init$a,
      forward: forward$4,
      inverse: inverse$4,
      names: names$6
    };

    function init$b() {
      gauss.init.apply(this);
      if (!this.rc) {
        return;
      }
      this.sinc0 = Math.sin(this.phic0);
      this.cosc0 = Math.cos(this.phic0);
      this.R2 = 2 * this.rc;
      if (!this.title) {
        this.title = "Oblique Stereographic Alternative";
      }
    }

    function forward$5(p) {
      var sinc, cosc, cosl, k;
      p.x = adjust_lon(p.x - this.long0);
      gauss.forward.apply(this, [p]);
      sinc = Math.sin(p.y);
      cosc = Math.cos(p.y);
      cosl = Math.cos(p.x);
      k = this.k0 * this.R2 / (1 + this.sinc0 * sinc + this.cosc0 * cosc * cosl);
      p.x = k * cosc * Math.sin(p.x);
      p.y = k * (this.cosc0 * sinc - this.sinc0 * cosc * cosl);
      p.x = this.a * p.x + this.x0;
      p.y = this.a * p.y + this.y0;
      return p;
    }

    function inverse$5(p) {
      var sinc, cosc, lon, lat, rho;
      p.x = (p.x - this.x0) / this.a;
      p.y = (p.y - this.y0) / this.a;

      p.x /= this.k0;
      p.y /= this.k0;
      if ((rho = Math.sqrt(p.x * p.x + p.y * p.y))) {
        var c = 2 * Math.atan2(rho, this.R2);
        sinc = Math.sin(c);
        cosc = Math.cos(c);
        lat = Math.asin(cosc * this.sinc0 + p.y * sinc * this.cosc0 / rho);
        lon = Math.atan2(p.x * sinc, rho * this.cosc0 * cosc - p.y * this.sinc0 * sinc);
      }
      else {
        lat = this.phic0;
        lon = 0;
      }

      p.x = lon;
      p.y = lat;
      gauss.inverse.apply(this, [p]);
      p.x = adjust_lon(p.x + this.long0);
      return p;
    }

    var names$7 = ["Stereographic_North_Pole", "Oblique_Stereographic", "Polar_Stereographic", "sterea","Oblique Stereographic Alternative","Double_Stereographic"];
    var sterea = {
      init: init$b,
      forward: forward$5,
      inverse: inverse$5,
      names: names$7
    };

    function ssfn_(phit, sinphi, eccen) {
      sinphi *= eccen;
      return (Math.tan(0.5 * (HALF_PI + phit)) * Math.pow((1 - sinphi) / (1 + sinphi), 0.5 * eccen));
    }

    function init$c() {
      this.coslat0 = Math.cos(this.lat0);
      this.sinlat0 = Math.sin(this.lat0);
      if (this.sphere) {
        if (this.k0 === 1 && !isNaN(this.lat_ts) && Math.abs(this.coslat0) <= EPSLN) {
          this.k0 = 0.5 * (1 + sign(this.lat0) * Math.sin(this.lat_ts));
        }
      }
      else {
        if (Math.abs(this.coslat0) <= EPSLN) {
          if (this.lat0 > 0) {
            //North pole
            //trace('stere:north pole');
            this.con = 1;
          }
          else {
            //South pole
            //trace('stere:south pole');
            this.con = -1;
          }
        }
        this.cons = Math.sqrt(Math.pow(1 + this.e, 1 + this.e) * Math.pow(1 - this.e, 1 - this.e));
        if (this.k0 === 1 && !isNaN(this.lat_ts) && Math.abs(this.coslat0) <= EPSLN) {
          this.k0 = 0.5 * this.cons * msfnz(this.e, Math.sin(this.lat_ts), Math.cos(this.lat_ts)) / tsfnz(this.e, this.con * this.lat_ts, this.con * Math.sin(this.lat_ts));
        }
        this.ms1 = msfnz(this.e, this.sinlat0, this.coslat0);
        this.X0 = 2 * Math.atan(this.ssfn_(this.lat0, this.sinlat0, this.e)) - HALF_PI;
        this.cosX0 = Math.cos(this.X0);
        this.sinX0 = Math.sin(this.X0);
      }
    }

    // Stereographic forward equations--mapping lat,long to x,y
    function forward$6(p) {
      var lon = p.x;
      var lat = p.y;
      var sinlat = Math.sin(lat);
      var coslat = Math.cos(lat);
      var A, X, sinX, cosX, ts, rh;
      var dlon = adjust_lon(lon - this.long0);

      if (Math.abs(Math.abs(lon - this.long0) - Math.PI) <= EPSLN && Math.abs(lat + this.lat0) <= EPSLN) {
        //case of the origine point
        //trace('stere:this is the origin point');
        p.x = NaN;
        p.y = NaN;
        return p;
      }
      if (this.sphere) {
        //trace('stere:sphere case');
        A = 2 * this.k0 / (1 + this.sinlat0 * sinlat + this.coslat0 * coslat * Math.cos(dlon));
        p.x = this.a * A * coslat * Math.sin(dlon) + this.x0;
        p.y = this.a * A * (this.coslat0 * sinlat - this.sinlat0 * coslat * Math.cos(dlon)) + this.y0;
        return p;
      }
      else {
        X = 2 * Math.atan(this.ssfn_(lat, sinlat, this.e)) - HALF_PI;
        cosX = Math.cos(X);
        sinX = Math.sin(X);
        if (Math.abs(this.coslat0) <= EPSLN) {
          ts = tsfnz(this.e, lat * this.con, this.con * sinlat);
          rh = 2 * this.a * this.k0 * ts / this.cons;
          p.x = this.x0 + rh * Math.sin(lon - this.long0);
          p.y = this.y0 - this.con * rh * Math.cos(lon - this.long0);
          //trace(p.toString());
          return p;
        }
        else if (Math.abs(this.sinlat0) < EPSLN) {
          //Eq
          //trace('stere:equateur');
          A = 2 * this.a * this.k0 / (1 + cosX * Math.cos(dlon));
          p.y = A * sinX;
        }
        else {
          //other case
          //trace('stere:normal case');
          A = 2 * this.a * this.k0 * this.ms1 / (this.cosX0 * (1 + this.sinX0 * sinX + this.cosX0 * cosX * Math.cos(dlon)));
          p.y = A * (this.cosX0 * sinX - this.sinX0 * cosX * Math.cos(dlon)) + this.y0;
        }
        p.x = A * cosX * Math.sin(dlon) + this.x0;
      }
      //trace(p.toString());
      return p;
    }

    //* Stereographic inverse equations--mapping x,y to lat/long
    function inverse$6(p) {
      p.x -= this.x0;
      p.y -= this.y0;
      var lon, lat, ts, ce, Chi;
      var rh = Math.sqrt(p.x * p.x + p.y * p.y);
      if (this.sphere) {
        var c = 2 * Math.atan(rh / (2 * this.a * this.k0));
        lon = this.long0;
        lat = this.lat0;
        if (rh <= EPSLN) {
          p.x = lon;
          p.y = lat;
          return p;
        }
        lat = Math.asin(Math.cos(c) * this.sinlat0 + p.y * Math.sin(c) * this.coslat0 / rh);
        if (Math.abs(this.coslat0) < EPSLN) {
          if (this.lat0 > 0) {
            lon = adjust_lon(this.long0 + Math.atan2(p.x, - 1 * p.y));
          }
          else {
            lon = adjust_lon(this.long0 + Math.atan2(p.x, p.y));
          }
        }
        else {
          lon = adjust_lon(this.long0 + Math.atan2(p.x * Math.sin(c), rh * this.coslat0 * Math.cos(c) - p.y * this.sinlat0 * Math.sin(c)));
        }
        p.x = lon;
        p.y = lat;
        return p;
      }
      else {
        if (Math.abs(this.coslat0) <= EPSLN) {
          if (rh <= EPSLN) {
            lat = this.lat0;
            lon = this.long0;
            p.x = lon;
            p.y = lat;
            //trace(p.toString());
            return p;
          }
          p.x *= this.con;
          p.y *= this.con;
          ts = rh * this.cons / (2 * this.a * this.k0);
          lat = this.con * phi2z(this.e, ts);
          lon = this.con * adjust_lon(this.con * this.long0 + Math.atan2(p.x, - 1 * p.y));
        }
        else {
          ce = 2 * Math.atan(rh * this.cosX0 / (2 * this.a * this.k0 * this.ms1));
          lon = this.long0;
          if (rh <= EPSLN) {
            Chi = this.X0;
          }
          else {
            Chi = Math.asin(Math.cos(ce) * this.sinX0 + p.y * Math.sin(ce) * this.cosX0 / rh);
            lon = adjust_lon(this.long0 + Math.atan2(p.x * Math.sin(ce), rh * this.cosX0 * Math.cos(ce) - p.y * this.sinX0 * Math.sin(ce)));
          }
          lat = -1 * phi2z(this.e, Math.tan(0.5 * (HALF_PI + Chi)));
        }
      }
      p.x = lon;
      p.y = lat;

      //trace(p.toString());
      return p;

    }

    var names$8 = ["stere", "Stereographic_South_Pole", "Polar Stereographic (variant B)"];
    var stere = {
      init: init$c,
      forward: forward$6,
      inverse: inverse$6,
      names: names$8,
      ssfn_: ssfn_
    };

    /*
      references:
        Formules et constantes pour le Calcul pour la
        projection cylindrique conforme à axe oblique et pour la transformation entre
        des systèmes de référence.
        http://www.swisstopo.admin.ch/internet/swisstopo/fr/home/topics/survey/sys/refsys/switzerland.parsysrelated1.31216.downloadList.77004.DownloadFile.tmp/swissprojectionfr.pdf
      */

    function init$d() {
      var phy0 = this.lat0;
      this.lambda0 = this.long0;
      var sinPhy0 = Math.sin(phy0);
      var semiMajorAxis = this.a;
      var invF = this.rf;
      var flattening = 1 / invF;
      var e2 = 2 * flattening - Math.pow(flattening, 2);
      var e = this.e = Math.sqrt(e2);
      this.R = this.k0 * semiMajorAxis * Math.sqrt(1 - e2) / (1 - e2 * Math.pow(sinPhy0, 2));
      this.alpha = Math.sqrt(1 + e2 / (1 - e2) * Math.pow(Math.cos(phy0), 4));
      this.b0 = Math.asin(sinPhy0 / this.alpha);
      var k1 = Math.log(Math.tan(Math.PI / 4 + this.b0 / 2));
      var k2 = Math.log(Math.tan(Math.PI / 4 + phy0 / 2));
      var k3 = Math.log((1 + e * sinPhy0) / (1 - e * sinPhy0));
      this.K = k1 - this.alpha * k2 + this.alpha * e / 2 * k3;
    }

    function forward$7(p) {
      var Sa1 = Math.log(Math.tan(Math.PI / 4 - p.y / 2));
      var Sa2 = this.e / 2 * Math.log((1 + this.e * Math.sin(p.y)) / (1 - this.e * Math.sin(p.y)));
      var S = -this.alpha * (Sa1 + Sa2) + this.K;

      // spheric latitude
      var b = 2 * (Math.atan(Math.exp(S)) - Math.PI / 4);

      // spheric longitude
      var I = this.alpha * (p.x - this.lambda0);

      // psoeudo equatorial rotation
      var rotI = Math.atan(Math.sin(I) / (Math.sin(this.b0) * Math.tan(b) + Math.cos(this.b0) * Math.cos(I)));

      var rotB = Math.asin(Math.cos(this.b0) * Math.sin(b) - Math.sin(this.b0) * Math.cos(b) * Math.cos(I));

      p.y = this.R / 2 * Math.log((1 + Math.sin(rotB)) / (1 - Math.sin(rotB))) + this.y0;
      p.x = this.R * rotI + this.x0;
      return p;
    }

    function inverse$7(p) {
      var Y = p.x - this.x0;
      var X = p.y - this.y0;

      var rotI = Y / this.R;
      var rotB = 2 * (Math.atan(Math.exp(X / this.R)) - Math.PI / 4);

      var b = Math.asin(Math.cos(this.b0) * Math.sin(rotB) + Math.sin(this.b0) * Math.cos(rotB) * Math.cos(rotI));
      var I = Math.atan(Math.sin(rotI) / (Math.cos(this.b0) * Math.cos(rotI) - Math.sin(this.b0) * Math.tan(rotB)));

      var lambda = this.lambda0 + I / this.alpha;

      var S = 0;
      var phy = b;
      var prevPhy = -1000;
      var iteration = 0;
      while (Math.abs(phy - prevPhy) > 0.0000001) {
        if (++iteration > 20) {
          //...reportError("omercFwdInfinity");
          return;
        }
        //S = Math.log(Math.tan(Math.PI / 4 + phy / 2));
        S = 1 / this.alpha * (Math.log(Math.tan(Math.PI / 4 + b / 2)) - this.K) + this.e * Math.log(Math.tan(Math.PI / 4 + Math.asin(this.e * Math.sin(phy)) / 2));
        prevPhy = phy;
        phy = 2 * Math.atan(Math.exp(S)) - Math.PI / 2;
      }

      p.x = lambda;
      p.y = phy;
      return p;
    }

    var names$9 = ["somerc"];
    var somerc = {
      init: init$d,
      forward: forward$7,
      inverse: inverse$7,
      names: names$9
    };

    /* Initialize the Oblique Mercator  projection
        ------------------------------------------*/
    function init$e() {
      this.no_off = this.no_off || false;
      this.no_rot = this.no_rot || false;

      if (isNaN(this.k0)) {
        this.k0 = 1;
      }
      var sinlat = Math.sin(this.lat0);
      var coslat = Math.cos(this.lat0);
      var con = this.e * sinlat;

      this.bl = Math.sqrt(1 + this.es / (1 - this.es) * Math.pow(coslat, 4));
      this.al = this.a * this.bl * this.k0 * Math.sqrt(1 - this.es) / (1 - con * con);
      var t0 = tsfnz(this.e, this.lat0, sinlat);
      var dl = this.bl / coslat * Math.sqrt((1 - this.es) / (1 - con * con));
      if (dl * dl < 1) {
        dl = 1;
      }
      var fl;
      var gl;
      if (!isNaN(this.longc)) {
        //Central point and azimuth method

        if (this.lat0 >= 0) {
          fl = dl + Math.sqrt(dl * dl - 1);
        }
        else {
          fl = dl - Math.sqrt(dl * dl - 1);
        }
        this.el = fl * Math.pow(t0, this.bl);
        gl = 0.5 * (fl - 1 / fl);
        this.gamma0 = Math.asin(Math.sin(this.alpha) / dl);
        this.long0 = this.longc - Math.asin(gl * Math.tan(this.gamma0)) / this.bl;

      }
      else {
        //2 points method
        var t1 = tsfnz(this.e, this.lat1, Math.sin(this.lat1));
        var t2 = tsfnz(this.e, this.lat2, Math.sin(this.lat2));
        if (this.lat0 >= 0) {
          this.el = (dl + Math.sqrt(dl * dl - 1)) * Math.pow(t0, this.bl);
        }
        else {
          this.el = (dl - Math.sqrt(dl * dl - 1)) * Math.pow(t0, this.bl);
        }
        var hl = Math.pow(t1, this.bl);
        var ll = Math.pow(t2, this.bl);
        fl = this.el / hl;
        gl = 0.5 * (fl - 1 / fl);
        var jl = (this.el * this.el - ll * hl) / (this.el * this.el + ll * hl);
        var pl = (ll - hl) / (ll + hl);
        var dlon12 = adjust_lon(this.long1 - this.long2);
        this.long0 = 0.5 * (this.long1 + this.long2) - Math.atan(jl * Math.tan(0.5 * this.bl * (dlon12)) / pl) / this.bl;
        this.long0 = adjust_lon(this.long0);
        var dlon10 = adjust_lon(this.long1 - this.long0);
        this.gamma0 = Math.atan(Math.sin(this.bl * (dlon10)) / gl);
        this.alpha = Math.asin(dl * Math.sin(this.gamma0));
      }

      if (this.no_off) {
        this.uc = 0;
      }
      else {
        if (this.lat0 >= 0) {
          this.uc = this.al / this.bl * Math.atan2(Math.sqrt(dl * dl - 1), Math.cos(this.alpha));
        }
        else {
          this.uc = -1 * this.al / this.bl * Math.atan2(Math.sqrt(dl * dl - 1), Math.cos(this.alpha));
        }
      }

    }

    /* Oblique Mercator forward equations--mapping lat,long to x,y
        ----------------------------------------------------------*/
    function forward$8(p) {
      var lon = p.x;
      var lat = p.y;
      var dlon = adjust_lon(lon - this.long0);
      var us, vs;
      var con;
      if (Math.abs(Math.abs(lat) - HALF_PI) <= EPSLN) {
        if (lat > 0) {
          con = -1;
        }
        else {
          con = 1;
        }
        vs = this.al / this.bl * Math.log(Math.tan(FORTPI + con * this.gamma0 * 0.5));
        us = -1 * con * HALF_PI * this.al / this.bl;
      }
      else {
        var t = tsfnz(this.e, lat, Math.sin(lat));
        var ql = this.el / Math.pow(t, this.bl);
        var sl = 0.5 * (ql - 1 / ql);
        var tl = 0.5 * (ql + 1 / ql);
        var vl = Math.sin(this.bl * (dlon));
        var ul = (sl * Math.sin(this.gamma0) - vl * Math.cos(this.gamma0)) / tl;
        if (Math.abs(Math.abs(ul) - 1) <= EPSLN) {
          vs = Number.POSITIVE_INFINITY;
        }
        else {
          vs = 0.5 * this.al * Math.log((1 - ul) / (1 + ul)) / this.bl;
        }
        if (Math.abs(Math.cos(this.bl * (dlon))) <= EPSLN) {
          us = this.al * this.bl * (dlon);
        }
        else {
          us = this.al * Math.atan2(sl * Math.cos(this.gamma0) + vl * Math.sin(this.gamma0), Math.cos(this.bl * dlon)) / this.bl;
        }
      }

      if (this.no_rot) {
        p.x = this.x0 + us;
        p.y = this.y0 + vs;
      }
      else {

        us -= this.uc;
        p.x = this.x0 + vs * Math.cos(this.alpha) + us * Math.sin(this.alpha);
        p.y = this.y0 + us * Math.cos(this.alpha) - vs * Math.sin(this.alpha);
      }
      return p;
    }

    function inverse$8(p) {
      var us, vs;
      if (this.no_rot) {
        vs = p.y - this.y0;
        us = p.x - this.x0;
      }
      else {
        vs = (p.x - this.x0) * Math.cos(this.alpha) - (p.y - this.y0) * Math.sin(this.alpha);
        us = (p.y - this.y0) * Math.cos(this.alpha) + (p.x - this.x0) * Math.sin(this.alpha);
        us += this.uc;
      }
      var qp = Math.exp(-1 * this.bl * vs / this.al);
      var sp = 0.5 * (qp - 1 / qp);
      var tp = 0.5 * (qp + 1 / qp);
      var vp = Math.sin(this.bl * us / this.al);
      var up = (vp * Math.cos(this.gamma0) + sp * Math.sin(this.gamma0)) / tp;
      var ts = Math.pow(this.el / Math.sqrt((1 + up) / (1 - up)), 1 / this.bl);
      if (Math.abs(up - 1) < EPSLN) {
        p.x = this.long0;
        p.y = HALF_PI;
      }
      else if (Math.abs(up + 1) < EPSLN) {
        p.x = this.long0;
        p.y = -1 * HALF_PI;
      }
      else {
        p.y = phi2z(this.e, ts);
        p.x = adjust_lon(this.long0 - Math.atan2(sp * Math.cos(this.gamma0) - vp * Math.sin(this.gamma0), Math.cos(this.bl * us / this.al)) / this.bl);
      }
      return p;
    }

    var names$a = ["Hotine_Oblique_Mercator", "Hotine Oblique Mercator", "Hotine_Oblique_Mercator_Azimuth_Natural_Origin", "Hotine_Oblique_Mercator_Azimuth_Center", "omerc"];
    var omerc = {
      init: init$e,
      forward: forward$8,
      inverse: inverse$8,
      names: names$a
    };

    function init$f() {

      // array of:  r_maj,r_min,lat1,lat2,c_lon,c_lat,false_east,false_north
      //double c_lat;                   /* center latitude                      */
      //double c_lon;                   /* center longitude                     */
      //double lat1;                    /* first standard parallel              */
      //double lat2;                    /* second standard parallel             */
      //double r_maj;                   /* major axis                           */
      //double r_min;                   /* minor axis                           */
      //double false_east;              /* x offset in meters                   */
      //double false_north;             /* y offset in meters                   */

      if (!this.lat2) {
        this.lat2 = this.lat1;
      } //if lat2 is not defined
      if (!this.k0) {
        this.k0 = 1;
      }
      this.x0 = this.x0 || 0;
      this.y0 = this.y0 || 0;
      // Standard Parallels cannot be equal and on opposite sides of the equator
      if (Math.abs(this.lat1 + this.lat2) < EPSLN) {
        return;
      }

      var temp = this.b / this.a;
      this.e = Math.sqrt(1 - temp * temp);

      var sin1 = Math.sin(this.lat1);
      var cos1 = Math.cos(this.lat1);
      var ms1 = msfnz(this.e, sin1, cos1);
      var ts1 = tsfnz(this.e, this.lat1, sin1);

      var sin2 = Math.sin(this.lat2);
      var cos2 = Math.cos(this.lat2);
      var ms2 = msfnz(this.e, sin2, cos2);
      var ts2 = tsfnz(this.e, this.lat2, sin2);

      var ts0 = tsfnz(this.e, this.lat0, Math.sin(this.lat0));

      if (Math.abs(this.lat1 - this.lat2) > EPSLN) {
        this.ns = Math.log(ms1 / ms2) / Math.log(ts1 / ts2);
      }
      else {
        this.ns = sin1;
      }
      if (isNaN(this.ns)) {
        this.ns = sin1;
      }
      this.f0 = ms1 / (this.ns * Math.pow(ts1, this.ns));
      this.rh = this.a * this.f0 * Math.pow(ts0, this.ns);
      if (!this.title) {
        this.title = "Lambert Conformal Conic";
      }
    }

    // Lambert Conformal conic forward equations--mapping lat,long to x,y
    // -----------------------------------------------------------------
    function forward$9(p) {

      var lon = p.x;
      var lat = p.y;

      // singular cases :
      if (Math.abs(2 * Math.abs(lat) - Math.PI) <= EPSLN) {
        lat = sign(lat) * (HALF_PI - 2 * EPSLN);
      }

      var con = Math.abs(Math.abs(lat) - HALF_PI);
      var ts, rh1;
      if (con > EPSLN) {
        ts = tsfnz(this.e, lat, Math.sin(lat));
        rh1 = this.a * this.f0 * Math.pow(ts, this.ns);
      }
      else {
        con = lat * this.ns;
        if (con <= 0) {
          return null;
        }
        rh1 = 0;
      }
      var theta = this.ns * adjust_lon(lon - this.long0);
      p.x = this.k0 * (rh1 * Math.sin(theta)) + this.x0;
      p.y = this.k0 * (this.rh - rh1 * Math.cos(theta)) + this.y0;

      return p;
    }

    // Lambert Conformal Conic inverse equations--mapping x,y to lat/long
    // -----------------------------------------------------------------
    function inverse$9(p) {

      var rh1, con, ts;
      var lat, lon;
      var x = (p.x - this.x0) / this.k0;
      var y = (this.rh - (p.y - this.y0) / this.k0);
      if (this.ns > 0) {
        rh1 = Math.sqrt(x * x + y * y);
        con = 1;
      }
      else {
        rh1 = -Math.sqrt(x * x + y * y);
        con = -1;
      }
      var theta = 0;
      if (rh1 !== 0) {
        theta = Math.atan2((con * x), (con * y));
      }
      if ((rh1 !== 0) || (this.ns > 0)) {
        con = 1 / this.ns;
        ts = Math.pow((rh1 / (this.a * this.f0)), con);
        lat = phi2z(this.e, ts);
        if (lat === -9999) {
          return null;
        }
      }
      else {
        lat = -HALF_PI;
      }
      lon = adjust_lon(theta / this.ns + this.long0);

      p.x = lon;
      p.y = lat;
      return p;
    }

    var names$b = ["Lambert Tangential Conformal Conic Projection", "Lambert_Conformal_Conic", "Lambert_Conformal_Conic_2SP", "lcc"];
    var lcc = {
      init: init$f,
      forward: forward$9,
      inverse: inverse$9,
      names: names$b
    };

    function init$g() {
      this.a = 6377397.155;
      this.es = 0.006674372230614;
      this.e = Math.sqrt(this.es);
      if (!this.lat0) {
        this.lat0 = 0.863937979737193;
      }
      if (!this.long0) {
        this.long0 = 0.7417649320975901 - 0.308341501185665;
      }
      /* if scale not set default to 0.9999 */
      if (!this.k0) {
        this.k0 = 0.9999;
      }
      this.s45 = 0.785398163397448; /* 45 */
      this.s90 = 2 * this.s45;
      this.fi0 = this.lat0;
      this.e2 = this.es;
      this.e = Math.sqrt(this.e2);
      this.alfa = Math.sqrt(1 + (this.e2 * Math.pow(Math.cos(this.fi0), 4)) / (1 - this.e2));
      this.uq = 1.04216856380474;
      this.u0 = Math.asin(Math.sin(this.fi0) / this.alfa);
      this.g = Math.pow((1 + this.e * Math.sin(this.fi0)) / (1 - this.e * Math.sin(this.fi0)), this.alfa * this.e / 2);
      this.k = Math.tan(this.u0 / 2 + this.s45) / Math.pow(Math.tan(this.fi0 / 2 + this.s45), this.alfa) * this.g;
      this.k1 = this.k0;
      this.n0 = this.a * Math.sqrt(1 - this.e2) / (1 - this.e2 * Math.pow(Math.sin(this.fi0), 2));
      this.s0 = 1.37008346281555;
      this.n = Math.sin(this.s0);
      this.ro0 = this.k1 * this.n0 / Math.tan(this.s0);
      this.ad = this.s90 - this.uq;
    }

    /* ellipsoid */
    /* calculate xy from lat/lon */
    /* Constants, identical to inverse transform function */
    function forward$a(p) {
      var gfi, u, deltav, s, d, eps, ro;
      var lon = p.x;
      var lat = p.y;
      var delta_lon = adjust_lon(lon - this.long0);
      /* Transformation */
      gfi = Math.pow(((1 + this.e * Math.sin(lat)) / (1 - this.e * Math.sin(lat))), (this.alfa * this.e / 2));
      u = 2 * (Math.atan(this.k * Math.pow(Math.tan(lat / 2 + this.s45), this.alfa) / gfi) - this.s45);
      deltav = -delta_lon * this.alfa;
      s = Math.asin(Math.cos(this.ad) * Math.sin(u) + Math.sin(this.ad) * Math.cos(u) * Math.cos(deltav));
      d = Math.asin(Math.cos(u) * Math.sin(deltav) / Math.cos(s));
      eps = this.n * d;
      ro = this.ro0 * Math.pow(Math.tan(this.s0 / 2 + this.s45), this.n) / Math.pow(Math.tan(s / 2 + this.s45), this.n);
      p.y = ro * Math.cos(eps) / 1;
      p.x = ro * Math.sin(eps) / 1;

      if (!this.czech) {
        p.y *= -1;
        p.x *= -1;
      }
      return (p);
    }

    /* calculate lat/lon from xy */
    function inverse$a(p) {
      var u, deltav, s, d, eps, ro, fi1;
      var ok;

      /* Transformation */
      /* revert y, x*/
      var tmp = p.x;
      p.x = p.y;
      p.y = tmp;
      if (!this.czech) {
        p.y *= -1;
        p.x *= -1;
      }
      ro = Math.sqrt(p.x * p.x + p.y * p.y);
      eps = Math.atan2(p.y, p.x);
      d = eps / Math.sin(this.s0);
      s = 2 * (Math.atan(Math.pow(this.ro0 / ro, 1 / this.n) * Math.tan(this.s0 / 2 + this.s45)) - this.s45);
      u = Math.asin(Math.cos(this.ad) * Math.sin(s) - Math.sin(this.ad) * Math.cos(s) * Math.cos(d));
      deltav = Math.asin(Math.cos(s) * Math.sin(d) / Math.cos(u));
      p.x = this.long0 - deltav / this.alfa;
      fi1 = u;
      ok = 0;
      var iter = 0;
      do {
        p.y = 2 * (Math.atan(Math.pow(this.k, - 1 / this.alfa) * Math.pow(Math.tan(u / 2 + this.s45), 1 / this.alfa) * Math.pow((1 + this.e * Math.sin(fi1)) / (1 - this.e * Math.sin(fi1)), this.e / 2)) - this.s45);
        if (Math.abs(fi1 - p.y) < 0.0000000001) {
          ok = 1;
        }
        fi1 = p.y;
        iter += 1;
      } while (ok === 0 && iter < 15);
      if (iter >= 15) {
        return null;
      }

      return (p);
    }

    var names$c = ["Krovak", "krovak"];
    var krovak = {
      init: init$g,
      forward: forward$a,
      inverse: inverse$a,
      names: names$c
    };

    function mlfn(e0, e1, e2, e3, phi) {
      return (e0 * phi - e1 * Math.sin(2 * phi) + e2 * Math.sin(4 * phi) - e3 * Math.sin(6 * phi));
    }

    function e0fn(x) {
      return (1 - 0.25 * x * (1 + x / 16 * (3 + 1.25 * x)));
    }

    function e1fn(x) {
      return (0.375 * x * (1 + 0.25 * x * (1 + 0.46875 * x)));
    }

    function e2fn(x) {
      return (0.05859375 * x * x * (1 + 0.75 * x));
    }

    function e3fn(x) {
      return (x * x * x * (35 / 3072));
    }

    function gN(a, e, sinphi) {
      var temp = e * sinphi;
      return a / Math.sqrt(1 - temp * temp);
    }

    function adjust_lat(x) {
      return (Math.abs(x) < HALF_PI) ? x : (x - (sign(x) * Math.PI));
    }

    function imlfn(ml, e0, e1, e2, e3) {
      var phi;
      var dphi;

      phi = ml / e0;
      for (var i = 0; i < 15; i++) {
        dphi = (ml - (e0 * phi - e1 * Math.sin(2 * phi) + e2 * Math.sin(4 * phi) - e3 * Math.sin(6 * phi))) / (e0 - 2 * e1 * Math.cos(2 * phi) + 4 * e2 * Math.cos(4 * phi) - 6 * e3 * Math.cos(6 * phi));
        phi += dphi;
        if (Math.abs(dphi) <= 0.0000000001) {
          return phi;
        }
      }

      //..reportError("IMLFN-CONV:Latitude failed to converge after 15 iterations");
      return NaN;
    }

    function init$h() {
      if (!this.sphere) {
        this.e0 = e0fn(this.es);
        this.e1 = e1fn(this.es);
        this.e2 = e2fn(this.es);
        this.e3 = e3fn(this.es);
        this.ml0 = this.a * mlfn(this.e0, this.e1, this.e2, this.e3, this.lat0);
      }
    }

    /* Cassini forward equations--mapping lat,long to x,y
      -----------------------------------------------------------------------*/
    function forward$b(p) {

      /* Forward equations
          -----------------*/
      var x, y;
      var lam = p.x;
      var phi = p.y;
      lam = adjust_lon(lam - this.long0);

      if (this.sphere) {
        x = this.a * Math.asin(Math.cos(phi) * Math.sin(lam));
        y = this.a * (Math.atan2(Math.tan(phi), Math.cos(lam)) - this.lat0);
      }
      else {
        //ellipsoid
        var sinphi = Math.sin(phi);
        var cosphi = Math.cos(phi);
        var nl = gN(this.a, this.e, sinphi);
        var tl = Math.tan(phi) * Math.tan(phi);
        var al = lam * Math.cos(phi);
        var asq = al * al;
        var cl = this.es * cosphi * cosphi / (1 - this.es);
        var ml = this.a * mlfn(this.e0, this.e1, this.e2, this.e3, phi);

        x = nl * al * (1 - asq * tl * (1 / 6 - (8 - tl + 8 * cl) * asq / 120));
        y = ml - this.ml0 + nl * sinphi / cosphi * asq * (0.5 + (5 - tl + 6 * cl) * asq / 24);


      }

      p.x = x + this.x0;
      p.y = y + this.y0;
      return p;
    }

    /* Inverse equations
      -----------------*/
    function inverse$b(p) {
      p.x -= this.x0;
      p.y -= this.y0;
      var x = p.x / this.a;
      var y = p.y / this.a;
      var phi, lam;

      if (this.sphere) {
        var dd = y + this.lat0;
        phi = Math.asin(Math.sin(dd) * Math.cos(x));
        lam = Math.atan2(Math.tan(x), Math.cos(dd));
      }
      else {
        /* ellipsoid */
        var ml1 = this.ml0 / this.a + y;
        var phi1 = imlfn(ml1, this.e0, this.e1, this.e2, this.e3);
        if (Math.abs(Math.abs(phi1) - HALF_PI) <= EPSLN) {
          p.x = this.long0;
          p.y = HALF_PI;
          if (y < 0) {
            p.y *= -1;
          }
          return p;
        }
        var nl1 = gN(this.a, this.e, Math.sin(phi1));

        var rl1 = nl1 * nl1 * nl1 / this.a / this.a * (1 - this.es);
        var tl1 = Math.pow(Math.tan(phi1), 2);
        var dl = x * this.a / nl1;
        var dsq = dl * dl;
        phi = phi1 - nl1 * Math.tan(phi1) / rl1 * dl * dl * (0.5 - (1 + 3 * tl1) * dl * dl / 24);
        lam = dl * (1 - dsq * (tl1 / 3 + (1 + 3 * tl1) * tl1 * dsq / 15)) / Math.cos(phi1);

      }

      p.x = adjust_lon(lam + this.long0);
      p.y = adjust_lat(phi);
      return p;

    }

    var names$d = ["Cassini", "Cassini_Soldner", "cass"];
    var cass = {
      init: init$h,
      forward: forward$b,
      inverse: inverse$b,
      names: names$d
    };

    function qsfnz(eccent, sinphi) {
      var con;
      if (eccent > 1.0e-7) {
        con = eccent * sinphi;
        return ((1 - eccent * eccent) * (sinphi / (1 - con * con) - (0.5 / eccent) * Math.log((1 - con) / (1 + con))));
      }
      else {
        return (2 * sinphi);
      }
    }

    /*
      reference
        "New Equal-Area Map Projections for Noncircular Regions", John P. Snyder,
        The American Cartographer, Vol 15, No. 4, October 1988, pp. 341-355.
      */

    var S_POLE = 1;

    var N_POLE = 2;
    var EQUIT = 3;
    var OBLIQ = 4;

    /* Initialize the Lambert Azimuthal Equal Area projection
      ------------------------------------------------------*/
    function init$i() {
      var t = Math.abs(this.lat0);
      if (Math.abs(t - HALF_PI) < EPSLN) {
        this.mode = this.lat0 < 0 ? this.S_POLE : this.N_POLE;
      }
      else if (Math.abs(t) < EPSLN) {
        this.mode = this.EQUIT;
      }
      else {
        this.mode = this.OBLIQ;
      }
      if (this.es > 0) {
        var sinphi;

        this.qp = qsfnz(this.e, 1);
        this.mmf = 0.5 / (1 - this.es);
        this.apa = authset(this.es);
        switch (this.mode) {
        case this.N_POLE:
          this.dd = 1;
          break;
        case this.S_POLE:
          this.dd = 1;
          break;
        case this.EQUIT:
          this.rq = Math.sqrt(0.5 * this.qp);
          this.dd = 1 / this.rq;
          this.xmf = 1;
          this.ymf = 0.5 * this.qp;
          break;
        case this.OBLIQ:
          this.rq = Math.sqrt(0.5 * this.qp);
          sinphi = Math.sin(this.lat0);
          this.sinb1 = qsfnz(this.e, sinphi) / this.qp;
          this.cosb1 = Math.sqrt(1 - this.sinb1 * this.sinb1);
          this.dd = Math.cos(this.lat0) / (Math.sqrt(1 - this.es * sinphi * sinphi) * this.rq * this.cosb1);
          this.ymf = (this.xmf = this.rq) / this.dd;
          this.xmf *= this.dd;
          break;
        }
      }
      else {
        if (this.mode === this.OBLIQ) {
          this.sinph0 = Math.sin(this.lat0);
          this.cosph0 = Math.cos(this.lat0);
        }
      }
    }

    /* Lambert Azimuthal Equal Area forward equations--mapping lat,long to x,y
      -----------------------------------------------------------------------*/
    function forward$c(p) {

      /* Forward equations
          -----------------*/
      var x, y, coslam, sinlam, sinphi, q, sinb, cosb, b, cosphi;
      var lam = p.x;
      var phi = p.y;

      lam = adjust_lon(lam - this.long0);
      if (this.sphere) {
        sinphi = Math.sin(phi);
        cosphi = Math.cos(phi);
        coslam = Math.cos(lam);
        if (this.mode === this.OBLIQ || this.mode === this.EQUIT) {
          y = (this.mode === this.EQUIT) ? 1 + cosphi * coslam : 1 + this.sinph0 * sinphi + this.cosph0 * cosphi * coslam;
          if (y <= EPSLN) {
            return null;
          }
          y = Math.sqrt(2 / y);
          x = y * cosphi * Math.sin(lam);
          y *= (this.mode === this.EQUIT) ? sinphi : this.cosph0 * sinphi - this.sinph0 * cosphi * coslam;
        }
        else if (this.mode === this.N_POLE || this.mode === this.S_POLE) {
          if (this.mode === this.N_POLE) {
            coslam = -coslam;
          }
          if (Math.abs(phi + this.phi0) < EPSLN) {
            return null;
          }
          y = FORTPI - phi * 0.5;
          y = 2 * ((this.mode === this.S_POLE) ? Math.cos(y) : Math.sin(y));
          x = y * Math.sin(lam);
          y *= coslam;
        }
      }
      else {
        sinb = 0;
        cosb = 0;
        b = 0;
        coslam = Math.cos(lam);
        sinlam = Math.sin(lam);
        sinphi = Math.sin(phi);
        q = qsfnz(this.e, sinphi);
        if (this.mode === this.OBLIQ || this.mode === this.EQUIT) {
          sinb = q / this.qp;
          cosb = Math.sqrt(1 - sinb * sinb);
        }
        switch (this.mode) {
        case this.OBLIQ:
          b = 1 + this.sinb1 * sinb + this.cosb1 * cosb * coslam;
          break;
        case this.EQUIT:
          b = 1 + cosb * coslam;
          break;
        case this.N_POLE:
          b = HALF_PI + phi;
          q = this.qp - q;
          break;
        case this.S_POLE:
          b = phi - HALF_PI;
          q = this.qp + q;
          break;
        }
        if (Math.abs(b) < EPSLN) {
          return null;
        }
        switch (this.mode) {
        case this.OBLIQ:
        case this.EQUIT:
          b = Math.sqrt(2 / b);
          if (this.mode === this.OBLIQ) {
            y = this.ymf * b * (this.cosb1 * sinb - this.sinb1 * cosb * coslam);
          }
          else {
            y = (b = Math.sqrt(2 / (1 + cosb * coslam))) * sinb * this.ymf;
          }
          x = this.xmf * b * cosb * sinlam;
          break;
        case this.N_POLE:
        case this.S_POLE:
          if (q >= 0) {
            x = (b = Math.sqrt(q)) * sinlam;
            y = coslam * ((this.mode === this.S_POLE) ? b : -b);
          }
          else {
            x = y = 0;
          }
          break;
        }
      }

      p.x = this.a * x + this.x0;
      p.y = this.a * y + this.y0;
      return p;
    }

    /* Inverse equations
      -----------------*/
    function inverse$c(p) {
      p.x -= this.x0;
      p.y -= this.y0;
      var x = p.x / this.a;
      var y = p.y / this.a;
      var lam, phi, cCe, sCe, q, rho, ab;
      if (this.sphere) {
        var cosz = 0,
          rh, sinz = 0;

        rh = Math.sqrt(x * x + y * y);
        phi = rh * 0.5;
        if (phi > 1) {
          return null;
        }
        phi = 2 * Math.asin(phi);
        if (this.mode === this.OBLIQ || this.mode === this.EQUIT) {
          sinz = Math.sin(phi);
          cosz = Math.cos(phi);
        }
        switch (this.mode) {
        case this.EQUIT:
          phi = (Math.abs(rh) <= EPSLN) ? 0 : Math.asin(y * sinz / rh);
          x *= sinz;
          y = cosz * rh;
          break;
        case this.OBLIQ:
          phi = (Math.abs(rh) <= EPSLN) ? this.phi0 : Math.asin(cosz * this.sinph0 + y * sinz * this.cosph0 / rh);
          x *= sinz * this.cosph0;
          y = (cosz - Math.sin(phi) * this.sinph0) * rh;
          break;
        case this.N_POLE:
          y = -y;
          phi = HALF_PI - phi;
          break;
        case this.S_POLE:
          phi -= HALF_PI;
          break;
        }
        lam = (y === 0 && (this.mode === this.EQUIT || this.mode === this.OBLIQ)) ? 0 : Math.atan2(x, y);
      }
      else {
        ab = 0;
        if (this.mode === this.OBLIQ || this.mode === this.EQUIT) {
          x /= this.dd;
          y *= this.dd;
          rho = Math.sqrt(x * x + y * y);
          if (rho < EPSLN) {
            p.x = 0;
            p.y = this.phi0;
            return p;
          }
          sCe = 2 * Math.asin(0.5 * rho / this.rq);
          cCe = Math.cos(sCe);
          x *= (sCe = Math.sin(sCe));
          if (this.mode === this.OBLIQ) {
            ab = cCe * this.sinb1 + y * sCe * this.cosb1 / rho;
            q = this.qp * ab;
            y = rho * this.cosb1 * cCe - y * this.sinb1 * sCe;
          }
          else {
            ab = y * sCe / rho;
            q = this.qp * ab;
            y = rho * cCe;
          }
        }
        else if (this.mode === this.N_POLE || this.mode === this.S_POLE) {
          if (this.mode === this.N_POLE) {
            y = -y;
          }
          q = (x * x + y * y);
          if (!q) {
            p.x = 0;
            p.y = this.phi0;
            return p;
          }
          ab = 1 - q / this.qp;
          if (this.mode === this.S_POLE) {
            ab = -ab;
          }
        }
        lam = Math.atan2(x, y);
        phi = authlat(Math.asin(ab), this.apa);
      }

      p.x = adjust_lon(this.long0 + lam);
      p.y = phi;
      return p;
    }

    /* determine latitude from authalic latitude */
    var P00 = 0.33333333333333333333;

    var P01 = 0.17222222222222222222;
    var P02 = 0.10257936507936507936;
    var P10 = 0.06388888888888888888;
    var P11 = 0.06640211640211640211;
    var P20 = 0.01641501294219154443;

    function authset(es) {
      var t;
      var APA = [];
      APA[0] = es * P00;
      t = es * es;
      APA[0] += t * P01;
      APA[1] = t * P10;
      t *= es;
      APA[0] += t * P02;
      APA[1] += t * P11;
      APA[2] = t * P20;
      return APA;
    }

    function authlat(beta, APA) {
      var t = beta + beta;
      return (beta + APA[0] * Math.sin(t) + APA[1] * Math.sin(t + t) + APA[2] * Math.sin(t + t + t));
    }

    var names$e = ["Lambert Azimuthal Equal Area", "Lambert_Azimuthal_Equal_Area", "laea"];
    var laea = {
      init: init$i,
      forward: forward$c,
      inverse: inverse$c,
      names: names$e,
      S_POLE: S_POLE,
      N_POLE: N_POLE,
      EQUIT: EQUIT,
      OBLIQ: OBLIQ
    };

    function asinz(x) {
      if (Math.abs(x) > 1) {
        x = (x > 1) ? 1 : -1;
      }
      return Math.asin(x);
    }

    function init$j() {

      if (Math.abs(this.lat1 + this.lat2) < EPSLN) {
        return;
      }
      this.temp = this.b / this.a;
      this.es = 1 - Math.pow(this.temp, 2);
      this.e3 = Math.sqrt(this.es);

      this.sin_po = Math.sin(this.lat1);
      this.cos_po = Math.cos(this.lat1);
      this.t1 = this.sin_po;
      this.con = this.sin_po;
      this.ms1 = msfnz(this.e3, this.sin_po, this.cos_po);
      this.qs1 = qsfnz(this.e3, this.sin_po, this.cos_po);

      this.sin_po = Math.sin(this.lat2);
      this.cos_po = Math.cos(this.lat2);
      this.t2 = this.sin_po;
      this.ms2 = msfnz(this.e3, this.sin_po, this.cos_po);
      this.qs2 = qsfnz(this.e3, this.sin_po, this.cos_po);

      this.sin_po = Math.sin(this.lat0);
      this.cos_po = Math.cos(this.lat0);
      this.t3 = this.sin_po;
      this.qs0 = qsfnz(this.e3, this.sin_po, this.cos_po);

      if (Math.abs(this.lat1 - this.lat2) > EPSLN) {
        this.ns0 = (this.ms1 * this.ms1 - this.ms2 * this.ms2) / (this.qs2 - this.qs1);
      }
      else {
        this.ns0 = this.con;
      }
      this.c = this.ms1 * this.ms1 + this.ns0 * this.qs1;
      this.rh = this.a * Math.sqrt(this.c - this.ns0 * this.qs0) / this.ns0;
    }

    /* Albers Conical Equal Area forward equations--mapping lat,long to x,y
      -------------------------------------------------------------------*/
    function forward$d(p) {

      var lon = p.x;
      var lat = p.y;

      this.sin_phi = Math.sin(lat);
      this.cos_phi = Math.cos(lat);

      var qs = qsfnz(this.e3, this.sin_phi, this.cos_phi);
      var rh1 = this.a * Math.sqrt(this.c - this.ns0 * qs) / this.ns0;
      var theta = this.ns0 * adjust_lon(lon - this.long0);
      var x = rh1 * Math.sin(theta) + this.x0;
      var y = this.rh - rh1 * Math.cos(theta) + this.y0;

      p.x = x;
      p.y = y;
      return p;
    }

    function inverse$d(p) {
      var rh1, qs, con, theta, lon, lat;

      p.x -= this.x0;
      p.y = this.rh - p.y + this.y0;
      if (this.ns0 >= 0) {
        rh1 = Math.sqrt(p.x * p.x + p.y * p.y);
        con = 1;
      }
      else {
        rh1 = -Math.sqrt(p.x * p.x + p.y * p.y);
        con = -1;
      }
      theta = 0;
      if (rh1 !== 0) {
        theta = Math.atan2(con * p.x, con * p.y);
      }
      con = rh1 * this.ns0 / this.a;
      if (this.sphere) {
        lat = Math.asin((this.c - con * con) / (2 * this.ns0));
      }
      else {
        qs = (this.c - con * con) / this.ns0;
        lat = this.phi1z(this.e3, qs);
      }

      lon = adjust_lon(theta / this.ns0 + this.long0);
      p.x = lon;
      p.y = lat;
      return p;
    }

    /* Function to compute phi1, the latitude for the inverse of the
       Albers Conical Equal-Area projection.
    -------------------------------------------*/
    function phi1z(eccent, qs) {
      var sinphi, cosphi, con, com, dphi;
      var phi = asinz(0.5 * qs);
      if (eccent < EPSLN) {
        return phi;
      }

      var eccnts = eccent * eccent;
      for (var i = 1; i <= 25; i++) {
        sinphi = Math.sin(phi);
        cosphi = Math.cos(phi);
        con = eccent * sinphi;
        com = 1 - con * con;
        dphi = 0.5 * com * com / cosphi * (qs / (1 - eccnts) - sinphi / com + 0.5 / eccent * Math.log((1 - con) / (1 + con)));
        phi = phi + dphi;
        if (Math.abs(dphi) <= 1e-7) {
          return phi;
        }
      }
      return null;
    }

    var names$f = ["Albers_Conic_Equal_Area", "Albers", "aea"];
    var aea = {
      init: init$j,
      forward: forward$d,
      inverse: inverse$d,
      names: names$f,
      phi1z: phi1z
    };

    /*
      reference:
        Wolfram Mathworld "Gnomonic Projection"
        http://mathworld.wolfram.com/GnomonicProjection.html
        Accessed: 12th November 2009
      */
    function init$k() {

      /* Place parameters in static storage for common use
          -------------------------------------------------*/
      this.sin_p14 = Math.sin(this.lat0);
      this.cos_p14 = Math.cos(this.lat0);
      // Approximation for projecting points to the horizon (infinity)
      this.infinity_dist = 1000 * this.a;
      this.rc = 1;
    }

    /* Gnomonic forward equations--mapping lat,long to x,y
        ---------------------------------------------------*/
    function forward$e(p) {
      var sinphi, cosphi; /* sin and cos value        */
      var dlon; /* delta longitude value      */
      var coslon; /* cos of longitude        */
      var ksp; /* scale factor          */
      var g;
      var x, y;
      var lon = p.x;
      var lat = p.y;
      /* Forward equations
          -----------------*/
      dlon = adjust_lon(lon - this.long0);

      sinphi = Math.sin(lat);
      cosphi = Math.cos(lat);

      coslon = Math.cos(dlon);
      g = this.sin_p14 * sinphi + this.cos_p14 * cosphi * coslon;
      ksp = 1;
      if ((g > 0) || (Math.abs(g) <= EPSLN)) {
        x = this.x0 + this.a * ksp * cosphi * Math.sin(dlon) / g;
        y = this.y0 + this.a * ksp * (this.cos_p14 * sinphi - this.sin_p14 * cosphi * coslon) / g;
      }
      else {

        // Point is in the opposing hemisphere and is unprojectable
        // We still need to return a reasonable point, so we project
        // to infinity, on a bearing
        // equivalent to the northern hemisphere equivalent
        // This is a reasonable approximation for short shapes and lines that
        // straddle the horizon.

        x = this.x0 + this.infinity_dist * cosphi * Math.sin(dlon);
        y = this.y0 + this.infinity_dist * (this.cos_p14 * sinphi - this.sin_p14 * cosphi * coslon);

      }
      p.x = x;
      p.y = y;
      return p;
    }

    function inverse$e(p) {
      var rh; /* Rho */
      var sinc, cosc;
      var c;
      var lon, lat;

      /* Inverse equations
          -----------------*/
      p.x = (p.x - this.x0) / this.a;
      p.y = (p.y - this.y0) / this.a;

      p.x /= this.k0;
      p.y /= this.k0;

      if ((rh = Math.sqrt(p.x * p.x + p.y * p.y))) {
        c = Math.atan2(rh, this.rc);
        sinc = Math.sin(c);
        cosc = Math.cos(c);

        lat = asinz(cosc * this.sin_p14 + (p.y * sinc * this.cos_p14) / rh);
        lon = Math.atan2(p.x * sinc, rh * this.cos_p14 * cosc - p.y * this.sin_p14 * sinc);
        lon = adjust_lon(this.long0 + lon);
      }
      else {
        lat = this.phic0;
        lon = 0;
      }

      p.x = lon;
      p.y = lat;
      return p;
    }

    var names$g = ["gnom"];
    var gnom = {
      init: init$k,
      forward: forward$e,
      inverse: inverse$e,
      names: names$g
    };

    function iqsfnz(eccent, q) {
      var temp = 1 - (1 - eccent * eccent) / (2 * eccent) * Math.log((1 - eccent) / (1 + eccent));
      if (Math.abs(Math.abs(q) - temp) < 1.0E-6) {
        if (q < 0) {
          return (-1 * HALF_PI);
        }
        else {
          return HALF_PI;
        }
      }
      //var phi = 0.5* q/(1-eccent*eccent);
      var phi = Math.asin(0.5 * q);
      var dphi;
      var sin_phi;
      var cos_phi;
      var con;
      for (var i = 0; i < 30; i++) {
        sin_phi = Math.sin(phi);
        cos_phi = Math.cos(phi);
        con = eccent * sin_phi;
        dphi = Math.pow(1 - con * con, 2) / (2 * cos_phi) * (q / (1 - eccent * eccent) - sin_phi / (1 - con * con) + 0.5 / eccent * Math.log((1 - con) / (1 + con)));
        phi += dphi;
        if (Math.abs(dphi) <= 0.0000000001) {
          return phi;
        }
      }

      //console.log("IQSFN-CONV:Latitude failed to converge after 30 iterations");
      return NaN;
    }

    /*
      reference:
        "Cartographic Projection Procedures for the UNIX Environment-
        A User's Manual" by Gerald I. Evenden,
        USGS Open File Report 90-284and Release 4 Interim Reports (2003)
    */
    function init$l() {
      //no-op
      if (!this.sphere) {
        this.k0 = msfnz(this.e, Math.sin(this.lat_ts), Math.cos(this.lat_ts));
      }
    }

    /* Cylindrical Equal Area forward equations--mapping lat,long to x,y
        ------------------------------------------------------------*/
    function forward$f(p) {
      var lon = p.x;
      var lat = p.y;
      var x, y;
      /* Forward equations
          -----------------*/
      var dlon = adjust_lon(lon - this.long0);
      if (this.sphere) {
        x = this.x0 + this.a * dlon * Math.cos(this.lat_ts);
        y = this.y0 + this.a * Math.sin(lat) / Math.cos(this.lat_ts);
      }
      else {
        var qs = qsfnz(this.e, Math.sin(lat));
        x = this.x0 + this.a * this.k0 * dlon;
        y = this.y0 + this.a * qs * 0.5 / this.k0;
      }

      p.x = x;
      p.y = y;
      return p;
    }

    /* Cylindrical Equal Area inverse equations--mapping x,y to lat/long
        ------------------------------------------------------------*/
    function inverse$f(p) {
      p.x -= this.x0;
      p.y -= this.y0;
      var lon, lat;

      if (this.sphere) {
        lon = adjust_lon(this.long0 + (p.x / this.a) / Math.cos(this.lat_ts));
        lat = Math.asin((p.y / this.a) * Math.cos(this.lat_ts));
      }
      else {
        lat = iqsfnz(this.e, 2 * p.y * this.k0 / this.a);
        lon = adjust_lon(this.long0 + p.x / (this.a * this.k0));
      }

      p.x = lon;
      p.y = lat;
      return p;
    }

    var names$h = ["cea"];
    var cea = {
      init: init$l,
      forward: forward$f,
      inverse: inverse$f,
      names: names$h
    };

    function init$m() {

      this.x0 = this.x0 || 0;
      this.y0 = this.y0 || 0;
      this.lat0 = this.lat0 || 0;
      this.long0 = this.long0 || 0;
      this.lat_ts = this.lat_ts || 0;
      this.title = this.title || "Equidistant Cylindrical (Plate Carre)";

      this.rc = Math.cos(this.lat_ts);
    }

    // forward equations--mapping lat,long to x,y
    // -----------------------------------------------------------------
    function forward$g(p) {

      var lon = p.x;
      var lat = p.y;

      var dlon = adjust_lon(lon - this.long0);
      var dlat = adjust_lat(lat - this.lat0);
      p.x = this.x0 + (this.a * dlon * this.rc);
      p.y = this.y0 + (this.a * dlat);
      return p;
    }

    // inverse equations--mapping x,y to lat/long
    // -----------------------------------------------------------------
    function inverse$g(p) {

      var x = p.x;
      var y = p.y;

      p.x = adjust_lon(this.long0 + ((x - this.x0) / (this.a * this.rc)));
      p.y = adjust_lat(this.lat0 + ((y - this.y0) / (this.a)));
      return p;
    }

    var names$i = ["Equirectangular", "Equidistant_Cylindrical", "eqc"];
    var eqc = {
      init: init$m,
      forward: forward$g,
      inverse: inverse$g,
      names: names$i
    };

    var MAX_ITER$2 = 20;

    function init$n() {
      /* Place parameters in static storage for common use
          -------------------------------------------------*/
      this.temp = this.b / this.a;
      this.es = 1 - Math.pow(this.temp, 2); // devait etre dans tmerc.js mais n y est pas donc je commente sinon retour de valeurs nulles
      this.e = Math.sqrt(this.es);
      this.e0 = e0fn(this.es);
      this.e1 = e1fn(this.es);
      this.e2 = e2fn(this.es);
      this.e3 = e3fn(this.es);
      this.ml0 = this.a * mlfn(this.e0, this.e1, this.e2, this.e3, this.lat0); //si que des zeros le calcul ne se fait pas
    }

    /* Polyconic forward equations--mapping lat,long to x,y
        ---------------------------------------------------*/
    function forward$h(p) {
      var lon = p.x;
      var lat = p.y;
      var x, y, el;
      var dlon = adjust_lon(lon - this.long0);
      el = dlon * Math.sin(lat);
      if (this.sphere) {
        if (Math.abs(lat) <= EPSLN) {
          x = this.a * dlon;
          y = -1 * this.a * this.lat0;
        }
        else {
          x = this.a * Math.sin(el) / Math.tan(lat);
          y = this.a * (adjust_lat(lat - this.lat0) + (1 - Math.cos(el)) / Math.tan(lat));
        }
      }
      else {
        if (Math.abs(lat) <= EPSLN) {
          x = this.a * dlon;
          y = -1 * this.ml0;
        }
        else {
          var nl = gN(this.a, this.e, Math.sin(lat)) / Math.tan(lat);
          x = nl * Math.sin(el);
          y = this.a * mlfn(this.e0, this.e1, this.e2, this.e3, lat) - this.ml0 + nl * (1 - Math.cos(el));
        }

      }
      p.x = x + this.x0;
      p.y = y + this.y0;
      return p;
    }

    /* Inverse equations
      -----------------*/
    function inverse$h(p) {
      var lon, lat, x, y, i;
      var al, bl;
      var phi, dphi;
      x = p.x - this.x0;
      y = p.y - this.y0;

      if (this.sphere) {
        if (Math.abs(y + this.a * this.lat0) <= EPSLN) {
          lon = adjust_lon(x / this.a + this.long0);
          lat = 0;
        }
        else {
          al = this.lat0 + y / this.a;
          bl = x * x / this.a / this.a + al * al;
          phi = al;
          var tanphi;
          for (i = MAX_ITER$2; i; --i) {
            tanphi = Math.tan(phi);
            dphi = -1 * (al * (phi * tanphi + 1) - phi - 0.5 * (phi * phi + bl) * tanphi) / ((phi - al) / tanphi - 1);
            phi += dphi;
            if (Math.abs(dphi) <= EPSLN) {
              lat = phi;
              break;
            }
          }
          lon = adjust_lon(this.long0 + (Math.asin(x * Math.tan(phi) / this.a)) / Math.sin(lat));
        }
      }
      else {
        if (Math.abs(y + this.ml0) <= EPSLN) {
          lat = 0;
          lon = adjust_lon(this.long0 + x / this.a);
        }
        else {

          al = (this.ml0 + y) / this.a;
          bl = x * x / this.a / this.a + al * al;
          phi = al;
          var cl, mln, mlnp, ma;
          var con;
          for (i = MAX_ITER$2; i; --i) {
            con = this.e * Math.sin(phi);
            cl = Math.sqrt(1 - con * con) * Math.tan(phi);
            mln = this.a * mlfn(this.e0, this.e1, this.e2, this.e3, phi);
            mlnp = this.e0 - 2 * this.e1 * Math.cos(2 * phi) + 4 * this.e2 * Math.cos(4 * phi) - 6 * this.e3 * Math.cos(6 * phi);
            ma = mln / this.a;
            dphi = (al * (cl * ma + 1) - ma - 0.5 * cl * (ma * ma + bl)) / (this.es * Math.sin(2 * phi) * (ma * ma + bl - 2 * al * ma) / (4 * cl) + (al - ma) * (cl * mlnp - 2 / Math.sin(2 * phi)) - mlnp);
            phi -= dphi;
            if (Math.abs(dphi) <= EPSLN) {
              lat = phi;
              break;
            }
          }

          //lat=phi4z(this.e,this.e0,this.e1,this.e2,this.e3,al,bl,0,0);
          cl = Math.sqrt(1 - this.es * Math.pow(Math.sin(lat), 2)) * Math.tan(lat);
          lon = adjust_lon(this.long0 + Math.asin(x * cl / this.a) / Math.sin(lat));
        }
      }

      p.x = lon;
      p.y = lat;
      return p;
    }

    var names$j = ["Polyconic", "poly"];
    var poly = {
      init: init$n,
      forward: forward$h,
      inverse: inverse$h,
      names: names$j
    };

    function init$o() {
      this.A = [];
      this.A[1] = 0.6399175073;
      this.A[2] = -0.1358797613;
      this.A[3] = 0.063294409;
      this.A[4] = -0.02526853;
      this.A[5] = 0.0117879;
      this.A[6] = -0.0055161;
      this.A[7] = 0.0026906;
      this.A[8] = -0.001333;
      this.A[9] = 0.00067;
      this.A[10] = -0.00034;

      this.B_re = [];
      this.B_im = [];
      this.B_re[1] = 0.7557853228;
      this.B_im[1] = 0;
      this.B_re[2] = 0.249204646;
      this.B_im[2] = 0.003371507;
      this.B_re[3] = -0.001541739;
      this.B_im[3] = 0.041058560;
      this.B_re[4] = -0.10162907;
      this.B_im[4] = 0.01727609;
      this.B_re[5] = -0.26623489;
      this.B_im[5] = -0.36249218;
      this.B_re[6] = -0.6870983;
      this.B_im[6] = -1.1651967;

      this.C_re = [];
      this.C_im = [];
      this.C_re[1] = 1.3231270439;
      this.C_im[1] = 0;
      this.C_re[2] = -0.577245789;
      this.C_im[2] = -0.007809598;
      this.C_re[3] = 0.508307513;
      this.C_im[3] = -0.112208952;
      this.C_re[4] = -0.15094762;
      this.C_im[4] = 0.18200602;
      this.C_re[5] = 1.01418179;
      this.C_im[5] = 1.64497696;
      this.C_re[6] = 1.9660549;
      this.C_im[6] = 2.5127645;

      this.D = [];
      this.D[1] = 1.5627014243;
      this.D[2] = 0.5185406398;
      this.D[3] = -0.03333098;
      this.D[4] = -0.1052906;
      this.D[5] = -0.0368594;
      this.D[6] = 0.007317;
      this.D[7] = 0.01220;
      this.D[8] = 0.00394;
      this.D[9] = -0.0013;
    }

    /**
        New Zealand Map Grid Forward  - long/lat to x/y
        long/lat in radians
      */
    function forward$i(p) {
      var n;
      var lon = p.x;
      var lat = p.y;

      var delta_lat = lat - this.lat0;
      var delta_lon = lon - this.long0;

      // 1. Calculate d_phi and d_psi    ...                          // and d_lambda
      // For this algorithm, delta_latitude is in seconds of arc x 10-5, so we need to scale to those units. Longitude is radians.
      var d_phi = delta_lat / SEC_TO_RAD * 1E-5;
      var d_lambda = delta_lon;
      var d_phi_n = 1; // d_phi^0

      var d_psi = 0;
      for (n = 1; n <= 10; n++) {
        d_phi_n = d_phi_n * d_phi;
        d_psi = d_psi + this.A[n] * d_phi_n;
      }

      // 2. Calculate theta
      var th_re = d_psi;
      var th_im = d_lambda;

      // 3. Calculate z
      var th_n_re = 1;
      var th_n_im = 0; // theta^0
      var th_n_re1;
      var th_n_im1;

      var z_re = 0;
      var z_im = 0;
      for (n = 1; n <= 6; n++) {
        th_n_re1 = th_n_re * th_re - th_n_im * th_im;
        th_n_im1 = th_n_im * th_re + th_n_re * th_im;
        th_n_re = th_n_re1;
        th_n_im = th_n_im1;
        z_re = z_re + this.B_re[n] * th_n_re - this.B_im[n] * th_n_im;
        z_im = z_im + this.B_im[n] * th_n_re + this.B_re[n] * th_n_im;
      }

      // 4. Calculate easting and northing
      p.x = (z_im * this.a) + this.x0;
      p.y = (z_re * this.a) + this.y0;

      return p;
    }

    /**
        New Zealand Map Grid Inverse  -  x/y to long/lat
      */
    function inverse$i(p) {
      var n;
      var x = p.x;
      var y = p.y;

      var delta_x = x - this.x0;
      var delta_y = y - this.y0;

      // 1. Calculate z
      var z_re = delta_y / this.a;
      var z_im = delta_x / this.a;

      // 2a. Calculate theta - first approximation gives km accuracy
      var z_n_re = 1;
      var z_n_im = 0; // z^0
      var z_n_re1;
      var z_n_im1;

      var th_re = 0;
      var th_im = 0;
      for (n = 1; n <= 6; n++) {
        z_n_re1 = z_n_re * z_re - z_n_im * z_im;
        z_n_im1 = z_n_im * z_re + z_n_re * z_im;
        z_n_re = z_n_re1;
        z_n_im = z_n_im1;
        th_re = th_re + this.C_re[n] * z_n_re - this.C_im[n] * z_n_im;
        th_im = th_im + this.C_im[n] * z_n_re + this.C_re[n] * z_n_im;
      }

      // 2b. Iterate to refine the accuracy of the calculation
      //        0 iterations gives km accuracy
      //        1 iteration gives m accuracy -- good enough for most mapping applications
      //        2 iterations bives mm accuracy
      for (var i = 0; i < this.iterations; i++) {
        var th_n_re = th_re;
        var th_n_im = th_im;
        var th_n_re1;
        var th_n_im1;

        var num_re = z_re;
        var num_im = z_im;
        for (n = 2; n <= 6; n++) {
          th_n_re1 = th_n_re * th_re - th_n_im * th_im;
          th_n_im1 = th_n_im * th_re + th_n_re * th_im;
          th_n_re = th_n_re1;
          th_n_im = th_n_im1;
          num_re = num_re + (n - 1) * (this.B_re[n] * th_n_re - this.B_im[n] * th_n_im);
          num_im = num_im + (n - 1) * (this.B_im[n] * th_n_re + this.B_re[n] * th_n_im);
        }

        th_n_re = 1;
        th_n_im = 0;
        var den_re = this.B_re[1];
        var den_im = this.B_im[1];
        for (n = 2; n <= 6; n++) {
          th_n_re1 = th_n_re * th_re - th_n_im * th_im;
          th_n_im1 = th_n_im * th_re + th_n_re * th_im;
          th_n_re = th_n_re1;
          th_n_im = th_n_im1;
          den_re = den_re + n * (this.B_re[n] * th_n_re - this.B_im[n] * th_n_im);
          den_im = den_im + n * (this.B_im[n] * th_n_re + this.B_re[n] * th_n_im);
        }

        // Complex division
        var den2 = den_re * den_re + den_im * den_im;
        th_re = (num_re * den_re + num_im * den_im) / den2;
        th_im = (num_im * den_re - num_re * den_im) / den2;
      }

      // 3. Calculate d_phi              ...                                    // and d_lambda
      var d_psi = th_re;
      var d_lambda = th_im;
      var d_psi_n = 1; // d_psi^0

      var d_phi = 0;
      for (n = 1; n <= 9; n++) {
        d_psi_n = d_psi_n * d_psi;
        d_phi = d_phi + this.D[n] * d_psi_n;
      }

      // 4. Calculate latitude and longitude
      // d_phi is calcuated in second of arc * 10^-5, so we need to scale back to radians. d_lambda is in radians.
      var lat = this.lat0 + (d_phi * SEC_TO_RAD * 1E5);
      var lon = this.long0 + d_lambda;

      p.x = lon;
      p.y = lat;

      return p;
    }

    var names$k = ["New_Zealand_Map_Grid", "nzmg"];
    var nzmg = {
      init: init$o,
      forward: forward$i,
      inverse: inverse$i,
      names: names$k
    };

    /*
      reference
        "New Equal-Area Map Projections for Noncircular Regions", John P. Snyder,
        The American Cartographer, Vol 15, No. 4, October 1988, pp. 341-355.
      */


    /* Initialize the Miller Cylindrical projection
      -------------------------------------------*/
    function init$p() {
      //no-op
    }

    /* Miller Cylindrical forward equations--mapping lat,long to x,y
        ------------------------------------------------------------*/
    function forward$j(p) {
      var lon = p.x;
      var lat = p.y;
      /* Forward equations
          -----------------*/
      var dlon = adjust_lon(lon - this.long0);
      var x = this.x0 + this.a * dlon;
      var y = this.y0 + this.a * Math.log(Math.tan((Math.PI / 4) + (lat / 2.5))) * 1.25;

      p.x = x;
      p.y = y;
      return p;
    }

    /* Miller Cylindrical inverse equations--mapping x,y to lat/long
        ------------------------------------------------------------*/
    function inverse$j(p) {
      p.x -= this.x0;
      p.y -= this.y0;

      var lon = adjust_lon(this.long0 + p.x / this.a);
      var lat = 2.5 * (Math.atan(Math.exp(0.8 * p.y / this.a)) - Math.PI / 4);

      p.x = lon;
      p.y = lat;
      return p;
    }

    var names$l = ["Miller_Cylindrical", "mill"];
    var mill = {
      init: init$p,
      forward: forward$j,
      inverse: inverse$j,
      names: names$l
    };

    var MAX_ITER$3 = 20;


    function init$q() {
      /* Place parameters in static storage for common use
        -------------------------------------------------*/


      if (!this.sphere) {
        this.en = pj_enfn(this.es);
      }
      else {
        this.n = 1;
        this.m = 0;
        this.es = 0;
        this.C_y = Math.sqrt((this.m + 1) / this.n);
        this.C_x = this.C_y / (this.m + 1);
      }

    }

    /* Sinusoidal forward equations--mapping lat,long to x,y
      -----------------------------------------------------*/
    function forward$k(p) {
      var x, y;
      var lon = p.x;
      var lat = p.y;
      /* Forward equations
        -----------------*/
      lon = adjust_lon(lon - this.long0);

      if (this.sphere) {
        if (!this.m) {
          lat = this.n !== 1 ? Math.asin(this.n * Math.sin(lat)) : lat;
        }
        else {
          var k = this.n * Math.sin(lat);
          for (var i = MAX_ITER$3; i; --i) {
            var V = (this.m * lat + Math.sin(lat) - k) / (this.m + Math.cos(lat));
            lat -= V;
            if (Math.abs(V) < EPSLN) {
              break;
            }
          }
        }
        x = this.a * this.C_x * lon * (this.m + Math.cos(lat));
        y = this.a * this.C_y * lat;

      }
      else {

        var s = Math.sin(lat);
        var c = Math.cos(lat);
        y = this.a * pj_mlfn(lat, s, c, this.en);
        x = this.a * lon * c / Math.sqrt(1 - this.es * s * s);
      }

      p.x = x;
      p.y = y;
      return p;
    }

    function inverse$k(p) {
      var lat, temp, lon, s;

      p.x -= this.x0;
      lon = p.x / this.a;
      p.y -= this.y0;
      lat = p.y / this.a;

      if (this.sphere) {
        lat /= this.C_y;
        lon = lon / (this.C_x * (this.m + Math.cos(lat)));
        if (this.m) {
          lat = asinz((this.m * lat + Math.sin(lat)) / this.n);
        }
        else if (this.n !== 1) {
          lat = asinz(Math.sin(lat) / this.n);
        }
        lon = adjust_lon(lon + this.long0);
        lat = adjust_lat(lat);
      }
      else {
        lat = pj_inv_mlfn(p.y / this.a, this.es, this.en);
        s = Math.abs(lat);
        if (s < HALF_PI) {
          s = Math.sin(lat);
          temp = this.long0 + p.x * Math.sqrt(1 - this.es * s * s) / (this.a * Math.cos(lat));
          //temp = this.long0 + p.x / (this.a * Math.cos(lat));
          lon = adjust_lon(temp);
        }
        else if ((s - EPSLN) < HALF_PI) {
          lon = this.long0;
        }
      }
      p.x = lon;
      p.y = lat;
      return p;
    }

    var names$m = ["Sinusoidal", "sinu"];
    var sinu = {
      init: init$q,
      forward: forward$k,
      inverse: inverse$k,
      names: names$m
    };

    function init$r() {}
    /* Mollweide forward equations--mapping lat,long to x,y
        ----------------------------------------------------*/
    function forward$l(p) {

      /* Forward equations
          -----------------*/
      var lon = p.x;
      var lat = p.y;

      var delta_lon = adjust_lon(lon - this.long0);
      var theta = lat;
      var con = Math.PI * Math.sin(lat);

      /* Iterate using the Newton-Raphson method to find theta
          -----------------------------------------------------*/
      while (true) {
        var delta_theta = -(theta + Math.sin(theta) - con) / (1 + Math.cos(theta));
        theta += delta_theta;
        if (Math.abs(delta_theta) < EPSLN) {
          break;
        }
      }
      theta /= 2;

      /* If the latitude is 90 deg, force the x coordinate to be "0 + false easting"
           this is done here because of precision problems with "cos(theta)"
           --------------------------------------------------------------------------*/
      if (Math.PI / 2 - Math.abs(lat) < EPSLN) {
        delta_lon = 0;
      }
      var x = 0.900316316158 * this.a * delta_lon * Math.cos(theta) + this.x0;
      var y = 1.4142135623731 * this.a * Math.sin(theta) + this.y0;

      p.x = x;
      p.y = y;
      return p;
    }

    function inverse$l(p) {
      var theta;
      var arg;

      /* Inverse equations
          -----------------*/
      p.x -= this.x0;
      p.y -= this.y0;
      arg = p.y / (1.4142135623731 * this.a);

      /* Because of division by zero problems, 'arg' can not be 1.  Therefore
           a number very close to one is used instead.
           -------------------------------------------------------------------*/
      if (Math.abs(arg) > 0.999999999999) {
        arg = 0.999999999999;
      }
      theta = Math.asin(arg);
      var lon = adjust_lon(this.long0 + (p.x / (0.900316316158 * this.a * Math.cos(theta))));
      if (lon < (-Math.PI)) {
        lon = -Math.PI;
      }
      if (lon > Math.PI) {
        lon = Math.PI;
      }
      arg = (2 * theta + Math.sin(2 * theta)) / Math.PI;
      if (Math.abs(arg) > 1) {
        arg = 1;
      }
      var lat = Math.asin(arg);

      p.x = lon;
      p.y = lat;
      return p;
    }

    var names$n = ["Mollweide", "moll"];
    var moll = {
      init: init$r,
      forward: forward$l,
      inverse: inverse$l,
      names: names$n
    };

    function init$s() {

      /* Place parameters in static storage for common use
          -------------------------------------------------*/
      // Standard Parallels cannot be equal and on opposite sides of the equator
      if (Math.abs(this.lat1 + this.lat2) < EPSLN) {
        return;
      }
      this.lat2 = this.lat2 || this.lat1;
      this.temp = this.b / this.a;
      this.es = 1 - Math.pow(this.temp, 2);
      this.e = Math.sqrt(this.es);
      this.e0 = e0fn(this.es);
      this.e1 = e1fn(this.es);
      this.e2 = e2fn(this.es);
      this.e3 = e3fn(this.es);

      this.sinphi = Math.sin(this.lat1);
      this.cosphi = Math.cos(this.lat1);

      this.ms1 = msfnz(this.e, this.sinphi, this.cosphi);
      this.ml1 = mlfn(this.e0, this.e1, this.e2, this.e3, this.lat1);

      if (Math.abs(this.lat1 - this.lat2) < EPSLN) {
        this.ns = this.sinphi;
      }
      else {
        this.sinphi = Math.sin(this.lat2);
        this.cosphi = Math.cos(this.lat2);
        this.ms2 = msfnz(this.e, this.sinphi, this.cosphi);
        this.ml2 = mlfn(this.e0, this.e1, this.e2, this.e3, this.lat2);
        this.ns = (this.ms1 - this.ms2) / (this.ml2 - this.ml1);
      }
      this.g = this.ml1 + this.ms1 / this.ns;
      this.ml0 = mlfn(this.e0, this.e1, this.e2, this.e3, this.lat0);
      this.rh = this.a * (this.g - this.ml0);
    }

    /* Equidistant Conic forward equations--mapping lat,long to x,y
      -----------------------------------------------------------*/
    function forward$m(p) {
      var lon = p.x;
      var lat = p.y;
      var rh1;

      /* Forward equations
          -----------------*/
      if (this.sphere) {
        rh1 = this.a * (this.g - lat);
      }
      else {
        var ml = mlfn(this.e0, this.e1, this.e2, this.e3, lat);
        rh1 = this.a * (this.g - ml);
      }
      var theta = this.ns * adjust_lon(lon - this.long0);
      var x = this.x0 + rh1 * Math.sin(theta);
      var y = this.y0 + this.rh - rh1 * Math.cos(theta);
      p.x = x;
      p.y = y;
      return p;
    }

    /* Inverse equations
      -----------------*/
    function inverse$m(p) {
      p.x -= this.x0;
      p.y = this.rh - p.y + this.y0;
      var con, rh1, lat, lon;
      if (this.ns >= 0) {
        rh1 = Math.sqrt(p.x * p.x + p.y * p.y);
        con = 1;
      }
      else {
        rh1 = -Math.sqrt(p.x * p.x + p.y * p.y);
        con = -1;
      }
      var theta = 0;
      if (rh1 !== 0) {
        theta = Math.atan2(con * p.x, con * p.y);
      }

      if (this.sphere) {
        lon = adjust_lon(this.long0 + theta / this.ns);
        lat = adjust_lat(this.g - rh1 / this.a);
        p.x = lon;
        p.y = lat;
        return p;
      }
      else {
        var ml = this.g - rh1 / this.a;
        lat = imlfn(ml, this.e0, this.e1, this.e2, this.e3);
        lon = adjust_lon(this.long0 + theta / this.ns);
        p.x = lon;
        p.y = lat;
        return p;
      }

    }

    var names$o = ["Equidistant_Conic", "eqdc"];
    var eqdc = {
      init: init$s,
      forward: forward$m,
      inverse: inverse$m,
      names: names$o
    };

    /* Initialize the Van Der Grinten projection
      ----------------------------------------*/
    function init$t() {
      //this.R = 6370997; //Radius of earth
      this.R = this.a;
    }

    function forward$n(p) {

      var lon = p.x;
      var lat = p.y;

      /* Forward equations
        -----------------*/
      var dlon = adjust_lon(lon - this.long0);
      var x, y;

      if (Math.abs(lat) <= EPSLN) {
        x = this.x0 + this.R * dlon;
        y = this.y0;
      }
      var theta = asinz(2 * Math.abs(lat / Math.PI));
      if ((Math.abs(dlon) <= EPSLN) || (Math.abs(Math.abs(lat) - HALF_PI) <= EPSLN)) {
        x = this.x0;
        if (lat >= 0) {
          y = this.y0 + Math.PI * this.R * Math.tan(0.5 * theta);
        }
        else {
          y = this.y0 + Math.PI * this.R * -Math.tan(0.5 * theta);
        }
        //  return(OK);
      }
      var al = 0.5 * Math.abs((Math.PI / dlon) - (dlon / Math.PI));
      var asq = al * al;
      var sinth = Math.sin(theta);
      var costh = Math.cos(theta);

      var g = costh / (sinth + costh - 1);
      var gsq = g * g;
      var m = g * (2 / sinth - 1);
      var msq = m * m;
      var con = Math.PI * this.R * (al * (g - msq) + Math.sqrt(asq * (g - msq) * (g - msq) - (msq + asq) * (gsq - msq))) / (msq + asq);
      if (dlon < 0) {
        con = -con;
      }
      x = this.x0 + con;
      //con = Math.abs(con / (Math.PI * this.R));
      var q = asq + g;
      con = Math.PI * this.R * (m * q - al * Math.sqrt((msq + asq) * (asq + 1) - q * q)) / (msq + asq);
      if (lat >= 0) {
        //y = this.y0 + Math.PI * this.R * Math.sqrt(1 - con * con - 2 * al * con);
        y = this.y0 + con;
      }
      else {
        //y = this.y0 - Math.PI * this.R * Math.sqrt(1 - con * con - 2 * al * con);
        y = this.y0 - con;
      }
      p.x = x;
      p.y = y;
      return p;
    }

    /* Van Der Grinten inverse equations--mapping x,y to lat/long
      ---------------------------------------------------------*/
    function inverse$n(p) {
      var lon, lat;
      var xx, yy, xys, c1, c2, c3;
      var a1;
      var m1;
      var con;
      var th1;
      var d;

      /* inverse equations
        -----------------*/
      p.x -= this.x0;
      p.y -= this.y0;
      con = Math.PI * this.R;
      xx = p.x / con;
      yy = p.y / con;
      xys = xx * xx + yy * yy;
      c1 = -Math.abs(yy) * (1 + xys);
      c2 = c1 - 2 * yy * yy + xx * xx;
      c3 = -2 * c1 + 1 + 2 * yy * yy + xys * xys;
      d = yy * yy / c3 + (2 * c2 * c2 * c2 / c3 / c3 / c3 - 9 * c1 * c2 / c3 / c3) / 27;
      a1 = (c1 - c2 * c2 / 3 / c3) / c3;
      m1 = 2 * Math.sqrt(-a1 / 3);
      con = ((3 * d) / a1) / m1;
      if (Math.abs(con) > 1) {
        if (con >= 0) {
          con = 1;
        }
        else {
          con = -1;
        }
      }
      th1 = Math.acos(con) / 3;
      if (p.y >= 0) {
        lat = (-m1 * Math.cos(th1 + Math.PI / 3) - c2 / 3 / c3) * Math.PI;
      }
      else {
        lat = -(-m1 * Math.cos(th1 + Math.PI / 3) - c2 / 3 / c3) * Math.PI;
      }

      if (Math.abs(xx) < EPSLN) {
        lon = this.long0;
      }
      else {
        lon = adjust_lon(this.long0 + Math.PI * (xys - 1 + Math.sqrt(1 + 2 * (xx * xx - yy * yy) + xys * xys)) / 2 / xx);
      }

      p.x = lon;
      p.y = lat;
      return p;
    }

    var names$p = ["Van_der_Grinten_I", "VanDerGrinten", "vandg"];
    var vandg = {
      init: init$t,
      forward: forward$n,
      inverse: inverse$n,
      names: names$p
    };

    function init$u() {
      this.sin_p12 = Math.sin(this.lat0);
      this.cos_p12 = Math.cos(this.lat0);
    }

    function forward$o(p) {
      var lon = p.x;
      var lat = p.y;
      var sinphi = Math.sin(p.y);
      var cosphi = Math.cos(p.y);
      var dlon = adjust_lon(lon - this.long0);
      var e0, e1, e2, e3, Mlp, Ml, tanphi, Nl1, Nl, psi, Az, G, H, GH, Hs, c, kp, cos_c, s, s2, s3, s4, s5;
      if (this.sphere) {
        if (Math.abs(this.sin_p12 - 1) <= EPSLN) {
          //North Pole case
          p.x = this.x0 + this.a * (HALF_PI - lat) * Math.sin(dlon);
          p.y = this.y0 - this.a * (HALF_PI - lat) * Math.cos(dlon);
          return p;
        }
        else if (Math.abs(this.sin_p12 + 1) <= EPSLN) {
          //South Pole case
          p.x = this.x0 + this.a * (HALF_PI + lat) * Math.sin(dlon);
          p.y = this.y0 + this.a * (HALF_PI + lat) * Math.cos(dlon);
          return p;
        }
        else {
          //default case
          cos_c = this.sin_p12 * sinphi + this.cos_p12 * cosphi * Math.cos(dlon);
          c = Math.acos(cos_c);
          kp = c / Math.sin(c);
          p.x = this.x0 + this.a * kp * cosphi * Math.sin(dlon);
          p.y = this.y0 + this.a * kp * (this.cos_p12 * sinphi - this.sin_p12 * cosphi * Math.cos(dlon));
          return p;
        }
      }
      else {
        e0 = e0fn(this.es);
        e1 = e1fn(this.es);
        e2 = e2fn(this.es);
        e3 = e3fn(this.es);
        if (Math.abs(this.sin_p12 - 1) <= EPSLN) {
          //North Pole case
          Mlp = this.a * mlfn(e0, e1, e2, e3, HALF_PI);
          Ml = this.a * mlfn(e0, e1, e2, e3, lat);
          p.x = this.x0 + (Mlp - Ml) * Math.sin(dlon);
          p.y = this.y0 - (Mlp - Ml) * Math.cos(dlon);
          return p;
        }
        else if (Math.abs(this.sin_p12 + 1) <= EPSLN) {
          //South Pole case
          Mlp = this.a * mlfn(e0, e1, e2, e3, HALF_PI);
          Ml = this.a * mlfn(e0, e1, e2, e3, lat);
          p.x = this.x0 + (Mlp + Ml) * Math.sin(dlon);
          p.y = this.y0 + (Mlp + Ml) * Math.cos(dlon);
          return p;
        }
        else {
          //Default case
          tanphi = sinphi / cosphi;
          Nl1 = gN(this.a, this.e, this.sin_p12);
          Nl = gN(this.a, this.e, sinphi);
          psi = Math.atan((1 - this.es) * tanphi + this.es * Nl1 * this.sin_p12 / (Nl * cosphi));
          Az = Math.atan2(Math.sin(dlon), this.cos_p12 * Math.tan(psi) - this.sin_p12 * Math.cos(dlon));
          if (Az === 0) {
            s = Math.asin(this.cos_p12 * Math.sin(psi) - this.sin_p12 * Math.cos(psi));
          }
          else if (Math.abs(Math.abs(Az) - Math.PI) <= EPSLN) {
            s = -Math.asin(this.cos_p12 * Math.sin(psi) - this.sin_p12 * Math.cos(psi));
          }
          else {
            s = Math.asin(Math.sin(dlon) * Math.cos(psi) / Math.sin(Az));
          }
          G = this.e * this.sin_p12 / Math.sqrt(1 - this.es);
          H = this.e * this.cos_p12 * Math.cos(Az) / Math.sqrt(1 - this.es);
          GH = G * H;
          Hs = H * H;
          s2 = s * s;
          s3 = s2 * s;
          s4 = s3 * s;
          s5 = s4 * s;
          c = Nl1 * s * (1 - s2 * Hs * (1 - Hs) / 6 + s3 / 8 * GH * (1 - 2 * Hs) + s4 / 120 * (Hs * (4 - 7 * Hs) - 3 * G * G * (1 - 7 * Hs)) - s5 / 48 * GH);
          p.x = this.x0 + c * Math.sin(Az);
          p.y = this.y0 + c * Math.cos(Az);
          return p;
        }
      }


    }

    function inverse$o(p) {
      p.x -= this.x0;
      p.y -= this.y0;
      var rh, z, sinz, cosz, lon, lat, con, e0, e1, e2, e3, Mlp, M, N1, psi, Az, cosAz, tmp, A, B, D, Ee, F;
      if (this.sphere) {
        rh = Math.sqrt(p.x * p.x + p.y * p.y);
        if (rh > (2 * HALF_PI * this.a)) {
          return;
        }
        z = rh / this.a;

        sinz = Math.sin(z);
        cosz = Math.cos(z);

        lon = this.long0;
        if (Math.abs(rh) <= EPSLN) {
          lat = this.lat0;
        }
        else {
          lat = asinz(cosz * this.sin_p12 + (p.y * sinz * this.cos_p12) / rh);
          con = Math.abs(this.lat0) - HALF_PI;
          if (Math.abs(con) <= EPSLN) {
            if (this.lat0 >= 0) {
              lon = adjust_lon(this.long0 + Math.atan2(p.x, - p.y));
            }
            else {
              lon = adjust_lon(this.long0 - Math.atan2(-p.x, p.y));
            }
          }
          else {
            /*con = cosz - this.sin_p12 * Math.sin(lat);
            if ((Math.abs(con) < EPSLN) && (Math.abs(p.x) < EPSLN)) {
              //no-op, just keep the lon value as is
            } else {
              var temp = Math.atan2((p.x * sinz * this.cos_p12), (con * rh));
              lon = adjust_lon(this.long0 + Math.atan2((p.x * sinz * this.cos_p12), (con * rh)));
            }*/
            lon = adjust_lon(this.long0 + Math.atan2(p.x * sinz, rh * this.cos_p12 * cosz - p.y * this.sin_p12 * sinz));
          }
        }

        p.x = lon;
        p.y = lat;
        return p;
      }
      else {
        e0 = e0fn(this.es);
        e1 = e1fn(this.es);
        e2 = e2fn(this.es);
        e3 = e3fn(this.es);
        if (Math.abs(this.sin_p12 - 1) <= EPSLN) {
          //North pole case
          Mlp = this.a * mlfn(e0, e1, e2, e3, HALF_PI);
          rh = Math.sqrt(p.x * p.x + p.y * p.y);
          M = Mlp - rh;
          lat = imlfn(M / this.a, e0, e1, e2, e3);
          lon = adjust_lon(this.long0 + Math.atan2(p.x, - 1 * p.y));
          p.x = lon;
          p.y = lat;
          return p;
        }
        else if (Math.abs(this.sin_p12 + 1) <= EPSLN) {
          //South pole case
          Mlp = this.a * mlfn(e0, e1, e2, e3, HALF_PI);
          rh = Math.sqrt(p.x * p.x + p.y * p.y);
          M = rh - Mlp;

          lat = imlfn(M / this.a, e0, e1, e2, e3);
          lon = adjust_lon(this.long0 + Math.atan2(p.x, p.y));
          p.x = lon;
          p.y = lat;
          return p;
        }
        else {
          //default case
          rh = Math.sqrt(p.x * p.x + p.y * p.y);
          Az = Math.atan2(p.x, p.y);
          N1 = gN(this.a, this.e, this.sin_p12);
          cosAz = Math.cos(Az);
          tmp = this.e * this.cos_p12 * cosAz;
          A = -tmp * tmp / (1 - this.es);
          B = 3 * this.es * (1 - A) * this.sin_p12 * this.cos_p12 * cosAz / (1 - this.es);
          D = rh / N1;
          Ee = D - A * (1 + A) * Math.pow(D, 3) / 6 - B * (1 + 3 * A) * Math.pow(D, 4) / 24;
          F = 1 - A * Ee * Ee / 2 - D * Ee * Ee * Ee / 6;
          psi = Math.asin(this.sin_p12 * Math.cos(Ee) + this.cos_p12 * Math.sin(Ee) * cosAz);
          lon = adjust_lon(this.long0 + Math.asin(Math.sin(Az) * Math.sin(Ee) / Math.cos(psi)));
          lat = Math.atan((1 - this.es * F * this.sin_p12 / Math.sin(psi)) * Math.tan(psi) / (1 - this.es));
          p.x = lon;
          p.y = lat;
          return p;
        }
      }

    }

    var names$q = ["Azimuthal_Equidistant", "aeqd"];
    var aeqd = {
      init: init$u,
      forward: forward$o,
      inverse: inverse$o,
      names: names$q
    };

    function init$v() {
      //double temp;      /* temporary variable    */

      /* Place parameters in static storage for common use
          -------------------------------------------------*/
      this.sin_p14 = Math.sin(this.lat0);
      this.cos_p14 = Math.cos(this.lat0);
    }

    /* Orthographic forward equations--mapping lat,long to x,y
        ---------------------------------------------------*/
    function forward$p(p) {
      var sinphi, cosphi; /* sin and cos value        */
      var dlon; /* delta longitude value      */
      var coslon; /* cos of longitude        */
      var ksp; /* scale factor          */
      var g, x, y;
      var lon = p.x;
      var lat = p.y;
      /* Forward equations
          -----------------*/
      dlon = adjust_lon(lon - this.long0);

      sinphi = Math.sin(lat);
      cosphi = Math.cos(lat);

      coslon = Math.cos(dlon);
      g = this.sin_p14 * sinphi + this.cos_p14 * cosphi * coslon;
      ksp = 1;
      if ((g > 0) || (Math.abs(g) <= EPSLN)) {
        x = this.a * ksp * cosphi * Math.sin(dlon);
        y = this.y0 + this.a * ksp * (this.cos_p14 * sinphi - this.sin_p14 * cosphi * coslon);
      }
      p.x = x;
      p.y = y;
      return p;
    }

    function inverse$p(p) {
      var rh; /* height above ellipsoid      */
      var z; /* angle          */
      var sinz, cosz; /* sin of z and cos of z      */
      var con;
      var lon, lat;
      /* Inverse equations
          -----------------*/
      p.x -= this.x0;
      p.y -= this.y0;
      rh = Math.sqrt(p.x * p.x + p.y * p.y);
      z = asinz(rh / this.a);

      sinz = Math.sin(z);
      cosz = Math.cos(z);

      lon = this.long0;
      if (Math.abs(rh) <= EPSLN) {
        lat = this.lat0;
        p.x = lon;
        p.y = lat;
        return p;
      }
      lat = asinz(cosz * this.sin_p14 + (p.y * sinz * this.cos_p14) / rh);
      con = Math.abs(this.lat0) - HALF_PI;
      if (Math.abs(con) <= EPSLN) {
        if (this.lat0 >= 0) {
          lon = adjust_lon(this.long0 + Math.atan2(p.x, - p.y));
        }
        else {
          lon = adjust_lon(this.long0 - Math.atan2(-p.x, p.y));
        }
        p.x = lon;
        p.y = lat;
        return p;
      }
      lon = adjust_lon(this.long0 + Math.atan2((p.x * sinz), rh * this.cos_p14 * cosz - p.y * this.sin_p14 * sinz));
      p.x = lon;
      p.y = lat;
      return p;
    }

    var names$r = ["ortho"];
    var ortho = {
      init: init$v,
      forward: forward$p,
      inverse: inverse$p,
      names: names$r
    };

    // QSC projection rewritten from the original PROJ4

    /* constants */
    var FACE_ENUM = {
        FRONT: 1,
        RIGHT: 2,
        BACK: 3,
        LEFT: 4,
        TOP: 5,
        BOTTOM: 6
    };

    var AREA_ENUM = {
        AREA_0: 1,
        AREA_1: 2,
        AREA_2: 3,
        AREA_3: 4
    };

    function init$w() {

      this.x0 = this.x0 || 0;
      this.y0 = this.y0 || 0;
      this.lat0 = this.lat0 || 0;
      this.long0 = this.long0 || 0;
      this.lat_ts = this.lat_ts || 0;
      this.title = this.title || "Quadrilateralized Spherical Cube";

      /* Determine the cube face from the center of projection. */
      if (this.lat0 >= HALF_PI - FORTPI / 2.0) {
        this.face = FACE_ENUM.TOP;
      } else if (this.lat0 <= -(HALF_PI - FORTPI / 2.0)) {
        this.face = FACE_ENUM.BOTTOM;
      } else if (Math.abs(this.long0) <= FORTPI) {
        this.face = FACE_ENUM.FRONT;
      } else if (Math.abs(this.long0) <= HALF_PI + FORTPI) {
        this.face = this.long0 > 0.0 ? FACE_ENUM.RIGHT : FACE_ENUM.LEFT;
      } else {
        this.face = FACE_ENUM.BACK;
      }

      /* Fill in useful values for the ellipsoid <-> sphere shift
       * described in [LK12]. */
      if (this.es !== 0) {
        this.one_minus_f = 1 - (this.a - this.b) / this.a;
        this.one_minus_f_squared = this.one_minus_f * this.one_minus_f;
      }
    }

    // QSC forward equations--mapping lat,long to x,y
    // -----------------------------------------------------------------
    function forward$q(p) {
      var xy = {x: 0, y: 0};
      var lat, lon;
      var theta, phi;
      var t, mu;
      /* nu; */
      var area = {value: 0};

      // move lon according to projection's lon
      p.x -= this.long0;

      /* Convert the geodetic latitude to a geocentric latitude.
       * This corresponds to the shift from the ellipsoid to the sphere
       * described in [LK12]. */
      if (this.es !== 0) {//if (P->es != 0) {
        lat = Math.atan(this.one_minus_f_squared * Math.tan(p.y));
      } else {
        lat = p.y;
      }

      /* Convert the input lat, lon into theta, phi as used by QSC.
       * This depends on the cube face and the area on it.
       * For the top and bottom face, we can compute theta and phi
       * directly from phi, lam. For the other faces, we must use
       * unit sphere cartesian coordinates as an intermediate step. */
      lon = p.x; //lon = lp.lam;
      if (this.face === FACE_ENUM.TOP) {
        phi = HALF_PI - lat;
        if (lon >= FORTPI && lon <= HALF_PI + FORTPI) {
          area.value = AREA_ENUM.AREA_0;
          theta = lon - HALF_PI;
        } else if (lon > HALF_PI + FORTPI || lon <= -(HALF_PI + FORTPI)) {
          area.value = AREA_ENUM.AREA_1;
          theta = (lon > 0.0 ? lon - SPI : lon + SPI);
        } else if (lon > -(HALF_PI + FORTPI) && lon <= -FORTPI) {
          area.value = AREA_ENUM.AREA_2;
          theta = lon + HALF_PI;
        } else {
          area.value = AREA_ENUM.AREA_3;
          theta = lon;
        }
      } else if (this.face === FACE_ENUM.BOTTOM) {
        phi = HALF_PI + lat;
        if (lon >= FORTPI && lon <= HALF_PI + FORTPI) {
          area.value = AREA_ENUM.AREA_0;
          theta = -lon + HALF_PI;
        } else if (lon < FORTPI && lon >= -FORTPI) {
          area.value = AREA_ENUM.AREA_1;
          theta = -lon;
        } else if (lon < -FORTPI && lon >= -(HALF_PI + FORTPI)) {
          area.value = AREA_ENUM.AREA_2;
          theta = -lon - HALF_PI;
        } else {
          area.value = AREA_ENUM.AREA_3;
          theta = (lon > 0.0 ? -lon + SPI : -lon - SPI);
        }
      } else {
        var q, r, s;
        var sinlat, coslat;
        var sinlon, coslon;

        if (this.face === FACE_ENUM.RIGHT) {
          lon = qsc_shift_lon_origin(lon, +HALF_PI);
        } else if (this.face === FACE_ENUM.BACK) {
          lon = qsc_shift_lon_origin(lon, +SPI);
        } else if (this.face === FACE_ENUM.LEFT) {
          lon = qsc_shift_lon_origin(lon, -HALF_PI);
        }
        sinlat = Math.sin(lat);
        coslat = Math.cos(lat);
        sinlon = Math.sin(lon);
        coslon = Math.cos(lon);
        q = coslat * coslon;
        r = coslat * sinlon;
        s = sinlat;

        if (this.face === FACE_ENUM.FRONT) {
          phi = Math.acos(q);
          theta = qsc_fwd_equat_face_theta(phi, s, r, area);
        } else if (this.face === FACE_ENUM.RIGHT) {
          phi = Math.acos(r);
          theta = qsc_fwd_equat_face_theta(phi, s, -q, area);
        } else if (this.face === FACE_ENUM.BACK) {
          phi = Math.acos(-q);
          theta = qsc_fwd_equat_face_theta(phi, s, -r, area);
        } else if (this.face === FACE_ENUM.LEFT) {
          phi = Math.acos(-r);
          theta = qsc_fwd_equat_face_theta(phi, s, q, area);
        } else {
          /* Impossible */
          phi = theta = 0;
          area.value = AREA_ENUM.AREA_0;
        }
      }

      /* Compute mu and nu for the area of definition.
       * For mu, see Eq. (3-21) in [OL76], but note the typos:
       * compare with Eq. (3-14). For nu, see Eq. (3-38). */
      mu = Math.atan((12 / SPI) * (theta + Math.acos(Math.sin(theta) * Math.cos(FORTPI)) - HALF_PI));
      t = Math.sqrt((1 - Math.cos(phi)) / (Math.cos(mu) * Math.cos(mu)) / (1 - Math.cos(Math.atan(1 / Math.cos(theta)))));

      /* Apply the result to the real area. */
      if (area.value === AREA_ENUM.AREA_1) {
        mu += HALF_PI;
      } else if (area.value === AREA_ENUM.AREA_2) {
        mu += SPI;
      } else if (area.value === AREA_ENUM.AREA_3) {
        mu += 1.5 * SPI;
      }

      /* Now compute x, y from mu and nu */
      xy.x = t * Math.cos(mu);
      xy.y = t * Math.sin(mu);
      xy.x = xy.x * this.a + this.x0;
      xy.y = xy.y * this.a + this.y0;

      p.x = xy.x;
      p.y = xy.y;
      return p;
    }

    // QSC inverse equations--mapping x,y to lat/long
    // -----------------------------------------------------------------
    function inverse$q(p) {
      var lp = {lam: 0, phi: 0};
      var mu, nu, cosmu, tannu;
      var tantheta, theta, cosphi, phi;
      var t;
      var area = {value: 0};

      /* de-offset */
      p.x = (p.x - this.x0) / this.a;
      p.y = (p.y - this.y0) / this.a;

      /* Convert the input x, y to the mu and nu angles as used by QSC.
       * This depends on the area of the cube face. */
      nu = Math.atan(Math.sqrt(p.x * p.x + p.y * p.y));
      mu = Math.atan2(p.y, p.x);
      if (p.x >= 0.0 && p.x >= Math.abs(p.y)) {
        area.value = AREA_ENUM.AREA_0;
      } else if (p.y >= 0.0 && p.y >= Math.abs(p.x)) {
        area.value = AREA_ENUM.AREA_1;
        mu -= HALF_PI;
      } else if (p.x < 0.0 && -p.x >= Math.abs(p.y)) {
        area.value = AREA_ENUM.AREA_2;
        mu = (mu < 0.0 ? mu + SPI : mu - SPI);
      } else {
        area.value = AREA_ENUM.AREA_3;
        mu += HALF_PI;
      }

      /* Compute phi and theta for the area of definition.
       * The inverse projection is not described in the original paper, but some
       * good hints can be found here (as of 2011-12-14):
       * http://fits.gsfc.nasa.gov/fitsbits/saf.93/saf.9302
       * (search for "Message-Id: <9302181759.AA25477 at fits.cv.nrao.edu>") */
      t = (SPI / 12) * Math.tan(mu);
      tantheta = Math.sin(t) / (Math.cos(t) - (1 / Math.sqrt(2)));
      theta = Math.atan(tantheta);
      cosmu = Math.cos(mu);
      tannu = Math.tan(nu);
      cosphi = 1 - cosmu * cosmu * tannu * tannu * (1 - Math.cos(Math.atan(1 / Math.cos(theta))));
      if (cosphi < -1) {
        cosphi = -1;
      } else if (cosphi > +1) {
        cosphi = +1;
      }

      /* Apply the result to the real area on the cube face.
       * For the top and bottom face, we can compute phi and lam directly.
       * For the other faces, we must use unit sphere cartesian coordinates
       * as an intermediate step. */
      if (this.face === FACE_ENUM.TOP) {
        phi = Math.acos(cosphi);
        lp.phi = HALF_PI - phi;
        if (area.value === AREA_ENUM.AREA_0) {
          lp.lam = theta + HALF_PI;
        } else if (area.value === AREA_ENUM.AREA_1) {
          lp.lam = (theta < 0.0 ? theta + SPI : theta - SPI);
        } else if (area.value === AREA_ENUM.AREA_2) {
          lp.lam = theta - HALF_PI;
        } else /* area.value == AREA_ENUM.AREA_3 */ {
          lp.lam = theta;
        }
      } else if (this.face === FACE_ENUM.BOTTOM) {
        phi = Math.acos(cosphi);
        lp.phi = phi - HALF_PI;
        if (area.value === AREA_ENUM.AREA_0) {
          lp.lam = -theta + HALF_PI;
        } else if (area.value === AREA_ENUM.AREA_1) {
          lp.lam = -theta;
        } else if (area.value === AREA_ENUM.AREA_2) {
          lp.lam = -theta - HALF_PI;
        } else /* area.value == AREA_ENUM.AREA_3 */ {
          lp.lam = (theta < 0.0 ? -theta - SPI : -theta + SPI);
        }
      } else {
        /* Compute phi and lam via cartesian unit sphere coordinates. */
        var q, r, s;
        q = cosphi;
        t = q * q;
        if (t >= 1) {
          s = 0;
        } else {
          s = Math.sqrt(1 - t) * Math.sin(theta);
        }
        t += s * s;
        if (t >= 1) {
          r = 0;
        } else {
          r = Math.sqrt(1 - t);
        }
        /* Rotate q,r,s into the correct area. */
        if (area.value === AREA_ENUM.AREA_1) {
          t = r;
          r = -s;
          s = t;
        } else if (area.value === AREA_ENUM.AREA_2) {
          r = -r;
          s = -s;
        } else if (area.value === AREA_ENUM.AREA_3) {
          t = r;
          r = s;
          s = -t;
        }
        /* Rotate q,r,s into the correct cube face. */
        if (this.face === FACE_ENUM.RIGHT) {
          t = q;
          q = -r;
          r = t;
        } else if (this.face === FACE_ENUM.BACK) {
          q = -q;
          r = -r;
        } else if (this.face === FACE_ENUM.LEFT) {
          t = q;
          q = r;
          r = -t;
        }
        /* Now compute phi and lam from the unit sphere coordinates. */
        lp.phi = Math.acos(-s) - HALF_PI;
        lp.lam = Math.atan2(r, q);
        if (this.face === FACE_ENUM.RIGHT) {
          lp.lam = qsc_shift_lon_origin(lp.lam, -HALF_PI);
        } else if (this.face === FACE_ENUM.BACK) {
          lp.lam = qsc_shift_lon_origin(lp.lam, -SPI);
        } else if (this.face === FACE_ENUM.LEFT) {
          lp.lam = qsc_shift_lon_origin(lp.lam, +HALF_PI);
        }
      }

      /* Apply the shift from the sphere to the ellipsoid as described
       * in [LK12]. */
      if (this.es !== 0) {
        var invert_sign;
        var tanphi, xa;
        invert_sign = (lp.phi < 0 ? 1 : 0);
        tanphi = Math.tan(lp.phi);
        xa = this.b / Math.sqrt(tanphi * tanphi + this.one_minus_f_squared);
        lp.phi = Math.atan(Math.sqrt(this.a * this.a - xa * xa) / (this.one_minus_f * xa));
        if (invert_sign) {
          lp.phi = -lp.phi;
        }
      }

      lp.lam += this.long0;
      p.x = lp.lam;
      p.y = lp.phi;
      return p;
    }

    /* Helper function for forward projection: compute the theta angle
     * and determine the area number. */
    function qsc_fwd_equat_face_theta(phi, y, x, area) {
      var theta;
      if (phi < EPSLN) {
        area.value = AREA_ENUM.AREA_0;
        theta = 0.0;
      } else {
        theta = Math.atan2(y, x);
        if (Math.abs(theta) <= FORTPI) {
          area.value = AREA_ENUM.AREA_0;
        } else if (theta > FORTPI && theta <= HALF_PI + FORTPI) {
          area.value = AREA_ENUM.AREA_1;
          theta -= HALF_PI;
        } else if (theta > HALF_PI + FORTPI || theta <= -(HALF_PI + FORTPI)) {
          area.value = AREA_ENUM.AREA_2;
          theta = (theta >= 0.0 ? theta - SPI : theta + SPI);
        } else {
          area.value = AREA_ENUM.AREA_3;
          theta += HALF_PI;
        }
      }
      return theta;
    }

    /* Helper function: shift the longitude. */
    function qsc_shift_lon_origin(lon, offset) {
      var slon = lon + offset;
      if (slon < -SPI) {
        slon += TWO_PI;
      } else if (slon > +SPI) {
        slon -= TWO_PI;
      }
      return slon;
    }

    var names$s = ["Quadrilateralized Spherical Cube", "Quadrilateralized_Spherical_Cube", "qsc"];
    var qsc = {
      init: init$w,
      forward: forward$q,
      inverse: inverse$q,
      names: names$s
    };

    // Robinson projection

    var COEFS_X = [
        [1.0000, 2.2199e-17, -7.15515e-05, 3.1103e-06],
        [0.9986, -0.000482243, -2.4897e-05, -1.3309e-06],
        [0.9954, -0.00083103, -4.48605e-05, -9.86701e-07],
        [0.9900, -0.00135364, -5.9661e-05, 3.6777e-06],
        [0.9822, -0.00167442, -4.49547e-06, -5.72411e-06],
        [0.9730, -0.00214868, -9.03571e-05, 1.8736e-08],
        [0.9600, -0.00305085, -9.00761e-05, 1.64917e-06],
        [0.9427, -0.00382792, -6.53386e-05, -2.6154e-06],
        [0.9216, -0.00467746, -0.00010457, 4.81243e-06],
        [0.8962, -0.00536223, -3.23831e-05, -5.43432e-06],
        [0.8679, -0.00609363, -0.000113898, 3.32484e-06],
        [0.8350, -0.00698325, -6.40253e-05, 9.34959e-07],
        [0.7986, -0.00755338, -5.00009e-05, 9.35324e-07],
        [0.7597, -0.00798324, -3.5971e-05, -2.27626e-06],
        [0.7186, -0.00851367, -7.01149e-05, -8.6303e-06],
        [0.6732, -0.00986209, -0.000199569, 1.91974e-05],
        [0.6213, -0.010418, 8.83923e-05, 6.24051e-06],
        [0.5722, -0.00906601, 0.000182, 6.24051e-06],
        [0.5322, -0.00677797, 0.000275608, 6.24051e-06]
    ];

    var COEFS_Y = [
        [-5.20417e-18, 0.0124, 1.21431e-18, -8.45284e-11],
        [0.0620, 0.0124, -1.26793e-09, 4.22642e-10],
        [0.1240, 0.0124, 5.07171e-09, -1.60604e-09],
        [0.1860, 0.0123999, -1.90189e-08, 6.00152e-09],
        [0.2480, 0.0124002, 7.10039e-08, -2.24e-08],
        [0.3100, 0.0123992, -2.64997e-07, 8.35986e-08],
        [0.3720, 0.0124029, 9.88983e-07, -3.11994e-07],
        [0.4340, 0.0123893, -3.69093e-06, -4.35621e-07],
        [0.4958, 0.0123198, -1.02252e-05, -3.45523e-07],
        [0.5571, 0.0121916, -1.54081e-05, -5.82288e-07],
        [0.6176, 0.0119938, -2.41424e-05, -5.25327e-07],
        [0.6769, 0.011713, -3.20223e-05, -5.16405e-07],
        [0.7346, 0.0113541, -3.97684e-05, -6.09052e-07],
        [0.7903, 0.0109107, -4.89042e-05, -1.04739e-06],
        [0.8435, 0.0103431, -6.4615e-05, -1.40374e-09],
        [0.8936, 0.00969686, -6.4636e-05, -8.547e-06],
        [0.9394, 0.00840947, -0.000192841, -4.2106e-06],
        [0.9761, 0.00616527, -0.000256, -4.2106e-06],
        [1.0000, 0.00328947, -0.000319159, -4.2106e-06]
    ];

    var FXC = 0.8487;
    var FYC = 1.3523;
    var C1 = R2D/5; // rad to 5-degree interval
    var RC1 = 1/C1;
    var NODES = 18;

    var poly3_val = function(coefs, x) {
        return coefs[0] + x * (coefs[1] + x * (coefs[2] + x * coefs[3]));
    };

    var poly3_der = function(coefs, x) {
        return coefs[1] + x * (2 * coefs[2] + x * 3 * coefs[3]);
    };

    function newton_rapshon(f_df, start, max_err, iters) {
        var x = start;
        for (; iters; --iters) {
            var upd = f_df(x);
            x -= upd;
            if (Math.abs(upd) < max_err) {
                break;
            }
        }
        return x;
    }

    function init$x() {
        this.x0 = this.x0 || 0;
        this.y0 = this.y0 || 0;
        this.long0 = this.long0 || 0;
        this.es = 0;
        this.title = this.title || "Robinson";
    }

    function forward$r(ll) {
        var lon = adjust_lon(ll.x - this.long0);

        var dphi = Math.abs(ll.y);
        var i = Math.floor(dphi * C1);
        if (i < 0) {
            i = 0;
        } else if (i >= NODES) {
            i = NODES - 1;
        }
        dphi = R2D * (dphi - RC1 * i);
        var xy = {
            x: poly3_val(COEFS_X[i], dphi) * lon,
            y: poly3_val(COEFS_Y[i], dphi)
        };
        if (ll.y < 0) {
            xy.y = -xy.y;
        }

        xy.x = xy.x * this.a * FXC + this.x0;
        xy.y = xy.y * this.a * FYC + this.y0;
        return xy;
    }

    function inverse$r(xy) {
        var ll = {
            x: (xy.x - this.x0) / (this.a * FXC),
            y: Math.abs(xy.y - this.y0) / (this.a * FYC)
        };

        if (ll.y >= 1) { // pathologic case
            ll.x /= COEFS_X[NODES][0];
            ll.y = xy.y < 0 ? -HALF_PI : HALF_PI;
        } else {
            // find table interval
            var i = Math.floor(ll.y * NODES);
            if (i < 0) {
                i = 0;
            } else if (i >= NODES) {
                i = NODES - 1;
            }
            for (;;) {
                if (COEFS_Y[i][0] > ll.y) {
                    --i;
                } else if (COEFS_Y[i+1][0] <= ll.y) {
                    ++i;
                } else {
                    break;
                }
            }
            // linear interpolation in 5 degree interval
            var coefs = COEFS_Y[i];
            var t = 5 * (ll.y - coefs[0]) / (COEFS_Y[i+1][0] - coefs[0]);
            // find t so that poly3_val(coefs, t) = ll.y
            t = newton_rapshon(function(x) {
                return (poly3_val(coefs, x) - ll.y) / poly3_der(coefs, x);
            }, t, EPSLN, 100);

            ll.x /= poly3_val(COEFS_X[i], t);
            ll.y = (5 * i + t) * D2R;
            if (xy.y < 0) {
                ll.y = -ll.y;
            }
        }

        ll.x = adjust_lon(ll.x + this.long0);
        return ll;
    }

    var names$t = ["Robinson", "robin"];
    var robin = {
      init: init$x,
      forward: forward$r,
      inverse: inverse$r,
      names: names$t
    };

    function includedProjections(proj4){
      proj4.Proj.projections.add(tmerc);
      proj4.Proj.projections.add(etmerc);
      proj4.Proj.projections.add(utm);
      proj4.Proj.projections.add(sterea);
      proj4.Proj.projections.add(stere);
      proj4.Proj.projections.add(somerc);
      proj4.Proj.projections.add(omerc);
      proj4.Proj.projections.add(lcc);
      proj4.Proj.projections.add(krovak);
      proj4.Proj.projections.add(cass);
      proj4.Proj.projections.add(laea);
      proj4.Proj.projections.add(aea);
      proj4.Proj.projections.add(gnom);
      proj4.Proj.projections.add(cea);
      proj4.Proj.projections.add(eqc);
      proj4.Proj.projections.add(poly);
      proj4.Proj.projections.add(nzmg);
      proj4.Proj.projections.add(mill);
      proj4.Proj.projections.add(sinu);
      proj4.Proj.projections.add(moll);
      proj4.Proj.projections.add(eqdc);
      proj4.Proj.projections.add(vandg);
      proj4.Proj.projections.add(aeqd);
      proj4.Proj.projections.add(ortho);
      proj4.Proj.projections.add(qsc);
      proj4.Proj.projections.add(robin);
    }

    proj4.defaultDatum = 'WGS84'; //default datum
    proj4.Proj = Projection;
    proj4.WGS84 = new proj4.Proj('WGS84');
    proj4.Point = Point$1;
    proj4.toPoint = common;
    proj4.defs = defs;
    proj4.transform = transform;
    proj4.mgrs = mgrs;
    proj4.version = version$1;
    includedProjections(proj4);

    function reproject (data, reprojectInstructions) {
      if (!data.hasOwnProperty('$geometry')) {
        warn('No geometry column found. Skipping reproject-transformation.');
        return data
      }

      if (!reprojectInstructions.hasOwnProperty('to')) {
        warn(`reproject: missing required option 'to'`);
        return data
      }

      let from = 'WGS84';
      if (reprojectInstructions.hasOwnProperty('from')) {
        from = reprojectInstructions.from;
      }

      let transformation = proj4(from, reprojectInstructions.to).forward;

      let transformedGeometries = transformGeometries(data.$geometry, transformation);
      data.$geometry = transformedGeometries;

      return data
    }

    function transform$1 (data, transformFunction) {
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
      reproject,
      transform: transform$1
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

      reproject (reprojectInstructions) {
        this._data = transformations.reproject(this._data, reprojectInstructions);
        return this
      }

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

      reproject (reprojectInstructions) {
        return proxyTransformationCall(this._data, 'reproject', reprojectInstructions)
      },

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

    function transformationsMixin (targetClass) {
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
          this._setColumnData(data);
          return
        }

        if (isRowOriented(data)) {
          this._setRowData(data);
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

      map (columnPath, mapFunction) {
        checkColumnPath(columnPath, this);
        return mapColumn(columnPath, this, mapFunction)
      }

      updateRow (index, row) {
        let rowNumber = this._indexToRowNumber[index];

        for (let key in row) {
          checkIfColumnExists(key, this);

          if (key === '$index') {
            warn(`Cannot update '$index' of row`);
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
    transformationsMixin(DataContainer);

    const invalidDataError = new Error('Data passed to DataContainer is of unknown format');

    /* test/integration/testing-app/src/pages/Rectangles.svelte generated by Svelte v3.6.5 */

    // (35:2) <Section     x1={50} x2={450}     y1={50} y2={450}     scaleX={scaleFruit}    scaleY={scaleMeanQuantity}   >
    function create_default_slot_1(ctx) {
    	var current;

    	var rectanglelayer = new RectangleLayer({
    		props: {
    		x1: ctx.data.column('fruit'),
    		x2: ctx.func,
    		y1: 0,
    		y2: ctx.data.column('meanQuantity'),
    		onClick: ctx.func_1,
    		fill: ctx.isActive ? 'blue' : 'yellow'
    	},
    		$$inline: true
    	});

    	return {
    		c: function create() {
    			rectanglelayer.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(rectanglelayer, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var rectanglelayer_changes = {};
    			if (changed.data) rectanglelayer_changes.x1 = ctx.data.column('fruit');
    			if (changed.data) rectanglelayer_changes.x2 = ctx.func;
    			if (changed.data) rectanglelayer_changes.y2 = ctx.data.column('meanQuantity');
    			if (changed.isActive) rectanglelayer_changes.onClick = ctx.func_1;
    			if (changed.isActive) rectanglelayer_changes.fill = ctx.isActive ? 'blue' : 'yellow';
    			rectanglelayer.$set(rectanglelayer_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(rectanglelayer.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(rectanglelayer.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(rectanglelayer, detaching);
    		}
    	};
    }

    // (29:0) <Graphic    width={500} {height}   scaleX={scaleLinear().domain([0, 500])}   scaleY={scaleLinear().domain([0, 500])} >
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
    		$$slots: { default: [create_default_slot_1] },
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
    			if (changed.$$scope || changed.data || changed.isActive) section_changes.$$scope = { changed, ctx };
    			section.$set(section_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(section.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(section.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(section, detaching);
    		}
    	};
    }

    function create_fragment$6(ctx) {
    	var current;

    	var graphic = new Graphic({
    		props: {
    		width: 500,
    		height: height,
    		scaleX: linear$1().domain([0, 500]),
    		scaleY: linear$1().domain([0, 500]),
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
    			if (changed.height) graphic_changes.height = height;
    			if (changed.scaleLinear) graphic_changes.scaleX = linear$1().domain([0, 500]);
    			if (changed.scaleLinear) graphic_changes.scaleY = linear$1().domain([0, 500]);
    			if (changed.$$scope || changed.data || changed.isActive) graphic_changes.$$scope = { changed, ctx };
    			graphic.$set(graphic_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(graphic.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(graphic.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(graphic, detaching);
    		}
    	};
    }

    let height = 500;

    function instance$6($$self, $$props, $$invalidate) {
    	
      
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


      const scaleFruit = band().domain(data.domain('fruit')).padding(0.2);
    	let meanQuantityDomain = [0, data.domain('meanQuantity')[1]];
      const scaleMeanQuantity = linear$1().domain(meanQuantityDomain);
      let isActive = false;

      const log = console.log;

    	function func({ scaleX }) {
    		return data.map('fruit', v => scaleX(v) + scaleX.bandwidth() );
    	}

    	function func_1() {
    		const $$result = isActive = true;
    		$$invalidate('isActive', isActive);
    		return $$result;
    	}

    	return {
    		data,
    		scaleFruit,
    		scaleMeanQuantity,
    		isActive,
    		func,
    		func_1
    	};
    }

    class Rectangles extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, []);
    	}
    }

    /* test/integration/testing-app/src/App.svelte generated by Svelte v3.6.5 */

    const file$5 = "test/integration/testing-app/src/App.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.component = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.component = list[i];
    	return child_ctx;
    }

    // (21:10) <Link href={component.url}>
    function create_default_slot_1$1(ctx) {
    	var t_value = ctx.component.name, t;

    	return {
    		c: function create() {
    			t = text(t_value);
    		},

    		m: function mount(target, anchor) {
    			insert(target, t, anchor);
    		},

    		p: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(t);
    			}
    		}
    	};
    }

    // (20:4) {#each components as component}
    function create_each_block_1(ctx) {
    	var li, current;

    	var link = new Link({
    		props: {
    		href: ctx.component.url,
    		$$slots: { default: [create_default_slot_1$1] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});

    	return {
    		c: function create() {
    			li = element("li");
    			link.$$.fragment.c();
    			add_location(li, file$5, 20, 6, 427);
    		},

    		m: function mount(target, anchor) {
    			insert(target, li, anchor);
    			mount_component(link, li, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var link_changes = {};
    			if (changed.components) link_changes.href = ctx.component.url;
    			if (changed.$$scope) link_changes.$$scope = { changed, ctx };
    			link.$set(link_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(li);
    			}

    			destroy_component(link, );
    		}
    	};
    }

    // (28:7) {#each components as component}
    function create_each_block$1(ctx) {
    	var current;

    	var route = new Route({
    		props: {
    		path: ctx.component.url,
    		component: ctx.component.component
    	},
    		$$inline: true
    	});

    	return {
    		c: function create() {
    			route.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(route, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var route_changes = {};
    			if (changed.components) route_changes.path = ctx.component.url;
    			if (changed.components) route_changes.component = ctx.component.component;
    			route.$set(route_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(route.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(route.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(route, detaching);
    		}
    	};
    }

    // (26:4) <Router>
    function create_default_slot$1(ctx) {
    	var t, each_1_anchor, current;

    	var route = new Route({
    		props: { path: "/", component: ctx.components[0].component },
    		$$inline: true
    	});

    	var each_value = ctx.components;

    	var each_blocks = [];

    	for (var i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, () => {
    		each_blocks[i] = null;
    	});

    	return {
    		c: function create() {
    			route.$$.fragment.c();
    			t = space();

    			for (var i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},

    		m: function mount(target, anchor) {
    			mount_component(route, target, anchor);
    			insert(target, t, anchor);

    			for (var i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert(target, each_1_anchor, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var route_changes = {};
    			if (changed.components) route_changes.component = ctx.components[0].component;
    			route.$set(route_changes);

    			if (changed.components) {
    				each_value = ctx.components;

    				for (var i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();
    				for (i = each_value.length; i < each_blocks.length; i += 1) out(i);
    				check_outros();
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(route.$$.fragment, local);

    			for (var i = 0; i < each_value.length; i += 1) transition_in(each_blocks[i]);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(route.$$.fragment, local);

    			each_blocks = each_blocks.filter(Boolean);
    			for (let i = 0; i < each_blocks.length; i += 1) transition_out(each_blocks[i]);

    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(route, detaching);

    			if (detaching) {
    				detach(t);
    			}

    			destroy_each(each_blocks, detaching);

    			if (detaching) {
    				detach(each_1_anchor);
    			}
    		}
    	};
    }

    function create_fragment$7(ctx) {
    	var div2, div0, ul, t, div1, current;

    	var each_value_1 = ctx.components;

    	var each_blocks = [];

    	for (var i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, () => {
    		each_blocks[i] = null;
    	});

    	var router = new Router({
    		props: {
    		$$slots: { default: [create_default_slot$1] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});

    	return {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			ul = element("ul");

    			for (var i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			div1 = element("div");
    			router.$$.fragment.c();
    			attr(ul, "class", "toc svelte-tcumm");
    			add_location(ul, file$5, 18, 3, 368);
    			attr(div0, "class", "left-col svelte-tcumm");
    			add_location(div0, file$5, 17, 2, 342);
    			attr(div1, "class", "right-col");
    			add_location(div1, file$5, 24, 2, 521);
    			attr(div2, "class", "flex-grid svelte-tcumm");
    			add_location(div2, file$5, 16, 0, 316);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert(target, div2, anchor);
    			append(div2, div0);
    			append(div0, ul);

    			for (var i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append(div2, t);
    			append(div2, div1);
    			mount_component(router, div1, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (changed.components) {
    				each_value_1 = ctx.components;

    				for (var i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ul, null);
    					}
    				}

    				group_outros();
    				for (i = each_value_1.length; i < each_blocks.length; i += 1) out(i);
    				check_outros();
    			}

    			var router_changes = {};
    			if (changed.$$scope) router_changes.$$scope = { changed, ctx };
    			router.$set(router_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			for (var i = 0; i < each_value_1.length; i += 1) transition_in(each_blocks[i]);

    			transition_in(router.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);
    			for (let i = 0; i < each_blocks.length; i += 1) transition_out(each_blocks[i]);

    			transition_out(router.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach(div2);
    			}

    			destroy_each(each_blocks, detaching);

    			destroy_component(router, );
    		}
    	};
    }

    function instance$7($$self) {
    	


      // and add them to this component array
      let components = [
        { name: "Rectangles",
          url: "/rectangles",
          component: Rectangles
        }
      ];

    	return { components };
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, []);
    	}
    }

    const app = new App({
      target: document.body,
      props: {
        name: 'world'
      }
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
