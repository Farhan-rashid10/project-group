from flask import Flask, Blueprint, jsonify, request, make_response, send_from_directory
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message
from flask_marshmallow import Marshmallow
from flask_cors import CORS
import random
import string
from functools import wraps
import os
import jwt
from sqlalchemy import Column, Integer, String
from datetime import datetime, timedelta
from werkzeug.utils import secure_filename

# Initialize app
app = Flask(__name__ ,static_folder='uploads')
CORS(app, supports_credentials=True, origins="http://localhost:3000")

# Configurations
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///main.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads'  # Folder to save images
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif'}
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'farkaf07@gmail.com'   # Your email address
app.config['MAIL_PASSWORD'] = 'bvyk xbcm kszc moym'    # Your email password or app password
app.config['MAIL_DEFAULT_SENDER'] = 'farkaf@gmail.com'  # Default sender
# Initialize extensions
db = SQLAlchemy(app)
ma = Marshmallow(app)
mail = Mail(app)


reset_codes = {}

# Ensure the upload folder exists
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])



    # Patient Model
class Patient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    medical_info = db.Column(db.Text, default="")


# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(200))
 
    
class Appointment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(120), nullable=False)
    department = db.Column(db.String(120), nullable=False)
    doctor = db.Column(db.String(120), nullable=False)
    date = db.Column(db.String(120), nullable=False)
    message = db.Column(db.String(120), nullable=False)


class Doctor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    specialty = db.Column(db.String(100), nullable=False)
    imageUrl = db.Column(db.String(200), nullable=False)  # URL or file path to the uploaded image
    description = db.Column(db.Text, nullable=False)
    contact = db.Column(db.String(50), nullable=False)
    experience = db.Column(db.String(50), nullable=False)
    education = db.Column(db.String(100), nullable=False)
    hospital = db.Column(db.String(100), nullable=False)
    workingHours = db.Column(db.String(50), nullable=False)
    location = db.Column(db.String(100), nullable=False)

class Medicine(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    imageUrl = db.Column(db.String(200), nullable=False)  # URL or file path to the uploaded image
    description = db.Column(db.Text, nullable=False)

class ContactUs(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(50), nullable=False)
    subject = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)

# ContactUs Schema
class ContactUsSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = ContactUs
        

class AppointmentsSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Appointment


# Initialize the ContactUs Schema


# Schemas
class DoctorSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Doctor


class PatientSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Patient

class MedicineSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Medicine

class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User

# Initialize Schemas
doctor_schema = DoctorSchema()
doctors_schema = DoctorSchema(many=True)
medicine_schema = MedicineSchema()
medicines_schema = MedicineSchema(many=True)
user_schema = UserSchema()
users_schema = UserSchema(many=True)
contact_us_schema = ContactUsSchema()
contact_uses_schema = ContactUsSchema(many=True)
appointments = AppointmentsSchema()
appointments_schema = AppointmentsSchema(many=True)
Patients = PatientSchema()
PatientsSchema = PatientSchema(many=True)

# Create the database
with app.app_context():
    db.create_all()

# Helper functions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# Blueprints
auth_bp = Blueprint("auth", __name__)

# User Authentication Routes
@auth_bp.route("/signup", methods=["POST"])
def sign_up():
    name = request.json.get('name')
    email = request.json.get('email')
    password = request.json.get('password')

    if User.query.filter_by(email=email).first():
        return make_response(jsonify({"message": "User already exists"}), 400)

    hashed_password = generate_password_hash(password)
    new_user = User(name=name, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return user_schema.dump(new_user), 201













def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.cookies.get('token')
        if not token:
            return jsonify({"message": "Token is missing!"}), 403
        
        try:
            # Decode the token
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.filter_by(id=data["id"]).first()
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired!"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token!"}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated_function

# Login route
@auth_bp.route("/login", methods=["POST"])
def login():
    email = request.json.get('email')
    password = request.json.get('password')

    user = User.query.filter_by(email=email).first()
    if user and check_password_hash(user.password, password):
        token = jwt.encode(
            {"id": user.id, "email": user.email, "exp": datetime.utcnow() + timedelta(minutes=60)},
            app.config['SECRET_KEY'],
            algorithm="HS256"
        )
        response = make_response(jsonify({"message": "Login successful"}))
        response.set_cookie("token", token, httponly=True, secure=True, samesite="Strict")
        return response, 200

    return jsonify({"message": "Invalid email or password"}), 401

