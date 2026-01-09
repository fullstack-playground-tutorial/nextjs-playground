import { Schema, ValidateErrors } from "./model";

export class InputValidate {
  static objectValidate: ObjectValidate;
  static object(schema: Schema) {
    InputValidate.objectValidate = useObjectValidate(schema);
    return this.objectValidate;
  }
  static ref<T extends string | number>(name: string): SchemaItem<T> {
    return this.objectValidate.schema[name];
  }
  static validate<T extends Object>(value: T) {
    return this.objectValidate.validate<T>(value);
  }
}

const useObjectValidate = (schema: Schema) => {
  return new ObjectValidate(schema);
};

class ObjectValidate {
  constructor(public schema: Schema) {
    this.validate = this.validate.bind(this);
  }

  validate<T extends Object>(values: T): ValidateErrors {
    const res: ValidateErrors = {};
    for (const [field, value] of Object.entries(values)) {
      const iv = this.schema[field].validate(value);
      if (iv.length > 0) {
        res[field] = iv;
      }
    }
    return res;
  }
}

export const createSchemaItem = (field?: string) => {
  return new SchemaItem(field);
};

export class SchemaItem<T extends string | number> {
  value?: T;
  private _fieldName: string = "field";
  private maxLength?: number;
  private minLength?: number;
  private min?: number;
  private max?: number;
  private required: boolean = false;
  private type?: "phone" | "email";
  private fieldRef?: string;
  private maxLengthError: string =
    this._fieldName + " is not greater than " + this.maxLength;
  private minLengthError: string =
    this._fieldName + " is not less than " + this.minLength;
  private minError: string = this._fieldName + " is not less than " + this.min;
  private maxError: string =
    this._fieldName + " is not greater than " + this.max;
  private requiredError: string = this._fieldName + " is required";
  private matchError: string = this._fieldName + " is not match";
  private phoneError: string = this._fieldName + " is not valid";
  private emailError: string = this._fieldName + " is not valid";
  private phonePattern = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  private emailPattern =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  constructor(field?: string) {
    this.fieldName = field ? field : this.fieldName;
    this.validate = this.validate.bind(this);
  }

  get fieldName(): string {
    return this._fieldName;
  }

  set fieldName(value: string) {
    this._fieldName = value;
    this.updateErrorMessages();
  }

  private updateErrorMessages() {
    this.maxLengthError =
      this._fieldName + " is not greater than " + this.maxLength;
    this.minLengthError =
      this._fieldName + " is not less than " + this.minLength;
    this.minError = this._fieldName + " is not less than " + this.min;
    this.maxError = this._fieldName + " is not greater than " + this.max;
    this.requiredError = this._fieldName + " is required";
    this.matchError = this._fieldName + " is not match";
    this.phoneError = this._fieldName + " is not valid";
    this.emailError = this._fieldName + " is not valid";
  }

  validate<V extends string | number>(value?: V | null): string {
    if (this.required && (value === undefined || value === null)) {
      return this.requiredError;
    }

    if (typeof value !== "string" && typeof value !== "number") {
      return this.fieldName + " value is invalid";
    }

    if (typeof value === "string") {
      this.value = value.trim() as unknown as T;
    } else {
      this.value = value as unknown as T;
    }
    let errorMsg: string = "";

    if (typeof value === "string") {
      const strVal = value.trim();
      if (this.required && strVal.length == 0) {
        errorMsg = this.requiredError;
      } else if (this.minLength && strVal.length < this.minLength) {
        errorMsg = this.minLengthError;
      } else if (this.maxLength && strVal.length > this.maxLength) {
        errorMsg = this.maxLengthError;
      }

      if (this.type) {
        if (this.type == "phone" && !strVal.match(this.phonePattern)) {
          errorMsg = this.phoneError;
        } else if (this.type == "email" && !strVal.match(this.emailPattern)) {
          errorMsg = this.emailError;
        }
      }
    } else if (typeof value === "number") {
      if (this.min !== undefined && value < this.min) {
        errorMsg = this.minError;
      } else if (this.max !== undefined && value > this.max) {
        errorMsg = this.maxError;
      }
    }

    if (this.fieldRef) {
      const fieldMatch = InputValidate.ref(this.fieldRef);
      if (fieldMatch && fieldMatch.value !== this.value) {
        errorMsg = this.matchError;
      }
    }
    return errorMsg;
  }

  isRequired(errorMessage?: string) {
    this.required = true;
    if (errorMessage) {
      this.requiredError = errorMessage;
    }
    return this;
  }
  hasMaxLength(n: number) {
    this.maxLength = n;
    this.maxLengthError =
      this.fieldName + " is not greater than " + this.maxLength;
    return this;
  }
  hasMinLength(n: number) {
    this.minLength = n;
    this.minLengthError =
      this.fieldName + " is not less than " + this.minLength;
    return this;
  }
  hasMin(n: number) {
    this.min = n;
    this.minError = this.fieldName + " is not less than " + this.min;
    return this;
  }
  hasMax(n: number) {
    this.max = n;
    this.maxError = this.fieldName + " is not greater than " + this.max;
    return this;
  }
  phone(errorMessage?: string) {
    this.type = "phone";
    if (errorMessage) {
      this.phoneError = errorMessage;
    }
    return this;
  }
  email(errorMessage?: string) {
    this.type = "email";
    if (errorMessage) {
      this.emailError = errorMessage;
    }
    return this;
  }
  match(fieldRef: string, errorMessage?: string) {
    this.fieldRef = fieldRef;
    if (errorMessage) {
      this.matchError = errorMessage;
    }
    return this;
  }
}
