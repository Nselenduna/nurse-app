# Nurse Revalidator - Professional Healthcare App

A modern, mobile-first React Native application designed to help nurses and midwives track their professional development, manage revalidation requirements, and maintain their professional registration with the Nursing & Midwifery Council (NMC).

## 📱 Overview

Nurse Revalidator empowers healthcare professionals to:

- Track continuing professional development (CPD) activities

- Monitor revalidation progress against NMC requirements

- Maintain professional registration status

- Access guidance on professional standards

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)

- npm or yarn

- Expo CLI (`npm install -g expo-cli`)

- Android Studio / Xcode (for mobile development)

### Installation


```bash
# Clone the repository
git clone https://github.com/Nselenduna/nurse-app.git
cd nurse-app

# Install dependencies
npm install

# Start the development server
npx expo start

```


### Running the App


```bash
# Start Expo development server
npx expo start

# Run on Android
npx expo run:android

# Run on iOS
npx expo run:ios

# Run on web
npx expo start --web

```


## 📋 App Usage Flows

### 1. Authentication Flow

1. **Landing Page**: Users are greeted with the Nurse Revalidator landing page

2. **Login**: Tap "Login to Portal" to access the main application

3. **Authentication**: Enter credentials or use biometric authentication (if enabled)

### 2. CPD Logging Flow

1. **Dashboard**: View current revalidation progress

2. **Log Activity**: Tap "Voice Log" to record a new CPD activity

3. **Activity Details**: Enter activity details (date, hours, category, reflection)

4. **Save**: Activity is saved locally and added to your portfolio

### 3. Portfolio Review Flow

1. **CPD Tab**: Access your complete CPD portfolio

2. **Filter/Sort**: Organize activities by date, category, or hours

3. **Details**: Tap on any activity to view or edit full details

4. **Export**: Generate reports for revalidation submission

## 🌐 Accessibility Features

Nurse Revalidator is designed with accessibility in mind:

- **Screen Reader Support**: All UI elements include proper accessibility labels

- **Dynamic Text Sizing**: Respects system font size settings

- **Color Contrast**: High contrast ratios between text and backgrounds

- **Touch Targets**: Appropriately sized buttons and interactive elements (minimum 44x44 points)

- **Keyboard Navigation**: Full keyboard support for web version

- **Voice Input**: Voice logging feature for hands-free CPD recording

### Accessibility Settings

Users can customize their experience in the Settings tab:

- Font size adjustments

- High contrast mode

- Reduced motion option for animations

## 🔒 Data Privacy & GDPR Compliance

### Local-First Data Architecture

Nurse Revalidator uses a local-first approach to data storage:

- **On-Device Storage**: All personal data and CPD records are stored locally on your device

- **No Cloud Requirement**: The app functions fully without requiring cloud storage

- **Encryption**: Local data is encrypted at rest

- **Backup Options**: Export/import functionality for secure backups

### GDPR Compliance

- **Data Minimization**: Only collects necessary information for app functionality

- **Purpose Limitation**: Clear explanation of how data is used

- **Storage Limitation**: Data retention controls in settings

- **User Control**: Full ability to export or delete all personal data

- **Transparency**: Clear privacy policy accessible from settings

### Data Export & Deletion

Users can:

- Export all personal data in a machine-readable format

- Delete individual CPD records

- Perform a complete account data wipe

## 🏗️ Project Structure


```

nurse-app/
├── app/                     # Expo Router app directory
│   ├── _layout.tsx          # Root layout configuration
│   ├── index.tsx            # Entry point/landing page
│   ├── (auth)/              # Authentication routes
│   └── (tabs)/              # Main app tab navigation
│       ├── _layout.tsx      # Tab configuration
│       ├── index.tsx        # Dashboard tab
│       ├── cpd.tsx          # CPD portfolio tab
│       ├── log.tsx          # Activity logging tab
│       └── settings.tsx     # Settings tab
├── components/              # Reusable UI components
│   ├── LoginSignupPage.tsx  # Authentication component
│   └── NMCLandingPage.tsx   # Landing page component
├── src/
│   ├── components/          # Domain-specific components
│   ├── constants/           # App constants and configuration
│   ├── hooks/               # Custom React hooks
│   ├── services/            # Business logic services
│   └── types/               # TypeScript type definitions
├── assets/                  # Static assets (images, fonts)
└── package.json             # Dependencies and scripts

```


## 🛠️ Technical Stack

- **React Native**: Cross-platform mobile framework

- **Expo**: Development platform and tools

- **TypeScript**: Type-safe JavaScript

- **Expo Router**: File-based routing system

- **AsyncStorage**: Local data persistence

- **Expo Speech**: Voice input functionality

- **Linear Gradients**: UI styling

- **Ionicons**: Icon library

## 🔄 Offline Functionality

Nurse Revalidator is designed to work fully offline:

- All features function without internet connection

- Data is stored locally on the device

- Sync functionality is optional for backup purposes

## 📊 Development & Testing

### Development Workflow

1. Create a feature branch from `main`

2. Implement changes with appropriate tests

3. Run linting and type checking: `npm run lint`

4. Test on multiple devices/platforms

5. Submit pull request for review

### Testing Approach

- **Unit Tests**: Component and service testing

- **Integration Tests**: Feature workflow testing

- **Accessibility Testing**: Screen reader compatibility

- **Device Testing**: Multiple screen sizes and OS versions

## 🤝 Contributing

We welcome contributions to improve Nurse Revalidator:

1. Fork the repository

2. Create a feature branch (`git checkout -b feature/amazing-feature`)

3. Commit your changes (`git commit -m 'Add some amazing feature'`)

4. Push to the branch (`git push origin feature/amazing-feature`)

5. Open a Pull Request

Please ensure your code follows our coding standards and includes appropriate tests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Nursing & Midwifery Council for revalidation guidelines

- Healthcare professionals who provided feedback and testing

- Open source community for libraries and tools

---

**Built with ❤️ for healthcare professionals**
