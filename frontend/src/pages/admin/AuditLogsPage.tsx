import React, { useState, useEffect, useMemo } from 'react';
import { FileText, Search, Download, Eye, Filter, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminApi } from '../../api/admin';
import { AuditLog } from '../../types/order';
import { Modal } from '../../components/ui/Modal';

export const AdminAuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('ALL');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  useEffect(() => {
    adminApi
      .getAuditLogs()
      .then((res) => {
        if (res.data) {
          const raw = res.data.logs || res.data || res.results || [];
          setLogs(Array.isArray(raw) ? raw : []);
        }
      })
      .catch((err) => console.error('Failed to load audit logs:', err))
      .finally(() => setIsLoading(false));
  }, []);

  const actionTypes = useMemo(() => {
    const types = new Set(logs.map((l) => l.action));
    return ['ALL', ...Array.from(types)];
  }, [logs]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
      const userStr = log.user ? `${log.user.full_name} ${log.user.email}` : 'System';
      const summaryText = log.summary || '';
      const metaText = JSON.stringify(log.metadata || {});

      const matchesSearch =
        !searchTerm ||
        userStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.entity_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        summaryText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        metaText.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesAction && matchesSearch;
    });
  }, [logs, searchTerm, actionFilter]);

  const handleExportCSV = () => {
    if (filteredLogs.length === 0) return;
    const headers = ['Timestamp', 'User Email', 'User Role', 'Action', 'Entity Type', 'Entity ID', 'Activity Summary'];
    const rows = filteredLogs.map((log) => [
      `"${new Date(log.created_at).toLocaleString()}"`,
      `"${log.user ? log.user.email : 'System Engine'}"`,
      `"${log.user ? log.user.role : 'SYSTEM'}"`,
      `"${log.action}"`,
      `"${log.entity_type}"`,
      `"${log.entity_id || ''}"`,
      `"${(log.summary || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Audit_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Audit report exported to CSV');
  };

  const renderActionBadge = (action: string) => {
    if (action.includes('CREATED') || action.includes('APPROVED')) {
      return <span className="badge-success">{action}</span>;
    }
    if (action.includes('REJECTED') || action.includes('CANCELLED')) {
      return <span className="badge-danger">{action}</span>;
    }
    return <span className="badge-info">{action}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-teal-600" /> Audit Log & Security Tracking
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Immutable tracking records for administrative and transactional system actions
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={filteredLogs.length === 0}
          className="btn-secondary"
        >
          <Download className="w-4 h-4" /> Export CSV Report
        </button>
      </div>

      {/* Filters & Search */}
      <div className="dmart-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search log by action, user, entity..."
            className="dmart-input pl-10"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="dmart-select w-full sm:w-auto"
          >
            {actionTypes.map((t) => (
              <option key={t} value={t}>
                {t === 'ALL' ? 'All System Actions' : t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="dmart-card p-8 animate-pulse h-80"></div>
      ) : filteredLogs.length === 0 ? (
        <div className="dmart-card p-12 text-center space-y-3">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-slate-500 text-sm font-medium">No audit logs matching search criteria.</p>
        </div>
      ) : (
        <div className="dmart-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">User / Actor</th>
                  <th className="p-4">Action Type</th>
                  <th className="p-4">Activity Summary</th>
                  <th className="p-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 text-xs font-mono text-slate-600 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </td>

                    <td className="p-4 text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs">
                          {log.user ? log.user.full_name.charAt(0) : 'S'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{log.user ? log.user.full_name : 'System Engine'}</p>
                          <p className="text-xs text-slate-500">{log.user ? log.user.email : 'system@internal'}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 whitespace-nowrap">{renderActionBadge(log.action)}</td>

                    <td className="p-4 text-xs font-medium text-slate-800">
                      {log.summary || `${log.action} on ${log.entity_type}`}
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="btn-secondary py-1 px-3 text-xs"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Log
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detailed Audit Event Report Modal */}
      <Modal
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        title={`Audit Log Report — #${selectedLog?.id.slice(0, 8)}`}
      >
        {selectedLog && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-slate-500">
                  {new Date(selectedLog.created_at).toLocaleString()}
                </span>
                {renderActionBadge(selectedLog.action)}
              </div>

              <div>
                <span className="font-bold uppercase text-[10px] text-slate-500 block mb-0.5">
                  Action Summary
                </span>
                <p className="text-sm font-bold text-slate-900">
                  {selectedLog.summary || `${selectedLog.action} executed on ${selectedLog.entity_type}`}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-semibold block mb-0.5">Target Entity</span>
                <span className="font-bold text-slate-900">{selectedLog.entity_type}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-semibold block mb-0.5">Performed By</span>
                <span className="font-bold text-slate-900">
                  {selectedLog.user ? `${selectedLog.user.full_name} (${selectedLog.user.role})` : 'System Engine'}
                </span>
              </div>
            </div>

            {/* Metadata KV */}
            {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 && (
              <div>
                <h4 className="font-bold text-slate-700 uppercase text-[10px] mb-1.5">Action Parameters</h4>
                <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
                  {Object.entries(selectedLog.metadata).map(([key, val]) => (
                    <div key={key} className="p-2.5 flex items-center justify-between bg-white text-xs">
                      <span className="font-medium text-slate-600 capitalize">{key.replace(/_/g, ' ')}</span>
                      <span className="font-mono font-bold text-slate-900">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
