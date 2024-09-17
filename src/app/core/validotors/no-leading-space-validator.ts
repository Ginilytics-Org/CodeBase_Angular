import { AbstractControl, ValidatorFn } from '@angular/forms';

export function noLeadingSpaceValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    if (value && typeof value === 'string' && value.trimLeft() !== value) {
      control.setValue(value.trimLeft()); // Remove leading space
      return { 'leadingSpace': true }; // Return an error
    }
    return null;
  };
}
