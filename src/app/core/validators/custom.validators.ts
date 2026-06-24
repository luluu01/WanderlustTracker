import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl<string | null>): ValidationErrors | null => {
    const value = control.value ?? '';
    const valid = value.length >= 6 && /\d/.test(value) && /[A-Za-z]/.test(value);
    return valid ? null : { passwordStrength: true };
  };
}

export function dateRangeValidator(startKey: string, endKey: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const start = control.get(startKey)?.value as string | null;
    const end = control.get(endKey)?.value as string | null;

    if (!start || !end) {
      return null;
    }

    return new Date(start) <= new Date(end) ? null : { dateRange: true };
  };
}
