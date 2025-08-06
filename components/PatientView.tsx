import React, { useState } from 'react';
import { Patient, EvolutionNote } from '../types';
import { Button } from './common/Button';
import { Icon } from './common/Icon';
import { Modal } from './common/Modal';

const ICONS = {
    USER: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
    HOME: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
    BRIEFCASE: 'M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4zm10 15H4V8h16v11z',
    HEART: 'M12 21.35l-1.41-1.41C5.41 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.41 6.86-8.59 11.44L12 21.35z',
    PILL: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-5 13H5v-2h2v2zm0-4H5V9h2v2zm0-4H5V5h2v2zm4 8H9v-2h2v2zm0-4H9V9h2v2zm0-4H9V5h2v2zm4 8h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm2 4h-2V9h2v2z',
    BOOK: 'M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z',
    PENCIL: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
    TRASH: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z',
};

const InfoCard: React.FC<{ icon: string; title: string; children: React.ReactNode; className?: string }> = ({ icon, title, children, className = '' }) => (
    <div className={`bg-slate-100 p-4 rounded-lg ${className}`}>
        <div className="flex items-center mb-2">
            <Icon path={icon} className="w-5 h-5 text-primary-600 mr-2" />
            <h3 className="text-md font-semibold text-slate-700">{title}</h3>
        </div>
        <div className="text-sm text-slate-600">{children}</div>
    </div>
);

