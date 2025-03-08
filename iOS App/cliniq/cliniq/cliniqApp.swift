//
//  cliniqApp.swift
//  cliniq
//
//  Created by Bibin Joseph on 2025-03-07.
//

import SwiftUI
import Supabase

@main
struct cliniqApp: App {
    @State private var isLoggedIn: Bool = false

    init() {
        NetworkManager.shared.setHostURL("http://10.192.33.132:3000/")
        checkLoginStatus()
    }

    var body: some Scene {
        WindowGroup {
            ViewTokenView(token: 10, clinicID: 1)
//            if isLoggedIn {
//                TabViewContainer(isLoggedIn: $isLoggedIn)
//                    .onAppear {
//                        checkLoginStatus()
//                    }
//            } else {
//                LoginView(isLoggedIn: $isLoggedIn)
//                    .onAppear {
//                        checkLoginStatus()
//                    }
//            }
        }
        
    }

    // Check if the user is logged in by verifying Keychain
    private func checkLoginStatus() {
        do {
            if let _ = try KeychainWrapper.shared.retrieve(forKey: "user", as: User.self) {
                isLoggedIn = true
            }
        } catch {
            print("Failed to retrieve user from Keychain: \(error.localizedDescription)")
        }
    }
    
    func initializeSupabase() {
        let supabase = SupabaseClient(
          supabaseURL: URL(string: "https://kktertzyftiivvdfkgua.supabase.co")!,
          supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrdGVydHp5ZnRpaXZ2ZGZrZ3VhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzMDA1MzcsImV4cCI6MjA1Njg3NjUzN30.2zKBqWgQKcUWTBoNOBd7Tj0fH9Xqw87alOoOWqMwy0M"
        )
    }
}
