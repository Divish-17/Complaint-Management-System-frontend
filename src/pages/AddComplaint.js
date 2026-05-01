import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Send, ArrowLeft, MessageSquare, AlertCircle } from "lucide-react";
import axios from "axios";
import "./AddComplaint.css";

const AddComplaint = () => {
  const [formData, setFormData] = useState({ title: "", description: "", category: "General", priority: "Medium" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      setMessage({ text: "Please fill in all required fields.", type: "error" });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/complaints`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage({ text: "Grievance submitted successfully! Redirecting...", type: "success" });
      setTimeout(() => navigate("/userdashboard"), 2000);
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "Failed to submit grievance. Please try again.",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-complaint-wrapper">
      <div className="container">
        <button className="btn-back" onClick={() => navigate("/userdashboard")}>
          <ArrowLeft size={18} /> Back to Dashboard
        </button>

        <div className="form-card-container">
          <div className="form-info-side">
            <div className="info-content">
              <div className="icon-badge">
                <MessageSquare size={32} />
              </div>
              <h2>Submit Your Grievance</h2>
              <p>Your feedback helps us maintain a better educational environment. Please provide as much detail as possible.</p>

              <ul className="guidelines">
                <li><AlertCircle size={14} /> Be clear and concise in the title</li>
                <li><AlertCircle size={14} /> Provide specific details in description</li>
                <li><AlertCircle size={14} /> Expect a response within 3-5 working days</li>
              </ul>
            </div>
          </div>

          <div className="form-input-side glass-card">
            {message.text && (
              <div className={`alert alert-${message.type}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="complaint-form">
              <div className="form-group">
                <label>Grievance Title*</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Library AC not working"
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="select-input">
                  <option value="General">General</option>
                  <option value="Academic">Academic</option>
                  <option value="Facilities">Facilities</option>
                  <option value="Hostel">Hostel</option>
                  <option value="Fees">Fees/Finance</option>
                </select>
              </div>

              <div className="form-group">
                <label>Priority Level</label>
                <select name="priority" value={formData.priority} onChange={handleChange} className="select-input">
                  <option value="Low">Low - Minor issue</option>
                  <option value="Medium">Medium - Standard review</option>
                  <option value="High">High - Requires attention</option>
                  <option value="Urgent">Urgent - Financial/Safety issue</option>
                </select>
              </div>

              <div className="form-group">
                <label>Detailed Description*</label>
                <textarea
                  name="description"
                  rows="6"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Provide a detailed explanation of your issue..."
                  required
                ></textarea>
              </div>

              <div className="form-footer">
                <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
                  {loading ? "Submitting..." : (
                    <>
                      Submit Report <Send size={18} style={{ marginLeft: '8px' }} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddComplaint;
