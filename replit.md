# Social Ads Expert - Client Management System

## Overview
This project is a production-ready **Social Ads Expert** application, a comprehensive client management system designed for Facebook marketing agencies. Its primary purpose is to streamline client operations, financial tracking, and marketing performance monitoring. Key capabilities include multi-language support (Bengali), robust client management, detailed financial tracking, integration of Facebook marketing metrics, invoice generation with PDF support, and a dedicated client portal. The business vision is to provide agencies with a powerful, all-in-one platform to efficiently manage their clients and services, enhancing productivity and client satisfaction.

## User Preferences
- None specified yet

## System Architecture

### UI/UX Decisions
The application features full dark/light theme support and provides a complete Bengali language UI. PDF generation for invoices also includes Bengali font support using Noto Sans Bengali.

### Technical Implementations
- **Backend**: Developed with Node.js and Express.
- **Frontend**: A pre-built React application, located in `dist/public/`.
- **Database**: Utilizes PostgreSQL, specifically configured for Neon-backed deployment.
- **ORM**: Drizzle ORM is used for database interactions.
- **PDF Generation**: Implemented using PDFKit with bundled Bengali font support.
- **Session Management**: `express-session` is used with a PostgreSQL store for session persistence.
- **Pre-built Package**: The application is provided as a pre-built production package, meaning no build step is required for deployment; all frontend and backend assets are pre-compiled and ready to run.

### Feature Specifications
1.  **Client Management**: Comprehensive tools for tracking client information, status, and categorization.
2.  **Financial Tracking**: 
    - **Transaction History (লেনদেন ইতিহাস)**: Shows ONLY admin top-ups with + signs (+100, +200). FB marketing expenses are NOT shown here.
    - **Balance Calculation**: Top-ups add to balance, FB marketing daily spend auto-deducts from balance without creating transaction records.
    - **Separate Tracking**: Transaction history and FB marketing records are kept completely separate.
3.  **Facebook Marketing Integration**: Tracks daily spend, reach, and sales metrics for Facebook ad campaigns. Supports multiple records per client, automatic balance deduction on spend (without transaction records), and pagination. FB marketing section shows ONLY daily spend records, separate from transaction history.
4.  **Invoice Generation**: Generates PDF invoices with support for Bengali fonts.
5.  **Client Portal**: Each client receives a unique portal link (auto-generated UUID) for read-only access to their data including:
    - Current balance (বর্তমান ব্যালেন্স)
    - Total top-ups (মোট টপ-আপ) - sum of all admin top-ups
    - Transaction history (last 10 top-ups only, with + formatting)
    - Invoices
    - Facebook marketing metrics (last 10 daily spend records)
    - Website details and offers
6.  **Dashboard Statistics**:
    - Total clients, active clients
    - Total balance across all clients
    - Total ad spend
    - Monthly Revenue (মাসিক আয়) - shows total top-ups for current month only
7.  **Quick Messages**: Allows saving of frequently used messages, payment details, addresses, and contacts.
8.  **Tagging System**: Enables organization of clients using custom tags.
9.  **Multi-language Support**: Full UI support for Bengali language.

### System Design Choices
- **Directory Structure**: Organized with a `dist/` folder for built output, `shared/` for common schemas, and standard project files.
- **Environment Configuration**: Uses `DATABASE_URL`, `SESSION_SECRET`, `NODE_ENV`, and `PORT` environment variables.
- **Deployment**: Designed for Replit autoscale deployment, running on Node.js 18+ with PostgreSQL.
- **Database Schema**: Includes tables for `clients`, `facebook_marketing`, `website_details`, `transactions`, `invoices`, `tags`, `client_tags`, `offers`, `campaign_titles`, and `quick_messages`.
- **Security**: Relies on Replit for environment secret management, stores session data in PostgreSQL, and uses SSL/TLS for remote database connections. Portal IDs are UUIDs, providing read-only access without authentication.

## External Dependencies
-   **Database**: PostgreSQL (specifically configured for Neon)
-   **NPM Packages**:
    -   `express` (Node.js web framework)
    -   `pgcrypto` (PostgreSQL extension for UUID generation)
    -   `drizzle-orm` (ORM for PostgreSQL)
    -   `pdfkit` (PDF generation library)
    -   `express-session` (Session management middleware)
    -   `zod` (Schema validation library, used for data parsing)