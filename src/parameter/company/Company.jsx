import React, {Component} from "react";
import Card from "../../card/Card";
import ShallowComponent from "robe-react-commons/lib/components/ShallowComponent";
import {InputText} from 'primereact/components/inputtext/InputText';

export default class Company extends Component {


    constructor(props) {
        super(props);
        this.state = {}
    }


    render() {
        return (
            <Card header="Şirket Yönetimi">
                <div>


                </div>
            </Card>
        );
    }


    componentDidMount() {
    }

}