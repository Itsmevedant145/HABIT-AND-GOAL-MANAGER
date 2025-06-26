const InputField = ({
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  autoComplete,
  className = '',
  ...props
}) => {
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className={`block w-full px-4 py-3 rounded-xl shadow-sm
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
          transition duration-150 ease-in-out sm:text-sm ${className}`}
        style={{
          color: 'var(--text-primary)',
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--card-shadow)',
          placeholderColor: 'var(--text-muted)', // Note: placeholderColor style may not work, see below
        }}
        {...props}
      />
    </div>
  );
};

export default InputField;
