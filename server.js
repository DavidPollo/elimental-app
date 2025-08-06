
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001; // Use port provided by Render or 3001 locally
const DB_PATH = path.join(__dirname, 'database.json');

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// --- INITIAL DATA FUNCTION ---
const getInitialData = () => {
    const today = new Date();
    const formatDate = (date) => date.toISOString().split('T')[0];
    return {
        psychiatrists: [
            { id: 'psy-1', name: 'Dr. Alejandro Vargas', specialty: 'Psiquiatría General' },
            { id: 'psy-2', name: 'Dra. Isabel Navarro', specialty: 'Psiquiatría Infantil y Adolescente' },
            { id: 'psy-3', name: 'Dr. Carlos Mendoza', specialty: 'Adicciones' },
        ],
        patients: [
            { id: 'pat-1', clinicalHistoryNumber: 'HC789012', name: 'Elena Rodríguez', dateOfBirth: '1990-03-15', address: 'Calle Ficticia 123, Madrid', insurance: 'Adeslas', mentalHealthHistory: 'Episodios depresivos recurrentes desde la adolescencia. Dos ingresos previos por ideación autolítica.', baselineSituation: 'Funcional en su trabajo como diseñadora gráfica, pero con dificultades en relaciones interpersonales. Vive sola.', substanceUse: 'Consumo ocasional de alcohol (2-3 veces por mes). No consume otras drogas.', treatmentHistory: [{ date: '2023-05-15', note: 'Se inicia tratamiento con Sertralina 50mg/día.' }, { date: '2023-08-20', note: 'Aumento de dosis a 100mg/día por respuesta parcial. Se añade terapia cognitivo-conductual.' }], consultationHistory: [{ date: '2023-08-20', note: 'Paciente refiere mejoría anímica, aunque persiste la anhedonia. Se ajusta medicación.' }, { date: '2024-01-10', note: 'Estable. Refiere buena adherencia al tratamiento. Discutimos estrategias de afrontamiento.' }] },
            { id: 'pat-2', clinicalHistoryNumber: 'HC456789', name: 'Javier García', dateOfBirth: '1979-06-20', address: 'Avenida Inventada 45, Barcelona', insurance: 'Sanitas', mentalHealthHistory: 'Diagnóstico de Trastorno de Ansiedad Generalizada (TAG) hace 5 años.', baselineSituation: 'Directivo en una empresa de tecnología. Refiere estrés laboral crónico y dificultades para conciliar el sueño.', substanceUse: 'Consumo diario de cafeína (4-5 tazas). No otras sustancias.', treatmentHistory: [{ date: '2022-11-01', note: 'Se prescribe Escitalopram 10mg/día y Lorazepam 1mg si precisa por insomnio.' }], consultationHistory: [{ date: '2024-03-01', note: 'Paciente acude por empeoramiento de la ansiedad. Refiere mayor carga de trabajo. Se refuerzan técnicas de relajación.' }] },
            { id: 'pat-3', clinicalHistoryNumber: 'HC123456', name: 'Lucía Fernández', dateOfBirth: '1996-09-01', address: 'Plaza Imaginaria 7, Sevilla', insurance: 'DKV', mentalHealthHistory: 'Primer episodio psicótico hace 2 años, con buen resultado tras tratamiento inicial. Diagnóstico de esquizofrenia paranoide.', baselineSituation: 'Estudiante universitaria. Vive con sus padres. Ha retomado sus estudios con apoyo.', substanceUse: 'Consumo de cannabis en el pasado, actualmente abstinente.', treatmentHistory: [{ date: '2022-06-01', note: 'Inicio con Risperidona 2mg/día.' }, { date: '2023-01-15', note: 'Cambio a Aripiprazol 10mg/día por mejor perfil de efectos secundarios.' }], consultationHistory: [{ date: '2024-02-15', note: 'Paciente estable, sin síntomas psicóticos positivos. Refiere sentirse algo apática. Se explora ajuste de dosis.' }] },
        ],
        appointments: [
            { id: 'apt-1', psychiatristId: 'psy-1', patientId: 'pat-1', date: formatDate(today), time: '10:00' },
            { id: 'apt-2', psychiatristId: 'psy-1', patientId: 'pat-2', date: formatDate(today), time: '11:00' },
            { id: 'apt-3', psychiatristId: 'psy-2', patientId: 'pat-3', date: formatDate(today), time: '09:00' },
            { id: 'apt-4', psychiatristId: 'psy-2', patientId: 'pat-1', date: formatDate(new Date(today.getTime() + 24 * 60 * 60 * 1000)), time: '12:00' },
        ],
    };
};

// --- API ROUTES ---

// GET /api/data: Retrieve all clinic data
app.get('/api/data', async (req, res) => {
    try {
        await fs.access(DB_PATH);
        const data = await fs.readFile(DB_PATH, 'utf-8');
        res.json(JSON.parse(data));
    } catch (error) {
        // If database.json doesn't exist, create it with initial data
        console.log('Base de datos no encontrada. Creando una nueva con datos iniciales.');
        const initialData = getInitialData();
        await fs.writeFile(DB_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
        res.json(initialData);
    }
});

// POST /api/data: Overwrite all clinic data with the new state
app.post('/api/data', async (req, res) => {
    try {
        const newData = req.body;
        // Basic validation to ensure we're not writing empty/malformed data
        if (!newData || !newData.psychiatrists || !newData.patients || !newData.appointments) {
            return res.status(400).json({ message: 'Datos inválidos recibidos.' });
        }
        await fs.writeFile(DB_PATH, JSON.stringify(newData, null, 2), 'utf-8');
        res.status(200).json({ message: 'Datos guardados correctamente.' });
    } catch (error) {
        console.error('Error al guardar los datos:', error);
        res.status(500).json({ message: 'Error interno del servidor al guardar los datos.' });
    }
});

// --- SERVE THE FRONTEND ---

// This route serves the main HTML file.
// It's specific and won't conflict with API routes.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


// --- START THE SERVER ---
app.listen(PORT, () => {
    console.log(`Servidor ELIMENTAL escuchando en el puerto ${PORT}`);
});
