(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/barber/src/trpc/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TRPCProvider",
    ()=>TRPCProvider,
    "useTRPC",
    ()=>useTRPC,
    "useTRPCClient",
    ()=>useTRPCClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$trpc$2f$tanstack$2d$react$2d$query$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/@trpc/tanstack-react-query/dist/index.mjs [app-client] (ecmascript)");
;
const { TRPCProvider, useTRPC, useTRPCClient } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$trpc$2f$tanstack$2d$react$2d$query$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createTRPCContext"])();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/barber/src/trpc/query-client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "makeQueryClient",
    ()=>makeQueryClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$hydration$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/@tanstack/query-core/build/modern/hydration.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/superjson/dist/index.js [app-client] (ecmascript)");
;
;
function makeQueryClient() {
    return new __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClient"]({
        defaultOptions: {
            queries: {
                staleTime: 30 * 1000
            },
            dehydrate: {
                serializeData: __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].serialize,
                shouldDehydrateQuery: (query)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$hydration$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultShouldDehydrateQuery"])(query) || query.state.status === "pending"
            },
            hydrate: {
                deserializeData: __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].deserialize
            }
        }
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/barber/src/env/client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clientEnv",
    ()=>clientEnv
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/barber/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/barber/node_modules/zod/v4/classic/external.js [app-client] (ecmascript) <export * as z>");
;
const clientEnvSchema = __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    NEXT_PUBLIC_APP_URL: __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().url().default("http://localhost:3000")
});
const parsed = clientEnvSchema.safeParse({
    NEXT_PUBLIC_APP_URL: ("TURBOPACK compile-time value", "http://localhost:3000")
});
if (!parsed.success) {
    console.error("❌ Invalid client environment variables:", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid client environment variables");
}
const clientEnv = parsed.data;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/barber/src/trpc/client.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TRPCReactProvider",
    ()=>TRPCReactProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$trpc$2f$client$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/barber/node_modules/@trpc/client/dist/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$trpc$2f$client$2f$dist$2f$httpBatchLink$2d$fQ1NAi$2d$e$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/@trpc/client/dist/httpBatchLink-fQ1NAi-e.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$src$2f$trpc$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/src/trpc/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/node_modules/superjson/dist/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$src$2f$trpc$2f$query$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/src/trpc/query-client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$src$2f$env$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/barber/src/env/client.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
function getBaseUrl() {
    if ("TURBOPACK compile-time truthy", 1) return "";
    //TURBOPACK unreachable
    ;
}
let browserQueryClient;
function getQueryClient() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    if (!browserQueryClient) browserQueryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$src$2f$trpc$2f$query$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["makeQueryClient"])();
    return browserQueryClient;
}
function TRPCReactProvider({ children }) {
    _s();
    const queryClient = getQueryClient();
    const [trpcClient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "TRPCReactProvider.useState": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$trpc$2f$client$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createTRPCClient"])({
                links: [
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$trpc$2f$client$2f$dist$2f$httpBatchLink$2d$fQ1NAi$2d$e$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["httpBatchLink"])({
                        transformer: __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$superjson$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
                        url: getBaseUrl() + "/api/trpc"
                    })
                ]
            })
    }["TRPCReactProvider.useState"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClientProvider"], {
        client: queryClient,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$barber$2f$src$2f$trpc$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TRPCProvider"], {
            trpcClient: trpcClient,
            queryClient: queryClient,
            children: children
        }, void 0, false, {
            fileName: "[project]/barber/src/trpc/client.tsx",
            lineNumber: 40,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/barber/src/trpc/client.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, this);
}
_s(TRPCReactProvider, "KuErSUDBft9JuU9ba2FC3J02O1Y=");
_c = TRPCReactProvider;
var _c;
__turbopack_context__.k.register(_c, "TRPCReactProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=barber_src_83929d49._.js.map