(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/barber/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/barber/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/barber/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/barber/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/barber/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/barber/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
"[project]/barber/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "QueryClientContext",
    ()=>QueryClientContext,
    "QueryClientProvider",
    ()=>QueryClientProvider,
    "useQueryClient",
    ()=>useQueryClient
]);
// src/QueryClientProvider.tsx
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
"use client";
;
;
var QueryClientContext = __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"](void 0);
var useQueryClient = (queryClient)=>{
    const client = __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"](QueryClientContext);
    if (queryClient) {
        return queryClient;
    }
    if (!client) {
        throw new Error("No QueryClient set, use QueryClientProvider to set one");
    }
    return client;
};
var QueryClientProvider = ({ client, children })=>{
    __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "QueryClientProvider.useEffect": ()=>{
            client.mount();
            return ({
                "QueryClientProvider.useEffect": ()=>{
                    client.unmount();
                }
            })["QueryClientProvider.useEffect"];
        }
    }["QueryClientProvider.useEffect"], [
        client
    ]);
    return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(QueryClientContext.Provider, {
        value: client,
        children
    });
};
;
 //# sourceMappingURL=QueryClientProvider.js.map
}),
"[project]/barber/node_modules/@tanstack/react-query/build/modern/infiniteQueryOptions.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "infiniteQueryOptions",
    ()=>infiniteQueryOptions
]);
// src/infiniteQueryOptions.ts
function infiniteQueryOptions(options) {
    return options;
}
;
 //# sourceMappingURL=infiniteQueryOptions.js.map
}),
"[project]/barber/node_modules/@tanstack/react-query/build/modern/queryOptions.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "queryOptions",
    ()=>queryOptions
]);
// src/queryOptions.ts
function queryOptions(options) {
    return options;
}
;
 //# sourceMappingURL=queryOptions.js.map
}),
"[project]/barber/node_modules/@tanstack/query-core/build/modern/timeoutManager.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TimeoutManager",
    ()=>TimeoutManager,
    "defaultTimeoutProvider",
    ()=>defaultTimeoutProvider,
    "systemSetTimeoutZero",
    ()=>systemSetTimeoutZero,
    "timeoutManager",
    ()=>timeoutManager
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/barber/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
// src/timeoutManager.ts
var defaultTimeoutProvider = {
    // We need the wrapper function syntax below instead of direct references to
    // global setTimeout etc.
    //
    // BAD: `setTimeout: setTimeout`
    // GOOD: `setTimeout: (cb, delay) => setTimeout(cb, delay)`
    //
    // If we use direct references here, then anything that wants to spy on or
    // replace the global setTimeout (like tests) won't work since we'll already
    // have a hard reference to the original implementation at the time when this
    // file was imported.
    setTimeout: (callback, delay)=>setTimeout(callback, delay),
    clearTimeout: (timeoutId)=>clearTimeout(timeoutId),
    setInterval: (callback, delay)=>setInterval(callback, delay),
    clearInterval: (intervalId)=>clearInterval(intervalId)
};
var TimeoutManager = class {
    // We cannot have TimeoutManager<T> as we must instantiate it with a concrete
    // type at app boot; and if we leave that type, then any new timer provider
    // would need to support ReturnType<typeof setTimeout>, which is infeasible.
    //
    // We settle for type safety for the TimeoutProvider type, and accept that
    // this class is unsafe internally to allow for extension.
    #provider = defaultTimeoutProvider;
    #providerCalled = false;
    setTimeoutProvider(provider) {
        if ("TURBOPACK compile-time truthy", 1) {
            if (this.#providerCalled && provider !== this.#provider) {
                console.error(`[timeoutManager]: Switching provider after calls to previous provider might result in unexpected behavior.`, {
                    previous: this.#provider,
                    provider
                });
            }
        }
        this.#provider = provider;
        if (("TURBOPACK compile-time value", "development") !== "production") {
            this.#providerCalled = false;
        }
    }
    setTimeout(callback, delay) {
        if (("TURBOPACK compile-time value", "development") !== "production") {
            this.#providerCalled = true;
        }
        return this.#provider.setTimeout(callback, delay);
    }
    clearTimeout(timeoutId) {
        this.#provider.clearTimeout(timeoutId);
    }
    setInterval(callback, delay) {
        if (("TURBOPACK compile-time value", "development") !== "production") {
            this.#providerCalled = true;
        }
        return this.#provider.setInterval(callback, delay);
    }
    clearInterval(intervalId) {
        this.#provider.clearInterval(intervalId);
    }
};
var timeoutManager = new TimeoutManager();
function systemSetTimeoutZero(callback) {
    setTimeout(callback, 0);
}
;
 //# sourceMappingURL=timeoutManager.js.map
}),
"[project]/barber/node_modules/@tanstack/query-core/build/modern/utils.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addConsumeAwareSignal",
    ()=>addConsumeAwareSignal,
    "addToEnd",
    ()=>addToEnd,
    "addToStart",
    ()=>addToStart,
    "ensureQueryFn",
    ()=>ensureQueryFn,
    "functionalUpdate",
    ()=>functionalUpdate,
    "hashKey",
    ()=>hashKey,
    "hashQueryKeyByOptions",
    ()=>hashQueryKeyByOptions,
    "isPlainArray",
    ()=>isPlainArray,
    "isPlainObject",
    ()=>isPlainObject,
    "isServer",
    ()=>isServer,
    "isValidTimeout",
    ()=>isValidTimeout,
    "keepPreviousData",
    ()=>keepPreviousData,
    "matchMutation",
    ()=>matchMutation,
    "matchQuery",
    ()=>matchQuery,
    "noop",
    ()=>noop,
    "partialMatchKey",
    ()=>partialMatchKey,
    "replaceData",
    ()=>replaceData,
    "replaceEqualDeep",
    ()=>replaceEqualDeep,
    "resolveEnabled",
    ()=>resolveEnabled,
    "resolveStaleTime",
    ()=>resolveStaleTime,
    "shallowEqualObjects",
    ()=>shallowEqualObjects,
    "shouldThrowError",
    ()=>shouldThrowError,
    "skipToken",
    ()=>skipToken,
    "sleep",
    ()=>sleep,
    "timeUntilStale",
    ()=>timeUntilStale
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/barber/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
// src/utils.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$timeoutManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/@tanstack/query-core/build/modern/timeoutManager.js [app-client] (ecmascript)");
;
var isServer = typeof window === "undefined" || "Deno" in globalThis;
function noop() {}
function functionalUpdate(updater, input) {
    return typeof updater === "function" ? updater(input) : updater;
}
function isValidTimeout(value) {
    return typeof value === "number" && value >= 0 && value !== Infinity;
}
function timeUntilStale(updatedAt, staleTime) {
    return Math.max(updatedAt + (staleTime || 0) - Date.now(), 0);
}
function resolveStaleTime(staleTime, query) {
    return typeof staleTime === "function" ? staleTime(query) : staleTime;
}
function resolveEnabled(enabled, query) {
    return typeof enabled === "function" ? enabled(query) : enabled;
}
function matchQuery(filters, query) {
    const { type = "all", exact, fetchStatus, predicate, queryKey, stale } = filters;
    if (queryKey) {
        if (exact) {
            if (query.queryHash !== hashQueryKeyByOptions(queryKey, query.options)) {
                return false;
            }
        } else if (!partialMatchKey(query.queryKey, queryKey)) {
            return false;
        }
    }
    if (type !== "all") {
        const isActive = query.isActive();
        if (type === "active" && !isActive) {
            return false;
        }
        if (type === "inactive" && isActive) {
            return false;
        }
    }
    if (typeof stale === "boolean" && query.isStale() !== stale) {
        return false;
    }
    if (fetchStatus && fetchStatus !== query.state.fetchStatus) {
        return false;
    }
    if (predicate && !predicate(query)) {
        return false;
    }
    return true;
}
function matchMutation(filters, mutation) {
    const { exact, status, predicate, mutationKey } = filters;
    if (mutationKey) {
        if (!mutation.options.mutationKey) {
            return false;
        }
        if (exact) {
            if (hashKey(mutation.options.mutationKey) !== hashKey(mutationKey)) {
                return false;
            }
        } else if (!partialMatchKey(mutation.options.mutationKey, mutationKey)) {
            return false;
        }
    }
    if (status && mutation.state.status !== status) {
        return false;
    }
    if (predicate && !predicate(mutation)) {
        return false;
    }
    return true;
}
function hashQueryKeyByOptions(queryKey, options) {
    const hashFn = options?.queryKeyHashFn || hashKey;
    return hashFn(queryKey);
}
function hashKey(queryKey) {
    return JSON.stringify(queryKey, (_, val)=>isPlainObject(val) ? Object.keys(val).sort().reduce((result, key)=>{
            result[key] = val[key];
            return result;
        }, {}) : val);
}
function partialMatchKey(a, b) {
    if (a === b) {
        return true;
    }
    if (typeof a !== typeof b) {
        return false;
    }
    if (a && b && typeof a === "object" && typeof b === "object") {
        return Object.keys(b).every((key)=>partialMatchKey(a[key], b[key]));
    }
    return false;
}
var hasOwn = Object.prototype.hasOwnProperty;
function replaceEqualDeep(a, b, depth = 0) {
    if (a === b) {
        return a;
    }
    if (depth > 500) return b;
    const array = isPlainArray(a) && isPlainArray(b);
    if (!array && !(isPlainObject(a) && isPlainObject(b))) return b;
    const aItems = array ? a : Object.keys(a);
    const aSize = aItems.length;
    const bItems = array ? b : Object.keys(b);
    const bSize = bItems.length;
    const copy = array ? new Array(bSize) : {};
    let equalItems = 0;
    for(let i = 0; i < bSize; i++){
        const key = array ? i : bItems[i];
        const aItem = a[key];
        const bItem = b[key];
        if (aItem === bItem) {
            copy[key] = aItem;
            if (array ? i < aSize : hasOwn.call(a, key)) equalItems++;
            continue;
        }
        if (aItem === null || bItem === null || typeof aItem !== "object" || typeof bItem !== "object") {
            copy[key] = bItem;
            continue;
        }
        const v = replaceEqualDeep(aItem, bItem, depth + 1);
        copy[key] = v;
        if (v === aItem) equalItems++;
    }
    return aSize === bSize && equalItems === aSize ? a : copy;
}
function shallowEqualObjects(a, b) {
    if (!b || Object.keys(a).length !== Object.keys(b).length) {
        return false;
    }
    for(const key in a){
        if (a[key] !== b[key]) {
            return false;
        }
    }
    return true;
}
function isPlainArray(value) {
    return Array.isArray(value) && value.length === Object.keys(value).length;
}
function isPlainObject(o) {
    if (!hasObjectPrototype(o)) {
        return false;
    }
    const ctor = o.constructor;
    if (ctor === void 0) {
        return true;
    }
    const prot = ctor.prototype;
    if (!hasObjectPrototype(prot)) {
        return false;
    }
    if (!prot.hasOwnProperty("isPrototypeOf")) {
        return false;
    }
    if (Object.getPrototypeOf(o) !== Object.prototype) {
        return false;
    }
    return true;
}
function hasObjectPrototype(o) {
    return Object.prototype.toString.call(o) === "[object Object]";
}
function sleep(timeout) {
    return new Promise((resolve)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$timeoutManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeoutManager"].setTimeout(resolve, timeout);
    });
}
function replaceData(prevData, data, options) {
    if (typeof options.structuralSharing === "function") {
        return options.structuralSharing(prevData, data);
    } else if (options.structuralSharing !== false) {
        if ("TURBOPACK compile-time truthy", 1) {
            try {
                return replaceEqualDeep(prevData, data);
            } catch (error) {
                console.error(`Structural sharing requires data to be JSON serializable. To fix this, turn off structuralSharing or return JSON-serializable data from your queryFn. [${options.queryHash}]: ${error}`);
                throw error;
            }
        }
        return replaceEqualDeep(prevData, data);
    }
    return data;
}
function keepPreviousData(previousData) {
    return previousData;
}
function addToEnd(items, item, max = 0) {
    const newItems = [
        ...items,
        item
    ];
    return max && newItems.length > max ? newItems.slice(1) : newItems;
}
function addToStart(items, item, max = 0) {
    const newItems = [
        item,
        ...items
    ];
    return max && newItems.length > max ? newItems.slice(0, -1) : newItems;
}
var skipToken = /* @__PURE__ */ Symbol();
function ensureQueryFn(options, fetchOptions) {
    if ("TURBOPACK compile-time truthy", 1) {
        if (options.queryFn === skipToken) {
            console.error(`Attempted to invoke queryFn when set to skipToken. This is likely a configuration error. Query hash: '${options.queryHash}'`);
        }
    }
    if (!options.queryFn && fetchOptions?.initialPromise) {
        return ()=>fetchOptions.initialPromise;
    }
    if (!options.queryFn || options.queryFn === skipToken) {
        return ()=>Promise.reject(new Error(`Missing queryFn: '${options.queryHash}'`));
    }
    return options.queryFn;
}
function shouldThrowError(throwOnError, params) {
    if (typeof throwOnError === "function") {
        return throwOnError(...params);
    }
    return !!throwOnError;
}
function addConsumeAwareSignal(object, getSignal, onCancelled) {
    let consumed = false;
    let signal;
    Object.defineProperty(object, "signal", {
        enumerable: true,
        get: ()=>{
            signal ??= getSignal();
            if (consumed) {
                return signal;
            }
            consumed = true;
            if (signal.aborted) {
                onCancelled();
            } else {
                signal.addEventListener("abort", onCancelled, {
                    once: true
                });
            }
            return signal;
        }
    });
    return object;
}
;
 //# sourceMappingURL=utils.js.map
}),
"[project]/barber/node_modules/@tanstack/query-core/build/modern/thenable.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "pendingThenable",
    ()=>pendingThenable,
    "tryResolveSync",
    ()=>tryResolveSync
]);
// src/thenable.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/@tanstack/query-core/build/modern/utils.js [app-client] (ecmascript)");
;
function pendingThenable() {
    let resolve;
    let reject;
    const thenable = new Promise((_resolve, _reject)=>{
        resolve = _resolve;
        reject = _reject;
    });
    thenable.status = "pending";
    thenable.catch(()=>{});
    function finalize(data) {
        Object.assign(thenable, data);
        delete thenable.resolve;
        delete thenable.reject;
    }
    thenable.resolve = (value)=>{
        finalize({
            status: "fulfilled",
            value
        });
        resolve(value);
    };
    thenable.reject = (reason)=>{
        finalize({
            status: "rejected",
            reason
        });
        reject(reason);
    };
    return thenable;
}
function tryResolveSync(promise) {
    let data;
    promise.then((result)=>{
        data = result;
        return result;
    }, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noop"])?.catch(__TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noop"]);
    if (data !== void 0) {
        return {
            data
        };
    }
    return void 0;
}
;
 //# sourceMappingURL=thenable.js.map
}),
"[project]/barber/node_modules/@tanstack/query-core/build/modern/hydration.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "defaultShouldDehydrateMutation",
    ()=>defaultShouldDehydrateMutation,
    "defaultShouldDehydrateQuery",
    ()=>defaultShouldDehydrateQuery,
    "dehydrate",
    ()=>dehydrate,
    "hydrate",
    ()=>hydrate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/barber/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
