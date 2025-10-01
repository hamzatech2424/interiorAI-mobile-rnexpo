import type { Context as HonoContext } from 'hono';
export declare function createContext(c: HonoContext): Promise<{
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
}>;
export type Context = Awaited<ReturnType<typeof createContext>>;
