// Placeholder for other modules (Business, KI-System, Technik, Vertrieb, Data, Analytics)
// These can be implemented similarly to InnovationModule and MarketModule

export default function PlaceholderModule({ title, icon, description }) {
  return (
    <section className="space-y-6">
      <h2 className="text-4xl font-bold section-header">{icon} {title}</h2>
      <p className="text-gray-600">{description}</p>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">{icon}</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Modul in Entwicklung</h3>
          <p className="text-gray-600">
            Dieses Modul wird derzeit implementiert. Die vollständige Funktionalität wird in Kürze verfügbar sein.
          </p>
        </div>
      </div>
    </section>
  )
}
