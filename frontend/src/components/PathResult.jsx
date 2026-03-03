import PathNode from './PathNode'
import './PathResult.css'

export default function PathResult({ data }) {
  return (
    <div className="path-result">
      <div className="path-result__header">
        <h2 className="path-result__title">{data.title}</h2>
        <p className="path-result__summary">{data.summary}</p>
        <span className="path-result__duration">{data.total_duration}</span>
      </div>

      <div className="path-result__nodes">
        {data.nodes.map((node) => (
          <PathNode key={node.id} node={node} />
        ))}
      </div>
    </div>
  )
}
