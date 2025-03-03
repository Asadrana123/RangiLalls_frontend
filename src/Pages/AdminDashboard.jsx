import React, { useState } from 'react';
import { Upload, AlertCircle, FileSpreadsheet, Check } from 'lucide-react';
import api from '../Utils/axios';

const AdminDashboard = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadedItems, setUploadedItems] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          selectedFile.type === 'application/vnd.ms-excel') {
        setFile(selectedFile);
        setError('');
      } else {
        setFile(null);
        setError('Please upload an Excel file (.xlsx or .xls)');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('propertiesFile', file);

    try {
      const response = await api.post('/admin/upload-properties', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setSuccess(`Successfully uploaded ${response.data.count} properties`);
        setUploadedItems(response.data.count);
        setFile(null);
      } else {
        setError(response.data.error || 'Upload failed');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Error uploading file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-primary" />
            Bulk Property Upload
          </h2>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              id="property-file"
              className="hidden"
              onChange={handleFileChange}
              accept=".xlsx,.xls"
            />
            
            <label htmlFor="property-file" className="cursor-pointer block mb-4">
              <div className="flex flex-col items-center">
                <Upload className="w-12 h-12 text-gray-400 mb-2" />
                <p className="text-gray-600 mb-2">Drag and drop or click to upload an Excel file</p>
                <p className="text-sm text-gray-500">(.xlsx or .xls format)</p>
              </div>
            </label>
            
            {file && (
              <div className="mt-4 text-left bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
                <button 
                  onClick={() => setFile(null)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            )}
            
            {error && (
              <div className="mt-4 text-red-500 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <p>{error}</p>
              </div>
            )}
            
            {success && (
              <div className="mt-4 text-green-500 flex items-center gap-2">
                <Check className="w-5 h-5" />
                <p>{success}</p>
              </div>
            )}
            
            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className={`mt-6 px-6 py-3 rounded-lg flex items-center gap-2 mx-auto ${
                !file || loading
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary-dark transition-colors"
              }`}
            >
              {loading ? 'Uploading...' : 'Upload Properties'}
            </button>
          </div>
        </div>
        
        {uploadedItems > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Upload Summary</h2>
            <p>Successfully uploaded {uploadedItems} properties.</p>
            <p className="text-sm text-gray-500 mt-2">
              Properties are now available in the system and will be visible on the website.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;