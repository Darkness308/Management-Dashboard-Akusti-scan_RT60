//
//  RT60Result.swift
//  RT60Scanner
//
//  Ergebnis der RT60-Berechnung mit DIN 18041 Validierung
//

import Foundation

/// RT60-Berechnungsergebnis vom Backend
struct RT60Result: Codable {
    let rt60Values: [String: Double]  // "125": 0.65, "250": 0.60, ...
    let volume: Double
    let totalSurfaceArea: Double
    let formulaUsed: String
    let din18041Compliance: DIN18041Compliance?
    let recommendations: [String]

    enum CodingKeys: String, CodingKey {
        case rt60Values = "rt60_values"
        case volume
        case totalSurfaceArea = "total_surface_area"
        case formulaUsed = "formula_used"
        case din18041Compliance = "din18041_compliance"
        case recommendations
    }

    /// RT60-Wert für eine bestimmte Frequenz
    func rt60(at frequency: Int) -> Double? {
        return rt60Values[String(frequency)]
    }

    /// Durchschnittliche RT60 (500Hz & 1000Hz)
    var averageRT60: Double {
        guard let rt500 = rt60(at: 500),
              let rt1000 = rt60(at: 1000) else {
            return 0.0
        }
        return (rt500 + rt1000) / 2.0
    }

    /// Alle Frequenzbänder sortiert
    var sortedFrequencies: [Int] {
        return rt60Values.keys
            .compactMap { Int($0) }
            .sorted()
    }

    /// Compliance-Status als Enum
    var complianceStatus: ComplianceStatus {
        guard let compliance = din18041Compliance else {
            return .unknown
        }
        return compliance.overallCompliant ? .compliant : .nonCompliant
    }
}

/// DIN 18041 Compliance-Daten
struct DIN18041Compliance: Codable {
    let overallCompliant: Bool
    let averageRT60: Double?
    let frequencyResults: [String: FrequencyValidation]?
    let roomUsage: String
    let volume: Double
    let message: String?

    enum CodingKeys: String, CodingKey {
        case overallCompliant = "overall_compliant"
        case averageRT60 = "average_rt60"
        case frequencyResults = "frequency_results"
        case roomUsage = "room_usage"
        case volume
        case message
    }
}

/// Validierung pro Frequenz
struct FrequencyValidation: Codable {
    let compliant: Bool
    let status: String
    let targetRange: [Double]
    let measured: Double
    let deviation: Double
    let message: String

    enum CodingKeys: String, CodingKey {
        case compliant
        case status
        case targetRange = "target_range"
        case measured
        case deviation
        case message
    }

    var targetMin: Double {
        return targetRange.first ?? 0.0
    }

    var targetMax: Double {
        return targetRange.last ?? 0.0
    }

    var statusType: ValidationStatus {
        switch status {
        case "compliant": return .compliant
        case "too_short": return .tooShort
        case "too_long": return .tooLong
        default: return .unknown
        }
    }
}

/// Compliance-Status Enum
enum ComplianceStatus {
    case compliant
    case nonCompliant
    case unknown

    var color: String {
        switch self {
        case .compliant: return "green"
        case .nonCompliant: return "red"
        case .unknown: return "gray"
        }
    }

    var icon: String {
        switch self {
        case .compliant: return "checkmark.circle.fill"
        case .nonCompliant: return "xmark.circle.fill"
        case .unknown: return "questionmark.circle"
        }
    }

    var displayText: String {
        switch self {
        case .compliant: return "DIN 18041 konform"
        case .nonCompliant: return "DIN 18041 nicht konform"
        case .unknown: return "Keine Validierung"
        }
    }
}

/// Validierungsstatus pro Frequenz
enum ValidationStatus {
    case compliant
    case tooShort
    case tooLong
    case unknown

    var color: String {
        switch self {
        case .compliant: return "green"
        case .tooShort: return "orange"
        case .tooLong: return "red"
        case .unknown: return "gray"
        }
    }

    var icon: String {
        switch self {
        case .compliant: return "checkmark.circle"
        case .tooShort: return "arrow.down.circle"
        case .tooLong: return "arrow.up.circle"
        case .unknown: return "questionmark.circle"
        }
    }
}

/// Request-Body für RT60-Berechnung
struct RT60CalculationRequest: Codable {
    let room: RoomDimensions
    let surfaces: [SurfaceRequest]
    let targetUsage: String
    let useEyring: Bool

    enum CodingKeys: String, CodingKey {
        case room
        case surfaces
        case targetUsage = "target_usage"
        case useEyring = "use_eyring"
    }
}

struct RoomDimensions: Codable {
    let length: Double
    let width: Double
    let height: Double
}

struct SurfaceRequest: Codable {
    let type: String
    let materialId: String
    let area: Double

    enum CodingKeys: String, CodingKey {
        case type
        case materialId = "material_id"
        case area
    }
}
