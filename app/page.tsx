import {
  Bell,
  Brain,
  Calendar,
  Check,
  ChevronDown,
  Dumbbell,
  GraduationCap,
  Menu,
  MessageCircle,
  Salad,
  Scissors,
  Sparkles,
  Stethoscope,
  User,
  Wrench,
  X,
} from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";

const NAV = [
  { href: "#funcionalidades", label: "Funcionalidades" },
  { href: "#rubros", label: "Rubros" },
  { href: "#faq", label: "Preguntas frecuentes" },
];

const RUBROS = [
  { icon: Stethoscope, name: "Clínicas y consultorios" },
  { icon: Sparkles, name: "Spas y estética" },
  { icon: Scissors, name: "Peluquerías y barberías" },
  { icon: Dumbbell, name: "Gimnasios" },
  { icon: GraduationCap, name: "Academias" },
  { icon: Wrench, name: "Talleres" },
  { icon: Brain, name: "Psicología" },
  { icon: Salad, name: "Nutrición" },
];

const PILARES = [
  {
    icon: Calendar,
    title: "Agenda online",
    tagline: "Tu disponibilidad, siempre actualizada.",
    bullets: [
      "Tus clientes reservan 24/7 por tu link público",
      "Varias sucursales, cada una con sus horarios",
      "Varios profesionales, cada uno con su agenda",
      "Horarios, feriados y bloqueos manuales",
      "Lista de espera cuando se libera un turno",
    ],
  },
  {
    icon: Bell,
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
    icon: User,
    title: "Datos del cliente",
    tagline: "Conocé a quién atendés.",
    bullets: [
      "Ficha de cliente",
      "Historial de turnos",
      "Notas privadas del negocio",
      "Segmentación: quién vuelve y quién no",
    ],
  },
];

const PARA_CLIENTES = [
  "Reservan por tu link, sin llamarte",
  "Reciben la confirmación de reserva y los recordatorios",
  "Confirman asistencia, reagendan o cancelan desde la app",
];

const BENEFICIOS = [
  {
    icon: MessageCircle,
    title: "Menos llamadas y WhatsApp",
    body: "Tus clientes reservan solos, a cualquier hora, sin interrumpirte.",
  },
  {
    icon: Check,
    title: "Menos ausencias",
    body: "Recordatorios automáticos y confirmación de asistencia antes de cada turno.",
  },
  {
    icon: Calendar,
    title: "Agenda siempre al día",
    body: "Cada turno nuevo, cambio o cancelación se refleja al instante en todas tus sucursales.",
  },
];

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

// Mockup de agenda semanal: 8 filas de media hora (9:00–13:00), color por profesional.
const DIAS = ["Lun", "Mar", "Mié", "Jue", "Vie"];
const HORAS = ["9:00", "10:00", "11:00", "12:00"];
const PROFESIONALES = [
  { name: "Martín", color: "bg-primary/15 border-primary" },
  { name: "Lucía", color: "bg-secondary/15 border-secondary" },
  { name: "Sofía", color: "bg-foreground/10 border-muted-foreground" },
];
// row: medias horas desde las 9:00; dia y pro: índices en DIAS y PROFESIONALES.
const TURNOS = [
  { dia: 0, pro: 0, row: 0, span: 2, label: "Corte y barba" },
  { dia: 0, pro: 1, row: 3, span: 1, label: "Corte" },
  { dia: 0, pro: 2, row: 6, span: 2, label: "Color" },
  { dia: 1, pro: 1, row: 1, span: 2, label: "Corte y barba" },
  { dia: 1, pro: 0, row: 4, span: 1, label: "Afeitado" },
  { dia: 1, pro: 2, row: 6, span: 1, label: "Corte" },
  { dia: 2, pro: 2, row: 0, span: 1, label: "Corte" },
  { dia: 2, pro: 0, row: 2, span: 2, label: "Color" },
  { dia: 2, pro: 1, row: 5, span: 2, label: "Corte y barba" },
  { dia: 3, pro: 0, row: 1, span: 1, label: "Corte" },
  { dia: 3, pro: 2, row: 3, span: 2, label: "Corte y barba" },
  { dia: 3, pro: 1, row: 7, span: 1, label: "Afeitado" },
  { dia: 4, pro: 1, row: 0, span: 2, label: "Color" },
  { dia: 4, pro: 2, row: 4, span: 1, label: "Corte" },
  { dia: 4, pro: 0, row: 5, span: 2, label: "Corte y barba" },
];
// La fila 1 de la grilla es la cabecera con los días.
const gridRow = (row: number, span: number) => `${row + 2} / span ${span}`;

