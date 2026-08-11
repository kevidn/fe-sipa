# SIPA Frontend (Sistem Informasi Pelayanan Akademik)

This repository contains the frontend application for SIPA, a comprehensive academic and administrative information system designed to digitize and streamline university workflows. Built with Next.js and TypeScript, the platform serves multiple user roles with tailored dashboards and secure access control.

## 🚀 Key Features

- **Role-Based Access Control (RBAC):** Isolated dashboards and routing for different user types:
  - **Admin:** System settings, user management, global logs, and holiday scheduling.
  - **Kaprodi (Head of Program):** Student monitoring, violation tracking (pelanggaran), and multi-level document approvals.
  - **Tendik (Educational Staff):** Queue management (antrian), document verification, and administrative letter generation (surat).
  - **Mahasiswa (Students):** Submission of academic requests (pengajuan) and real-time status tracking.
- **Secure Authentication Flow:** Complete login, registration, password recovery, and reset modules.
- **Document & Queue Management:** Digital handling of student requests, verified step-by-step by the educational staff.

## 🛠 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** CSS / Tailwind CSS (configured with PostCSS)
- **Linting & Formatting:** ESLint

## 📂 Project Structure

The project follows a standard Next.js App Router structure with customized route groups for role isolation:

```text
├── app/
│   ├── (dashboard)/      # Protected routes segmented by role
│   │   ├── admin/        # Admin dashboard
│   │   ├── kaprodi/      # Head of Program dashboard
│   │   ├── mahasiswa/    # Student dashboard
│   │   └── tendik/       # Staff dashboard
│   ├── login/            # Auth pages
│   ├── register/         # Registration pages
│   └── ...
├── components/           # Reusable UI components (Sidebar, Navbar, CustomSelect, etc.)
├── hooks/                # Custom React hooks (e.g., useBodyScrollLock)
└── utils/                # Utility functions and helpers (e.g., printKitir)
## 💻 Getting Started

To get this project up and running locally, follow these steps:

### Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (v18 or higher recommended).

### Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/yourusername/fe-sipa.git](https://github.com/yourusername/fe-sipa.git)
   cd fe-sipa
   ```

2. Install the dependencies[cite: 2]:
   ```bash
   npm install
   # or yarn install / pnpm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and configure your API endpoints and other secrets.
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   # Add other required variables here
   ```

4. Start the development server[cite: 2]:
   ```bash
   npm run dev
   # or yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
