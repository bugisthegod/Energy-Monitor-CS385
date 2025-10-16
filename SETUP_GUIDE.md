# CS385 Energy Monitoring App - Environment Setup Guide

## Prerequisites

Before starting, ensure you have the following installed on your computer:

### 1. Node.js and npm

**Why do we need Node.js and npm?**
- **Node.js**: JavaScript runtime that allows us to run React on our local computer. Without it, we cannot run the development server or build the React application.
- **npm (Node Package Manager)**: Comes with Node.js. It helps us install and manage all the libraries our project needs (React, Firebase, Recharts, etc.). Think of it like an app store for code packages.

**Required Versions:**
- Node.js: v20.10.0 (or similar v20.x)
- npm: v10.2.3 (or similar v10.x)

**Installation Steps:**

**For Windows:**
1. Go to https://nodejs.org/
2. Download the **LTS (Long Term Support)** version (recommended)
3. Run the installer (.msi file)
4. Follow the installation wizard:
   - Accept the license agreement
   - Keep default installation path
   - Make sure "Add to PATH" is checked ✅
   - Click "Install"
5. Restart your computer (important!)
6. Open Command Prompt or PowerShell and verify:
   ```bash
   node --version    # Should show v20.10.0 or similar
   npm --version     # Should show v10.2.3 or similar
   ```

**For macOS:**
1. Go to https://nodejs.org/
2. Download the **LTS version** (.pkg file)
3. Open the .pkg file and follow installation steps
4. Restart Terminal
5. Verify installation:
   ```bash
   node --version    # Should show v20.10.0 or similar
   npm --version     # Should show v10.2.3 or similar
   ```

---

### 2. Git

**Why do we need Git?**
- **Version Control**: Git tracks all changes made to the code, allowing us to see who changed what and when.
- **Collaboration**: Multiple team members can work on different parts of the project simultaneously without conflicts.
- **Backup**: Our code is stored on GitHub, so even if your computer crashes, the code is safe.
- **Branching**: Each team member can work on their own feature branch without affecting others' work.

**Installation Steps:**

**For Windows:**
1. Go to https://git-scm.com/downloads
2. Download Git for Windows
3. Run the installer (.exe file)
4. **Important settings during installation:**
   - Select components: Keep default options ✅
   - Default editor: Choose your preferred editor (VS Code recommended)
   - PATH environment: Select "Git from the command line and also from 3rd-party software" ✅
   - Line ending conversions: "Checkout Windows-style, commit Unix-style" ✅
   - Terminal emulator: "Use MinTTY" ✅
   - Click "Install"
5. After installation, open **Git Bash** or Command Prompt
6. Configure Git:
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```
7. Verify:
   ```bash
   git --version    # Should show git version 2.x.x
   ```

**For macOS:**
1. Go to https://git-scm.com/downloads
2. Download Git for macOS
3. Open the .dmg file and follow instructions
4. Configure Git:
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```
5. Verify:
   ```bash
   git --version    # Should show git version 2.x.x
   ```

---

### 3. Code Editor (Recommended)

**Visual Studio Code:**
1. Go to https://code.visualstudio.com/
2. Download for your operating system
3. Install and open VS Code
4. **Recommended Extensions** (Install from Extensions panel - Ctrl+Shift+X):
   - **ES7+ React/Redux/React-Native snippets**: Fast React code snippets
   - **Prettier - Code formatter**: Auto-formats code
   - **ESLint**: Shows code errors and warnings
   - **GitLens**: Enhanced Git integration
   - **Auto Rename Tag**: Auto-renames HTML/JSX tags

---

### 4. Verify Everything is Installed Correctly

Open your terminal/command prompt and run all these commands:

```bash
# Check Node.js version
node --version
# Expected output: v20.10.0 or similar v20.x ✅

# Check npm version
npm --version
# Expected output: v10.2.3 or similar v10.x ✅

# Check Git version
git --version
# Expected output: git version 2.x.x ✅

# Check Git configuration
git config --global user.name
# Expected output: Your Name ✅

git config --global user.email
# Expected output: your.email@example.com ✅
```

If all commands show the expected output, you're ready to go! 🎉

---

## Project Setup Instructions

### Step 1: Clone the Repository

```bash
# Clone the project from GitHub
git clone https://github.com/bugisthegod/Energy-Monitor-CS385.git

# Navigate to project directory
cd Energy-Monitor-CS385
```

### Step 2: Install Dependencies

