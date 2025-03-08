import Foundation
import Supabase

class SupabaseService {
    private var activeChannel: RealtimeChannelV2?
    private let supabase = SupabaseClient(
        supabaseURL: URL(string: "https://kktertzyftiivvdfkgua.supabase.co")!,
        supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrdGVydHp5ZnRpaXZ2ZGZrZ3VhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzMDA1MzcsImV4cCI6MjA1Njg3NjUzN30.2zKBqWgQKcUWTBoNOBd7Tj0fH9Xqw87alOoOWqMwy0M"
    )
    
    func observeClinicQueueStatus(clinicID: Int, completion: @escaping (Int?, Int?) -> Void) async {
        // Remove previous subscription if it exists
        if let activeChannel = activeChannel {
            print("ℹ️ Removing previous subscription")
            await supabase.realtimeV2.removeChannel(activeChannel)
        }
        
        let channel = supabase.realtimeV2.channel("testchannel")
        
        let _ = channel.onPostgresChange(UpdateAction.self) { message in
            print("✏️ Row updated in 'clinicqueuestatus': \(message)")
            if let data = message.rawMessage.payload["record"] as? [String: Any] {
                let currentToken = data["current_token"] as? Int
                let upNextToken = data["up_next_token"] as? Int
                completion(currentToken, upNextToken)
            }
        }
        
        await channel.subscribe()

        activeChannel = channel
    }
}
