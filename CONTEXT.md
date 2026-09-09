# Agendic

Plataforma de gestión de turnos para negocios de servicios (clínicas, spas, gimnasios, academias, etc.). El Negocio publica su agenda; el Cliente reserva y gestiona sus turnos desde la web o la app.

## Language

### Actores

**Negocio**:
Quien contrata Agendic para gestionar su agenda. Es el destinatario de la landing y del panel de administración.
_Avoid_: empresa, cuenta, cliente (cuando se refiere al negocio)

**Cliente**:
Persona que reserva turnos en un Negocio. Nunca designa al Negocio.
_Avoid_: usuario final, paciente, consumidor

**Sucursal**:
Sede física de un Negocio, con horarios propios. Un Negocio puede tener varias.
_Avoid_: sede, local

**Profesional**:
Persona de un Negocio que atiende turnos.
_Avoid_: staff (en singular), recurso, empleado

**Staff**:
El conjunto de profesionales de un Negocio. Solo se usa en plural/colectivo.

**Rubro**:
Categoría a la que pertenece un Negocio (clínica, spa, gimnasio, academia…).
_Avoid_: categoría, industria

### Agenda

**Servicio**:
Prestación que ofrece un Negocio, con duración y precio. No confundir con los microservicios de la arquitectura.
_Avoid_: prestación, tratamiento

**Turno**:
Reserva concreta de un Cliente con un Profesional en un horario determinado. Es el sustantivo; "reservar" es el verbo.
_Avoid_: cita, reserva (como sustantivo), appointment

**Reservar**:
Acción del Cliente de tomar un turno disponible.
_Avoid_: agendar, sacar turno, pedir turno

**Ausencia**:
Turno al que el Cliente no se presentó sin cancelarlo.
_Avoid_: inasistencia, no-show

### Comunicación

**Confirmación de reserva**:
Aviso automático que recibe el Cliente cuando su turno queda creado.
_Avoid_: confirmación (a secas)

**Confirmación de asistencia**:
Acción del Cliente, previa al turno, indicando que va a asistir.
_Avoid_: confirmación (a secas), confirmar turno
