//
//  KeychainWrapper.swift
//  cliniq
//
//  Created by Bibin Joseph on 2025-03-07.
//

import Foundation
import Security

class KeychainWrapper {
    static let shared = KeychainWrapper()
    private let service = "com.bibintomj.cliniq"
    
    private init() {}
    
    // Save a Codable object to Keychain
    func save<T: Codable>(_ item: T, forKey key: String) throws {
        let data = try JSONEncoder().encode(item)
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: key,
            kSecValueData as String: data
        ]
        
        // Delete existing item if it exists
        SecItemDelete(query as CFDictionary)
        
        // Add new item
        let status = SecItemAdd(query as CFDictionary, nil)
        guard status == errSecSuccess else {
            throw KeychainError.unhandledError(status: status)
        }
    }
    
    // Retrieve a Codable object from Keychain
    func retrieve<T: Codable>(forKey key: String, as type: T.Type) throws -> T? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: key,
            kSecReturnData as String: kCFBooleanTrue!,
            kSecMatchLimit as String: kSecMatchLimitOne
        ]
        
        var data: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &data)
        
        guard status == errSecSuccess, let itemData = data as? Data else {
            if status == errSecItemNotFound {
                return nil
            } else {
                throw KeychainError.unhandledError(status: status)
            }
        }
        
        return try JSONDecoder().decode(type, from: itemData)
    }
    
    // Delete an item from Keychain
    func delete(forKey key: String) throws {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: key
        ]
        
        let status = SecItemDelete(query as CFDictionary)
        guard status == errSecSuccess || status == errSecItemNotFound else {
            throw KeychainError.unhandledError(status: status)
        }
    }
    
    enum KeychainError: Error {
        case unhandledError(status: OSStatus)
    }
}
