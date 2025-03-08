//
//  ClinicContainer.swift
//  cliniq
//
//  Created by Bibin Joseph on 2025-03-07.
//

import Foundation

// MARK: - Clinic
struct ClinicContainer: Codable {
    let data: [Clinic]
}

// MARK: - Datum
struct Clinic: Codable, Identifiable {
    let id = UUID()
    let clinicID: Int
    let name, address, phone: String

    enum CodingKeys: String, CodingKey {
        case clinicID = "clinic_id"
        case name, address, phone
    }
}
