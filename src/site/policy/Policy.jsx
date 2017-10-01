import React, {Component} from "react";
import ShallowComponent from "robe-react-commons/lib/components/ShallowComponent";
import {DataTable} from "primereact/components/datatable/DataTable";
import {Column} from "primereact/components/column/Column";
import {InputText} from "primereact/components/inputtext/InputText";
import Card from "../../card/Card";
import AjaxRequest from "robe-react-commons/lib/connections/AjaxRequest";
import {Dialog} from "primereact/components/dialog/Dialog";
import {Button} from 'primereact/components/button/Button';

export default class Police extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }


    render() {
        return (
            <Card header="Poliçe Yönetimi">
                <div>


                </div>
            </Card>
        );
    }


    componentDidMount() {
    }

}