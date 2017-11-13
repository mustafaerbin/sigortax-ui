import React, {Component} from "react";
import Card from "../../card/Card";
import {TabView, TabPanel} from 'primereact/components/tabview/TabView';
import CustomerGercek from "./CustomerGercek";
import CustomerTuzel from "./CustomerTuzel";

export default class Customer extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <Card header="Müşteri Yönetimi" loading={this.state.loading}>
                <TabView>
                    <TabPanel header="Gerçek" leftIcon="fa-user-circle-o" activeIndex="1"
                              onTabChange={() => this.__onTabChange()}>
                        <CustomerGercek type="GERCEK"/>
                    </TabPanel>
                    <TabPanel header="Tüzel" leftIcon="fa-user-circle" activeIndex="2"
                              onTabChange={this.__onTabChange()}>
                        <CustomerTuzel type="TUZEL"/>
                    </TabPanel>
                </TabView>
                <br/><br/><br/><br/>
            </Card>
        );
    }

    __onTabChange() {

        let a = 4;

    }

    componentDidMount() {

    }

}