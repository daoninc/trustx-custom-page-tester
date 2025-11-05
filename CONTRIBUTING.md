# Contributing to TrustX Custom Page Tester

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Development Setup

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/trustx-custom-page-tester.git
   cd trustx-custom-page-tester
   ```
3. Set up the development environment:
   ```bash
   ./setup.sh  # or setup.bat on Windows
   ```
4. Activate the virtual environment:
   ```bash
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   ```

## Making Changes

1. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes
3. Test your changes by running the application:
   ```bash
   python app.py
   ```
4. Commit your changes:
   ```bash
   git add .
   git commit -m "Add your descriptive commit message"
   ```
5. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
6. Create a Pull Request on GitHub

## Code Style

- Follow PEP 8 for Python code
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

## Testing

Before submitting a pull request:
- Ensure the application starts without errors
- Test basic functionality (loading pages, variable sets)
- Verify cross-platform compatibility if possible

## Reporting Issues

When reporting issues, please include:
- Python version
- Operating system
- Steps to reproduce the issue
- Expected vs actual behavior
- Any error messages

## Questions?

Feel free to open an issue for questions or discussions about the project.