// src/hydration.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$thenable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/@tanstack/query-core/build/modern/thenable.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/@tanstack/query-core/build/modern/utils.js [app-client] (ecmascript)");
;
;
function defaultTransformerFn(data) {
    return data;
}
function dehydrateMutation(mutation) {
    return {
        mutationKey: mutation.options.mutationKey,
        state: mutation.state,
        ...mutation.options.scope && {
            scope: mutation.options.scope
        },
        ...mutation.meta && {
            meta: mutation.meta
        }
    };
}
function dehydrateQuery(query, serializeData, shouldRedactErrors) {
    const dehydratePromise = ()=>{
        const promise = query.promise?.then(serializeData).catch((error)=>{
            if (!shouldRedactErrors(error)) {
                return Promise.reject(error);
            }
            if ("TURBOPACK compile-time truthy", 1) {
                console.error(`A query that was dehydrated as pending ended up rejecting. [${query.queryHash}]: ${error}; The error will be redacted in production builds`);
            }
            return Promise.reject(new Error("redacted"));
        });
        promise?.catch(__TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noop"]);
        return promise;
    };
    return {
        dehydratedAt: Date.now(),
        state: {
            ...query.state,
            ...query.state.data !== void 0 && {
                data: serializeData(query.state.data)
            }
        },
        queryKey: query.queryKey,
        queryHash: query.queryHash,
        ...query.state.status === "pending" && {
            promise: dehydratePromise()
        },
        ...query.meta && {
            meta: query.meta
        }
    };
}
function defaultShouldDehydrateMutation(mutation) {
    return mutation.state.isPaused;
}
function defaultShouldDehydrateQuery(query) {
    return query.state.status === "success";
}
function defaultShouldRedactErrors(_) {
    return true;
}
function dehydrate(client, options = {}) {
    const filterMutation = options.shouldDehydrateMutation ?? client.getDefaultOptions().dehydrate?.shouldDehydrateMutation ?? defaultShouldDehydrateMutation;
    const mutations = client.getMutationCache().getAll().flatMap((mutation)=>filterMutation(mutation) ? [
            dehydrateMutation(mutation)
        ] : []);
    const filterQuery = options.shouldDehydrateQuery ?? client.getDefaultOptions().dehydrate?.shouldDehydrateQuery ?? defaultShouldDehydrateQuery;
    const shouldRedactErrors = options.shouldRedactErrors ?? client.getDefaultOptions().dehydrate?.shouldRedactErrors ?? defaultShouldRedactErrors;
    const serializeData = options.serializeData ?? client.getDefaultOptions().dehydrate?.serializeData ?? defaultTransformerFn;
    const queries = client.getQueryCache().getAll().flatMap((query)=>filterQuery(query) ? [
            dehydrateQuery(query, serializeData, shouldRedactErrors)
        ] : []);
    return {
        mutations,
        queries
    };
}
function hydrate(client, dehydratedState, options) {
    if (typeof dehydratedState !== "object" || dehydratedState === null) {
        return;
    }
    const mutationCache = client.getMutationCache();
    const queryCache = client.getQueryCache();
    const deserializeData = options?.defaultOptions?.deserializeData ?? client.getDefaultOptions().hydrate?.deserializeData ?? defaultTransformerFn;
    const mutations = dehydratedState.mutations || [];
    const queries = dehydratedState.queries || [];
    mutations.forEach(({ state, ...mutationOptions })=>{
        mutationCache.build(client, {
            ...client.getDefaultOptions().hydrate?.mutations,
            ...options?.defaultOptions?.mutations,
            ...mutationOptions
        }, state);
    });
    queries.forEach(({ queryKey, state, queryHash, meta, promise, dehydratedAt })=>{
        const syncData = promise ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$thenable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tryResolveSync"])(promise) : void 0;
        const rawData = state.data === void 0 ? syncData?.data : state.data;
        const data = rawData === void 0 ? rawData : deserializeData(rawData);
        let query = queryCache.get(queryHash);
        const existingQueryIsPending = query?.state.status === "pending";
        const existingQueryIsFetching = query?.state.fetchStatus === "fetching";
        if (query) {
            const hasNewerSyncData = syncData && // We only need this undefined check to handle older dehydration
            // payloads that might not have dehydratedAt
            dehydratedAt !== void 0 && dehydratedAt > query.state.dataUpdatedAt;
            if (state.dataUpdatedAt > query.state.dataUpdatedAt || hasNewerSyncData) {
                const { fetchStatus: _ignored, ...serializedState } = state;
                query.setState({
                    ...serializedState,
                    data
                });
            }
        } else {
            query = queryCache.build(client, {
                ...client.getDefaultOptions().hydrate?.queries,
                ...options?.defaultOptions?.queries,
                queryKey,
                queryHash,
                meta
            }, // Reset fetch status to idle to avoid
            // query being stuck in fetching state upon hydration
            {
                ...state,
                data,
                fetchStatus: "idle",
                status: data !== void 0 ? "success" : state.status
            });
        }
        if (promise && !existingQueryIsPending && !existingQueryIsFetching && // Only hydrate if dehydration is newer than any existing data,
        // this is always true for new queries
        (dehydratedAt === void 0 || dehydratedAt > query.state.dataUpdatedAt)) {
            query.fetch(void 0, {
                // RSC transformed promises are not thenable
                initialPromise: Promise.resolve(promise).then(deserializeData)
            }).catch(__TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noop"]);
        }
    });
}
;
 //# sourceMappingURL=hydration.js.map
}),
"[project]/barber/node_modules/@tanstack/query-core/build/modern/notifyManager.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createNotifyManager",
    ()=>createNotifyManager,
    "defaultScheduler",
    ()=>defaultScheduler,
    "notifyManager",
    ()=>notifyManager
]);
// src/notifyManager.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$timeoutManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/@tanstack/query-core/build/modern/timeoutManager.js [app-client] (ecmascript)");
;
var defaultScheduler = __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$timeoutManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["systemSetTimeoutZero"];
function createNotifyManager() {
    let queue = [];
    let transactions = 0;
    let notifyFn = (callback)=>{
        callback();
    };
    let batchNotifyFn = (callback)=>{
        callback();
    };
    let scheduleFn = defaultScheduler;
    const schedule = (callback)=>{
        if (transactions) {
            queue.push(callback);
        } else {
            scheduleFn(()=>{
                notifyFn(callback);
            });
        }
    };
    const flush = ()=>{
        const originalQueue = queue;
        queue = [];
        if (originalQueue.length) {
            scheduleFn(()=>{
                batchNotifyFn(()=>{
                    originalQueue.forEach((callback)=>{
                        notifyFn(callback);
                    });
                });
            });
        }
    };
    return {
        batch: (callback)=>{
            let result;
            transactions++;
            try {
                result = callback();
            } finally{
                transactions--;
                if (!transactions) {
                    flush();
                }
            }
            return result;
        },
        /**
     * All calls to the wrapped function will be batched.
     */ batchCalls: (callback)=>{
            return (...args)=>{
                schedule(()=>{
                    callback(...args);
                });
            };
        },
        schedule,
        /**
     * Use this method to set a custom notify function.
     * This can be used to for example wrap notifications with `React.act` while running tests.
     */ setNotifyFunction: (fn)=>{
            notifyFn = fn;
        },
        /**
     * Use this method to set a custom function to batch notifications together into a single tick.
     * By default React Query will use the batch function provided by ReactDOM or React Native.
     */ setBatchNotifyFunction: (fn)=>{
            batchNotifyFn = fn;
        },
        setScheduler: (fn)=>{
            scheduleFn = fn;
        }
    };
}
var notifyManager = createNotifyManager();
;
 //# sourceMappingURL=notifyManager.js.map
}),
"[project]/barber/node_modules/@tanstack/query-core/build/modern/subscribable.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Subscribable",
    ()=>Subscribable
]);
// src/subscribable.ts
var Subscribable = class {
    constructor(){
        this.listeners = /* @__PURE__ */ new Set();
        this.subscribe = this.subscribe.bind(this);
    }
    subscribe(listener) {
        this.listeners.add(listener);
        this.onSubscribe();
        return ()=>{
            this.listeners.delete(listener);
            this.onUnsubscribe();
        };
    }
    hasListeners() {
        return this.listeners.size > 0;
    }
    onSubscribe() {}
    onUnsubscribe() {}
};
;
 //# sourceMappingURL=subscribable.js.map
}),
"[project]/barber/node_modules/@tanstack/query-core/build/modern/focusManager.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FocusManager",
    ()=>FocusManager,
    "focusManager",
    ()=>focusManager
]);
// src/focusManager.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$subscribable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/@tanstack/query-core/build/modern/subscribable.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/@tanstack/query-core/build/modern/utils.js [app-client] (ecmascript)");
;
;
var FocusManager = class extends __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$subscribable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Subscribable"] {
    #focused;
    #cleanup;
    #setup;
    constructor(){
        super();
        this.#setup = (onFocus)=>{
            if (!__TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isServer"] && window.addEventListener) {
                const listener = ()=>onFocus();
                window.addEventListener("visibilitychange", listener, false);
                return ()=>{
                    window.removeEventListener("visibilitychange", listener);
                };
            }
            return;
        };
    }
    onSubscribe() {
        if (!this.#cleanup) {
            this.setEventListener(this.#setup);
        }
    }
    onUnsubscribe() {
        if (!this.hasListeners()) {
            this.#cleanup?.();
            this.#cleanup = void 0;
        }
    }
    setEventListener(setup) {
        this.#setup = setup;
        this.#cleanup?.();
        this.#cleanup = setup((focused)=>{
            if (typeof focused === "boolean") {
                this.setFocused(focused);
            } else {
                this.onFocus();
            }
        });
    }
    setFocused(focused) {
        const changed = this.#focused !== focused;
        if (changed) {
            this.#focused = focused;
            this.onFocus();
        }
    }
    onFocus() {
        const isFocused = this.isFocused();
        this.listeners.forEach((listener)=>{
            listener(isFocused);
        });
    }
    isFocused() {
        if (typeof this.#focused === "boolean") {
            return this.#focused;
        }
        return globalThis.document?.visibilityState !== "hidden";
    }
};
var focusManager = new FocusManager();
;
 //# sourceMappingURL=focusManager.js.map
}),
"[project]/barber/node_modules/@tanstack/query-core/build/modern/onlineManager.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OnlineManager",
    ()=>OnlineManager,
    "onlineManager",
    ()=>onlineManager
]);
// src/onlineManager.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$subscribable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/@tanstack/query-core/build/modern/subscribable.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/@tanstack/query-core/build/modern/utils.js [app-client] (ecmascript)");
;
;
var OnlineManager = class extends __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$subscribable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Subscribable"] {
    #online = true;
    #cleanup;
    #setup;
    constructor(){
        super();
        this.#setup = (onOnline)=>{
            if (!__TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isServer"] && window.addEventListener) {
                const onlineListener = ()=>onOnline(true);
                const offlineListener = ()=>onOnline(false);
                window.addEventListener("online", onlineListener, false);
                window.addEventListener("offline", offlineListener, false);
                return ()=>{
                    window.removeEventListener("online", onlineListener);
                    window.removeEventListener("offline", offlineListener);
                };
            }
            return;
        };
    }
    onSubscribe() {
        if (!this.#cleanup) {
            this.setEventListener(this.#setup);
        }
    }
    onUnsubscribe() {
        if (!this.hasListeners()) {
            this.#cleanup?.();
            this.#cleanup = void 0;
        }
    }
    setEventListener(setup) {
        this.#setup = setup;
        this.#cleanup?.();
        this.#cleanup = setup(this.setOnline.bind(this));
    }
    setOnline(online) {
        const changed = this.#online !== online;
        if (changed) {
            this.#online = online;
            this.listeners.forEach((listener)=>{
                listener(online);
            });
        }
    }
    isOnline() {
        return this.#online;
    }
};
var onlineManager = new OnlineManager();
;
 //# sourceMappingURL=onlineManager.js.map
}),
"[project]/barber/node_modules/@tanstack/query-core/build/modern/retryer.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CancelledError",
    ()=>CancelledError,
    "canFetch",
    ()=>canFetch,
    "createRetryer",
    ()=>createRetryer,
    "isCancelledError",
    ()=>isCancelledError
]);
// src/retryer.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$focusManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/@tanstack/query-core/build/modern/focusManager.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$onlineManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/@tanstack/query-core/build/modern/onlineManager.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$thenable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/@tanstack/query-core/build/modern/thenable.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/@tanstack/query-core/build/modern/utils.js [app-client] (ecmascript)");
;
;
;
;
function defaultRetryDelay(failureCount) {
    return Math.min(1e3 * 2 ** failureCount, 3e4);
}
function canFetch(networkMode) {
    return (networkMode ?? "online") === "online" ? __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$onlineManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onlineManager"].isOnline() : true;
}
var CancelledError = class extends Error {
    constructor(options){
        super("CancelledError");
        this.revert = options?.revert;
        this.silent = options?.silent;
    }
};
function isCancelledError(value) {
    return value instanceof CancelledError;
}
function createRetryer(config) {
    let isRetryCancelled = false;
    let failureCount = 0;
    let continueFn;
    const thenable = (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$thenable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["pendingThenable"])();
    const isResolved = ()=>thenable.status !== "pending";
    const cancel = (cancelOptions)=>{
        if (!isResolved()) {
            const error = new CancelledError(cancelOptions);
            reject(error);
            config.onCancel?.(error);
        }
    };
    const cancelRetry = ()=>{
        isRetryCancelled = true;
    };
    const continueRetry = ()=>{
        isRetryCancelled = false;
    };
    const canContinue = ()=>__TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$focusManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["focusManager"].isFocused() && (config.networkMode === "always" || __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$onlineManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onlineManager"].isOnline()) && config.canRun();
    const canStart = ()=>canFetch(config.networkMode) && config.canRun();
    const resolve = (value)=>{
        if (!isResolved()) {
            continueFn?.();
            thenable.resolve(value);
        }
    };
    const reject = (value)=>{
        if (!isResolved()) {
            continueFn?.();
            thenable.reject(value);
        }
    };
    const pause = ()=>{
        return new Promise((continueResolve)=>{
            continueFn = (value)=>{
                if (isResolved() || canContinue()) {
                    continueResolve(value);
                }
            };
            config.onPause?.();
        }).then(()=>{
            continueFn = void 0;
            if (!isResolved()) {
                config.onContinue?.();
            }
        });
    };
    const run = ()=>{
        if (isResolved()) {
            return;
        }
        let promiseOrValue;
        const initialPromise = failureCount === 0 ? config.initialPromise : void 0;
        try {
            promiseOrValue = initialPromise ?? config.fn();
        } catch (error) {
            promiseOrValue = Promise.reject(error);
        }
        Promise.resolve(promiseOrValue).then(resolve).catch((error)=>{
            if (isResolved()) {
                return;
            }
            const retry = config.retry ?? (__TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isServer"] ? 0 : 3);
            const retryDelay = config.retryDelay ?? defaultRetryDelay;
            const delay = typeof retryDelay === "function" ? retryDelay(failureCount, error) : retryDelay;
            const shouldRetry = retry === true || typeof retry === "number" && failureCount < retry || typeof retry === "function" && retry(failureCount, error);
            if (isRetryCancelled || !shouldRetry) {
                reject(error);
                return;
            }
            failureCount++;
            config.onFail?.(failureCount, error);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sleep"])(delay).then(()=>{
                return canContinue() ? void 0 : pause();
            }).then(()=>{
                if (isRetryCancelled) {
                    reject(error);
                } else {
                    run();
                }
            });
        });
    };
    return {
        promise: thenable,
        status: ()=>thenable.status,
        cancel,
        continue: ()=>{
            continueFn?.();
            return thenable;
        },
        cancelRetry,
        continueRetry,
        canStart,
        start: ()=>{
            if (canStart()) {
                run();
            } else {
                pause().then(run);
            }
            return thenable;
        }
    };
}
;
 //# sourceMappingURL=retryer.js.map
}),
"[project]/barber/node_modules/@tanstack/query-core/build/modern/removable.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Removable",
    ()=>Removable
]);
// src/removable.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$timeoutManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/@tanstack/query-core/build/modern/timeoutManager.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/@tanstack/query-core/build/modern/utils.js [app-client] (ecmascript)");
;
;
var Removable = class {
    #gcTimeout;
    destroy() {
        this.clearGcTimeout();
    }
    scheduleGc() {
        this.clearGcTimeout();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidTimeout"])(this.gcTime)) {
            this.#gcTimeout = __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$timeoutManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeoutManager"].setTimeout(()=>{
                this.optionalRemove();
            }, this.gcTime);
        }
    }
    updateGcTime(newGcTime) {
        this.gcTime = Math.max(this.gcTime || 0, newGcTime ?? (__TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isServer"] ? Infinity : 5 * 60 * 1e3));
    }
    clearGcTimeout() {
        if (this.#gcTimeout) {
            __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$timeoutManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeoutManager"].clearTimeout(this.#gcTimeout);
            this.#gcTimeout = void 0;
        }
    }
};
;
 //# sourceMappingURL=removable.js.map
}),
"[project]/barber/node_modules/@tanstack/query-core/build/modern/query.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Query",
    ()=>Query,
    "fetchState",
    ()=>fetchState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/barber/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
