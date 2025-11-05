# Copyright (c) 2025 Daon, Inc. All rights reserved.
# This code is provided as is and is only for the demonstration of how to create and validate custom pages
# This code is not intended for production use
# This code is not intended for use in any other project

import os
import json
from flask import Flask, render_template, send_from_directory, request, jsonify

app = Flask(__name__)

def get_available_pages():
    """Scan the pages directory and return a list of available pages."""
    pages_dir = os.path.join(app.root_path, 'pages')
    pages = []
    
    if os.path.exists(pages_dir):
        for item in os.listdir(pages_dir):
            item_path = os.path.join(pages_dir, item)
            if os.path.isdir(item_path):
                # Check if the directory contains an index.html file
                index_file = os.path.join(item_path, 'index.html')
                if os.path.exists(index_file):
                    pages.append({
                        'name': item.replace('-', ' ').title(),
                        'directory': item,
                        'url': f'/pages/{item}/'
                    })
    
    return sorted(pages, key=lambda x: x['name'])

def get_variable_sets_dir():
    """Get the path to the variable sets directory."""
    return os.path.join(app.root_path, 'variable_sets')

def load_variable_sets():
    """Load all variable sets from the file system."""
    var_sets_dir = get_variable_sets_dir()
    variable_sets = {}
    
    if os.path.exists(var_sets_dir):
        for filename in os.listdir(var_sets_dir):
            if filename.endswith('.json'):
                set_id = filename[:-5]  # Remove .json extension
                file_path = os.path.join(var_sets_dir, filename)
                try:
                    with open(file_path, 'r') as f:
                        variable_sets[set_id] = json.load(f)
                except (json.JSONDecodeError, IOError) as e:
                    print(f"Error loading variable set {set_id}: {e}")
    
    return variable_sets

def save_variable_set(set_id, variable_set):
    """Save a variable set to the file system."""
    var_sets_dir = get_variable_sets_dir()
    file_path = os.path.join(var_sets_dir, f"{set_id}.json")
    
    try:
        with open(file_path, 'w') as f:
            json.dump(variable_set, f, indent=2)
        return True
    except IOError as e:
        print(f"Error saving variable set {set_id}: {e}")
        return False

def delete_variable_set(set_id):
    """Delete a variable set from the file system."""
    var_sets_dir = get_variable_sets_dir()
    file_path = os.path.join(var_sets_dir, f"{set_id}.json")
    
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            return True
    except IOError as e:
        print(f"Error deleting variable set {set_id}: {e}")
    
    return False

@app.route('/')
def index():
    """Render the main index page with available pages."""
    pages = get_available_pages()
    return render_template('index.html', pages=pages)

@app.route('/page-viewer')
def page_viewer():
    """Serve the page viewer template for new tab functionality."""
    return render_template('page_viewer.html')

@app.route('/help')
def help_page():
    """Serve the help page."""
    return render_template('help.html')

@app.route('/pages/<page_dir>/')
def serve_page_index(page_dir):
    """Serve the index.html file for a specific page directory."""
    page_path = os.path.join(app.root_path, 'pages', page_dir)
    return send_from_directory(page_path, 'index.html')

@app.route('/pages/<page_dir>/<path:filename>')
def serve_page_assets(page_dir, filename):
    """Serve static assets (CSS, JS) for pages."""
    page_path = os.path.join(app.root_path, 'pages', page_dir)
    return send_from_directory(page_path, filename)

@app.route('/static/<path:filename>')
def serve_static(filename):
    """Serve static files (CSS, JS) for the main application."""
    return send_from_directory(os.path.join(app.root_path, 'static'), filename)

# Variable Sets API endpoints
@app.route('/api/variable-sets', methods=['GET'])
def get_variable_sets():
    """Get all variable sets."""
    variable_sets = load_variable_sets()
    return jsonify(variable_sets)

@app.route('/api/variable-sets', methods=['POST'])
def create_variable_set():
    """Create a new variable set."""
    data = request.get_json()
    
    if not data or 'name' not in data or 'variables' not in data:
        return jsonify({'error': 'Missing required fields: name and variables'}), 400
    
    # Generate a unique ID
    import time
    set_id = str(int(time.time() * 1000))
    
    variable_set = {
        'name': data['name'],
        'variables': data['variables']
    }
    
    if save_variable_set(set_id, variable_set):
        return jsonify({'id': set_id, 'variable_set': variable_set}), 201
    else:
        return jsonify({'error': 'Failed to save variable set'}), 500

@app.route('/api/variable-sets/<set_id>', methods=['PUT'])
def update_variable_set(set_id):
    """Update an existing variable set."""
    data = request.get_json()
    
    if not data or 'name' not in data or 'variables' not in data:
        return jsonify({'error': 'Missing required fields: name and variables'}), 400
    
    variable_set = {
        'name': data['name'],
        'variables': data['variables']
    }
    
    if save_variable_set(set_id, variable_set):
        return jsonify({'id': set_id, 'variable_set': variable_set}), 200
    else:
        return jsonify({'error': 'Failed to update variable set'}), 500

@app.route('/api/variable-sets/<set_id>', methods=['DELETE'])
def remove_variable_set(set_id):
    """Delete a variable set."""
    if delete_variable_set(set_id):
        return jsonify({'message': 'Variable set deleted successfully'}), 200
    else:
        return jsonify({'error': 'Failed to delete variable set'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
