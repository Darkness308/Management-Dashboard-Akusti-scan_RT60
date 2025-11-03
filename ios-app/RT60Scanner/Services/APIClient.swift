//
//  APIClient.swift
//  RT60Scanner
//
//  REST API Client für Backend-Kommunikation
//

import Foundation

/// API Client für RT60 Backend
actor APIClient {
    // MARK: - Configuration

    /// Base URL des Backends
    private let baseURL: String

    /// URL Session für Netzwerk-Requests
    private let session: URLSession

    /// JSON Decoder mit snake_case Support
    private let decoder: JSONDecoder = {
        let decoder = JSONDecoder()
        decoder.keyDecodingStrategy = .convertFromSnakeCase
        return decoder
    }()

    /// JSON Encoder mit snake_case Support
    private let encoder: JSONEncoder = {
        let encoder = JSONEncoder()
        encoder.keyEncodingStrategy = .convertToSnakeCase
        return encoder
    }()

    // MARK: - Init

    init(baseURL: String = Constants.API.baseURL) {
        self.baseURL = baseURL
        self.session = URLSession.shared
    }

    // MARK: - API Endpoints

    /// Lädt alle verfügbaren Materialien
    func getMaterials(category: String? = nil) async throws -> [Material] {
        var urlString = "\(baseURL)/api/v1/materials"
        if let category = category {
            urlString += "?category=\(category.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? category)"
        }

        guard let url = URL(string: urlString) else {
            throw APIError.invalidURL
        }

        let (data, response) = try await session.data(from: url)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.invalidResponse
        }

        guard (200...299).contains(httpResponse.statusCode) else {
            throw APIError.httpError(statusCode: httpResponse.statusCode)
        }

        let materialsResponse = try decoder.decode(MaterialsResponse.self, from: data)
        return materialsResponse.materials
    }

    /// Lädt ein einzelnes Material nach ID
    func getMaterial(id: String) async throws -> Material {
        let urlString = "\(baseURL)/api/v1/materials/\(id)"

        guard let url = URL(string: urlString) else {
            throw APIError.invalidURL
        }

        let (data, response) = try await session.data(from: url)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.invalidResponse
        }

        guard (200...299).contains(httpResponse.statusCode) else {
            if httpResponse.statusCode == 404 {
                throw APIError.materialNotFound(id: id)
            }
            throw APIError.httpError(statusCode: httpResponse.statusCode)
        }

        return try decoder.decode(Material.self, from: data)
    }

    /// Berechnet RT60 für einen Raum
    func calculateRT60(request: RT60CalculationRequest) async throws -> RT60Result {
        let urlString = "\(baseURL)/api/v1/calculate"

        guard let url = URL(string: urlString) else {
            throw APIError.invalidURL
        }

        var urlRequest = URLRequest(url: url)
        urlRequest.httpMethod = "POST"
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        urlRequest.httpBody = try encoder.encode(request)

        let (data, response) = try await session.data(for: urlRequest)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.invalidResponse
        }

        guard (200...299).contains(httpResponse.statusCode) else {
            // Versuche Fehler-Details zu dekodieren
            if let errorResponse = try? decoder.decode(ErrorResponse.self, from: data) {
                throw APIError.serverError(message: errorResponse.detail)
            }
            throw APIError.httpError(statusCode: httpResponse.statusCode)
        }

        return try decoder.decode(RT60Result.self, from: data)
    }

    /// Lädt alle verfügbaren Material-Kategorien
    func getCategories() async throws -> [String] {
        let urlString = "\(baseURL)/api/v1/materials/categories"

        guard let url = URL(string: urlString) else {
            throw APIError.invalidURL
        }

        let (data, response) = try await session.data(from: url)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.invalidResponse
        }

        guard (200...299).contains(httpResponse.statusCode) else {
            throw APIError.httpError(statusCode: httpResponse.statusCode)
        }

        let categoriesResponse = try decoder.decode(CategoriesResponse.self, from: data)
        return categoriesResponse.categories
    }

    /// Health Check des Backends
    func healthCheck() async throws -> HealthResponse {
        let urlString = "\(baseURL)/health"

        guard let url = URL(string: urlString) else {
            throw APIError.invalidURL
        }

        let (data, response) = try await session.data(from: url)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.invalidResponse
        }

        guard (200...299).contains(httpResponse.statusCode) else {
            throw APIError.httpError(statusCode: httpResponse.statusCode)
        }

        return try decoder.decode(HealthResponse.self, from: data)
    }
}

// MARK: - Response Models

struct MaterialsResponse: Codable {
    let count: Int
    let materials: [Material]
}

struct CategoriesResponse: Codable {
    let categories: [String]
}

struct HealthResponse: Codable {
    let status: String
    let materialDatabase: Bool
    let materialCount: Int

    enum CodingKeys: String, CodingKey {
        case status
        case materialDatabase = "material_database"
        case materialCount = "material_count"
    }
}

struct ErrorResponse: Codable {
    let detail: String
}

// MARK: - API Errors

enum APIError: LocalizedError {
    case invalidURL
    case invalidResponse
    case httpError(statusCode: Int)
    case decodingError(Error)
    case materialNotFound(id: String)
    case serverError(message: String)
    case networkError(Error)

    var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "Ungültige URL"
        case .invalidResponse:
            return "Ungültige Server-Antwort"
        case .httpError(let statusCode):
            return "HTTP-Fehler: \(statusCode)"
        case .decodingError(let error):
            return "Fehler beim Dekodieren: \(error.localizedDescription)"
        case .materialNotFound(let id):
            return "Material '\(id)' nicht gefunden"
        case .serverError(let message):
            return "Server-Fehler: \(message)"
        case .networkError(let error):
            return "Netzwerk-Fehler: \(error.localizedDescription)"
        }
    }
}
