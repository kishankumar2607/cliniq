//
//  GetTokenParam.swift
//  cliniq
//
//  Created by Bibin Joseph on 2025-03-07.
//

import Foundation

// MARK: - LoginResponse
struct GetTokenParam: Codable {
    let patientID: Int
    let visitDate: String
    let visitReason: String

    enum CodingKeys: String, CodingKey {
        case patientID = "patientId"
        case visitDate, visitReason
    }
}
