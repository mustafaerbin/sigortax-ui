import React, {Component} from "react";
import Card from "../card/Card";
import { Chart } from 'primereact/components/chart/Chart';
import ShallowComponent from "robe-react-commons/lib/components/ShallowComponent";
import {InputText} from 'primereact/components/inputtext/InputText';
import AjaxRequest from "robe-react-commons/lib/connections/AjaxRequest";

export default class HomePage extends Component {


    constructor(props) {
        super(props);
        this.state = {}
    }


    render() {
        return (
            <Card header="ANASAYFA">
                <div>


                </div>
            </Card>
        );
    }


    componentDidMount() {
    }

}