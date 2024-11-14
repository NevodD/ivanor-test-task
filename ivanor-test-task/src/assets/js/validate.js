export function useValidate() {
  let timer = null
  return {
    validateInput (input) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        if (input.validators && input.validators.length) {
          input.error = input.validators.reduce(
            (errorText, validationFunction) => {
              if (!errorText) {
                let error = '';
                if(validationFunction.name === 'minLength') {
                  error = validationFunction(input.value, input.minlength);
                } else if(validationFunction.name === 'maxLength') {
                  error = validationFunction(input.value, input.maxlength);
                } else {
                  error = validationFunction(input.value);
                }
                if (typeof error === 'string') {
                  errorText = error;
                }
              }
              return errorText;
            },
            ''
          );
        }
        if(input.hasOwnProperty('validate')){
          if (input?.error) {
            input.validate = false
          } else{
            input.validate = true
          }
        }
      }, 500)
    },
		onlyNumbers: (v) => {
      if(v !== '') {
        return /^\d+$/.test(v) || 'Поле может содержать только цифры';
      }
		},
		orderLength: (v) => {
      if(v !== '') {
        return String(v).length === 6 || 'Заказ должен содержать 6 цифр';
      }
		},
	}
}

