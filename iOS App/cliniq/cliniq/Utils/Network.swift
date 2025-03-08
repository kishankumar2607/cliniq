//
//  Network.swift
//  cliniq
//
//  Created by Bibin Joseph on 2025-03-07.
//

import Foundation

class NetworkManager {
    
    // MARK: - Properties
    
    static let shared = NetworkManager()
    private var hostURL: String = "http://10.192.33.132:3000/" // Set your default host URL here
    
    // MARK: - Initialization
    
    private init() {}
    
    // MARK: - Configuration
    
    func setHostURL(_ url: String) {
        self.hostURL = url
    }
    
    // MARK: - GET Request
    
    func get<T: Codable>(endpoint: String, completion: @escaping (Result<T, Error>) -> Void) {
        guard let url = URL(string: "\(hostURL)/\(endpoint)") else {
            print("❌ Invalid URL: \(hostURL)/\(endpoint)")
            completion(.failure(NetworkError.invalidURL))
            return
        }
        
        print("🌐 Sending GET Request to: \(url.absoluteString)")
        
        let task = URLSession.shared.dataTask(with: url) { data, response, error in
            if let error = error {
                print("❌ GET Request Failed: \(error.localizedDescription)")
                completion(.failure(error))
                return
            }
            
            guard let httpResponse = response as? HTTPURLResponse else {
                print("❌ Invalid Response: No HTTPURLResponse")
                completion(.failure(NetworkError.noData))
                return
            }
            
            print("📥 Response Status Code: \(httpResponse.statusCode)")
            print("📥 Response Headers: \(httpResponse.allHeaderFields)")
            
            guard let data = data else {
                print("❌ No Data Received")
                completion(.failure(NetworkError.noData))
                return
            }
            
            do {
                let decodedObject = try JSONDecoder().decode(T.self, from: data)
                print("✅ GET Request Succeeded")
                print("📦 Response Data: \(String(data: try! JSONEncoder().encode(decodedObject), encoding: .utf8)!)")
                completion(.success(decodedObject))
            } catch {
                print("❌ Decoding Failed: \(error.localizedDescription)")
                
                // Attempt to parse the data as a dictionary
                do {
                    if let json = try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any] {
                        print("📦 Fallback Response Data (Dictionary): \(json)")
                    } else {
                        print("❌ Invalid JSON Format")
                    }
                } catch {
                    print("❌ JSON Parsing Failed: \(error.localizedDescription)")
                }
                
                completion(.failure(error))
            }
        }
        
