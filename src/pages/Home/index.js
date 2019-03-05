import React, { Component, Fragment } from 'react';
import PageHeader from '../../components/PageHeader'
export default class Home extends Component {
  componentDidMount () {
    console.log(this.props);
  }
  render(){
    return(
      <div>
    <PageHeader title='测试'></PageHeader>
    <div>1111111111111</div>
    </div>
   )
  }
}