# Protected route that requires authentication
@app.route('/profile', methods=['GET'])
def profile():
    user = get_logged_in_user()  # Implement this function
    if user:
        return jsonify({
            "name": user.name, 
            "email": user.email
        }), 200
    return jsonify({"error": "Unauthorized"}), 401


# Logout route (clear token)
@auth_bp.route("/logout", methods=["POST"])
def logout():
    response = make_response(jsonify({"message": "Logged out successfully"}))
    response.delete_cookie("token")
    return response, 200














# Example function to simulate getting a user from the database
def get_user_by_email(email):
    # Convert both the input email and stored emails to lowercase to avoid case sensitivity issues
    email = email.lower()
    user = User.query.filter_by(email=email).first()  # Adjust as needed for your database
    return user


# Example function to simulate saving the user object
def save_user(user):
    # Replace with real database saving logic
    # For example: db.session.commit() if using SQLAlchemy
    pass

@auth_bp.route('/request-reset', methods=['POST'])
def request_reset():
    email = request.json.get('email')  # Get email from the request
    if not email:
        return jsonify({"message": "Email is required"}), 400
    
    # Generate 6-digit reset code
    reset_code = ''.join(random.choices(string.digits, k=6))
    
    # Store reset code with expiration time (e.g., 10 minutes)
    expiration_time = datetime.utcnow() + timedelta(minutes=10)
    reset_codes[email] = {'code': reset_code, 'expiration': expiration_time}
    
    # Send the reset code to the user's email
    msg = Message("Password Reset Code", recipients=[email])
    msg.body = f"Your password reset code is {reset_code}. It expires in 10 minutes."
    mail.send(msg)
    
    return jsonify({"message": "Reset code sent to email"}), 200

# Route to reset password using the code
@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    email = request.json.get('email')
    code = request.json.get('code')
    new_password = request.json.get('new_password')

    # Check if all required fields are provided
    if not email or not code or not new_password:
        return jsonify({"message": "Email, code, and new password are required"}), 400

    # Check if the email and code exist in the reset_codes dictionary
    if email not in reset_codes:
        return jsonify({"message": "Invalid reset request"}), 400
    
    reset_info = reset_codes[email]
    stored_code = reset_info['code']
    expiration_time = reset_info['expiration']
    
    # Check if the code is expired
    if datetime.utcnow() > expiration_time:
        return jsonify({"message": "Reset code has expired"}), 400
    
    # Check if the entered code matches the stored code
    if code != stored_code:
        return jsonify({"message": "Invalid reset code"}), 400
    
    # Fetch user from the database
    user = get_user_by_email(email)
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    # Hash the new password
    hashed_password = generate_password_hash(new_password)
    
   # Update the password (for SQLAlchemy)
    user.password = hashed_password

# Commit the changes to the database
    db.session.commit()

# Continue with clearing the reset code and other logic
    del reset_codes[email]

    return jsonify({"message": "Password successfully reset"}), 200


# Appointment Routes
@app.route("/appointment", methods=["POST"])
def add_appointment():
    name = request.json.get('name')
    email = request.json.get('email')
    phone = request.json.get('phone')
    department = request.json.get('department')
    doctor = request.json.get('doctor')
    date = request.json.get('date')
    message = request.json.get('message')

    new_appointment = Appointment(
        name=name,
        email=email,
        phone=phone,
        department=department,
        doctor=doctor,
        date=date,
        message=message
    )

    db.session.add(new_appointment)
    db.session.commit()

    # Send email notification
    try:
        send_confirmation_email(new_appointment)
    except Exception as e:
        print(f"Email failed to send: {e}")

    return user_schema.dump(new_appointment), 201

# Function to send email notification
def send_confirmation_email(appointment):
    subject = "Appointment Booking Confirmation"
    body = f"""
    Hello {appointment.name},

    Your appointment has been successfully booked.

    Details:
    - Doctor: {appointment.doctor}
    - Department: {appointment.department}
    - Date: {appointment.date}
    - Phone: {appointment.phone}
    - Message: {appointment.message}

    Thank you for booking with us!

    Best regards,
    Clinic Team
    """

    msg = Message(subject, recipients=[appointment.email])
    msg.body = body
    mail.send(msg)
# Get all appointments
@app.route("/appointments/", methods=["GET"])
def get_appointments():
    all_appointments = Appointment.query.all()
    return jsonify(appointments_schema.dump(all_appointments))

