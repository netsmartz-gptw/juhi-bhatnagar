const ValidationFunction = {
  validateAllFormFields(formGroup) {
    // {1}
    Object.keys(formGroup.controls).forEach(field => {
      // {2}
      const control = formGroup.get(field); // {3}
      if (control) {
        // {4}
        control.markAsTouched({ onlySelf: true });
        control.markAsDirty({ onlySelf: true });
      } else if (control) {
        // {5}
        this.validateAllFormFields(control); // {6}
      }
    });
  }
}

export default ValidationFunction

