import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Header from './components/Header'
import ProjectItem from './components/ProjectItem'
import './App.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

// Replace your code here
class App extends Component {
  state = {
    projectsList: [],
    selectedCategoryList: categoriesList[0].id,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProjectsList()
  }

  onChangeCategory = event => {
    this.setState({selectedCategoryList: event.target.value}, () =>
      this.getProjectsList(),
    )
  }

  getProjectsList = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {selectedCategoryList} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${selectedCategoryList}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)
    if (response.ok) {
      const updateedData = data.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))
      this.setState({
        projectsList: updateedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onChangeCategory = event => {
    this.setState({
      selectedCategoryList: event.target.value,
    })
  }

  renderSuccessView = () => {
    const {projectsList} = this.state

    return (
      <ul className="unordred-list">
        {projectsList.map(each => (
          <ProjectItem each={each} key={each.id} />
        ))}
      </ul>
    )
  }

  onRetry = () => {
    this.getProjectsList()
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading"> Oops! Something Went Wrong</h1>
      <p className="failure-para">
        We cannot seem to find the page you are looking for.
      </p>
      <button className="btn-elemenet" type="button" onClick={this.onRetry}>
        Retry
      </button>
    </div>
  )

  renderLoader = () => (
    <div className="loader-con" data-testid="loader">
      <Loader
        type="ThreeDots"
        color="#00BFFF"
        height={50}
        width={50}
        testid="loader"
      />
    </div>
  )

  renderView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatus.success:
        return this.renderSuccessView()
      case apiStatus.failure:
        return this.renderFailureView()
      case apiStatus.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    const {selectedCategoryList} = this.state

    return (
      <div className="app-container">
        <Header />
        <div className="home-container">
          <select
            className="select-option"
            value={selectedCategoryList}
            onChange={this.onChangeCategory}
          >
            {categoriesList.map(each => (
              <option value={each.id} key={each.id}>
                {each.displayText}
              </option>
            ))}
          </select>
          {this.renderView()}
        </div>
      </div>
    )
  }
}

export default App
