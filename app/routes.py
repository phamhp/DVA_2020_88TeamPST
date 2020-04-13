from app import app
from flask import render_template

@app.route('/')
def index():
    return render_template('Interactive.html', title='Home')

@app.route('/about')
def about():
    return render_template('about.html')