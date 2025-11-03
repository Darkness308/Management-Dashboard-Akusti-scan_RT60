//
//  Room.swift
//  RT60Scanner
//
//  Raum-Datenmodell mit Dimensionen und Flächen
//

import Foundation

/// Raum mit Dimensionen für RT60-Berechnung
struct Room: Codable, Identifiable {
    let id: UUID
    var length: Double  // Länge in Metern
    var width: Double   // Breite in Metern
    var height: Double  // Höhe in Metern
    var name: String?
    var usage: RoomUsageType

    init(
        id: UUID = UUID(),
        length: Double,
        width: Double,
        height: Double,
        name: String? = nil,
        usage: RoomUsageType = .office
    ) {
        self.id = id
        self.length = length
        self.width = width
        self.height = height
        self.name = name
        self.usage = usage
    }

    /// Berechnet das Raumvolumen in m³
    var volume: Double {
        return length * width * height
    }

    /// Berechnet die Bodenfläche in m²
    var floorArea: Double {
        return length * width
    }

    /// Berechnet die Deckenfläche in m²
    var ceilingArea: Double {
        return length * width
    }

    /// Berechnet die Wandfläche in m²
    var wallArea: Double {
        return 2 * (length * height) + 2 * (width * height)
    }

    /// Gesamtoberfläche in m²
    var totalSurfaceArea: Double {
        return floorArea + ceilingArea + wallArea
    }

    /// Validiert ob Raumdimensionen gültig sind
    var isValid: Bool {
        return length > 0 && width > 0 && height > 0
    }
}

/// Raumnutzungstyp nach DIN 18041
enum RoomUsageType: String, Codable, CaseIterable, Identifiable {
    case classroom = "classroom"
    case lectureHall = "lecture_hall"
    case conference = "conference"
    case office = "office"
    case concertHall = "concert_hall"
    case opera = "opera"
    case theater = "theater"
    case recordingStudio = "recording_studio"
    case broadcastStudio = "broadcast_studio"
    case sportsHall = "sports_hall"
    case restaurant = "restaurant"
    case callCenter = "call_center"

    var id: String { rawValue }

    var displayName: String {
        switch self {
        case .classroom: return "Klassenraum"
        case .lectureHall: return "Hörsaal"
        case .conference: return "Konferenzraum"
        case .office: return "Büro"
        case .concertHall: return "Konzertsaal"
        case .opera: return "Opernhaus"
        case .theater: return "Theater"
        case .recordingStudio: return "Aufnahmestudio"
        case .broadcastStudio: return "Sendestudio"
        case .sportsHall: return "Sporthalle"
        case .restaurant: return "Restaurant"
        case .callCenter: return "Call Center"
        }
    }

    /// DIN 18041 Soll-RT60-Bereich
    var targetRT60Range: ClosedRange<Double> {
        switch self {
        case .classroom: return 0.6...0.8
        case .lectureHall: return 0.7...1.0
        case .conference: return 0.5...0.8
        case .office: return 0.35...0.55
        case .concertHall: return 1.5...2.5
        case .opera: return 1.3...1.8
        case .theater: return 0.8...1.2
        case .recordingStudio: return 0.2...0.4
        case .broadcastStudio: return 0.25...0.35
        case .sportsHall: return 1.5...2.0
        case .restaurant: return 0.5...0.8
        case .callCenter: return 0.3...0.5
        }
    }
}

/// Oberfläche mit Material
struct Surface: Codable, Identifiable {
    let id: UUID
    var type: SurfaceType
    var materialId: String
    var area: Double  // m²

    init(id: UUID = UUID(), type: SurfaceType, materialId: String, area: Double) {
        self.id = id
        self.type = type
        self.materialId = materialId
        self.area = area
    }
}

/// Oberflächentyp
enum SurfaceType: String, Codable {
    case floor = "floor"
    case ceiling = "ceiling"
    case walls = "walls"
    case window = "window"
    case door = "door"

    var displayName: String {
        switch self {
        case .floor: return "Boden"
        case .ceiling: return "Decke"
        case .walls: return "Wände"
        case .window: return "Fenster"
        case .door: return "Tür"
        }
    }
}
