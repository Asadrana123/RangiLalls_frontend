const DocumentViewer = ({ url, title, onClose }) => {
    if (!url) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60] p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-4 flex justify-between items-center border-b">
            <h3 className="text-lg font-medium">{title}</h3>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>
          <div className="p-4 flex justify-center">
            <img 
              src={url} 
              alt={title} 
              className="max-w-full max-h-[70vh] object-contain"
            />
          </div>
        </div>
      </div>
    );
  };

  export default DocumentViewer