interface EvolutionSectionProps {
  title: string;
  history: EvolutionNote[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

const EvolutionSection: React.FC<EvolutionSectionProps> = ({ title, history, onEdit, onDelete }) => (
    <details className="bg-slate-100 rounded-lg">
        <summary className="p-3 font-medium cursor-pointer text-sm text-primary-700 hover:bg-primary-50 rounded-lg">
            {title}
        </summary>
        <div className="p-3 border-t border-slate-200">
            {history.length > 0 ? (
                <ul className="space-y-4">
                    {[...history].reverse().map((entry, i) => {
                        const originalIndex = history.length - 1 - i;
                        return (
                        <li key={originalIndex} className="text-sm text-slate-600 group relative">
                            <div className="flex justify-between items-start">
                                <div className="pr-12">
                                    <p className="font-semibold">{new Date(entry.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    <p className="pl-2 border-l-2 border-slate-300 ml-1 mt-1 break-words">{entry.note}</p>
                                </div>
                                <div className="absolute top-0 right-0 flex items-center space-x-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity bg-slate-100 p-1 rounded-bl-md">
                                    <button onClick={() => onEdit(originalIndex)} className="p-1 rounded-full hover:bg-slate-300" aria-label="Editar nota">
                                        <Icon path={ICONS.PENCIL} className="w-4 h-4 text-slate-700" />
                                    </button>
                                    <button onClick={() => onDelete(originalIndex)} className="p-1 rounded-full hover:bg-slate-300" aria-label="Eliminar nota">
                                        <Icon path={ICONS.TRASH} className="w-4 h-4 text-red-600" />
                                    </button>
                                </div>
                            </div>
                        </li>
                    )})}
                </ul>
            ) : (
                <p className="text-sm text-slate-500 italic">No hay entradas previas.</p>
            )}
        </div>
    </details>
);

const calculateAge = (dob: string): number => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

interface PatientViewProps {
  patient: Patient;
  onUpdatePatient: (updatedPatient: Patient) => void;
  onBack: () => void;
}

export const PatientView: React.FC<PatientViewProps> = ({ patient, onUpdatePatient, onBack }) => {
  const [currentHistoryNote, setCurrentHistoryNote] = useState('');
  const [currentTreatmentNote, setCurrentTreatmentNote] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editablePatientData, setEditablePatientData] = useState<Patient>(patient);
  
  const [noteToEdit, setNoteToEdit] = useState<{ type: 'treatment' | 'consultation', index: number, note: string } | null>(null);
  const [confirmation, setConfirmation] = useState<{ message: string, onConfirm: () => void } | null>(null);

  const handleSaveConsultation = () => {
    const updatedPatient = { ...patient };
    const today = new Date().toISOString().split('T')[0];

    if (currentHistoryNote.trim()) {
      updatedPatient.consultationHistory = [...patient.consultationHistory, { date: today, note: currentHistoryNote.trim() }];
    }
    if (currentTreatmentNote.trim()) {
      updatedPatient.treatmentHistory = [...patient.treatmentHistory, { date: today, note: currentTreatmentNote.trim() }];
    }

    onUpdatePatient(updatedPatient);
    onBack();
  };

  const openEditModal = () => {
    setEditablePatientData(patient);
    setIsEditModalOpen(true);
  };
  
  const handleSavePatientDetails = () => {
      onUpdatePatient(editablePatientData);
      setIsEditModalOpen(false);
  }
  
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditablePatientData(prev => ({...prev, [name]: value}));
  };

  const handleEditHistoryNote = (type: 'treatment' | 'consultation', index: number) => {
    const historyKey = type === 'treatment' ? 'treatmentHistory' : 'consultationHistory';
    setNoteToEdit({
      type,
      index,
      note: patient[historyKey][index].note,
    });
  };
  
  const handleSaveEditedNote = () => {
    if (!noteToEdit) return;
    const { type, index, note } = noteToEdit;

    const onConfirm = () => {
      const historyKey = type === 'treatment' ? 'treatmentHistory' : 'consultationHistory';
      const updatedHistory = [...patient[historyKey]];
      updatedHistory[index] = { ...updatedHistory[index], note: note };
      
      const updatedPatient = { ...patient, [historyKey]: updatedHistory };
      onUpdatePatient(updatedPatient);
      setConfirmation(null);
    };

    setNoteToEdit(null);
    setConfirmation({
      message: '¿Está seguro de que desea guardar los cambios en esta nota?',
      onConfirm,
    });
  };

  const handleDeleteHistoryNote = (type: 'treatment' | 'consultation', index: number) => {
    const onConfirm = () => {
      const historyKey = type === 'treatment' ? 'treatmentHistory' : 'consultationHistory';
      const updatedHistory = patient[historyKey].filter((_, i) => i !== index);

      const updatedPatient = { ...patient, [historyKey]: updatedHistory };
      onUpdatePatient(updatedPatient);
      setConfirmation(null);
    };

    setConfirmation({
      message: '¿Está seguro de que desea eliminar esta entrada de la historia?',
      onConfirm,
    });
  };

  const lastTreatment = [...patient.treatmentHistory].pop();
  const lastConsultation = [...patient.consultationHistory].pop();

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-slate-800">{patient.name}</h1>
            <Button variant="secondary" onClick={openEditModal} className="p-2 h-10 w-10 !rounded-full">
                <Icon path={ICONS.PENCIL} className="w-5 h-5"/>
            </Button>
        </div>
        <Button onClick={onBack} variant="secondary">Volver a la Agenda</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* === COLUMNA IZQUIERDA === */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoCard icon={ICONS.USER} title="Edad">{calculateAge(patient.dateOfBirth)} años</InfoCard>
            <InfoCard icon={ICONS.HOME} title="Domicilio">{patient.address}</InfoCard>
            <InfoCard icon={ICONS.BRIEFCASE} title="Seguro" className="sm:col-span-2">{patient.insurance}</InfoCard>
            <InfoCard icon={ICONS.HEART} title="Antecedentes Salud Mental" className="sm:col-span-2"><p className="whitespace-pre-wrap">{patient.mentalHealthHistory}</p></InfoCard>
            <InfoCard icon={ICONS.USER} title="Situación Basal" className="sm:col-span-2"><p className="whitespace-pre-wrap">{patient.baselineSituation}</p></InfoCard>
            <InfoCard icon={ICONS.PILL} title="Tóxicos" className="sm:col-span-2"><p className="whitespace-pre-wrap">{patient.substanceUse}</p></InfoCard>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-slate-800 mb-3">Tratamiento</h2>
            <div className="mb-4 p-3 bg-primary-50 border-l-4 border-primary-500 rounded">
               <h3 className="font-semibold text-primary-800">Tratamiento Actual</h3>
               <p className="text-sm text-primary-700 mt-1">{lastTreatment?.note || 'No hay tratamiento activo registrado.'}</p>
            </div>
            <EvolutionSection 
              title="Ver Evolución Previa del Tratamiento" 
              history={patient.treatmentHistory}
              onEdit={(index) => handleEditHistoryNote('treatment', index)}
              onDelete={(index) => handleDeleteHistoryNote('treatment', index)}
            />
            <textarea
              value={currentTreatmentNote}
              onChange={(e) => setCurrentTreatmentNote(e.target.value)}
              placeholder="Añadir nueva nota de tratamiento/evolución..."
              className="mt-4 w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              rows={3}
            ></textarea>
          </div>
        </div>

        {/* === COLUMNA DERECHA === */}
        <div className="flex flex-col">
          <div className="bg-white p-4 rounded-lg shadow h-full flex flex-col">
            <h2 className="text-xl font-semibold text-slate-800 mb-3">Historia Clínica</h2>
            <div className="mb-4 p-3 bg-slate-100 border-l-4 border-slate-400 rounded">
               <h3 className="font-semibold text-slate-800">Última Consulta</h3>
               <p className="text-sm text-slate-700 mt-1">{lastConsultation?.note || 'No hay consultas previas registradas.'}</p>
            </div>
            <EvolutionSection 
              title="Ver Evolución Previa de la Historia" 
              history={patient.consultationHistory} 
              onEdit={(index) => handleEditHistoryNote('consultation', index)}
              onDelete={(index) => handleDeleteHistoryNote('consultation', index)}
            />
            <textarea
              value={currentHistoryNote}
              onChange={(e) => setCurrentHistoryNote(e.target.value)}
              placeholder="Redactar historia actual de la consulta..."
              className="mt-4 w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 flex-grow min-h-[250px]"
            ></textarea>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-end">
        <Button onClick={handleSaveConsultation}>Aceptar y Guardar Consulta</Button>
      </div>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Datos del Paciente">
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre completo</label>
                      <input type="text" name="name" id="name" value={editablePatientData.name} onChange={handleEditFormChange} className="mt-1 w-full p-2 border border-slate-300 rounded-md"/>
                  </div>
                  <div>
                      <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
                      <input type="date" name="dateOfBirth" id="dateOfBirth" value={editablePatientData.dateOfBirth} onChange={handleEditFormChange} className="mt-1 w-full p-2 border border-slate-300 rounded-md"/>
                  </div>
                  <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">Domicilio</label>
                      <input type="text" name="address" id="address" value={editablePatientData.address} onChange={handleEditFormChange} className="mt-1 w-full p-2 border border-slate-300 rounded-md"/>
                  </div>
                  <div>
                      <label htmlFor="insurance" className="block text-sm font-medium text-gray-700">Seguro</label>
                      <input type="text" name="insurance" id="insurance" value={editablePatientData.insurance} onChange={handleEditFormChange} className="mt-1 w-full p-2 border border-slate-300 rounded-md"/>
                  </div>
                   <div>
                      <label htmlFor="clinicalHistoryNumber" className="block text-sm font-medium text-gray-700">Nº Historia Clínica</label>
                      <input type="text" name="clinicalHistoryNumber" id="clinicalHistoryNumber" value={editablePatientData.clinicalHistoryNumber} onChange={handleEditFormChange} className="mt-1 w-full p-2 border border-slate-300 rounded-md"/>
                  </div>
              </div>
              <div>
                  <label htmlFor="mentalHealthHistory" className="block text-sm font-medium text-gray-700">Antecedentes Salud Mental</label>
                  <textarea name="mentalHealthHistory" id="mentalHealthHistory" value={editablePatientData.mentalHealthHistory} onChange={handleEditFormChange} className="mt-1 w-full p-2 border border-slate-300 rounded-md" rows={3}/>
              </div>
              <div>
                  <label htmlFor="baselineSituation" className="block text-sm font-medium text-gray-700">Situación Basal</label>
                  <textarea name="baselineSituation" id="baselineSituation" value={editablePatientData.baselineSituation} onChange={handleEditFormChange} className="mt-1 w-full p-2 border border-slate-300 rounded-md" rows={3}/>
              </div>
               <div>
                  <label htmlFor="substanceUse" className="block text-sm font-medium text-gray-700">Tóxicos</label>
                  <textarea name="substanceUse" id="substanceUse" value={editablePatientData.substanceUse} onChange={handleEditFormChange} className="mt-1 w-full p-2 border border-slate-300 rounded-md" rows={3}/>
              </div>
          </div>
          <div className="mt-6 flex justify-end">
              <Button onClick={handleSavePatientDetails}>Guardar Cambios</Button>
          </div>
      </Modal>

      <Modal isOpen={!!noteToEdit} onClose={() => setNoteToEdit(null)} title="Editar Nota de Evolución">
        {noteToEdit && (
          <div>
            <textarea
              value={noteToEdit.note}
              onChange={(e) => setNoteToEdit({ ...noteToEdit, note: e.target.value })}
              className="mt-2 w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              rows={8}
            />
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setNoteToEdit(null)}>Cancelar</Button>
              <Button onClick={handleSaveEditedNote}>Guardar Cambios</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={!!confirmation} onClose={() => setConfirmation(null)} title="Confirmar Acción">
          {confirmation && (
              <div>
                  <p className="text-slate-700">{confirmation.message}</p>
                  <div className="mt-6 flex justify-end gap-2">
                      <Button variant="secondary" onClick={() => setConfirmation(null)}>Cancelar</Button>
                      <Button variant="danger" onClick={confirmation.onConfirm}>Confirmar</Button>
                  </div>
              </div>
          )}
      </Modal>
    </div>
  );
};