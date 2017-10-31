import React, {Component} from "react";
import Card from "../../card/Card";
import ShallowComponent from "robe-react-commons/lib/components/ShallowComponent";
import {InputText} from 'primereact/components/inputtext/InputText';
import AjaxRequest from "robe-react-commons/lib/connections/AjaxRequest";

export default class UserManager extends Component {


    constructor(props) {
        super(props);
        this.state = {}
    }


    render() {
        return (
            <Card header="Kullanıcı Yönetimi">
                {
                    this.state.agencyUser &&
                    <div className="ui-grid ui-grid-responsive ui-fluid">

                        <div className="ui-grid-row">
                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                htmlFor="name">İsim</label></div>
                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                {this.state.agencyUser.name}
                            </div>
                        </div>

                    </div>
                }
            </Card>
        );
    }

    __getAgencyUser() {
        this.request = new AjaxRequest({
            url: "agency-user/agencyUser",
            type: "GET"
        });
        this.request.call(undefined, undefined, function (response) {
            if (response != null) {
                this.setState({agencyUser: response});
            } else {
                Toast.error("İşlem Başarısız")
            }
            this.forceUpdate();
        }.bind(this));
    }

    componentDidMount() {
        this.__getAgencyUser();
    }

}