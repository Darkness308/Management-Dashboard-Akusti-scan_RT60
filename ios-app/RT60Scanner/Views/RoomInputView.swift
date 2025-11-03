//
//  RoomInputView.swift
//  RT60Scanner
//
//  Eingabe-View für Raumdimensionen und Materialien
//

import SwiftUI

struct RoomInputView: View {
    @ObservedObject var viewModel: RoomInputViewModel

    var body: some View {
        NavigationView {
            Form {
                // Raumdimensionen
                Section("Raumdimensionen") {
                    HStack {
                        Text("Länge")
                        Spacer()
                        TextField("m", value: $viewModel.room.length, format: .number)
                            .keyboardType(.decimalPad)
                            .multilineTextAlignment(.trailing)
                            .frame(width: 80)
                        Text("m")
                            .foregroundColor(.secondary)
                    }

                    HStack {
                        Text("Breite")
                        Spacer()
                        TextField("m", value: $viewModel.room.width, format: .number)
                            .keyboardType(.decimalPad)
                            .multilineTextAlignment(.trailing)
                            .frame(width: 80)
                        Text("m")
                            .foregroundColor(.secondary)
                    }

                    HStack {
                        Text("Höhe")
                        Spacer()
                        TextField("m", value: $viewModel.room.height, format: .number)
                            .keyboardType(.decimalPad)
                            .multilineTextAlignment(.trailing)
                            .frame(width: 80)
                        Text("m")
                            .foregroundColor(.secondary)
                    }

                    LabeledContent("Volumen", value: String(format: "%.1f m³", viewModel.room.volume))
                        .foregroundColor(.secondary)
                }

                // Raumnutzung
                Section("Raumnutzung") {
                    Picker("Typ", selection: $viewModel.room.usage) {
                        ForEach(RoomUsageType.allCases) { usage in
                            Text(usage.displayName).tag(usage)
                        }
                    }

                    HStack {
                        Text("Soll-RT60")
                        Spacer()
                        Text(String(format: "%.2f - %.2f s",
                                  viewModel.room.usage.targetRT60Range.lowerBound,
                                  viewModel.room.usage.targetRT60Range.upperBound))
                            .foregroundColor(.secondary)
                    }
                }

                // Oberflächen
                Section("Materialien") {
                    ForEach(Array(viewModel.surfaces.enumerated()), id: \.element.id) { index, surface in
                        NavigationLink {
                            MaterialSelectionView(
                                viewModel: viewModel,
                                surfaceIndex: index
                            )
                        } label: {
                            SurfaceRow(surface: surface, viewModel: viewModel)
                        }
                    }
                }

                // Fehler
                if let errorMessage = viewModel.errorMessage {
                    Section {
                        Text(errorMessage)
                            .foregroundColor(.red)
                            .font(.caption)
                    }
                }
            }
            .navigationTitle("RT60 Rechner")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Berechnen") {
                        Task {
                            viewModel.updateSurfaceAreas()
                            await viewModel.calculateRT60()
                        }
                    }
                    .disabled(viewModel.isLoading || !viewModel.room.isValid)
                }
            }
            .task {
                if viewModel.materials.isEmpty {
                    await viewModel.loadMaterials()
                }
            }
            .overlay {
                if viewModel.isLoading {
                    ProgressView()
                        .scaleEffect(1.5)
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                        .background(Color.black.opacity(0.2))
                }
            }
        }
    }
}

/// Oberflächen-Zeile
struct SurfaceRow: View {
    let surface: Surface
    @ObservedObject var viewModel: RoomInputViewModel

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(surface.type.displayName)
                .font(.headline)

            if let material = viewModel.material(for: surface.materialId) {
                Text(material.name)
                    .font(.subheadline)
                    .foregroundColor(.secondary)

                HStack {
                    Text(String(format: "%.1f m²", surface.area))
                    Spacer()
                    Text("α_w: \(String(format: "%.2f", material.alphaW))")
                }
                .font(.caption)
                .foregroundColor(.secondary)
            } else {
                Text("Material nicht gefunden")
                    .font(.caption)
                    .foregroundColor(.red)
            }
        }
        .padding(.vertical, 4)
    }
}
