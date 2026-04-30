# Personal Vehicle Management API

A comprehensive RESTful API built with Express.js and MongoDB to help vehicle owners log repairs, track maintenance history, and monitor expenses over time.

## 🚗 Project Overview
Maintaining a vehicle's health can be difficult when records are scattered. This API provides a centralized system for users to manage their "Digital Management App," ensuring maintenance schedules are followed and costs are transparent.

### Core Features
*   **User Management:** Register owners and manage profiles.
*   **Vehicle Management:** Link multiple vehicles to a single user profile.
*   **Maintenance Record:** Full CRUD operations for service records including cost and mileage tracking.
*   **Advanced Queries:** Search by vehicle make, sort by year, and paginate through large service histories.

## 🛠️ Tech Stack
*   **Server:** Node.js & Express.js
*   **Database:** MongoDB & Mongoose
*   **Validation:** Mongoose Schema Validation
*   **Testing:** Postman

## 📊 Data Models
The API utilizes three related collections with `ObjectId` references to maintain data integrity:
1.  **Users:** Stores owner identity and references owned vehicles.
2.  **Vehicles:** Stores specific car details (VIN, Make, Model) and references the owner.
3.  **Records:** Detailed logs of service events linked to a specific vehicle.

## 👥 Team Contributions

| Member Name | Role | Implemented Components |
| :--- | :--- | :--- |
| **Khue Vo** | Lead Backend Developer | Initial Environment Config, Database Config (db.js), Initialize Models, Routes Set-ups, README|
| **Ethan Lukandwa** | Backend Developer | Repo Set-up, Refined Models, Routes Logic, Pagination and Filter Logic, Postman Collection Config |
| **John Mezeritski** | Backend Developer | Refine Route Logic, Error Handling, Refined Postman Collection |
| **Nathanael Agbemadon** | Backend Developer | Refined Postman Collection, README |


## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)
*   MongoDB Atlas Account

### Installation
1. Clone the repository:
   ```bash
   git clone <your-repo-url>
2.  Install Dependencies:
    ```bash
    npm install
3. Environment Setup:
    ```.env
    PORT=3000
    MONGO_URI=mongodb+srv://[username]:[password]@cluster.mongodb.net/personalVehicleManagement?retryWrites=true&w=majority
4. Run the Server:
    ```bash
    npm start
