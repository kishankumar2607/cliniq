//
//  User.swift
//  cliniq
//
//  Created by Bibin Joseph on 2025-03-07.
//

// This file was generated from JSON Schema using quicktype, do not modify it directly.
// To parse the JSON, add this file to your project and do:
//
//   let user = try? JSONDecoder().decode(User.self, from: jsonData)

import Foundation

// MARK: - User
struct UserContainer: Codable {
    let data: [User]
    var user: User? { data.first }
}

// MARK: - Datum
struct User: Codable {
    let patientID: Int
    let firstName, lastName, dateOfBirth, gender: String
    let address, phoneNumber, email, healthCardNumber: String
    let isInternationalStudent: Bool
    let studentID, emergencyContactName, emergencyContactRelationship, emergencyContactNumber: String
    let createdAt: String
    let userID: String?

    enum CodingKeys: String, CodingKey {
        case patientID = "patientId"
        case firstName, lastName, dateOfBirth, gender, address, phoneNumber, email, healthCardNumber, isInternationalStudent
        case studentID = "studentId"
        case emergencyContactName, emergencyContactRelationship, emergencyContactNumber, createdAt
        case userID = "userId"
    }
}
