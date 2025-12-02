import os
import uuid
import sqlite3
from datetime import datetime
from functools import wraps
from flask import Flask, render_template, request, jsonify, make_response, send_from_directory, send_file
import base64
from io import BytesIO
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment

app = Flask(__name__)
app.config.from_object(os.environ.get('APP_CONFIG') or {})

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Unauthorized'}), 401
        return f(*args, **kwargs)
    return decorated_function

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        # Check credentials
        if username == 'admin' and password == 'password':
            session['user_id'] = username
            return jsonify({'message': 'Login successful'})
        return jsonify({'error': 'Invalid credentials'}), 401
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    return jsonify({'message': 'Logged out'})

@app.route('/data', methods=['GET'])
@login_required
def get_data():
    conn = sqlite3.connect('data.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM data')
    rows = cursor.fetchall()
    conn.close()
    return jsonify(rows)

@app.route('/data', methods=['POST'])
@login_required
def add_data():
    data = request.get_json()
    conn = sqlite3.connect('data.db')
    cursor = conn.cursor()
    cursor.execute('INSERT INTO data (name, value) VALUES (?, ?)', (data['name'], data['value']))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Data added successfully'})

@app.route('/data/<int:id>', methods=['GET'])
@login_required
def get_data_by_id(id):
    conn = sqlite3.connect('data.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM data WHERE id = ?', (id,))
    row = cursor.fetchone()
    conn.close()
    return jsonify(row)

@app.route('/data/<int:id>', methods=['DELETE'])
@login_required
def delete_data(id):
    conn = sqlite3.connect('data.db')
    cursor = conn.cursor()
    cursor.execute('DELETE FROM data WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Data deleted successfully'})

@app.route('/data/<int:id>', methods=['PUT'])
@login_required
def update_data(id):
    data = request.get_json()
    conn = sqlite3.connect('data.db')
    cursor = conn.cursor()
    cursor.execute('UPDATE data SET name = ?, value = ? WHERE id = ?', (data['name'], data['value'], id))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Data updated successfully'})

@app.route('/data/<int:id>/download')
@login_required
def download_data(id):
    conn = sqlite3.connect('data.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM data WHERE id = ?', (id,))
    row = cursor.fetchone()
    conn.close()
    return send_file(BytesIO(row), as_attachment=True)

@app.route('/data/<int:id>/upload')
@login_required
def upload_data(id):
    file = request.files['file']
    if file and file.filename.endswith('.xlsx'):
        conn = sqlite3.connect('data.db')
        cursor = conn.cursor()
        cursor.execute('INSERT INTO data (name, value) VALUES (?, ?)', (file.filename, file.read()))
        conn.commit()
        conn.close()
        return jsonify({'message': 'File uploaded successfully'})
    return jsonify({'error': 'Invalid file type'}), 401