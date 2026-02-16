import React from 'react';

export default function SettingsPage() {
  return (
    <section className="space-y-5 pt-6">
      <h1 className="text-3xl font-bold">Ajustes de lectura y accesibilidad</h1>
      <div className="space-y-3 rounded-2xl border-2 border-slate-700 p-5 text-lg leading-relaxed">
        <p>Idioma: Español</p>
        <p>Sonido/hápticos web: Activado</p>
        <p>Contraste alto y botones grandes: Activado por defecto.</p>
        <p>Animaciones reducidas: Respetamos tu preferencia del dispositivo.</p>
      </div>

      <div className="space-y-3 rounded-2xl border-2 border-cyan-300 bg-slate-900/80 p-5 text-base leading-relaxed">
        <h2 className="text-xl font-semibold text-cyan-200">Diagnóstico rápido de despliegue</h2>
        <p>
          Si al abrir la web ves el README, casi siempre estás entrando al repositorio (github.com) o Pages está
          apuntando a &quot;Deploy from branch&quot; en vez de &quot;GitHub Actions&quot;.
        </p>
        <p>
          URL esperada del juego: <span className="font-semibold">https://&lt;usuario&gt;.github.io/trivia-hollywood/</span>
        </p>
        <p>
          Verifica en <span className="font-semibold">Settings → Pages</span> que la fuente sea{' '}
          <span className="font-semibold">GitHub Actions</span>.
        </p>
      </div>
    </section>
  );
}
