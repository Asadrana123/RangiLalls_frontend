const Select = ({ 
    label, 
    value, 
    onChange, 
    options, 
    required, 
    placeholder,
    error,
    onBlur 
  }) => (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-medium mb-1">
        {label} {required && <span className="text-orange-500">*</span>}
      </label>
      <select
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full p-2 border rounded-md transition-colors
          ${error 
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500'
          }`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );

  export default Select;