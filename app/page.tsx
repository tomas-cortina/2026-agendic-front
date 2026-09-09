const NAV = [
  { href: "#funcionalidades", label: "Funcionalidades" },
  { href: "#rubros", label: "Rubros" },
  { href: "#faq", label: "Preguntas frecuentes" },
];

const RUBROS = [
  { icon: "🏥", name: "Clínicas y consultorios" },
  { icon: "💆", name: "Spas y estética" },
  { icon: "💈", name: "Peluquerías y barberías" },
  { icon: "🏋️", name: "Gimnasios" },
  { icon: "🎓", name: "Academias" },
  { icon: "🔧", name: "Talleres" },
  { icon: "🧠", name: "Psicología" },
  { icon: "🥗", name: "Nutrición" },
];

const PILARES = [
  {
    icon: "calendar",
    title: "Agenda online",
    tagline: "Tu disponibilidad, siempre actualizada.",
    bullets: [
      "Reservas 24/7 por tu link público",
      "Varias sucursales, cada una con sus horarios",
      "Varios profesionales, cada uno con su agenda",
      "Horarios, feriados y bloqueos manuales",
      "Lista de espera cuando se libera un turno",
    ],
  },
  {
    icon: "bell",
    title: "Comunicación automática",
    tagline: "Menos ausencias sin levantar el teléfono.",
    bullets: [
      "Confirmación de reserva al instante",
      "Recordatorios 24 h y 1 h antes del turno",
      "Aviso automático al reagendar o cancelar",
      "Tu cliente confirma su asistencia con un toque",
      "Todo por email, sin configurar nada",
    ],
  },
  {
    icon: "user",
    title: "Datos del cliente",
    tagline: "Conocé a quién atendés.",
    bullets: [
      "Ficha de cliente",
      "Historial de turnos",
      "Notas privadas del negocio",
      "Segmentación: quién vuelve y quién no",
    ],
  },
] as const;

const CLIENTES = [
  "Reservan por tu link, sin llamarte",
  "Reciben la confirmación de reserva y los recordatorios",
  "Confirman asistencia, reagendan o cancelan desde la app",
];

const BENEFICIOS = [
  {
    icon: "message",
    title: "Menos llamadas y WhatsApp",
    body: "Tus clientes reservan solos, a cualquier hora, sin interrumpirte.",
  },
  {
    icon: "check",
    title: "Menos ausencias",
    body: "Recordatorios automáticos y confirmación de asistencia antes de cada turno.",
  },
  {
    icon: "calendar",
    title: "Agenda siempre al día",
    body: "Cada reserva, cambio o cancelación se refleja al instante en todas tus sucursales.",
  },
] as const;

const FAQ = [
  {
    q: "¿Qué es Agendic?",
    a: "Una plataforma de gestión de turnos para negocios de servicios. Configurás servicios, profesionales y horarios; tus clientes reservan online y el sistema se encarga de confirmar y recordar.",
  },
  {
    q: "¿Cómo reservan mis clientes?",
    a: "Desde tu link público de reserva, desde la web o desde la app. Eligen servicio, profesional y horario disponible, y reciben la confirmación de reserva al instante.",
  },
  {
    q: "¿Puedo tener varias sucursales y profesionales?",
    a: "Sí. Cada sucursal tiene sus propios horarios y cada profesional su propia agenda. Vos ves todo desde un mismo lugar.",
  },
  {
    q: "¿Cómo se envían los recordatorios?",
    a: "Por email, de forma automática: al reservar, 24 horas antes y 1 hora antes del turno. No tenés que configurar nada.",
  },
  {
    q: "¿Qué pasa si un cliente cancela o reagenda?",
    a: "El turno se libera y, si hay lista de espera, se le ofrece a otro cliente. Podés definir una política de cancelación, por ejemplo con 24 horas de anticipación.",
  },
  {
    q: "¿Hay app para mis clientes?",
    a: "Sí. Desde la app ven sus próximos turnos, confirman asistencia, reagendan o cancelan.",
  },
];

