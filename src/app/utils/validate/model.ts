import { SchemaItem } from "./validate"

export interface Schema {
    [key: string]: SchemaItem
}

export interface ValidateErrors {
    [key: string]: string
}
