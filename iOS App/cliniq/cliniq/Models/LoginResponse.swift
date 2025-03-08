//
//  LoginResponse.swift
//  cliniq
//
//  Created by Bibin Joseph on 2025-03-07.
//

import Foundation

// MARK: - LoginResponse
struct LoginResponse: Codable {
    let data: User?
    let error: String?
}