// Mockup de agenda: 8 filas de media hora (9:00–13:00), 3 profesionales.
const PROFESIONALES = ["Martín", "Lucía", "Sofía"];
const HORAS = ["9:00", "10:00", "11:00", "12:00"];
const TURNOS = [
  { pro: 0, row: 1, span: 2, label: "Corte y barba" },
  { pro: 0, row: 4, span: 1, label: "Corte" },
  { pro: 0, row: 6, span: 2, label: "Color" },
  { pro: 1, row: 2, span: 2, label: "Corte y barba" },
  { pro: 1, row: 5, span: 1, label: "Afeitado" },
  { pro: 1, row: 7, span: 2, label: "Corte y barba" },
  { pro: 2, row: 1, span: 1, label: "Corte" },
  { pro: 2, row: 3, span: 2, label: "Color" },
  { pro: 2, row: 6, span: 1, label: "Corte" },
  { pro: 2, row: 8, span: 1, label: "Afeitado" },
];
const TURNO_COLOR = [
  "bg-primary/15 border-primary",
  "bg-accent/15 border-accent",
  "bg-ink/10 border-ink-muted",
];

const ICONS = {
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </>
  ),
  bell: (
    <>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </>
  ),
  user: (
    <>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  message: (
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  ),
  check: <path d="M20 6 9 17l-5-5" />,
  chevron: <path d="m6 9 6 6 6-6" />,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  close: <path d="M18 6 6 18M6 6l12 12" />,
};

function Icon({
  name,
  className = "size-5",
}: {
  name: keyof typeof ICONS;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {ICONS[name]}
    </svg>
  );
}

const btn =
  "inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium transition-colors";
const btnPrimary = `${btn} bg-primary text-white hover:bg-primary-hover`;
const btnSecondary = `${btn} border border-line bg-surface text-ink hover:border-ink-muted`;
const container = "mx-auto w-full max-w-6xl px-6";

function Wordmark() {
  return (
    <a href="#" className="flex items-center gap-2 text-lg font-semibold">
      <span className="grid size-8 place-items-center rounded-lg bg-primary text-white">
        <Icon name="calendar" className="size-4" />
      </span>
      Agendic
    </a>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-background/90 backdrop-blur">
      <div className={`${container} relative flex h-16 items-center justify-between`}>
        <Wordmark />
        <nav className="hidden items-center gap-8 text-sm md:flex">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="hover:text-primary">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <a href="#" className={btnSecondary}>
            Ir a mi cuenta
          </a>
          <a href="#" className={btnPrimary}>
            Empezá gratis
          </a>
        </div>
        <details className="group md:hidden">
          <summary className="cursor-pointer list-none rounded-lg p-2 hover:bg-tint [&::-webkit-details-marker]:hidden">
            <Icon name="menu" className="size-6 group-open:hidden" />
            <Icon name="close" className="hidden size-6 group-open:block" />
            <span className="sr-only">Menú</span>
          </summary>
          <div className="absolute inset-x-0 top-full flex flex-col gap-3 border-b border-line bg-background p-6">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className="py-1">
                {item.label}
              </a>
            ))}
            <a href="#" className={btnSecondary}>
              Ir a mi cuenta
            </a>
            <a href="#" className={btnPrimary}>
              Empezá gratis
            </a>
          </div>
        </details>
      </div>
    </header>
  );
}

