declare module '*.tmp' {
  const contents: {default: string}
  export = contents
}

interface JsonRes {
    method: string, collection: string, params: Param[];
}

interface Param {
  name: string;
  if: string;
  value: any;
  to: string;
}