const container = "mx-auto w-full max-w-6xl px-6";
const btnLg = "h-11 px-6 text-base";

function Wordmark() {
  return (
    <a href="#" className="flex items-center gap-2 text-lg font-semibold">
      <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
        <Calendar className="size-4" />
      </span>
      Agendic
    </a>
  );
}

function NavLinks() {
  return NAV.map((item) => (
    <a key={item.href} href={item.href} className="py-1 hover:text-primary">
      {item.label}
    </a>
  ));
}

function AuthLinks() {
  return (
    <>
      <Button asChild variant="outline" size="lg">
        <a href="#">Ir a mi cuenta</a>
      </Button>
      <Button asChild size="lg">
        <a href="#">Empezá gratis</a>
      </Button>
    </>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur">
      <div className={`${container} relative flex h-16 items-center justify-between`}>
        <Wordmark />
        <nav className="hidden items-center gap-8 text-sm md:flex">
          <NavLinks />
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <AuthLinks />
        </div>
        <details className="group md:hidden">
          <summary className="cursor-pointer list-none rounded-lg p-2 hover:bg-muted [&::-webkit-details-marker]:hidden">
            <Menu className="size-6 group-open:hidden" />
            <X className="hidden size-6 group-open:block" />
            <span className="sr-only">Menú</span>
          </summary>
          <div className="absolute inset-x-0 top-full flex flex-col gap-3 border-b bg-background p-6">
            <NavLinks />
            <AuthLinks />
          </div>
        </details>
      </div>
    </header>
  );
}

function AgendaMockup() {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-xl shadow-foreground/5">
      <div className="mb-3 flex items-center justify-between text-xs">
        <span className="font-medium">
          Barbería Roma · <span className="text-muted-foreground">Sucursal Centro</span>
        </span>
        <span className="text-muted-foreground">9 – 13 sep</span>
      </div>
      <div className="grid grid-cols-[2.5rem_repeat(5,1fr)] grid-rows-[auto_repeat(8,1.5rem)] text-xs">
        <div />
        {DIAS.map((dia) => (
          <div key={dia} className="pb-2 text-center font-medium">
            {dia}
          </div>
        ))}
        {HORAS.map((hora, h) => (
          <div
            key={hora}
            style={{ gridColumn: 1, gridRow: gridRow(h * 2, 2) }}
            className="-mt-2 text-[10px] text-muted-foreground"
          >
            {hora}
          </div>
        ))}
        {HORAS.map((hora, h) =>
          DIAS.map((dia, d) => (
            <div
              key={`${hora}-${dia}`}
              style={{ gridColumn: d + 2, gridRow: gridRow(h * 2, 2) }}
              className="border-t"
            />
          )),
        )}
        {TURNOS.map((t, i) => (
          <div
            key={i}
            style={{ gridColumn: t.dia + 2, gridRow: gridRow(t.row, t.span) }}
            className={`z-10 m-0.5 truncate rounded-md border-l-2 px-1.5 py-0.5 leading-5 ${PROFESIONALES[t.pro].color}`}
          >
            {t.label}
          </div>
        ))}
      </div>
      <ul className="mt-3 flex gap-4 text-[10px] text-muted-foreground">
        {PROFESIONALES.map((p) => (
          <li key={p.name} className="flex items-center gap-1.5">
            <span className={`size-2.5 rounded-full border-2 ${p.color}`} />
            {p.name}
          </li>
        ))}
      </ul>
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
        <p className="mt-6 text-lg text-muted-foreground">
          Organizá tu agenda, reducí las ausencias y dejá de atender turnos por WhatsApp.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild className={btnLg}>
            <a href="#">Empezá gratis</a>
          </Button>
          <Button asChild variant="outline" className={btnLg}>
            <a href="#funcionalidades">Ver funcionalidades</a>
          </Button>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Web y app móvil, para vos y para tus clientes.
        </p>
      </div>
      <AgendaMockup />
    </section>
  );
}

