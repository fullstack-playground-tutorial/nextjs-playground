import { Schema, ValidateErrors } from "./model"


export class InputValidate {
    static objectValidate: ObjectValidate
    static object(schema: Schema) {
        InputValidate.objectValidate = useObjectValidate(schema)
        return this.objectValidate
    }
    static ref(name: string): SchemaItem {
        return this.objectValidate.schema[name]
    }
    static validate<T extends Object>(value: T) {
        return this.objectValidate.validate<T>(value)
    }

}

const useObjectValidate = (schema: Schema) => {
    return new ObjectValidate(schema)
}

class ObjectValidate {
    constructor(public schema: Schema) {
        this.validate = this.validate.bind(this)
    }

    validate<T extends Object>(values: T): ValidateErrors {

        const res: ValidateErrors = {}
        for (const [field, value] of Object.entries(values)) {
            const iv = this.schema[field].validate(value)
            if (iv.length > 0) {
                res[field] = iv
            }
        }
        return res

    }

}

export const createSchemaItem = (field?: string) => {
    return new SchemaItem(field)
}

export class SchemaItem {
    value?: string;
    private _fieldName: string = "field";
    private maxLength?: number;
    private minLength?: number;
    private required: boolean = false;
    private type?: "phone" | "email"
    private fieldRef?: string;
    private maxLengthError: string = this._fieldName + " is not greater than " + this.maxLength
    private minLengthError: string = this._fieldName + " is not less than " + this.minLength
    private requiredError: string = this._fieldName + " is required"
    private matchError: string = this._fieldName + " is not match"
    private phoneError: string = this._fieldName + " is not valid"
    private emailError: string = this._fieldName + " is not valid"
    private phonePattern = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/
    private emailPattern =
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    constructor(field?: string) {
        this.fieldName = field ? field : this.fieldName        
        this.validate = this.validate.bind(this)
    }

    get fieldName(): string{
        return this._fieldName
    }

    set fieldName(value: string){
        this._fieldName = value
        this.updateErrorMessages()
    }

    private updateErrorMessages() {
        this.maxLengthError = this._fieldName + " is not greater than " + this.maxLength;
        this.minLengthError = this._fieldName + " is not less than " + this.minLength;
        this.requiredError = this._fieldName + " is required";
        this.matchError = this._fieldName + " is not match";
        this.phoneError = this._fieldName + " is not valid";
        this.emailError = this._fieldName + " is not valid";
    }
    
    validate(value?: string | null): string {
        if (value === undefined || value === null) {
            return this.fieldName + 'is undefined'
        }
        this.value = value.trim()
        let errorMsg: string = ""
        
        if (this.required && value.length == 0) {
            errorMsg = this.requiredError
        } else if (this.minLength && value.length < this.minLength) {
            errorMsg = this.minLengthError
        } else if (this.maxLength && value.length > this.maxLength) {

            errorMsg = this.maxLengthError
        } else if (this.type) {

            if (this.type == 'phone' && !value.match(this.phonePattern)) {
                errorMsg = this.phoneError
            } else if (this.type == "email" && !value.match(this.emailPattern)) {
                errorMsg = this.emailError
            }
        } else if (this.fieldRef) {
            const fieldMatch = InputValidate.ref(this.fieldRef)
            if (fieldMatch && fieldMatch.value !== value) {
                errorMsg = this.matchError

            }
        }

        return errorMsg
    }


    isRequired(errorMessage?: string) {
        this.required = true
        if (errorMessage) {
            this.requiredError = errorMessage
        }
        return this
    }
    hasMaxLength(n: number) {
        this.maxLength = n
        this.maxLengthError = this.fieldName + " is not greater than " + this.maxLength
        return this
    }
    hasMinLength(n: number) {
        this.minLength = n
        this.minLengthError = this.fieldName + " is not less than " + this.minLength
        return this
    }
    phone(errorMessage?: string) {
        this.type = 'phone'
        if (errorMessage) {
            this.phoneError = errorMessage
        }
        return this
    }
    email(errorMessage?: string) {
        this.type = 'email'
        if (errorMessage) {
            this.emailError = errorMessage
        }
        return this
    }
    match(fieldRef: string, errorMessage?: string) {
        this.fieldRef = fieldRef
        if (errorMessage) {
            this.matchError = errorMessage
        }
        return this
    }
}