// src/query.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/@tanstack/query-core/build/modern/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/@tanstack/query-core/build/modern/notifyManager.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$retryer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/@tanstack/query-core/build/modern/retryer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$removable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/@tanstack/query-core/build/modern/removable.js [app-client] (ecmascript)");
;
;
;
;
var Query = class extends __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$removable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Removable"] {
    #initialState;
    #revertState;
    #cache;
    #client;
    #retryer;
    #defaultOptions;
    #abortSignalConsumed;
    constructor(config){
        super();
        this.#abortSignalConsumed = false;
        this.#defaultOptions = config.defaultOptions;
        this.setOptions(config.options);
        this.observers = [];
        this.#client = config.client;
        this.#cache = this.#client.getQueryCache();
        this.queryKey = config.queryKey;
        this.queryHash = config.queryHash;
        this.#initialState = getDefaultState(this.options);
        this.state = config.state ?? this.#initialState;
        this.scheduleGc();
    }
    get meta() {
        return this.options.meta;
    }
    get promise() {
        return this.#retryer?.promise;
    }
    setOptions(options) {
        this.options = {
            ...this.#defaultOptions,
            ...options
        };
        this.updateGcTime(this.options.gcTime);
        if (this.state && this.state.data === void 0) {
            const defaultState = getDefaultState(this.options);
            if (defaultState.data !== void 0) {
                this.setState(successState(defaultState.data, defaultState.dataUpdatedAt));
                this.#initialState = defaultState;
            }
        }
    }
    optionalRemove() {
        if (!this.observers.length && this.state.fetchStatus === "idle") {
            this.#cache.remove(this);
        }
    }
    setData(newData, options) {
        const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["replaceData"])(this.state.data, newData, this.options);
        this.#dispatch({
            data,
            type: "success",
            dataUpdatedAt: options?.updatedAt,
            manual: options?.manual
        });
        return data;
    }
    setState(state, setStateOptions) {
        this.#dispatch({
            type: "setState",
            state,
            setStateOptions
        });
    }
    cancel(options) {
        const promise = this.#retryer?.promise;
        this.#retryer?.cancel(options);
        return promise ? promise.then(__TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noop"]).catch(__TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noop"]) : Promise.resolve();
    }
    destroy() {
        super.destroy();
        this.cancel({
            silent: true
        });
    }
    reset() {
        this.destroy();
        this.setState(this.#initialState);
    }
    isActive() {
        return this.observers.some((observer)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveEnabled"])(observer.options.enabled, this) !== false);
    }
    isDisabled() {
        if (this.getObserversCount() > 0) {
            return !this.isActive();
        }
        return this.options.queryFn === __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["skipToken"] || this.state.dataUpdateCount + this.state.errorUpdateCount === 0;
    }
    isStatic() {
        if (this.getObserversCount() > 0) {
            return this.observers.some((observer)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveStaleTime"])(observer.options.staleTime, this) === "static");
        }
        return false;
    }
    isStale() {
        if (this.getObserversCount() > 0) {
            return this.observers.some((observer)=>observer.getCurrentResult().isStale);
        }
        return this.state.data === void 0 || this.state.isInvalidated;
    }
    isStaleByTime(staleTime = 0) {
        if (this.state.data === void 0) {
            return true;
        }
        if (staleTime === "static") {
            return false;
        }
        if (this.state.isInvalidated) {
            return true;
        }
        return !(0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeUntilStale"])(this.state.dataUpdatedAt, staleTime);
    }
    onFocus() {
        const observer = this.observers.find((x)=>x.shouldFetchOnWindowFocus());
        observer?.refetch({
            cancelRefetch: false
        });
        this.#retryer?.continue();
    }
    onOnline() {
        const observer = this.observers.find((x)=>x.shouldFetchOnReconnect());
        observer?.refetch({
            cancelRefetch: false
        });
        this.#retryer?.continue();
    }
    addObserver(observer) {
        if (!this.observers.includes(observer)) {
            this.observers.push(observer);
            this.clearGcTimeout();
            this.#cache.notify({
                type: "observerAdded",
                query: this,
                observer
            });
        }
    }
    removeObserver(observer) {
        if (this.observers.includes(observer)) {
            this.observers = this.observers.filter((x)=>x !== observer);
            if (!this.observers.length) {
                if (this.#retryer) {
                    if (this.#abortSignalConsumed) {
                        this.#retryer.cancel({
                            revert: true
                        });
                    } else {
                        this.#retryer.cancelRetry();
                    }
                }
                this.scheduleGc();
            }
            this.#cache.notify({
                type: "observerRemoved",
                query: this,
                observer
            });
        }
    }
    getObserversCount() {
        return this.observers.length;
    }
    invalidate() {
        if (!this.state.isInvalidated) {
            this.#dispatch({
                type: "invalidate"
            });
        }
    }
    async fetch(options, fetchOptions) {
        if (this.state.fetchStatus !== "idle" && // If the promise in the retryer is already rejected, we have to definitely
        // re-start the fetch; there is a chance that the query is still in a
        // pending state when that happens
        this.#retryer?.status() !== "rejected") {
            if (this.state.data !== void 0 && fetchOptions?.cancelRefetch) {
                this.cancel({
                    silent: true
                });
            } else if (this.#retryer) {
                this.#retryer.continueRetry();
                return this.#retryer.promise;
            }
        }
        if (options) {
            this.setOptions(options);
        }
        if (!this.options.queryFn) {
            const observer = this.observers.find((x)=>x.options.queryFn);
            if (observer) {
                this.setOptions(observer.options);
            }
        }
        if ("TURBOPACK compile-time truthy", 1) {
            if (!Array.isArray(this.options.queryKey)) {
                console.error(`As of v4, queryKey needs to be an Array. If you are using a string like 'repoData', please change it to an Array, e.g. ['repoData']`);
            }
        }
        const abortController = new AbortController();
        const addSignalProperty = (object)=>{
            Object.defineProperty(object, "signal", {
                enumerable: true,
                get: ()=>{
                    this.#abortSignalConsumed = true;
                    return abortController.signal;
                }
            });
        };
        const fetchFn = ()=>{
            const queryFn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensureQueryFn"])(this.options, fetchOptions);
            const createQueryFnContext = ()=>{
                const queryFnContext2 = {
                    client: this.#client,
                    queryKey: this.queryKey,
                    meta: this.meta
                };
                addSignalProperty(queryFnContext2);
                return queryFnContext2;
            };
            const queryFnContext = createQueryFnContext();
            this.#abortSignalConsumed = false;
            if (this.options.persister) {
                return this.options.persister(queryFn, queryFnContext, this);
            }
            return queryFn(queryFnContext);
        };
        const createFetchContext = ()=>{
            const context2 = {
                fetchOptions,
                options: this.options,
                queryKey: this.queryKey,
                client: this.#client,
                state: this.state,
                fetchFn
            };
            addSignalProperty(context2);
            return context2;
        };
        const context = createFetchContext();
        this.options.behavior?.onFetch(context, this);
        this.#revertState = this.state;
        if (this.state.fetchStatus === "idle" || this.state.fetchMeta !== context.fetchOptions?.meta) {
            this.#dispatch({
                type: "fetch",
                meta: context.fetchOptions?.meta
            });
        }
        this.#retryer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$retryer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createRetryer"])({
            initialPromise: fetchOptions?.initialPromise,
            fn: context.fetchFn,
            onCancel: (error)=>{
                if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$retryer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CancelledError"] && error.revert) {
                    this.setState({
                        ...this.#revertState,
                        fetchStatus: "idle"
                    });
                }
                abortController.abort();
            },
            onFail: (failureCount, error)=>{
                this.#dispatch({
                    type: "failed",
                    failureCount,
                    error
                });
            },
            onPause: ()=>{
                this.#dispatch({
                    type: "pause"
                });
            },
            onContinue: ()=>{
                this.#dispatch({
                    type: "continue"
                });
            },
            retry: context.options.retry,
            retryDelay: context.options.retryDelay,
            networkMode: context.options.networkMode,
            canRun: ()=>true
        });
        try {
            const data = await this.#retryer.start();
            if (data === void 0) {
                if ("TURBOPACK compile-time truthy", 1) {
                    console.error(`Query data cannot be undefined. Please make sure to return a value other than undefined from your query function. Affected query key: ${this.queryHash}`);
                }
                throw new Error(`${this.queryHash} data is undefined`);
            }
            this.setData(data);
            this.#cache.config.onSuccess?.(data, this);
            this.#cache.config.onSettled?.(data, this.state.error, this);
            return data;
        } catch (error) {
            if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$retryer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CancelledError"]) {
                if (error.silent) {
                    return this.#retryer.promise;
                } else if (error.revert) {
                    if (this.state.data === void 0) {
                        throw error;
                    }
                    return this.state.data;
                }
            }
            this.#dispatch({
                type: "error",
                error
            });
            this.#cache.config.onError?.(error, this);
            this.#cache.config.onSettled?.(this.state.data, error, this);
            throw error;
        } finally{
            this.scheduleGc();
        }
    }
    #dispatch(action) {
        const reducer = (state)=>{
            switch(action.type){
                case "failed":
                    return {
                        ...state,
                        fetchFailureCount: action.failureCount,
                        fetchFailureReason: action.error
                    };
                case "pause":
                    return {
                        ...state,
                        fetchStatus: "paused"
                    };
                case "continue":
                    return {
                        ...state,
                        fetchStatus: "fetching"
                    };
                case "fetch":
                    return {
                        ...state,
                        ...fetchState(state.data, this.options),
                        fetchMeta: action.meta ?? null
                    };
                case "success":
                    const newState = {
                        ...state,
                        ...successState(action.data, action.dataUpdatedAt),
                        dataUpdateCount: state.dataUpdateCount + 1,
                        ...!action.manual && {
                            fetchStatus: "idle",
                            fetchFailureCount: 0,
                            fetchFailureReason: null
                        }
                    };
                    this.#revertState = action.manual ? newState : void 0;
                    return newState;
                case "error":
                    const error = action.error;
                    return {
                        ...state,
                        error,
                        errorUpdateCount: state.errorUpdateCount + 1,
                        errorUpdatedAt: Date.now(),
                        fetchFailureCount: state.fetchFailureCount + 1,
                        fetchFailureReason: error,
                        fetchStatus: "idle",
                        status: "error",
                        // flag existing data as invalidated if we get a background error
                        // note that "no data" always means stale so we can set unconditionally here
                        isInvalidated: true
                    };
                case "invalidate":
                    return {
                        ...state,
                        isInvalidated: true
                    };
                case "setState":
                    return {
                        ...state,
                        ...action.state
                    };
            }
        };
        this.state = reducer(this.state);
        __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifyManager"].batch(()=>{
            this.observers.forEach((observer)=>{
                observer.onQueryUpdate();
            });
            this.#cache.notify({
                query: this,
                type: "updated",
                action
            });
        });
    }
};
function fetchState(data, options) {
    return {
        fetchFailureCount: 0,
        fetchFailureReason: null,
        fetchStatus: (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$retryer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canFetch"])(options.networkMode) ? "fetching" : "paused",
        ...data === void 0 && {
            error: null,
            status: "pending"
        }
    };
}
function successState(data, dataUpdatedAt) {
    return {
        data,
        dataUpdatedAt: dataUpdatedAt ?? Date.now(),
        error: null,
        isInvalidated: false,
        status: "success"
    };
}
function getDefaultState(options) {
    const data = typeof options.initialData === "function" ? options.initialData() : options.initialData;
    const hasData = data !== void 0;
    const initialDataUpdatedAt = hasData ? typeof options.initialDataUpdatedAt === "function" ? options.initialDataUpdatedAt() : options.initialDataUpdatedAt : 0;
    return {
        data,
        dataUpdateCount: 0,
        dataUpdatedAt: hasData ? initialDataUpdatedAt ?? Date.now() : 0,
        error: null,
        errorUpdateCount: 0,
        errorUpdatedAt: 0,
        fetchFailureCount: 0,
        fetchFailureReason: null,
        fetchMeta: null,
        isInvalidated: false,
        status: hasData ? "success" : "pending",
        fetchStatus: "idle"
    };
}
;
 //# sourceMappingURL=query.js.map
}),
"[project]/barber/node_modules/@tanstack/query-core/build/modern/queryCache.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "QueryCache",
    ()=>QueryCache
]);
// src/queryCache.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/@tanstack/query-core/build/modern/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$query$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/@tanstack/query-core/build/modern/query.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/@tanstack/query-core/build/modern/notifyManager.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$subscribable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/@tanstack/query-core/build/modern/subscribable.js [app-client] (ecmascript)");
;
;
;
;
var QueryCache = class extends __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$subscribable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Subscribable"] {
    constructor(config = {}){
        super();
        this.config = config;
        this.#queries = /* @__PURE__ */ new Map();
    }
    #queries;
    build(client, options, state) {
        const queryKey = options.queryKey;
        const queryHash = options.queryHash ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hashQueryKeyByOptions"])(queryKey, options);
        let query = this.get(queryHash);
        if (!query) {
            query = new __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$query$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Query"]({
                client,
                queryKey,
                queryHash,
                options: client.defaultQueryOptions(options),
                state,
                defaultOptions: client.getQueryDefaults(queryKey)
            });
            this.add(query);
        }
        return query;
    }
    add(query) {
        if (!this.#queries.has(query.queryHash)) {
            this.#queries.set(query.queryHash, query);
            this.notify({
                type: "added",
                query
            });
        }
    }
    remove(query) {
        const queryInMap = this.#queries.get(query.queryHash);
        if (queryInMap) {
            query.destroy();
            if (queryInMap === query) {
                this.#queries.delete(query.queryHash);
            }
            this.notify({
                type: "removed",
                query
            });
        }
    }
    clear() {
        __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifyManager"].batch(()=>{
            this.getAll().forEach((query)=>{
                this.remove(query);
            });
        });
    }
    get(queryHash) {
        return this.#queries.get(queryHash);
    }
    getAll() {
        return [
            ...this.#queries.values()
        ];
    }
    find(filters) {
        const defaultedFilters = {
            exact: true,
            ...filters
        };
        return this.getAll().find((query)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["matchQuery"])(defaultedFilters, query));
    }
    findAll(filters = {}) {
        const queries = this.getAll();
        return Object.keys(filters).length > 0 ? queries.filter((query)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["matchQuery"])(filters, query)) : queries;
    }
    notify(event) {
        __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifyManager"].batch(()=>{
            this.listeners.forEach((listener)=>{
                listener(event);
            });
        });
    }
    onFocus() {
        __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifyManager"].batch(()=>{
            this.getAll().forEach((query)=>{
                query.onFocus();
            });
        });
    }
    onOnline() {
        __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifyManager"].batch(()=>{
            this.getAll().forEach((query)=>{
                query.onOnline();
            });
        });
    }
};
;
 //# sourceMappingURL=queryCache.js.map
}),
"[project]/barber/node_modules/@tanstack/query-core/build/modern/mutation.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Mutation",
    ()=>Mutation,
    "getDefaultState",
    ()=>getDefaultState
]);
// src/mutation.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/@tanstack/query-core/build/modern/notifyManager.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$removable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/@tanstack/query-core/build/modern/removable.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$retryer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/@tanstack/query-core/build/modern/retryer.js [app-client] (ecmascript)");
;
;
;
var Mutation = class extends __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$removable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Removable"] {
    #client;
    #observers;
    #mutationCache;
    #retryer;
    constructor(config){
        super();
        this.#client = config.client;
        this.mutationId = config.mutationId;
        this.#mutationCache = config.mutationCache;
        this.#observers = [];
        this.state = config.state || getDefaultState();
        this.setOptions(config.options);
        this.scheduleGc();
    }
    setOptions(options) {
        this.options = options;
        this.updateGcTime(this.options.gcTime);
    }
    get meta() {
        return this.options.meta;
    }
    addObserver(observer) {
        if (!this.#observers.includes(observer)) {
            this.#observers.push(observer);
            this.clearGcTimeout();
            this.#mutationCache.notify({
                type: "observerAdded",
                mutation: this,
                observer
            });
        }
    }
    removeObserver(observer) {
        this.#observers = this.#observers.filter((x)=>x !== observer);
        this.scheduleGc();
        this.#mutationCache.notify({
            type: "observerRemoved",
            mutation: this,
            observer
        });
    }
    optionalRemove() {
        if (!this.#observers.length) {
            if (this.state.status === "pending") {
                this.scheduleGc();
            } else {
                this.#mutationCache.remove(this);
            }
        }
    }
    continue() {
        return this.#retryer?.continue() ?? // continuing a mutation assumes that variables are set, mutation must have been dehydrated before
        this.execute(this.state.variables);
    }
    async execute(variables) {
        const onContinue = ()=>{
            this.#dispatch({
                type: "continue"
            });
        };
        const mutationFnContext = {
            client: this.#client,
            meta: this.options.meta,
            mutationKey: this.options.mutationKey
        };
        this.#retryer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$retryer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createRetryer"])({
            fn: ()=>{
                if (!this.options.mutationFn) {
                    return Promise.reject(new Error("No mutationFn found"));
                }
                return this.options.mutationFn(variables, mutationFnContext);
            },
            onFail: (failureCount, error)=>{
                this.#dispatch({
                    type: "failed",
                    failureCount,
                    error
                });
            },
            onPause: ()=>{
                this.#dispatch({
                    type: "pause"
                });
            },
            onContinue,
            retry: this.options.retry ?? 0,
            retryDelay: this.options.retryDelay,
            networkMode: this.options.networkMode,
            canRun: ()=>this.#mutationCache.canRun(this)
        });
        const restored = this.state.status === "pending";
        const isPaused = !this.#retryer.canStart();
        try {
            if (restored) {
                onContinue();
            } else {
                this.#dispatch({
                    type: "pending",
                    variables,
                    isPaused
                });
                if (this.#mutationCache.config.onMutate) {
                    await this.#mutationCache.config.onMutate(variables, this, mutationFnContext);
                }
                const context = await this.options.onMutate?.(variables, mutationFnContext);
                if (context !== this.state.context) {
                    this.#dispatch({
                        type: "pending",
                        context,
                        variables,
                        isPaused
                    });
                }
            }
            const data = await this.#retryer.start();
            await this.#mutationCache.config.onSuccess?.(data, variables, this.state.context, this, mutationFnContext);
            await this.options.onSuccess?.(data, variables, this.state.context, mutationFnContext);
            await this.#mutationCache.config.onSettled?.(data, null, this.state.variables, this.state.context, this, mutationFnContext);
            await this.options.onSettled?.(data, null, variables, this.state.context, mutationFnContext);
            this.#dispatch({
                type: "success",
                data
            });
            return data;
        } catch (error) {
            try {
                await this.#mutationCache.config.onError?.(error, variables, this.state.context, this, mutationFnContext);
            } catch (e) {
                void Promise.reject(e);
            }
            try {
                await this.options.onError?.(error, variables, this.state.context, mutationFnContext);
            } catch (e) {
                void Promise.reject(e);
            }
            try {
                await this.#mutationCache.config.onSettled?.(void 0, error, this.state.variables, this.state.context, this, mutationFnContext);
            } catch (e) {
                void Promise.reject(e);
            }
            try {
                await this.options.onSettled?.(void 0, error, variables, this.state.context, mutationFnContext);
            } catch (e) {
                void Promise.reject(e);
            }
            this.#dispatch({
                type: "error",
                error
            });
            throw error;
        } finally{
            this.#mutationCache.runNext(this);
        }
    }
    #dispatch(action) {
        const reducer = (state)=>{
            switch(action.type){
                case "failed":
                    return {
                        ...state,
                        failureCount: action.failureCount,
                        failureReason: action.error
                    };
                case "pause":
                    return {
                        ...state,
                        isPaused: true
                    };
                case "continue":
                    return {
                        ...state,
                        isPaused: false
                    };
                case "pending":
                    return {
                        ...state,
                        context: action.context,
                        data: void 0,
                        failureCount: 0,
                        failureReason: null,
                        error: null,
                        isPaused: action.isPaused,
                        status: "pending",
                        variables: action.variables,
                        submittedAt: Date.now()
                    };
                case "success":
                    return {
                        ...state,
                        data: action.data,
                        failureCount: 0,
                        failureReason: null,
                        error: null,
                        status: "success",
                        isPaused: false
                    };
                case "error":
                    return {
                        ...state,
                        data: void 0,
                        error: action.error,
                        failureCount: state.failureCount + 1,
                        failureReason: action.error,
                        isPaused: false,
                        status: "error"
                    };
            }
        };
        this.state = reducer(this.state);
        __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifyManager"].batch(()=>{
            this.#observers.forEach((observer)=>{
                observer.onMutationUpdate(action);
            });
            this.#mutationCache.notify({
                mutation: this,
                type: "updated",
                action
            });
        });
    }
};
function getDefaultState() {
    return {
        context: void 0,
        data: void 0,
        error: null,
        failureCount: 0,
        failureReason: null,
        isPaused: false,
        status: "idle",
        variables: void 0,
        submittedAt: 0
    };
}
;
 //# sourceMappingURL=mutation.js.map
}),
"[project]/barber/node_modules/@tanstack/query-core/build/modern/mutationCache.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MutationCache",
    ()=>MutationCache
]);
// src/mutationCache.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/@tanstack/query-core/build/modern/notifyManager.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$mutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/@tanstack/query-core/build/modern/mutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/@tanstack/query-core/build/modern/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$subscribable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/@tanstack/query-core/build/modern/subscribable.js [app-client] (ecmascript)");
;
;
;
;
var MutationCache = class extends __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$subscribable$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Subscribable"] {
    constructor(config = {}){
        super();
        this.config = config;
        this.#mutations = /* @__PURE__ */ new Set();
        this.#scopes = /* @__PURE__ */ new Map();
        this.#mutationId = 0;
    }
    #mutations;
    #scopes;
    #mutationId;
    build(client, options, state) {
        const mutation = new __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$mutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Mutation"]({
            client,
            mutationCache: this,
            mutationId: ++this.#mutationId,
            options: client.defaultMutationOptions(options),
            state
        });
        this.add(mutation);
        return mutation;
    }
    add(mutation) {
        this.#mutations.add(mutation);
        const scope = scopeFor(mutation);
        if (typeof scope === "string") {
            const scopedMutations = this.#scopes.get(scope);
            if (scopedMutations) {
                scopedMutations.push(mutation);
            } else {
                this.#scopes.set(scope, [
                    mutation
                ]);
            }
        }
        this.notify({
            type: "added",
            mutation
        });
    }
    remove(mutation) {
        if (this.#mutations.delete(mutation)) {
            const scope = scopeFor(mutation);
            if (typeof scope === "string") {
                const scopedMutations = this.#scopes.get(scope);
                if (scopedMutations) {
                    if (scopedMutations.length > 1) {
                        const index = scopedMutations.indexOf(mutation);
                        if (index !== -1) {
                            scopedMutations.splice(index, 1);
                        }
                    } else if (scopedMutations[0] === mutation) {
                        this.#scopes.delete(scope);
                    }
                }
            }
        }
        this.notify({
            type: "removed",
            mutation
        });
    }
    canRun(mutation) {
        const scope = scopeFor(mutation);
        if (typeof scope === "string") {
            const mutationsWithSameScope = this.#scopes.get(scope);
            const firstPendingMutation = mutationsWithSameScope?.find((m)=>m.state.status === "pending");
            return !firstPendingMutation || firstPendingMutation === mutation;
        } else {
            return true;
        }
    }
    runNext(mutation) {
        const scope = scopeFor(mutation);
        if (typeof scope === "string") {
            const foundMutation = this.#scopes.get(scope)?.find((m)=>m !== mutation && m.state.isPaused);
            return foundMutation?.continue() ?? Promise.resolve();
        } else {
            return Promise.resolve();
        }
    }
    clear() {
        __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifyManager"].batch(()=>{
            this.#mutations.forEach((mutation)=>{
                this.notify({
                    type: "removed",
                    mutation
                });
            });
            this.#mutations.clear();
            this.#scopes.clear();
        });
    }
    getAll() {
        return Array.from(this.#mutations);
    }
    find(filters) {
        const defaultedFilters = {
            exact: true,
            ...filters
        };
        return this.getAll().find((mutation)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["matchMutation"])(defaultedFilters, mutation));
    }
    findAll(filters = {}) {
        return this.getAll().filter((mutation)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["matchMutation"])(filters, mutation));
    }
    notify(event) {
        __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifyManager"].batch(()=>{
            this.listeners.forEach((listener)=>{
                listener(event);
            });
        });
    }
    resumePausedMutations() {
        const pausedMutations = this.getAll().filter((x)=>x.state.isPaused);
        return __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifyManager"].batch(()=>Promise.all(pausedMutations.map((mutation)=>mutation.continue().catch(__TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noop"]))));
    }
};
function scopeFor(mutation) {
    return mutation.options.scope?.id;
}
;
 //# sourceMappingURL=mutationCache.js.map
}),
"[project]/barber/node_modules/@tanstack/query-core/build/modern/infiniteQueryBehavior.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "hasNextPage",
    ()=>hasNextPage,
    "hasPreviousPage",
    ()=>hasPreviousPage,
    "infiniteQueryBehavior",
    ()=>infiniteQueryBehavior
]);
// src/infiniteQueryBehavior.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/@tanstack/query-core/build/modern/utils.js [app-client] (ecmascript)");
;
function infiniteQueryBehavior(pages) {
    return {
        onFetch: (context, query)=>{
            const options = context.options;
            const direction = context.fetchOptions?.meta?.fetchMore?.direction;
            const oldPages = context.state.data?.pages || [];
            const oldPageParams = context.state.data?.pageParams || [];
            let result = {
                pages: [],
                pageParams: []
            };
            let currentPage = 0;
            const fetchFn = async ()=>{
                let cancelled = false;
                const addSignalProperty = (object)=>{
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addConsumeAwareSignal"])(object, ()=>context.signal, ()=>cancelled = true);
                };
                const queryFn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ensureQueryFn"])(context.options, context.fetchOptions);
                const fetchPage = async (data, param, previous)=>{
                    if (cancelled) {
                        return Promise.reject();
                    }
                    if (param == null && data.pages.length) {
                        return Promise.resolve(data);
                    }
                    const createQueryFnContext = ()=>{
                        const queryFnContext2 = {
                            client: context.client,
                            queryKey: context.queryKey,
                            pageParam: param,
                            direction: previous ? "backward" : "forward",
                            meta: context.options.meta
                        };
                        addSignalProperty(queryFnContext2);
                        return queryFnContext2;
                    };
                    const queryFnContext = createQueryFnContext();
                    const page = await queryFn(queryFnContext);
                    const { maxPages } = context.options;
                    const addTo = previous ? __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addToStart"] : __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addToEnd"];
                    return {
                        pages: addTo(data.pages, page, maxPages),
                        pageParams: addTo(data.pageParams, param, maxPages)
                    };
                };
                if (direction && oldPages.length) {
                    const previous = direction === "backward";
                    const pageParamFn = previous ? getPreviousPageParam : getNextPageParam;
                    const oldData = {
                        pages: oldPages,
                        pageParams: oldPageParams
                    };
                    const param = pageParamFn(options, oldData);
                    result = await fetchPage(oldData, param, previous);
                } else {
                    const remainingPages = pages ?? oldPages.length;
                    do {
                        const param = currentPage === 0 ? oldPageParams[0] ?? options.initialPageParam : getNextPageParam(options, result);
                        if (currentPage > 0 && param == null) {
                            break;
                        }
                        result = await fetchPage(result, param);
                        currentPage++;
                    }while (currentPage < remainingPages)
                }
                return result;
            };
            if (context.options.persister) {
                context.fetchFn = ()=>{
                    return context.options.persister?.(fetchFn, {
                        client: context.client,
                        queryKey: context.queryKey,
                        meta: context.options.meta,
                        signal: context.signal
                    }, query);
                };
            } else {
                context.fetchFn = fetchFn;
            }
        }
    };
}
function getNextPageParam(options, { pages, pageParams }) {
    const lastIndex = pages.length - 1;
    return pages.length > 0 ? options.getNextPageParam(pages[lastIndex], pages, pageParams[lastIndex], pageParams) : void 0;
}
function getPreviousPageParam(options, { pages, pageParams }) {
    return pages.length > 0 ? options.getPreviousPageParam?.(pages[0], pages, pageParams[0], pageParams) : void 0;
}
function hasNextPage(options, data) {
    if (!data) return false;
    return getNextPageParam(options, data) != null;
}
function hasPreviousPage(options, data) {
    if (!data || !options.getPreviousPageParam) return false;
    return getPreviousPageParam(options, data) != null;
}
;
 //# sourceMappingURL=infiniteQueryBehavior.js.map
}),
"[project]/barber/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "QueryClient",
    ()=>QueryClient
]);
// src/queryClient.ts
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/@tanstack/query-core/build/modern/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryCache$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/@tanstack/query-core/build/modern/queryCache.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$mutationCache$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/@tanstack/query-core/build/modern/mutationCache.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$focusManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/@tanstack/query-core/build/modern/focusManager.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$onlineManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/@tanstack/query-core/build/modern/onlineManager.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/@tanstack/query-core/build/modern/notifyManager.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$infiniteQueryBehavior$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/@tanstack/query-core/build/modern/infiniteQueryBehavior.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
var QueryClient = class {
    #queryCache;
    #mutationCache;
    #defaultOptions;
    #queryDefaults;
    #mutationDefaults;
    #mountCount;
    #unsubscribeFocus;
    #unsubscribeOnline;
    constructor(config = {}){
        this.#queryCache = config.queryCache || new __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryCache$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryCache"]();
        this.#mutationCache = config.mutationCache || new __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$mutationCache$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MutationCache"]();
        this.#defaultOptions = config.defaultOptions || {};
        this.#queryDefaults = /* @__PURE__ */ new Map();
        this.#mutationDefaults = /* @__PURE__ */ new Map();
        this.#mountCount = 0;
    }
    mount() {
        this.#mountCount++;
        if (this.#mountCount !== 1) return;
        this.#unsubscribeFocus = __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$focusManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["focusManager"].subscribe(async (focused)=>{
            if (focused) {
                await this.resumePausedMutations();
                this.#queryCache.onFocus();
            }
        });
        this.#unsubscribeOnline = __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$onlineManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onlineManager"].subscribe(async (online)=>{
            if (online) {
                await this.resumePausedMutations();
                this.#queryCache.onOnline();
            }
        });
    }
    unmount() {
        this.#mountCount--;
        if (this.#mountCount !== 0) return;
        this.#unsubscribeFocus?.();
        this.#unsubscribeFocus = void 0;
        this.#unsubscribeOnline?.();
        this.#unsubscribeOnline = void 0;
    }
    isFetching(filters) {
        return this.#queryCache.findAll({
            ...filters,
            fetchStatus: "fetching"
        }).length;
    }
    isMutating(filters) {
        return this.#mutationCache.findAll({
            ...filters,
            status: "pending"
        }).length;
    }
    /**
   * Imperative (non-reactive) way to retrieve data for a QueryKey.
   * Should only be used in callbacks or functions where reading the latest data is necessary, e.g. for optimistic updates.
   *
   * Hint: Do not use this function inside a component, because it won't receive updates.
   * Use `useQuery` to create a `QueryObserver` that subscribes to changes.
   */ getQueryData(queryKey) {
        const options = this.defaultQueryOptions({
            queryKey
        });
        return this.#queryCache.get(options.queryHash)?.state.data;
    }
    ensureQueryData(options) {
        const defaultedOptions = this.defaultQueryOptions(options);
        const query = this.#queryCache.build(this, defaultedOptions);
        const cachedData = query.state.data;
        if (cachedData === void 0) {
            return this.fetchQuery(options);
        }
        if (options.revalidateIfStale && query.isStaleByTime((0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveStaleTime"])(defaultedOptions.staleTime, query))) {
            void this.prefetchQuery(defaultedOptions);
        }
        return Promise.resolve(cachedData);
    }
    getQueriesData(filters) {
        return this.#queryCache.findAll(filters).map(({ queryKey, state })=>{
            const data = state.data;
            return [
                queryKey,
                data
            ];
        });
    }
    setQueryData(queryKey, updater, options) {
        const defaultedOptions = this.defaultQueryOptions({
            queryKey
        });
        const query = this.#queryCache.get(defaultedOptions.queryHash);
        const prevData = query?.state.data;
        const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["functionalUpdate"])(updater, prevData);
        if (data === void 0) {
            return void 0;
        }
        return this.#queryCache.build(this, defaultedOptions).setData(data, {
            ...options,
            manual: true
        });
    }
    setQueriesData(filters, updater, options) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifyManager"].batch(()=>this.#queryCache.findAll(filters).map(({ queryKey })=>[
                    queryKey,
                    this.setQueryData(queryKey, updater, options)
                ]));
    }
    getQueryState(queryKey) {
        const options = this.defaultQueryOptions({
            queryKey
        });
        return this.#queryCache.get(options.queryHash)?.state;
    }
    removeQueries(filters) {
        const queryCache = this.#queryCache;
        __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifyManager"].batch(()=>{
            queryCache.findAll(filters).forEach((query)=>{
                queryCache.remove(query);
            });
        });
    }
    resetQueries(filters, options) {
        const queryCache = this.#queryCache;
        return __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifyManager"].batch(()=>{
            queryCache.findAll(filters).forEach((query)=>{
                query.reset();
            });
            return this.refetchQueries({
                type: "active",
                ...filters
            }, options);
        });
    }
    cancelQueries(filters, cancelOptions = {}) {
        const defaultedCancelOptions = {
            revert: true,
            ...cancelOptions
        };
        const promises = __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifyManager"].batch(()=>this.#queryCache.findAll(filters).map((query)=>query.cancel(defaultedCancelOptions)));
        return Promise.all(promises).then(__TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noop"]).catch(__TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noop"]);
    }
    invalidateQueries(filters, options = {}) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifyManager"].batch(()=>{
            this.#queryCache.findAll(filters).forEach((query)=>{
                query.invalidate();
            });
            if (filters?.refetchType === "none") {
                return Promise.resolve();
            }
            return this.refetchQueries({
                ...filters,
                type: filters?.refetchType ?? filters?.type ?? "active"
            }, options);
        });
    }
    refetchQueries(filters, options = {}) {
        const fetchOptions = {
            ...options,
            cancelRefetch: options.cancelRefetch ?? true
        };
        const promises = __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["notifyManager"].batch(()=>this.#queryCache.findAll(filters).filter((query)=>!query.isDisabled() && !query.isStatic()).map((query)=>{
                let promise = query.fetch(void 0, fetchOptions);
                if (!fetchOptions.throwOnError) {
                    promise = promise.catch(__TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noop"]);
                }
                return query.state.fetchStatus === "paused" ? Promise.resolve() : promise;
            }));
        return Promise.all(promises).then(__TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noop"]);
    }
    fetchQuery(options) {
        const defaultedOptions = this.defaultQueryOptions(options);
        if (defaultedOptions.retry === void 0) {
            defaultedOptions.retry = false;
        }
        const query = this.#queryCache.build(this, defaultedOptions);
        return query.isStaleByTime((0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resolveStaleTime"])(defaultedOptions.staleTime, query)) ? query.fetch(defaultedOptions) : Promise.resolve(query.state.data);
    }
    prefetchQuery(options) {
        return this.fetchQuery(options).then(__TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noop"]).catch(__TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noop"]);
    }
    fetchInfiniteQuery(options) {
        options.behavior = (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$infiniteQueryBehavior$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["infiniteQueryBehavior"])(options.pages);
        return this.fetchQuery(options);
    }
    prefetchInfiniteQuery(options) {
        return this.fetchInfiniteQuery(options).then(__TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noop"]).catch(__TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["noop"]);
    }
    ensureInfiniteQueryData(options) {
        options.behavior = (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$infiniteQueryBehavior$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["infiniteQueryBehavior"])(options.pages);
        return this.ensureQueryData(options);
    }
    resumePausedMutations() {
        if (__TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$onlineManager$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onlineManager"].isOnline()) {
            return this.#mutationCache.resumePausedMutations();
        }
        return Promise.resolve();
    }
    getQueryCache() {
        return this.#queryCache;
    }
    getMutationCache() {
        return this.#mutationCache;
    }
    getDefaultOptions() {
        return this.#defaultOptions;
    }
    setDefaultOptions(options) {
        this.#defaultOptions = options;
    }
    setQueryDefaults(queryKey, options) {
        this.#queryDefaults.set((0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hashKey"])(queryKey), {
            queryKey,
            defaultOptions: options
        });
    }
    getQueryDefaults(queryKey) {
        const defaults = [
            ...this.#queryDefaults.values()
        ];
        const result = {};
        defaults.forEach((queryDefault)=>{
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["partialMatchKey"])(queryKey, queryDefault.queryKey)) {
                Object.assign(result, queryDefault.defaultOptions);
            }
        });
        return result;
    }
    setMutationDefaults(mutationKey, options) {
        this.#mutationDefaults.set((0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hashKey"])(mutationKey), {
            mutationKey,
            defaultOptions: options
        });
    }
    getMutationDefaults(mutationKey) {
        const defaults = [
            ...this.#mutationDefaults.values()
        ];
        const result = {};
        defaults.forEach((queryDefault)=>{
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["partialMatchKey"])(mutationKey, queryDefault.mutationKey)) {
                Object.assign(result, queryDefault.defaultOptions);
            }
        });
        return result;
    }
    defaultQueryOptions(options) {
        if (options._defaulted) {
            return options;
        }
        const defaultedOptions = {
            ...this.#defaultOptions.queries,
            ...this.getQueryDefaults(options.queryKey),
            ...options,
            _defaulted: true
        };
        if (!defaultedOptions.queryHash) {
            defaultedOptions.queryHash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hashQueryKeyByOptions"])(defaultedOptions.queryKey, defaultedOptions);
        }
        if (defaultedOptions.refetchOnReconnect === void 0) {
            defaultedOptions.refetchOnReconnect = defaultedOptions.networkMode !== "always";
        }
        if (defaultedOptions.throwOnError === void 0) {
            defaultedOptions.throwOnError = !!defaultedOptions.suspense;
        }
        if (!defaultedOptions.networkMode && defaultedOptions.persister) {
            defaultedOptions.networkMode = "offlineFirst";
        }
        if (defaultedOptions.queryFn === __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["skipToken"]) {
            defaultedOptions.enabled = false;
        }
        return defaultedOptions;
    }
    defaultMutationOptions(options) {
        if (options?._defaulted) {
            return options;
        }
        return {
            ...this.#defaultOptions.mutations,
            ...options?.mutationKey && this.getMutationDefaults(options.mutationKey),
            ...options,
            _defaulted: true
        };
    }
    clear() {
        this.#queryCache.clear();
        this.#mutationCache.clear();
    }
};
;
 //# sourceMappingURL=queryClient.js.map
}),
"[project]/barber/node_modules/@trpc/tanstack-react-query/dist/index.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createTRPCContext",
    ()=>createTRPCContext,
    "createTRPCOptionsProxy",
    ()=>createTRPCOptionsProxy,
    "useSubscription",
    ()=>useSubscription
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$trpc$2f$client$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/barber/node_modules/@trpc/client/dist/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$trpc$2f$server$2f$dist$2f$tracked$2d$Bjtgv3wJ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__callProcedure__as__callTRPCProcedure$3e$__ = __turbopack_context__.i("[project]/barber/node_modules/@trpc/server/dist/tracked-Bjtgv3wJ.mjs [app-client] (ecmascript) <export callProcedure as callTRPCProcedure>");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$trpc$2f$server$2f$dist$2f$getErrorShape$2d$vC8mUXJD$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__createRecursiveProxy__as__createTRPCRecursiveProxy$3e$__ = __turbopack_context__.i("[project]/barber/node_modules/@trpc/server/dist/getErrorShape-vC8mUXJD.mjs [app-client] (ecmascript) <export createRecursiveProxy as createTRPCRecursiveProxy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/@tanstack/query-core/build/modern/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$infiniteQueryOptions$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/@tanstack/react-query/build/modern/infiniteQueryOptions.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$queryOptions$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/@tanstack/react-query/build/modern/queryOptions.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$trpc$2f$server$2f$dist$2f$codes$2d$DagpWZLc$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/@trpc/server/dist/codes-DagpWZLc.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
;
;
;
;
;
;
;
//#region rolldown:runtime
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod)=>function() {
        return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = {
            exports: {}
        }).exports, mod), mod.exports;
    };
