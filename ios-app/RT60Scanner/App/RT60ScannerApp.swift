//
//  RT60ScannerApp.swift
//  RT60Scanner
//
//  Main App Entry Point
//

import SwiftUI

@main
struct RT60ScannerApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}

/// Main Content View - Tab-basierte Navigation
struct ContentView: View {
    @StateObject private var viewModel = RoomInputViewModel()

    var body: some View {
        TabView {
            RoomInputView(viewModel: viewModel)
                .tabItem {
                    Label("Eingabe", systemImage: "square.and.pencil")
                }

            if let result = viewModel.result {
                ResultsView(result: result)
                    .tabItem {
                        Label("Ergebnisse", systemImage: "chart.bar.fill")
                    }
            }

            SettingsView()
                .tabItem {
                    Label("Einstellungen", systemImage: "gearshape")
                }
        }
    }
}

/// Settings View (Placeholder)
struct SettingsView: View {
    @AppStorage("apiBaseURL") private var apiBaseURL = Constants.API.baseURL
    @AppStorage("useEyring") private var useEyring = Constants.Defaults.defaultUseEyring

    var body: some View {
        NavigationView {
            Form {
                Section("Backend") {
                    TextField("API Base URL", text: $apiBaseURL)
                        .autocapitalization(.none)
                        .keyboardType(.URL)

                    Button("Test Verbindung") {
                        Task {
                            await testConnection()
                        }
                    }
                }

                Section("Berechnungseinstellungen") {
                    Toggle("Eyring-Formel verwenden", isOn: $useEyring)
                    Text("Bei hoher Absorption (α > 0.3) verwenden")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }

                Section("App Info") {
                    LabeledContent("Version", value: "0.1.0")
                    LabeledContent("Build", value: "1")
                }
            }
            .navigationTitle("Einstellungen")
        }
    }

    private func testConnection() async {
        let client = APIClient(baseURL: apiBaseURL)
        do {
            let health = try await client.healthCheck()
            print("✅ Backend erreichbar: \(health.status)")
        } catch {
            print("❌ Backend nicht erreichbar: \(error.localizedDescription)")
        }
    }
}
