from flask import Flask, request, jsonify, send_file, render_template
from flask_cors import CORS
import pandas as pd
import os

app=Flask(__name__,template_folder='templates')
CORS(app)

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ruta para la página principal (frontend)
@app.route('/')
def index():
    return render_template('index.html')

# Ruta para subir el archivo Excel
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'excelFile' not in request.files:
        return jsonify({'error': 'No se encontró el archivo'}), 400

    file = request.files['excelFile']

    # Verificar que el archivo es un Excel
    if file.filename == '':
        return jsonify({'error': 'No se seleccionó ningún archivo'}), 400


    # Leer el archivo Excel
    try:
        print(f'Archivo recibido: {file.filename}')  # Imprimir el nombre del archivo recibido
        df = pd.read_excel(file, index_col=0)
        print(df.head())  # Imprimir las primeras filas del DataFrame para verificar el contenido
        # Verificar que las columnas existan
        required_columns = ['Nombre', 'Pases', 'Frase']
        if not all(col in df.columns for col in required_columns):
            return jsonify({'error': 'El archivo no contiene las columnas requeridas'}), 400

        # Convertir el DataFrame a un diccionario y enviarlo como respuesta
        data = df.to_dict(orient='records')
        return jsonify(data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Ruta para exportar el archivo Excel
@app.route('/export', methods=['POST'])
def export_file():
    try:
        data = request.json
        df = pd.DataFrame(data)
        export_path = os.path.join(app.config['UPLOAD_FOLDER'], 'eventos_exportados.xlsx')

        # Guardar el archivo Excel
        df.to_excel(export_path, index=False)

        return send_file(export_path, as_attachment=True, download_name='eventos.xlsx')
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    app.run(debug=True)
