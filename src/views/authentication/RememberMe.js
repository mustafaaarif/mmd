import React, { Component } from 'react'
// import {CustomInput} from 'reactstrap';
import { setCookie } from "../../jwt/_helpers/cookie";

export default class RememberMe extends Component {
  constructor(props) {
    super(props);
    this.state = {check: true};
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    setCookie('rememberBe', "1")
  }

  handleChange(e) {
    if (e) {
      this.setState({check: e})
      setCookie('rememberBe', "1")
    } else {
      this.setState({check: e})
      setCookie('rememberBe', "0")
    }
  }

  render() {
    return (
      <div style={{display: 'flex'}}>
      <input type="checkbox" className='me-2' id="rememberMeCheck" checked={this.state.check}  onChange={(e) => this.handleChange(e.target.checked)}/>
      {" "}Remember Me
    </div>
    )
  }
}
