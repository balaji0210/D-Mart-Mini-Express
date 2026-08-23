import React, { useState, useEffect, useMemo } from 'react';
import { FileText, Search, Download, Eye, Filter, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminApi } from '../../api/admin';
import { AuditLog } from '../../types/order';
import { Modal } from '../../components/ui/Modal';

const getUserName = (user: any) => {
  if (!user) return 'System Engine';
  if (typeof user === 'string') return user;
  return user.full_name || user.email || 'Admin User';
};

const getUserEmail = (user: any) => {
  if (!user) return 'system@internal';
  if (typeof user === 'string') return user;
  return user.email || 'admin@dmart.com';
};

const getUserRole = (user: any) => {
  if (!user || typeof user === 'string') return 'SYSTEM';
  return user.role || 'ADMIN';
};

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
    const types = new Set(logs.map((l) => l.action).filter(Boolean));
    return ['ALL', ...Array.from(types)];
  }, [logs]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
      const userStr = `${getUserName(log.user)} ${getUserEmail(log.user)}`;
      const summaryText = log.summary || log.details || '';
      const metaText = JSON.stringify(log.metadata || {});

      const matchesSearch =
        !searchTerm ||
        userStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.action || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.entity_type || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        summaryText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        metaText.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesAction && matchesSearch;
    });
  }, [logs, searchTerm, actionFilter]);

  const handleExportCSV = () => {
    if (filteredLogs.length === 0) return;
    const headers = ['Timestamp', 'User Name', 'User Email', 'User Role', 'Action', 'Entity Type', 'Entity ID', 'Activity Summary'];
    const rows = filteredLogs.map((log) => [
      `"${log.created_at ? new Date(log.created_at).toLocaleString() : new Date().toLocaleString()}"`,
      `"${getUserName(log.user)}"`,
      `"${getUserEmail(log.user)}"`,
      `"${getUserRole(log.user)}"`,
      `"${log.action || ''}"`,
      `"${log.entity_type || ''}"`,
      `"${log.entity_id || ''}"`,
      `"${(log.summary || log.details || '').replace(/"/g, '""')}"`,
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
    const act = (action || '').toUpperCase();
    if (act.includes('CREATED') || act.includes('APPROVED') || act.includes('REGISTERED')) {
      return <span className="badge-success">{action}</span>;
    }
    if (act.includes('REJECTED') || act.includes('CANCELLED') || act.includes('DELETED')) {
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
          className="btn-secondary disabled:opacity-50"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Filter Bar */}
      <div className="dmart-card p-4 flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div className="relative w-full sm:w-80 flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search audit logs..."
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
                      {log.created_at || log.timestamp ? new Date(log.created_at || log.timestamp || Date.now()).toLocaleString() : 'N/A'}
                    </td>

                    <td className="p-4 text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs">
                          {getUserName(log.user).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{getUserName(log.user)}</p>
                          <p className="text-xs text-slate-500">{getUserEmail(log.user)}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 whitespace-nowrap">{renderActionBadge(log.action || 'ACTION')}</td>

                    <td className="p-4 text-xs font-medium text-slate-800">
                      {log.summary || log.details || `${log.action} on ${log.entity_type}`}
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="p-1.5 text-slate-500 hover:text-teal-600 hover:bg-slate-100 rounded-lg transition"
                        title="View Full Metadata"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Metadata Detail Modal */}
      {selectedLog && (
        <Modal isOpen={!!selectedLog} onClose={() => setSelectedLog(null)} title="Audit Event Metadata">
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <p>
                <span className="font-bold text-slate-700">Action:</span> {selectedLog.action}
              </p>
              <p>
                <span className="font-bold text-slate-700">Entity:</span> {selectedLog.entity_type} (#{selectedLog.entity_id || 'N/A'})
              </p>
              <p>
                <span className="font-bold text-slate-700">Actor:</span> {getUserName(selectedLog.user)} ({getUserEmail(selectedLog.user)})
              </p>
              <p>
                <span className="font-bold text-slate-700">Timestamp:</span>{' '}
                {selectedLog.created_at || selectedLog.timestamp ? new Date(selectedLog.created_at || selectedLog.timestamp || Date.now()).toLocaleString() : 'N/A'}
              </p>
            </div>

            <div className="space-y-1">
              <p className="font-bold text-slate-700">Activity Summary:</p>
              <p className="p-3 bg-white border border-slate-200 rounded-xl font-mono text-slate-800">
                {selectedLog.summary || selectedLog.details || 'System event log.'}
              </p>
            </div>

            {selectedLog.metadata && (
              <div className="space-y-1">
                <p className="font-bold text-slate-700">Payload Metadata (JSON):</p>
                <pre className="p-3 bg-slate-900 text-teal-400 rounded-xl overflow-x-auto font-mono text-[11px]">
                  {JSON.stringify(selectedLog.metadata, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
