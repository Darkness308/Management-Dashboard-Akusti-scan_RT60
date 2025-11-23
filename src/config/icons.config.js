/**
 * Icon Configuration
 * Centralized icon mapping using Lucide React
 *
 * Benefits over Unicode Emojis:
 * - Consistent across all platforms
 * - Professional appearance
 * - Scalable SVG
 * - Better for B2B/Enterprise
 * - Customizable (size, color, stroke)
 */

import {
  Home,
  Rocket,
  Globe,
  Briefcase,
  Brain,
  Settings,
  TrendingUp,
  FolderOpen,
  BarChart3,
  Plus,
  Download,
  Upload,
  FileText,
  FileSpreadsheet,
  Search,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Check,
  AlertCircle,
  Info,
  Zap,
  Users,
  Building2,
  Target,
  DollarSign,
  ExternalLink,
  Copy,
  Edit,
  Trash2,
  RefreshCw,
  Filter,
  SortAsc,
  Eye,
  EyeOff,
  Share2
} from 'lucide-react'

/**
 * Module Icons
 * Used in Navigation, ModuleGrid, etc.
 */
export const moduleIcons = {
  overview: Home,
  innovation: Rocket,
  market: Globe,
  business: Briefcase,
  'ki-system': Brain,
  technik: Settings,
  vertrieb: TrendingUp,
  data: FolderOpen,
  analytics: BarChart3
}

/**
 * Action Icons
 * Used for buttons, actions, etc.
 */
export const actionIcons = {
  add: Plus,
  download: Download,
  upload: Upload,
  export: Download,
  import: Upload,
  search: Search,
  menu: Menu,
  close: X,
  edit: Edit,
  delete: Trash2,
  refresh: RefreshCw,
  filter: Filter,
  sort: SortAsc,
  copy: Copy,
  share: Share2,
  view: Eye,
  hide: EyeOff
}

/**
 * File Type Icons
 */
export const fileIcons = {
  pdf: FileText,
  excel: FileSpreadsheet,
  csv: FileSpreadsheet,
  json: FileText,
  txt: FileText,
  word: FileText
}

/**
 * Status Icons
 */
export const statusIcons = {
  success: Check,
  error: AlertCircle,
  warning: AlertCircle,
  info: Info,
  loading: RefreshCw
}

/**
 * Business Icons
 */
export const businessIcons = {
  users: Users,
  building: Building2,
  target: Target,
  revenue: DollarSign,
  performance: Zap
}

/**
 * Navigation Icons
 */
export const navigationIcons = {
  chevronDown: ChevronDown,
  chevronRight: ChevronRight,
  externalLink: ExternalLink
}

/**
 * Helper: Get icon by module ID
 */
export const getModuleIcon = (moduleId) => {
  return moduleIcons[moduleId] || Home
}

/**
 * Helper: Get icon by action
 */
export const getActionIcon = (action) => {
  return actionIcons[action] || null
}

export default {
  moduleIcons,
  actionIcons,
  fileIcons,
  statusIcons,
  businessIcons,
  navigationIcons,
  getModuleIcon,
  getActionIcon
}
