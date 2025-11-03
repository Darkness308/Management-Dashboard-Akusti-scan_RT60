//
//  RoomInputViewModel.swift
//  RT60Scanner
//
//  ViewModel für Raum-Eingabe und RT60-Berechnung
//

import Foundation
import SwiftUI

@MainActor
class RoomInputViewModel: ObservableObject {
    // MARK: - Published Properties

    @Published var room: Room
    @Published var surfaces: [Surface] = []
    @Published var materials: [Material] = []
    @Published var isLoading = false
    @Published var errorMessage: String?
    @Published var result: RT60Result?

    // MARK: - Private Properties

    private let apiClient: APIClient

    // MARK: - Init

    init(apiClient: APIClient = APIClient()) {
        self.apiClient = apiClient

        // Standard-Raum initialisieren
        let (length, width, height) = Constants.Defaults.defaultRoomSize
        self.room = Room(
            length: length,
            width: width,
            height: height,
            usage: Constants.Defaults.defaultUsage
        )

        // Standard-Oberflächen erstellen
        self.surfaces = [
            Surface(type: .floor, materialId: "mat_005", area: room.floorArea),
            Surface(type: .ceiling, materialId: "mat_004", area: room.ceilingArea),
            Surface(type: .walls, materialId: "mat_002", area: room.wallArea)
        ]
    }

    // MARK: - Methods

    /// Lädt Materialien vom Backend
    func loadMaterials() async {
        isLoading = true
        errorMessage = nil

        do {
            materials = try await apiClient.getMaterials()
        } catch {
            errorMessage = "Fehler beim Laden der Materialien: \(error.localizedDescription)"
        }

        isLoading = false
    }

    /// Berechnet RT60
    func calculateRT60() async {
        guard room.isValid else {
            errorMessage = "Ungültige Raumdimensionen"
            return
        }

        guard !surfaces.isEmpty else {
            errorMessage = "Mindestens eine Oberfläche muss definiert sein"
            return
        }

        isLoading = true
        errorMessage = nil
        result = nil

        do {
            let request = RT60CalculationRequest(
                room: RoomDimensions(
                    length: room.length,
                    width: room.width,
                    height: room.height
                ),
                surfaces: surfaces.map { surface in
                    SurfaceRequest(
                        type: surface.type.rawValue,
                        materialId: surface.materialId,
                        area: surface.area
                    )
                },
                targetUsage: room.usage.rawValue,
                useEyring: Constants.Defaults.defaultUseEyring
            )

            result = try await apiClient.calculateRT60(request: request)
        } catch let error as APIError {
            errorMessage = error.errorDescription
        } catch {
            errorMessage = "Unbekannter Fehler: \(error.localizedDescription)"
        }

        isLoading = false
    }

    /// Aktualisiert Flächengrößen wenn Raumdimensionen ändern
    func updateSurfaceAreas() {
        for i in surfaces.indices {
            switch surfaces[i].type {
            case .floor:
                surfaces[i].area = room.floorArea
            case .ceiling:
                surfaces[i].area = room.ceilingArea
            case .walls:
                surfaces[i].area = room.wallArea
            default:
                break
            }
        }
    }

    /// Fügt eine neue Oberfläche hinzu
    func addSurface(type: SurfaceType, materialId: String, area: Double) {
        let surface = Surface(type: type, materialId: materialId, area: area)
        surfaces.append(surface)
    }

    /// Entfernt eine Oberfläche
    func removeSurface(at index: Int) {
        guard surfaces.indices.contains(index) else { return }
        surfaces.remove(at: index)
    }

    /// Aktualisiert Material einer Oberfläche
    func updateSurfaceMaterial(at index: Int, materialId: String) {
        guard surfaces.indices.contains(index) else { return }
        surfaces[index].materialId = materialId
    }

    /// Gibt Material für eine Material-ID zurück
    func material(for id: String) -> Material? {
        return materials.first { $0.id == id }
    }
}