function Industries() {
  return (
    <section id="rubros" className="scroll-mt-16 bg-muted py-20">
      <div className={container}>
        <h2 className="text-center text-3xl font-bold tracking-tight">
          Agendic ordena la agenda de tu negocio
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
          Pensado para cualquier negocio que atiende con turnos.
        </p>
        <ul className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {RUBROS.map((r) => (
            <li key={r.name}>
              <Card className="h-full [--card-spacing:--spacing(6)]">
                <CardContent className="flex flex-col items-center gap-3 text-center font-medium">
                  <r.icon className="size-8 text-primary" />
                  {r.name}
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="funcionalidades" className={`${container} scroll-mt-16 py-20`}>
      <h2 className="text-center text-3xl font-bold tracking-tight">
        Todo lo que necesitás para dejar de anotar turnos a mano
      </h2>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {PILARES.map((p) => (
          <Card key={p.title} className="[--card-spacing:--spacing(6)]">
            <CardHeader>
              <span className="mb-3 grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <p.icon className="size-5" />
              </span>
              <CardTitle className="text-xl font-semibold">
                <h3>{p.title}</h3>
              </CardTitle>
              <CardDescription className="text-base">{p.tagline}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {p.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-secondary" />
                    {b}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function TurnoCardMockup() {
  return (
    <Card className="mx-auto w-full max-w-xs rounded-[2rem] border-8 border-foreground/10 shadow-xl shadow-foreground/5 [--card-spacing:--spacing(5)]">
      <CardHeader>
        <p className="text-xs font-medium text-primary">Próximo turno</p>
        <CardTitle className="text-lg font-semibold">
          <h3>Corte y barba</h3>
        </CardTitle>
        <CardDescription>Barbería Roma · Sucursal Centro</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p>
          jue 12 sep · <span className="font-medium">15:30</span> · con Martín
        </p>
        <span className="self-start rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
          Asistencia sin confirmar
        </span>
        <div className="mt-2 flex flex-col gap-2">
          <Button asChild className="w-full">
            <span>Confirmar asistencia</span>
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button asChild variant="outline">
              <span>Reagendar</span>
            </Button>
            <Button asChild variant="outline">
              <span>Cancelar</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ForCustomers() {
  return (
    <section className="bg-muted py-20">
      <div className={`${container} grid items-center gap-12 lg:grid-cols-2`}>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Tus clientes gestionan sus turnos solos
          </h2>
          <p className="mt-4 text-muted-foreground">
            Tu cliente recibe la confirmación al instante y confirma su asistencia con un toque.
            Si no puede ir, reagenda o cancela desde la app y el turno vuelve a estar disponible.
          </p>
          <ul className="mt-6 space-y-3">
            {PARA_CLIENTES.map((c) => (
              <li key={c} className="flex gap-3">
                <Check className="mt-0.5 size-5 shrink-0 text-secondary" />
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

function Benefits() {
  return (
    <section className={`${container} py-20`}>
      <h2 className="text-center text-3xl font-bold tracking-tight">
        Menos trabajo manual, más turnos atendidos
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
        Tomar turnos por teléfono, WhatsApp o papel cuesta horas y termina en huecos en la agenda.
        Agendic lo hace solo.
      </p>
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {BENEFICIOS.map((b) => (
          <div key={b.title}>
            <span className="grid size-10 place-items-center rounded-lg bg-secondary/10 text-secondary">
              <b.icon className="size-5" />
            </span>
            <h3 className="mt-4 text-lg font-semibold">{b.title}</h3>
            <p className="mt-1 text-muted-foreground">{b.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section id="faq" className="scroll-mt-16 bg-muted py-20">
      <div className="mx-auto w-full max-w-3xl px-6">
        <h2 className="text-center text-3xl font-bold tracking-tight">Preguntas frecuentes</h2>
        <div className="mt-10">
          {FAQ.map((f) => (
            <details key={f.q} className="group border-b py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
                {f.q}
                <ChevronDown className="size-5 shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="bg-primary py-20 text-primary-foreground">
      <div className={`${container} text-center`}>
        <h2 className="text-3xl font-bold tracking-tight">Creá tu cuenta y empezá gratis</h2>
        <p className="mt-3 text-primary-foreground/80">
          Configurá tus servicios, horarios y profesionales en minutos.
        </p>
        <Button
          asChild
          className={`${btnLg} mt-8 bg-primary-foreground text-primary hover:bg-primary-foreground/90`}
        >
          <a href="#">Crear cuenta gratis</a>
        </Button>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t py-12 text-sm">
      <div className={`${container} grid gap-8 sm:grid-cols-3`}>
        <div>
          <Wordmark />
          <p className="mt-3 text-muted-foreground">
            Gestión de turnos para negocios de servicios.
          </p>
        </div>
        <div>
          <h3 className="font-semibold">Producto</h3>
          <ul className="mt-3 space-y-2 text-muted-foreground">
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
          <ul className="mt-3 space-y-2 text-muted-foreground">
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
      <p className={`${container} mt-10 text-muted-foreground`}>© 2026 Agendic</p>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Industries />
        <Features />
        <ForCustomers />
        <Benefits />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