```bash
# Install all required packages
npm install
```

This will install:
- React (v18.x)
- React Router DOM (v6.x)
- Recharts (v2.x)
- Other necessary dependencies

### Step 3: Run the Development Server

```bash
# Start the development server
npm start
```

The app should automatically open in your browser at `http://localhost:3000`

---

## Project Structure

```
Energy-Monitor-CS385/
├── public/
├── src/
│   ├── App.js                    # Main app with Router (Student 1)
│   ├── pages/
│   │   ├── Home/
│   │   │   ├── Home.js           # Home page UI
│   │   │   └── homeUtils.js      # Business logic
│   │   ├── Devices/
│   │   │   ├── Devices.js        # Devices page UI
│   │   │   └── devicesUtils.js   # Business logic
│   │   └── Status/
│   │       ├── Status.js         # Status page UI
│   │       └── statusUtils.js    # Business logic
│   └── components/
│       └── Navigation.js         # Navigation bar
├── .gitignore
├── package.json
└── README.md
```

---

## Common Issues and Solutions

### Issue 1: `npm install` fails
**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue 2: Module not found errors
**Solution**:
```bash
# Reinstall dependencies
npm install
```

---

## Git Workflow

### Initial Setup
```bash
# Set your name and email
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Daily Workflow
```bash
# Before starting work, pull latest changes
git pull origin main

# Create a new branch for your feature
git checkout -b feature/your-feature-name

# After making changes, check status
git status

# Add your changes
git add .

# Commit with meaningful message
git commit -m "Add: description of what you changed"

# Push to your branch
git push origin feature/your-feature-name

# Create Pull Request on GitHub for review
```

### Branch Naming Convention
- `feature/home-page` - Student 1
- `feature/devices-page` - Student 2
- `feature/status-page` - Student 3

---

## Testing Your Work

### Before Pushing Code
1. Run the app: `npm start`
2. Check console for errors (F12 in browser)
3. Test all functionality works
4. Check mobile responsiveness
5. Verify no console warnings

### Code Quality Checklist
- [ ] Code runs without errors
- [ ] All functions have comments
- [ ] Variable names are clear and meaningful
- [ ] No console.log() statements left in production code
- [ ] Code follows project structure
- [ ] External code sources are documented

---

## Package Versions (Standardized)

**package.json dependencies:**
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "recharts": "^2.10.3"
  }
}
```

---

## Team Communication

### Before Starting Work:
1. Announce in team chat what you're working on
2. Pull latest changes from main branch
3. Create your feature branch

### While Working:
1. Commit regularly with clear messages
2. Update team on progress
3. Ask for help if stuck

### After Completing Work:
1. Test thoroughly
2. Push to your branch
3. Create Pull Request
4. Request code review from team

---

## Useful Commands Reference

```bash
# Check Node and npm versions
node --version
npm --version

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Git commands
git status                    # Check current status
git add .                     # Stage all changes
git commit -m "message"       # Commit changes
git push origin branch-name   # Push to GitHub
git pull origin main          # Get latest changes
git branch                    # List branches
git checkout -b branch-name   # Create new branch

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## Important Reminders

✅ **DO**:
- Pull latest changes before starting work
- Commit with clear messages
- Test before pushing
- Comment your code
- Ask questions in team chat
- Follow the project structure

❌ **DON'T**:
- Work directly on main branch
- Push broken code
- Copy code without attribution
- Change other team members' files without discussion

---

## Getting Help

- **Technical Issues**: Check "Common Issues" section above
- **Team Questions**: Post in team chat/group
- **Git Problems**: https://stackoverflow.com/questions/tagged/git
- **React Questions**: https://react.dev/

---

## Contact Information

**Team Members**:
- Student 1 (Home Page): [Name] - [Email/Contact]
- Student 2 (Devices Page): [Name] - [Email/Contact]
- Student 3 (Status Page): [Name] - [Email/Contact]

**Repository**: https://github.com/bugisthegod/Energy-Monitor-CS385.git

---

## Quick Start Summary

```bash
# 1. Clone repository
git clone https://github.com/bugisthegod/Energy-Monitor-CS385.git
cd Energy-Monitor-CS385

# 2. Install dependencies
npm install

# 3. Run the app
npm start

# 4. Start coding! 🚀
```

---

**Last Updated**: October 2025  
**Project Deadline**: Friday, 22nd December 2025, 12:00 midday

Good luck team! 🌱⚡
