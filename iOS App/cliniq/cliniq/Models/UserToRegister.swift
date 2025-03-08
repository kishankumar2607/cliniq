//
//  UserToRegister.swift
//  cliniq
//
//  Created by Bibin Joseph on 2025-03-07.
//

import Foundation

// MARK: - UserToRegister
struct UserToRegister: Codable {
    let firstName, lastName, dateOfBirth, gender: String
    let address, phoneNumber, email, password: String
    let healthCardNumber: String
    let isInternationalStudent: Bool
    let studentID, emergencyContactName, emergencyContactNumber, emergencyContactRelationship: String

    enum CodingKeys: String, CodingKey {
        case firstName, lastName, dateOfBirth, gender, address, phoneNumber, email, password, healthCardNumber, isInternationalStudent
        case studentID = "studentId"
        case emergencyContactName, emergencyContactNumber, emergencyContactRelationship
    }
}
