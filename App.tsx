
import React, { useState, useMemo } from 'react';
import { Psychiatrist, Patient, Appointment } from './types';
import { INITIAL_PSYCHIATRISTS, INITIAL_PATIENTS, INITIAL_APPOINTMENTS } from './data/mockData';
import { PsychiatristAgenda } from './components/PsychiatristAgenda';
import { PatientView } from './components/PatientView';

const App: React.FC = () => {
    const [psychiatrists, setPsychiatrists] = useState<Psychiatrist[]>(INITIAL_PSYCHIATRISTS);
    const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
    const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);

    const [currentView, setCurrentView] = useState<'agenda' | 'patient'>('agenda');
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

    const handleSelectPatient = (patientId: string) => {
        setSelectedPatientId(patientId);
        setCurrentView('patient');
    };

    const handleReturnToAgenda = () => {
        setSelectedPatientId(null);
        setCurrentView('agenda');
    };

    const handleUpdatePatient = (updatedPatient: Patient) => {
        setPatients(prevPatients => 
            prevPatients.map(p => p.id === updatedPatient.id ? updatedPatient : p)
        );
        // This function is now also called from the edit modal, where we don't want to change view.
        // The PatientView's save button will explicitly call onBack after saving.
    };

    const handleAddPsychiatrist = (name: string, specialty: string) => {
        const newPsychiatrist: Psychiatrist = {
            id: `psy-${new Date().getTime()}`,
            name,
            specialty,
        };
        setPsychiatrists(prev => [...prev, newPsychiatrist]);
    };

    const handleUpdatePsychiatrist = (updatedPsychiatrist: Psychiatrist) => {
        setPsychiatrists(prev => 
            prev.map(p => p.id === updatedPsychiatrist.id ? updatedPsychiatrist : p)
        );
    };

    const handleDeletePsychiatrist = (psychiatristId: string) => {
        setAppointments(prev => prev.filter(apt => apt.psychiatristId !== psychiatristId));
        setPsychiatrists(prev => prev.filter(psy => psy.id !== psychiatristId));
    };
    
    const handleAddPatient = (patientData: Omit<Patient, 'id' | 'treatmentHistory' | 'consultationHistory'>) => {
        const newPatient: Patient = {
            id: `pat-${new Date().getTime()}`,
            ...patientData,
            treatmentHistory: [],
            consultationHistory: [],
        };
        setPatients(prev => [...prev, newPatient]);
    };
    
    const handleAddAppointment = (appointmentData: Omit<Appointment, 'id'>) => {
        const newAppointment: Appointment = {
            id: `apt-${new Date().getTime()}`,
            ...appointmentData,
        };
        setAppointments(prev => [...prev, newAppointment]);
    };

    const selectedPatient = useMemo(() => {
        if (currentView === 'patient' && selectedPatientId) {
            return patients.find(p => p.id === selectedPatientId) || null;
        }
        return null;
    }, [currentView, selectedPatientId, patients]);

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900">
            {currentView === 'agenda' ? (
                <PsychiatristAgenda
                    psychiatrists={psychiatrists}
                    patients={patients}
                    appointments={appointments}
                    onSelectPatient={handleSelectPatient}
                    onAddPsychiatrist={handleAddPsychiatrist}
                    onUpdatePsychiatrist={handleUpdatePsychiatrist}
                    onDeletePsychiatrist={handleDeletePsychiatrist}
                    onAddPatient={handleAddPatient}
                    onAddAppointment={handleAddAppointment}
                />
            ) : selectedPatient ? (
                <PatientView
                    patient={selectedPatient}
                    onUpdatePatient={handleUpdatePatient}
                    onBack={handleReturnToAgenda}
                />
            ) : (
                <div className="flex justify-center items-center h-screen">
                    <div className="text-center">
                        <p className="text-xl text-red-600 font-semibold">Error: Paciente no encontrado.</p>
                        <p className="text-slate-500">Volviendo a la agenda...</p>
                        {/* Fallback to agenda view */}
                        {(() => { setTimeout(() => handleReturnToAgenda(), 2000); return null; })()}
                    </div>
                </div>
            )}
        </main>
    );
};

export default App;