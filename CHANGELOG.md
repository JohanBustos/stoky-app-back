# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-04-09

### Added
- Core modules implementation (quotes, payments, users)
- Firebase integration with authentication system
- Clean Architecture implementation with four layers:
  - Domain Layer: Business entities and repository interfaces
  - Application Layer: Use cases and services
  - Infrastructure Layer: Firebase repository implementations
  - Interface Layer: Controllers and DTOs
- Quotes management system with:
  - CRUD operations
  - Filtering and pagination
  - Payment status tracking
- Payments management system with:
  - Payment processing
  - Status updates
  - Quote linking
- CORS configuration for local development
- TypeScript configuration and development environment setup
- Firebase authentication guard implementation
- Comprehensive DTOs for data validation
- Pagination support for both quotes and payments listings

### Security
- Firebase service account key protection
- Authentication guards for all endpoints
- Environment variables configuration

## [0.0.1] - 2024-04-04

### Added
- Initial project setup
- Basic NestJS configuration
- Project structure definition
- Package.json with initial dependencies

[1.0.0]: https://github.com/JohanBustos/stoky-app-back/compare/v0.0.1...v1.0.0
[0.0.1]: https://github.com/JohanBustos/stoky-app-back/releases/tag/v0.0.1