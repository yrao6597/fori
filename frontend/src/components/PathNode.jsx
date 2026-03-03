import './PathNode.css'

const TYPE_CONFIG = {
  youtube:  { icon: '▶', label: 'YouTube'       },
  podcast:  { icon: '◎', label: 'Podcast'       },
  article:  { icon: '✦', label: 'Article'       },
  x_follow: { icon: '✕', label: 'X / Twitter'  },
}

export default function PathNode({ node }) {
  const config = TYPE_CONFIG[node.type] ?? { icon: '◆', label: node.type }

  return (
    <div className={`path-node path-node--${node.type}`}>
      <div className="path-node__header">
        <span className="path-node__icon">{config.icon}</span>
        <div className="path-node__meta">
          <span className="path-node__platform">{node.platform}</span>
          <span className="path-node__dot">·</span>
          <span className="path-node__time">{node.estimated_time}</span>
        </div>
      </div>

      <h3 className="path-node__title">{node.title}</h3>
      <p className="path-node__creator">{node.creator}</p>
      <p className="path-node__annotation">"{node.annotation}"</p>
    </div>
  )
}