# Get a single appointment by ID
@app.route("/appointments/<int:id>", methods=["GET"])
def get_appointment_by_id(id):
    appointment = Appointment.query.get(id)
    if appointment is None:
        return make_response(jsonify({"message": "Appointment not found"}), 404)
    return AppointmentsSchema.dump(appointment)

# Update an existing appointment
@app.route("/appointments/<int:id>", methods=["PUT"])
def update_appointment(id):
    appointment = Appointment.query.get(id)
    if appointment is None:
        return make_response(jsonify({"message": "Appointment not found"}), 404)

    appointment.name = request.json.get('name', appointment.name)
    appointment.email = request.json.get('email', appointment.email)
    appointment.phone = request.json.get('phone', appointment.phone)
    appointment.department = request.json.get('department', appointment.department)
    appointment.doctor = request.json.get('doctor', appointment.doctor)
    appointment.date = request.json.get('date', appointment.date)
    appointment.message = request.json.get('message', appointment.message)

    db.session.commit()
    return jsonify(appointments.dump(appointments))



# Delete an appointment
@app.route("/appointments/<int:id>", methods=["DELETE"])
def delete_appointment(id):
    appointment = Appointment.query.get(id)
    if appointment is None:
        return make_response(jsonify({"message": "Appointment not found"}), 404)

    db.session.delete(appointment)
    db.session.commit()
    return make_response(jsonify({"message": "Appointment deleted successfully"}), 200)

# Doctor Routes
@app.route('/doctors', methods=['POST'])
def create_doctor():
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    image = request.files['image']
    if image and allowed_file(image.filename):
        filename = secure_filename(image.filename)
        image.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

        data = request.form
        new_doctor = Doctor(
            name=data['name'],
            specialty=data['specialty'],
            imageUrl=f"uploads/{filename}",
            description=data.get('description', ''),
            contact=data['contact'],
            experience=data.get('experience', ''),
            education=data.get('education', ''),
            hospital=data.get('hospital', ''),
            workingHours=data.get('workingHours', ''),
            location=data.get('location', '')
        )
        db.session.add(new_doctor)
        db.session.commit()
        return doctor_schema.jsonify(new_doctor), 201
    else:
        return jsonify({"error": "Invalid file type. Allowed types: png, jpg, jpeg, gif"}), 400

@app.route('/doctors', methods=['GET'])
def get_doctors():
    all_doctors = Doctor.query.all()
    return doctors_schema.jsonify(all_doctors)

@app.route('/doctors/<int:id>', methods=['GET'])
def get_doctor(id):
    doctor = Doctor.query.get_or_404(id)
    return doctor_schema.jsonify(doctor)

@app.route('/doctors/<int:id>', methods=['PUT'])
def update_doctor(id):
    doctor = Doctor.query.get_or_404(id)
    data = request.form

    doctor.name = data.get('name', doctor.name)
    doctor.specialty = data.get('specialty', doctor.specialty)
    doctor.description = data.get('description', doctor.description)
    doctor.contact = data.get('contact', doctor.contact)
    doctor.experience = data.get('experience', doctor.experience)
    doctor.education = data.get('education', doctor.education)
    doctor.hospital = data.get('hospital', doctor.hospital)
    doctor.workingHours = data.get('workingHours', doctor.workingHours)
    doctor.location = data.get('location', doctor.location)

    if 'image' in request.files:
        image = request.files['image']
        if image and allowed_file(image.filename):
            filename = secure_filename(image.filename)
            image.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            doctor.imageUrl = f"uploads/{filename}"

    db.session.commit()
    return doctor_schema.jsonify(doctor)

@app.route('/doctors/<int:id>', methods=['DELETE'])
def delete_doctor(id):
    doctor = Doctor.query.get_or_404(id)
    db.session.delete(doctor)
    db.session.commit()
    return jsonify({"message": "Doctor deleted successfully"}), 200

# Medicine Routes
@app.route('/medicines', methods=['POST'])
def create_medicine():
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    image = request.files['image']
    if image and allowed_file(image.filename):
        filename = secure_filename(image.filename)
        image.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

        data = request.form
        new_medicine = Medicine(
            name=data['name'],
            imageUrl=f"uploads/{filename}",
            description=data.get('description', '')
        )
        db.session.add(new_medicine)
        db.session.commit()
        return medicine_schema.jsonify(new_medicine), 201
    else:
        return jsonify({"error": "Invalid file type. Allowed types: png, jpg, jpeg, gif"}), 400

