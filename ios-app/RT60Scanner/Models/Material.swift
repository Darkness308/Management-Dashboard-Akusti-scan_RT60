//
//  Material.swift
//  RT60Scanner
//
//  Material mit Absorptionskoeffizienten
//

import Foundation

/// Material mit akustischen Eigenschaften
struct Material: Codable, Identifiable {
    let id: String
    let name: String
    let category: String
    let absorptionCoefficients: [String: Double]  // "125Hz": 0.01, etc.
    let alphaW: Double  // Bewerteter Absorptionsgrad
    let nrc: Double     // Noise Reduction Coefficient
    let description: String

    enum CodingKeys: String, CodingKey {
        case id
        case name
        case category
        case absorptionCoefficients = "absorption_coefficients"
        case alphaW = "alpha_w"
        case nrc
        case description
    }

    /// Gibt den Absorptionskoeffizienten für eine Frequenz zurück
    func alpha(at frequency: Int) -> Double? {
        return absorptionCoefficients["\(frequency)Hz"]
    }

    /// Durchschnittlicher Absorptionskoeffizient (500Hz & 1000Hz)
    var averageAlpha: Double {
        guard let alpha500 = alpha(at: 500),
              let alpha1000 = alpha(at: 1000) else {
            return alphaW
        }
        return (alpha500 + alpha1000) / 2.0
    }

    /// Klassifizierung nach Absorptionsgrad
    var absorptionClass: AbsorptionClass {
        if alphaW >= 0.80 {
            return .high
        } else if alphaW >= 0.40 {
            return .medium
        } else if alphaW >= 0.15 {
            return .low
        } else {
            return .minimal
        }
    }
}

/// Absorptionsklasse
enum AbsorptionClass: String {
    case high = "Hoch (α_w ≥ 0.80)"
    case medium = "Mittel (α_w ≥ 0.40)"
    case low = "Niedrig (α_w ≥ 0.15)"
    case minimal = "Minimal (α_w < 0.15)"

    var color: String {
        switch self {
        case .high: return "green"
        case .medium: return "orange"
        case .low: return "yellow"
        case .minimal: return "red"
        }
    }
}

/// Material-Kategorie für Filterung
enum MaterialCategory: String, CaseIterable {
    case walls = "Wände"
    case ceilings = "Decken"
    case floors = "Böden"
    case windows = "Fenster"
    case textiles = "Textilien"
    case furniture = "Möbel"
    case absorbers = "Absorber"
    case persons = "Personen"

    var icon: String {
        switch self {
        case .walls: return "rectangle.portrait"
        case .ceilings: return "rectangle"
        case .floors: return "square.grid.3x3"
        case .windows: return "rectangle.portrait.split.2x1"
        case .textiles: return "waveform"
        case .furniture: return "chair.fill"
        case .absorbers: return "speaker.wave.3"
        case .persons: return "person.fill"
        }
    }
}
