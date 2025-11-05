# TrustX Custom Page Tester
This is a simple tool to test custom pages that run in TrustX.

This package contains the essential files needed to run the Custom Page Handler application.

## Contents

- `app.py` - Main Flask application
- `requirements.txt` - Python dependencies
- `pages/` - Directory for custom pages (create subdirectories with index.html files)
- `templates/` - Directory for HTML templates (will be populated by the application)
- `static/` - Static assets (CSS, JavaScript, images)
- `variable_sets/` - Directory for variable sets (will be populated by the application)

## Prerequisites

- Python 3.7 or higher
- pip (Python package installer)
- Git (for cloning the repository)

## Installation

### Quick Start (Recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/daoninc/trustx-custom-page-tester.git
   cd trustx-custom-page-tester
   ```

2. Run the setup script to create virtual environment and install dependencies:
   
   **Linux/macOS:**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```
   
   **Windows:**
   ```cmd
   setup.bat
   ```

3. Start the application:
   
   **Linux/macOS:**
   ```bash
   ./start.sh
   ```
   
   **Windows:**
   ```cmd
   start.bat
   ```

4. Open your browser to `http://localhost:5000`

### Alternative Setup Methods

#### Cross-platform Python Setup
```bash
python setup.py
```

#### Manual Installation

If you prefer to manage the environment yourself:

1. Create a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the application:
   ```bash
   python app.py
   ```

## Project Structure

```
trustx-custom-page-tester/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── setup.py              # Cross-platform setup script
├── setup.sh              # Unix setup script
├── setup.bat             # Windows setup script
├── start.sh              # Unix startup script
├── start.bat             # Windows startup script
├── pages/                # Custom pages directory
├── templates/            # HTML templates
├── static/               # Static assets (CSS, JS)
└── variable_sets/        # Variable sets storage
```

## Usage

- Place custom pages in the `pages/` directory
- Each custom page should be in its own subdirectory with an `index.html` file
- Variable sets will be automatically created and stored in `variable_sets/`
- Static assets are served from the `static/` directory

## Version

This package is version 1.0 of the Custom Page Handler.

For more information, see the help system within the application.
