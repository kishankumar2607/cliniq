//
//  VisitContainer.swift
//  cliniq
//
//  Created by Bibin Joseph on 2025-03-07.
//

import Foundation

// MARK: - VisitContainer
struct VisitContainer: Codable {
    let data: [Visit]
}

// MARK: - Datum
struct Visit: Codable {
    let visitID, clinicID: Int
    let visitDate, visitReason: String
    let visitNotes: [VisitNote]
    let prescriptions: [Prescription]
    let invoices: [Invoice]

    enum CodingKeys: String, CodingKey {
        case visitID = "visitId"
        case clinicID = "clinicId"
        case visitDate, visitReason, visitNotes, prescriptions, invoices
    }
}

// MARK: - Invoice
struct Invoice: Codable {
    let invoiceID, visitID, amount: Int
    let status, createdAt: String

    enum CodingKeys: String, CodingKey {
        case invoiceID = "invoice_id"
        case visitID = "visit_id"
        case amount, status
        case createdAt = "created_at"
    }
}

// MARK: - Prescription
struct Prescription: Codable {
    let prescriptionID, visitID: Int
    let medicineName, dosage, instructions, createdAt: String

    enum CodingKeys: String, CodingKey {
        case prescriptionID = "prescription_id"
        case visitID = "visit_id"
        case medicineName = "medicine_name"
        case dosage, instructions
        case createdAt = "created_at"
    }
}

// MARK: - VisitNote
struct VisitNote: Codable {
    let noteID, visitID: Int
    let note, createdAt: String

    enum CodingKeys: String, CodingKey {
        case noteID = "note_id"
        case visitID = "visit_id"
        case note
        case createdAt = "created_at"
    }
}
