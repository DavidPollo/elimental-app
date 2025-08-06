import React, { useState, useMemo } from 'react';
import { Psychiatrist, Patient, Appointment } from '../types';
import { Button } from './common/Button';
import { Icon } from './common/Icon';
import { Modal } from './common/Modal';

const ICONS = {
  CHEVRON_LEFT: 'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z',
  CHEVRON_RIGHT: 'M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z',
  CHEVRON_DOWN: 'M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z',
  CHEVRON_UP: 'M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z',
  CALENDAR: 'M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z',
  CLOCK: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z',
  PLUS: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
  USER: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
  CLIPBOARD: 'M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 16H5V5h2v2h10V5h2v14z',
  INSURANCE: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z',
  PENCIL: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
  USER_PLUS: 'M9 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm11-4h-2V7h-2v2h-2v2h2v2h2v-2h2z',
  TRASH: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z',
};

const PSYCHIATRIST_SPECIALTIES = [
  'Psiquiatría General',
  'Psiquiatría Infantil y Adolescente',
  'Psicogeriatría',
  'Adicciones',
  'Trastornos de la Conducta Alimentaria',
];

const formatDate = (date: Date) => date.toISOString().split('T')[0];
const getDayName = (date: Date) => date.toLocaleDateString('es-ES', { weekday: 'long' });
const getDayNumber = (date: Date) => date.getDate();

const MonthCalendar: React.FC<{ selectedDate: Date; onDateSelect: (date: Date) => void; }> = ({ selectedDate, onDateSelect }) => {
    const [viewDate, setViewDate] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));

    const changeMonth = (offset: number) => {
        setViewDate(current => {
            const newDate = new Date(current);
            newDate.setMonth(newDate.getMonth() + offset);
            return newDate;
        });
    };

    const isSameDay = (d1: Date, d2: Date) =>
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
    
    const today = new Date();

    const renderHeader = () => (
        <div className="flex items-center justify-between px-2 py-2">
            <button onClick={() => changeMonth(-1)} className="p-1 rounded-full hover:bg-slate-200 transition-colors" aria-label="Mes anterior">
                <Icon path={ICONS.CHEVRON_LEFT} className="w-6 h-6 text-slate-600" />
            </button>
            <h2 className="font-semibold text-slate-800 capitalize" aria-live="polite">
                {viewDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
            </h2>
            <button onClick={() => changeMonth(1)} className="p-1 rounded-full hover:bg-slate-200 transition-colors" aria-label="Mes siguiente">
                <Icon path={ICONS.CHEVRON_RIGHT} className="w-6 h-6 text-slate-600" />
            </button>
        </div>
    );

    const renderDaysOfWeek = () => (
        <div className="grid grid-cols-7 text-center text-xs text-slate-500 font-medium pb-2">
            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(day => <div key={day}><span className="sr-only">{getDayName(new Date(2024, 0, 1 + ['L', 'M', 'X', 'J', 'V', 'S', 'D'].indexOf(day)))}</span>{day}</div>)}
        </div>
    );

    const renderCalendarGrid = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const firstDayOfMonth = (new Date(year, month, 1).getDay() + 6) % 7; // 0=Monday, 6=Sunday
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const cells = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            cells.push(<div key={`pad-start-${i}`} className="p-1"></div>);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isSelected = isSameDay(date, selectedDate);
            const isToday = isSameDay(date, today);
            const classes = ["w-9 h-9 flex items-center justify-center rounded-full cursor-pointer transition-colors text-sm", isSelected ? "bg-primary-600 text-white font-semibold shadow-md" : "hover:bg-primary-100", isToday && !isSelected ? "ring-1 ring-primary-500 text-primary-600" : ""].filter(Boolean).join(" ");
            cells.push(
                <div key={day} className="flex justify-center items-center p-1">
                    <button onClick={() => onDateSelect(date)} className={classes} aria-pressed={isSelected}>
                        <time dateTime={date.toISOString().split('T')[0]}>{day}</time>
                    </button>
                </div>
            );
        }
        return <div className="grid grid-cols-7 gap-y-1">{cells}</div>;
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            {renderHeader()}
            {renderDaysOfWeek()}
            {renderCalendarGrid()}
        </div>
    );
};

