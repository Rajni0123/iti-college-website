export const generateAdmissionFormHTML = (student) => {
  return `
<!DOCTYPE html>
<html>
  <head>
    <title>Admission Form - ${student.student_name}</title>
    <style>
      @media print { 
        @page { margin: 10mm; size: A4 portrait; } 
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; } 
      }
      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 8px; line-height: 1.25; font-size: 10px; position: relative; }
      .student-photo { position: absolute; top: 8px; right: 8px; width: 88px; height: 105px; border: 2px solid #195de6; border-radius: 3px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
      .student-photo img { width: 100%; height: 100%; object-fit: cover; }
      .student-photo-placeholder { width: 100%; height: 100%; background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%); display: flex; align-items: center; justify-content: center; color: #999; font-size: 8px; text-align: center; padding: 4px; }
      .header { text-align: center; border-bottom: 2px solid #195de6; padding-bottom: 5px; margin-bottom: 7px; margin-right: 100px; }
      .header h1 { margin: 0 0 2px 0; font-size: 19px; font-weight: bold; color: #195de6; letter-spacing: 0.4px; }
      .header .address { margin: 1px 0; font-size: 8px; color: #555; line-height: 1.2; }
      .header .contact-info { margin: 1px 0; font-size: 8px; color: #555; }
      .header .form-title { margin: 4px 0 2px 0; font-size: 12px; font-weight: bold; color: #333; }
      .header .enrollment-id { margin: 1px 0; font-size: 9px; font-weight: bold; color: #195de6; }
      .form-section { margin-bottom: 6px; page-break-inside: avoid; }
      .form-section h3 { background: linear-gradient(to right, #195de6, #1e40af); color: white; padding: 3px 7px; margin: 0 0 4px 0; border-radius: 2px; font-size: 9.5px; font-weight: bold; }
      .form-row { display: flex; margin-bottom: 4px; gap: 7px; }
      .form-field { flex: 1; }
      .form-field-full { width: 100%; margin-bottom: 4px; }
      .form-label { font-weight: 600; color: #333; margin-bottom: 1px; display: block; font-size: 7.5px; text-transform: uppercase; letter-spacing: 0.2px; }
      .form-value { padding: 3px 5px; background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 2px; min-height: 15px; font-size: 9px; color: #212529; }
      .status-badge { display: inline-flex; align-items-center; gap: 2px; padding: 2px 6px; border-radius: 10px; font-size: 8.5px; font-weight: 600; background: #d4edda; color: #155724; }
      .signature-section { margin-top: 10px; display: flex; justify-content: space-between; page-break-inside: avoid; }
      .signature-box { width: 45%; text-align: center; }
      .signature-line { border-top: 1px solid #000; margin-top: 20px; padding-top: 3px; font-weight: 600; font-size: 9px; }
      .footer { margin-top: 8px; text-align: center; font-size: 7.5px; color: #666; border-top: 1px solid #ddd; padding-top: 4px; }
      .declaration-box { background: #fff8dc; border: 1px solid #ffd700; padding: 5px 7px; margin-top: 6px; border-radius: 2px; font-size: 8.5px; line-height: 1.35; }
    </style>
  </head>
  <body>
    <!-- Student Photo -->
    <div class="student-photo">
      ${student.photo ? 
        `<img src="${(import.meta.env.VITE_API_URL || 'https://manerpvtiti.space/api').replace('/api', '')}/uploads/${student.photo}" alt="Student Photo" onerror="this.parentElement.innerHTML='<div class=\\'student-photo-placeholder\\'>Photo Not Available</div>'">` : 
        `<div class="student-photo-placeholder">Photo Not Available</div>`
      }
    </div>
    
    <div class="header">
      <h1>Maner Pvt ITI</h1>
      <p class="address">Maner MAHINAWAN, NEAR VISHWAKARMA MANDIR, MANER, PATNA - 801108</p>
      <p class="contact-info">Contact: 9155401839 | Email: MANERPVTITI@GMAIL.COM</p>
      <p class="form-title">Student Admission Form</p>
      ${student.enrollment_number ? `<p class="enrollment-id">Enrollment No: ${student.enrollment_number}</p>` : ''}
      ${student.mis_iti_code ? `<p class="enrollment-id">MIS ITI CODE: ${student.mis_iti_code}</p>` : ''}
    </div>
    
    <!-- Personal Information -->
    <div class="form-section">
      <h3>Personal Information</h3>
      <div class="form-row">
        <div class="form-field">
          <span class="form-label">Full Name:</span>
          <div class="form-value">${student.student_name}</div>
        </div>
        <div class="form-field">
          <span class="form-label">Father's Name:</span>
          <div class="form-value">${student.father_name || 'N/A'}</div>
        </div>
      </div>
      <div class="form-row">
        <div class="form-field">
          <span class="form-label">Mother's Name:</span>
          <div class="form-value">${student.mother_name || 'N/A'}</div>
        </div>
        <div class="form-field">
          <span class="form-label">UIDAI No (Aadhaar):</span>
          <div class="form-value">${student.uidai_number || 'N/A'}</div>
        </div>
      </div>
      <div class="form-row">
        <div class="form-field">
          <span class="form-label">Mobile Number:</span>
          <div class="form-value">${student.mobile}</div>
        </div>
        <div class="form-field">
          <span class="form-label">Email:</span>
          <div class="form-value">${student.email || 'N/A'}</div>
        </div>
      </div>
      <div class="form-row">
        <div class="form-field">
          <span class="form-label">Category:</span>
          <div class="form-value">${student.category || 'N/A'}</div>
        </div>
        <div class="form-field">
          <span class="form-label">PWD Category:</span>
          <div class="form-value">${student.pwd_category || 'N/A'}</div>
        </div>
      </div>
      <div class="form-row">
        <div class="form-field">
          <span class="form-label">Do You Want to Claim PWD:</span>
          <div class="form-value">${student.pwd_claim || 'No'}</div>
        </div>
      </div>
    </div>
    
    <!-- Address Information -->
    <div class="form-section">
      <h3>Address Information</h3>
      <div class="form-row">
        <div class="form-field">
          <span class="form-label">Village/Town/City:</span>
          <div class="form-value">${student.village_town_city || 'N/A'}</div>
        </div>
        <div class="form-field">
          <span class="form-label">Nearby:</span>
          <div class="form-value">${student.nearby || 'N/A'}</div>
        </div>
      </div>
      <div class="form-row">
        <div class="form-field">
          <span class="form-label">Police Station:</span>
          <div class="form-value">${student.police_station || 'N/A'}</div>
        </div>
        <div class="form-field">
          <span class="form-label">Post Office:</span>
          <div class="form-value">${student.post_office || 'N/A'}</div>
        </div>
      </div>
      <div class="form-row">
        <div class="form-field">
          <span class="form-label">Block:</span>
          <div class="form-value">${student.block || 'N/A'}</div>
        </div>
        <div class="form-field">
          <span class="form-label">District:</span>
          <div class="form-value">${student.district || 'N/A'}</div>
        </div>
      </div>
      <div class="form-row">
        <div class="form-field">
          <span class="form-label">State:</span>
          <div class="form-value">${student.state || 'N/A'}</div>
        </div>
        <div class="form-field">
          <span class="form-label">Pincode:</span>
          <div class="form-value">${student.pincode || 'N/A'}</div>
        </div>
      </div>
    </div>
    
    <!-- Qualification Information - Class 10th -->
    <div class="form-section">
      <h3>Qualification - Class 10th</h3>
      <div class="form-row">
        <div class="form-field">
          <span class="form-label">School Name:</span>
          <div class="form-value">${student.class_10th_school || 'N/A'}</div>
        </div>
        <div class="form-field">
          <span class="form-label">Subject:</span>
          <div class="form-value">${student.class_10th_subject || 'N/A'}</div>
        </div>
      </div>
      <div class="form-row">
        <div class="form-field">
          <span class="form-label">Marks Obtained:</span>
          <div class="form-value">${student.class_10th_marks_obtained || 'N/A'}</div>
        </div>
        <div class="form-field">
          <span class="form-label">Out of Total Marks:</span>
          <div class="form-value">${student.class_10th_total_marks || 'N/A'}</div>
        </div>
        <div class="form-field">
          <span class="form-label">Percentage (%):</span>
          <div class="form-value">${student.class_10th_percentage || 'N/A'}</div>
        </div>
      </div>
    </div>
    
    <!-- Qualification Information - Class 12th -->
    <div class="form-section">
      <h3>Qualification - Class 12th (If Applicable)</h3>
      <div class="form-row">
        <div class="form-field">
          <span class="form-label">School Name:</span>
          <div class="form-value">${student.class_12th_school || 'N/A'}</div>
        </div>
        <div class="form-field">
          <span class="form-label">Subject:</span>
          <div class="form-value">${student.class_12th_subject || 'N/A'}</div>
        </div>
      </div>
      <div class="form-row">
        <div class="form-field">
          <span class="form-label">Marks Obtained:</span>
          <div class="form-value">${student.class_12th_marks_obtained || 'N/A'}</div>
        </div>
        <div class="form-field">
          <span class="form-label">Out of Total Marks:</span>
          <div class="form-value">${student.class_12th_total_marks || 'N/A'}</div>
        </div>
        <div class="form-field">
          <span class="form-label">Percentage (%):</span>
          <div class="form-value">${student.class_12th_percentage || 'N/A'}</div>
        </div>
      </div>
    </div>
    
    <!-- Admission Details -->
    <div class="form-section">
      <h3>Admission Details</h3>
      <div class="form-row">
        <div class="form-field">
          <span class="form-label">Session:</span>
          <div class="form-value">${student.session || student.academic_year || 'N/A'}</div>
        </div>
        <div class="form-field">
          <span class="form-label">Shift:</span>
          <div class="form-value">${student.shift || 'N/A'}</div>
        </div>
      </div>
      <div class="form-row">
        <div class="form-field">
          <span class="form-label">Trade:</span>
          <div class="form-value">${student.trade}</div>
        </div>
        <div class="form-field">
          <span class="form-label">Date of Admission:</span>
          <div class="form-value">${student.admission_date || 'N/A'}</div>
        </div>
      </div>
      <div class="form-row">
        <div class="form-field">
          <span class="form-label">Status:</span>
          <div class="form-value">
            <span class="status-badge">${student.status}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Declaration -->
    <div class="declaration-box">
      <strong>Declaration:</strong> The details provided above were given by me. If any detail is incorrect, the institute has full authority to take action. I agree to abide by the rules and regulations of the institute.
      <div style="margin-top: 8px;">
        <strong>Agreed:</strong> ${student.declaration_agreed ? 'Yes' : 'Not specified'}
      </div>
    </div>
    
    <!-- Signatures -->
    <div class="signature-section">
      <div class="signature-box">
        <div class="signature-line">Student Signature</div>
      </div>
      <div class="signature-box">
        <div class="signature-line">Authorized Signatory</div>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <p>This is a computer-generated document.</p>
      <p>Generated on: ${new Date().toLocaleString()}</p>
    </div>
  </body>
</html>
  `;
};
