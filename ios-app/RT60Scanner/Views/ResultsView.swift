//
//  ResultsView.swift
//  RT60Scanner
//
//  Ergebnis-Anzeige für RT60-Berechnung
//

import SwiftUI
import Charts

struct ResultsView: View {
    let result: RT60Result

    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 20) {
                    // DIN 18041 Compliance
                    if let compliance = result.din18041Compliance {
                        ComplianceCard(compliance: compliance)
                    }

                    // Durchschnitts-RT60
                    AverageRT60Card(result: result)

                    // RT60 Frequenz-Chart
                    RT60ChartCard(result: result)

                    // Empfehlungen
                    if !result.recommendations.isEmpty {
                        RecommendationsCard(recommendations: result.recommendations)
                    }

                    // Details
                    DetailsCard(result: result)
                }
                .padding()
            }
            .navigationTitle("Ergebnisse")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {
                        // TODO: PDF-Export
                    } label: {
                        Image(systemName: "square.and.arrow.up")
                    }
                }
            }
        }
    }
}

/// Compliance-Karte
struct ComplianceCard: View {
    let compliance: DIN18041Compliance

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: statusIcon)
                    .font(.title2)
                    .foregroundColor(statusColor)

                Text(compliance.overallCompliant ? "DIN 18041 Konform" : "Nicht konform")
                    .font(.headline)

                Spacer()
            }

            if let avgRT60 = compliance.averageRT60 {
                Text("Durchschnitt: \(String(format: "%.2f s", avgRT60))")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }

            if let message = compliance.message {
                Text(message)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
        .padding()
        .background(statusColor.opacity(0.1))
        .cornerRadius(12)
    }

    private var statusIcon: String {
        compliance.overallCompliant ? "checkmark.circle.fill" : "xmark.circle.fill"
    }

    private var statusColor: Color {
        compliance.overallCompliant ? .green : .red
    }
}

/// Durchschnitts-RT60 Karte
struct AverageRT60Card: View {
    let result: RT60Result

    var body: some View {
        VStack(spacing: 12) {
            Text("Durchschnittliche Nachhallzeit")
                .font(.headline)

            Text(String(format: "%.2f s", result.averageRT60))
                .font(.system(size: 48, weight: .bold, design: .rounded))
                .foregroundColor(.blue)

            Text("(bei 500 Hz und 1000 Hz)")
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(radius: 2)
    }
}

/// RT60 Chart Karte
struct RT60ChartCard: View {
    let result: RT60Result

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("RT60 nach Frequenz")
                .font(.headline)

            Chart {
                ForEach(result.sortedFrequencies, id: \.self) { frequency in
                    if let rt60 = result.rt60(at: frequency) {
                        BarMark(
                            x: .value("Frequenz", "\(frequency) Hz"),
                            y: .value("RT60", rt60)
                        )
                        .foregroundStyle(Color.blue.gradient)
                    }
                }
            }
            .frame(height: 200)

            // Frequenz-Liste
            VStack(alignment: .leading, spacing: 8) {
                ForEach(result.sortedFrequencies, id: \.self) { frequency in
                    if let rt60 = result.rt60(at: frequency) {
                        HStack {
                            Text("\(frequency) Hz")
                                .font(.caption)
                                .frame(width: 80, alignment: .leading)

                            Text(String(format: "%.2f s", rt60))
                                .font(.caption.monospacedDigit())
                                .foregroundColor(.secondary)

                            Spacer()
                        }
                    }
                }
            }
            .padding(.top, 8)
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(radius: 2)
    }
}

/// Empfehlungen-Karte
struct RecommendationsCard: View {
    let recommendations: [String]

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: "lightbulb.fill")
                    .foregroundColor(.yellow)
                Text("Empfehlungen")
                    .font(.headline)
            }

            ForEach(recommendations, id: \.self) { recommendation in
                HStack(alignment: .top, spacing: 8) {
                    Text("•")
                    Text(recommendation)
                        .font(.subheadline)
                        .fixedSize(horizontal: false, vertical: true)
                }
            }
        }
        .padding()
        .background(Color.yellow.opacity(0.1))
        .cornerRadius(12)
    }
}

/// Details-Karte
struct DetailsCard: View {
    let result: RT60Result

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Details")
                .font(.headline)

            Divider()

            DetailRow(label: "Volumen", value: String(format: "%.1f m³", result.volume))
            DetailRow(label: "Oberfläche", value: String(format: "%.1f m²", result.totalSurfaceArea))
            DetailRow(label: "Formel", value: result.formulaUsed.capitalized)
        }
        .padding()
        .background(Color(.systemBackground))
        .cornerRadius(12)
        .shadow(radius: 2)
    }
}

/// Detail-Zeile
struct DetailRow: View {
    let label: String
    let value: String

    var body: some View {
        HStack {
            Text(label)
                .foregroundColor(.secondary)
            Spacer()
            Text(value)
                .fontWeight(.medium)
        }
        .font(.subheadline)
    }
}