const CalendarView: React.FC<{
  psychiatristId: string;
  appointments: Appointment[];
  patients: Patient[];
  onSelectPatient: (patientId: string) => void;
  onAddAppointment: (psychiatristId: string, date: string) => void;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}> = ({ psychiatristId, appointments, patients, onSelectPatient, onAddAppointment, selectedDate, onDateChange }) => {
  const weekDays = useMemo(() => {
    const startOfWeek = new Date(selectedDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });
  }, [selectedDate]);

  const appointmentsForSelectedDay = appointments.filter(
    (apt) => apt.psychiatristId === psychiatristId && apt.date === formatDate(selectedDate)
  ).sort((a,b) => a.time.localeCompare(b.time));

  return (
    <div className="bg-slate-50 p-4 rounded-b-lg">
      <div className="grid grid-cols-7 gap-1 text-center mb-4 p-2 bg-white rounded-lg shadow-sm">
        {weekDays.map(day => (
          <button key={day.toISOString()} onClick={() => onDateChange(day)} className={`flex flex-col items-center p-2 rounded-lg transition-colors ${formatDate(day) === formatDate(selectedDate) ? 'bg-primary-600 text-white shadow' : 'hover:bg-primary-100'}`}>
            <span className="text-xs sm:text-sm capitalize">{getDayName(day).substring(0,3)}</span>
            <span className="text-lg sm:text-xl font-bold">{getDayNumber(day)}</span>
          </button>
        ))}
      </div>
      <div className="space-y-3 min-h-[10rem]">
        {appointmentsForSelectedDay.length > 0 ? (
          appointmentsForSelectedDay.map(apt => {
            const patient = patients.find(p => p.id === apt.patientId);
            if (!patient) return null;
            return (
              <div key={apt.id} onDoubleClick={() => onSelectPatient(patient.id)} className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md hover:border-primary-500 border-l-4 border-transparent cursor-pointer transition-all duration-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="flex items-center mr-4 text-primary-600">
                            <Icon path={ICONS.CLOCK} className="w-5 h-5 mr-2" />
                            <span className="font-bold text-lg">{apt.time}</span>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800">{patient.name}</p>
                            <div className="flex items-center text-xs text-slate-500 mt-1 flex-wrap">
                                <Icon path={ICONS.CLIPBOARD} className="w-4 h-4 mr-1"/> NHC: {patient.clinicalHistoryNumber}
                                <span className="mx-2 hidden sm:inline">|</span>
                                <Icon path={ICONS.INSURANCE} className="w-4 h-4 mr-1 sm:ml-0 ml-2"/> {patient.insurance}
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex justify-center items-center h-full text-center py-8 text-slate-500 italic">No hay citas para este día.</div>
        )}
      </div>
      <div className="mt-4 flex justify-end">
          <Button variant="secondary" onClick={() => onAddAppointment(psychiatristId, formatDate(selectedDate))}>
            <Icon path={ICONS.PLUS} className="w-5 h-5 mr-2" />
            Añadir Cita
          </Button>
      </div>
    </div>
  );
};

interface PsychiatristAgendaProps {
  psychiatrists: Psychiatrist[];
  patients: Patient[];
  appointments: Appointment[];
  onSelectPatient: (patientId: string) => void;
  onAddPsychiatrist: (name: string, specialty: string) => void;
  onUpdatePsychiatrist: (psychiatrist: Psychiatrist) => void;
  onDeletePsychiatrist: (psychiatristId: string) => void;
  onAddPatient: (patientData: Omit<Patient, 'id' | 'treatmentHistory' | 'consultationHistory'>) => void;
  onAddAppointment: (appointment: Omit<Appointment, 'id'>) => void;
}


export const PsychiatristAgenda: React.FC<PsychiatristAgendaProps> = ({ psychiatrists, patients, appointments, onSelectPatient, onAddPsychiatrist, onUpdatePsychiatrist, onDeletePsychiatrist, onAddPatient, onAddAppointment }) => {
  const [expandedId, setExpandedId] = useState<string | null>(psychiatrists[0]?.id || null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const [isPsyModalOpen, setIsPsyModalOpen] = useState(false);
  const [editingPsychiatrist, setEditingPsychiatrist] = useState<Psychiatrist | null>(null);
  const [psyFormData, setPsyFormData] = useState({ name: '', specialty: PSYCHIATRIST_SPECIALTIES[0] });

  const [isAptModalOpen, setIsAptModalOpen] = useState(false);
  const [newAptData, setNewAptData] = useState<{psychiatristId: string; date: string; patientId: string; time: string} | null>(null);

  const initialPatientState = { clinicalHistoryNumber: '', name: '', dateOfBirth: '', address: '', insurance: '', mentalHealthHistory: '', baselineSituation: '', substanceUse: '' };
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [newPatientData, setNewPatientData] = useState(initialPatientState);
  
  const [psyToDelete, setPsyToDelete] = useState<Psychiatrist | null>(null);

  const handleToggle = (id: string) => setExpandedId(expandedId === id ? null : id);
  
  const openPsyModal = (psy: Psychiatrist | null) => {
    setEditingPsychiatrist(psy);
    setPsyFormData(psy ? { name: psy.name, specialty: psy.specialty } : { name: '', specialty: PSYCHIATRIST_SPECIALTIES[0] });
    setIsPsyModalOpen(true);
  };
  const handlePsyFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setPsyFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSavePsychiatrist = () => {
    if (psyFormData.name.trim()) {
      editingPsychiatrist ? onUpdatePsychiatrist({ ...editingPsychiatrist, ...psyFormData }) : onAddPsychiatrist(psyFormData.name.trim(), psyFormData.specialty);
      setIsPsyModalOpen(false);
    }
  };
  
  const openAptModal = (psychiatristId: string, date: string) => {
      setNewAptData({psychiatristId, date, patientId: '', time: ''});
      setIsAptModalOpen(true);
  };
  const handleAddAppointment = () => {
    if (newAptData && newAptData.patientId && newAptData.time) {
      onAddAppointment(newAptData);
      setNewAptData(null);
      setIsAptModalOpen(false);
    }
  };

  const handlePatientFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setNewPatientData(prev => ({...prev, [e.target.name]: e.target.value}));
  const handleSaveNewPatient = () => {
    if(newPatientData.name && newPatientData.dateOfBirth && newPatientData.clinicalHistoryNumber) {
        onAddPatient(newPatientData);
        setIsPatientModalOpen(false);
        setNewPatientData(initialPatientState);
    } else {
        alert('Por favor, complete al menos el Nombre, Fecha de Nacimiento y Nº de Historia Clínica.');
    }
  };

  const openDeleteConfirm = (psy: Psychiatrist) => {
    setPsyToDelete(psy);
  };
  
  const confirmDeletePsychiatrist = () => {
    if (psyToDelete) {
      onDeletePsychiatrist(psyToDelete.id);
      setPsyToDelete(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <header className="flex flex-wrap justify-between items-center gap-4 mb-6 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">ELIMENTAL</h1>
          <p className="text-md text-slate-500">Agenda de Psiquiatras</p>
        </div>
        <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setIsPatientModalOpen(true)}><Icon path={ICONS.USER_PLUS} className="w-5 h-5 mr-2" />Añadir Paciente</Button>
            <Button onClick={() => openPsyModal(null)}><Icon path={ICONS.PLUS} className="w-5 h-5 mr-2" />Añadir Psiquiatra</Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-2">
          <aside className="lg:col-span-4 xl:col-span-3">
              <MonthCalendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
          </aside>
          <div className="lg:col-span-8 xl:col-span-9 space-y-4">
            {psychiatrists.map((psy) => (
              <div key={psy.id} className="bg-white rounded-lg shadow-md transition-shadow duration-300">
                <div className="flex justify-between items-center p-4 cursor-pointer" onClick={() => handleToggle(psy.id)}>
                  <div className="flex items-center">
                    <Icon path={ICONS.USER} className="w-8 h-8 mr-4 text-primary-500" />
                    <div>
                      <p className="text-xl font-semibold text-slate-700">{psy.name}</p>
                      <p className="text-sm font-normal text-primary-600">{psy.specialty}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" className="p-2 h-9 w-9 !rounded-full" onClick={(e) => { e.stopPropagation(); openPsyModal(psy); }} title="Editar psiquiatra" aria-label={`Editar datos de ${psy.name}`}>
                      <Icon path={ICONS.PENCIL} className="w-4 h-4" />
                    </Button>
                    <Button variant="danger-secondary" className="p-2 h-9 w-9 !rounded-full" onClick={(e) => { e.stopPropagation(); openDeleteConfirm(psy); }} title="Eliminar psiquiatra" aria-label={`Eliminar a ${psy.name}`}>
                      <Icon path={ICONS.TRASH} className="w-4 h-4" />
                    </Button>
                    <Icon path={expandedId === psy.id ? ICONS.CHEVRON_UP : ICONS.CHEVRON_DOWN} className="w-7 h-7 text-slate-400 transition-transform" />
                  </div>
                </div>
                {expandedId === psy.id && <CalendarView 
                    psychiatristId={psy.id} 
                    appointments={appointments} 
                    patients={patients} 
                    onSelectPatient={onSelectPatient} 
                    onAddAppointment={openAptModal}
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                />}
              </div>
            ))}
          </div>
      </div>
      
      <Modal isOpen={isPsyModalOpen} onClose={() => setIsPsyModalOpen(false)} title={editingPsychiatrist ? "Editar Psiquiatra" : "Añadir Psiquiatra"}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre completo</label>
              <input type="text" id="name" name="name" value={psyFormData.name} onChange={handlePsyFormChange} className="mt-1 w-full p-2 border border-slate-300 rounded-md" placeholder="Dr. Nombre Apellido"/>
            </div>
            <div>
              <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">Especialidad</label>
              <select id="specialty" name="specialty" value={psyFormData.specialty} onChange={handlePsyFormChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
                {PSYCHIATRIST_SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end"><Button onClick={handleSavePsychiatrist}>Guardar</Button></div>
      </Modal>

      <Modal isOpen={isPatientModalOpen} onClose={() => setIsPatientModalOpen(false)} title="Añadir Nuevo Paciente">
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label htmlFor="patName" className="block text-sm font-medium text-gray-700">Nombre completo</label><input type="text" id="patName" name="name" value={newPatientData.name} onChange={handlePatientFormChange} className="mt-1 w-full p-2 border border-slate-300 rounded-md"/></div>
                  <div><label htmlFor="patDob" className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label><input type="date" id="patDob" name="dateOfBirth" value={newPatientData.dateOfBirth} onChange={handlePatientFormChange} className="mt-1 w-full p-2 border border-slate-300 rounded-md"/></div>
                  <div><label htmlFor="patNhc" className="block text-sm font-medium text-gray-700">Nº Historia Clínica</label><input type="text" id="patNhc" name="clinicalHistoryNumber" value={newPatientData.clinicalHistoryNumber} onChange={handlePatientFormChange} className="mt-1 w-full p-2 border border-slate-300 rounded-md"/></div>
                  <div><label htmlFor="patInsurance" className="block text-sm font-medium text-gray-700">Seguro</label><input type="text" id="patInsurance" name="insurance" value={newPatientData.insurance} onChange={handlePatientFormChange} className="mt-1 w-full p-2 border border-slate-300 rounded-md"/></div>
              </div>
              <div><label htmlFor="patAddress" className="block text-sm font-medium text-gray-700">Domicilio</label><input type="text" id="patAddress" name="address" value={newPatientData.address} onChange={handlePatientFormChange} className="mt-1 w-full p-2 border border-slate-300 rounded-md"/></div>
              <div><label htmlFor="patMHH" className="block text-sm font-medium text-gray-700">Antecedentes Salud Mental</label><textarea id="patMHH" name="mentalHealthHistory" value={newPatientData.mentalHealthHistory} onChange={handlePatientFormChange} rows={3} className="mt-1 w-full p-2 border border-slate-300 rounded-md"/></div>
              <div><label htmlFor="patBS" className="block text-sm font-medium text-gray-700">Situación Basal</label><textarea id="patBS" name="baselineSituation" value={newPatientData.baselineSituation} onChange={handlePatientFormChange} rows={3} className="mt-1 w-full p-2 border border-slate-300 rounded-md"/></div>
              <div><label htmlFor="patSU" className="block text-sm font-medium text-gray-700">Tóxicos</label><textarea id="patSU" name="substanceUse" value={newPatientData.substanceUse} onChange={handlePatientFormChange} rows={3} className="mt-1 w-full p-2 border border-slate-300 rounded-md"/></div>
          </div>
          <div className="mt-6 flex justify-end"><Button onClick={handleSaveNewPatient}>Guardar Paciente</Button></div>
      </Modal>

      <Modal isOpen={isAptModalOpen} onClose={() => setIsAptModalOpen(false)} title="Añadir Nueva Cita">
          {newAptData && (
              <div className="space-y-4">
                 <div>
                    <label htmlFor="aptPatient" className="block text-sm font-medium text-gray-700">Paciente</label>
                    <select id="aptPatient" value={newAptData.patientId} onChange={(e) => setNewAptData({...newAptData, patientId: e.target.value})} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
                        <option value="" disabled>Seleccione un paciente</option>
                        {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                 </div>
                 <div>
                    <label htmlFor="aptTime" className="block text-sm font-medium text-gray-700">Hora (HH:mm)</label>
                    <input type="time" id="aptTime" value={newAptData.time} onChange={(e) => setNewAptData({...newAptData, time: e.target.value})} className="mt-1 w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"/>
                 </div>
                 <div className="mt-6 flex justify-end">
                    <Button onClick={handleAddAppointment}>Guardar Cita</Button>
                 </div>
              </div>
          )}
      </Modal>

       <Modal isOpen={!!psyToDelete} onClose={() => setPsyToDelete(null)} title="Confirmar Eliminación">
        {psyToDelete && (
          <div>
            <p className="text-slate-700">
              ¿Está seguro de que desea eliminar a <strong>{psyToDelete.name}</strong>?
            </p>
            <p className="mt-2 text-sm text-red-600">
              Esta acción es irreversible y también eliminará todas las citas asociadas a este psiquiatra.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setPsyToDelete(null)}>Cancelar</Button>
              <Button variant="danger" onClick={confirmDeletePsychiatrist}>Confirmar Eliminación</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};