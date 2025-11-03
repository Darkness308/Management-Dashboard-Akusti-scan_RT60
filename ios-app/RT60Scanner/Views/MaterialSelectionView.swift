//
//  MaterialSelectionView.swift
//  RT60Scanner
//
//  Material-Auswahl View
//

import SwiftUI

struct MaterialSelectionView: View {
    @ObservedObject var viewModel: RoomInputViewModel
    let surfaceIndex: Int
    @Environment(\.dismiss) private var dismiss

    @State private var searchText = ""
    @State private var selectedCategory: String?

    var body: some View {
        List {
            // Kategorien
            Section("Kategorien") {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) {
                        CategoryButton(
                            title: "Alle",
                            isSelected: selectedCategory == nil
                        ) {
                            selectedCategory = nil
                        }

                        ForEach(uniqueCategories, id: \.self) { category in
                            CategoryButton(
                                title: category,
                                isSelected: selectedCategory == category
                            ) {
                                selectedCategory = category
                            }
                        }
                    }
                    .padding(.horizontal)
                }
                .listRowInsets(EdgeInsets())
            }

            // Materialien
            Section("Materialien") {
                ForEach(filteredMaterials) { material in
                    Button {
                        selectMaterial(material)
                    } label: {
                        MaterialCard(
                            material: material,
                            isSelected: material.id == currentMaterialId
                        )
                    }
                    .buttonStyle(.plain)
                }
            }
        }
        .navigationTitle("Material auswählen")
        .searchable(text: $searchText, prompt: "Material suchen")
    }

    // MARK: - Computed Properties

    private var currentMaterialId: String {
        guard viewModel.surfaces.indices.contains(surfaceIndex) else {
            return ""
        }
        return viewModel.surfaces[surfaceIndex].materialId
    }

    private var uniqueCategories: [String] {
        let categories = Set(viewModel.materials.map { $0.category })
        return Array(categories).sorted()
    }

    private var filteredMaterials: [Material] {
        var materials = viewModel.materials

        // Filter nach Kategorie
        if let category = selectedCategory {
            materials = materials.filter { $0.category == category }
        }

        // Filter nach Suchtext
        if !searchText.isEmpty {
            materials = materials.filter { material in
                material.name.localizedCaseInsensitiveContains(searchText) ||
                material.description.localizedCaseInsensitiveContains(searchText)
            }
        }

        return materials
    }

    // MARK: - Methods

    private func selectMaterial(_ material: Material) {
        viewModel.updateSurfaceMaterial(at: surfaceIndex, materialId: material.id)
        dismiss()
    }
}

/// Kategorie-Button
struct CategoryButton: View {
    let title: String
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.subheadline)
                .padding(.horizontal, 12)
                .padding(.vertical, 6)
                .background(isSelected ? Color.blue : Color.gray.opacity(0.2))
                .foregroundColor(isSelected ? .white : .primary)
                .cornerRadius(16)
        }
    }
}

/// Material-Karte
struct MaterialCard: View {
    let material: Material
    let isSelected: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(material.name)
                        .font(.headline)
                        .foregroundColor(.primary)

                    Text(material.category)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }

                Spacer()

                if isSelected {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundColor(.blue)
                        .font(.title2)
                }
            }

            Text(material.description)
                .font(.caption)
                .foregroundColor(.secondary)
                .lineLimit(2)

            HStack {
                AbsorptionBadge(alphaW: material.alphaW)

                Spacer()

                Text("NRC: \(String(format: "%.2f", material.nrc))")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
        .padding()
        .background(Color(.systemBackground))
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(isSelected ? Color.blue : Color.gray.opacity(0.3), lineWidth: 2)
        )
    }
}

/// Absorptions-Badge
struct AbsorptionBadge: View {
    let alphaW: Double

    var body: some View {
        HStack(spacing: 4) {
            Circle()
                .fill(badgeColor)
                .frame(width: 8, height: 8)

            Text("α_w: \(String(format: "%.2f", alphaW))")
                .font(.caption)
                .fontWeight(.medium)
        }
        .padding(.horizontal, 8)
        .padding(.vertical, 4)
        .background(badgeColor.opacity(0.2))
        .cornerRadius(8)
    }

    private var badgeColor: Color {
        if alphaW >= 0.80 {
            return .green
        } else if alphaW >= 0.40 {
            return .orange
        } else if alphaW >= 0.15 {
            return .yellow
        } else {
            return .red
        }
    }
}
