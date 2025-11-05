#!/usr/bin/env python3
"""
TrustX Custom Page Tester - Setup Script
Cross-platform setup for virtual environment and dependencies
"""

import os
import sys
import subprocess
import platform

def run_command(command, description):
    """Run a command and handle errors gracefully"""
    print(f"📋 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error: {e}")
        print(f"Output: {e.output}")
        return False

def check_python_version():
    """Check if Python version is compatible"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 7):
        print(f"❌ Python 3.7+ is required. Current version: {version.major}.{version.minor}")
        return False
    print(f"✅ Python {version.major}.{version.minor}.{version.micro} detected")
    return True

def setup_virtual_environment():
    """Create and setup virtual environment"""
    if os.path.exists("venv"):
        print("✅ Virtual environment already exists")
        return True
    
    print("📦 Creating virtual environment...")
    if not run_command("python -m venv venv", "Creating virtual environment"):
        return False
    
    return True

def install_dependencies():
    """Install required dependencies"""
    system = platform.system().lower()
    
    if system == "windows":
        activate_cmd = "venv\\Scripts\\activate"
        pip_cmd = "venv\\Scripts\\pip"
    else:
        activate_cmd = "source venv/bin/activate"
        pip_cmd = "venv/bin/pip"
    
    print("📋 Installing dependencies...")
    if not run_command(f"{pip_cmd} install -r requirements.txt", "Installing dependencies"):
        return False
    
    return True

def main():
    """Main setup function"""
    print("🚀 TrustX Custom Page Tester - Setup")
    print("=" * 40)
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Setup virtual environment
    if not setup_virtual_environment():
        print("❌ Failed to create virtual environment")
        sys.exit(1)
    
    # Install dependencies
    if not install_dependencies():
        print("❌ Failed to install dependencies")
        sys.exit(1)
    
    print("\n✅ Setup completed successfully!")
    print("\nTo start the application:")
    
    system = platform.system().lower()
    if system == "windows":
        print("  ./start.bat")
    else:
        print("  ./start.sh")
    
    print("\nOr manually:")
    if system == "windows":
        print("  venv\\Scripts\\activate")
    else:
        print("  source venv/bin/activate")
    print("  python app.py")

if __name__ == "__main__":
    main()