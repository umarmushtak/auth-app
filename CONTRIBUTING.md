# Contributing to AuthApp

Thank you for your interest in contributing! Here's how to get started.

## Development Setup

1. Fork and clone the repository
2. Run `npm install` to install dependencies
3. Copy `.env.example` to `.env` and add your credentials
4. Run `npx expo start` to launch the dev server

## Code Style

- Use functional components with hooks
- Wrap components with `React.memo` for performance
- Use `useCallback` for all handler functions
- Follow the existing file structure and naming conventions
- Add JSDoc comments to all exported functions

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes with descriptive commits
3. Ensure no console errors or warnings
4. Test on web and at least one mobile platform
5. Submit a PR with a clear description

## Reporting Issues

Please include:

- Platform (web/iOS/Android)
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
