# SIPA Frontend (Sistem Informasi Pelayanan Akademik)

This repository contains the frontend application for SIPA, a comprehensive academic and administrative information system designed to digitize and streamline university workflows[cite: 2]. Built with Next.js and TypeScript, the platform serves multiple user roles with tailored dashboards and secure access control[cite: 2].

## 🚀 Key Features

- **Role-Based Access Control (RBAC):** Isolated dashboards and routing for different user types[cite: 2]:
  - **Admin:** System settings, user management, global logs, and holiday scheduling[cite: 2].
  - **Kaprodi (Head of Program):** Student monitoring, violation tracking (pelanggaran), and multi-level document approvals[cite: 2].
  - **Tendik (Educational Staff):** Queue management (antrian), document verification, and administrative letter generation (surat)[cite: 2].
  - **Mahasiswa (Students):** Submission of academic requests (pengajuan) and real-time status tracking[cite: 2].
- **Secure Authentication Flow:** Complete login, registration, password recovery, and reset modules[cite: 2].
- **Document & Queue Management:** Digital handling of student requests, verified step-by-step by the educational staff[cite: 2].

## 🛠 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)[cite: 2]
- **Language:** TypeScript[cite: 2]
- **Styling:** CSS / Tailwind CSS (configured with PostCSS)[cite: 2]
- **Linting & Formatting:** ESLint[cite: 2]

## 📂 Project Structure

The project follows a standard Next.js App Router structure with customized route groups for role isolation[cite: 2]:

```text
├── app/
│   ├── (dashboard)/      # Protected routes segmented by role[cite: 2]
│   │   ├── admin/        # Admin dashboard[cite: 2]
│   │   ├── kaprodi/      # Head of Program dashboard[cite: 2]
│   │   ├── mahasiswa/    # Student dashboard[cite: 2]
│   │   └── tendik/       # Staff dashboard[cite: 2]
│   ├── login/            # Auth pages[cite: 2]
│   ├── register/         # Registration pages[cite: 2]
│   └── ...
├── components/           # Reusable UI components (Sidebar, Navbar, CustomSelect, etc.)[cite: 2]
├── hooks/                # Custom React hooks (e.g., useBodyScrollLock)[cite: 2]
└── utils/                # Utility functions and helpers (e.g., printKitir)[cite: 2]
```

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
