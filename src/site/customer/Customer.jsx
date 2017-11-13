import React, {Component} from "react";
import Card from "../../card/Card";
import {TabView, TabPanel} from 'primereact/components/tabview/TabView';
import CustomerGercek from "./CustomerGercek";
import CustomerTuzel from "./CustomerTuzel";
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';

export default class Customer extends Component {

    constructor(props) {
        super(props);
        this.state = {key: 1, k: null};

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
            <Card header="Müşteri Yönetimi" loading={this.state.loading}>
                <Tabs activeKey={this.state.key} onSelect={this.handleSelect} >
                    <Tab eventKey={1} title="GERÇEK"><CustomerGercek type="GERCEK"/></Tab>
                    <Tab eventKey={2} title="TÜZEL">{this.state.k}</Tab>
                </Tabs>
                <br/><br/><br/><br/>
            </Card>
        );
    }

    __onTabChange() {
        let a = 4;
    };

    componentDidMount() {
    };

}