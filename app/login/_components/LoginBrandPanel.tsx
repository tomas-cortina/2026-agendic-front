export function LoginBrandPanel() {
    return (
        <div className="hidden md:flex flex-col justify-between bg-[#0f1b2d] text-white p-11">
            <div>
                <div className="text-[18px] font-extrabold mb-10">
                    agendic<span className="text-[#5b82ff]">.</span>
                </div>
                <div className="text-[24px] font-extrabold leading-[1.25] tracking-[-0.02em] mb-3.5">
                    Tu agenda, siempre a mano.
                </div>
                <div className="text-[13px] text-[#aab4c8] leading-[1.45] mb-5">
                    Entrá para ver los turnos de hoy, confirmar asistencias y
                    organizar tu equipo.
                </div>
                <div className="bg-[#182338] border border-[#2a3650] rounded-[10px] p-3 text-[11.5px]">
                    <div className="flex justify-between mb-2 text-[#aab4c8]">
                        Hoy · 6 turnos
                    </div>
                    <div className="bg-[#1f2d4a] border-l-[3px] border-[#5b82ff] rounded-md px-2.5 py-2 mb-1.5">
                        <b>Consulta · Dra. Ruiz</b>
                        <br />
                        <span className="text-[#aab4c8]">
                            Camila P. · 9:00
                        </span>
                    </div>
                    <div className="bg-[#173a26] border-l-[3px] border-[#22c55e] rounded-md px-2.5 py-2">
                        <b>Masaje 60&apos;</b>
                        <br />
                        <span className="text-[#aab4c8]">
                            ✓ Asistencia confirmada
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex gap-5 text-[12px] text-[#aab4c8] border-t border-[#2a3650] pt-4">
                <div>
                    <b className="text-white text-[16px] block">+12.000</b>
                    negocios activos
                </div>
                <div>
                    <b className="text-white text-[16px] block">-38%</b>
                    ausencias
                </div>
            </div>
        </div>
    );
}
