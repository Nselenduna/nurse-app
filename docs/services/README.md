# Services

This directory contains documentation for service classes that provide functionality to the application.

## Available Services

- [Storage Services](storage-services.md) - Data persistence and encryption

- [Sensitive Data Handling](sensitive-data.md) - Security and encryption for credentials

- CpdService - Continuing Professional Development log management

- AuditLogService - Activity and event tracking

- ErrorService - Error handling and reporting

- LoggingService - Application logging

## Service Architecture

Services in the application follow these architectural principles:

1. **Singleton Pattern**: Services are implemented as singletons to ensure a single source of truth

2. **Separation of Concerns**: Each service handles a specific aspect of functionality

3. **Domain-Driven Design**: Services align with business domains

4. **Testability**: Services are designed to be easily testable

## Creating New Services

When creating new services:

1. **Singleton Implementation**: Use the singleton pattern for consistency

2. **Interface Definition**: Define clear interfaces for the service

3. **Error Handling**: Implement proper error handling and logging

4. **Testing**: Write comprehensive tests for the service

5. **Documentation**: Add JSDoc comments explaining methods and usage