var __copyProps = (to, from, except, desc)=>{
    if (from && typeof from === "object" || typeof from === "function") for(var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++){
        key = keys[i];
        if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
            get: ((k)=>from[k]).bind(null, key),
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
    }
    return to;
};
var __toESM = (mod, isNodeMode, target)=>(target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
        value: mod,
        enumerable: true
    }) : target, mod));
//#endregion
//#region ../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/typeof.js
var require_typeof = __commonJS({
    "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/typeof.js" (exports, module) {
        function _typeof$2(o) {
            "@babel/helpers - typeof";
            return module.exports = _typeof$2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o$1) {
                return typeof o$1;
            } : function(o$1) {
                return o$1 && "function" == typeof Symbol && o$1.constructor === Symbol && o$1 !== Symbol.prototype ? "symbol" : typeof o$1;
            }, module.exports.__esModule = true, module.exports["default"] = module.exports, _typeof$2(o);
        }
        module.exports = _typeof$2, module.exports.__esModule = true, module.exports["default"] = module.exports;
    }
});
//#endregion
//#region ../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/toPrimitive.js
var require_toPrimitive = __commonJS({
    "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/toPrimitive.js" (exports, module) {
        var _typeof$1 = require_typeof()["default"];
        function toPrimitive$1(t, r) {
            if ("object" != _typeof$1(t) || !t) return t;
            var e = t[Symbol.toPrimitive];
            if (void 0 !== e) {
                var i = e.call(t, r || "default");
                if ("object" != _typeof$1(i)) return i;
                throw new TypeError("@@toPrimitive must return a primitive value.");
            }
            return ("string" === r ? String : Number)(t);
        }
        module.exports = toPrimitive$1, module.exports.__esModule = true, module.exports["default"] = module.exports;
    }
});
//#endregion
//#region ../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/toPropertyKey.js
var require_toPropertyKey = __commonJS({
    "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/toPropertyKey.js" (exports, module) {
        var _typeof = require_typeof()["default"];
        var toPrimitive = require_toPrimitive();
        function toPropertyKey$1(t) {
            var i = toPrimitive(t, "string");
            return "symbol" == _typeof(i) ? i : i + "";
        }
        module.exports = toPropertyKey$1, module.exports.__esModule = true, module.exports["default"] = module.exports;
    }
});
//#endregion
//#region ../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/defineProperty.js
var require_defineProperty = __commonJS({
    "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/defineProperty.js" (exports, module) {
        var toPropertyKey = require_toPropertyKey();
        function _defineProperty(e, r, t) {
            return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
                value: t,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[r] = t, e;
        }
        module.exports = _defineProperty, module.exports.__esModule = true, module.exports["default"] = module.exports;
    }
});
//#endregion
//#region ../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/objectSpread2.js
var require_objectSpread2 = __commonJS({
    "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/objectSpread2.js" (exports, module) {
        var defineProperty = require_defineProperty();
        function ownKeys(e, r) {
            var t = Object.keys(e);
            if (Object.getOwnPropertySymbols) {
                var o = Object.getOwnPropertySymbols(e);
                r && (o = o.filter(function(r$1) {
                    return Object.getOwnPropertyDescriptor(e, r$1).enumerable;
                })), t.push.apply(t, o);
            }
            return t;
        }
        function _objectSpread2(e) {
            for(var r = 1; r < arguments.length; r++){
                var t = null != arguments[r] ? arguments[r] : {};
                r % 2 ? ownKeys(Object(t), !0).forEach(function(r$1) {
                    defineProperty(e, r$1, t[r$1]);
                }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r$1) {
                    Object.defineProperty(e, r$1, Object.getOwnPropertyDescriptor(t, r$1));
                });
            }
            return e;
        }
        module.exports = _objectSpread2, module.exports.__esModule = true, module.exports["default"] = module.exports;
    }
});
//#endregion
//#region ../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/asyncIterator.js
var require_asyncIterator = __commonJS({
    "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/asyncIterator.js" (exports, module) {
        function _asyncIterator$1(r) {
            var n, t, o, e = 2;
            for("undefined" != typeof Symbol && (t = Symbol.asyncIterator, o = Symbol.iterator); e--;){
                if (t && null != (n = r[t])) return n.call(r);
                if (o && null != (n = r[o])) return new AsyncFromSyncIterator(n.call(r));
                t = "@@asyncIterator", o = "@@iterator";
            }
            throw new TypeError("Object is not async iterable");
        }
        function AsyncFromSyncIterator(r) {
            function AsyncFromSyncIteratorContinuation(r$1) {
                if (Object(r$1) !== r$1) return Promise.reject(new TypeError(r$1 + " is not an object."));
                var n = r$1.done;
                return Promise.resolve(r$1.value).then(function(r$2) {
                    return {
                        value: r$2,
                        done: n
                    };
                });
            }
            return AsyncFromSyncIterator = function AsyncFromSyncIterator$1(r$1) {
                this.s = r$1, this.n = r$1.next;
            }, AsyncFromSyncIterator.prototype = {
                s: null,
                n: null,
                next: function next() {
                    return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments));
                },
                "return": function _return(r$1) {
                    var n = this.s["return"];
                    return void 0 === n ? Promise.resolve({
                        value: r$1,
                        done: !0
                    }) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments));
                },
                "throw": function _throw(r$1) {
                    var n = this.s["return"];
                    return void 0 === n ? Promise.reject(r$1) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments));
                }
            }, new AsyncFromSyncIterator(r);
        }
        module.exports = _asyncIterator$1, module.exports.__esModule = true, module.exports["default"] = module.exports;
    }
});
//#endregion
//#region ../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/objectWithoutPropertiesLoose.js
var require_objectWithoutPropertiesLoose = __commonJS({
    "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/objectWithoutPropertiesLoose.js" (exports, module) {
        function _objectWithoutPropertiesLoose(r, e) {
            if (null == r) return {};
            var t = {};
            for(var n in r)if (({}).hasOwnProperty.call(r, n)) {
                if (e.includes(n)) continue;
                t[n] = r[n];
            }
            return t;
        }
        module.exports = _objectWithoutPropertiesLoose, module.exports.__esModule = true, module.exports["default"] = module.exports;
    }
});
//#endregion
//#region ../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/objectWithoutProperties.js
var require_objectWithoutProperties = __commonJS({
    "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/objectWithoutProperties.js" (exports, module) {
        var objectWithoutPropertiesLoose = require_objectWithoutPropertiesLoose();
        function _objectWithoutProperties$1(e, t) {
            if (null == e) return {};
            var o, r, i = objectWithoutPropertiesLoose(e, t);
            if (Object.getOwnPropertySymbols) {
                var s = Object.getOwnPropertySymbols(e);
                for(r = 0; r < s.length; r++)o = s[r], t.includes(o) || ({}).propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
            }
            return i;
        }
        module.exports = _objectWithoutProperties$1, module.exports.__esModule = true, module.exports["default"] = module.exports;
    }
});
//#endregion
//#region src/internals/utils.ts
var import_objectSpread2$5 = __toESM(require_objectSpread2(), 1);
var import_asyncIterator = __toESM(require_asyncIterator(), 1);
var import_objectWithoutProperties = __toESM(require_objectWithoutProperties(), 1);
const _excluded = [
    "cursor",
    "direction"
];
/**
* @internal
*/ function createTRPCOptionsResult(value) {
    const path = value.path.join(".");
    return {
        path
    };
}
function isPrefixedQueryKey(queryKey) {
    return queryKey.length >= 3;
}
function readQueryKey(queryKey) {
    if (isPrefixedQueryKey(queryKey)) return {
        type: "prefixed",
        prefix: queryKey[0],
        path: queryKey[1],
        args: queryKey[2]
    };
    else return {
        type: "unprefixed",
        prefix: void 0,
        path: queryKey[0],
        args: queryKey[1]
    };
}
/**
* @internal
*/ function getClientArgs(queryKey, opts, infiniteParams) {
    var _queryKeyData$args;
    const queryKeyData = readQueryKey(queryKey);
    let input = (_queryKeyData$args = queryKeyData.args) === null || _queryKeyData$args === void 0 ? void 0 : _queryKeyData$args.input;
    if (infiniteParams) {
        var _queryKeyData$args$in, _queryKeyData$args2;
        input = (0, import_objectSpread2$5.default)((0, import_objectSpread2$5.default)((0, import_objectSpread2$5.default)({}, (_queryKeyData$args$in = (_queryKeyData$args2 = queryKeyData.args) === null || _queryKeyData$args2 === void 0 ? void 0 : _queryKeyData$args2.input) !== null && _queryKeyData$args$in !== void 0 ? _queryKeyData$args$in : {}), infiniteParams.pageParam !== void 0 ? {
            cursor: infiniteParams.pageParam
        } : {}), {}, {
            direction: infiniteParams.direction
        });
    }
    return [
        queryKeyData.path.join("."),
        input,
        opts === null || opts === void 0 ? void 0 : opts.trpc
    ];
}
/**
* @internal
*/ async function buildQueryFromAsyncIterable(asyncIterable, queryClient, queryKey) {
    const queryCache = queryClient.getQueryCache();
    const query = queryCache.build(queryClient, {
        queryKey
    });
    query.setState({
        data: [],
        status: "success"
    });
    const aggregate = [];
    var _iteratorAbruptCompletion = false;
    var _didIteratorError = false;
    var _iteratorError;
    try {
        for(var _iterator = (0, import_asyncIterator.default)(asyncIterable), _step; _iteratorAbruptCompletion = !(_step = await _iterator.next()).done; _iteratorAbruptCompletion = false){
            const value = _step.value;
            {
                aggregate.push(value);
                query.setState({
                    data: [
                        ...aggregate
                    ]
                });
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (_iteratorAbruptCompletion && _iterator.return != null) await _iterator.return();
        } finally{
            if (_didIteratorError) throw _iteratorError;
        }
    }
    return aggregate;
}
/**
* To allow easy interactions with groups of related queries, such as
* invalidating all queries of a router, we use an array as the path when
* storing in tanstack query.
*
* @internal
*/ function getQueryKeyInternal(opts) {
    const key = (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$trpc$2f$server$2f$dist$2f$codes$2d$DagpWZLc$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["run"])(()=>{
        const { input, type } = opts;
        const splitPath = opts.path.flatMap((part)=>part.split("."));
        if (!input && type === "any") return splitPath.length ? [
            splitPath
        ] : [];
        if (type === "infinite" && (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$trpc$2f$server$2f$dist$2f$codes$2d$DagpWZLc$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isObject"])(input) && ("direction" in input || "cursor" in input)) {
            const { cursor: _, direction: __ } = input, inputWithoutCursorAndDirection = (0, import_objectWithoutProperties.default)(input, _excluded);
            return [
                splitPath,
                {
                    input: inputWithoutCursorAndDirection,
                    type: "infinite"
                }
            ];
        }
        return [
            splitPath,
            (0, import_objectSpread2$5.default)((0, import_objectSpread2$5.default)({}, typeof input !== "undefined" && input !== __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["skipToken"] && {
                input
            }), type && type !== "any" && {
                type
            })
        ];
    });
    if (opts.prefix) key.unshift([
        opts.prefix
    ]);
    return key;
}
/**
* @internal
*/ function getMutationKeyInternal(opts) {
    const key = [
        opts.path.flatMap((part)=>part.split("."))
    ];
    if (opts.prefix) key.unshift([
        opts.prefix
    ]);
    return key;
}
/**
* @internal
*/ function unwrapLazyArg(valueOrLazy) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$trpc$2f$server$2f$dist$2f$codes$2d$DagpWZLc$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isFunction"])(valueOrLazy) ? valueOrLazy() : valueOrLazy;
}
//#endregion
//#region src/internals/infiniteQueryOptions.ts
var import_objectSpread2$4 = __toESM(require_objectSpread2());
function trpcInfiniteQueryOptions(args) {
    var _opts$initialCursor;
    const { input, query, path, queryKey, opts } = args;
    const inputIsSkipToken = input === __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["skipToken"];
    const queryFn = async (queryFnContext)=>{
        var _opts$trpc;
        const actualOpts = (0, import_objectSpread2$4.default)((0, import_objectSpread2$4.default)({}, opts), {}, {
            trpc: (0, import_objectSpread2$4.default)((0, import_objectSpread2$4.default)({}, opts === null || opts === void 0 ? void 0 : opts.trpc), (opts === null || opts === void 0 || (_opts$trpc = opts.trpc) === null || _opts$trpc === void 0 ? void 0 : _opts$trpc.abortOnUnmount) ? {
                signal: queryFnContext.signal
            } : {
                signal: null
            })
        });
        const result = await query(...getClientArgs(queryKey, actualOpts, {
            direction: queryFnContext.direction,
            pageParam: queryFnContext.pageParam
        }));
        return result;
    };
    return Object.assign((0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$infiniteQueryOptions$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["infiniteQueryOptions"])((0, import_objectSpread2$4.default)((0, import_objectSpread2$4.default)({}, opts !== null && opts !== void 0 ? opts : {}), {}, {
        queryKey,
        queryFn: inputIsSkipToken ? __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["skipToken"] : queryFn,
        initialPageParam: (_opts$initialCursor = opts === null || opts === void 0 ? void 0 : opts.initialCursor) !== null && _opts$initialCursor !== void 0 ? _opts$initialCursor : input === null || input === void 0 ? void 0 : input.cursor
    })), {
        trpc: createTRPCOptionsResult({
            path
        })
    });
}
//#endregion
//#region src/internals/mutationOptions.ts
var import_objectSpread2$3 = __toESM(require_objectSpread2());
/**
* @internal
*/ function trpcMutationOptions(args) {
    var _overrides$onSuccess;
    const { mutate, path, opts, overrides } = args;
    const queryClient = unwrapLazyArg(args.queryClient);
    const mutationKey = getMutationKeyInternal({
        path,
        prefix: opts === null || opts === void 0 ? void 0 : opts.keyPrefix
    });
    const defaultOpts = queryClient.defaultMutationOptions(queryClient.getMutationDefaults(mutationKey));
    const mutationSuccessOverride = (_overrides$onSuccess = overrides === null || overrides === void 0 ? void 0 : overrides.onSuccess) !== null && _overrides$onSuccess !== void 0 ? _overrides$onSuccess : (options)=>options.originalFn();
    const mutationFn = async (input)=>{
        const result = await mutate(...getClientArgs([
            ...mutationKey,
            {
                input
            }
        ], opts));
        return result;
    };
    return (0, import_objectSpread2$3.default)((0, import_objectSpread2$3.default)({}, opts), {}, {
        mutationKey,
        mutationFn,
        onSuccess (...args$1) {
            var _ref, _opts$meta;
            const originalFn = ()=>{
                var _opts$onSuccess, _opts$onSuccess2, _defaultOpts$onSucces;
                return (_opts$onSuccess = opts === null || opts === void 0 || (_opts$onSuccess2 = opts.onSuccess) === null || _opts$onSuccess2 === void 0 ? void 0 : _opts$onSuccess2.call(opts, ...args$1)) !== null && _opts$onSuccess !== void 0 ? _opts$onSuccess : defaultOpts === null || defaultOpts === void 0 || (_defaultOpts$onSucces = defaultOpts.onSuccess) === null || _defaultOpts$onSucces === void 0 ? void 0 : _defaultOpts$onSucces.call(defaultOpts, ...args$1);
            };
            return mutationSuccessOverride({
                originalFn,
                queryClient,
                meta: (_ref = (_opts$meta = opts === null || opts === void 0 ? void 0 : opts.meta) !== null && _opts$meta !== void 0 ? _opts$meta : defaultOpts === null || defaultOpts === void 0 ? void 0 : defaultOpts.meta) !== null && _ref !== void 0 ? _ref : {}
            });
        },
        trpc: createTRPCOptionsResult({
            path
        })
    });
}
//#endregion
//#region src/internals/queryOptions.ts
var import_objectSpread2$2 = __toESM(require_objectSpread2());
/**
* @internal
*/ function trpcQueryOptions(args) {
    const { input, query, path, queryKey, opts } = args;
    const queryClient = unwrapLazyArg(args.queryClient);
    const inputIsSkipToken = input === __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["skipToken"];
    const queryFn = async (queryFnContext)=>{
        var _opts$trpc;
        const actualOpts = (0, import_objectSpread2$2.default)((0, import_objectSpread2$2.default)({}, opts), {}, {
            trpc: (0, import_objectSpread2$2.default)((0, import_objectSpread2$2.default)({}, opts === null || opts === void 0 ? void 0 : opts.trpc), (opts === null || opts === void 0 || (_opts$trpc = opts.trpc) === null || _opts$trpc === void 0 ? void 0 : _opts$trpc.abortOnUnmount) ? {
                signal: queryFnContext.signal
            } : {
                signal: null
            })
        });
        const queryKey$1 = queryFnContext.queryKey;
        const result = await query(...getClientArgs(queryKey$1, actualOpts));
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$trpc$2f$server$2f$dist$2f$codes$2d$DagpWZLc$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isAsyncIterable"])(result)) return buildQueryFromAsyncIterable(result, queryClient, queryKey$1);
        return result;
    };
    return Object.assign((0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$queryOptions$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["queryOptions"])((0, import_objectSpread2$2.default)((0, import_objectSpread2$2.default)({}, opts), {}, {
        queryKey,
        queryFn: inputIsSkipToken ? __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["skipToken"] : queryFn
    })), {
        trpc: createTRPCOptionsResult({
            path
        })
    });
}
//#endregion
//#region src/internals/subscriptionOptions.ts
var import_objectSpread2$1 = __toESM(require_objectSpread2(), 1);
/**
* @internal
*/ const trpcSubscriptionOptions = (args)=>{
    var _readQueryKey;
    const { subscribe, path, queryKey, opts = {} } = args;
    const input = (_readQueryKey = readQueryKey(queryKey)) === null || _readQueryKey === void 0 || (_readQueryKey = _readQueryKey.args) === null || _readQueryKey === void 0 ? void 0 : _readQueryKey.input;
    const enabled = "enabled" in opts ? !!opts.enabled : input !== __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["skipToken"];
    const _subscribe = (innerOpts)=>{
        return subscribe(path.join("."), input !== null && input !== void 0 ? input : void 0, innerOpts);
    };
    return (0, import_objectSpread2$1.default)((0, import_objectSpread2$1.default)({}, opts), {}, {
        enabled,
        subscribe: _subscribe,
        queryKey,
        trpc: createTRPCOptionsResult({
            path
        })
    });
};
function useSubscription(opts) {
    const optsRef = __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](opts);
    optsRef.current = opts;
    const trackedProps = __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](new Set([]));
    const addTrackedProp = __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "useSubscription.useCallback[addTrackedProp]": (key)=>{
            trackedProps.current.add(key);
        }
    }["useSubscription.useCallback[addTrackedProp]"], []);
    const currentSubscriptionRef = __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"]({
        "useSubscription.useRef[currentSubscriptionRef]": ()=>{}
    }["useSubscription.useRef[currentSubscriptionRef]"]);
    const reset = __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "useSubscription.useCallback[reset]": ()=>{
            var _currentSubscriptionR;
            (_currentSubscriptionR = currentSubscriptionRef.current) === null || _currentSubscriptionR === void 0 || _currentSubscriptionR.call(currentSubscriptionRef);
            updateState(getInitialState);
            if (!opts.enabled) return;
            const subscription = opts.subscribe({
                onStarted: {
                    "useSubscription.useCallback[reset].subscription": ()=>{
                        var _optsRef$current$onSt, _optsRef$current;
                        (_optsRef$current$onSt = (_optsRef$current = optsRef.current).onStarted) === null || _optsRef$current$onSt === void 0 || _optsRef$current$onSt.call(_optsRef$current);
                        updateState({
                            "useSubscription.useCallback[reset].subscription": (prev)=>(0, import_objectSpread2$1.default)((0, import_objectSpread2$1.default)({}, prev), {}, {
                                    status: "pending",
                                    error: null
                                })
                        }["useSubscription.useCallback[reset].subscription"]);
                    }
                }["useSubscription.useCallback[reset].subscription"],
                onData: {
                    "useSubscription.useCallback[reset].subscription": (data)=>{
                        var _optsRef$current$onDa, _optsRef$current2;
                        (_optsRef$current$onDa = (_optsRef$current2 = optsRef.current).onData) === null || _optsRef$current$onDa === void 0 || _optsRef$current$onDa.call(_optsRef$current2, data);
                        updateState({
                            "useSubscription.useCallback[reset].subscription": (prev)=>(0, import_objectSpread2$1.default)((0, import_objectSpread2$1.default)({}, prev), {}, {
                                    status: "pending",
                                    data,
                                    error: null
                                })
                        }["useSubscription.useCallback[reset].subscription"]);
                    }
                }["useSubscription.useCallback[reset].subscription"],
                onError: {
                    "useSubscription.useCallback[reset].subscription": (error)=>{
                        var _optsRef$current$onEr, _optsRef$current3;
                        (_optsRef$current$onEr = (_optsRef$current3 = optsRef.current).onError) === null || _optsRef$current$onEr === void 0 || _optsRef$current$onEr.call(_optsRef$current3, error);
                        updateState({
                            "useSubscription.useCallback[reset].subscription": (prev)=>(0, import_objectSpread2$1.default)((0, import_objectSpread2$1.default)({}, prev), {}, {
                                    status: "error",
                                    error
                                })
                        }["useSubscription.useCallback[reset].subscription"]);
                    }
                }["useSubscription.useCallback[reset].subscription"],
                onConnectionStateChange: {
                    "useSubscription.useCallback[reset].subscription": (result)=>{
                        var _optsRef$current$onCo, _optsRef$current4;
                        (_optsRef$current$onCo = (_optsRef$current4 = optsRef.current).onConnectionStateChange) === null || _optsRef$current$onCo === void 0 || _optsRef$current$onCo.call(_optsRef$current4, result);
                        updateState({
                            "useSubscription.useCallback[reset].subscription": (prev)=>{
                                switch(result.state){
                                    case "connecting":
                                        return (0, import_objectSpread2$1.default)((0, import_objectSpread2$1.default)({}, prev), {}, {
                                            status: "connecting",
                                            error: result.error
                                        });
                                    case "pending":
                                        return prev;
                                    case "idle":
                                        return (0, import_objectSpread2$1.default)((0, import_objectSpread2$1.default)({}, prev), {}, {
                                            status: "idle",
                                            data: void 0,
                                            error: null
                                        });
                                }
                            }
                        }["useSubscription.useCallback[reset].subscription"]);
                    }
                }["useSubscription.useCallback[reset].subscription"]
            });
            currentSubscriptionRef.current = ({
                "useSubscription.useCallback[reset]": ()=>{
                    subscription.unsubscribe();
                }
            })["useSubscription.useCallback[reset]"];
        }
    }["useSubscription.useCallback[reset]"], [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hashKey"])(opts.queryKey),
        opts.enabled
    ]);
    const getInitialState = __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "useSubscription.useCallback[getInitialState]": ()=>{
            return opts.enabled ? {
                data: void 0,
                error: null,
                status: "connecting",
                reset
            } : {
                data: void 0,
                error: null,
                status: "idle",
                reset
            };
        }
    }["useSubscription.useCallback[getInitialState]"], [
        opts.enabled,
        reset
    ]);
    const resultRef = __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](getInitialState());
    const [state, setState] = __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](trackResult(resultRef, addTrackedProp));
    state.reset = reset;
    const updateState = __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "useSubscription.useCallback[updateState]": (callback)=>{
            const prev = resultRef.current;
            const next = resultRef.current = callback(prev);
            let shouldUpdate = false;
            for (const key of trackedProps.current)if (prev[key] !== next[key]) {
                shouldUpdate = true;
                break;
            }
            if (shouldUpdate) setState(trackResult(resultRef, addTrackedProp));
        }
    }["useSubscription.useCallback[updateState]"], [
        addTrackedProp
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "useSubscription.useEffect": ()=>{
            if (!opts.enabled) return;
            reset();
            return ({
                "useSubscription.useEffect": ()=>{
                    var _currentSubscriptionR2;
                    (_currentSubscriptionR2 = currentSubscriptionRef.current) === null || _currentSubscriptionR2 === void 0 || _currentSubscriptionR2.call(currentSubscriptionRef);
                }
            })["useSubscription.useEffect"];
        }
    }["useSubscription.useEffect"], [
        reset,
        opts.enabled
    ]);
    return state;
}
function trackResult(result, onTrackResult) {
    const trackedResult = new Proxy(result.current, {
        get (_target, prop) {
            onTrackResult(prop);
            return result.current[prop];
        }
    });
    return trackedResult;
}
//#endregion
//#region src/internals/createOptionsProxy.ts
var import_objectSpread2 = __toESM(require_objectSpread2(), 1);
/**
* Create a typed proxy from your router types. Can also be used on the server.
*
* @see https://trpc.io/docs/client/tanstack-react-query/setup#3b-setup-without-react-context
* @see https://trpc.io/docs/client/tanstack-react-query/server-components#5-create-a-trpc-caller-for-server-components
*/ function createTRPCOptionsProxy(opts) {
    const prefix = opts.keyPrefix;
    const callIt = (type)=>{
        return (path, input, trpcOpts)=>{
            if ("router" in opts) return Promise.resolve(unwrapLazyArg(opts.ctx)).then((ctx)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$trpc$2f$server$2f$dist$2f$tracked$2d$Bjtgv3wJ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__callProcedure__as__callTRPCProcedure$3e$__["callTRPCProcedure"])({
                    router: opts.router,
                    path,
                    getRawInput: async ()=>input,
                    ctx,
                    type,
                    signal: void 0,
                    batchIndex: 0
                }));
            const untypedClient = opts.client instanceof __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$trpc$2f$client$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["TRPCUntypedClient"] ? opts.client : (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$trpc$2f$client$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getUntypedClient"])(opts.client);
            return untypedClient[type](path, input, trpcOpts);
        };
    };
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$trpc$2f$server$2f$dist$2f$getErrorShape$2d$vC8mUXJD$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__createRecursiveProxy__as__createTRPCRecursiveProxy$3e$__["createTRPCRecursiveProxy"])(({ args, path: _path })=>{
        const path = [
            ..._path
        ];
        const utilName = path.pop();
        const [arg1, arg2] = args;
        const contextMap = {
            "~types": void 0,
            pathKey: ()=>{
                return getQueryKeyInternal({
                    path,
                    type: "any",
                    prefix
                });
            },
            pathFilter: ()=>{
                return (0, import_objectSpread2.default)((0, import_objectSpread2.default)({}, arg1), {}, {
                    queryKey: getQueryKeyInternal({
                        path,
                        type: "any",
                        prefix
                    })
                });
            },
            queryOptions: ()=>{
                return trpcQueryOptions({
                    input: arg1,
                    opts: arg2,
                    path,
                    queryClient: opts.queryClient,
                    queryKey: getQueryKeyInternal({
                        path,
                        input: arg1,
                        type: "query",
                        prefix
                    }),
                    query: callIt("query")
                });
            },
            queryKey: ()=>{
                return getQueryKeyInternal({
                    path,
                    input: arg1,
                    type: "query",
                    prefix
                });
            },
            queryFilter: ()=>{
                return (0, import_objectSpread2.default)((0, import_objectSpread2.default)({}, arg2), {}, {
                    queryKey: getQueryKeyInternal({
                        path,
                        input: arg1,
                        type: "query",
                        prefix
                    })
                });
            },
            infiniteQueryOptions: ()=>{
                return trpcInfiniteQueryOptions({
                    input: arg1,
                    opts: arg2,
                    path,
                    queryClient: opts.queryClient,
                    queryKey: getQueryKeyInternal({
                        path,
                        input: arg1,
                        type: "infinite",
                        prefix
                    }),
                    query: callIt("query")
                });
            },
            infiniteQueryKey: ()=>{
                return getQueryKeyInternal({
                    path,
                    input: arg1,
                    type: "infinite",
                    prefix
                });
            },
            infiniteQueryFilter: ()=>{
                return (0, import_objectSpread2.default)((0, import_objectSpread2.default)({}, arg2), {}, {
                    queryKey: getQueryKeyInternal({
                        path,
                        input: arg1,
                        type: "infinite",
                        prefix
                    })
                });
            },
            mutationOptions: ()=>{
                var _opts$overrides;
                return trpcMutationOptions({
                    opts: arg1,
                    path,
                    queryClient: opts.queryClient,
                    mutate: callIt("mutation"),
                    overrides: (_opts$overrides = opts.overrides) === null || _opts$overrides === void 0 ? void 0 : _opts$overrides.mutations
                });
            },
            mutationKey: ()=>{
                return getMutationKeyInternal({
                    path,
                    prefix
                });
            },
            subscriptionOptions: ()=>{
                return trpcSubscriptionOptions({
                    opts: arg2,
                    path,
                    queryKey: getQueryKeyInternal({
                        path,
                        input: arg1,
                        type: "any",
                        prefix
                    }),
                    subscribe: callIt("subscription")
                });
            }
        };
        return contextMap[utilName]();
    });
}
//#endregion
//#region src/internals/Context.tsx
/**
* Create a set of type-safe provider-consumers
*
* @see https://trpc.io/docs/client/tanstack-react-query/setup#3a-setup-the-trpc-context-provider
*/ function createTRPCContext() {
    const TRPCClientContext = __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"](null);
    const TRPCContext = __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"](null);
    const TRPCProvider = (props)=>{
        const value = __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
            "createTRPCContext.TRPCProvider.useMemo[value]": ()=>createTRPCOptionsProxy({
                    client: props.trpcClient,
                    queryClient: props.queryClient,
                    keyPrefix: props.keyPrefix
                })
        }["createTRPCContext.TRPCProvider.useMemo[value]"], [
            props.trpcClient,
            props.queryClient,
            props.keyPrefix
        ]);
        return /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(TRPCClientContext.Provider, {
            value: props.trpcClient,
            children: /* @__PURE__ */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsx"])(TRPCContext.Provider, {
                value,
                children: props.children
            })
        });
    };
    TRPCProvider.displayName = "TRPCProvider";
    function useTRPC() {
        const utils = __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"](TRPCContext);
        if (!utils) throw new Error("useTRPC() can only be used inside of a <TRPCProvider>");
        return utils;
    }
    function useTRPCClient() {
        const client = __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"](TRPCClientContext);
        if (!client) throw new Error("useTRPCClient() can only be used inside of a <TRPCProvider>");
        return client;
    }
    return {
        TRPCProvider,
        useTRPC,
        useTRPCClient
    };
}
;
 //# sourceMappingURL=index.mjs.map
}),
"[project]/barber/node_modules/superjson/dist/double-indexed-kv.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DoubleIndexedKV",
    ()=>DoubleIndexedKV
]);
class DoubleIndexedKV {
    constructor(){
        this.keyToValue = new Map();
        this.valueToKey = new Map();
    }
    set(key, value) {
        this.keyToValue.set(key, value);
        this.valueToKey.set(value, key);
    }
    getByKey(key) {
        return this.keyToValue.get(key);
    }
    getByValue(value) {
        return this.valueToKey.get(value);
    }
    clear() {
        this.keyToValue.clear();
        this.valueToKey.clear();
    }
} //# sourceMappingURL=double-indexed-kv.js.map
}),
"[project]/barber/node_modules/superjson/dist/registry.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Registry",
    ()=>Registry
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$double$2d$indexed$2d$kv$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/superjson/dist/double-indexed-kv.js [app-client] (ecmascript)");
;
class Registry {
    constructor(generateIdentifier){
        this.generateIdentifier = generateIdentifier;
        this.kv = new __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$double$2d$indexed$2d$kv$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DoubleIndexedKV"]();
    }
    register(value, identifier) {
        if (this.kv.getByValue(value)) {
            return;
        }
        if (!identifier) {
            identifier = this.generateIdentifier(value);
        }
        this.kv.set(identifier, value);
    }
    clear() {
        this.kv.clear();
    }
    getIdentifier(value) {
        return this.kv.getByValue(value);
    }
    getValue(identifier) {
        return this.kv.getByKey(identifier);
    }
} //# sourceMappingURL=registry.js.map
}),
"[project]/barber/node_modules/superjson/dist/class-registry.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ClassRegistry",
    ()=>ClassRegistry
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$registry$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/superjson/dist/registry.js [app-client] (ecmascript)");
;
class ClassRegistry extends __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$registry$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Registry"] {
    constructor(){
        super((c)=>c.name);
        this.classToAllowedProps = new Map();
    }
    register(value, options) {
        if (typeof options === 'object') {
            if (options.allowProps) {
                this.classToAllowedProps.set(value, options.allowProps);
            }
            super.register(value, options.identifier);
        } else {
            super.register(value, options);
        }
    }
    getAllowedProps(value) {
        return this.classToAllowedProps.get(value);
    }
} //# sourceMappingURL=class-registry.js.map
}),
"[project]/barber/node_modules/superjson/dist/util.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "find",
    ()=>find,
    "findArr",
    ()=>findArr,
    "forEach",
    ()=>forEach,
    "includes",
    ()=>includes
]);
function valuesOfObj(record) {
    if ('values' in Object) {
        // eslint-disable-next-line es5/no-es6-methods
        return Object.values(record);
    }
    const values = [];
    // eslint-disable-next-line no-restricted-syntax
    for(const key in record){
        if (record.hasOwnProperty(key)) {
            values.push(record[key]);
        }
    }
    return values;
}
function find(record, predicate) {
    const values = valuesOfObj(record);
    if ('find' in values) {
        // eslint-disable-next-line es5/no-es6-methods
        return values.find(predicate);
    }
    const valuesNotNever = values;
    for(let i = 0; i < valuesNotNever.length; i++){
        const value = valuesNotNever[i];
        if (predicate(value)) {
            return value;
        }
    }
    return undefined;
}
function forEach(record, run) {
    Object.entries(record).forEach(([key, value])=>run(value, key));
}
function includes(arr, value) {
    return arr.indexOf(value) !== -1;
}
function findArr(record, predicate) {
    for(let i = 0; i < record.length; i++){
        const value = record[i];
        if (predicate(value)) {
            return value;
        }
    }
    return undefined;
} //# sourceMappingURL=util.js.map
}),
"[project]/barber/node_modules/superjson/dist/custom-transformer-registry.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CustomTransformerRegistry",
    ()=>CustomTransformerRegistry
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/superjson/dist/util.js [app-client] (ecmascript)");
;
class CustomTransformerRegistry {
    constructor(){
        this.transfomers = {};
    }
    register(transformer) {
        this.transfomers[transformer.name] = transformer;
    }
    findApplicable(v) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["find"])(this.transfomers, (transformer)=>transformer.isApplicable(v));
    }
    findByName(name) {
        return this.transfomers[name];
    }
} //# sourceMappingURL=custom-transformer-registry.js.map
}),
"[project]/barber/node_modules/superjson/dist/is.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isArray",
    ()=>isArray,
    "isBigint",
    ()=>isBigint,
    "isBoolean",
    ()=>isBoolean,
    "isDate",
    ()=>isDate,
    "isEmptyObject",
    ()=>isEmptyObject,
    "isError",
    ()=>isError,
    "isInfinite",
    ()=>isInfinite,
    "isMap",
    ()=>isMap,
    "isNaNValue",
    ()=>isNaNValue,
    "isNull",
    ()=>isNull,
    "isNumber",
    ()=>isNumber,
    "isPlainObject",
    ()=>isPlainObject,
    "isPrimitive",
    ()=>isPrimitive,
    "isRegExp",
    ()=>isRegExp,
    "isSet",
    ()=>isSet,
    "isString",
    ()=>isString,
    "isSymbol",
    ()=>isSymbol,
    "isTypedArray",
    ()=>isTypedArray,
    "isURL",
    ()=>isURL,
    "isUndefined",
    ()=>isUndefined
]);
const getType = (payload)=>Object.prototype.toString.call(payload).slice(8, -1);
const isUndefined = (payload)=>typeof payload === 'undefined';
const isNull = (payload)=>payload === null;
const isPlainObject = (payload)=>{
    if (typeof payload !== 'object' || payload === null) return false;
    if (payload === Object.prototype) return false;
    if (Object.getPrototypeOf(payload) === null) return true;
    return Object.getPrototypeOf(payload) === Object.prototype;
};
const isEmptyObject = (payload)=>isPlainObject(payload) && Object.keys(payload).length === 0;
const isArray = (payload)=>Array.isArray(payload);
const isString = (payload)=>typeof payload === 'string';
const isNumber = (payload)=>typeof payload === 'number' && !isNaN(payload);
const isBoolean = (payload)=>typeof payload === 'boolean';
const isRegExp = (payload)=>payload instanceof RegExp;
const isMap = (payload)=>payload instanceof Map;
const isSet = (payload)=>payload instanceof Set;
const isSymbol = (payload)=>getType(payload) === 'Symbol';
const isDate = (payload)=>payload instanceof Date && !isNaN(payload.valueOf());
const isError = (payload)=>payload instanceof Error;
const isNaNValue = (payload)=>typeof payload === 'number' && isNaN(payload);
const isPrimitive = (payload)=>isBoolean(payload) || isNull(payload) || isUndefined(payload) || isNumber(payload) || isString(payload) || isSymbol(payload);
const isBigint = (payload)=>typeof payload === 'bigint';
const isInfinite = (payload)=>payload === Infinity || payload === -Infinity;
const isTypedArray = (payload)=>ArrayBuffer.isView(payload) && !(payload instanceof DataView);
const isURL = (payload)=>payload instanceof URL; //# sourceMappingURL=is.js.map
}),
"[project]/barber/node_modules/superjson/dist/pathstringifier.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "escapeKey",
    ()=>escapeKey,
    "parsePath",
    ()=>parsePath,
    "stringifyPath",
    ()=>stringifyPath
]);
const escapeKey = (key)=>key.replace(/\\/g, '\\\\').replace(/\./g, '\\.');
const stringifyPath = (path)=>path.map(String).map(escapeKey).join('.');
const parsePath = (string, legacyPaths)=>{
    const result = [];
    let segment = '';
    for(let i = 0; i < string.length; i++){
        let char = string.charAt(i);
        if (!legacyPaths && char === '\\') {
            const escaped = string.charAt(i + 1);
            if (escaped === '\\') {
                segment += '\\';
                i++;
                continue;
            } else if (escaped !== '.') {
                throw Error('invalid path');
            }
        }
        const isEscapedDot = char === '\\' && string.charAt(i + 1) === '.';
        if (isEscapedDot) {
            segment += '.';
            i++;
            continue;
        }
        const isEndOfSegment = char === '.';
        if (isEndOfSegment) {
            result.push(segment);
            segment = '';
            continue;
        }
        segment += char;
    }
    const lastSegment = segment;
    result.push(lastSegment);
    return result;
}; //# sourceMappingURL=pathstringifier.js.map
}),
"[project]/barber/node_modules/superjson/dist/transformer.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isInstanceOfRegisteredClass",
    ()=>isInstanceOfRegisteredClass,
    "transformValue",
    ()=>transformValue,
    "untransformValue",
    ()=>untransformValue
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$is$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/superjson/dist/is.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/superjson/dist/util.js [app-client] (ecmascript)");
;
;
function simpleTransformation(isApplicable, annotation, transform, untransform) {
    return {
        isApplicable,
        annotation,
        transform,
        untransform
    };
}
const simpleRules = [
    simpleTransformation(__TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$is$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isUndefined"], 'undefined', ()=>null, ()=>undefined),
    simpleTransformation(__TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$is$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isBigint"], 'bigint', (v)=>v.toString(), (v)=>{
        if (typeof BigInt !== 'undefined') {
            return BigInt(v);
        }
        console.error('Please add a BigInt polyfill.');
        return v;
    }),
    simpleTransformation(__TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$is$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDate"], 'Date', (v)=>v.toISOString(), (v)=>new Date(v)),
    simpleTransformation(__TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$is$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isError"], 'Error', (v, superJson)=>{
        const baseError = {
            name: v.name,
            message: v.message
        };
        if ('cause' in v) {
            baseError.cause = v.cause;
        }
        superJson.allowedErrorProps.forEach((prop)=>{
            baseError[prop] = v[prop];
        });
        return baseError;
    }, (v, superJson)=>{
        const e = new Error(v.message, {
            cause: v.cause
        });
        e.name = v.name;
        e.stack = v.stack;
        superJson.allowedErrorProps.forEach((prop)=>{
            e[prop] = v[prop];
        });
        return e;
    }),
    simpleTransformation(__TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$is$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isRegExp"], 'regexp', (v)=>'' + v, (regex)=>{
        const body = regex.slice(1, regex.lastIndexOf('/'));
        const flags = regex.slice(regex.lastIndexOf('/') + 1);
        return new RegExp(body, flags);
    }),
    simpleTransformation(__TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$is$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isSet"], 'set', // (sets only exist in es6+)
    // eslint-disable-next-line es5/no-es6-methods
    (v)=>[
            ...v.values()
        ], (v)=>new Set(v)),
    simpleTransformation(__TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$is$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isMap"], 'map', (v)=>[
            ...v.entries()
        ], (v)=>new Map(v)),
    simpleTransformation((v)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$is$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNaNValue"])(v) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$is$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInfinite"])(v), 'number', (v)=>{
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$is$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isNaNValue"])(v)) {
            return 'NaN';
        }
        if (v > 0) {
            return 'Infinity';
        } else {
            return '-Infinity';
        }
    }, Number),
    simpleTransformation((v)=>v === 0 && 1 / v === -Infinity, 'number', ()=>{
        return '-0';
    }, Number),
    simpleTransformation(__TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$is$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isURL"], 'URL', (v)=>v.toString(), (v)=>new URL(v))
];
function compositeTransformation(isApplicable, annotation, transform, untransform) {
    return {
        isApplicable,
        annotation,
        transform,
        untransform
    };
}
const symbolRule = compositeTransformation((s, superJson)=>{
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$is$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isSymbol"])(s)) {
        const isRegistered = !!superJson.symbolRegistry.getIdentifier(s);
        return isRegistered;
    }
    return false;
}, (s, superJson)=>{
    const identifier = superJson.symbolRegistry.getIdentifier(s);
    return [
        'symbol',
        identifier
    ];
}, (v)=>v.description, (_, a, superJson)=>{
    const value = superJson.symbolRegistry.getValue(a[1]);
    if (!value) {
        throw new Error('Trying to deserialize unknown symbol');
    }
    return value;
});
const constructorToName = [
    Int8Array,
    Uint8Array,
    Int16Array,
    Uint16Array,
    Int32Array,
    Uint32Array,
    Float32Array,
    Float64Array,
    Uint8ClampedArray
].reduce((obj, ctor)=>{
    obj[ctor.name] = ctor;
    return obj;
}, {});
const typedArrayRule = compositeTransformation(__TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$is$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isTypedArray"], (v)=>[
        'typed-array',
        v.constructor.name
    ], (v)=>[
        ...v
    ], (v, a)=>{
    const ctor = constructorToName[a[1]];
    if (!ctor) {
        throw new Error('Trying to deserialize unknown typed array');
    }
    return new ctor(v);
});
function isInstanceOfRegisteredClass(potentialClass, superJson) {
    if (potentialClass?.constructor) {
        const isRegistered = !!superJson.classRegistry.getIdentifier(potentialClass.constructor);
        return isRegistered;
    }
    return false;
}
const classRule = compositeTransformation(isInstanceOfRegisteredClass, (clazz, superJson)=>{
    const identifier = superJson.classRegistry.getIdentifier(clazz.constructor);
    return [
        'class',
        identifier
    ];
}, (clazz, superJson)=>{
    const allowedProps = superJson.classRegistry.getAllowedProps(clazz.constructor);
    if (!allowedProps) {
        return {
            ...clazz
        };
    }
    const result = {};
    allowedProps.forEach((prop)=>{
        result[prop] = clazz[prop];
    });
    return result;
}, (v, a, superJson)=>{
    const clazz = superJson.classRegistry.getValue(a[1]);
    if (!clazz) {
        throw new Error(`Trying to deserialize unknown class '${a[1]}' - check https://github.com/blitz-js/superjson/issues/116#issuecomment-773996564`);
    }
    return Object.assign(Object.create(clazz.prototype), v);
});
const customRule = compositeTransformation((value, superJson)=>{
    return !!superJson.customTransformerRegistry.findApplicable(value);
}, (value, superJson)=>{
    const transformer = superJson.customTransformerRegistry.findApplicable(value);
    return [
        'custom',
        transformer.name
    ];
}, (value, superJson)=>{
    const transformer = superJson.customTransformerRegistry.findApplicable(value);
    return transformer.serialize(value);
}, (v, a, superJson)=>{
    const transformer = superJson.customTransformerRegistry.findByName(a[1]);
    if (!transformer) {
        throw new Error('Trying to deserialize unknown custom value');
    }
    return transformer.deserialize(v);
});
const compositeRules = [
    classRule,
    symbolRule,
    customRule,
    typedArrayRule
];
const transformValue = (value, superJson)=>{
    const applicableCompositeRule = (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findArr"])(compositeRules, (rule)=>rule.isApplicable(value, superJson));
    if (applicableCompositeRule) {
        return {
            value: applicableCompositeRule.transform(value, superJson),
            type: applicableCompositeRule.annotation(value, superJson)
        };
    }
    const applicableSimpleRule = (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findArr"])(simpleRules, (rule)=>rule.isApplicable(value, superJson));
    if (applicableSimpleRule) {
        return {
            value: applicableSimpleRule.transform(value, superJson),
            type: applicableSimpleRule.annotation
        };
    }
    return undefined;
};
const simpleRulesByAnnotation = {};
simpleRules.forEach((rule)=>{
    simpleRulesByAnnotation[rule.annotation] = rule;
});
const untransformValue = (json, type, superJson)=>{
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$is$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isArray"])(type)) {
        switch(type[0]){
            case 'symbol':
                return symbolRule.untransform(json, type, superJson);
            case 'class':
                return classRule.untransform(json, type, superJson);
            case 'custom':
                return customRule.untransform(json, type, superJson);
            case 'typed-array':
                return typedArrayRule.untransform(json, type, superJson);
            default:
                throw new Error('Unknown transformation: ' + type);
        }
    } else {
        const transformation = simpleRulesByAnnotation[type];
        if (!transformation) {
            throw new Error('Unknown transformation: ' + type);
        }
        return transformation.untransform(json, superJson);
    }
}; //# sourceMappingURL=transformer.js.map
}),
"[project]/barber/node_modules/superjson/dist/accessDeep.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getDeep",
    ()=>getDeep,
    "setDeep",
    ()=>setDeep
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$is$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/superjson/dist/is.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/superjson/dist/util.js [app-client] (ecmascript)");
;
;
const getNthKey = (value, n)=>{
    if (n > value.size) throw new Error('index out of bounds');
    const keys = value.keys();
    while(n > 0){
        keys.next();
        n--;
    }
    return keys.next().value;
};
function validatePath(path) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["includes"])(path, '__proto__')) {
        throw new Error('__proto__ is not allowed as a property');
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["includes"])(path, 'prototype')) {
        throw new Error('prototype is not allowed as a property');
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["includes"])(path, 'constructor')) {
        throw new Error('constructor is not allowed as a property');
    }
}
const getDeep = (object, path)=>{
    validatePath(path);
    for(let i = 0; i < path.length; i++){
        const key = path[i];
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$is$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isSet"])(object)) {
            object = getNthKey(object, +key);
        } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$is$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isMap"])(object)) {
            const row = +key;
            const type = +path[++i] === 0 ? 'key' : 'value';
            const keyOfRow = getNthKey(object, row);
            switch(type){
                case 'key':
                    object = keyOfRow;
                    break;
                case 'value':
                    object = object.get(keyOfRow);
                    break;
            }
        } else {
            object = object[key];
        }
    }
    return object;
};
const setDeep = (object, path, mapper)=>{
    validatePath(path);
    if (path.length === 0) {
        return mapper(object);
    }
    let parent = object;
    for(let i = 0; i < path.length - 1; i++){
        const key = path[i];
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$is$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isArray"])(parent)) {
            const index = +key;
            parent = parent[index];
        } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$is$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPlainObject"])(parent)) {
            parent = parent[key];
        } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$is$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isSet"])(parent)) {
            const row = +key;
            parent = getNthKey(parent, row);
        } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$is$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isMap"])(parent)) {
            const isEnd = i === path.length - 2;
            if (isEnd) {
                break;
            }
            const row = +key;
            const type = +path[++i] === 0 ? 'key' : 'value';
            const keyOfRow = getNthKey(parent, row);
            switch(type){
                case 'key':
                    parent = keyOfRow;
                    break;
                case 'value':
                    parent = parent.get(keyOfRow);
                    break;
            }
        }
    }
    const lastKey = path[path.length - 1];
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$is$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isArray"])(parent)) {
        parent[+lastKey] = mapper(parent[+lastKey]);
    } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$is$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPlainObject"])(parent)) {
        parent[lastKey] = mapper(parent[lastKey]);
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$is$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isSet"])(parent)) {
        const oldValue = getNthKey(parent, +lastKey);
        const newValue = mapper(oldValue);
        if (oldValue !== newValue) {
            parent.delete(oldValue);
            parent.add(newValue);
        }
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$is$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isMap"])(parent)) {
        const row = +path[path.length - 2];
        const keyToRow = getNthKey(parent, row);
        const type = +lastKey === 0 ? 'key' : 'value';
        switch(type){
            case 'key':
                {
                    const newKey = mapper(keyToRow);
                    parent.set(newKey, parent.get(keyToRow));
                    if (newKey !== keyToRow) {
                        parent.delete(keyToRow);
                    }
                    break;
                }
            case 'value':
                {
                    parent.set(keyToRow, mapper(parent.get(keyToRow)));
                    break;
                }
        }
    }
    return object;
}; //# sourceMappingURL=accessDeep.js.map
}),
"[project]/barber/node_modules/superjson/dist/plainer.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "applyReferentialEqualityAnnotations",
    ()=>applyReferentialEqualityAnnotations,
    "applyValueAnnotations",
    ()=>applyValueAnnotations,
    "generateReferentialEqualityAnnotations",
    ()=>generateReferentialEqualityAnnotations,
    "walker",
    ()=>walker
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$is$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/superjson/dist/is.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$pathstringifier$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/superjson/dist/pathstringifier.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$transformer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/superjson/dist/transformer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/superjson/dist/util.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$accessDeep$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/superjson/dist/accessDeep.js [app-client] (ecmascript)");
;
;
;
;
;
;
const enableLegacyPaths = (version)=>version < 1;
function traverse(tree, walker, version, origin = []) {
    if (!tree) {
        return;
    }
    const legacyPaths = enableLegacyPaths(version);
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$is$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isArray"])(tree)) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forEach"])(tree, (subtree, key)=>traverse(subtree, walker, version, [
                ...origin,
                ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$pathstringifier$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePath"])(key, legacyPaths)
            ]));
        return;
    }
    const [nodeValue, children] = tree;
    if (children) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forEach"])(children, (child, key)=>{
            traverse(child, walker, version, [
                ...origin,
                ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$pathstringifier$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePath"])(key, legacyPaths)
            ]);
        });
    }
    walker(nodeValue, origin);
}
function applyValueAnnotations(plain, annotations, version, superJson) {
    traverse(annotations, (type, path)=>{
        plain = (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$accessDeep$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setDeep"])(plain, path, (v)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$transformer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["untransformValue"])(v, type, superJson));
    }, version);
    return plain;
}
function applyReferentialEqualityAnnotations(plain, annotations, version) {
    const legacyPaths = enableLegacyPaths(version);
    function apply(identicalPaths, path) {
        const object = (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$accessDeep$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDeep"])(plain, (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$pathstringifier$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePath"])(path, legacyPaths));
        identicalPaths.map((path)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$pathstringifier$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePath"])(path, legacyPaths)).forEach((identicalObjectPath)=>{
            plain = (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$accessDeep$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setDeep"])(plain, identicalObjectPath, ()=>object);
        });
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$is$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isArray"])(annotations)) {
        const [root, other] = annotations;
        root.forEach((identicalPath)=>{
            plain = (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$accessDeep$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setDeep"])(plain, (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$pathstringifier$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parsePath"])(identicalPath, legacyPaths), ()=>plain);
        });
        if (other) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forEach"])(other, apply);
        }
    } else {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forEach"])(annotations, apply);
    }
    return plain;
}
const isDeep = (object, superJson)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$is$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPlainObject"])(object) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$is$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isArray"])(object) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$is$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isMap"])(object) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$is$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isSet"])(object) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$is$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isError"])(object) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$transformer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isInstanceOfRegisteredClass"])(object, superJson);
function addIdentity(object, path, identities) {
    const existingSet = identities.get(object);
    if (existingSet) {
        existingSet.push(path);
    } else {
        identities.set(object, [
            path
        ]);
    }
}
function generateReferentialEqualityAnnotations(identitites, dedupe) {
    const result = {};
    let rootEqualityPaths = undefined;
    identitites.forEach((paths)=>{
        if (paths.length <= 1) {
            return;
        }
        // if we're not deduping, all of these objects continue existing.
        // putting the shortest path first makes it easier to parse for humans
        // if we're deduping though, only the first entry will still exist, so we can't do this optimisation.
        if (!dedupe) {
            paths = paths.map((path)=>path.map(String)).sort((a, b)=>a.length - b.length);
        }
        const [representativePath, ...identicalPaths] = paths;
        if (representativePath.length === 0) {
            rootEqualityPaths = identicalPaths.map(__TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$pathstringifier$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stringifyPath"]);
        } else {
            result[(0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$pathstringifier$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stringifyPath"])(representativePath)] = identicalPaths.map(__TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$pathstringifier$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stringifyPath"]);
        }
    });
    if (rootEqualityPaths) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$is$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isEmptyObject"])(result)) {
            return [
                rootEqualityPaths
            ];
        } else {
            return [
                rootEqualityPaths,
                result
            ];
        }
    } else {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$is$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isEmptyObject"])(result) ? undefined : result;
    }
}
const walker = (object, identities, superJson, dedupe, path = [], objectsInThisPath = [], seenObjects = new Map())=>{
    const primitive = (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$is$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPrimitive"])(object);
    if (!primitive) {
        addIdentity(object, path, identities);
        const seen = seenObjects.get(object);
        if (seen) {
            // short-circuit result if we've seen this object before
            return dedupe ? {
                transformedValue: null
            } : seen;
        }
    }
    if (!isDeep(object, superJson)) {
        const transformed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$transformer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transformValue"])(object, superJson);
        const result = transformed ? {
            transformedValue: transformed.value,
            annotations: [
                transformed.type
            ]
        } : {
            transformedValue: object
        };
        if (!primitive) {
            seenObjects.set(object, result);
        }
        return result;
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["includes"])(objectsInThisPath, object)) {
        // prevent circular references
        return {
            transformedValue: null
        };
    }
    const transformationResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$transformer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["transformValue"])(object, superJson);
    const transformed = transformationResult?.value ?? object;
    const transformedValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$is$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isArray"])(transformed) ? [] : {};
    const innerAnnotations = {};
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forEach"])(transformed, (value, index)=>{
        if (index === '__proto__' || index === 'constructor' || index === 'prototype') {
            throw new Error(`Detected property ${index}. This is a prototype pollution risk, please remove it from your object.`);
        }
        const recursiveResult = walker(value, identities, superJson, dedupe, [
            ...path,
            index
        ], [
            ...objectsInThisPath,
            object
        ], seenObjects);
        transformedValue[index] = recursiveResult.transformedValue;
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$is$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isArray"])(recursiveResult.annotations)) {
            innerAnnotations[(0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$pathstringifier$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["escapeKey"])(index)] = recursiveResult.annotations;
        } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$is$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPlainObject"])(recursiveResult.annotations)) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$util$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forEach"])(recursiveResult.annotations, (tree, key)=>{
                innerAnnotations[(0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$pathstringifier$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["escapeKey"])(index) + '.' + key] = tree;
            });
        }
    });
    const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$is$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isEmptyObject"])(innerAnnotations) ? {
        transformedValue,
        annotations: !!transformationResult ? [
            transformationResult.type
        ] : undefined
    } : {
        transformedValue,
        annotations: !!transformationResult ? [
            transformationResult.type,
            innerAnnotations
        ] : innerAnnotations
    };
    if (!primitive) {
        seenObjects.set(object, result);
    }
    return result;
}; //# sourceMappingURL=plainer.js.map
}),
"[project]/barber/node_modules/superjson/dist/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SuperJSON",
    ()=>SuperJSON,
    "allowErrorProps",
    ()=>allowErrorProps,
    "default",
    ()=>__TURBOPACK__default__export__,
    "deserialize",
    ()=>deserialize,
    "parse",
    ()=>parse,
    "registerClass",
    ()=>registerClass,
    "registerCustom",
    ()=>registerCustom,
    "registerSymbol",
    ()=>registerSymbol,
    "serialize",
    ()=>serialize,
    "stringify",
    ()=>stringify
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$class$2d$registry$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/superjson/dist/class-registry.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$registry$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/superjson/dist/registry.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$custom$2d$transformer$2d$registry$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/superjson/dist/custom-transformer-registry.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$plainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/superjson/dist/plainer.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$copy$2d$anything$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/copy-anything/dist/index.js [app-client] (ecmascript)");
;
;
;
;
;
class SuperJSON {
    /**
     * @param dedupeReferentialEqualities  If true, SuperJSON will make sure only one instance of referentially equal objects are serialized and the rest are replaced with `null`.
     */ constructor({ dedupe = false } = {}){
        this.classRegistry = new __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$class$2d$registry$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ClassRegistry"]();
        this.symbolRegistry = new __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$registry$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Registry"]((s)=>s.description ?? '');
        this.customTransformerRegistry = new __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$custom$2d$transformer$2d$registry$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CustomTransformerRegistry"]();
        this.allowedErrorProps = [];
        this.dedupe = dedupe;
    }
    serialize(object) {
        const identities = new Map();
        const output = (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$plainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["walker"])(object, identities, this, this.dedupe);
        const res = {
            json: output.transformedValue
        };
        if (output.annotations) {
            res.meta = {
                ...res.meta,
                values: output.annotations
            };
        }
        const equalityAnnotations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$plainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateReferentialEqualityAnnotations"])(identities, this.dedupe);
        if (equalityAnnotations) {
            res.meta = {
                ...res.meta,
                referentialEqualities: equalityAnnotations
            };
        }
        if (res.meta) res.meta.v = 1;
        return res;
    }
    deserialize(payload, options) {
        const { json, meta } = payload;
        let result = options?.inPlace ? json : (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$copy$2d$anything$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["copy"])(json);
        if (meta?.values) {
            result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$plainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyValueAnnotations"])(result, meta.values, meta.v ?? 0, this);
        }
        if (meta?.referentialEqualities) {
            result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$plainer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["applyReferentialEqualityAnnotations"])(result, meta.referentialEqualities, meta.v ?? 0);
        }
        return result;
    }
    stringify(object) {
        return JSON.stringify(this.serialize(object));
    }
    parse(string) {
        return this.deserialize(JSON.parse(string), {
            inPlace: true
        });
    }
    registerClass(v, options) {
        this.classRegistry.register(v, options);
    }
    registerSymbol(v, identifier) {
        this.symbolRegistry.register(v, identifier);
    }
    registerCustom(transformer, name) {
        this.customTransformerRegistry.register({
            name,
            ...transformer
        });
    }
    allowErrorProps(...props) {
        this.allowedErrorProps.push(...props);
    }
}
SuperJSON.defaultInstance = new SuperJSON();
SuperJSON.serialize = SuperJSON.defaultInstance.serialize.bind(SuperJSON.defaultInstance);
SuperJSON.deserialize = SuperJSON.defaultInstance.deserialize.bind(SuperJSON.defaultInstance);
SuperJSON.stringify = SuperJSON.defaultInstance.stringify.bind(SuperJSON.defaultInstance);
SuperJSON.parse = SuperJSON.defaultInstance.parse.bind(SuperJSON.defaultInstance);
SuperJSON.registerClass = SuperJSON.defaultInstance.registerClass.bind(SuperJSON.defaultInstance);
SuperJSON.registerSymbol = SuperJSON.defaultInstance.registerSymbol.bind(SuperJSON.defaultInstance);
SuperJSON.registerCustom = SuperJSON.defaultInstance.registerCustom.bind(SuperJSON.defaultInstance);
SuperJSON.allowErrorProps = SuperJSON.defaultInstance.allowErrorProps.bind(SuperJSON.defaultInstance);
const __TURBOPACK__default__export__ = SuperJSON;
;
const serialize = SuperJSON.serialize;
const deserialize = SuperJSON.deserialize;
const stringify = SuperJSON.stringify;
const parse = SuperJSON.parse;
const registerClass = SuperJSON.registerClass;
const registerCustom = SuperJSON.registerCustom;
const registerSymbol = SuperJSON.registerSymbol;
const allowErrorProps = SuperJSON.allowErrorProps; //# sourceMappingURL=index.js.map
}),
"[project]/barber/node_modules/is-what/dist/getType.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** Returns the object type of the given payload */ __turbopack_context__.s([
    "getType",
    ()=>getType
]);
function getType(payload) {
    return Object.prototype.toString.call(payload).slice(8, -1);
}
}),
"[project]/barber/node_modules/is-what/dist/isArray.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isArray",
    ()=>isArray
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$is$2d$what$2f$dist$2f$getType$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/is-what/dist/getType.js [app-client] (ecmascript)");
;
function isArray(payload) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$is$2d$what$2f$dist$2f$getType$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getType"])(payload) === 'Array';
}
}),
"[project]/barber/node_modules/is-what/dist/isPlainObject.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isPlainObject",
    ()=>isPlainObject
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$is$2d$what$2f$dist$2f$getType$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/is-what/dist/getType.js [app-client] (ecmascript)");
;
function isPlainObject(payload) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$is$2d$what$2f$dist$2f$getType$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getType"])(payload) !== 'Object') return false;
    const prototype = Object.getPrototypeOf(payload);
    return !!prototype && prototype.constructor === Object && prototype === Object.prototype;
}
}),
"[project]/barber/node_modules/copy-anything/dist/index.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "copy",
    ()=>copy
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$is$2d$what$2f$dist$2f$isArray$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/is-what/dist/isArray.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$is$2d$what$2f$dist$2f$isPlainObject$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/is-what/dist/isPlainObject.js [app-client] (ecmascript)");
;
function assignProp(carry, key, newVal, originalObject, includeNonenumerable) {
    const propType = ({}).propertyIsEnumerable.call(originalObject, key) ? 'enumerable' : 'nonenumerable';
    if (propType === 'enumerable') carry[key] = newVal;
    if (includeNonenumerable && propType === 'nonenumerable') {
        Object.defineProperty(carry, key, {
            value: newVal,
            enumerable: false,
            writable: true,
            configurable: true
        });
    }
}
function copy(target, options = {}) {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$is$2d$what$2f$dist$2f$isArray$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isArray"])(target)) {
        return target.map((item)=>copy(item, options));
    }
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$is$2d$what$2f$dist$2f$isPlainObject$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isPlainObject"])(target)) {
        return target;
    }
    const props = Object.getOwnPropertyNames(target);
    const symbols = Object.getOwnPropertySymbols(target);
    return [
        ...props,
        ...symbols
    ].reduce((carry, key)=>{
        // Skip __proto__ properties to prevent prototype pollution
        if (key === '__proto__') return carry;
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$is$2d$what$2f$dist$2f$isArray$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isArray"])(options.props) && !options.props.includes(key)) {
            return carry;
        }
        const val = target[key];
        const newVal = copy(val, options);
        assignProp(carry, key, newVal, target, options.nonenumerable);
        return carry;
    }, {});
}
}),
]);

//# sourceMappingURL=06ac0_3cf54766._.js.map