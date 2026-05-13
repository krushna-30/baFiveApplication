import './MessagesPage.css'

interface MessagesPageProps {
  matches: any[]
}

export default function MessagesPage({ matches }: MessagesPageProps) {
  return (
    <div className="messages-page">
      <div className="messages-container">
        <h2>Messages</h2>
        
        {matches.length === 0 ? (
          <div className="empty-state">
            <p>No connections yet</p>
            <p className="subtext">Connect with colleagues on the Discover tab to start messaging</p>
          </div>
        ) : (
          <div className="conversations-list">
            {matches.map((match) => (
              <div key={match.id} className="conversation-item">
                <img src={match.image} alt={match.name} />
                <div className="conversation-info">
                  <h4>{match.name}</h4>
                  <p>{match.department}</p>
                </div>
                <div className="conversation-action">
                  <button className="btn-message">Message</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
