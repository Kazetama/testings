# Informatic Management System & Event Portal

A modern, high-performance web application built with **Laravel 12**, **Inertia.js**, and **React**. This platform serves as a centralized hub for managing events, organization members, and blog content with a focus on SEO and user experience.

---

## 🚀 Tech Stack

### Backend
- **Framework:** Laravel 12 (PHP 8.2+)
- **Authentication:** Laravel Fortify (Session-based with 2FA support)
- **Data Exchange:** Inertia.js (Monolithic React experience)
- **Database:** MySQL
- **Library:** `league/csv` for high-speed data processing.

### Frontend
- **Framework:** React 18+
- **Styling:** Tailwind CSS (Vanilla CSS for custom components)
- **UI Components:** Shadcn UI (Radix UI Primitives)
- **Icons:** Lucide React
- **Animations:** Framer Motion / Tailwind Transitions

---

## 🛠️ Prerequisites

- **PHP:** >= 8.2
- **Node.js:** >= 18.x
- **Composer:** >= 2.x
- **Package Manager:** NPM or PNPM
- **Database:** MySQL 8.0+

---

## ⚙️ Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd informatic
   ```

2. **Install Dependencies**
   ```bash
   composer install
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
   *Note: Update `DB_DATABASE`, `DB_USERNAME`, and `DB_PASSWORD` in your `.env`.*

4. **Database Migration & Seeding**
   ```bash
   php artisan migrate --seed
   ```

5. **Symlink Storage**
   ```bash
   php artisan storage:link
   ```

6. **Run Development Servers**
   ```bash
   # Run Laravel server
   php artisan serve
   
   # Run Vite development server
   npm run dev
   ```

---

## 🏗️ Core Architecture & Features

### 1. Multi-Role Management
- **Superadmin:** Full system control, activity logs, and user management.
- **Admin:** Management of Events, Participants, and Blog/Articles.
- **Ketua (Chairman):** Specialized access to Member Management (Import/Export).
- **User:** Public profile and participation tracking.

### 2. Event Management System
- **Dynamic Forms:** Custom registration fields per event.
- **Capacity Control:** Automatic participant limits and progress tracking.
- **SEO Ready:** Individual SEO metadata (Meta Title, Description, Keywords) for every event.
- **Data Export:** Export participant lists to Excel/CSV for offline processing.

### 3. Member & Organization Management
- **Bulk Operations:** Efficiently import hundreds of members from CSV files.
- **Duplicate Protection:** Intelligent NIM validation during import.
- **Data Export:** Flexible member data extraction for organization reports.

### 4. Blog & Article Portal
- **Taxonomy:** Hierarchical Categories and Tagging system.
- **SEO Optimized:** Publicly accessible blog routes optimized for search engine indexing.
- **Slug Management:** Clean, SEO-friendly URLs.

---

## 🔒 Security & Performance

- **Inertia.js SSR:** Optimized for faster initial page loads and SEO.
- **N+1 Query Protection:** Eager loading relationships (Post -> Category/Tags).
- **Anti-Spam:** Device-based identification for event registrations.
- **2FA:** Built-in Two-Factor Authentication for sensitive roles.

---

## 📄 License
This project is proprietary and intended for internal use. All rights reserved.
