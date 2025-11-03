//
//  Constants.swift
//  RT60Scanner
//
//  App-weite Konstanten
//

import Foundation
import SwiftUI

enum Constants {
    // MARK: - API

    enum API {
        /// Backend Base URL
        ///
        /// **Development:** Lokales Backend
        /// - Simulator: http://127.0.0.1:8000
        /// - Gerät im gleichen Netzwerk: http://192.168.x.x:8000
        ///
        /// **Production:** Deployed Backend
        /// - https://api.rt60-app.com
        static let baseURL = "http://127.0.0.1:8000"

        /// Request Timeout
        static let timeout: TimeInterval = 30.0
    }

    // MARK: - UI

    enum UI {
        /// Standard Padding
        static let padding: CGFloat = 16.0

        /// Corner Radius
        static let cornerRadius: CGFloat = 12.0

        /// Card Spacing
        static let cardSpacing: CGFloat = 12.0
    }

    // MARK: - DIN 18041

    enum DIN18041 {
        /// Relevante Frequenzen für DIN 18041 (500 Hz, 1000 Hz)
        static let relevantFrequencies: [Int] = [500, 1000]

        /// Alle Oktavbänder
        static let allFrequencies: [Int] = [125, 250, 500, 1000, 2000, 4000]

        /// Toleranz für RT60-Abweichungen (±0.1s)
        static let tolerance: Double = 0.1
    }

    // MARK: - Limits

    enum Limits {
        /// Maximale Raumdimension (m)
        static let maxRoomDimension: Double = 100.0

        /// Minimale Raumdimension (m)
        static let minRoomDimension: Double = 1.0

        /// Maximale Anzahl an Oberflächen
        static let maxSurfaces: Int = 20
    }

    // MARK: - Defaults

    enum Defaults {
        /// Standard-Raumgröße (m)
        static let defaultRoomSize = (length: 10.0, width: 8.0, height: 3.0)

        /// Standard-Raumnutzung
        static let defaultUsage: RoomUsageType = .office

        /// Standard-Formel
        static let defaultUseEyring = false
    }
}
