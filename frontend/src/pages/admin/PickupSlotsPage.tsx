import React, { useState, useEffect } from 'react';
import { CalendarClock, Plus, Edit2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { ordersApi } from '../../api/orders';
import { PickupSlot } from '../../types/order';
import { Modal } from '../../components/ui/Modal';

export const AdminPickupSlotsPage: React.FC = () => {
  const [slots, setSlots] = useState<PickupSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<PickupSlot | null>(null);

  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('11:00');
  const [capacity, setCapacity] = useState('10');
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSlots = async () => {
    try {
      const res = await ordersApi.getPickupSlots({ include_past: true });
      if (res.success && res.data) {
        setSlots(res.data);
      }
    } catch (err) {
      console.error('Failed to load slots:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const openCreateModal = () => {
    setEditingSlot(null);
    const todayStr = new Date().toISOString().split('T')[0];
    setDate(todayStr);
    setStartTime('09:00');
    setEndTime('11:00');
    setCapacity('10');
    setIsActive(true);
    setModalOpen(true);
  };

  const openEditModal = (slot: PickupSlot) => {
    setEditingSlot(slot);
    setDate(slot.date);
    setStartTime(slot.start_time.slice(0, 5));
    setEndTime(slot.end_time.slice(0, 5));
    setCapacity(String(slot.capacity || slot.max_capacity || 10));
    setIsActive(slot.is_active);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (startTime >= endTime) {
      toast.error('End time must be later than start time.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        date,
        start_time: startTime,
        end_time: endTime,
        capacity: Number(capacity),
        is_active: isActive,
      };

      if (editingSlot) {
        await ordersApi.updatePickupSlot(editingSlot.id, payload);
        toast.success('Pickup slot updated successfully!');
      } else {
        await ordersApi.createPickupSlot(payload);
        toast.success('Pickup slot created successfully!');
      }

      setModalOpen(false);
      await fetchSlots();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.response?.data?.end_time?.[0] || 'Failed to save slot.';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarClock className="w-6 h-6 text-teal-600" /> Pickup Slot Management
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Configure store pickup schedules, slot availability, and order capacities
          </p>
        </div>

        <button onClick={openCreateModal} className="btn-primary">
          <Plus className="w-4 h-4" /> Create New Slot
        </button>
      </div>

      {isLoading ? (
        <div className="dmart-card p-8 animate-pulse h-64"></div>
      ) : slots.length === 0 ? (
        <div className="dmart-card p-12 text-center space-y-3">
          <CalendarClock className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-slate-500 text-sm font-medium">No pickup slots found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {slots.map((slot) => {
            const isPast = slot.is_past;
            const booked = slot.booked ?? slot.booked_count ?? 0;
            const cap = slot.capacity ?? slot.max_capacity ?? 10;
            const available = slot.available ?? (cap - booked);

            return (
              <div
                key={slot.id}
                className={`dmart-card p-5 space-y-4 dmart-card-hover ${
                  isPast
                    ? 'bg-slate-50 opacity-85 border-slate-200'
                    : slot.is_active
                    ? 'border-slate-200'
                    : 'bg-red-50/50 border-red-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                    <CalendarClock className={`w-4 h-4 ${isPast ? 'text-amber-600' : 'text-teal-600'}`} />
                    <span>{slot.date}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isPast && <span className="badge-warning">PAST</span>}
                    {slot.is_active ? (
                      <span className="badge-success">ACTIVE</span>
                    ) : (
                      <span className="badge-danger">INACTIVE</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-xs border-t border-b border-slate-100 py-3">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="font-semibold">Pickup Time Window:</span>
                    <span className="font-bold text-slate-900">
                      {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-700">
                    <span className="font-semibold">Bookings / Max Capacity:</span>
                    <span className="font-bold text-slate-900">
                      {booked} / {cap}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-slate-700">
                    <span className="font-semibold">Remaining Slots:</span>
                    <span className={`font-bold text-sm ${available > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {available} Available
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => openEditModal(slot)}
                  className="btn-secondary w-full py-2 text-xs"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit Slot Parameters
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Pickup Slot Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingSlot ? `Edit Pickup Time Slot` : `Create Pickup Time Slot`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Slot Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="dmart-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Start Time</label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="dmart-input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">End Time</label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="dmart-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Max Capacity (Max Orders)</label>
            <input
              type="number"
              min="1"
              required
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="10"
              className="dmart-input"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Slot Status</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsActive(true)}
                className={`py-2 px-4 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  isActive
                    ? 'bg-teal-50 border-teal-500 text-teal-800'
                    : 'bg-slate-100 border-slate-200 text-slate-600'
                }`}
              >
                <CheckCircle className="w-4 h-4" /> Active
              </button>
              <button
                type="button"
                onClick={() => setIsActive(false)}
                className={`py-2 px-4 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  !isActive
                    ? 'bg-red-50 border-red-500 text-red-700'
                    : 'bg-slate-100 border-slate-200 text-slate-600'
                }`}
              >
                <XCircle className="w-4 h-4" /> Inactive
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full py-3 text-sm"
          >
            {isSubmitting
              ? 'Saving Slot...'
              : editingSlot
              ? 'Update Pickup Slot'
              : 'Create Pickup Slot'}
          </button>
        </form>
      </Modal>
    </div>
  );
};
