const Input = ({ 
    label, 
    type = "text", 
    value, 
    onChange, 
    required, 
    placeholder, 
    maxLength, 
    note,
    error,
    onBlur 
  }) => (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-medium mb-1">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full p-2 border rounded-md transition-colors
          ${error 
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500'
          }`}
      />
      {note && <p className="text-xs text-gray-500 mt-1">{note}</p>}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
export default Input;  