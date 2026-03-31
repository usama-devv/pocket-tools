import { Bug, Clock, CheckCircle2, AlertCircle, Timer } from 'lucide-react';

const BugReportCard = ({ report }) => {
  
  const statusConfig = {
    pending: {
      color: 'text-amber-600 bg-amber-50 border-amber-100',
      icon: <Timer size={14} />,
      label: 'Pending'
    },
    'in-progress': {
      color: 'text-blue-600 bg-blue-50 border-blue-100',
      icon: <AlertCircle size={14} />,
      label: 'In Progress'
    },
    resolved: {
      color: 'text-green-600 bg-green-50 border-green-100',
      icon: <CheckCircle2 size={14} />,
      label: 'Resolved'
    }
  };

  const currentStatus = statusConfig[report.status] || statusConfig.pending;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
            <Bug size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 leading-tight">{report.toolName}</h3>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <Clock size={12} />
              <span>{report.createdAt?.toDate ? report.createdAt.toDate().toLocaleDateString() : 'Just now'}</span>
            </div>
          </div>
        </div>
        
        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${currentStatus.color}`}>
          {currentStatus.icon}
          {currentStatus.label}
        </span>
      </div>

      <div className="bg-slate-50 rounded-lg p-3">
        <p className="text-sm text-slate-600 leading-relaxed italic">
          "{report.description}"
        </p>
      </div>
    </div>
  );
};

export default BugReportCard;