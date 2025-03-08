//
//  TabViewContainer.swift
//  cliniq
//
//  Created by Bibin Joseph on 2025-03-07.
//
import SwiftUI

struct TabViewContainer: View {
    @Binding var isLoggedIn: Bool // Binding to control login state
    
    var body: some View {
        TabView {
            // Clinics Tab
            ClinicsView()
                .tabItem {
                    Image(systemName: "house.fill")
                    Text("Clinics")
                }
            
            // Visits Tab
            VisitsView()
                .tabItem {
                    Image(systemName: "calendar")
                    Text("Visits")
                }
        }
        .navigationBarBackButtonHidden(true) // Hide the back button
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Button(action: logout) {
                    Text("Logout")
                        .foregroundColor(.red)
                }
            }
        }
    }
    
    // MARK: - Logout Function
    
    private func logout() {
        do {
            try KeychainWrapper.shared.delete(forKey: "user")
            isLoggedIn = false // Navigate back to LoginView
        } catch {
            print("Failed to delete user from Keychain: \(error.localizedDescription)")
        }
    }
}

#Preview {
    TabViewContainer(isLoggedIn: .constant(true))
}
