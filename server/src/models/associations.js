import Usuario from './Usuario.js';
import Paciente from './Paciente.js';
import Cita from './Cita.js';

// Una cita pertenece a un paciente
Cita.belongsTo(Paciente, {
  as: 'paciente',
  foreignKey: 'id_paciente',
});

// Un paciente puede tener muchas citas
Paciente.hasMany(Cita, {
  as: 'citas',
  foreignKey: 'id_paciente',
});

// Una cita pertenece a un medico (que es un usuario)
Cita.belongsTo(Usuario, {
  as: 'medico',
  foreignKey: 'id_medico',
});

// Un usuario medico puede tener muchas citas asignadas
Usuario.hasMany(Cita, {
  as: 'citas',
  foreignKey: 'id_medico',
});

export { Usuario, Paciente, Cita };