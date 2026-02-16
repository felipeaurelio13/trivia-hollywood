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
    </section>
  );
}
