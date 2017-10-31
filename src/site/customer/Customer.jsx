import React, {Component} from "react";
import {Application, ShallowComponent} from "robe-react-commons";
import {DataTable} from "primereact/components/datatable/DataTable";
import {Column} from "primereact/components/column/Column";
import {InputText} from "primereact/components/inputtext/InputText";
import Card from "../../card/Card";
import AjaxRequest from "robe-react-commons/lib/connections/AjaxRequest";
import {Dialog} from "primereact/components/dialog/Dialog";
import {Button} from 'primereact/components/button/Button';
import {Tooltip} from 'primereact/components/tooltip/Tooltip';
import {InputTextarea} from 'primereact/components/inputtextarea/InputTextarea';
import Toast from "robe-react-ui/lib/toast/Toast";
import {Dropdown} from 'primereact/components/dropdown/Dropdown';
import ReSelectInput from "../../components/selectinput/ReSelectInput";
import {Modal} from "react-bootstrap";
import CompanySubProduct from "../../parameter/companySubProduct/CompanySubProduct";
import Calendar from "../../components/calendar/CalendarTR";
import {FileUpload} from 'primereact/components/fileupload/FileUpload';
import FaIcon from "robe-react-ui/lib/faicon/FaIcon";
import {InputSwitch} from 'primereact/components/inputswitch/InputSwitch';
import {InputMask} from 'primereact/components/inputmask/InputMask';

