export declare const publicProcedure: import("@trpc/server").TRPCProcedureBuilder<{
    session: {
        session: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            expiresAt: Date;
            token: string;
            ipAddress?: string | null | undefined | undefined;
            userAgent?: string | null | undefined | undefined;
        };
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
        };
    } & {
        options: {
            method: "GET";
            query: import("zod").ZodOptional<import("zod").ZodObject<{
                disableCookieCache: import("zod").ZodOptional<import("zod").ZodCoercedBoolean<unknown>>;
                disableRefresh: import("zod").ZodOptional<import("zod").ZodCoercedBoolean<unknown>>;
            }, import("better-auth").$strip>>;
            requireHeaders: true;
            metadata: {
                openapi: {
                    description: string;
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            session: {
                                                $ref: string;
                                            };
                                            user: {
                                                $ref: string;
                                            };
                                        };
                                        required: string[];
                                    };
                                };
                            };
                        };
                    };
                };
            };
        } & {
            use: any[];
        };
        path: "/get-session";
    };
    req: import("hono").HonoRequest<any, unknown>;
    res: Response;
}, object, object, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, false>;
export declare const protectedProcedure: import("@trpc/server").TRPCProcedureBuilder<{
    session: {
        session: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            expiresAt: Date;
            token: string;
            ipAddress?: string | null | undefined | undefined;
            userAgent?: string | null | undefined | undefined;
        };
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
        };
    } & {
        options: {
            method: "GET";
            query: import("zod").ZodOptional<import("zod").ZodObject<{
                disableCookieCache: import("zod").ZodOptional<import("zod").ZodCoercedBoolean<unknown>>;
                disableRefresh: import("zod").ZodOptional<import("zod").ZodCoercedBoolean<unknown>>;
            }, import("better-auth").$strip>>;
            requireHeaders: true;
            metadata: {
                openapi: {
                    description: string;
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            session: {
                                                $ref: string;
                                            };
                                            user: {
                                                $ref: string;
                                            };
                                        };
                                        required: string[];
                                    };
                                };
                            };
                        };
                    };
                };
            };
        } & {
            use: any[];
        };
        path: "/get-session";
    };
    req: import("hono").HonoRequest<any, unknown>;
    res: Response;
}, object, {
    session: {
        session: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            expiresAt: Date;
            token: string;
            ipAddress?: string | null | undefined | undefined;
            userAgent?: string | null | undefined | undefined;
        };
        user: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined | undefined;
        };
    } & {
        options: {
            method: "GET";
            query: import("zod").ZodOptional<import("zod").ZodObject<{
                disableCookieCache: import("zod").ZodOptional<import("zod").ZodCoercedBoolean<unknown>>;
                disableRefresh: import("zod").ZodOptional<import("zod").ZodCoercedBoolean<unknown>>;
            }, import("better-auth").$strip>>;
            requireHeaders: true;
            metadata: {
                openapi: {
                    description: string;
                    responses: {
                        "200": {
                            description: string;
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            session: {
                                                $ref: string;
                                            };
                                            user: {
                                                $ref: string;
                                            };
                                        };
                                        required: string[];
                                    };
                                };
                            };
                        };
                    };
                };
            };
        } & {
            use: any[];
        };
        path: "/get-session";
    };
}, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, import("@trpc/server").TRPCUnsetMarker, false>;
export declare const router: import("@trpc/server").TRPCRouterBuilder<{
    ctx: {
        session: {
            session: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                expiresAt: Date;
                token: string;
                ipAddress?: string | null | undefined | undefined;
                userAgent?: string | null | undefined | undefined;
            };
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined | undefined;
            };
        } & {
            options: {
                method: "GET";
                query: import("zod").ZodOptional<import("zod").ZodObject<{
                    disableCookieCache: import("zod").ZodOptional<import("zod").ZodCoercedBoolean<unknown>>;
                    disableRefresh: import("zod").ZodOptional<import("zod").ZodCoercedBoolean<unknown>>;
                }, import("better-auth").$strip>>;
                requireHeaders: true;
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                session: {
                                                    $ref: string;
                                                };
                                                user: {
                                                    $ref: string;
                                                };
                                            };
                                            required: string[];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            } & {
                use: any[];
            };
            path: "/get-session";
        };
        req: import("hono").HonoRequest<any, unknown>;
        res: Response;
    };
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}>;
