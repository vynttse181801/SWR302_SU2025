declare namespace CodeceptJS {
  interface I {
    sendPostRequest(url: string, data: any): Promise<any>;
    seeResponseCodeIs(code: number): void;
    seeResponseContainsJson(json: any): void;
  }
} 