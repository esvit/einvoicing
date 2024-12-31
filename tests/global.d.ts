declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchXML(expected: string): R;
    }
  }
}

export {};
