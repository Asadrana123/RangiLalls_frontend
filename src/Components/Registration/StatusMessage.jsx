import { AlertCircle, CheckCircle } from 'lucide-react';
const StatusMessage = ({ status, message }) => {
    if (!status) return null;
  
    const styles = status === 'success'
      ? 'bg-green-50 text-green-800 border-green-500'
      : 'bg-red-50 text-red-800 border-red-500';
  
    const Icon = status === 'success' ? CheckCircle : AlertCircle;
  
    return (
      <div className={`mb-4 p-4 rounded-md border ${styles} flex items-start`}>
        <Icon className="h-5 w-5 mr-2 mt-0.5" />
        <span>{message}</span>
      </div>
    );
  };

  export default StatusMessage;