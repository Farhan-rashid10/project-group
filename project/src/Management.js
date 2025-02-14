import React from 'react';
import MemberCard from './MemberCard';

const Management = () => {
  return (
    <div className="p-8 bg-gray-100">
      {/* Header Section with Text and Video */}
      <div className="flex flex-col md:flex-row items-center md:items-center py-8 px-8 mx-auto md:justify-between mb-8">
        {/* Text Section */}
        <div className="md:w-1/2 mb-12 md:mb-0 pl-60">
          <h2 className="text-2xl font-bold text-blue-700">Our Management</h2>
          <h1 className="text-4xl font-extrabold text-gray-800 mt-2">
            Expert Care from Certified Professionals
          </h1>
          <p className="text-lg text-gray-600 mt-4">
          At Mediplus Hospital, our team of certified healthcare professionals is dedicated to providing high-quality, compassionate care. Using advanced medical tools and a personalized approach, we strive to enhance the health, comfort, and satisfaction of each patient, ensuring they receive the exceptional care they deserve.</p>
        </div>

        {/* Video Section
        <div className="md:w-1/2 flex justify-center">
          <iframe
            className="w-full max-w-lg h-80 rounded-lg shadow-md"
            src="https://videocdn.cdnpk.net/videos/61b3be09-56ae-4a30-a440-70366bf23492/horizontal/previews/clear/small.mp4?token=exp=1730706533~hmac=84926191575c1ec9e2ce68a4534f2192290eea7010a066d05771b1734dd05839"
            title="Medina Hospital Introduction Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div> */}
      </div>

      {/* Team Members */}
      <div className="grid grid-cols-1 md:grid-cols-3 mx-40 gap-8 bg-blue-600">
        <MemberCard
        name= 'Collis Molate'
        title="Director"
          imageUrl= 'https://img.freepik.com/free-photo/portrait-mature-therapist-sitting-table-looking-camera_1098-18156.jpg?ga=GA1.1.421194447.1722059295&semt=ais_siglip'
          />
        <MemberCard
          name="Dr. Idris Athman"
          title="Senior Resident Medical Officer | Hospital Administrator"
          imageUrl="https://img.freepik.com/premium-photo/health-awareness-concept-successful-medical-hospital-doctor_936147-3304.jpg?ga=GA1.1.421194447.1722059295&semt=ais_siglip"
        />
        <MemberCard
          name="Dr. Rukiya Nadir"
          title="Senior Resident Medical Officer"
          imageUrl="https://img.freepik.com/free-photo/nurse-wearing-scrubs-while-working-clinic_23-2149844653.jpg?ga=GA1.1.421194447.1722059295&semt=ais_siglip"
        />
      </div>
    </div>
  );
};

export default Management;
