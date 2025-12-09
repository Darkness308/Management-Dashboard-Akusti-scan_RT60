import { Rocket, Globe, Briefcase, Brain, Settings, FolderOpen, ClipboardList } from 'lucide-react'

export default function ModuleGrid({ onModuleClick }) {
  const modules = [
    {
      id: 'innovation',
      title: 'Innovation Mapping',
      description: 'Cross-Sektor-Synergien & Wachstumsfelder',
      icon: Rocket
    },
    {
      id: 'market',
      title: 'Marktanalyse',
      description: 'Wachstumstrends & Zielgruppen',
      icon: Globe
    },
    {
      id: 'business',
      title: 'Business Strategie',
      description: 'Preisstrategie & Wettbewerb',
      icon: Briefcase
    },
    {
      id: 'ki-system',
      title: 'KI-System',
      description: '20 Techniken, Workflows & Templates',
      icon: Brain
    },
    {
      id: 'technik',
      title: 'Technik & Normen',
      description: 'Standards & Anforderungen',
      icon: Settings
    },
    {
      id: 'data',
      title: 'Datenintegration',
      description: 'Upload & Analyse von Excel/CSV',
      icon: FolderOpen
    }
  ]

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h3 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
        <ClipboardList size={28} />
        Verfügbare Module
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map(module => {
          const IconComponent = module.icon
          return (
            <div
              key={module.id}
              onClick={() => onModuleClick(module.id)}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-400 cursor-pointer transition"
            >
              <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                <IconComponent size={20} className="text-purple-600" />
                {module.title}
              </h4>
              <p className="text-sm text-gray-600">{module.description}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
