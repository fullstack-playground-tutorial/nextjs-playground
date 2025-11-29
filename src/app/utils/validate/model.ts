import { SchemaItem } from "./validate";

export interface Schema {
  [key: string]: SchemaItem<any>;
}

export interface ValidateErrors {
  [key: string]: string;
}
