import React, {Component} from "react";
import Card from "../../card/Card";
import {InputText} from 'primereact/components/inputtext/InputText';
import AjaxRequest from "robe-react-commons/lib/connections/AjaxRequest";
import {InputSwitch} from 'primereact/components/inputswitch/InputSwitch';
import {Button} from 'primereact/components/button/Button';
import Toast from "robe-react-ui/lib/toast/Toast";
import SHA256 from "crypto-js/sha256";
import {Tooltip} from 'primereact/components/tooltip/Tooltip';
import Loading from "../../components/loadingbar/Loading";
import {InputMask} from 'primereact/components/inputmask/InputMask';

export default class UserManager extends Component {


    constructor(props) {
        super(props);
        this.state = {
            agencyUser: null,
            loading: true,
        };
        this.__save = this.__save.bind(this);
        this.__cancel = this.__cancel.bind(this);
    }


    render() {
        return (
            <Card header="Kullanıcı Yönetimi">
                <Loading
                    show={this.state.loading}
                />
                {
                    this.state.agencyUser &&
                    <div className="ui-grid ui-grid-responsive ui-fluid">

                        <div className="ui-grid-row">
                            <div className="ui-grid-col-2" style={{padding: '4px 10px'}}><label
                                htmlFor="agency">Acente</label></div>
                            <div className="ui-grid-col-6" style={{padding: '4px 10px'}}>
                                {this.state.agencyUser.agency.name}
                            </div>
                        </div>

                        <div className="ui-grid-row">
                            <div className="ui-grid-col-2" style={{padding: '4px 10px'}}><label
                                htmlFor="username">Kullanıcı Adı</label></div>
                            <div className="ui-grid-col-6" style={{padding: '4px 10px'}}>
                                {this.state.agencyUser.username}
                            </div>
                        </div>

                        <div className="ui-grid-row">
                            <div className="ui-grid-col-2" style={{padding: '4px 10px'}}><label
                                htmlFor="password">Şifre</label></div>
                            <div className="ui-grid-col-6" style={{padding: '4px 10px'}}>
                                <InputText id="name" onChange={(e) => {
                                    this.__updateProperty('password', e.target.value)
                                }} value={this.state.agencyUser.password}/>
                            </div>
                        </div>


                        <div className="ui-grid-row">
                            <div className="ui-grid-col-2" style={{padding: '4px 10px'}}><label
                                htmlFor="name">İsim</label></div>
                            <div className="ui-grid-col-6" style={{padding: '4px 10px'}}>
                                <InputText id="name" onChange={(e) => {
                                    this.__updateProperty('name', e.target.value)
                                }} value={this.state.agencyUser.name}/>
                            </div>
                        </div>

                        <div className="ui-grid-row">
                            <div className="ui-grid-col-2" style={{padding: '4px 10px'}}><label
                                htmlFor="surname">Soyisim</label></div>
                            <div className="ui-grid-col-6" style={{padding: '4px 10px'}}>
                                <InputText id="surname" onChange={(e) => {
                                    this.__updateProperty('surname', e.target.value)
                                }} value={this.state.agencyUser.surname}/>
                            </div>
                        </div>

                        <div className="ui-grid-row">
                            <div className="ui-grid-col-2" style={{padding: '4px 10px'}}><label
                                htmlFor="mobilePhone">Telefon</label></div>
                            <div className="ui-grid-col-6" style={{padding: '4px 10px'}}>
                                <InputMask id="mobilePhone"
                                           mask="0(999) 999-9999"
                                           placeholder="(999) 999-9999"
                                           onChange={(e) => {
                                               this.__updateProperty('mobilePhone', e.value)
                                           }} value={this.state.agencyUser.mobilePhone}>
                                </InputMask>
                            </div>
                        </div>

                        <div className="ui-grid-row">
                            <div className="ui-grid-col-2" style={{padding: '4px 10px'}}><label
                                htmlFor="email">E-Mail</label></div>
                            <div className="ui-grid-col-6" style={{padding: '4px 10px'}}>
                                <InputText id="email" onChange={(e) => {
                                    this.__updateProperty('email', e.target.value)
                                }} value={this.state.agencyUser.email}/>
                            </div>
                        </div>

                        <div className="ui-grid-row">
                            <div className="ui-grid-col-2" style={{padding: '4px 10px'}}><label
                                htmlFor="sendingMail">E-Mail gelsin mi ?</label></div>
                            <div className="ui-grid-col-6" style={{padding: '4px 10px'}}>
                                <Tooltip for="#sendingMail" title="Hatırlatma mailleri gönderme durumu"
                                         tooltipPosition="top"/>
                                <InputSwitch id="sendingMail"
                                             onLabel="Evet" offLabel="Hayır"
                                             checked={this.state.agencyUser.sendingMail}
                                             onChange={(e) => {
                                                 this.__updateProperty('sendingMail', e.value)
                                             }}/>
                            </div>
                        </div>

                        <div className="ui-grid-row">
                            <div className="ui-grid-col-2" style={{padding: '4px 10px'}}><label
                                htmlFor="endDate">Son Kullanım Tarihi</label></div>
                            <div className="ui-grid-col-6" style={{padding: '4px 10px'}}>
                                {this.__formatDate(new Date(this.state.agencyUser.endDate))}
                            </div>
                        </div>

                        <div className="ui-grid-row">
                            <div className="ui-grid-col-2" style={{padding: '4px 10px'}}>
                                <Button label="Güncelle" icon="fa-check" onClick={this.__save}
                                        className="ui-button-success"/>
                            </div>
                            <div className="ui-grid-col-2" style={{padding: '4px 10px'}}>
                                <Button label="İptal" icon="fa-close" onClick={this.__cancel}
                                        className="ui-button-info"/>
                            </div>
                        </div>

                    </div>
                }

            </Card>
        );
    }

    __save() {
        let agencyUser = this.state.agencyUser;

        if (agencyUser.password !== this.state.oldAgencyUser.password) {
            agencyUser.password = SHA256(agencyUser.password).toString();
        }
        this.request = new AjaxRequest({
            url: "agency-user",
            type: "PUT"
        });

        this.request.call(agencyUser, undefined, function (response) {
            if (response != null) {
                Toast.success("Kayıt Başarılı");
            } else {
                Toast.error("Kayıt Başarısız")
            }
            this.__getAgencyUser();
            this.forceUpdate();
        }.bind(this));
    }

    __cancel() {

        this.__getAgencyUser();

    }

    __formatDate(d) {
        let month = String(d.getMonth() + 1);
        let day = String(d.getDate());
        let year = String(d.getFullYear());

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return `${year}-${month}-${day}`;
    }

    __updateProperty(property, value) {
        let agencyUser = this.state.agencyUser;
        agencyUser[property] = value;
        this.setState({agencyUser: agencyUser});
    }

    __getAgencyUser() {
        this.request = new AjaxRequest({
            url: "agency-user/agencyUser",
            type: "GET"
        });
        this.request.call(undefined, undefined, function (response) {
            if (response != null) {
                this.setState({agencyUser: response, oldAgencyUser: response, loading: false});
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