import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RiskBadge from '../components/RiskBadge';
import PatientDetailModal from '../components/PatientDetailModal';

export default function PatientsList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const { isDoctor } = useAuth();

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        search: searchTerm || undefined,
      };
      const res = await axiosClient.get('/patients/', { params });
      if (res.data.results) {
        setPatients(res.data.results);
        setTotalPages(res.data.total_pages || 1);
        setTotalItems(res.data.total_items || res.data.results.length);
      } else {
        setPatients(res.data);
        setTotalPages(1);
        setTotalItems(res.data.length);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load patient records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [page, searchTerm]);

  const handleDeletePatient = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this patient record and all associated clinical logs?')) {
      return;
    }
    try {
      await axiosClient.delete(`/patients/${id}/`);
      toast.success('Patient record deleted.');
      fetchPatients();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to delete patient. Requires Doctor or Admin privileges.');
    }
  };

  const handleExportCSV = () => {
    if (patients.length === 0) return;
    const headers = ['Patient ID', 'Full Name', 'Age', 'Gestational Weeks', 'Blood Group', 'Latest Risk', 'Assessments Count'];
    const rows = patients.map(p => [
      p.patient_id,
      `"${p.full_name}"`,
      p.age,
      p.gestational_weeks,
      p.blood_group,
      p.latest_risk,
      p.assessments_count
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nutrigrad_matricare_patients_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredPatients = patients.filter((p) => {
    if (!riskFilter) return true;
    return (p.latest_risk || '').toLowerCase().includes(riskFilter.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Patient Registry & Clinical Records</h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Comprehensive directory of registered expectant mothers and longitudinal risk logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>

          <Link
            to="/assessment"
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Register & Assess</span>
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder="Search by Patient ID, Name, or Contact..."
            className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2 text-xs sm:text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400 shrink-0" />
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs sm:text-sm font-medium focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">All Risk Tiers</option>
            <option value="High">High Risk Only</option>
            <option value="Mid">Mid Risk Only</option>
            <option value="Low">Low Risk Only</option>
          </select>
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Patient Details</th>
                <th className="px-6 py-4">Age / Gestation</th>
                <th className="px-6 py-4">Blood Group</th>
                <th className="px-6 py-4">Assessments</th>
                <th className="px-6 py-4">Current Status</th>
                <th className="px-6 py-4">Last Evaluated</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent mx-auto mb-2" />
                    Loading registry records...
                  </td>
                </tr>
              ) : filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                    No matching patient profiles found.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => setSelectedPatient(p)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      <div>{p.full_name}</div>
                      <span className="text-[10px] font-normal text-slate-400">{p.patient_id}</span>
                    </td>
                    <td className="px-6 py-4">
                      {p.age} yrs • {p.gestational_weeks} wks
                    </td>
                    <td className="px-6 py-4 font-medium">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-700">
                        {p.blood_group || 'O+'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      {p.assessments_count} logs
                    </td>
                    <td className="px-6 py-4">
                      <RiskBadge risk={p.latest_risk} size="sm" />
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-[11px]">
                      {p.latest_assessment_date ? new Date(p.latest_assessment_date).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedPatient(p)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        {isDoctor && (
                          <button
                            onClick={(e) => handleDeletePatient(p.id, e)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete Patient Record"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-500">
          <span>Showing {filteredPatients.length} of {totalItems} patients</span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </button>
            <span className="font-semibold text-slate-700">Page {page} of {totalPages}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
              className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <PatientDetailModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}
    </div>
  );
}
