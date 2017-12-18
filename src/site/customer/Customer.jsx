import React, {Component} from "react";
import Card from "../../card/Card";
import CustomerGercek from "./CustomerGercek";
import CustomerTuzel from "./CustomerTuzel";
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';
import {BreadCrumb} from 'primereact/components/breadcrumb/BreadCrumb';

export default class Customer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            key: 1,
            k: null
        };

        this.handleSelect = this.handleSelect.bind(this);
    }

    handleSelect(key) {
        if (key === 2) {
            let k = <CustomerTuzel type="TUZEL"/>;
            this.setState({k: k});
        }
        this.setState({key});
        this.forceUpdate();
    };

    render() {
        return (
            <Card loading={this.state.loading}>
                <BreadCrumb model={[
                    {label: 'Site'},
                    {label: 'Müşteri Yönetimi'}
                ]}/>
                <Tabs activeKey={this.state.key} onSelect={this.handleSelect}>
                    <Tab eventKey={1} title="GERÇEK"><CustomerGercek type="GERCEK"/></Tab>
                    <Tab eventKey={2} title="TÜZEL">{this.state.k}</Tab>
                </Tabs>
                <br/><br/><br/><br/>
            </Card>
        );
    }
}