function AgendaMockup() {
  return (
    <div className="rounded-2xl border border-line bg-surface p-4 shadow-xl shadow-ink/5">
      <div className="mb-3 flex items-center justify-between text-xs">
        <span className="font-medium">
          Barbería Roma · <span className="text-ink-muted">Sucursal Centro</span>
        </span>
        <span className="text-ink-muted">jue 12 sep</span>
      </div>
      <div className="grid grid-cols-[2.5rem_repeat(3,1fr)] grid-rows-[auto_repeat(8,1.5rem)] text-xs">
        <div />
        {PROFESIONALES.map((pro) => (
          <div key={pro} className="pb-2 text-center font-medium">
            {pro}
          </div>
        ))}
        {HORAS.map((hora, h) => (
          <div
            key={hora}
            style={{ gridColumn: 1, gridRow: `${h * 2 + 2} / span 2` }}
            className="-mt-2 text-[10px] text-ink-muted"
          >
            {hora}
          </div>
        ))}
        {HORAS.map((hora, h) =>
          PROFESIONALES.map((pro, p) => (
            <div
              key={`${hora}-${pro}`}
              style={{ gridColumn: p + 2, gridRow: `${h * 2 + 2} / span 2` }}
              className="border-t border-line"
            />
          )),
        )}
        {TURNOS.map((t, i) => (
          <div
            key={i}
            style={{ gridColumn: t.pro + 2, gridRow: `${t.row + 1} / span ${t.span}` }}
            className={`z-10 m-0.5 truncate rounded-md border-l-2 px-2 py-0.5 leading-5 ${TURNO_COLOR[t.pro]}`}
          >
            {t.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className={`${container} grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-28`}>
      <div>
        <p className="mb-4 text-sm font-medium text-primary">
          Agenda online para negocios de servicios
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Turnos online para clínicas, spas, gimnasios y academias
        </h1>
        <p className="mt-6 text-lg text-ink-muted">
          Organizá tu agenda, reducí las ausencias y dejá de atender turnos por WhatsApp.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#" className={`${btnPrimary} px-6 py-3 text-base`}>
            Empezá gratis
          </a>
          <a href="#funcionalidades" className={`${btnSecondary} px-6 py-3 text-base`}>
            Ver funcionalidades
          </a>
        </div>
        <p className="mt-4 text-sm text-ink-muted">
          Web y app móvil, para vos y para tus clientes.
        </p>
      </div>
      <AgendaMockup />
    </section>
  );
}

function Rubros() {
  return (
    <section id="rubros" className="scroll-mt-16 bg-tint py-20">
      <div className={container}>
        <h2 className="text-center text-3xl font-bold tracking-tight">
          Agendic ordena la agenda de tu negocio
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-ink-muted">
          Pensado para cualquier negocio que atiende con turnos.
        </p>
        <ul className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {RUBROS.map((r) => (
            <li
              key={r.name}
              className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface p-6 text-center text-sm font-medium"
            >
              <span className="text-3xl" aria-hidden>
                {r.icon}
              </span>
              {r.name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Funcionalidades() {
  return (
    <section id="funcionalidades" className={`${container} scroll-mt-16 py-20`}>
      <h2 className="text-center text-3xl font-bold tracking-tight">
        Todo lo que necesitás para dejar de agendar a mano
      </h2>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {PILARES.map((p) => (
          <article key={p.title} className="rounded-2xl border border-line bg-surface p-6">
            <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
              <Icon name={p.icon} />
            </span>
            <h3 className="mt-4 text-xl font-semibold">{p.title}</h3>
            <p className="mt-1 text-ink-muted">{p.tagline}</p>
            <ul className="mt-5 space-y-2 text-sm">
              {p.bullets.map((b) => (
                <li key={b} className="flex gap-2">
                  <Icon name="check" className="mt-0.5 size-4 shrink-0 text-accent" />
                  {b}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

function TurnoCardMockup() {
  return (
    <div className="mx-auto w-full max-w-xs rounded-[2rem] border-8 border-ink/10 bg-surface p-5 shadow-xl shadow-ink/5">
      <p className="text-xs font-medium text-primary">Próximo turno</p>
      <h3 className="mt-1 text-lg font-semibold">Corte y barba</h3>
      <p className="text-sm text-ink-muted">Barbería Roma · Sucursal Centro</p>
      <p className="mt-3 text-sm">
        jue 12 sep · <span className="font-medium">15:30</span> · con Martín
      </p>
      <span className="mt-3 inline-block rounded-full bg-tint px-2.5 py-1 text-xs text-ink-muted">
        Pendiente de confirmación
      </span>
      <div className="mt-5 flex flex-col gap-2">
        <span className={`${btnPrimary} w-full`}>Confirmar asistencia</span>
        <div className="grid grid-cols-2 gap-2">
          <span className={btnSecondary}>Reagendar</span>
          <span className={btnSecondary}>Cancelar</span>
        </div>
      </div>
    </div>
  );
}

function Clientes() {
  return (
    <section className="bg-tint py-20">
      <div className={`${container} grid items-center gap-12 lg:grid-cols-2`}>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Tus clientes gestionan sus turnos solos
          </h2>
          <p className="mt-4 text-ink-muted">
            Tu cliente recibe la confirmación al instante y confirma su asistencia con un toque.
            Si no puede ir, reagenda o cancela desde la app y el turno vuelve a estar disponible.
          </p>
          <ul className="mt-6 space-y-3">
            {CLIENTES.map((c) => (
              <li key={c} className="flex gap-3">
                <Icon name="check" className="mt-0.5 size-5 shrink-0 text-accent" />
                {c}
              </li>
            ))}
          </ul>
        </div>
        <TurnoCardMockup />
      </div>
    </section>
  );
}

function Beneficios() {
  return (
    <section className={`${container} py-20`}>
      <h2 className="text-center text-3xl font-bold tracking-tight">
        Menos trabajo manual, más turnos atendidos
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-center text-ink-muted">
        Agendar por teléfono, WhatsApp o papel cuesta horas y termina en huecos en la agenda.
        Agendic lo hace solo.
      </p>
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {BENEFICIOS.map((b) => (
          <div key={b.title}>
            <span className="grid size-10 place-items-center rounded-lg bg-accent/10 text-accent">
              <Icon name={b.icon} />
            </span>
            <h3 className="mt-4 text-lg font-semibold">{b.title}</h3>
            <p className="mt-1 text-ink-muted">{b.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section id="faq" className="scroll-mt-16 bg-tint py-20">
      <div className="mx-auto w-full max-w-3xl px-6">
        <h2 className="text-center text-3xl font-bold tracking-tight">Preguntas frecuentes</h2>
        <div className="mt-10">
          {FAQ.map((f) => (
            <details key={f.q} className="group border-b border-line py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
                {f.q}
                <Icon
                  name="chevron"
                  className="size-5 shrink-0 transition-transform group-open:rotate-180"
                />
              </summary>
              <p className="mt-3 text-ink-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaFinal() {
  return (
    <section className="bg-primary py-20 text-white">
      <div className={`${container} text-center`}>
        <h2 className="text-3xl font-bold tracking-tight">Creá tu cuenta y empezá gratis</h2>
        <p className="mt-3 text-white/80">
          Configurá tus servicios, horarios y profesionales en minutos.
        </p>
        <a
          href="#"
          className={`${btn} mt-8 bg-white px-6 py-3 text-base text-primary hover:bg-tint`}
        >
          Crear cuenta gratis
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line py-12 text-sm">
      <div className={`${container} grid gap-8 sm:grid-cols-3`}>
        <div>
          <Wordmark />
          <p className="mt-3 text-ink-muted">Gestión de turnos para negocios de servicios.</p>
        </div>
        <div>
          <h3 className="font-semibold">Producto</h3>
          <ul className="mt-3 space-y-2 text-ink-muted">
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="hover:text-primary">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold">Legal</h3>
          <ul className="mt-3 space-y-2 text-ink-muted">
            <li>
              <a href="#" className="hover:text-primary">
                Política de privacidad
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary">
                Términos y condiciones
              </a>
            </li>
          </ul>
        </div>
      </div>
      <p className={`${container} mt-10 text-ink-muted`}>© 2026 Agendic</p>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Rubros />
        <Funcionalidades />
        <Clientes />
        <Beneficios />
        <Faq />
        <CtaFinal />
      </main>
      <Footer />
    </>
  );
}
