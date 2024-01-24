import './index.css'

const ProjectItem = props => {
  const {each} = props
  const {imageUrl, name} = each

  return (
    <li className="list-elem">
      <img src={imageUrl} alt={name} className="container-image" />
      <h1 className="list-head"> {name}</h1>
    </li>
  )
}

export default ProjectItem
