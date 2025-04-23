ParkingFinderApp
================

ParkingFinderApp is a web application designed to help users locate available parking spots in their area. Currently available only in Cape Town, South Africa, the app aims to make the process of finding parking smoother and more efficient — with plans to expand globally in the near future.

Overview
--------
- 🚗 **Find Parking Easily** – View available parking spots around you.
- 📍 **Cape Town-First** – The app is currently tailored for Cape Town but designed for global scalability.
- 🔍 **Search & Filter** – Quickly find parking based on location and availability.
- 📱 **Mobile-Friendly** – Fully responsive design for use on any device.

Technologies Used
-----------------
- Backend: Python, Django
- Frontend: HTML, CSS, JavaScript
- Database: SQLite
- Deployment Ready: render.yaml config included

Getting Started
---------------
Follow the steps below to run the app locally.

### Prerequisites
- Python 3.x
- pip
- (Optional) Virtual environment tool

### Installation
```bash
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
