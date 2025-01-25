import { UseFormRegister, FieldErrors, RegisterOptions, Path } from 'react-hook-form';

interface RHFInputProps<T extends Record<string, any>> {
  name: Path<T>;
  label: string;
  type: string;
  placeholder: string;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  validation?: RegisterOptions;
  className?: string;
}

export function RHFInput<T extends Record<string, any>>({
  name,
  label,
  type,
  placeholder,
  register,
  errors,
  validation,
  className = ''
}: RHFInputProps<T>) {
  return (
    <>
      <label className='auth-label' htmlFor={name}>
        {label}
      </label>
      <input
        className={`auth-input ${className}`}
        type={type}
        id={name}
        placeholder={placeholder}
        {...register(name, validation)}
      />
      {errors[name] && (
        <span className='auth-span' role='alert'>
          {errors[name]?.message as string}
        </span>
      )}
    </>
  );
}
