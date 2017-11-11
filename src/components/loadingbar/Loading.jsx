import React from "react";
import Loadingg from 'react-loading-bar'
import 'react-loading-bar/dist/index.css'

export default class Loading extends React.Component {


    constructor() {
        super();
        this.state = {
            show: false
        };

    }

    render() {
        return (
            <div>
                <Loadingg
                    show={this.props.show}
                    color="blue"
                    showSpinner={true}
                />
            </div>
        );
    }

    onShow = () => {
        this.setState({show: true})
    };

    onHide = () => {
        this.setState({show: false})
    };


}