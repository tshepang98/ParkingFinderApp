ParkingFinderApp
ParkingFinderApp is a web application designed to help users locate available parking spots in their area. Currently available only in Cape Town, South Africa, the app aims to make the process of finding parking smoother and more efficient — with plans to expand globally in the near future.

🌍 Overview
🚗 Find Parking Easily – View available parking spots around you.

📍 Cape Town-First – The app is currently tailored for Cape Town but designed for global scalability.

🔍 Search & Filter – Quickly find parking based on location and availability.

📱 Mobile-Friendly – Fully responsive design for use on any device.

🛠️ Technologies Used
Backend: Python, Django

Frontend: HTML, CSS, JavaScript

Database: SQLite

Deployment Ready: render.yaml config included

🚀 Getting Started
Follow the steps below to run the app locally.

Prerequisites
Python 3.x

pip

(Optional) Virtual environment tool

Installation
bash
Copy
Edit
# Clone the repository
git clone https://github.com/tshepang98/ParkingFinderApp.git
cd ParkingFinderApp

# Set up virtual environment
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Apply migrations
python manage.py migrate

# Start the server
python manage.py runserver
Then go to http://127.0.0.1:8000/ in your browser to explore the app.

🗂 Project Structure
manage.py – Django project manager

requirements.txt – Python dependencies

render.yaml – Render.com deployment config

staticfiles/ – CSS, JS, and image assets

functional_test/ – End-to-end tests

build.sh – Optional build script

🤝 Contributing
Pull requests are welcome! Whether it’s UI improvements or adding new features for global support, your input is appreciated.

Create your feature branch: git checkout -b feature/my-new-feature

Commit changes: git commit -m 'Add new feature'

Push to the branch: git push origin feature/my-new-feature

Create a pull request