        task.resume()
    }
    
    func get(endpoint: String, completion: @escaping (Result<[String: Any], Error>) -> Void) {
        guard let url = URL(string: "\(hostURL)/\(endpoint)") else {
            print("❌ Invalid URL: \(hostURL)/\(endpoint)")
            completion(.failure(NetworkError.invalidURL))
            return
        }
        
        print("🌐 Sending GET Request to: \(url.absoluteString)")
        
        let task = URLSession.shared.dataTask(with: url) { data, response, error in
            if let error = error {
                print("❌ GET Request Failed: \(error.localizedDescription)")
                completion(.failure(error))
                return
            }
            
            guard let httpResponse = response as? HTTPURLResponse else {
                print("❌ Invalid Response: No HTTPURLResponse")
                completion(.failure(NetworkError.noData))
                return
            }
            
            print("📥 Response Status Code: \(httpResponse.statusCode)")
            print("📥 Response Headers: \(httpResponse.allHeaderFields)")
            
            guard let data = data else {
                print("❌ No Data Received")
                completion(.failure(NetworkError.noData))
                return
            }
            
            do {
                if let json = try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any] {
                    print("✅ GET Request Succeeded")
                    print("📦 Response Data: \(json)")
                    completion(.success(json))
                } else {
                    print("❌ Invalid JSON Format")
                    completion(.failure(NetworkError.invalidJSON))
                }
            } catch {
                print("❌ JSON Parsing Failed: \(error.localizedDescription)")
                completion(.failure(error))
            }
        }
        
        task.resume()
    }
    
    // MARK: - POST Request
    
    func post<T: Codable, U: Encodable>(endpoint: String, body: U, completion: @escaping (Result<T, Error>) -> Void) {
        guard let url = URL(string: "\(hostURL)/\(endpoint)") else {
            print("❌ Invalid URL: \(hostURL)/\(endpoint)")
            completion(.failure(NetworkError.invalidURL))
            return
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        do {
            let jsonData = try JSONEncoder().encode(body)
            request.httpBody = jsonData
            print("🌐 Sending POST Request to: \(url.absoluteString)")
            print("📤 Request Body: \(String(data: jsonData, encoding: .utf8)!)")
        } catch {
            print("❌ Encoding Failed: \(error.localizedDescription)")
            completion(.failure(error))
            return
        }
        
        let task = URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                print("❌ POST Request Failed: \(error.localizedDescription)")
                completion(.failure(error))
                return
            }
            
            guard let httpResponse = response as? HTTPURLResponse else {
                print("❌ Invalid Response: No HTTPURLResponse")
                completion(.failure(NetworkError.noData))
                return
            }
            
            print("📥 Response Status Code: \(httpResponse.statusCode)")
            print("📥 Response Headers: \(httpResponse.allHeaderFields)")
            
            guard let data = data else {
                print("❌ No Data Received")
                completion(.failure(NetworkError.noData))
                return
            }
            
            do {
                let decodedObject = try JSONDecoder().decode(T.self, from: data)
                print("✅ POST Request Succeeded")
                print("📦 Response Data: \(String(data: try! JSONEncoder().encode(decodedObject), encoding: .utf8)!)")
                completion(.success(decodedObject))
            } catch {
                print("❌ Decoding Failed: \(error.localizedDescription)")
                
                // Attempt to parse the data as a dictionary
                do {
                    if let json = try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any] {
                        print("📦 Fallback Response Data (Dictionary): \(json)")
                    } else {
                        print("❌ Invalid JSON Format")
                    }
                } catch {
                    print("❌ JSON Parsing Failed: \(error.localizedDescription)")
                }
                
                completion(.failure(error))
            }
        }
        
        task.resume()
    }
    
    func post<U: Encodable>(endpoint: String, body: U, completion: @escaping (Result<[String: Any], Error>) -> Void) {
        guard let url = URL(string: "\(hostURL)/\(endpoint)") else {
            print("❌ Invalid URL: \(hostURL)/\(endpoint)")
            completion(.failure(NetworkError.invalidURL))
            return
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        do {
            let jsonData = try JSONEncoder().encode(body)
            request.httpBody = jsonData
            print("🌐 Sending POST Request to: \(url.absoluteString)")
            print("📤 Request Body: \(String(data: jsonData, encoding: .utf8)!)")
        } catch {
            print("❌ Encoding Failed: \(error.localizedDescription)")
            completion(.failure(error))
            return
        }
        
        let task = URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                print("❌ POST Request Failed: \(error.localizedDescription)")
                completion(.failure(error))
                return
            }
            
            guard let httpResponse = response as? HTTPURLResponse else {
                print("❌ Invalid Response: No HTTPURLResponse")
                completion(.failure(NetworkError.noData))
                return
            }
            
            print("📥 Response Status Code: \(httpResponse.statusCode)")
            print("📥 Response Headers: \(httpResponse.allHeaderFields)")
            
            guard let data = data else {
                print("❌ No Data Received")
                completion(.failure(NetworkError.noData))
                return
            }
            
            do {
                if let json = try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any] {
                    print("✅ POST Request Succeeded")
                    print("📦 Response Data: \(json)")
                    completion(.success(json))
                } else {
                    print("❌ Invalid JSON Format")
                    completion(.failure(NetworkError.invalidJSON))
                }
            } catch {
                print("❌ JSON Parsing Failed: \(error.localizedDescription)")
                completion(.failure(error))
            }
        }
        
        task.resume()
    }
    
    // MARK: - Error Handling
    
    enum NetworkError: Error {
        case invalidURL
        case noData
        case invalidJSON
    }
}
