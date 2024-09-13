// cookie.d.ts

declare module 'cookie' {
    export function serialize(
      name: string,
      value: string,
      options?: {
        domain?: string;
        encode?: (value: string) => string;
        expires?: Date;
        httpOnly?: boolean;
        maxAge?: number;
        path?: string;
        sameSite?: true | false | 'lax' | 'strict' | 'none';
        secure?: boolean;
      }
    ): string;
  
    export function parse(
      cookieString: string,
      options?: {
        decode?: (value: string) => string;
      }
    ): Record<string, string>;
  }
  