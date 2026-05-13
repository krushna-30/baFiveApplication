import './ProfilePage.css'

interface ProfilePageProps {
  currentUser: any
}

export default function ProfilePage({ currentUser }: ProfilePageProps) {
  return (
    <div className="profile-page">
      <div className="profile-container">
        <h2>Your Profile</h2>
        
        <div className="profile-card">
          <div className="profile-header-section">
            <img src={currentUser.profileImage} alt={currentUser.name} className="profile-image" />
            <div className="profile-details">
              <h3>{currentUser.name}</h3>
              <p className="department">{currentUser.department}</p>
              <p className="email">{currentUser.email}</p>
            </div>
          </div>

          <div className="profile-section">
            <h4>Bio</h4>
            <p>Add your professional bio and interests here</p>
          </div>

          <div className="profile-section">
            <h4>Interests</h4>
            <div className="interests-list">
              <span className="interest-badge">Networking</span>
              <span className="interest-badge">Professional Development</span>
              <span className="interest-badge">Team Building</span>
            </div>
          </div>

          <button className="btn-edit-profile">Edit Profile</button>
        </div>
      </div>
    </div>
  )
}
