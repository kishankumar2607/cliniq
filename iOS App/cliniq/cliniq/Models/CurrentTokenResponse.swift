//
//  CurrentTokenResponse.swift
//  cliniq
//
//  Created by Bibin Joseph on 2025-03-07.
//

import Foundation

// MARK: - CurrentTokenResponse
struct CurrentTokenContainer: Codable {
    let data: CurrentTokenResponse?
    let error: String?
}

// MARK: - DataClass
struct CurrentTokenResponse: Codable {
    let currentToken: Int
//    let upNextToken: Int

    enum CodingKeys: String, CodingKey {
        case currentToken = "current_token"
//        case upNextToken = "up_next_token"
    }
}
