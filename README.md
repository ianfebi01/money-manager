# 💰 Money Manager – Personal Finance Tracker

**Money Manager** is a clean and modern app that helps you **track income, expenses, and manage your financial goals** with ease. Designed for simplicity and accessibility, it provides an intuitive UI and essential insights to help you stay on top of your finances.

## 🚀 Features

- 📥 Add & categorize income and expenses  
- 📊 Monthly reports and visual charts  
- 🎯 Set and monitor financial goals  
- 🔐 Secure login with **Google (NextAuth.js)**  
- 🌍 Access your data from any device, anytime  
- 🌙 Dark mode  
- 🌐 Supports multiple languages (EN/ID)

## 🛠 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (Frontend + API Routes)  
- **Database:** [PostgreSQL](https://www.postgresql.org/) (no ORM – raw SQL or query builder)  
- **Authentication:** [NextAuth.js](https://next-auth.js.org/) with Google Provider  
- **Styling:** [Tailwind CSS](https://tailwindcss.com/), [Headless UI](https://headlessui.com/)  
- **Animations:** [GSAP](https://gsap.com/)  
- **Deployment:** Vercel (frontend + API), PostgreSQL hosted on VPS

## 📷 Screenshots

> _Add screenshots here to show off the UI._

## 📦 Getting Started

```bash
# Clone the repository
git clone https://github.com/your-username/money-manager.git
cd money-manager

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Then edit the .env file with your actual credentials

# Run the development server
npm run dev