@app.route('/medicines', methods=['GET'])
def get_medicines():
    all_medicines = Medicine.query.all()
    return medicines_schema.jsonify(all_medicines)

@app.route('/medicines/<int:id>', methods=['GET'])
def get_medicine(id):
    medicine = Medicine.query.get_or_404(id)
    return medicine_schema.jsonify(medicine)

@app.route('/medicines/<int:id>', methods=['PUT'])
def update_medicine(id):
    medicine = Medicine.query.get_or_404(id)
    data = request.form

    medicine.name = data.get('name', medicine.name)
    medicine.description = data.get('description', medicine.description)

    if 'image' in request.files:
        image = request.files['image']
        if image and allowed_file(image.filename):
            filename = secure_filename(image.filename)
            image.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            medicine.imageUrl = f"uploads/{filename}"

    db.session.commit()
    return medicine_schema.jsonify(medicine)

@app.route('/medicines/<int:id>', methods=['DELETE'])
def delete_medicine(id):
    medicine = Medicine.query.get_or_404(id)
    db.session.delete(medicine)
    db.session.commit()
    return jsonify({"message": "Medicine deleted successfully"}), 200


# Contact Us Routes
@app.route('/contact-us', methods=['POST'])
def create_contact():
    name = request.json.get('name')
    email = request.json.get('email')
    phone = request.json.get('phone')
    subject = request.json.get('subject')
    message = request.json.get('message')

    new_contact = ContactUs(
        name=name,
        email=email,
        phone=phone,
        subject=subject,
        message=message
    )
    db.session.add(new_contact)
    db.session.commit()
    return contact_us_schema.jsonify(new_contact), 201

@app.route('/contact-us', methods=['GET'])
def get_contacts():
    all_contacts = ContactUs.query.all()
    return contact_uses_schema.jsonify(all_contacts)

@app.route('/contact-us/<int:id>', methods=['GET'])
def get_contact(id):
    contact = ContactUs.query.get_or_404(id)
    return contact_us_schema.jsonify(contact)

@app.route('/contact-us/<int:id>', methods=['PUT'])
def update_contact(id):
    contact = ContactUs.query.get_or_404(id)
    data = request.json

    contact.name = data.get('name', contact.name)
    contact.email = data.get('email', contact.email)
    contact.phone = data.get('phone', contact.phone)
    contact.subject = data.get('subject', contact.subject)
    contact.message = data.get('message', contact.message)

    db.session.commit()
    return contact_us_schema.jsonify(contact)

@app.route('/contact-us/<int:id>', methods=['DELETE'])
def delete_contact(id):
    contact = ContactUs.query.get_or_404(id)
    db.session.delete(contact)
    db.session.commit()
    return jsonify({"message": "Contact request deleted successfully"}), 200



# Add New Patient
@app.route('/patients', methods=['POST'])
def add_patient():
    data = request.json
    new_patient = Patient(name=data['name'], age=data['age'])
    db.session.add(new_patient)
    db.session.commit()
    return jsonify({'message': 'Patient added successfully', 'patient_id': new_patient.id})

# Get Patients
@app.route('/patients', methods=['GET'])
def get_patients():
    patients = Patient.query.all()
    return jsonify([{'id': p.id, 'name': p.name, 'age': p.age, 'medical_info': p.medical_info} for p in patients])

# Search Patient by Name
@app.route('/patients/search', methods=['GET'])
def search_patient():
    name = request.args.get('name', '')
    patient = Patient.query.filter(Patient.name.ilike(f"%{name}%")).first()
    if patient:
        return jsonify({'id': patient.id, 'name': patient.name, 'age': patient.age, 'medical_info': patient.medical_info})
    return jsonify({'message': 'Patient not found'}), 404

# Add Medical Info
@app.route('/patients/<int:id>/add_info', methods=['POST'])
def add_medical_info(id):
    patient = Patient.query.get(id)
    if not patient:
        return jsonify({'message': 'Patient not found'}), 404

    data = request.json
    patient.medical_info += f"\n{data['info']}"  # Append new info
    db.session.commit()
    return jsonify({'message': 'Information added successfully', 'medical_info': patient.medical_info})



# Run the app
if __name__ == '__main__':
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.run(debug=True)
