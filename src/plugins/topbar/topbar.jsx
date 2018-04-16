import React, { cloneElement } from "react"
import PropTypes from "prop-types"

//import "./topbar.less"
import Logo from "./logo_small.png"

export default class Topbar extends React.Component {

  static propTypes = {
    layoutActions: PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props, context)
    this.state = { url: props.specSelectors.url(), selectedIndex: 0 }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ url: nextProps.specSelectors.url() })
  }

  onUrlChange =(e)=> {
    let {target: {value}} = e
    this.setState({url: value})
  }

  loadSpec = (url) => {
    this.props.specActions.updateUrl(url)
    this.props.specActions.download(url)
  }

  onUrlSelect =(e)=> {
    let url = e.target.value || e.target.href
    this.loadSpec(url)
    this.setSelectedUrl(url)
    e.preventDefault()
  }

  downloadUrl = (e) => {
    this.loadSpec(this.state.url)
    e.preventDefault()
  }

  setSelectedUrl = (selectedUrl) => {
    const configs = this.props.getConfigs()
    const urls = configs.urls || []

    if(urls && urls.length) {
      if(selectedUrl)
      {
        urls.forEach((spec, i) => {
          if(spec.url === selectedUrl)
            {
              this.setState({selectedIndex: i})
            }
        })
      }
    }
  }

  componentWillMount() {
    const configs = this.props.getConfigs()
    const urls = configs.urls || []

    if(urls && urls.length) {
      let primaryName = configs["urls.primaryName"]
      if(primaryName)
      {
        urls.forEach((spec, i) => {
          if(spec.name === primaryName)
            {
              this.setState({selectedIndex: i})
            }
        })
      }
    }
  }

  componentDidMount() {
    const urls = this.props.getConfigs().urls || []

    if(urls && urls.length) {
      this.loadSpec(urls[this.state.selectedIndex].url)
    }
  }

  onFilterChange =(e) => {
    let {target: {value}} = e
    this.props.layoutActions.updateFilter(value)
  }

  render() {
    let { getComponent, specSelectors, getConfigs } = this.props
    const Button = getComponent("Button")
    const Link = getComponent("Link")

    let isLoading = specSelectors.loadingStatus() === "loading"
    let isFailed = specSelectors.loadingStatus() === "failed"

    let isUSRegion = window.location.hostname == "apps.sematext.com" 

    let inputStyle = {}
    if(isFailed) inputStyle.color = "red"
    if(isLoading) inputStyle.color = "#aaa"

    const { urls } = getConfigs()
    let control = []
    let formOnSubmit = null

    if(urls) {
      let rows = []
      urls.forEach((link, i) => {
        rows.push(<option key={i} value={link.url}>{link.name}</option>)
      })

      control.push(
        <label className="select-label" htmlFor="select"><span>Select a spec</span>
          <select id="select" disabled={isLoading} onChange={ this.onUrlSelect } value={urls[this.state.selectedIndex].url}>
            {rows}
          </select>
        </label>
      )
    }
    else {
      formOnSubmit = this.downloadUrl
      control.push(<input className="download-url-input" type="text" onChange={ this.onUrlChange } value={this.state.url} disabled={isLoading} style={inputStyle} />)
      control.push(<Button className="download-url-button" onClick={ this.downloadUrl }>Explore</Button>)
    }

    let region = (<div className="region">
      <span>US</span>|<a href="https://apps.eu.sematext.com/api-explorer/">EU</a>
    </div>)
    if (!isUSRegion) {
      region = (<div className="region">
      <a href="https://apps.sematext.com/api-explorer/">US</a>|<span>EU</span>
    </div>)
    }

    // SEMATEXT CHANGES START
    return (
      <div className="topbar">
        <div className="wrapper">
          <div className="topbar-wrapper">
            <Link href="#">
              <img height="30" width="30" src={ Logo } alt="Sematext Cloud API Explorer"/>
              <span>Sematext Cloud API (v3)</span>
            </Link>
            <div className="sematext-links-container">
              <div className="sematext-dropdown">
                <a className="sematext-dropbtn">Logs API</a>
                <div className="sematext-dropdown-content">
                  <a href="https://sematext.com/docs/logs/index-events-via-elasticsearch-api/">Send Logs</a>
                  <a href="https://sematext.com/docs/logs/search-through-the-elasticsearch-api/">Search Logs</a>
                </div>
              </div>
              {/* <a href="#">Metrics API</a> */}
              <div className="sematext-dropdown">
                <a className="sematext-dropbtn">Events API</a>
                <div className="sematext-dropdown-content">
                  <a href="https://sematext.com/docs/events/#adding-events">Send Events</a>
                  <a href="https://sematext.com/docs/events/#searching-events">Search Events</a>
                </div>
              </div>
              <a href="https://www.sematext.com/docs/api/">More Info</a>
              {region}
            </div>
          </div>
        </div>
      </div>
    )
    // SEMATEXT CHANGES END
  }
}

Topbar.propTypes = {
  specSelectors: PropTypes.object.isRequired,
  specActions: PropTypes.object.isRequired,
  getComponent: PropTypes.func.isRequired,
  getConfigs: PropTypes.func.isRequired
}