export default class Customer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            customerList: [],
            filters: {},
            selectedCustomer: {},
            policyAddButtonDisable: true,
            policy: null,
            company: {},
            startDate: null,
            loading: true,
        };

        this.__saveCustomer = this.__saveCustomer.bind(this);
        this.__savePolicy = this.__savePolicy.bind(this);
        this.onFilter = this.onFilter.bind(this);
        this.__newCustomerButton = this.__newCustomerButton.bind(this);
        this.__actionTemplate = this.__actionTemplate.bind(this);
        this.onPolicyCompanyChange = this.onPolicyCompanyChange.bind(this);
        this.__updateProperty = this.__updateProperty.bind(this);
        this.__addPolicyButton = this.__addPolicyButton.bind(this);
        this.__handleChangeDropDownCompany = this.__handleChangeDropDownCompany.bind(this);

    }

    onFilter(e) {
        this.setState({filters: e.filters});
    }

    onPolicyCompanyChange(e) {
        this.setState({company: e});
    }

    // Girdin sonunda ki işlemler colonu
    __actionTemplate(rowData, column) {
        return (
            <div className="ui-helper-clearfix" style={{width: '100%'}}>
                <Tooltip for="#detailButton" title="Detay" tooltipPosition="top"/>
                <Button id="detailButton" type="button" icon="fa-search" className="ui-button-info"
                        onClick={(rowData) => {
                            this.__detailButton(rowData, column)
                        }}>
                </Button>
                <Tooltip for="#editButton" title="Güncelle" tooltipPosition="top"/>
                <Button id="editButton" type="button" icon="fa-edit" className="ui-button-warning"
                        onClick={(rowData) => {
                            this.__editButton(rowData, column)
                        }}>
                </Button>
                {/*<Tooltip for="#deleteButton" title="Sil" tooltipPosition="top"/>*/}
                {/*<Button id="deleteButton" type="button" icon="fa-trash" className="ui-button-danger"*/}
                {/*onClick={(rowData) => {*/}
                {/*this.__deleteButton(rowData, column)*/}
                {/*}}>*/}
                {/*</Button>*/}
            </div>
        );
    }

    // Kayıt'ın aktif pasif durum kolonu
    __statusRow(column) {
        if (column.status)
            return <td><FaIcon code={"fa-check-square-o "}/></td>;
        else
            return <td><FaIcon code={"fa-square-o "}/></td>;
    }

    onUpload(event) {
        let eventa = event
    }

    render() {
        let header =
            <div style={{'textAlign': 'left'}}>
                <i className="fa fa-search" style={{margin: '4px 4px 0 0'}}></i>
                <InputText type="search" onInput={(e) => this.setState({globalFilter: e.target.value})}
                           placeholder="Genel Arama" size="50"/>
            </div>;

        let tableFooter =
            <div className="ui-helper-clearfix" style={{width: '100%'}}>
                <Button id="__newCustomerButton" style={{float: 'left'}} icon="fa-plus" label="Yeni Müşteri"
                        onClick={this.__newCustomerButton}
                        className="ui-button-success"/>
                <Button style={{float: 'left'}} icon="fa-plus" label="Poliçe Ekle" onClick={this.__addPolicyButton}
                        disabled={this.state.policyAddButtonDisable}
                        className="ui-button-success"/>
            </div>;

        let dialogFooter =
            <div className="ui-dialog-buttonpane ui-helper-clearfix">
                <Button label="Kaydet" icon="fa-check" onClick={this.__saveCustomer}
                        className="ui-button-success"/>
                <Button icon="fa-close" label="İptal"
                        onClick={() => {
                            this.setState({displayDialog: false});
                        }}
                />
            </div>;

        let dialogFooterDetail =
            <div className="ui-dialog-buttonpane ui-helper-clearfix">
                <Button icon="fa-close" label="Kapat"
                        onClick={() => {
                            this.setState({displayDialogDetail: false});
                        }}
                />
            </div>

        let dialogPolicyFooter =
            <div className="ui-dialog-buttonpane ui-helper-clearfix">
                <Button label="Kaydet" icon="fa-check" onClick={this.__savePolicy}
                        className="ui-button-success"/>
                <Button icon="fa-close" label="İptal"
                        onClick={() => {
                            this.setState({displayDialogPolicy: false});
                        }}
                />
            </div>;

        return (
            <Card header="Müşteri Yönetimi">
                <div>
                    <div className="content-section implementation">
                        <DataTable value={this.state.customerList}
                                   paginator={true} rows={10} header={header}
                                   globalFilter={this.state.globalFilter}
                                   filters={this.state.filters}
                                   selectionMode="single"
                                   footer={tableFooter}
                                   selection={this.state.selectedCustomer}
                            // onSelectionChange={(e) => {
                            //     this.setState({selectedCustomer: e.data, policyAddButtonDisable: false});
                            // }}
                                   onSelectionChange={(e) => {
                                       this.__onSelectionChange(e.data)
                                   }}
                                   onFilter={this.onFilter}
                        >
                            <Column field="name" header="İsim" filter={true}/>
                            <Column field="surname" header="Soyisim" filter={true}/>
                            <Column field="mobilePhone" header="Telefon" filter={true}/>
                            <Column field="email" header="E-Mail" filter={true}/>
                            <Column field="status" header="Durum" body={this.__statusRow}
                                    style={{textAlign: 'center', width: '5em'}}/>
                            <Column header="İşlemler" body={this.__actionTemplate}
                                    style={{textAlign: 'center', width: '7em'}}>
                            </Column>
                        </DataTable>
                    </div>

                    {/*güncelle ve kaydet popup*/}
                    <div className="content-section implementation">
                        {
                            this.state.customer &&
                            <Modal show={this.state.displayDialog}
                                   onHide={() => {
                                       this.setState({displayDialog: false})
                                   }}>
                                <Modal.Header>
                                    <Modal.Title>{this.state.headerDialog}</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <div className="ui-grid ui-grid-responsive ui-fluid">
                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="name">İsim</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                <InputText id="name" onChange={(e) => {
                                                    this.__updateProperty('name', e.target.value)
                                                }} value={this.state.customer.name}/>
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="surname">Soyisim</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                <InputText id="surname" onChange={(e) => {
                                                    this.__updateProperty('surname', e.target.value)
                                                }} value={this.state.customer.surname}/>
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="mobilePhone">Mobil Tel</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                {/*<InputText id="mobilePhone" onChange={(e) => {*/}
                                                {/*this.__updateProperty('mobilePhone', e.target.value)*/}
                                                {/*}} value={this.state.customer.mobilePhone}/>*/}
                                                <InputMask id="mobilePhone"
                                                           mask="0(999) 999-9999"
                                                           placeholder="(999) 999-9999"
                                                           onChange={(e) => {
                                                               this.__updateProperty('mobilePhone', e.value)
                                                           }} value={this.state.customer.mobilePhone}>
                                                </InputMask>
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="email">E-Mail</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                <InputText id="email" onChange={(e) => {
                                                    this.__updateProperty('email', e.target.value)
                                                }} value={this.state.customer.email}/>
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="tc">TC Kimlik No</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                <InputText id="tc" onChange={(e) => {
                                                    this.__updateProperty('tc', e.target.value)
                                                }} value={this.state.customer.tc}/>
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="job">Meslek</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                <InputText id="job" onChange={(e) => {
                                                    this.__updateProperty('job', e.target.value)
                                                }} value={this.state.customer.job}/>
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="address">Adres</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                <InputTextarea id="address" onChange={(e) => {
                                                    this.__updateProperty('address', e.target.value)
                                                }} value={this.state.customer.address}/>
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="description">Açıklama</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                <InputTextarea id="description" onChange={(e) => {
                                                    this.__updateProperty('description', e.target.value)
                                                }} value={this.state.customer.description}/>
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="status">Durum</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                <InputSwitch id="status"
                                                             onLabel="Aktif" offLabel="Pasif"
                                                             checked={this.state.customer.status}
                                                             onChange={(e) => {
                                                                 this.__updateProperty('status', e.value)
                                                             }}/>
                                            </div>
                                        </div>

                                    </div>

                                </Modal.Body>

                                <Modal.Footer>
                                    {dialogFooter}
                                </Modal.Footer>

                            </Modal>
                        }
                    </div>
                    {/*detay popup*/}
                    <div className="content-section implementation">
                        <Modal show={this.state.displayDialogDetail}
                               onHide={() => {
                                   this.setState({displayDialogDetail: false})
                               }}>
                            <Modal.Header>
                                <Modal.Title>{this.state.headerDialog}</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {
                                    this.state.customer &&
                                    <div className="ui-grid ui-grid-responsive ui-fluid">

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="name">İsim</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                {this.state.customer.name}
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="surname">Soyisim</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                {this.state.customer.surname}
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="mobilePhone">Mobil Tel</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                {this.state.customer.mobilePhone}
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="email">E-Mail</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                {this.state.customer.email}
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="tc">TC Kimlik No</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                {this.state.customer.tc}
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="job">Meslek</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                {this.state.customer.job}
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="address">Adres</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                {this.state.customer.address}
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="description">Açıklama</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                {this.state.customer.description}
                                            </div>
                                        </div>

                                    </div>
                                }
                            </Modal.Body>

                            <Modal.Footer>
                                {dialogFooterDetail}
                            </Modal.Footer>

                        </Modal>
                    </div>
                    {/*poliçe ekle popup*/}
                    <div className="content-section implementation">
                        <Modal show={this.state.displayDialogPolicy}
                               onHide={() => {
                                   this.setState({displayDialogPolicy: false})
                               }}>
                            <Modal.Header>
                                <Modal.Title>Poliçe Ekle</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {
                                    this.state.policy && <div className="ui-grid ui-grid-responsive ui-fluid">

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="musteri">Müşteri</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                <label>{this.state.policy.customer.name}{' '}{this.state.policy.customer.surname}
                                                </label>
                                            </div>
                                        </div>


                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="company">Şirket</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                <Dropdown
                                                    value={this.state.policy.company.label}
                                                    options={this.state.companyList}
                                                    onChange={(e) => {
                                                        this.__handleChangeDropDownCompany("company", e)
                                                    }}
                                                    style={{width: 'ui-grid-col-8'}}
                                                    placeholder="Şirket Seçiniz"
                                                    editable={true}
                                                    filter={true}
                                                    filterPlaceholder="Şirket Ara"
                                                    filterBy="label,value"
                                                />
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="companyProduct">Şirket Ürünü</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                <Dropdown value={this.state.policy.companyProduct.label}
                                                          options={this.state.companyProductList}
                                                          onChange={(e) => {
                                                              this.__handleChangeDropDownCompany("companyProduct", e)
                                                          }}
                                                          style={{width: 'ui-grid-col-8'}}
                                                          placeholder="Ürün Seçiniz"
                                                          editable={true}
                                                          filter={true}
                                                          filterPlaceholder="Ürün Ara"
                                                          filterBy="label,value"
                                                />
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="companySubProduct">Şirket Alt Ürünü</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                <Dropdown value={this.state.policy.companySubProduct.label}
                                                          options={this.state.companySubProductList}
                                                          onChange={(e) => {
                                                              this.__handleChangeDropDownCompany("companySubProduct", e)
                                                          }}
                                                          style={{width: 'ui-grid-col-8'}}
                                                          placeholder="Alt Ürün Seçiniz"
                                                          editable={true}
                                                          filter={true}
                                                          filterPlaceholder="Alt Ürün Ara"
                                                          filterBy="label,value"
                                                />
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="startDate">Poliçe Başlangıç Tarihi</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                <Calendar
                                                    id="startDate"
                                                    value={this.state.policy.startDate}
                                                    onChange={(e) => {
                                                        this.__calendarOnChange("startDate", e)
                                                    }}>

                                                </Calendar>
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="endDate">Poliçe Bitiş Tarihi</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                <Calendar
                                                    id="endDate"
                                                    value={this.state.policy.endDate}
                                                    onChange={(e) => {
                                                        this.__calendarOnChange("endDate", e)
                                                    }}>
                                                </Calendar>
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="reminderDate">Poliçe Hatırlatma Tarihi</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                <Calendar
                                                    id="reminderDate"
                                                    value={this.state.policy.reminderDate}
                                                    onChange={(e) => {
                                                        this.__calendarOnChange("reminderDate", e)
                                                    }}
                                                >
                                                </Calendar>
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="userMessage">Poliçe Hatırlatıcı Mesaj</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                <InputTextarea id="userMessage" onChange={(e) => {
                                                    this.__updatePropertyPolicy('userMessage', e.target.value)
                                                }} value={this.state.policy.userMessage}/>
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="policyNumber">Poliçe Numarası</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                <InputText id="policyNumber" onChange={(e) => {
                                                    this.__updatePropertyPolicy('policyNumber', e.target.value)
                                                }} value={this.state.policy.policyNumber}/>
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="policyEmount">Poliçe Tutarı</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                <InputText id="policyEmount" onChange={(e) => {
                                                    this.__updatePropertyPolicy('policyEmount', e.target.value)
                                                }} value={this.state.policy.policyEmount}/>
                                            </div>
                                        </div>

                                        <div className="ui-grid-row">
                                            <div className="ui-grid-col-4" style={{padding: '4px 10px'}}><label
                                                htmlFor="description">Açıklama</label></div>
                                            <div className="ui-grid-col-8" style={{padding: '4px 10px'}}>
                                                <InputTextarea id="description" onChange={(e) => {
                                                    this.__updatePropertyPolicy('description', e.target.value)
                                                }} value={this.state.policy.description}/>
                                            </div>
                                        </div>

                                    </div>
                                }
                            </Modal.Body>
                            <Modal.Footer>
                                {dialogPolicyFooter}
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>
                {this.__renderLoading()}
            </Card>
        );
    }

    __renderLoading() {
        if (this.state.loading) {
            return (
                <div className="text-center">
                    <FaIcon
                        code="fa-spinner fa-spin"
                        size="fa-5x"/>
                </div>);
        }
    }

    __updateProperty(property, value) {
        let customer = this.state.customer;
        customer[property] = value;
        this.setState({customer: customer});
    }

    __updatePropertyPolicy(property, value) {
        let policy = this.state.policy;
        policy[property] = value;
        this.setState({policy: policy});
    }

    // Giridin altındaki yeni müşteri ekle Butonu
    __newCustomerButton() {
        this.newCustomer = true;
        this.setState({
            customer: {
                name: '',
                surname: '',
                tc: '',
                job: '',
                email: '',
                mobilePhone: '',
                address: '',
                status: true,
                description: ''
            },
            displayDialog: true,
            headerDialog: "Yeni Müşteri Kaydet"
        });
    }

    __addPolicyButton() {

        this.__getAllCompany();
        this.setState({
            policy: {
                customer: this.state.selectedCustomer,
                company: {},
                companyProduct: {},
                companySubProduct: {},
                startDate: null,
                endDate: null,
                description: "",
                reminderDate: null,
                userMessage: this.state.selectedCustomer.name + " " + this.state.selectedCustomer.surname + " isimli müşterinin poliçesi bitmek üzere.",
                customerMessage: "",
                policyNumber: "",
                policyEmount: "",
                agencyId: this.state.selectedCustomer.id


            },
            displayDialogPolicy: true,
            headerDialog: "Poliçe Ekle"
        });
    }

    __calendarOnChange(property, e) {
        let value = e.value;
        let policy = this.state.policy;
        policy[property] = value;
        if (property === "endDate") {
            const days = 7; // Days you want to subtract
            const DAY_IN_MS = 1000 * 60 * 60 * 24;
            const reminderDate = new Date(value.getTime() - (days * DAY_IN_MS));
            policy["reminderDate"] = reminderDate;
        } else if (property === "startDate") {
            const days = 365;
            const DAY_IN_MS = 1000 * 60 * 60 * 24;
            const endDate = new Date(value.getTime() + (days * DAY_IN_MS));
            policy["endDate"] = endDate;
            const reminderDate = new Date(endDate.getTime() - (7 * DAY_IN_MS));
            policy["reminderDate"] = reminderDate;
        } else if (property === "reminderDate") {
            policy["reminderDate"] = value;
        }
        this.setState({policy: policy});
    }

    __formatDate(d) {
        let month = String(d.getMonth() + 1);
        let day = String(d.getDate());
        let year = String(d.getFullYear());

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return `${year}-${month}-${day}`;
    }

    __handleChangeDropDownCompany(property, e) {
        let value = e.value;
        let selected = this.state.companyList.find(o => o.value === value);
        let policy = this.state.policy;
        policy[property] = selected;
        switch (property) {
            case "company":
                this.__getAllCompanyProduct(selected);
                break;
            case "companyProduct":
                this.__getAllCompanySubProduct(selected);
                break;
            case "companySubProduct":
                break;
        }
        this.setState({policy: policy});
    }

    __onSelectionChange(date) {
        this.setState({selectedCustomer: date, policyAddButtonDisable: false});
    }


    __detailButton(rowData, column) {
        let a = 4;
        let selectedCustomer = column.rowData;
        this.setState({
            displayDialogDetail: true,
            customer: selectedCustomer,
            headerDialog: "Müşteri Bilgileri Detay"
        })
    }

    __editButton(rowData, column) {
        this.newCustomer = false;
        let selectedCustomer = column.rowData;
        this.setState({
            displayDialog: true,
            customer: selectedCustomer,
            headerDialog: "Müşteri Bilgileri Güncelle"
        });

    }

    __deleteButton(rowData, column) {
        let selectedCustomer = column.rowData
        selectedCustomer.status = false;


    }

    __saveCustomer() {
        // let customerList = [...this.state.customerList];
        let type = "";
        if (this.newCustomer) {
            type = "POST";
        } else {
            type = "PUT";
        }
        this.request = new AjaxRequest({
            url: "customer",
            type: type
        });
        this.request.call(this.state.customer, undefined, function (response) {
            if (response != null) {
                Toast.success("Kayıt Başarılı");
                this.setState({selectedCustomer: null, displayDialog: false});
            } else {
                Toast.error("Kayıt Başarısız")
            }
            this.__getAllCustomer();
            this.forceUpdate();
        }.bind(this));
        // customerList[this.__findSelectedCarIndex()] = this.state.customer;
    }

    __savePolicy() {

        let policy = this.state.policy;
        policy.startDate = this.__formatDate(policy.startDate);

        this.request = new AjaxRequest({
            url: "policy",
            type: "POST"
        });
        this.request.call(policy, undefined, function (response) {
            if (response != null) {
                Toast.success("Kayıt Başarılı");
                this.setState({selectedCustomer: null, displayDialogPolicy: false, policy: null});
            } else {
                Toast.error("Kayıt Başarısız")
            }
            this.forceUpdate();
        }.bind(this));
    }

    __delete() {
        let index = this.__findSelectedCarIndex();
        this.setState({
            customerList: this.state.customerList.filter((val, i) => i !== index),
            selectedCar: null,
            car: null,
            displayDialog: false,
            displayDialogDetail: false
        });
    }

    __findSelectedCarIndex() {
        return this.state.customerList.indexOf(this.state.selectedCustomer);
    }

    __getAllCustomer() {

        let request = new AjaxRequest({
            url: "customer",
            type: "GET"
        });

        request.call(undefined, undefined, function (response) {
            if (response != null) {
                this.setState({customerList: response, loading: false});
            }
            this.forceUpdate();
        }.bind(this));
    }

    __getAllCompany() {
        let request = new AjaxRequest({
            url: "company",
            type: "GET"
        });

        request.call(undefined, undefined, function (response) {
            if (response != null) {
                this.setState({companyList: response, loading: false});
            }
            this.forceUpdate();
        }.bind(this));
    }

    __getAllCompanyProduct(company) {
        let request = new AjaxRequest({
            url: "company/list-company-product",
            type: "POST"
        });
        request.call(company, undefined,
            (response) => {
                this.setState({companyProductList: response});
            });
    }

    __getAllCompanySubProduct(companyProduct) {
        let request = new AjaxRequest({
            url: "company/list-company-sub-product",
            type: "POST"
        });

        request.call(companyProduct, undefined,
            (response) => {
                this.setState({companySubProductList: response});
            });
    }

    componentDidMount() {
        this.__getAllCustomer();
    }

}